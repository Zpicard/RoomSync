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

export const createAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { guestCount, startTime, endTime, description, householdId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    // Check for overlapping announcements
    const overlappingAnnouncements = await prisma.guestAnnouncement.findMany({
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

    if (overlappingAnnouncements.length > 0) {
      throw new AppError('There is already a guest announcement during this time period', 409);
    }

    const announcement = await prisma.guestAnnouncement.create({
      data: {
        guestCount,
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

    res.status(201).json(announcement);
  } catch (error) {
    if (error instanceof AppError) throw error;
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

export const deleteAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { announcementId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    const announcement = await prisma.guestAnnouncement.findUnique({
      where: { id: announcementId },
      include: { household: { include: { owner: true } } }
    });

    if (!announcement) {
      throw new AppError('Announcement not found', 404);
    }

    if (announcement.userId !== userId && announcement.household.ownerId !== userId) {
      throw new AppError('Not authorized to delete this announcement', 403);
    }

    await prisma.guestAnnouncement.delete({
      where: { id: announcementId }
    });

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Error deleting announcement', 500);
  }
}; 