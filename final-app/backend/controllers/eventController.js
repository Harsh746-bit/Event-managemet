/**
 * CampusConnect Final App - Event Controller
 * Practical 6: RESTful CRUD API
 * Practical 7: MongoDB & Mongoose Integration
 */

const mongoose = require('mongoose');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

// Helper to construct query that matches either custom ID (e.g. EVT-1001) or MongoDB ObjectId
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

// GET /api/events - Retrieve all events with filtering and search
exports.getEvents = async (req, res, next) => {
  try {
    const { category, search, status, sort } = req.query;
    const filter = {};

    // Filter by Category
    if (category && category.toLowerCase() !== 'all') {
      filter.category = new RegExp(`^${category.trim()}$`, 'i');
    }

    // Filter by Status
    if (status && status.toLowerCase() !== 'all') {
      filter.status = new RegExp(`^${status.trim()}$`, 'i');
    }

    // Full text search across title, description, location, department
    if (search && search.trim() !== '') {
      const q = search.trim();
      const regex = new RegExp(q, 'i');
      filter.$or = [
        { title: regex },
        { category: regex },
        { location: regex },
        { description: regex },
        { department: regex }
      ];
    }

    // Sort order (default: ascending by date)
    let sortOptions = { date: 1 };
    if (sort === 'capacity') sortOptions = { capacity: -1 };
    if (sort === 'recent') sortOptions = { createdAt: -1 };

    const events = await Event.find(filter).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/events/:id - Retrieve single event by custom ID or ObjectId
exports.getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = buildEventQuery(id);
    const event = await Event.findOne(query);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event with ID '${id}' was not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/events - Create a new event (Practical 6: Create)
exports.createEvent = async (req, res, next) => {
  try {
    const {
      id,
      title,
      category,
      date,
      time,
      location,
      capacity,
      description,
      department,
      status
    } = req.body;

    // Generate custom ID if not provided (e.g., EVT-1009)
    let customId = id ? String(id).trim().toUpperCase() : null;
    if (!customId) {
      const count = await Event.countDocuments();
      customId = `EVT-${1000 + count + 1}`;
    }

    // Verify uniqueness
    const existing = await Event.findOne({ id: customId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Event with ID '${customId}' already exists. Please use a unique ID.`
      });
    }

    const newEvent = await Event.create({
      id: customId,
      title: title.trim(),
      category: category.trim(),
      date: date.trim(),
      time: time.trim(),
      location: location.trim(),
      capacity: Number(capacity),
      registered: 0,
      description: description.trim(),
      department: department.trim(),
      status: status || 'Registration Open'
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully.',
      data: newEvent
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/events/:id - Update an existing event (Practical 6: Update)
exports.updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = buildEventQuery(id);

    const event = await Event.findOne(query);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event with ID '${id}' was not found.`
      });
    }

    // If updating capacity, make sure it is not less than currently registered seats
    if (req.body.capacity !== undefined) {
      const newCapacity = Number(req.body.capacity);
      if (newCapacity < event.registered) {
        return res.status(400).json({
          success: false,
          message: `Cannot decrease capacity (${newCapacity}) below already registered students (${event.registered}).`
        });
      }
    }

    // Disallow overriding the immutable unique ID
    if (req.body.id && req.body.id !== event.id) {
      return res.status(400).json({
        success: false,
        message: 'Modifying the primary event ID is not permitted.'
      });
    }

    const updated = await Event.findOneAndUpdate(query, req.body, {
      returnDocument: 'after',
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: `Event '${id}' updated successfully.`,
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/events/:id - Delete an event (Practical 6: Delete)
exports.deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = buildEventQuery(id);

    const event = await Event.findOne(query);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event with ID '${id}' was not found.`
      });
    }

    // Delete associated registrations for consistency
    await Registration.deleteMany({ eventId: event.id });

    // Delete the event
    await Event.findOneAndDelete(query);

    res.status(200).json({
      success: true,
      message: `Event '${id}' and its associated passes were successfully deleted.`,
      data: event
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/statistics - Aggregated campus metrics from MongoDB
exports.getStatistics = async (req, res, next) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Registration.countDocuments();

    const aggregation = await Event.aggregate([
      {
        $group: {
          _id: null,
          totalCapacity: { $sum: '$capacity' },
          totalRegistered: { $sum: '$registered' }
        }
      }
    ]);

    const totalCapacity = aggregation.length > 0 ? aggregation[0].totalCapacity : 0;
    const currentTotalRegistered = aggregation.length > 0 ? aggregation[0].totalRegistered : 0;

    res.status(200).json({
      success: true,
      data: {
        totalEvents,
        activeClubs: 32,
        totalRegistrations: currentTotalRegistered,
        activePassesCount: totalRegistrations,
        totalCapacity,
        availableSeats: Math.max(0, totalCapacity - currentTotalRegistered),
        eventsThisWeek: 18
      }
    });
  } catch (err) {
    next(err);
  }
};
