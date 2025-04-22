import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

const prisma = new PrismaClient();

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, dueDate, assignedToId, householdId } = req.body;
    const createdById = req.user?.id;

    if (!createdById) {
      throw new AppError('Authentication required', 401);
    }

    const task = await prisma.cleaningTask.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        assignedTo: { connect: { id: assignedToId } },
        createdBy: { connect: { id: createdById } },
        household: { connect: { id: householdId } }
      },
      include: {
        assignedTo: true,
        createdBy: true,
        household: true
      }
    });

    res.status(201).json(task);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Error creating task', 500);
  }
};

export const createTaskForAllMembers = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, dueDate, householdId } = req.body;
    const createdById = req.user?.id;

    if (!createdById) {
      throw new AppError('Authentication required', 401);
    }

    // Get all members of the household
    const household = await prisma.household.findUnique({
      where: { id: householdId },
      include: { members: true }
    });

    if (!household) {
      throw new AppError('Household not found', 404);
    }

    // Create a task for each member
    const tasks = await Promise.all(
      household.members.map(async (member) => {
        return prisma.cleaningTask.create({
          data: {
            title,
            description,
            dueDate: new Date(dueDate),
            assignedTo: { connect: { id: member.id } },
            createdBy: { connect: { id: createdById } },
            household: { connect: { id: householdId } }
          },
          include: {
            assignedTo: true,
            createdBy: true,
            household: true
          }
        });
      })
    );

    res.status(201).json(tasks);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Error creating tasks for all members', 500);
  }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    const task = await prisma.cleaningTask.findUnique({
      where: { id: taskId },
      include: { 
        assignedTo: true,
        household: {
          include: {
            members: true
          }
        }
      }
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Check if user is a member of the household
    const isHouseholdMember = task.household.members.some(member => member.id === userId);
    
    if (!isHouseholdMember) {
      throw new AppError('Not authorized to update this task', 403);
    }

    const updatedTask = await prisma.cleaningTask.update({
      where: { id: taskId },
      data: { status },
      include: {
        assignedTo: true,
        createdBy: true,
        household: true
      }
    });

    res.json(updatedTask);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Error updating task status', 500);
  }
};

export const getHouseholdTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { householdId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    const tasks = await prisma.cleaningTask.findMany({
      where: { householdId },
      include: {
        assignedTo: true,
        createdBy: true
      },
      orderBy: {
        dueDate: 'asc'
      }
    });

    res.json(tasks);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Error fetching tasks', 500);
  }
};

export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { taskId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    if (!taskId) {
      throw new AppError('Task ID is required', 400);
    }

    const task = await prisma.cleaningTask.findUnique({
      where: { id: taskId },
      include: { 
        household: { 
          include: { 
            owner: true,
            members: true
          } 
        },
        createdBy: true,
        assignedTo: true
      }
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Check if user is a member of the household
    const isHouseholdMember = task.household.members.some(member => member.id === userId);
    if (!isHouseholdMember) {
      throw new AppError('You must be a member of the household to delete tasks', 403);
    }

    // Check if user is authorized to delete the task
    const isTaskCreator = task.createdById === userId;
    const isHouseholdOwner = task.household.ownerId === userId;
    const isAssignedUser = task.assignedToId === userId;

    if (!isTaskCreator && !isHouseholdOwner && !isAssignedUser) {
      throw new AppError('Not authorized to delete this task - must be the task creator, assigned user, or household owner', 403);
    }

    await prisma.cleaningTask.delete({
      where: { id: taskId }
    });

    res.json({ 
      success: true,
      message: 'Task deleted successfully' 
    });
  } catch (error) {
    next(error);
  }
}; 