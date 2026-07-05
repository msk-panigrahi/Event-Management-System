import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import Payment from '../models/Payment.js';

export const createBooking = async (req, res) => {
  try {
    const { eventId, quantity } = req.body;

    if (!eventId || !quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Invalid booking details' });
    }

    const event = await Event.findById(eventId);
    if (!event || !event.isPublished) {
      return res.status(404).json({ success: false, message: 'Event not found or not available' });
    }

    if (event.availableSeats < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${event.availableSeats} seats available`,
      });
    }

    const totalAmount = event.ticketPrice * quantity;
    const ticketId = `TKT-${uuidv4().slice(0, 8).toUpperCase()}`;

    const qrData = JSON.stringify({
      ticketId,
      eventId: event._id,
      userId: req.user._id,
      quantity,
    });
    const qrCode = await QRCode.toDataURL(qrData);

    const booking = await Booking.create({
      user: req.user._id,
      event: eventId,
      quantity,
      totalAmount,
      ticketId,
      qrCode,
      status: 'confirmed',
    });

    event.availableSeats -= quantity;
    await event.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('event')
      .populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('event')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('event', 'title date venue city')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (booking.status === 'checked-in') {
      return res.status(400).json({ success: false, message: 'Cannot cancel checked-in booking' });
    }

    if (booking.status !== 'cancelled') {
      const event = await Event.findById(booking.event);
      if (event) {
        event.availableSeats += booking.quantity;
        await event.save();
      }
      booking.status = 'cancelled';
      await booking.save();

      await Payment.findOneAndUpdate(
        { booking: booking._id },
        { status: 'refunded' }
      );
    }

    res.json({ success: true, message: 'Booking cancelled successfully', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyTicket = async (req, res) => {
  try {
    const { ticketId } = req.body;

    const booking = await Booking.findOne({ ticketId })
      .populate('event')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Invalid ticket' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Ticket has been cancelled' });
    }

    if (booking.status === 'checked-in') {
      return res.status(400).json({
        success: false,
        message: 'Ticket already checked in',
        data: booking,
        alreadyCheckedIn: true,
      });
    }

    res.json({
      success: true,
      message: 'Ticket verified successfully',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkInTicket = async (req, res) => {
  try {
    const { ticketId } = req.body;

    const booking = await Booking.findOne({ ticketId })
      .populate('event')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Invalid ticket' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Ticket has been cancelled' });
    }

    if (booking.status === 'checked-in') {
      return res.status(400).json({
        success: false,
        message: 'Duplicate check-in prevented. Ticket already checked in.',
        alreadyCheckedIn: true,
      });
    }

    booking.status = 'checked-in';
    booking.checkedInAt = new Date();
    await booking.save();

    res.json({
      success: true,
      message: 'Check-in successful',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const linkPaymentToBooking = async (bookingId, paymentId) => {
  await Booking.findByIdAndUpdate(bookingId, { payment: paymentId });
};

export const getRecentBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('event', 'title')
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
