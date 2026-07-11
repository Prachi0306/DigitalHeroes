import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error.js';

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, 'Not authorized to access this route'));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `User role ${req.user.role} is not authorized to access this route`
        )
      );
    }
    
    next();
  };
};
