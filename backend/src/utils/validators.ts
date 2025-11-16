import mongoose from 'mongoose';
import { AppError } from '../middleware/errorHandler';

/**
 * Validate MongoDB ObjectId
 */
export function validateObjectId(id: string, fieldName: string = 'ID'): void {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(`Invalid ${fieldName}`, 400);
  }
}

/**
 * Wrap async controller functions to catch errors gracefully
 */
export function asyncHandler(fn: Function) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      console.error(`Controller error in ${fn.name}:`, error);
      next(error);
    });
  };
}
