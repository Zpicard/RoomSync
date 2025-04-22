import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export class AppError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError | Prisma.PrismaClientKnownRequestError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error occurred:', err);

  // Handle AppError instances
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        return res.status(409).json({
          error: 'A record with this data already exists'
        });
      case 'P2025':
        return res.status(404).json({
          error: 'Record not found'
        });
      case 'P2003':
        return res.status(400).json({
          error: 'Invalid relationship data provided'
        });
      default:
        return res.status(500).json({
          error: 'Database operation failed'
        });
    }
  }

  // Handle validation errors
  if (err instanceof SyntaxError) {
    return res.status(400).json({
      error: 'Invalid request data'
    });
  }

  // Handle all other errors
  return res.status(500).json({
    error: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Internal server error'
  });
}; 