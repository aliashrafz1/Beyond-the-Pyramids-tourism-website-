const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

const { validateReview } = require('../middleware/validate');
const { uploadReviewPhotos } = require('../middleware/upload');

router.post('/', protect, validateReview, reviewController.createReview);
router.post('/:id/photos', protect, uploadReviewPhotos, reviewController.uploadReviewPhotos);
router.get('/mine', protect, reviewController.getMyReviews);
router.get('/package/:packageId', reviewController.getPackageReviews);
router.get('/', protect, authorize('Admin'), reviewController.getAllReviews);
router.delete('/:id', protect, reviewController.deleteReview);

module.exports = router;
