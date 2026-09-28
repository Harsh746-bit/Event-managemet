/**
 * CampusConnect - Registration Routes
 * Practical No. 05
 */

const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { validateRegistration } = require('../middleware/validation');

// Routes
router.get('/', registrationController.getRegistrations);
router.get('/:id', registrationController.getRegistrationById);
router.post('/', validateRegistration, registrationController.createRegistration);
router.delete('/:id', registrationController.cancelRegistration);

module.exports = router;
