import { Request, Response, NextFunction } from 'express';
import { PrismaClient, User, Household } from '@prisma/client';
import { AppError } from '../middleware/error';
import crypto from 'crypto';

interface AuthRequest extends Request {
  user?: User & {
    household?: Household | null;
  };
}

const prisma = new PrismaClient();

// Generate a random 6-character code
const generateHouseholdCode = () => {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
};

export const createHousehold = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, isPrivate } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    if (!name) {
      throw new AppError('Household name is required', 400);
    }

    // Check if user already has a household
    const existingHousehold = await prisma.household.findFirst({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { id: userId } } }
        ]
      }
    });

    if (existingHousehold) {
      throw new AppError('User is already part of a household', 400);
    }

    // Generate unique code
    const code = crypto.randomBytes(3).toString('hex').toUpperCase();

    const household = await prisma.household.create({
      data: {
        name,
        code,
        isPrivate: isPrivate || false,
        ownerId: userId,
        members: {
          connect: { id: userId }
        }
      },
      include: {
        members: {
          select: {
            id: true,
            username: true,
            email: true,
            avatarUrl: true
          }
        }
      }
    });

    res.status(201).json(household);
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else if (error instanceof Error) {
      next(new AppError(error.message, 500));
    } else {
      next(new AppError('An unexpected error occurred while creating household', 500));
    }
  }
};

export const inviteMember = async (req: AuthRequest, res: Response) => {
  try {
    const { householdId } = req.params;
    const { email } = req.body;
    const fromId = req.user?.id;

    if (!fromId) {
      throw new AppError('Authentication required', 401);
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      throw new AppError('Invalid email format', 400);
    }

    const invitedUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!invitedUser) {
      throw new AppError('User not found. Please make sure they have registered for the app.', 404);
    }

    // Check if user is already a member of a household
    if (invitedUser.householdId) {
      throw new AppError('User is already a member of another household', 400);
    }

    // Check if there's already a pending invite
    const existingInvite = await prisma.householdInvite.findFirst({
      where: {
        toId: invitedUser.id,
        householdId,
        status: 'PENDING'
      }
    });

    if (existingInvite) {
      throw new AppError('User already has a pending invitation to this household', 400);
    }

    const invite = await prisma.householdInvite.create({
      data: {
        from: { connect: { id: fromId } },
        to: { connect: { id: invitedUser.id } },
        household: { connect: { id: householdId } }
      },
      include: {
        from: true,
        to: true,
        household: true
      }
    });

    res.status(201).json(invite);
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Error in inviteMember:', error);
    throw new AppError('Error sending invite', 500);
  }
};

export const respondToInvite = async (req: AuthRequest, res: Response) => {
  try {
    const { inviteId } = req.params;
    const { accept } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    const invite = await prisma.householdInvite.findUnique({
      where: { id: inviteId },
      include: { household: true }
    });

    if (!invite || invite.toId !== userId) {
      throw new AppError('Invalid invite', 404);
    }

    if (accept) {
      await prisma.$transaction([
        prisma.householdInvite.update({
          where: { id: inviteId },
          data: { status: 'ACCEPTED' }
        }),
        prisma.user.update({
          where: { id: userId },
          data: {
            household: { connect: { id: invite.householdId } }
          }
        })
      ]);
    } else {
      await prisma.householdInvite.update({
        where: { id: inviteId },
        data: { status: 'REJECTED' }
      });
    }

    res.json({ message: accept ? 'Invite accepted' : 'Invite rejected' });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Error responding to invite', 500);
  }
};

export const leaveHousehold = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { householdId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    if (!householdId) {
      throw new AppError('Household ID is required', 400);
    }

    const household = await prisma.household.findUnique({
      where: { id: householdId },
      include: { members: true }
    });

    if (!household) {
      throw new AppError('Household not found', 404);
    }

    // Check if user is the owner
    if (household.ownerId === userId) {
      throw new AppError('Household owner cannot leave the household', 400);
    }

    // Check if user is a member
    const isMember = household.members.some(member => member.id === userId);
    if (!isMember) {
      throw new AppError('You are not a member of this household', 403);
    }

    // Remove user from household
    await prisma.household.update({
      where: { id: householdId },
      data: {
        members: {
          disconnect: { id: userId }
        }
      }
    });

    res.json({ message: 'Successfully left the household' });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else if (error instanceof Error) {
      next(new AppError(error.message, 500));
    } else {
      next(new AppError('An unexpected error occurred while leaving household', 500));
    }
  }
};

export const getHouseholdDetails = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { householdId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    if (!householdId) {
      throw new AppError('Household ID is required', 400);
    }

    const household = await prisma.household.findUnique({
      where: { id: householdId },
      select: {
        id: true,
        name: true,
        code: true,
        isPrivate: true,
        ownerId: true,
        members: {
          select: {
            id: true,
            username: true,
            email: true,
            avatarUrl: true
          }
        }
      }
    });

    if (!household) {
      throw new AppError('Household not found', 404);
    }

    // Check if user is a member of the household
    const isMember = household.members.some(member => member.id === userId);
    if (!isMember) {
      throw new AppError('You are not a member of this household', 403);
    }

    res.json(household);
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else if (error instanceof Error) {
      next(new AppError(error.message, 500));
    } else {
      next(new AppError('An unexpected error occurred while fetching household details', 500));
    }
  }
};

export const transferOwnership = async (req: AuthRequest, res: Response) => {
  try {
    const { householdId } = req.params;
    const { newOwnerId } = req.body;
    const currentOwnerId = req.user?.id;

    if (!currentOwnerId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!householdId || !newOwnerId) {
      return res.status(400).json({ error: 'Household ID and new owner ID are required' });
    }

    // Get the household to check if user is the owner
    const household = await prisma.household.findUnique({
      where: { id: householdId },
      include: { members: true }
    });

    if (!household) {
      return res.status(404).json({ error: 'Household not found' });
    }

    // Check if current user is the owner
    if (household.ownerId !== currentOwnerId) {
      return res.status(403).json({ error: 'Only the owner can transfer ownership' });
    }

    // Check if new owner is a member of the household
    const isMember = household.members.some(member => member.id === newOwnerId);
    if (!isMember) {
      return res.status(400).json({ error: 'New owner must be a member of the household' });
    }

    // Check if trying to transfer to self
    if (newOwnerId === currentOwnerId) {
      return res.status(400).json({ error: 'Cannot transfer ownership to yourself' });
    }

    try {
      // Transfer ownership
      await prisma.household.update({
        where: { id: householdId },
        data: { ownerId: newOwnerId }
      });

      res.json({ message: 'Ownership transferred successfully' });
    } catch (error) {
      console.error('Error transferring ownership:', error);
      return res.status(500).json({ error: 'Failed to transfer ownership. Please try again.' });
    }
  } catch (error) {
    console.error('Error in transfer ownership:', error);
    res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
  }
};

export const disbandHousehold = async (req: AuthRequest, res: Response) => {
  try {
    const { householdId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!householdId) {
      return res.status(400).json({ error: 'Household ID is required' });
    }

    // Get the household to check if user is the owner
    const household = await prisma.household.findUnique({
      where: { id: householdId },
      include: { members: true }
    });

    if (!household) {
      return res.status(404).json({ error: 'Household not found' });
    }

    // Check if user is the owner
    if (household.ownerId !== userId) {
      return res.status(403).json({ error: 'Only the owner can disband the household' });
    }

    try {
      // Use a transaction to ensure all operations succeed or fail together
      await prisma.$transaction(async (prisma) => {
        // First, delete all cleaning tasks
        await prisma.cleaningTask.deleteMany({
          where: { householdId }
        });
        
        // Delete all guest announcements
        await prisma.guestAnnouncement.deleteMany({
          where: { householdId }
        });
        
        // Delete all household invites
        await prisma.householdInvite.deleteMany({
          where: { householdId }
        });
        
        // Remove all members from the household
        await prisma.user.updateMany({
          where: { householdId },
          data: { householdId: null }
        });
        
        // Finally, delete the household
        await prisma.household.delete({
          where: { id: householdId }
        });
      });

      res.json({ message: 'Household disbanded successfully' });
    } catch (error) {
      console.error('Error disbanding household:', error);
      
      // If the transaction fails, try to at least remove members from the household
      try {
        await prisma.user.updateMany({
          where: { householdId },
          data: { householdId: null }
        });
        
        res.json({ 
          message: 'Household disbanding was partially successful. Members have been removed, but some cleanup may be needed.' 
        });
      } catch (fallbackError) {
        console.error('Fallback error when removing members:', fallbackError);
        return res.status(500).json({ error: 'Failed to disband household. Please try again.' });
      }
    }
  } catch (error) {
    console.error('Error in disband household:', error);
    res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
  }
};

export const kickMember = async (req: AuthRequest, res: Response) => {
  try {
    const { householdId, memberId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    if (!householdId || !memberId) {
      throw new AppError('Missing required parameters', 400);
    }

    // Get the household to check if user is the owner
    const household = await prisma.household.findUnique({
      where: { id: householdId },
      include: { members: true }
    });

    if (!household) {
      throw new AppError('Household not found', 404);
    }

    // Check if user is the owner
    if (household.ownerId !== userId) {
      console.log('Ownership check failed:', { 
        householdOwnerId: household.ownerId, 
        currentUserId: userId 
      });
      throw new AppError('Only the owner can kick members from the household', 403);
    }

    // Check if member exists in the household
    const isMember = household.members.some(member => member.id === memberId);
    if (!isMember) {
      throw new AppError('Member not found in this household', 404);
    }

    // Check if trying to kick the owner
    if (memberId === userId) {
      throw new AppError('You cannot kick yourself from the household', 400);
    }

    // Remove the member from the household
    await prisma.user.update({
      where: { id: memberId },
      data: { householdId: null }
    });

    res.json({ message: 'Member kicked successfully' });
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Error kicking member:', error);
    throw new AppError('Error kicking member. Please try again.', 500);
  }
};

export const joinHousehold = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { code } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    if (!code) {
      throw new AppError('Household code is required', 400);
    }

    // Find household by code
    const household = await prisma.household.findFirst({
      where: { code },
      include: { members: true }
    });

    if (!household) {
      throw new AppError('Invalid household code', 404);
    }

    // Check if user is already a member
    const isMember = household.members.some(member => member.id === userId);
    if (isMember) {
      throw new AppError('You are already a member of this household', 400);
    }

    // Add user to household
    const updatedHousehold = await prisma.household.update({
      where: { id: household.id },
      data: {
        members: {
          connect: { id: userId }
        }
      },
      include: {
        members: {
          select: {
            id: true,
            username: true,
            email: true,
            avatarUrl: true
          }
        }
      }
    });

    res.json(updatedHousehold);
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else if (error instanceof Error) {
      next(new AppError(error.message, 500));
    } else {
      next(new AppError('An unexpected error occurred while joining household', 500));
    }
  }
};

export const getAllHouseholds = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    // Get the current user with their household info
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { household: true }
    });

    if (!currentUser) {
      throw new AppError('User not found', 404);
    }

    // Get all households
    const households = await prisma.household.findMany({
      where: {
        members: {
          some: {} // Only include households that have at least one member
        }
      },
      include: {
        members: {
          select: {
            id: true,
            username: true
          }
        },
        owner: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    // Add a flag to indicate which household the user is in
    const householdsWithUserStatus = households.map(household => ({
      ...household,
      isUserMember: household.id === currentUser?.householdId,
      memberCount: household.members.length
    }));

    res.json({
      currentHouseholdId: currentUser?.householdId,
      households: householdsWithUserStatus
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Error fetching households:', error);
    throw new AppError('Error fetching households', 500);
  }
}; 