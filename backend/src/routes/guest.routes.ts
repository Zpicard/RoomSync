import { Router } from 'express';
import {
  createAnnouncement,
  getHouseholdAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/guest.controller';
import { auth, householdMember } from '../middleware/auth';
import { body } from 'express-validator';

const router = Router();

router.post(
  '/',
  auth,
  [
    body('guestCount').isInt({ min: 1 }).withMessage('Guest count must be at least 1'),
    body('startTime').isISO8601().withMessage('Valid start time is required'),
    body('endTime').isISO8601().withMessage('Valid end time is required'),
    body('householdId').notEmpty().withMessage('Household ID is required'),
  ],
  createAnnouncement
);

router.get(
  '/household/:householdId',
  [auth, householdMember],
  getHouseholdAnnouncements
);

router.patch(
  '/:announcementId',
  auth,
  [
    body('guestCount').optional().isInt({ min: 1 }).withMessage('Guest count must be at least 1'),
    body('startTime').optional().isISO8601().withMessage('Valid start time is required'),
    body('endTime').optional().isISO8601().withMessage('Valid end time is required'),
  ],
  updateAnnouncement
);

router.delete(
  '/:announcementId',
  auth,
  deleteAnnouncement
);

export default router; 