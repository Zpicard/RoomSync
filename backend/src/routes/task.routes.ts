import express from 'express';
import {
  createTask,
  createTaskForAllMembers,
  updateTaskStatus,
  getHouseholdTasks,
  deleteTask,
} from '../controllers/task.controller';
import { auth, householdMember } from '../middleware/auth';
import { body } from 'express-validator';

const router = express.Router();

router.post(
  '/',
  auth,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('dueDate').isISO8601().withMessage('Valid due date is required'),
    body('householdId').notEmpty().withMessage('Household ID is required'),
  ],
  householdMember,
  createTask
);

router.post(
  '/all-members',
  auth,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('dueDate').isISO8601().withMessage('Valid due date is required'),
    body('householdId').notEmpty().withMessage('Household ID is required'),
  ],
  householdMember,
  createTaskForAllMembers
);

router.patch(
  '/:taskId/status',
  auth,
  [
    body('status')
      .isIn(['PENDING', 'COMPLETED', 'OVERDUE'])
      .withMessage('Invalid status value'),
  ],
  updateTaskStatus
);

router.get(
  '/household/:householdId',
  auth,
  householdMember,
  getHouseholdTasks
);

router.delete(
  '/:taskId',
  auth,
  deleteTask
);

export default router; 