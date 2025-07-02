import { NextFunction, Request, Response } from 'express';
import { loginSchema } from '../validation';
import prisma from '../lib/prisma';
import ApiError from '../utils/error';
import { compareSync } from 'bcryptjs';
import { generateToken } from '../utils/jwt';

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: {
        username: username.toString(),
      },
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    const match = compareSync(password, user.password);

    if (!match) {
      throw new ApiError('Invalid Password', 400);
    }

    const token = generateToken(user.id, user.role);

    res.status(200).json({
      success: true,
      message: 'User login successfully',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const checkUser = async (req: Request, res: Response) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    message: 'Authenticated successfully',
    data: { user },
  });
};
