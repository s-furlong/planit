import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create a new user
 * POST /api/users
 */
export const createUser = async (req: Request, res: Response) => {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const user = await prisma.user.create({
      data: { email, name },
    });

    return res.status(201).json(user);
  } catch (error: any) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Something went wrong creating the user' });
  }
};

/**
 * Get users with optional email filter and pagination
 * GET /api/users?email=...&page=1&limit=10
 */
export const getUsersByQuery = async (req: Request, res: Response) => {
  const { email, page = '1', limit = '10' } = req.query;

  const pageNum = Math.max(parseInt(page as string) || 1, 1);
  const limitNum = Math.max(parseInt(limit as string) || 10, 1);
  const skip = (pageNum - 1) * limitNum;

  try {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          email: email ? String(email) : undefined,
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({
        where: {
          email: email ? String(email) : undefined,
        },
      }),
    ]);

    return res.status(200).json({
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      data: users,
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

/**
 * Get user by ID
 * GET /api/users/:id
 */
export const getUserById = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error: any) {
    console.error('Error retrieving user by ID:', error);
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);
  const { name, email } = req.body;

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  if (!name && !email) {
    return res.status(400).json({ error: 'Provide at least one field to update (name or email)' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error: any) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'Failed to update user' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    return res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
};

