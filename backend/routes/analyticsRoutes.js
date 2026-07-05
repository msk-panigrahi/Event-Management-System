import express from 'express';
import {
  getMonthlyRevenue,
  getMonthlyBookings,
  getPopularEvents,
  getCategoryDistribution,
  getBookingStatusStats,
} from '../controllers/analyticsController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/revenue', protect, admin, getMonthlyRevenue);
router.get('/bookings', protect, admin, getMonthlyBookings);
router.get('/popular-events', protect, admin, getPopularEvents);
router.get('/categories', protect, admin, getCategoryDistribution);
router.get('/booking-status', protect, admin, getBookingStatusStats);

export default router;
