const User = require('../models/User');

// GET /api/users - Retrieve all users with optional role or status filter
exports.getUsers = async (req, res, next) => {
  try {
    const { role, status } = req.query;
    const filter = {};
    if (role) filter.role = role.toLowerCase();
    if (status) filter.status = status.toLowerCase();

    const users = await User.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/users - Create new student or organizer application
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, role, clubName, department, studentId, year, status } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    let existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'User already exists.',
        data: existing
      });
    }

    const customId = role === 'organizer' 
      ? `ORG-${Date.now().toString().slice(-4)}`
      : role === 'admin'
      ? 'ADMIN-MASTER-01'
      : `STU-${Date.now().toString().slice(-4)}`;

    const userStatus = status || (role === 'organizer' ? 'pending' : 'active');
    const avatar = name.slice(0, 2).toUpperCase();

    const newUser = await User.create({
      id: customId,
      name: name.trim(),
      email: cleanEmail,
      role: role || 'student',
      clubName: clubName || '',
      department: department || 'Computer Science',
      studentId: studentId || '',
      year: year || '3rd Year',
      status: userStatus,
      avatar
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully in database.',
      data: newUser
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/:id/status - Approve or reject organizer
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await User.findOneAndUpdate(
      { $or: [{ id: id }, { email: id.toLowerCase() }] },
      { status },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: `User status updated to ${status}.`,
      data: user
    });
  } catch (err) {
    next(err);
  }
};
