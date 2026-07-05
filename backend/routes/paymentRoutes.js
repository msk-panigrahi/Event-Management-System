import express from 'express';
import {
  processMockPayment,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getPaymentByBooking,
  getAllPayments,
} from '../controllers/paymentController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/mock', protect, processMockPayment);
router.post('/razorpay/order', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);
router.get('/booking/:bookingId', protect, getPaymentByBooking);
router.get('/all', protect, admin, getAllPayments);

export default router;
