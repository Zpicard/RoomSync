import { Request, Response } from 'express';
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

export const createHousehold = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Household name is required' });
    }

    // Check if user already has a household
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { household: true }
    });

    if (existingUser?.household) {
      return res.status(400).json({ error: 'You are already a member of a household' });
    }

    // Generate a unique code
    const code = generateHouseholdCode();

    // Create the household and connect the user in a single transaction
    const household = await prisma.$transaction(async (prisma) => {
      // Create the household
      const newHousehold = await prisma.household.create({
        data: {
          name: name.trim(),
          code,
          owner: { connect: { id: userId } }
        }
      });

      // Update the user to connect them to the household
      await prisma.user.update({
        where: { id: userId },
        data: {
          household: { connect: { id: newHousehold.id } }
        }
      });

      return newHousehold;
    });

    res.status(201).json(household);
  } catch (error) {
    console.error('Error creating household:', error);
    return res.status(500).json({ error: 'Error creating household. Please try again.' });
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

    const invitedUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!invitedUser) {
      throw new AppError('User not found', 404);
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

export const leaveHousehold = async (req: AuthRequest, res: Response) => {
  try {
    const { householdId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get the household to check if user is the owner
    const household = await prisma.household.findUnique({
      where: { id: householdId },
      include: { members: true }
    });

    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }

    // Check if user is a member of the household
    const isMember = household.members.some(member => member.id === userId);
    
    // If user is not a member, just return success
    if (!isMember) {
      return res.json({ message: 'Successfully left household' });
    }

    // If user is the owner, check if there are other members
    if (household.ownerId === userId) {
      if (household.members.length > 1) {
        return res.status(400).json({ 
          message: 'Cannot leave household while you are the owner and there are other members. Please transfer ownership first.' 
        });
      }
      
      // If user is the owner and the only member, delete the household
      await prisma.household.delete({
        where: { id: householdId }
      });
    } else {
      // Otherwise, just remove the user from the household
      await prisma.user.update({
        where: { id: userId },
        data: { householdId: null }
      });
    }

    // Send success response
    res.json({ message: 'Successfully left household' });
  } catch (error) {
    console.error('Error leaving household:', error);
    res.status(500).json({ message: 'Error leaving household. Please try again.' });
  }
};

export const getHouseholdDetails = async (req: AuthRequest, res: Response) => {
  try {
    const { householdId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const household = await prisma.household.findUnique({
      where: { id: householdId },
      include: {
        members: true,
        owner: true
      }
    });

    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }

    // Check if user is a member of the household
    const isMember = household.members.some(member => member.id === userId);
    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this household' });
    }

    res.json({
      id: household.id,
      name: household.name,
      code: household.code,
      ownerId: household.ownerId,
      members: household.members.map(member => ({
        id: member.id,
        username: member.username,
        email: member.email
      }))
    });
  } catch (error) {
    console.error('Error fetching household details:', error);
    res.status(500).json({ message: 'Error fetching household details' });
  }
};

export const transferOwnership = async (req: AuthRequest, res: Response) => {
  try {
    const { householdId } = req.params;
    const { newOwnerId } = req.body;
    const currentOwnerId = req.user?.id;

    if (!currentOwnerId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get the household to check if user is the owner
    const household = await prisma.household.findUnique({
      where: { id: householdId },
      include: { members: true }
    });

    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }

    // Check if current user is the owner
    if (household.ownerId !== currentOwnerId) {
      return res.status(403).json({ message: 'Only the owner can transfer ownership' });
    }

    // Check if new owner is a member of the household
    const isMember = household.members.some(member => member.id === newOwnerId);
    if (!isMember) {
      return res.status(400).json({ message: 'New owner must be a member of the household' });
    }

    // Transfer ownership
    await prisma.household.update({
      where: { id: householdId },
      data: { ownerId: newOwnerId }
    });

    res.json({ message: 'Ownership transferred successfully' });
  } catch (error) {
    console.error('Error transferring ownership:', error);
    res.status(500).json({ message: 'Error transferring ownership. Please try again.' });
  }
};

export const disbandHousehold = async (req: AuthRequest, res: Response) => {
  try {
    const { householdId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get the household to check if user is the owner
    const household = await prisma.household.findUnique({
      where: { id: householdId },
      include: { members: true }
    });

    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }

    // Check if user is the owner
    if (household.ownerId !== userId) {
      return res.status(403).json({ message: 'Only the owner can disband the household' });
    }

    // Remove all members from the household
    await prisma.user.updateMany({
      where: { householdId },
      data: { householdId: null }
    });

    // Delete the household
    await prisma.household.delete({
      where: { id: householdId }
    });

    res.json({ message: 'Household disbanded successfully' });
  } catch (error) {
    console.error('Error disbanding household:', error);
    res.status(500).json({ message: 'Error disbanding household. Please try again.' });
  }
};

export const kickMember = async (req: AuthRequest, res: Response) => {
  try {
    const { householdId, memberId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get the household to check if user is the owner
    const household = await prisma.household.findUnique({
      where: { id: householdId },
      include: { members: true }
    });

    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }

    // Check if user is the owner
    if (household.ownerId !== userId) {
      return res.status(403).json({ message: 'Only the owner can kick members from the household' });
    }

    // Check if member exists in the household
    const isMember = household.members.some(member => member.id === memberId);
    if (!isMember) {
      return res.status(404).json({ message: 'Member not found in this household' });
    }

    // Check if trying to kick the owner
    if (memberId === userId) {
      return res.status(400).json({ message: 'You cannot kick yourself from the household' });
    }

    // Remove the member from the household
    await prisma.user.update({
      where: { id: memberId },
      data: { householdId: null }
    });

    res.json({ message: 'Member kicked successfully' });
  } catch (error) {
    console.error('Error kicking member:', error);
    res.status(500).json({ message: 'Error kicking member. Please try again.' });
  }
}; 