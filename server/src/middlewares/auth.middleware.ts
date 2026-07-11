import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { ApiError } from '../utils/api-error.js';
import { asyncHandler } from '../utils/async-handler.js';
import { User } from '../models/user.model.js';

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  companyId?: string;
}

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return next(new ApiError(401, 'Not authorized to access this route'));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwt.accessSecret) as DecodedToken;

      // Check if user still exists
      const user = await User.findById(decoded.id).select('+isActive');
      
      if (!user) {
        return next(new ApiError(401, 'User belonging to this token no longer exists'));
      }

      if (!user.isActive) {
        return next(new ApiError(403, 'Your account has been deactivated'));
      }

      // Grant access to protected route
      req.user = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        companyId: user.companyId?.toString(),
      };

      return next();
    } catch (error) {
      return next(new ApiError(401, 'Not authorized to access this route'));
    }
  }
);
