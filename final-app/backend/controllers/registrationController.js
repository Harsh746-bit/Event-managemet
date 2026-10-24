/**
 * CampusConnect Final App - Registration Controller
 * Practical 6: RESTful Operations
 * Practical 7: MongoDB & Mongoose Integration
 */

const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const Event = require('../models/Event');

// Helper to construct query for custom ID (REG-1042) or MongoDB ObjectId
const buildRegistrationQuery = (id) => {
  if (!id) return null;
  const cleanId = String(id).trim();
  if (mongoose.Types.ObjectId.isValid(cleanId)) {
    return {
      $or: [{ id: cleanId.toUpperCase() }, { _id: cleanId }]
    };
  }
  return { id: cleanId.toUpperCase() };
};

// Helper for event lookup
const buildEventQuery = (id) => {
  if (!id) return null;
  const cleanId = String(id).trim();
  if (mongoose.Types.ObjectId.isValid(cleanId)) {
    return {
      $or: [{ id: cleanId.toUpperCase() }, { _id: cleanId }]
    };
  }
  return { id: cleanId.toUpperCase() };
};

// GET /api/registrations - Retrieve all registrations
exports.getRegistrations = async (req, res, next) => {
  try {
    const { eventId, studentId, email } = req.query;
    const filter = {};

    if (eventId) filter.eventId = eventId.trim().toUpperCase();
    if (studentId) filter.studentId = studentId.trim();
    if (email) filter.email = email.trim().toLowerCase();

    const registrations = await Registration.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/registrations/:id - Retrieve single registration by ID
exports.getRegistrationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = buildRegistrationQuery(id);
    const found = await Registration.findOne(query);

    if (!found) {
      return res.status(404).json({
        success: false,
        message: `Registration with ID '${id}' was not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: found
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/registrations - Create a registration & reserve seat in MongoDB
exports.createRegistration = async (req, res, next) => {
  try {
    const { fullName, email, phone, studentId, eventId, department, year } = req.body;

    // Check if target event exists
    const eventQuery = buildEventQuery(eventId);
    const targetEvent = await Event.findOne(eventQuery);

    if (!targetEvent) {
      return res.status(404).json({
        success: false,
        message: `Target event '${eventId}' does not exist.`
      });
    }

    // Check available capacity
    const availableSeats = targetEvent.capacity - targetEvent.registered;
    if (availableSeats <= 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot register: '${targetEvent.title}' has reached full capacity.`
      });
    }

    // Prevent duplicate registration for the same student PRN on the same event
    const existingRegistration = await Registration.findOne({
      eventId: targetEvent.id,
      studentId: studentId.trim()
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: `Student ID '${studentId}' has already registered for '${targetEvent.title}'. Pass ID: ${existingRegistration.id}`
      });
    }

    // Generate unique Pass ID
    let passId = `REG-${Math.floor(1000 + Math.random() * 9000)}`;
    let exists = await Registration.findOne({ id: passId });
    while (exists) {
      passId = `REG-${Math.floor(1000 + Math.random() * 9000)}`;
      exists = await Registration.findOne({ id: passId });
    }

    // Create registration record
    const newRegistration = await Registration.create({
      id: passId,
      eventId: targetEvent.id,
      eventTitle: targetEvent.title,
      studentName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      studentId: studentId.trim(),
      department: department.trim(),
      year: year || '3rd Year',
      date: targetEvent.date,
      timestamp: new Date()
    });

    // Update event capacity in MongoDB
    targetEvent.registered += 1;
    if (targetEvent.registered >= targetEvent.capacity) {
      targetEvent.status = 'Registration Closed';
    }
    await targetEvent.save();

    res.status(201).json({
      success: true,
      message: 'Registration confirmed successfully.',
      data: newRegistration
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/registrations/:id - Update registration details
exports.updateRegistration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = buildRegistrationQuery(id);

    const registration = await Registration.findOne(query);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: `Registration with ID '${id}' was not found.`
      });
    }

    // Disallow altering immutable pass ID or eventId
    delete req.body.id;
    delete req.body.eventId;

    const updated = await Registration.findOneAndUpdate(query, req.body, {
      returnDocument: 'after',
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: `Registration '${id}' updated successfully.`,
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/registrations/:id - Cancel registration & release seat in MongoDB
exports.cancelRegistration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = buildRegistrationQuery(id);

    const found = await Registration.findOne(query);
    if (!found) {
      return res.status(404).json({
        success: false,
        message: `Registration with ID '${id}' was not found.`
      });
    }

    // Remove registration from MongoDB
    await Registration.findOneAndDelete(query);

    // Release seat in target event
    const event = await Event.findOne({ id: found.eventId });
    if (event && event.registered > 0) {
      event.registered -= 1;
      if (event.status === 'Registration Closed') {
        event.status = 'Registration Open';
      }
      await event.save();
    }

    res.status(200).json({
      success: true,
      message: `Registration '${id}' successfully cancelled. Seat released.`,
      data: found
    });
  } catch (err) {
    next(err);
  }
};
