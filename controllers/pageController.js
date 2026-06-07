const Package = require('../models/Package');
const Booking = require('../models/Booking');
const Review  = require('../models/review');
const User    = require('../models/User');
const Contact = require('../models/contact');
const { AppError } = require('../app');

function computeBookingStatus(date, status) {
  if (status === 'cancelled') return 'cancelled';
  if (!date || String(date).includes(' to ')) return status;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const start = new Date(date); start.setHours(0, 0, 0, 0);
  if (isNaN(start)) return status;
  if (today < start) return 'confirmed';
  if (today.getTime() === start.getTime()) return 'checked-in';
  return 'checked-out';
}

const getLandingPage = async (req, res, next) => {
  try {
    const [dayPackages, weekPackages, singlePackages, recentReviews] = await Promise.all([
      Package.find({ status: 'active', type: 'day' }).limit(3).sort('-rating'),
      Package.find({ status: 'active', type: 'week' }).limit(3).sort('-rating'),
      Package.find({ status: 'active', type: 'single' }).limit(4).sort('-rating'),
      Review.find().populate('userId', 'name image').sort('-date').limit(6),
    ]);

    res.render('index', { user: req.user || null, dayPackages, weekPackages, singlePackages, recentReviews });
  } catch (err) {
    next(err);
  }
};

const getDayPackages = async (req, res, next) => {
  try {
    const packages = await Package.find({ status: 'active', type: 'day' }).sort('-rating');
    res.render('dayPackages', { user: req.user || null, packages });
  } catch (err) {
    next(err);
  }
};

const getWeekPackages = async (req, res, next) => {
  try {
    const packages = await Package.find({ status: 'active', type: 'week' }).sort('-rating');
    res.render('weekPackages', { user: req.user || null, packages });
  } catch (err) {
    next(err);
  }
};

const getSinglePackages = async (req, res, next) => {
  try {
    const packages = await Package.find({ status: 'active', type: 'single' }).sort('-rating');
    res.render('singlePackages', { user: req.user || null, packages });
  } catch (err) {
    next(err);
  }
};

const getPackageDetails = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg || pkg.status === 'inactive') return next(new AppError('Package not found.', 404));

    const reviews = await Review.find({ packageId: pkg._id })
      .populate('userId', 'name image')
      .sort('-date')
      .limit(10);

    res.render('packageDetails', { user: req.user || null, package: pkg, reviews });
  } catch (err) {
    next(err);
  }
};

const getLoginPage = (req, res) => {
  if (req.user) return res.redirect('/dashboard');
  res.render('login', { user: null, error: null });
};

const getRegisterPage = (req, res) => {
  if (req.user) return res.redirect('/dashboard');
  res.render('register', { user: null, error: null });
};

const getDashboard = async (req, res, next) => {
  if (req.user.role === 'Admin') return res.redirect('/admin');
  try {
    const [recentBooking, totalBookings, featuredPackage] = await Promise.all([
      Booking.findOne({
        userId: req.user._id,
        status: { $nin: ['draft', 'cancelled'] },
      })
        .populate('packageId', 'name type city image')
        .sort('-createdAt'),
      Booking.countDocuments({
        userId: req.user._id,
        status: { $ne: 'draft' },
      }),
      Package.findOne({ status: 'active', image: { $ne: '' } }).sort('-rating'),
    ]);

    res.render('userDashboard', { user: req.user, recentBooking, totalBookings, featuredPackage });
  } catch (err) {
    next(err);
  }
};

const getProfilePage = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id, status: { $ne: 'draft' } })
      .populate('packageId', 'name type city image')
      .sort('-createdAt');

    res.render('userProfile', { user: req.user, bookings });
  } catch (err) {
    next(err);
  }
};

const getMyBookingsPage = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id, status: { $ne: 'draft' } })
      .populate('packageId', 'name type city image')
      .sort('-createdAt');

    const mapped = bookings.map(b => {
      const obj = b.toObject();
      obj.computedStatus = computeBookingStatus(b.date, b.status);
      return obj;
    });

    res.render('myBookings', { user: req.user, bookings: mapped });
  } catch (err) {
    next(err);
  }
};

const getBookingSummaryPage = async (req, res, next) => {
  try {
    const draftId = req.query.draftId;
    if (!draftId) return res.redirect('/packages/day');

    const booking = await Booking.findById(draftId).populate('packageId', 'name type city image price discountedPrice');
    if (!booking || booking.userId.toString() !== req.user._id.toString()) {
      return next(new AppError('Booking not found.', 404));
    }

    res.render('bookingSummary', { user: req.user, booking });
  } catch (err) {
    next(err);
  }
};

const getTravellersPage = async (req, res, next) => {
  try {
    const draftId = req.query.draftId;
    if (!draftId) return res.redirect('/packages/day');

    const booking = await Booking.findById(draftId).populate('packageId', 'name type city');
    if (!booking || booking.userId.toString() !== req.user._id.toString()) {
      return next(new AppError('Booking not found.', 404));
    }

    res.render('travellers', { user: req.user, booking });
  } catch (err) {
    next(err);
  }
};

const getBookingDetailsPage = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('packageId', 'name type city image')
      .populate('userId', 'name email');

    if (!booking) return next(new AppError('Booking not found.', 404));

    const isOwner = booking.userId._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'Admin';

    if (!isOwner && !isAdmin) return next(new AppError('Access denied.', 403));

    res.render('bookingDetails', { user: req.user, booking });
  } catch (err) {
    next(err);
  }
};

const getWriteReviewPage = async (req, res, next) => {
  try {
    const packages = await Package.find({ status: 'active' }).select('name type city');
    res.render('writeReview', { user: req.user, packages });
  } catch (err) {
    next(err);
  }
};

const getCustomTripPage = async (req, res, next) => {
  try {
    const packages = await Package.find({ status: 'active' }).select('name type city price image');
    res.render('customTrip', { user: req.user, packages });
  } catch (err) {
    next(err);
  }
};

const getAdminDashboard = async (req, res, next) => {
  try {
    const [totalUsers, totalBookings, revenueResult, activePackages, openTickets, totalReviews, cancelledBookings, recentBookings] =
      await Promise.all([
        User.countDocuments({ role: 'Tourist' }),
        Booking.countDocuments({ status: { $ne: 'cancelled' } }),
        Booking.aggregate([
          { $match: { status: { $ne: 'cancelled' }, paymentStatus: 'paid' } },
          { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]),
        Package.countDocuments({ status: 'active' }),
        Contact.countDocuments({ status: 'open' }),
        Review.countDocuments(),
        Booking.countDocuments({ status: 'cancelled' }),
        Booking.find({ status: { $ne: 'draft' } })
          .populate('userId', 'name email')
          .sort('-createdAt')
          .limit(5),
      ]);

    res.render('adminDashboard', {
      user: req.user,
      stats: {
        totalUsers,
        totalBookings,
        totalRevenue: revenueResult.length > 0 ? revenueResult[0].total : 0,
        activePackages,
        openTickets,
        totalReviews,
        cancelledBookings,
      },
      recentBookings,
    });
  } catch (err) {
    next(err);
  }
};

const getAdminBookingsPage = async (req, res, next) => {
  try {
    const filter = { status: { $ne: 'draft' } };
    if (req.query.status) filter.status = req.query.status;

    const rawBookings = await Booking.find(filter)
      .populate('userId', 'name email image')
      .populate('packageId', 'name type')
      .sort('-createdAt')
      .limit(50);

    const bookings = rawBookings.map(b => {
      const obj = b.toObject();
      obj.computedStatus = computeBookingStatus(b.date, b.status);
      return obj;
    });

    const stats = {
      total:     await Booking.countDocuments({ status: { $ne: 'draft' } }),
      confirmed: await Booking.countDocuments({ status: 'confirmed' }),
      cancelled: await Booking.countDocuments({ status: 'cancelled' }),
      revenue:   0,
    };

    const rev = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    if (rev.length > 0) stats.revenue = rev[0].total;

    res.render('adminBookings', { user: req.user, bookings, stats });
  } catch (err) {
    next(err);
  }
};

const getAdminContactPage = async (req, res, next) => {
  try {
    await Contact.updateMany({ status: 'in-progress' }, { status: 'open' });
    const tickets = await Contact.find().sort('-createdAt');
    res.render('adminContact', { user: req.user, tickets });
  } catch (err) {
    next(err);
  }
};

const getAdminPackagesPage = async (req, res, next) => {
  try {
    const packages = await Package.find().sort('-createdAt');
    res.render('adminPackages', { user: req.user, packages });
  } catch (err) {
    next(err);
  }
};

const getAdminUsersPage = async (req, res, next) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.render('adminUsers', { user: req.user, users });
  } catch (err) {
    next(err);
  }
};

const getAdminReportsPage = async (req, res, next) => {
  try {
    const [allUsers, allBookings, revenueResult, allReviews, openTickets] = await Promise.all([
      User.find().select('name email role status createdAt nationality phone').sort('-createdAt'),
      Booking.find().populate('packageId', 'name type').sort('-createdAt'),
      Booking.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      Review.find().populate('userId', 'name').sort('-createdAt').limit(20),
      Contact.countDocuments({ status: 'open' }),
    ]);

    res.render('adminReports', {
      user: req.user,
      allUsers: allUsers.map(u => ({
        id: String(u._id),
        name: u.name || '',
        email: u.email || '',
        role: u.role === 'Tourist' ? 'user' : 'admin',
        fullRole: u.role,
        status: u.status || 'active',
        nationality: u.nationality || '',
        joinDate: u.createdAt ? u.createdAt.toISOString().split('T')[0] : '',
      })),
      allBookings: allBookings.map(b => ({
        id: String(b._id),
        packageName: b.packageName || (b.packageId && b.packageId.name) || 'Unknown',
        status: b.status,
        totalPrice: b.totalPrice || 0,
        date: b.date || '',
        createdAt: b.createdAt ? b.createdAt.toISOString().split('T')[0] : '',
      })),
      allReviews: allReviews.map(r => ({
        id: String(r._id),
        user: r.userId ? r.userId.name : 'Verified Traveler',
        rating: r.rating || 5,
        review: r.text || r.title || '',
        date: r.createdAt ? r.createdAt.toISOString().split('T')[0] : '',
        photos: r.photos || [],
      })),
      totalRevenue: revenueResult.length > 0 ? revenueResult[0].total : 0,
      openTickets,
    });
  } catch (err) {
    next(err);
  }
};

const getContactPage = (req, res) => res.render('contact', { user: req.user || null });
const getAboutPage   = (req, res) => res.render('about',   { user: req.user || null });
const getFaqPage     = (req, res) => res.render('faq',     { user: req.user || null });
const getTermsPage   = (req, res) => res.render('terms',   { user: req.user || null });

module.exports = {
  getLandingPage,
  getDayPackages,
  getWeekPackages,
  getSinglePackages,
  getPackageDetails,
  getLoginPage,
  getRegisterPage,
  getDashboard,
  getProfilePage,
  getMyBookingsPage,
  getBookingSummaryPage,
  getTravellersPage,
  getBookingDetailsPage,
  getWriteReviewPage,
  getCustomTripPage,
  getAdminDashboard,
  getAdminBookingsPage,
  getAdminPackagesPage,
  getAdminContactPage,
  getAdminUsersPage,
  getAdminReportsPage,
  getContactPage,
  getAboutPage,
  getFaqPage,
  getTermsPage,
};
