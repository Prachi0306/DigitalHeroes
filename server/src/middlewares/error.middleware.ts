import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ApiError } from '../utils/api-error.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/index.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? 400 : 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, [], err.stack);
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors,
    ...(config.nodeEnv === 'development' && { stack: error.stack }),
  };

  logger.error(
    `[${req.method}] ${req.originalUrl} - Status: ${error.statusCode} - Message: ${error.message}`
  );

  res.status(error.statusCode).json(response);
};
