import request from 'supertest';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import userRoutes from '../src/routes/userRoutes';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use('/api', userRoutes);

let createdUserId: number;

beforeAll(async () => {
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('User API', () => {
  it('should create a new user', async () => {
    const res = await request(app).post('/api/users').send({
      email: 'test@planit.com',
      name: 'Test User',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe('test@planit.com');
    createdUserId = res.body.id;
  });

  it('should get the list of users with pagination', async () => {
    const res = await request(app).get('/api/users?page=1&limit=10');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.total).toBeGreaterThan(0);
  });

  it('should get a user by ID', async () => {
    const res = await request(app).get(`/api/users/${createdUserId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(createdUserId);
  });

  it('should update a user', async () => {
    const res = await request(app).put(`/api/users/${createdUserId}`).send({
      name: 'Updated Name',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Name');
  });

  it('should delete a user', async () => {
    const res = await request(app).delete(`/api/users/${createdUserId}`);
    expect(res.statusCode).toBe(204);
  });

  it('should return 404 for deleted user', async () => {
    const res = await request(app).get(`/api/users/${createdUserId}`);
    expect(res.statusCode).toBe(404);
  });
});
