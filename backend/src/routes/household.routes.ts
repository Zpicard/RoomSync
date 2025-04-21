import { Router } from 'express';
import { createHousehold, inviteMember, respondToInvite, leaveHousehold, getHouseholdDetails, transferOwnership, disbandHousehold, kickMember, joinHousehold, getAllHouseholds } from '../controllers/household.controller';
import { auth, householdMember } from '../middleware/auth';
import { body } from 'express-validator';

const router = Router();

router.post(
  '/',
  auth,
  [
    body('name')
      .isLength({ min: 3 })
      .withMessage('Household name must be at least 3 characters long'),
  ],
  createHousehold
);

router.post(
  '/:householdId/invite',
  [auth, householdMember],
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
  ],
  inviteMember
);

router.post(
  '/invite/:inviteId/respond',
  auth,
  [
    body('accept').isBoolean().withMessage('Accept must be a boolean value'),
  ],
  respondToInvite
);

router.post(
  '/:householdId/leave',
  [auth, householdMember],
  leaveHousehold
);

router.get(
  '/:householdId',
  [auth, householdMember],
  getHouseholdDetails
);

router.post(
  '/:householdId/transfer-ownership',
  [auth, householdMember],
  [
    body('newOwnerId').notEmpty().withMessage('New owner ID is required'),
  ],
  transferOwnership
);

router.post(
  '/:householdId/disband',
  [auth, householdMember],
  disbandHousehold
);

router.post(
  '/:householdId/kick/:memberId',
  [auth, householdMember],
  kickMember
);

router.post(
  '/join',
  auth,
  [
    body('code')
      .isString()
      .notEmpty()
      .withMessage('Household code is required'),
  ],
  joinHousehold
);

// Get all households
router.get('/', auth, getAllHouseholds);

export default router; 