/**
 * CampusConnect - Final Full-Stack Express Server
 * Serves the REST API for Events, Registrations, and Live Statistics
 */

const express = require('express');
const cors = require('cors');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const { getStatistics } = require('./controllers/eventController');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.get('/api/statistics', getStatistics);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', uptime: process.uptime() });
});

// Error Handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(` CampusConnect Final Full-Stack Backend API     `);
  console.log(` Server active on: http://localhost:${PORT}/api/ `);
  console.log(`=================================================`);
});
