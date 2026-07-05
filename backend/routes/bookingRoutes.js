import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  getAllBookings,
  cancelBooking,
  verifyTicket,
  checkInTicket,
  getRecentBookings,
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/recent', protect, admin, getRecentBookings);
router.get('/all', protect, admin, getAllBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);
router.post('/verify', protect, admin, verifyTicket);
router.post('/checkin', protect, admin, checkInTicket);

export default router;
