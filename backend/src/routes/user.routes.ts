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
      .isURL()
      .withMessage('Please provide a valid avatar URL'),
  ],
  updateAvatar
);

export default router; 