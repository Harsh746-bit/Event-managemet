/**
 * CampusConnect - Event Mongoose Schema & Model
 * Practical 7: MongoDB Integration
 */

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'Event ID is required (e.g., EVT-1001)'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      minlength: [3, 'Event title must be at least 3 characters'],
      maxlength: [150, 'Event title cannot exceed 150 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: {
        values: [
          'Technology',
          'Workshop',
          'Cultural',
          'Sports',
          'Competition',
          'Club',
          'Seminar',
          'Academic',
          'Other'
        ],
        message: '{VALUE} is not a valid category'
      }
    },
    date: {
      type: String,
      required: [true, 'Event date is required (YYYY-MM-DD)'],
      trim: true
    },
    time: {
      type: String,
      required: [true, 'Event time is required (e.g., 10:00 AM)'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Event location/venue is required'],
      trim: true
    },
    capacity: {
      type: Number,
      required: [true, 'Total event capacity is required'],
      min: [1, 'Capacity must be at least 1 seat']
    },
    registered: {
      type: Number,
      default: 0,
      min: [0, 'Registered count cannot be negative']
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters']
    },
    status: {
      type: String,
      enum: ['Registration Open', 'Registration Closed', 'Upcoming', 'Completed'],
      default: 'Registration Open'
    },
    department: {
      type: String,
      required: [true, 'Host department or student club is required'],
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        // Expose availableSeats virtual calculation in JSON
        ret.availableSeats = Math.max(0, ret.capacity - ret.registered);
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Virtual for available seats
eventSchema.virtual('availableSeats').get(function () {
  return Math.max(0, this.capacity - this.registered);
});

// Auto-update status before saving if capacity is reached
eventSchema.pre('save', function () {
  if (this.registered >= this.capacity && this.status === 'Registration Open') {
    this.status = 'Registration Closed';
  } else if (this.registered < this.capacity && this.status === 'Registration Closed') {
    this.status = 'Registration Open';
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
