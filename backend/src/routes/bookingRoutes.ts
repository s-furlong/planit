import { Router } from 'express';
import {
  createBooking,
  getBookingsByUser,
  updateBooking,
  deleteBooking,
} from '../controllers/bookingController';

const router = Router();

router.post('/bookings', createBooking);
router.get('/bookings', getBookingsByUser);
router.put('/bookings/:id', updateBooking);
router.delete('/bookings/:id', deleteBooking); 

export default router;


