/**
 * CampusConnect - Event Controller
 * Practical No. 05
 */

const fs = require('fs');
const path = require('path');

const EVENTS_FILE = path.join(__dirname, '..', 'data', 'events.json');
const REGISTRATIONS_FILE = path.join(__dirname, '..', 'data', 'registrations.json');

const readData = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8') || '[]');
  } catch (err) {
    return [];
  }
};

const writeData = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
};

// GET /api/events
exports.getEvents = (req, res, next) => {
  try {
    let events = readData(EVENTS_FILE);
    const { category, search } = req.query;

    if (category && category.toLowerCase() !== 'all') {
      events = events.filter(e => e.category.toLowerCase() === category.toLowerCase());
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      events = events.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
      );
    }

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/events/:id
exports.getEventById = (req, res, next) => {
  try {
    const { id } = req.params;
    const events = readData(EVENTS_FILE);
    const found = events.find(e => e.id.toLowerCase() === id.toLowerCase());

    if (!found) {
      return res.status(404).json({
        success: false,
        message: `Event with ID '${id}' was not found.`
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

// PATCH /api/events/:id
exports.updateEvent = (req, res, next) => {
  try {
    const { id } = req.params;
    const events = readData(EVENTS_FILE);
    const index = events.findIndex(e => e.id.toLowerCase() === id.toLowerCase());

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Event with ID '${id}' was not found.`
      });
    }

    // Update allowed fields
    const updated = { ...events[index], ...req.body };
    events[index] = updated;
    writeData(EVENTS_FILE, events);

    res.status(200).json({
      success: true,
      message: `Event '${id}' updated successfully.`,
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/statistics
exports.getStatistics = (req, res, next) => {
  try {
    const events = readData(EVENTS_FILE);
    const registrations = readData(REGISTRATIONS_FILE);

    const totalCapacity = events.reduce((sum, e) => sum + e.capacity, 0);
    const totalRegistered = events.reduce((sum, e) => sum + e.registered, 0);

    res.status(200).json({
      success: true,
      data: {
        totalEvents: events.length,
        activeClubs: 32,
        totalRegistrations: totalRegistered,
        activePassesCount: registrations.length,
        totalCapacity: totalCapacity,
        availableSeats: Math.max(0, totalCapacity - totalRegistered),
        eventsThisWeek: 18
      }
    });
  } catch (err) {
    next(err);
  }
};
