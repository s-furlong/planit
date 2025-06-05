import express from 'express';
import {
  createAvailability,
  getUserAvailability,
  updateAvailability,
  deleteAvailability,
} from '../controllers/availabilityController';

const router = express.Router();

router.post('/availability', createAvailability);
router.get('/availability', getUserAvailability);
router.put('/availability/:id', updateAvailability);
router.delete('/availability/:id', deleteAvailability);

export default router;
