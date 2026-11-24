/**
 * CampusConnect - Final Full-Stack Express Server
 * Practical 6: RESTful API Implementation
 * Practical 7: MongoDB & Mongoose Integration
 * Serves the REST API for Events, Registrations, and Live Statistics
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const userRoutes = require('./routes/userRoutes');
const { getStatistics } = require('./controllers/eventController');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? [process.env.CLIENT_ORIGIN, 'http://localhost:3000', 'http://localhost:3001']
  : '*';

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Serve frontend static build in production (Single-Service Deployment)
const path = require('path');
const fs = require('fs');
const frontendDist = path.join(__dirname, '../frontend/dist');
const apiDocsHtml = path.join(__dirname, 'public/api-docs.html');
const vanillaDir = path.join(__dirname, '../../practical-02-javascript');

// Serve Vanilla JS Practical 2 if requested
if (fs.existsSync(vanillaDir)) {
  app.use('/vanilla', express.static(vanillaDir));
}

// Interactive REST API Explorer (Practical 6 & 7 Live Tester)
app.get('/api/docs', (req, res) => {
  if (fs.existsSync(apiDocsHtml)) {
    return res.sendFile(apiDocsHtml);
  }
  res.redirect('/api');
});

// API Root Info Route (Serves Interactive Explorer in browser, or JSON for API calls)
app.get('/api', (req, res) => {
  if (req.headers.accept && req.headers.accept.includes('text/html') && fs.existsSync(apiDocsHtml)) {
    return res.sendFile(apiDocsHtml);
  }
  res.status(200).json({
    success: true,
    message: 'CampusConnect Backend API is running!',
    docs: '/api/docs',
    endpoints: [
      { method: 'GET', path: '/api/events' },
      { method: 'POST', path: '/api/events' },
      { method: 'PUT', path: '/api/events/:id' },
      { method: 'DELETE', path: '/api/events/:id' },
      { method: 'GET', path: '/api/registrations' },
      { method: 'POST', path: '/api/registrations' },
      { method: 'DELETE', path: '/api/registrations/:id' },
      { method: 'GET', path: '/api/users' },
      { method: 'POST', path: '/api/users' },
      { method: 'GET', path: '/api/health' },
      { method: 'GET', path: '/api/statistics' }
    ]
  });
});

// API Routes
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/users', userRoutes);
app.get('/api/statistics', getStatistics);

// Health Check & Database Diagnostic Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'healthy',
    uptime: Math.floor(process.uptime()),
    database: {
      type: 'MongoDB',
      status: dbStatus,
      host: mongoose.connection.host || 'unknown',
      name: mongoose.connection.name || 'unknown'
    },
    timestamp: new Date().toISOString()
  });
});

if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.redirect('/api');
  });
}

// Error Handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start Server helper
const startServer = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error('[Startup Warning] MongoDB connection failed:', err.message);
  }

  const server = app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(` CampusConnect Final Full-Stack Backend API     `);
    console.log(` Practical 6: RESTful CRUD API                  `);
    console.log(` Practical 7: MongoDB (Mongoose) Integration    `);
    console.log(` Server active on: http://localhost:${PORT}/api/ `);
    console.log(`=================================================`);
  });

  return server;
};

if (require.main === module) {
  startServer();
}

module.exports = app;
module.exports.startServer = startServer;
