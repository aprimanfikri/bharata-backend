import { User, UserRole } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    id: string;
    role: UserRole;
  }
}
