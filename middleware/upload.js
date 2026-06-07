const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const { AppError } = require('../app');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:           'beyond-pyramids/avatars',
    allowed_formats:  ['jpg', 'jpeg', 'png', 'webp'],
    transformation:   [{ width: 400, height: 400, crop: 'fill', quality: 'auto' }],
  },
});

const packageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          'beyond-pyramids/packages',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation:  [{ width: 1200, quality: 'auto' }],
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only JPEG, PNG, and WebP images are allowed.', 400), false);
  }
};

const limits = { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 2 * 1024 * 1024 };

const reviewStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          'beyond-pyramids/reviews',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation:  [{ width: 1000, quality: 'auto' }],
  },
});

const uploadAvatar        = multer({ storage: avatarStorage,  fileFilter, limits }).single('avatar');
const uploadPackageImage  = multer({ storage: packageStorage, fileFilter, limits }).single('image');
const uploadReviewPhotos  = multer({ storage: reviewStorage,  fileFilter, limits }).array('photos', 5);

module.exports = { uploadAvatar, uploadPackageImage, uploadReviewPhotos };
