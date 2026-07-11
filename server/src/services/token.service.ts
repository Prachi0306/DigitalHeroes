import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { RefreshToken } from '../models/refresh-token.model.js';
import { ApiError } from '../utils/api-error.js';
import mongoose from 'mongoose';

interface TokenPayload {
  id: string;
  email: string;
  role: string;
  companyId?: string;
}

export class TokenService {
  /**
   * Generate an Access Token (short-lived)
   */
  public static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessExpiry as any,
    });
  }

  /**
   * Generate a Refresh Token (long-lived), persist in DB, and return it
   */
  public static async generateRefreshToken(
    userId: mongoose.Types.ObjectId
  ): Promise<string> {
    const expiresAt = new Date();
    // parse refresh expiry (e.g. "7d" -> 7 days)
    const days = parseInt(config.jwt.refreshExpiry, 10) || 7;
    expiresAt.setDate(expiresAt.getDate() + days);

    const tokenString = jwt.sign({ id: userId.toString() }, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiry as any,
    });

    // Save token to DB
    await RefreshToken.create({
      token: tokenString,
      userId,
      expiresAt,
    });

    return tokenString;
  }

  /**
   * Verify and return the payload of an Access Token
   */
  public static verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, config.jwt.accessSecret) as TokenPayload;
    } catch (error) {
      throw new ApiError(401, 'Invalid or expired access token');
    }
  }

  /**
   * Verify a Refresh Token, return active RefreshToken document
   */
  public static async verifyRefreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, config.jwt.refreshSecret) as { id: string };
      
      const storedToken = await RefreshToken.findOne({
        token,
        userId: decoded.id,
        isRevoked: false,
      });

      if (!storedToken) {
        throw new ApiError(401, 'Refresh token not found or revoked');
      }

      if (new Date() > storedToken.expiresAt) {
        throw new ApiError(401, 'Refresh token expired');
      }

      return storedToken;
    } catch (error) {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }
  }

  /**
   * Revoke a specific Refresh Token
   */
  public static async revokeRefreshToken(token: string): Promise<void> {
    await RefreshToken.updateOne({ token }, { isRevoked: true });
  }

  /**
   * Revoke all Refresh Tokens for a specific user
   */
  public static async revokeAllUserTokens(userId: mongoose.Types.ObjectId): Promise<void> {
    await RefreshToken.updateMany({ userId }, { isRevoked: true });
  }
}
