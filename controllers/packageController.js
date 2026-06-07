const Package = require('../models/Package');
const { AppError } = require('../app');

class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  sort() {
    this.query = this.queryString.sort
      ? this.query.sort(this.queryString.sort.split(',').join(' '))
      : this.query.sort('-createdAt');
    return this;
  }

  limitFields() {
    this.query = this.queryString.fields
      ? this.query.select(this.queryString.fields.split(',').join(' '))
      : this.query.select('-__v');
    return this;
  }

  paginate() {
    const p = parseInt(this.queryString.page) || 1;
    const l = parseInt(this.queryString.limit) || 20;
    this.query = this.query.skip((p - 1) * l).limit(l);
    return this;
  }
}

const getAllPackages = async (req, res, next) => {
  try {
    const filter = { status: 'active' };
    if (req.query.type) filter.type = req.query.type;
    if (req.query.city) filter.city = req.query.city;

    const features = new ApiFeatures(Package.find(filter), req.query)
      .sort()
      .limitFields()
      .paginate();

    const packages = await features.query;

    res.status(200).json({
      status: 'success',
      results: packages.length,
      data: { packages },
    });
  } catch (err) {
    next(err);
  }
};

const getPackage = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return next(new AppError('Package not found.', 404));

    res.status(200).json({ status: 'success', data: { package: pkg } });
  } catch (err) {
    next(err);
  }
};

const createPackage = async (req, res, next) => {
  try {
    const pkg = await Package.create(req.body);
    res.status(201).json({ status: 'success', data: { package: pkg } });
  } catch (err) {
    next(err);
  }
};

const updatePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!pkg) return next(new AppError('Package not found.', 404));

    res.status(200).json({ status: 'success', data: { package: pkg } });
  } catch (err) {
    next(err);
  }
};

const deletePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) return next(new AppError('Package not found.', 404));

    res.status(200).json({
      status: 'success',
      message: 'Package deleted successfully.',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

const uploadPackageImage = async (req, res, next) => {
  try {
    if (!req.file) return next(new AppError('Please upload an image file.', 400));

    const imageUrl = req.file.path;
    const pkg = await Package.findByIdAndUpdate(req.params.id, { image: imageUrl }, { new: true });
    if (!pkg) return next(new AppError('Package not found.', 404));

    res.status(200).json({ status: 'success', data: { package: pkg, imageUrl } });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
  uploadPackageImage,
};
