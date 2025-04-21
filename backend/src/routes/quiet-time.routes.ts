import { Router } from 'express';
import { createQuietTime } from '../controllers/quiet-time.controller';
import { auth } from '../middleware/auth';
import { body } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

router.post(
  '/',
  auth,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('type').isIn(['exam', 'study', 'quiet']).withMessage('Invalid quiet time type'),
    body('startTime').isISO8601().withMessage('Valid start time is required'),
    body('endTime').isISO8601().withMessage('Valid end time is required'),
    body('householdId').notEmpty().withMessage('Household ID is required'),
  ],
  createQuietTime
);

router.get('/household/:householdId', auth, async (req, res) => {
  try {
    const { householdId } = req.params;
    const quietTimes = await prisma.quietTime.findMany({
      where: { householdId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });
    res.json(quietTimes);
  } catch (error) {
    console.error('Error fetching quiet times:', error);
    res.status(500).json({ message: 'Error fetching quiet times' });
  }
});

// Delete quiet time
router.delete('/:id', auth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if quiet time exists and belongs to the user
    const quietTime = await prisma.quietTime.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!quietTime) {
      return res.status(404).json({ message: 'Quiet time not found' });
    }

    if (quietTime.userId !== userId) {
      return res.status(403).json({ message: 'You can only delete your own quiet times' });
    }

    // Delete the quiet time
    await prisma.quietTime.delete({
      where: { id }
    });

    res.json({ message: 'Quiet time deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiet time:', error);
    res.status(500).json({ message: 'Error deleting quiet time' });
  }
});

export default router; 