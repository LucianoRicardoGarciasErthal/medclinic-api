import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { UserRole } from '../entities/User';

export function roleMiddleware(...allowed: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Usuario nao autenticado', 401);
    }

    if (!allowed.includes(req.user.role)) {
      throw new AppError('Acesso negado', 403);
    }

    next();
  };
}