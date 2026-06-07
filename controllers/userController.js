const User = require('../models/User');
const { AppError } = require('../app');
const cloudinary = require('cloudinary').v2;

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ status: 'success', data: { user } });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, nationality, dob } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, nationality, dob },
      { new: true, runValidators: true }
    );
    res.status(200).json({ status: 'success', data: { user: updatedUser } });
  } catch (err) {
    next(err);
  }
};

const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) return next(new AppError('Please upload an image file.', 400));

    const imageUrl = req.file.path;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { image: imageUrl },
      { new: true }
    );

    res.status(200).json({ status: 'success', data: { user: updatedUser, imageUrl } });
  } catch (err) {
    next(err);
  }
};

const removeAvatar = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { image: null },
      { new: true }
    );
    res.status(200).json({ status: 'success', data: { user: updatedUser } });
  } catch (err) {
    next(err);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.cookie('jwt', 'loggedout', { httpOnly: true, maxAge: 10 * 1000 });
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.role)   filter.role   = req.query.role;
    if (req.query.status) filter.status = req.query.status;

    const users = await User.find(filter).skip(skip).limit(limit).sort('-createdAt');
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

const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['active', 'suspended'].includes(status)) {
      return next(new AppError('Status must be active or suspended.', 400));
    }

    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!user) return next(new AppError('User not found.', 404));

    res.status(200).json({ status: 'success', data: { user } });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(new AppError('User not found.', 404));

    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    next(err);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['Tourist', 'Admin'].includes(role)) {
      return next(new AppError('Invalid role.', 400));
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return next(new AppError('User not found.', 404));

    res.status(200).json({ status: 'success', data: { user } });
  } catch (err) {
    next(err);
  }
};

const adminUpdateUserProfile = async (req, res, next) => {
  try {
    const { name, phone, nationality, image, removeImage } = req.body;
    const update = {};
    if (name)        update.name        = name;
    if (phone)       update.phone       = phone;
    if (nationality) update.nationality = nationality;

    if (removeImage) {
      update.image = null;
    } else if (image && image.startsWith('data:')) {
      const result = await cloudinary.uploader.upload(image, {
        folder: 'beyond-pyramids/avatars',
        transformation: [{ width: 400, height: 400, crop: 'fill', quality: 'auto' }],
      });
      update.image = result.secure_url;
    } else if (image) {
      update.image = image;
    }

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!user) return next(new AppError('User not found.', 404));

    res.status(200).json({ status: 'success', data: { user } });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
  removeAvatar,
  deleteAccount,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  updateUserRole,
  adminUpdateUserProfile,
};
