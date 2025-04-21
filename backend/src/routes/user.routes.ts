import { Router } from 'express';
import { updateAvatar, getProfile } from '../controllers/user.controller';
import { auth } from '../middleware/auth';
import { body } from 'express-validator';

const router = Router();

router.get('/profile', auth, getProfile);

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