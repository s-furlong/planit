import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const prisma = new PrismaClient();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Simple test route
app.get('/api/ping', (_req, res) => {
  res.json({ message: 'pong from backend 🎯' });
});
app.use('/api', userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

