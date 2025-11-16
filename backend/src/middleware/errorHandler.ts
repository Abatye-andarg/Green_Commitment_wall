import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export interface ApiError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

/**
 * Error handling middleware
 */
export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('❌ Error:', {
    message: err.message,
    name: err.name,
    statusCode: err.statusCode,
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err instanceof mongoose.Error.CastError) {
    const message = 'Invalid ID format';
    error = new AppError(message, 400);
  }

  // Mongoose duplicate key
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue || {})[0];
    const message = `${field} already exists`;
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError' && err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e: any) => e.message);
    const message = errors.join(', ');
    error = new AppError(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token', 401);
  }
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expired', 401);
  }

  const statusCode = error.statusCode || (err as any).statusCode || 500;
  const status = error.status || err.status || 'error';

  res.status(statusCode).json({
    status,
    message: error.message || err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * 404 handler for undefined routes
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
  });
};

/**
 * Helper to create operational errors
 */
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
