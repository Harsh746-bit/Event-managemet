/**
 * CampusConnect - Express Validation Middleware
 * Practical No. 05
 */

exports.validateRegistration = (req, res, next) => {
  const { fullName, email, phone, studentId, eventId, department } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Full name must be at least 2 characters long.',
      field: 'fullName'
    });
  }

  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Invalid university email address format.',
      field: 'email'
    });
  }

  if (!phone || typeof phone !== 'string' || !phoneRegex.test(phone.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Phone number must be exactly 10 digits.',
      field: 'phone'
    });
  }

  if (!studentId || typeof studentId !== 'string' || studentId.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Student ID / PRN is required.',
      field: 'studentId'
    });
  }

  if (!eventId || typeof eventId !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Target event ID is required.',
      field: 'eventId'
    });
  }

  if (!department || typeof department !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Academic department is required.',
      field: 'department'
    });
  }

  next();
};
