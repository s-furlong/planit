import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createAvailability = async (req: Request, res: Response) => {
  const { userId, startTime, endTime } = req.body;

  if (!userId || !startTime || !endTime) {
    return res.status(400).json({ error: 'userId, startTime, and endTime are required' });
  }

  try {
    const availability = await prisma.availability.create({
      data: {
        userId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });

    return res.status(201).json(availability);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create availability' });
  }
};

export const getUserAvailability = async (req: Request, res: Response) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const slots = await prisma.availability.findMany({
      where: { userId: parseInt(userId as string, 10) },
      orderBy: { startTime: 'asc' },
    });

    return res.status(200).json(slots);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch availability' });
  }
};

export const updateAvailability = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { startTime, endTime } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid availability ID' });
  }

  if (!startTime && !endTime) {
    return res.status(400).json({ error: 'Provide startTime or endTime to update' });
  }

  try {
    const availability = await prisma.availability.findUnique({ where: { id } });

    if (!availability) {
      return res.status(404).json({ error: 'Availability not found' });
    }

    const updated = await prisma.availability.update({
      where: { id },
      data: {
        ...(startTime && { startTime: new Date(startTime) }),
        ...(endTime && { endTime: new Date(endTime) }),
      },
    });

    return res.status(200).json(updated);
  } catch (error: any) {
    console.error('Error updating availability:', error.message || error);
    return res.status(500).json({ error: 'Failed to update availability' });
  }
};


export const deleteAvailability = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid availability ID' });
  }

  try {
    const result = await prisma.availability.deleteMany({ where: { id } });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Availability not found' });
    }

    return res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting availability:', error.message || error);
    return res.status(500).json({ error: 'Failed to delete availability' });
  }
};

