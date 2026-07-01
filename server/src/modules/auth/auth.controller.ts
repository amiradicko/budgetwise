import { Request, Response } from 'express';
import authService from './auth.service';
import usersService from '@/modules/users/users.service';
import { asyncHandler } from '@/middlewares/errorHandler';
import { AuthRequest } from '@/middlewares/auth';
import {
  LoginCredentials,
  RegisterData,
  RefreshTokenRequest,
  PasswordResetRequest,
  PasswordResetConfirm,
  ChangePasswordRequest,
  VerifyEmailRequest,
} from '@budgetwise/shared';

class AuthController {
  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data: RegisterData = req.body;
    const result = await authService.register(data);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  });

  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const credentials: LoginCredentials = req.body;
    const result = await authService.login(credentials);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  });

  refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { refreshToken }: RefreshTokenRequest = req.body;
    const tokens = await authService.refreshToken(refreshToken);

    res.status(200).json({
      success: true,
      message: 'Tokens refreshed successfully',
      data: tokens,
    });
  });

  logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { refreshToken }: RefreshTokenRequest = req.body;
    await authService.logout(refreshToken);

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  });

  verifyEmail = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { token }: VerifyEmailRequest = req.body;
    await authService.verifyEmail(token);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });
  });

  requestPasswordReset = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email }: PasswordResetRequest = req.body;
    await authService.requestPasswordReset(email);

    res.status(200).json({
      success: true,
      message: 'Password reset email sent',
    });
  });

  resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { token, newPassword }: PasswordResetConfirm = req.body;
    await authService.resetPassword(token, newPassword);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  });

  changePassword = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { currentPassword, newPassword }: ChangePasswordRequest = req.body;
    const userId = req.user!.userId;

    await authService.changePassword(userId, currentPassword, newPassword);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  });

  getProfile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;

    // Get user profile from database
    const user = await usersService.getUserById(userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  });
}

export default new AuthController();
