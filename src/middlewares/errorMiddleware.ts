import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error('Erro inesperado:', err);

  return res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor',
  });
}