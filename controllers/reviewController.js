const Review = require('../models/review');
const Package = require('../models/Package');
const { AppError } = require('../app');

const createReview = async (req, res, next) => {
  try {
    const { packageId, rating, title, text, photosCount } = req.body;

    const pkg = await Package.findById(packageId);
    if (!pkg) return next(new AppError('Package not found.', 404));

    const existing = await Review.findOne({ packageId, userId: req.user._id });
    if (existing) return next(new AppError('You have already reviewed this package.', 400));

    const review = await Review.create({
      packageId,
      userId: req.user._id,
      email: req.user.email,
      rating,
      title,
      text,
      photosCount: photosCount || 0,
    });

    res.status(201).json({ status: 'success', data: { review } });
  } catch (err) {
    next(err);
  }
};

const getPackageReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ packageId: req.params.packageId })
      .populate('userId', 'name image')
      .sort('-date');

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: { reviews },
    });
  } catch (err) {
    next(err);
  }
};

const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'name email image')
      .populate('packageId', 'name type')
      .sort('-date');

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: { reviews },
    });
  } catch (err) {
    next(err);
  }
};

const getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ userId: req.user._id })
      .populate('packageId', 'name type')
      .sort('-date');
    res.status(200).json({ status: 'success', data: { reviews } });
  } catch (err) {
    next(err);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return next(new AppError('Review not found.', 404));

    const isOwner = review.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'Admin';

    if (!isOwner && !isAdmin) {
      return next(new AppError('You do not have permission to delete this review.', 403));
    }

    await Review.findOneAndDelete({ _id: req.params.id });

    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    next(err);
  }
};

const uploadReviewPhotos = async (req, res, next) => {
  try {
    const photos = req.files ? req.files.map(f => f.path) : [];
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { photos, photosCount: photos.length },
      { new: true }
    );
    if (!review) return next(new AppError('Review not found.', 404));
    res.status(200).json({ status: 'success', data: { review } });
  } catch (err) {
    next(err);
  }
};

module.exports = { createReview, getPackageReviews, getAllReviews, getMyReviews, deleteReview, uploadReviewPhotos };
