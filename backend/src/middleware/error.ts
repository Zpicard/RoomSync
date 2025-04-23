import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ValidationError } from 'express-validator';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  
  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

type ErrorWithMessage = {
  message: string;
  stack?: string;
  name?: string;
};

export const errorHandler = (
  err: Error | AppError | Prisma.PrismaClientKnownRequestError | ValidationError[],
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = err as ErrorWithMessage;
  
  console.error('Error occurred:', {
    message: error.message || 'Unknown error',
    stack: error.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params
  });

  // Handle validation errors from express-validator
  if (Array.isArray(err) && err.length > 0 && 'msg' in err[0]) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.map(e => ({ field: (e as any).param, message: e.msg }))
    });
  }

  // Handle AppError instances
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        return res.status(409).json({
          error: 'A record with this data already exists',
          field: err.meta?.target
        });
      case 'P2025':
        return res.status(404).json({
          error: 'Record not found'
        });
      case 'P2003':
        return res.status(400).json({
          error: 'Invalid relationship data provided'
        });
      case 'P2014':
        return res.status(400).json({
          error: 'Invalid ID provided'
        });
      case 'P2021':
        return res.status(400).json({
          error: 'Table does not exist'
        });
      default:
        return res.status(500).json({
          error: 'Database operation failed',
          ...(process.env.NODE_ENV === 'development' && { code: err.code })
        });
    }
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired'
    });
  }

  // Handle validation errors
  if (err instanceof SyntaxError) {
    return res.status(400).json({
      error: 'Invalid request data',
      details: err.message
    });
  }

  // Handle all other errors
  const statusCode = err instanceof Error && 'statusCode' in err ? (err as any).statusCode : 500;
  return res.status(statusCode).json({
    error: process.env.NODE_ENV === 'development' 
      ? error.message || 'Unknown error'
      : 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
}; 