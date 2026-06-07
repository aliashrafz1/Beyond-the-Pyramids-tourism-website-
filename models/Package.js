const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Package name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['single', 'day', 'week'],
      required: [true, 'Package type is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    image:          { type: String, default: '' },
    price:          { type: Number, required: [true, 'Price is required'], min: [0, 'Price cannot be negative'] },
    discountedPrice:{ type: Number, default: null },
    status:         { type: String, enum: ['active', 'inactive'], default: 'active' },
    rating:         { type: Number, min: 0, max: 5, default: 0 },
    reviewCount:    { type: Number, default: 0 },

    openingHours:        { type: String, default: '' },
    closingDays:         { type: String, default: '' },
    recommendedDuration: { type: Number, default: null },
    guidedTour:          { type: String, enum: ['yes', 'no', ''], default: '' },

    duration:         { type: Number, default: null },
    minGroup:         { type: Number, default: 1 },
    maxGroup:         { type: Number, default: 15 },
    includedServices: { type: String, default: '' },

    itinerary: [
      {
        time:     { type: String },
        activity: { type: String },
      },
    ],

    durationDays:          { type: Number, default: null },
    nights:                { type: Number, default: null },
    accommodationIncluded: { type: String, enum: ['yes', 'no', ''], default: '' },
    hotelName:             { type: String, default: '' },
    dailyItinerary: [
      {
        day:        { type: Number },
        title:      { type: String },
        activities: { type: String },
        desc:       { type: String, default: '' },
        meal:       { type: String, default: '' },
      },
    ],
    deluxeExtras: { type: String, default: '' },
  },
  { timestamps: true }
);

packageSchema.index({ type: 1 });
packageSchema.index({ city: 1 });
packageSchema.index({ status: 1 });

module.exports = mongoose.model('Package', packageSchema);
