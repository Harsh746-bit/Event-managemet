/**
 * CampusConnect Final App - Validation Middleware
 * Practical 6 & 7: Input & Request Validation
 */

const mongoose = require('mongoose');

// Helper to check if string is a valid MongoDB ObjectId or Alphanumeric Code
exports.isValidIdParam = (id) => {
  if (!id || typeof id !== 'string') return false;
  const cleanId = id.trim();
  // Valid if 24-char hex ObjectId OR standard format EVT-XXXX / REG-XXXX
  return (
    mongoose.Types.ObjectId.isValid(cleanId) ||
    /^[A-Za-z0-9\-_]{3,40}$/.test(cleanId)
  );
};

// Validate ID Parameter Middleware
exports.validateIdParam = (req, res, next) => {
  const { id } = req.params;
  if (!exports.isValidIdParam(id)) {
    return res.status(400).json({
      success: false,
      message: `Invalid ID parameter format: '${id}'. Must be a valid identifier.`,
      field: 'id'
    });
  }
  next();
};

// Validate Registration Payload
exports.validateRegistration = (req, res, next) => {
  const { fullName, email, phone, studentId, eventId, department } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Full name must be at least 2 characters.',
      field: 'fullName'
    });
  }

  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Please enter a valid university email address.',
      field: 'email'
    });
  }

  if (!phone || typeof phone !== 'string' || !phoneRegex.test(phone.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Mobile phone number must be exactly 10 digits.',
      field: 'phone'
    });
  }

  if (!studentId || typeof studentId !== 'string' || studentId.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Student ID / PRN is required (min 3 chars).',
      field: 'studentId'
    });
  }

  if (!eventId || typeof eventId !== 'string' || eventId.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Target event ID is required.',
      field: 'eventId'
    });
  }

  if (!department || typeof department !== 'string' || department.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Academic department is required.',
      field: 'department'
    });
  }

  next();
};

// Validate Event Creation Payload (POST /api/events)
exports.validateEvent = (req, res, next) => {
  const { title, category, date, time, location, capacity, description, department } = req.body;

  const validCategories = [
    'Technology',
    'Workshop',
    'Cultural',
    'Sports',
    'Competition',
    'Club',
    'Seminar',
    'Academic',
    'Other'
  ];

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Event title is required and must be at least 3 characters.',
      field: 'title'
    });
  }

  if (!category || typeof category !== 'string' || !validCategories.includes(category.trim())) {
    return res.status(400).json({
      success: false,
      message: `Validation Error: Category must be one of: ${validCategories.join(', ')}`,
      field: 'category'
    });
  }

  if (!date || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Event date must follow YYYY-MM-DD format.',
      field: 'date'
    });
  }

  if (!time || typeof time !== 'string' || time.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Event time is required (e.g., "10:00 AM").',
      field: 'time'
    });
  }

  if (!location || typeof location !== 'string' || location.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Event location / venue is required.',
      field: 'location'
    });
  }

  const numCapacity = Number(capacity);
  if (isNaN(numCapacity) || numCapacity <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Event capacity must be a positive number greater than 0.',
      field: 'capacity'
    });
  }

  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Description must be at least 10 characters long.',
      field: 'description'
    });
  }

  if (!department || typeof department !== 'string' || department.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Organizing department or student club is required.',
      field: 'department'
    });
  }

  next();
};

// Validate Event Update Payload (PUT/PATCH /api/events/:id)
exports.validateEventUpdate = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Request body cannot be empty for update operations.'
    });
  }

  const { capacity, registered } = req.body;
  if (capacity !== undefined && (isNaN(Number(capacity)) || Number(capacity) <= 0)) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Capacity must be a positive number.',
      field: 'capacity'
    });
  }

  if (registered !== undefined && (isNaN(Number(registered)) || Number(registered) < 0)) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Registered count cannot be negative.',
      field: 'registered'
    });
  }

  next();
};
