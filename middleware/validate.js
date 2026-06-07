const { body, validationResult } = require('express-validator');
const { AppError } = require('../app');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg).join('. ');
    return next(new AppError(messages, 400));
  }
  next();
};

const validateRegister = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*()\-+_=]/).withMessage('Password must contain at least one special character'),
  body('phone').optional().custom(val => { if (val && val.replace(/\D/g, '').length < 7) throw new Error('Please provide a valid phone number'); return true; }),
  body('dob')
    .optional()
    .isISO8601().withMessage('Please provide a valid date of birth')
    .custom((value) => {
      const age = (Date.now() - new Date(value).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      if (age < 18) throw new Error('You must be at least 18 years old');
      return true;
    }),
  handleValidationErrors,
];

const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

const validatePackage = [
  body('name').trim().notEmpty().withMessage('Package name is required'),
  body('type').isIn(['single', 'day', 'week']).withMessage('Package type must be single, day, or week'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('price').isNumeric().withMessage('Price must be a number').isFloat({ min: 0 }).withMessage('Price cannot be negative'),
  handleValidationErrors,
];

const validateReview = [
  body('packageId').notEmpty().withMessage('Package ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').trim().notEmpty().withMessage('Review title is required'),
  body('text').trim().isLength({ min: 10 }).withMessage('Review must be at least 10 characters'),
  handleValidationErrors,
];

const validateContact = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  handleValidationErrors,
];

const validatePasswordUpdate = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
    .matches(/\d/).withMessage('New password must contain at least one number'),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validatePackage,
  validateReview,
  validateContact,
  validatePasswordUpdate,
};
