import { v4 as uuidv4 } from 'uuid';
import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import { linkPaymentToBooking } from './bookingController.js';

export const processMockPayment = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({ success: false, message: 'Booking ID and amount are required' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const existingPayment = await Payment.findOne({ booking: bookingId, status: 'completed' });
    if (existingPayment) {
      return res.status(400).json({ success: false, message: 'Payment already completed for this booking' });
    }

    const transactionId = `MOCK-${uuidv4().slice(0, 12).toUpperCase()}`;

    const payment = await Payment.create({
      user: req.user._id,
      booking: bookingId,
      amount: Number(amount),
      method: 'mock',
      status: 'completed',
      transactionId,
      metadata: {
        processedAt: new Date().toISOString(),
        provider: 'mock',
      },
    });

    await linkPaymentToBooking(bookingId, payment._id);

    res.status(201).json({
      success: true,
      message: 'Payment completed successfully',
      data: payment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createRazorpayOrder = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    res.status(501).json({
      success: false,
      message: 'Razorpay integration placeholder. Configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env and implement order creation here.',
      data: {
        bookingId,
        amount,
        method: 'razorpay',
        orderId: null,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    res.status(501).json({
      success: false,
      message: 'Razorpay verification placeholder. Implement signature verification using razorpay SDK.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPaymentByBooking = async (req, res) => {
  try {
    const payment = await Payment.findOne({ booking: req.params.bookingId });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ status: 'completed' })
      .populate('user', 'name email')
      .populate({
        path: 'booking',
        populate: { path: 'event', select: 'title' },
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
