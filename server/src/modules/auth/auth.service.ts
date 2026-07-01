import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import config from '@/config';
import prisma from '@/config/database';
import { AppError } from '@/middlewares/errorHandler';
import logger from '@/utils/logger';
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  AuthTokens,
  JWTPayload,
} from '@budgetwise/shared';

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, config.security.bcryptRounds);

    // Create user with profile and settings
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        currency: data.currency || 'EUR',
        language: data.language || 'fr',
        profile: {
          create: {},
        },
        settings: {
          create: {},
        },
      },
      include: {
        profile: true,
        settings: true,
      },
    });

    // Generate verification token
    const verificationToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours

    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        token: verificationToken,
        expiresAt,
      },
    });

    // TODO: Send verification email
    logger.info(`Verification token for ${user.email}: ${verificationToken}`);

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar || undefined,
        currency: user.currency,
        language: user.language,
        theme: user.theme,
      },
      tokens,
    };
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    // Mettre à jour le streak (asynchrone, ne pas attendre)
    try {
      const achievementsService = (await import('../achievements/achievements.service')).default;
      achievementsService.updateStreak(user.id).catch(err => {
        console.error('Failed to update streak:', err);
      });
    } catch (error) {
      // Ignorer les erreurs de streak pour ne pas bloquer le login
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar || undefined,
        currency: user.currency,
        language: user.language,
        theme: user.theme,
      },
      tokens,
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as JWTPayload;

      if (decoded.type !== 'refresh') {
        throw new AppError('Invalid token type', 401);
      }

      // Check if refresh token exists and is valid
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new AppError('Invalid or expired refresh token', 401);
      }

      // Delete old refresh token
      await prisma.refreshToken.delete({
        where: { token: refreshToken },
      });

      // Generate new tokens
      return await this.generateTokens(decoded.userId, decoded.email);
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Invalid refresh token', 401);
      }
      throw error;
    }
  }

  async logout(refreshToken: string): Promise<void> {
    // Delete refresh token
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  async verifyEmail(token: string): Promise<void> {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken || verificationToken.expiresAt < new Date()) {
      throw new AppError('Invalid or expired verification token', 400);
    }

    await prisma.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: true },
    });

    await prisma.verificationToken.delete({
      where: { token },
    });
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists
      return;
    }

    // Delete old reset tokens
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Generate reset token
    const resetToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt,
      },
    });

    // TODO: Send password reset email
    logger.info(`Password reset token for ${email}: ${resetToken}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, config.security.bcryptRounds);

    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({
      where: { token },
    });

    // Delete all refresh tokens for security
    await prisma.refreshToken.deleteMany({
      where: { userId: resetToken.userId },
    });
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new AppError('Current password is incorrect', 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, config.security.bcryptRounds);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Delete all refresh tokens for security
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  private async generateTokens(userId: string, email: string): Promise<AuthTokens> {
    // Generate access token
    const accessPayload = { userId, email, type: 'access' } as JWTPayload;
    const accessToken = jwt.sign(
      accessPayload,
      config.jwt.secret as string,
      { expiresIn: config.jwt.expiresIn } as jwt.SignOptions
    );

    // Generate refresh token
    const refreshPayload = { userId, email, type: 'refresh' } as JWTPayload;
    const refreshToken = jwt.sign(
      refreshPayload,
      config.jwt.refreshSecret as string,
      { expiresIn: config.jwt.refreshExpiresIn } as jwt.SignOptions
    );

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.refreshToken.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}

export default new AuthService();
