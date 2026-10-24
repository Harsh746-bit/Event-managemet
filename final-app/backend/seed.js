/**
 * CampusConnect - Database Seeder Script
 * Practical 7: Safe Database Initialization
 * Populates MongoDB with default campus events and registrations if collections are empty.
 */

require('dotenv').config();
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Event = require('./models/Event');
const Registration = require('./models/Registration');

const EVENTS_FILE = path.join(__dirname, 'data', 'events.json');
const REGISTRATIONS_FILE = path.join(__dirname, 'data', 'registrations.json');

const seedData = async () => {
  const isForce = process.argv.includes('--force');

  try {
    await connectDB();
    console.log('[Seeder] Database connected successfully.');

    if (isForce) {
      console.warn('[Seeder] --force flag detected: Clearing existing collections...');
      await Event.deleteMany({});
      await Registration.deleteMany({});
    }

    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      const rawEvents = JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf8') || '[]');
      await Event.insertMany(rawEvents);
      console.log(`[Seeder] Seeded ${rawEvents.length} initial campus events into MongoDB.`);
    } else {
      console.log(`[Seeder] Events collection already contains ${eventCount} records. Skipping event seeding.`);
    }

    const registrationCount = await Registration.countDocuments();
    if (registrationCount === 0) {
      const rawRegistrations = JSON.parse(fs.readFileSync(REGISTRATIONS_FILE, 'utf8') || '[]');
      await Registration.insertMany(rawRegistrations);
      console.log(`[Seeder] Seeded ${rawRegistrations.length} initial registrations into MongoDB.`);
    } else {
      console.log(`[Seeder] Registrations collection already contains ${registrationCount} records. Skipping registration seeding.`);
    }

    console.log('[Seeder] Database seeding finished successfully.');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error(`[Seeder Error] ${err.message}`);
    process.exit(1);
  }
};

seedData();
