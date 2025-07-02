import { NextFunction, Request, Response } from 'express';
import ApiError from '../utils/error';
import { JwtPayload } from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { User } from '@prisma/client';
import { verifyToken } from '../utils/jwt';

declare module 'express' {
  interface Request {
    user?: Omit<User, 'password'>;
  }
}

const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return next(new ApiError('Authorization token is required', 401));
    }

    if (!token.startsWith('Bearer ')) {
      return next(new ApiError('Invalid token format', 401));
    }

    const tokenValue = token.split('Bearer ')[1];
    const payload = verifyToken(tokenValue) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return next(new ApiError('Invalid user', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
