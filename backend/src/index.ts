import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import availabilityRoutes from './routes/availabilityRoutes';
import bookingRoutes from './routes/bookingRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.get('/api/ping', (_req, res) => {
  res.json({ message: 'pong from backend 🎯' });
});
app.use('/api', userRoutes);
app.use('/api', availabilityRoutes);
app.use('/api', bookingRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

