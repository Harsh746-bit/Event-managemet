/**
 * CampusConnect Final App - Event Routes
 */

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);
router.patch('/:id', eventController.updateEvent);

module.exports = router;
