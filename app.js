require('dotenv').config();

const express       = require('express');
const path          = require('path');
const helmet        = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit     = require('express-rate-limit');
const cookieParser  = require('cookie-parser');
const mongoose      = require('mongoose');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith('4') ? 'fail' : 'error';
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status     = err.status     || 'error';

  if (err.name === 'CastError')         err = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  if (err.code === 11000)               err = new AppError(`Duplicate value for field: ${Object.keys(err.keyValue)[0]}.`, 400);
  if (err.name === 'ValidationError')   err = new AppError(`Invalid input: ${Object.values(err.errors).map(e => e.message).join('. ')}`, 400);
  if (err.name === 'JsonWebTokenError') err = new AppError('Invalid token. Please log in again.', 401);
  if (err.name === 'TokenExpiredError') err = new AppError('Token expired. Please log in again.', 401);

  if (req.path.startsWith('/api')) {
    return res.status(err.statusCode).json({ status: err.status, message: err.message });
  }

  if (err.statusCode === 401) return res.redirect('/login');
  if (err.statusCode === 403) return res.status(403).render('error403', { message: err.message });
  if (err.statusCode === 404) return res.status(404).render('error404', { message: err.message });
  return res.status(500).render('error500', { message: err.message });
};

module.exports.AppError = AppError;

const authRoutes    = require('./routes/authRoutes');
const userRoutes    = require('./routes/userRoutes');
const packageRoutes = require('./routes/packageRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes  = require('./routes/reviewRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes   = require('./routes/adminRoutes');
const pageRoutes    = require('./routes/pageRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next(); });
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(mongoSanitize());
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: { status: 'fail', message: 'Too many requests.' } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth',     authRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews',  reviewRoutes);
app.use('/api/contact',  contactRoutes);
app.use('/api/admin',    adminRoutes);
app.use('/',             pageRoutes);

app.get('/api/external/weather', async (req, res) => {
  try {
    const city = req.query.city;
    if (!city) return res.status(400).json({ status: 'fail', message: 'city is required' });
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) return res.status(503).json({ status: 'fail', message: 'Weather service not configured' });
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},EG&units=metric&appid=${apiKey}`);
    const data = await response.json();
    if (!response.ok) return res.status(502).json({ status: 'fail', message: 'Weather data unavailable' });
    res.json({ status: 'success', data: { city: data.name, temp: Math.round(data.main.temp), description: data.weather[0].description, icon: data.weather[0].icon } });
  } catch (err) { res.status(500).json({ status: 'fail', message: 'Weather service error' }); }
});

app.get('/api/external/currency', async (req, res) => {
  try {
    const amount = parseFloat(req.query.amount);
    const from = req.query.from || 'EGP';
    if (!amount || isNaN(amount)) return res.status(400).json({ status: 'fail', message: 'Valid amount is required' });
    const response = await fetch(`https://open.exchangerate-api.com/v6/latest/${from}`);
    const data = await response.json();
    if (!response.ok || data.result !== 'success') return res.status(502).json({ status: 'fail', message: 'Currency data unavailable' });
    const r = data.rates;
    res.json({ status: 'success', data: { from, amount, USD: Math.round(amount * r.USD), EUR: Math.round(amount * r.EUR), GBP: Math.round(amount * r.GBP) } });
  } catch (err) { res.status(500).json({ status: 'fail', message: 'Currency service error' }); }
});

app.use((req, res, next) => next(new AppError(`Route ${req.originalUrl} not found`, 404)));
app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => { console.error('MongoDB connection error:', err.message); process.exit(1); });