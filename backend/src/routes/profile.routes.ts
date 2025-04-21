import { Router } from 'express';
import { getProfile, updateProfile, updateAvatar } from '../controllers/profile.controller';
import { auth } from '../middleware/auth';
import { body } from 'express-validator';

const router = Router();

router.get('/', auth, getProfile);

router.patch(
  '/',
  auth,
  [
    body('username')
      .optional()
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters long'),
    body('bio')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Bio must not exceed 500 characters'),
  ],
  updateProfile
);

router.patch('/avatar',
  auth,
  [
    body('avatarUrl')
      .isString()
      .custom((value) => {
        if (value === '') return true;
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      })
      .withMessage('Please provide a valid avatar URL or empty string to remove avatar'),
  ],
  updateAvatar
);

export default router; 