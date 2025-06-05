import request from 'supertest';
import express from 'express';
import { PrismaClient } from '@prisma/client';

import userRoutes from '../src/routes/userRoutes';
import availabilityRoutes from '../src/routes/availabilityRoutes';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', availabilityRoutes);

describe('Availability Endpoints', () => {
  let userId: number;
  let availabilityId: number;

  beforeAll(async () => {
  await prisma.availability.deleteMany();
  await prisma.user.deleteMany();         

  const userRes = await request(app).post('/api/users').send({
    email: 'availability@test.com',
    name: 'Availability Test User',
  });

  userId = userRes.body.id;
});

afterAll(async () => {
  await prisma.availability.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

  it('should create availability for a user', async () => {
    const res = await request(app).post('/api/availability').send({
      userId,
      startTime: '2025-06-10T09:00:00Z',
      endTime: '2025-06-10T10:00:00Z',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.userId).toBe(userId);
    availabilityId = res.body.id;
  });

  it('should retrieve availability for a user', async () => {
    const res = await request(app).get(`/api/availability?userId=${userId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].userId).toBe(userId);
  });

  it('should delete availability by ID', async () => {
    const res = await request(app).delete(`/api/availability/${availabilityId}`);
    expect(res.statusCode).toBe(204);
  });

  it('should return an empty array after deletion', async () => {
    const res = await request(app).get(`/api/availability?userId=${userId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });
});

