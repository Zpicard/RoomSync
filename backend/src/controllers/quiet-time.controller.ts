import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../utils/AppError';

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
    const overlappingQuietTimes = await prisma.quietTime.findMany({
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
      },
      include: {
        user: {
          select: {
            username: true
          }
        }
      }
    });

    if (overlappingQuietTimes.length > 0) {
      const conflict = overlappingQuietTimes[0];
      throw new AppError(
        `There is already a quiet time scheduled during this period (created by ${conflict.user.username})`,
        409
      );
    }

    const quietTime = await prisma.quietTime.create({
      data: {
        title,
        type,
        startTime: startDate,
        endTime: endDate,
        description,
        user: { connect: { id: userId } },
        household: { connect: { id: householdId } }
      },
      include: {
        user: true,
        household: true
      }
    });

    res.status(201).json({
      success: true,
      data: quietTime
    });
  } catch (error) {
    next(error);
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

    const quietTime = await prisma.quietTime.findUnique({
      where: { id: quietTimeId },
      include: { 
        household: { 
          include: { 
            owner: true,
            members: true
          }
        },
        user: true
      }
    });

    if (!quietTime) {
      throw new AppError('Quiet time not found', 404);
    }

    // Check if user is a member of the household
    const isHouseholdMember = quietTime.household.members.some(member => member.id === userId);
    if (!isHouseholdMember) {
      throw new AppError('You must be a member of the household to delete quiet times', 403);
    }

    // Check if user has permission to delete
    const canDelete = 
      quietTime.userId === userId || // Quiet time creator
      quietTime.household.ownerId === userId; // Household owner

    if (!canDelete) {
      throw new AppError('You can only delete quiet times you created or if you are the household owner', 403);
    }

    await prisma.quietTime.delete({
      where: { id: quietTimeId }
    });

    res.json({ 
      success: true,
      message: 'Quiet time deleted successfully' 
    });
  } catch (error) {
    next(error);
  }
}; 