/**
 * CampusConnect Final App - Event Routes
 * Practical 6: RESTful CRUD Endpoints
 */

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const {
  validateEvent,
  validateEventUpdate,
  validateIdParam
} = require('../middleware/validation');

// GET /api/events - Retrieve all events (with optional filtering)
router.get('/', eventController.getEvents);

// GET /api/events/:id - Retrieve single event by ID
router.get('/:id', validateIdParam, eventController.getEventById);

// POST /api/events - Create new event
router.post('/', validateEvent, eventController.createEvent);

// PUT /api/events/:id - Update existing event
router.put('/:id', validateIdParam, validateEventUpdate, eventController.updateEvent);

// PATCH /api/events/:id - Partial update (preserved for backward compatibility)
router.patch('/:id', validateIdParam, validateEventUpdate, eventController.updateEvent);

// DELETE /api/events/:id - Delete an event
router.delete('/:id', validateIdParam, eventController.deleteEvent);

module.exports = router;
