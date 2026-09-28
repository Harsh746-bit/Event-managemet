/**
 * CampusConnect - Event Routes
 * Practical No. 05
 */

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Routes
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);
router.patch('/:id', eventController.updateEvent);

module.exports = router;
