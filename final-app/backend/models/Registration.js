/**
 * CampusConnect - Registration Mongoose Schema & Model
 * Practical 7: MongoDB Integration
 */

const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'Registration Pass ID is required (e.g., REG-1042)'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true
    },
    eventId: {
      type: String,
      required: [true, 'Target event ID is required'],
      trim: true,
      index: true
    },
    eventTitle: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true
    },
    studentName: {
      type: String,
      required: [true, 'Student full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters']
    },
    email: {
      type: String,
      required: [true, 'University email is required'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid university email address']
    },
    phone: {
      type: String,
      required: [true, 'Contact phone number is required'],
      trim: true,
      match: [/^[0-9]{10}$/, 'Mobile phone number must be exactly 10 digits']
    },
    studentId: {
      type: String,
      required: [true, 'Student ID / PRN is required'],
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Academic department is required'],
      trim: true
    },
    year: {
      type: String,
      default: '3rd Year',
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year']
    },
    date: {
      type: String,
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      }
    }
  }
);

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;
