const User = require('../models/User');
const Package = require('../models/Package');
const Booking = require('../models/Booking');
const Review = require('../models/review');
const Contact = require('../models/contact');
const { AppError } = require('../app');

const getStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalBookings,
      revenueResult,
      activePackages,
      totalReviews,
      openTickets,
      cancelledBookings,
    ] = await Promise.all([
      User.countDocuments({ role: 'Tourist' }),
      Booking.countDocuments({ status: { $ne: 'cancelled' } }),
      Booking.aggregate([
        { $match: { status: { $ne: 'cancelled' }, paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      Package.countDocuments({ status: 'active' }),
      Review.countDocuments(),
      Contact.countDocuments({ status: 'open' }),
      Booking.countDocuments({ status: 'cancelled' }),
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.status(200).json({
      status: 'success',
      data: {
        totalUsers,
        totalBookings,
        totalRevenue,
        activePackages,
        totalReviews,
        openTickets,
        cancelledBookings,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getRecentActivity = async (req, res, next) => {
  try {
    const recentBookings = await Booking.find({ status: { $ne: 'draft' } })
      .populate('userId', 'name email image')
      .populate('packageId', 'name type')
      .sort('-createdAt')
      .limit(10);

    res.status(200).json({
      status: 'success',
      data: { recentBookings },
    });
  } catch (err) {
    next(err);
  }
};

const getAdminUsers = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.role)   filter.role   = req.query.role;
    if (req.query.status) filter.status = req.query.status;

    const users = await User.find(filter).skip(skip).limit(limit).sort('-joinDate');
    const total = await User.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      results: users.length,
      total,
      data: { users },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats, getRecentActivity, getAdminUsers };
