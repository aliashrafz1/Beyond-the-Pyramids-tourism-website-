const mongoose = require('mongoose');
const Package = require('./Package');

const reviewSchema = new mongoose.Schema(
  {
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      required: [true, 'Package is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    email:  { type: String, default: '' },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    title: {
      type: String,
      required: [true, 'Review title is required'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
      trim: true,
    },
    text: {
      type: String,
      required: [true, 'Review text is required'],
      maxlength: [2000, 'Review cannot exceed 2000 characters'],
      minlength: [10, 'Review must be at least 10 characters'],
    },
    photos:      [{ type: String }],
    photosCount: { type: Number, default: 0 },
    date:        { type: Date, default: Date.now },
  },
  { timestamps: true }
);

reviewSchema.index({ packageId: 1, userId: 1 }, { unique: true });

reviewSchema.statics.calcAverageRating = async function (packageId) {
  const stats = await this.aggregate([
    { $match: { packageId } },
    {
      $group: {
        _id: '$packageId',
        avgRating:  { $avg: '$rating' },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Package.findByIdAndUpdate(packageId, {
      rating:      Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].numReviews,
    });
  } else {
    await Package.findByIdAndUpdate(packageId, { rating: 0, reviewCount: 0 });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.packageId);
});

reviewSchema.post('findOneAndDelete', function (doc) {
  if (doc) doc.constructor.calcAverageRating(doc.packageId);
});

module.exports = mongoose.model('Review', reviewSchema);
