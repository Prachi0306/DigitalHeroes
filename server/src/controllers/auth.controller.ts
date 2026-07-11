import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/api-response.js';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import { User } from '../models/user.model.js';

// Helper to set httpOnly refresh token cookie
const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// Helper to set accessToken cookie for Next.js middleware (optional/supplementary check)
const setAccessTokenCookie = (res: Response, token: string) => {
  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000, // 15 mins
  });
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, companyName, domain, industry, website } = req.body;

  const result = await AuthService.register({
    firstName,
    lastName,
    email,
    passwordHash: password, // Named passwordHash in inputs but will be hashed by pre-save
    companyName,
    domain,
    industry,
    website,
  });

  setRefreshTokenCookie(res, result.refreshToken);
  setAccessTokenCookie(res, result.accessToken);

  res.status(201).json(
    new ApiResponse(
      201,
      {
        user: {
          id: result.user._id,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
          role: result.user.role,
          companyId: result.user.companyId,
        },
        accessToken: result.accessToken,
      },
      'User registered successfully'
    )
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await AuthService.login(email, password);

  setRefreshTokenCookie(res, result.refreshToken);
  setAccessTokenCookie(res, result.accessToken);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: result.user._id,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
          role: result.user.role,
          companyId: result.user.companyId?._id || result.user.companyId,
        },
        accessToken: result.accessToken,
      },
      'Logged in successfully'
    )
  );
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (refreshToken) {
    await AuthService.logout(refreshToken);
  }

  res.clearCookie('refreshToken');
  res.clearCookie('accessToken');

  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, 'Refresh token is required');
  }

  const result = await AuthService.refresh(refreshToken);

  setRefreshTokenCookie(res, result.refreshToken);
  setAccessTokenCookie(res, result.accessToken);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        accessToken: result.accessToken,
      },
      'Tokens refreshed successfully'
    )
  );
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  await AuthService.forgotPassword(email);
  res.status(200).json(new ApiResponse(200, null, 'Password recovery email sent successfully'));
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  await AuthService.resetPassword(token, password);
  res.status(200).json(new ApiResponse(200, null, 'Password reset successfully'));
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Not authenticated');
  }

  const user = await User.findById(req.user.id).populate('companyId');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          companyId: user.companyId?._id || user.companyId,
          avatarUrl: user.avatarUrl,
        },
        accessToken: req.cookies.accessToken || '', // Return token if stored in cookie
      },
      'Current user profile fetched successfully'
    )
  );
});
