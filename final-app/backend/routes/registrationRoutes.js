/**
 * CampusConnect Final App - Registration Routes
 * Practical 6 & 7: RESTful Operations & MongoDB
 */

const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { validateRegistration, validateIdParam } = require('../middleware/validation');

// GET /api/registrations - Retrieve all registrations
router.get('/', registrationController.getRegistrations);

// GET /api/registrations/:id - Retrieve single registration by ID
router.get('/:id', validateIdParam, registrationController.getRegistrationById);

// POST /api/registrations - Create new registration
router.post('/', validateRegistration, registrationController.createRegistration);

// PUT /api/registrations/:id - Update registration details
router.put('/:id', validateIdParam, registrationController.updateRegistration);

// DELETE /api/registrations/:id - Cancel registration & release seat
router.delete('/:id', validateIdParam, registrationController.cancelRegistration);

module.exports = router;
