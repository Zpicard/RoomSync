import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, User, Household } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: User & {
    household?: Household | null;
  };
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ error: 'Please authenticate.' });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Please authenticate.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
      id: string;
      email: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        household: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Please authenticate.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

export const householdMember = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const householdId = req.params.householdId || req.body.householdId;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Please authenticate.' });
    }

    if (!householdId) {
      return res.status(400).json({ error: 'Household ID is required.' });
    }

    // Check if the household exists
    const household = await prisma.household.findUnique({
      where: { id: householdId },
      include: { members: true }
    });

    if (!household) {
      return res.status(404).json({ error: 'Household not found.' });
    }

    // Special case for leave operation - allow it even if user is not a member
    if (req.path.endsWith('/leave')) {
      next();
      return;
    }

    // Check if the user is a member of the household
    const isMember = household.members.some(member => member.id === userId);
    if (!isMember) {
      return res.status(403).json({ error: 'Access denied. Not a member of this household.' });
    }

    next();
  } catch (error) {
    console.error('Household member middleware error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}; 