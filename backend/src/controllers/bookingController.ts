import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createBooking = async (req: Request, res: Response) => {
  const { userId, bookedBy, startTime, endTime } = req.body;

  if (!userId || !bookedBy || !startTime || !endTime) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const newStart = new Date(startTime);
  const newEnd = new Date(endTime);

  if (newEnd <= newStart) {
    return res.status(400).json({ error: 'endTime must be after startTime' });
  }

  try {
    const overlapping = await prisma.booking.findFirst({
      where: {
        userId,
        AND: [
          { startTime: { lt: newEnd } },
          { endTime: { gt: newStart } },
        ],
      },
    });

    if (overlapping) {
      return res.status(409).json({ error: 'Booking overlaps with an existing booking' });
    }

    const newBooking = await prisma.booking.create({
      data: {
        userId,
        bookedBy,
        startTime: newStart,
        endTime: newEnd,
      },
    });

    return res.status(201).json(newBooking);
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ error: 'Failed to create booking' });
  }
};

export const getBookingsByUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.query.userId as string);

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid userId' });
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId },
      orderBy: { startTime: 'asc' },
    });

    return res.status(200).json(bookings);
  } catch (error: any) {
    console.error('Error retrieving bookings:', error);
    return res.status(500).json({ error: 'Failed to retrieve bookings' });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  const bookingId = parseInt(req.params.id);
  const { startTime, endTime, bookedBy } = req.body;

  if (!startTime || !endTime || !bookedBy) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Get existing booking
    const existing = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!existing) return res.status(404).json({ error: 'Booking not found' });

    // Check for overlap
    const conflict = await prisma.booking.findFirst({
      where: {
        userId: existing.userId,
        id: { not: bookingId },
        OR: [
          { startTime: { lt: new Date(endTime), gte: new Date(startTime) } },
          { endTime: { gt: new Date(startTime), lte: new Date(endTime) } },
          {
            AND: [
              { startTime: { lte: new Date(startTime) } },
              { endTime: { gte: new Date(endTime) } },
            ],
          },
        ],
      },
    });

    if (conflict) {
      return res.status(409).json({ error: 'Booking overlaps with an existing booking' });
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        bookedBy,
      },
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating booking:', error);
    return res.status(500).json({ error: 'Failed to update booking' });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  const bookingId = parseInt(req.params.id);

  try {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    await prisma.booking.delete({ where: { id: bookingId } });
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting booking:', error);
    return res.status(500).json({ error: 'Failed to delete booking' });
  }
};



