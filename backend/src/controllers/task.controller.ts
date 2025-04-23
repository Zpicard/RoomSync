import { Request, Response, NextFunction } from 'express';
import { PrismaClient, User, Household } from '@prisma/client';
import { AppError } from '../middleware/error';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

const prisma = new PrismaClient();

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description, dueDate, householdId, assignedToId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    if (!title || !householdId) {
      throw new AppError('Title and household ID are required', 400);
    }

    // Verify user is part of the household
    const household = await prisma.household.findFirst({
      where: {
        id: householdId,
        OR: [
          { members: { some: { id: userId } } },
          { ownerId: userId }
        ]
      }
    });

    if (!household) {
      throw new AppError('You are not a member of this household', 403);
    }

    // If assignedToId is provided, verify they are a member of the household
    if (assignedToId) {
      const assignedUser = await prisma.user.findFirst({
        where: {
          id: assignedToId,
          household: { id: householdId }
        }
      });

      if (!assignedUser) {
        throw new AppError('Assigned user is not a member of this household', 400);
      }
    }

    const taskData: any = {
      title,
      description,
      createdBy: {
        connect: { id: userId }
      },
      household: {
        connect: { id: householdId }
      }
    };

    if (assignedToId) {
      taskData.assignedTo = {
        connect: { id: assignedToId }
      };
    }

    if (dueDate) {
      taskData.dueDate = new Date(dueDate);
    }

    const task = await prisma.cleaningTask.create({
      data: taskData,
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            avatarUrl: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            username: true,
            avatarUrl: true
          }
        }
      }
    });

    res.status(201).json(task);
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else if (error instanceof Error) {
      next(new AppError(error.message, 500));
    } else {
      next(new AppError('An unexpected error occurred while creating task', 500));
    }
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

    // Get the task and verify user has permission to delete it
    const task = await prisma.cleaningTask.findUnique({
      where: { id: taskId },
      include: { 
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

    // Verify user is part of the household
    const isMember = task.household.members.some((member: User) => member.id === userId) ||
                    task.household.ownerId === userId;

    if (!isMember) {
      throw new AppError('You are not a member of this household', 403);
    }

    await prisma.cleaningTask.delete({
      where: { id: taskId }
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else if (error instanceof Error) {
      next(new AppError(error.message, 500));
    } else {
      next(new AppError('An unexpected error occurred while deleting task', 500));
    }
  }
}; 