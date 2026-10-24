/**
 * CampusConnect - Database Connection Module
 * Handles MongoDB connection lifecycle via Mongoose
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusconnect';

  // Sanitize URI for safe logging (mask username and password if in Atlas URI)
  const sanitizedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    console.log(`[MongoDB] Target database: ${conn.connection.name}`);
    console.log(`[MongoDB] Connection URI: ${sanitizedUri}`);

    return conn;
  } catch (err) {
    console.error(`[MongoDB] Connection Error: ${err.message}`);
    // In production or when DB is mandatory, we log warning; we don't crash blindly
    throw err;
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Warning: Database connection lost.');
});

mongoose.connection.on('reconnected', () => {
  console.log('[MongoDB] Database reconnected.');
});

// Graceful application shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('[MongoDB] Connection closed due to application termination.');
    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
});

module.exports = connectDB;
