import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

const prisma = new PrismaClient();

export const createAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { guestCount, startTime, endTime, description, householdId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    // Validate required fields
    if (!guestCount || !startTime || !endTime || !householdId) {
      throw new AppError('Missing required fields: guestCount, startTime, endTime, and householdId are required', 400);
    }

    // Validate guest count
    if (guestCount < 1) {
      throw new AppError('Guest count must be at least 1', 400);
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

    // Check for overlapping announcements
    const overlappingAnnouncements = await prisma.guestAnnouncement.findMany({
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

    if (overlappingAnnouncements.length > 0) {
      const conflictingEvent = overlappingAnnouncements[0];
      throw new AppError(
        `There is already a guest event during this time period (hosted by ${conflictingEvent.user.username})`,
        409
      );
    }

    const announcement = await prisma.guestAnnouncement.create({
      data: {
        guestCount,
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

    res.status(201).json(announcement);
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Error creating guest announcement:', error);
    throw new AppError('Error creating announcement', 500);
  }
};

export const getHouseholdAnnouncements = async (req: AuthRequest, res: Response) => {
  try {
    const { householdId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    const announcements = await prisma.guestAnnouncement.findMany({
      where: { 
        householdId,
        endTime: {
          gte: new Date()
        }
      },
      include: {
        user: true
      },
      orderBy: {
        startTime: 'asc'
      }
    });

    res.json(announcements);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Error fetching announcements', 500);
  }
};

export const updateAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { announcementId } = req.params;
    const { guestCount, startTime, endTime, description } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    const announcement = await prisma.guestAnnouncement.findUnique({
      where: { id: announcementId }
    });

    if (!announcement) {
      throw new AppError('Announcement not found', 404);
    }

    if (announcement.userId !== userId) {
      throw new AppError('Not authorized to update this announcement', 403);
    }

    const updatedAnnouncement = await prisma.guestAnnouncement.update({
      where: { id: announcementId },
      data: {
        guestCount,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        description
      },
      include: {
        user: true,
        household: true
      }
    });

    res.json(updatedAnnouncement);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Error updating announcement', 500);
  }
};

export const deleteAnnouncement = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { announcementId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    if (!announcementId) {
      throw new AppError('Announcement ID is required', 400);
    }

    const announcement = await prisma.guestAnnouncement.findUnique({
      where: { id: announcementId },
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

    if (!announcement) {
      throw new AppError('Announcement not found', 404);
    }

    // Check if user is a member of the household
    const isHouseholdMember = announcement.household.members.some(member => member.id === userId);
    if (!isHouseholdMember) {
      throw new AppError('You must be a member of the household to delete announcements', 403);
    }

    // Check if user has permission to delete
    const canDelete = 
      announcement.userId === userId || // Announcement creator
      announcement.household.ownerId === userId; // Household owner

    if (!canDelete) {
      throw new AppError('You can only delete announcements you created or if you are the household owner', 403);
    }

    await prisma.guestAnnouncement.delete({
      where: { id: announcementId }
    });

    res.json({ 
      success: true,
      message: 'Announcement deleted successfully' 
    });
  } catch (error) {
    next(error);
  }
}; 