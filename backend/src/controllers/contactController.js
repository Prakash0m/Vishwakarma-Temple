import ContactMessage from '../models/ContactMessage.js';

// @desc    Get all contact messages (search, status filter)
// @route   GET /api/contact
// @access  Private
export const getContactMessages = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await ContactMessage.countDocuments(query);
    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit public contact inquiry
// @route   POST /api/contact
// @access  Public
export const submitContactMessage = async (req, res, next) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your name, phone number, and message'
      });
    }

    const newMessage = await ContactMessage.create({
      name,
      phone,
      email: email || '',
      subject: subject || 'सामान्य सोधपुछ',
      message,
      status: 'New'
    });

    res.status(201).json({
      success: true,
      message: 'तपाईंको सन्देश सफलतापूर्वक पठाइयो। मन्दिर समितिले चाँडै सम्पर्क गर्नेछ। (Your message was sent successfully!)',
      data: newMessage
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact message status & admin notes
// @route   PUT /api/contact/:id
// @access  Private
export const updateContactMessage = async (req, res, next) => {
  try {
    const updated = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Message status updated',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private
export const deleteContactMessage = async (req, res, next) => {
  try {
    const deleted = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.status(200).json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    next(error);
  }
};
