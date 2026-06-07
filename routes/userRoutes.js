const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { uploadAvatar } = require('../middleware/upload');

router.get('/profile',    protect, userController.getProfile);
router.put('/profile',    protect, userController.updateProfile);
router.put('/avatar',     protect, uploadAvatar, userController.uploadAvatar);
router.delete('/avatar',  protect, userController.removeAvatar);
router.delete('/account', protect, userController.deleteAccount);

router.get('/',                protect, authorize('Admin'), userController.getAllUsers);
router.patch('/:id/status',    protect, authorize('Admin'), userController.updateUserStatus);
router.patch('/:id/role',      protect, authorize('Admin'), userController.updateUserRole);
router.patch('/:id/profile',   protect, authorize('Admin'), userController.adminUpdateUserProfile);
router.delete('/:id',          protect, authorize('Admin'), userController.deleteUser);

module.exports = router;
