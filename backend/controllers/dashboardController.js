import Event from '../models/Event.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Payment from '../models/Payment.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const publishedEvents = await Event.countDocuments({ isPublished: true });
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalBookings = await Booking.countDocuments({ status: { $ne: 'cancelled' } });

    const revenueResult = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    const upcomingEvents = await Event.countDocuments({
      isPublished: true,
      date: { $gte: new Date() },
    });

    res.json({
      success: true,
      data: {
        totalEvents,
        publishedEvents,
        totalUsers,
        totalBookings,
        totalRevenue,
        upcomingEvents,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const totalBookings = await Booking.countDocuments({ user: userId, status: { $ne: 'cancelled' } });
    const upcomingBookings = await Booking.countDocuments({
      user: userId,
      status: 'confirmed',
    });

    const bookings = await Booking.find({ user: userId, status: { $ne: 'cancelled' } }).select('_id');
    const bookingIds = bookings.map((b) => b._id);

    const revenueResult = await Payment.aggregate([
      { $match: { booking: { $in: bookingIds }, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalSpent = revenueResult[0]?.total || 0;

    res.json({
      success: true,
      data: {
        totalBookings,
        upcomingBookings,
        totalSpent,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
