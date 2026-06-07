const Contact = require('../models/contact');
const { AppError } = require('../app');

const createTicket = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    const ticket = await Contact.create({
      subject,
      email,
      customer: name || '',
      message,
      customerId: req.user ? req.user._id : null,
    });

    res.status(201).json({
      status: 'success',
      message: 'Your message has been received. We will get back to you shortly.',
      data: { ticket },
    });
  } catch (err) {
    next(err);
  }
};

const getAllTickets = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const tickets = await Contact.find(filter)
      .populate('customerId', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: tickets.length,
      data: { tickets },
    });
  } catch (err) {
    next(err);
  }
};

const updateTicketStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const update = {};
    if (status) update.status = status;

    const ticket = await Contact.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!ticket) return next(new AppError('Ticket not found.', 404));

    res.status(200).json({ status: 'success', data: { ticket } });
  } catch (err) {
    next(err);
  }
};

const replyToTicket = async (req, res, next) => {
  try {
    const { reply } = req.body;
    if (!reply || !reply.trim()) return next(new AppError('Reply message is required.', 400));

    const ticket = await Contact.findByIdAndUpdate(
      req.params.id,
      { adminReply: reply.trim(), status: 'resolved' },
      { new: true }
    );
    if (!ticket) return next(new AppError('Ticket not found.', 404));

    res.status(200).json({ status: 'success', data: { ticket } });
  } catch (err) {
    next(err);
  }
};

const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await Contact.find({ customerId: req.user._id }).sort('-createdAt');
    res.status(200).json({ status: 'success', data: { tickets } });
  } catch (err) {
    next(err);
  }
};

module.exports = { createTicket, getAllTickets, updateTicketStatus, replyToTicket, getMyTickets };
