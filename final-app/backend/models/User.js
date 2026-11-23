const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    role: {
      type: String,
      enum: ['student', 'organizer', 'admin'],
      default: 'student'
    },
    clubName: {
      type: String,
      trim: true,
      default: ''
    },
    department: {
      type: String,
      trim: true,
      default: 'General'
    },
    studentId: {
      type: String,
      trim: true,
      default: ''
    },
    year: {
      type: String,
      trim: true,
      default: '1st Year'
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'approved', 'rejected'],
      default: 'active'
    },
    avatar: {
      type: String,
      trim: true,
      default: 'CC'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
