/**
 * CampusConnect Final App - Registration Controller
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

// GET /api/registrations
exports.getRegistrations = (req, res, next) => {
  try {
    const registrations = readData(REGISTRATIONS_FILE);
    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/registrations/:id
exports.getRegistrationById = (req, res, next) => {
  try {
    const { id } = req.params;
    const registrations = readData(REGISTRATIONS_FILE);
    const found = registrations.find(r => r.id.toLowerCase() === id.toLowerCase());

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

// POST /api/registrations
exports.createRegistration = (req, res, next) => {
  try {
    const { fullName, email, phone, studentId, eventId, department, year } = req.body;

    const events = readData(EVENTS_FILE);
    const eventIndex = events.findIndex(e => e.id === eventId);

    if (eventIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Target event '${eventId}' does not exist.`
      });
    }

    const targetEvent = events[eventIndex];
    const availableSeats = targetEvent.capacity - targetEvent.registered;

    if (availableSeats <= 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot register: '${targetEvent.title}' has reached full capacity.`
      });
    }

    const passId = "REG-" + Math.floor(1000 + Math.random() * 9000);
    const newRegistration = {
      id: passId,
      eventId: targetEvent.id,
      eventTitle: targetEvent.title,
      studentName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      studentId: studentId.trim(),
      department: department.trim(),
      year: year || "3rd Year",
      date: targetEvent.date,
      timestamp: new Date().toISOString()
    };

    // Update event capacity
    targetEvent.registered += 1;
    if (targetEvent.registered >= targetEvent.capacity) {
      targetEvent.status = "Registration Closed";
    }

    // Persist
    const registrations = readData(REGISTRATIONS_FILE);
    registrations.unshift(newRegistration);

    writeData(REGISTRATIONS_FILE, registrations);
    writeData(EVENTS_FILE, events);

    res.status(201).json({
      success: true,
      message: 'Registration confirmed successfully.',
      data: newRegistration
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/registrations/:id
exports.cancelRegistration = (req, res, next) => {
  try {
    const { id } = req.params;
    const registrations = readData(REGISTRATIONS_FILE);
    const regIndex = registrations.findIndex(r => r.id.toLowerCase() === id.toLowerCase());

    if (regIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Registration with ID '${id}' was not found.`
      });
    }

    const removed = registrations[regIndex];
    registrations.splice(regIndex, 1);

    // Free seat in event
    const events = readData(EVENTS_FILE);
    const eventIndex = events.findIndex(e => e.id === removed.eventId);
    if (eventIndex !== -1 && events[eventIndex].registered > 0) {
      events[eventIndex].registered -= 1;
      if (events[eventIndex].status === "Registration Closed") {
        events[eventIndex].status = "Registration Open";
      }
      writeData(EVENTS_FILE, events);
    }

    writeData(REGISTRATIONS_FILE, registrations);

    res.status(200).json({
      success: true,
      message: `Registration '${id}' successfully cancelled. Seat released.`,
      data: removed
    });
  } catch (err) {
    next(err);
  }
};
