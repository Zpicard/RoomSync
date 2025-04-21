import { Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client';

interface AuthRequest extends Request {
  user?: User;
}

const prisma = new PrismaClient();

export const updateAvatar = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { avatarUrl } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (typeof avatarUrl !== 'string') {
      return res.status(400).json({ message: 'Avatar URL must be a string' });
    }

    // Update user's avatar URL
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl }
    });

    res.json({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      avatarUrl: updatedUser.avatarUrl,
      householdId: updatedUser.householdId
    });
  } catch (error) {
    console.error('Error updating avatar:', error);
    res.status(500).json({ message: 'Error updating avatar. Please try again.' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      householdId: user.householdId
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile. Please try again.' });
  }
}; 