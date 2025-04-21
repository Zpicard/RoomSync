import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

const prisma = new PrismaClient();

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        avatarUrl: true,
        household: {
          include: {
            owner: true,
            members: {
              select: {
                id: true,
                username: true,
                avatarUrl: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json(user);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Error fetching profile', 500);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { username, bio } = req.body;

    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    // Check if username is already taken
    if (username) {
      const existingUser = await prisma.user.findUnique({
        where: { username }
      });

      if (existingUser && existingUser.id !== userId) {
        throw new AppError('Username already taken', 400);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        bio
      },
      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        avatarUrl: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Error updating profile', 500);
  }
};

export const updateAvatar = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { avatarUrl } = req.body;

    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    if (!avatarUrl || typeof avatarUrl !== 'string') {
      throw new AppError('Avatar URL is required', 400);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        avatarUrl: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Error updating avatar', 500);
  }
}; 