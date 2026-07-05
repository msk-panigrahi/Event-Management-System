import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import Event from '../models/Event.js';

export const getMonthlyRevenue = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const revenue = await Payment.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = months.map((month, index) => {
      const found = revenue.find((r) => r._id === index + 1);
      return {
        month,
        revenue: found ? found.revenue : 0,
        count: found ? found.count : 0,
      };
    });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMonthlyBookings = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const bookings = await Booking.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' },
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
          tickets: { $sum: '$quantity' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = months.map((month, index) => {
      const found = bookings.find((b) => b._id === index + 1);
      return {
        month,
        count: found ? found.count : 0,
        tickets: found ? found.tickets : 0,
      };
    });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPopularEvents = async (req, res) => {
  try {
    const popular = await Booking.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: '$event',
          bookings: { $sum: 1 },
          tickets: { $sum: '$quantity' },
          revenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { tickets: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: '_id',
          as: 'event',
        },
      },
      { $unwind: '$event' },
      {
        $project: {
          _id: 1,
          bookings: 1,
          tickets: 1,
          revenue: 1,
          title: '$event.title',
          category: '$event.category',
        },
      },
    ]);

    res.json({ success: true, data: popular });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategoryDistribution = async (req, res) => {
  try {
    const distribution = await Event.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: distribution.map((d) => ({ category: d._id, count: d.count })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBookingStatusStats = async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: stats.map((s) => ({ status: s._id, count: s.count })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
