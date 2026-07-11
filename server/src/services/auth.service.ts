import { User, UserRole } from '../models/user.model.js';
import { Company } from '../models/company.model.js';
import { TokenService } from './token.service.js';
import { ApiError } from '../utils/api-error.js';
import crypto from 'crypto';
import { logger } from '../utils/logger.js';

interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  companyName: string;
  domain: string;
  industry?: string;
  website?: string;
}

export class AuthService {
  /**
   * Register a new company and its super admin user
   */
  public static async register(input: RegisterInput) {
    // Check if user already exists
    const existingUser = await User.findOne({ email: input.email.toLowerCase() });
    if (existingUser) {
      throw new ApiError(400, 'User with this email already exists');
    }

    // Check if company domain already exists
    const existingCompany = await Company.findOne({ domain: input.domain.toLowerCase() });
    if (existingCompany) {
      throw new ApiError(400, 'Company domain is already registered');
    }

    // Create Company
    const company = await Company.create({
      name: input.companyName,
      domain: input.domain.toLowerCase(),
      industry: input.industry,
      website: input.website,
    });

    // Create User
    const user = await User.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email.toLowerCase(),
      passwordHash: input.passwordHash, // Mongoose pre-save hook handles hashing
      role: UserRole.SUPER_ADMIN,
      companyId: company._id,
      isEmailVerified: false,
    });

    // Generate tokens
    const accessToken = TokenService.generateAccessToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      companyId: company._id.toString(),
    });

    const refreshToken = await TokenService.generateRefreshToken(user._id);

    return { user, company, accessToken, refreshToken };
  }

  /**
   * Log in an existing user
   */
  public static async login(email: string, passwordHash: string) {
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+passwordHash +isActive')
      .populate('companyId');

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Your account has been deactivated');
    }

    const isMatch = await user.comparePassword(passwordHash);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Generate tokens
    const accessToken = TokenService.generateAccessToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      companyId: user.companyId?._id?.toString(),
    });

    const refreshToken = await TokenService.generateRefreshToken(user._id);

    return { user, accessToken, refreshToken };
  }

  /**
   * Log out user by revoking refresh token
   */
  public static async logout(refreshToken: string): Promise<void> {
    await TokenService.revokeRefreshToken(refreshToken);
  }

  /**
   * Refresh access token using active refresh token
   */
  public static async refresh(refreshToken: string) {
    const storedToken = await TokenService.verifyRefreshToken(refreshToken);
    
    // Revoke old token
    await TokenService.revokeRefreshToken(refreshToken);

    const user = await User.findById(storedToken.userId);
    if (!user || !user.isActive) {
      throw new ApiError(401, 'User no longer exists or is deactivated');
    }

    // Generate new token pair (refresh token rotation)
    const newAccessToken = TokenService.generateAccessToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      companyId: user.companyId?.toString(),
    });

    const newRefreshToken = await TokenService.generateRefreshToken(user._id);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  /**
   * Initiates password recovery
   */
  public static async forgotPassword(email: string): Promise<string> {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new ApiError(404, 'User with this email does not exist');
    }

    // Create password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expiration to 1 hour
    user.passwordResetExpire = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    // Log the token so we can retrieve it for development / testing without a real mailer
    logger.info(`[AuthService] Password recovery token created for ${email}: ${resetToken}`);
    
    return resetToken;
  }

  /**
   * Resets password using token
   */
  public static async resetPassword(resetToken: string, passwordHash: string): Promise<void> {
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpire: { $gt: new Date() },
    });

    if (!user) {
      throw new ApiError(400, 'Invalid or expired password reset token');
    }

    user.passwordHash = passwordHash; // Mongoose pre-save handles hashing
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save();

    // Revoke all existing sessions for safety after password reset
    await TokenService.revokeAllUserTokens(user._id);
  }
}
