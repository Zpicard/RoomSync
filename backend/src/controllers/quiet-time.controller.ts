import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

export const createQuietTime = async (req: AuthRequest, res: Response) => {
  try {
    const { title, type, startTime, endTime, description, householdId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    // Check for overlapping quiet times
    const overlappingQuietTimes = await prisma.quietTime.findMany({
      where: {
        householdId,
        OR: [
          {
            AND: [
              { startTime: { lte: new Date(startTime) } },
              { endTime: { gt: new Date(startTime) } }
            ]
          },
          {
            AND: [
              { startTime: { lt: new Date(endTime) } },
              { endTime: { gte: new Date(endTime) } }
            ]
          }
        ]
      }
    });

    if (overlappingQuietTimes.length > 0) {
      throw new AppError('There is already a quiet time scheduled during this period', 409);
    }

    const quietTime = await prisma.quietTime.create({
      data: {
        title,
        type,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        description,
        user: { connect: { id: userId } },
        household: { connect: { id: householdId } }
      },
      include: {
        user: true,
        household: true
      }
    });

    res.status(201).json(quietTime);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Error creating quiet time', 500);
  }
}; 