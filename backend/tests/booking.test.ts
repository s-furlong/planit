import request from 'supertest';
import express from 'express';
import { PrismaClient } from '@prisma/client';

import userRoutes from '../src/routes/userRoutes';
import bookingRoutes from '../src/routes/bookingRoutes';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', bookingRoutes);

describe('Booking Endpoints', () => {
  let userId: number;
  let bookingId: number;

  beforeAll(async () => {
    await prisma.user.deleteMany();

    const userRes = await request(app).post('/api/users').send({
      email: 'booking@test.com',
      name: 'Booking Test User',
    });

    userId = userRes.body.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it('should create a booking successfully', async () => {
    const res = await request(app).post('/api/bookings').send({
      userId,
      bookedBy: 'guest1@example.com',
      startTime: '2025-06-05T10:00:00.000Z',
      endTime: '2025-06-05T10:30:00.000Z',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.bookedBy).toBe('guest1@example.com');
    bookingId = res.body.id;
  });

  it('should reject overlapping booking', async () => {
    const res = await request(app).post('/api/bookings').send({
      userId,
      bookedBy: 'guest2@example.com',
      startTime: '2025-06-05T10:15:00.000Z',
      endTime: '2025-06-05T10:45:00.000Z',
    });

    expect(res.statusCode).toBe(409);
    expect(res.body.error).toBe('Booking overlaps with an existing booking');
  });

  it('should return all bookings for the user', async () => {
    const res = await request(app).get(`/api/bookings?userId=${userId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].userId).toBe(userId);
  });

  it('should return 400 for missing fields', async () => {
    const res = await request(app).post('/api/bookings').send({
      userId,
      bookedBy: '',
      startTime: '',
      endTime: '',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('All fields are required');
  });

});
