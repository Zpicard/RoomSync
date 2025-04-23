import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/error';

const prisma = new PrismaClient();

export const createQuietTime = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, type, startTime, endTime, description, householdId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    // Validate required fields
    if (!title || !type || !startTime || !endTime || !householdId) {
      throw new AppError('Missing required fields: title, type, startTime, endTime, and householdId are required', 400);
    }

    // Validate type
    const validTypes = ['exam', 'study', 'quiet'];
    if (!validTypes.includes(type)) {
      throw new AppError('Invalid quiet time type. Must be one of: exam, study, quiet', 400);
    }

    // Validate dates
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const now = new Date();

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new AppError('Invalid date format for startTime or endTime', 400);
    }

    if (startDate < now) {
      throw new AppError('Start time cannot be in the past', 400);
    }

    if (endDate <= startDate) {
      throw new AppError('End time must be after start time', 400);
    }

    // Verify user is part of the household
    const household = await prisma.household.findFirst({
      where: {
        id: householdId,
        OR: [
          { members: { some: { id: userId } } },
          { ownerId: userId }
        ]
      }
    });

    if (!household) {
      throw new AppError('You are not a member of this household', 403);
    }

    // Check for overlapping quiet times
    const overlappingQuietTime = await prisma.quietTime.findFirst({
      where: {
        householdId,
        OR: [
          {
            AND: [
              { startTime: { lte: startDate } },
              { endTime: { gt: startDate } }
            ]
          },
          {
            AND: [
              { startTime: { lt: endDate } },
              { endTime: { gte: endDate } }
            ]
          }
        ]
      }
    });

    if (overlappingQuietTime) {
      throw new AppError('This time period overlaps with an existing quiet time', 400);
    }

    const quietTime = await prisma.quietTime.create({
      data: {
        title,
        type,
        startTime: startDate,
        endTime: endDate,
        description,
        householdId,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true
          }
        }
      }
    });

    res.status(201).json(quietTime);
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else if (error instanceof Error) {
      next(new AppError(error.message, 500));
    } else {
      next(new AppError('An unexpected error occurred while creating quiet time', 500));
    }
  }
};

export const getQuietTimes = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { householdId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    if (!householdId) {
      throw new AppError('Household ID is required', 400);
    }

    // Verify user is part of the household
    const household = await prisma.household.findFirst({
      where: {
        id: householdId,
        OR: [
          { members: { some: { id: userId } } },
          { ownerId: userId }
        ]
      }
    });

    if (!household) {
      throw new AppError('You are not a member of this household', 403);
    }

    const quietTimes = await prisma.quietTime.findMany({
      where: { householdId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true
          }
        }
      },
      orderBy: { startTime: 'asc' }
    });

    res.json(quietTimes);
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else if (error instanceof Error) {
      next(new AppError(error.message, 500));
    } else {
      next(new AppError('An unexpected error occurred while fetching quiet times', 500));
    }
  }
};

export const deleteQuietTime = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { quietTimeId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    if (!quietTimeId) {
      throw new AppError('Quiet time ID is required', 400);
    }

    // Get the quiet time and verify user has permission to delete it
    const quietTime = await prisma.quietTime.findUnique({
      where: { id: quietTimeId },
      include: { 
        household: {
          include: {
            members: true
          }
        }
      }
    });

    if (!quietTime) {
      throw new AppError('Quiet time not found', 404);
    }

    // Verify user is part of the household
    const isMember = quietTime.household.members.some(member => member.id === userId) ||
                    quietTime.household.ownerId === userId;

    if (!isMember) {
      throw new AppError('You are not a member of this household', 403);
    }

    await prisma.quietTime.delete({
      where: { id: quietTimeId }
    });

    res.json({ message: 'Quiet time deleted successfully' });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else if (error instanceof Error) {
      next(new AppError(error.message, 500));
    } else {
      next(new AppError('An unexpected error occurred while deleting quiet time', 500));
    }
  }
}; 