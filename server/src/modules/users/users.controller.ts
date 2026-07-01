import { Response } from 'express';
import usersService from './users.service';
import { asyncHandler } from '@/middlewares/errorHandler';
import { AuthRequest } from '@/middlewares/auth';
import { UpdateUserProfile, UpdateUserSettings } from '@budgetwise/shared';

class UsersController {
  getProfile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const user = await usersService.getUserById(userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  });

  getFullProfile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const [user, profile] = await Promise.all([
      usersService.getUserById(userId),
      usersService.getUserProfile(userId),
    ]);

    res.status(200).json({
      success: true,
      data: {
        ...user,
        profile,
      },
    });
  });

  updateProfile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const data: UpdateUserProfile = req.body;

    const user = await usersService.updateUserProfile(userId, data);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  });

  uploadAvatar = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
      return;
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const user = await usersService.updateUserAvatar(userId, avatarUrl);

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: user,
    });
  });

  getSettings = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const settings = await usersService.getUserSettings(userId);

    res.status(200).json({
      success: true,
      data: settings,
    });
  });

  updateSettings = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const data: UpdateUserSettings = req.body;

    const settings = await usersService.updateUserSettings(userId, data);

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: settings,
    });
  });

  deleteAccount = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    await usersService.deleteUser(userId);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  });

  getStats = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const stats = await usersService.getUserStats(userId);

    res.status(200).json({
      success: true,
      data: stats,
    });
  });
}

export default new UsersController();
