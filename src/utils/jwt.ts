import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { JWT_SECRET } from './env';

export const generateToken = (id: string, role: UserRole) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
