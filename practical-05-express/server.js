/**
 * CampusConnect - Practical 05: ExpressJS REST API Architecture
 * Demonstrates:
 * - Express application setup
 * - RESTful routing with Router modules
 * - Controller / Service architecture
 * - Custom and built-in middleware (express.json, cors)
 * - Validation middleware
 * - Centralized error handling middleware
 * - Complete CRUD (GET, POST, PATCH, DELETE)
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const { getStatistics } = require('./controllers/eventController');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5001;

// 1. Built-in and Third-party Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom Request Logger Middleware
app.use((req, res, next) => {
  console.log(`[Express API] ${new Date().toISOString()} | ${req.method} ${req.originalUrl}`);
  next();
});

// 2. Interactive Landing & Documentation Route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>CampusConnect — Practical 05 Express REST API</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #F8FAFC; color: #0F172A; padding: 2.5rem; margin: 0; line-height: 1.6; }
        .container { max-width: 840px; margin: 0 auto; background: #fff; border: 1px solid #E2E8F0; border-radius: 8px; padding: 2.25rem; }
        h1 { color: #0F172A; margin-top: 0; font-size: 1.85rem; }
        .badge { background: #CCFBF1; color: #0F766E; font-weight: 700; padding: 0.35rem 0.7rem; border-radius: 4px; font-size: 0.8rem; }
        .endpoint-box { background: #F1F5F9; border-left: 4px solid #0F766E; padding: 0.85rem 1.25rem; margin: 0.85rem 0; border-radius: 0 6px 6px 0; font-family: monospace; font-size: 0.92rem; }
        .method { font-weight: bold; padding: 0.2rem 0.5rem; border-radius: 4px; margin-right: 0.5rem; }
        .get { background: #DCFCE7; color: #15803D; }
        .post { background: #E0E7FF; color: #3730A3; }
        .patch { background: #FEF3C7; color: #A16207; }
        .delete { background: #FEE2E2; color: #B91C1C; }
        a { color: #0F766E; text-decoration: none; font-weight: 600; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="container">
        <span class="badge">Practical No. 05</span>
        <h1>CampusConnect Express.js REST API</h1>
        <p>Built with modular Express Router, Controllers, Validation Middleware, and JSON persistence.</p>
        
        <h3>Registered REST Endpoints:</h3>
        <div class="endpoint-box"><span class="method get">GET</span> <a href="/api/events">/api/events</a> &mdash; Fetch all events (supports ?category= & ?search=)</div>
        <div class="endpoint-box"><span class="method get">GET</span> <a href="/api/events/EVT-1001">/api/events/:id</a> &mdash; Fetch single event by ID</div>
        <div class="endpoint-box"><span class="method patch">PATCH</span> /api/events/:id &mdash; Partially update event details</div>
        <div class="endpoint-box"><span class="method get">GET</span> <a href="/api/registrations">/api/registrations</a> &mdash; Fetch all registration passes</div>
        <div class="endpoint-box"><span class="method get">GET</span> <a href="/api/registrations/REG-1042">/api/registrations/:id</a> &mdash; Fetch specific pass details</div>
        <div class="endpoint-box"><span class="method post">POST</span> /api/registrations &mdash; Create registration (Protected by validation middleware)</div>
        <div class="endpoint-box"><span class="method delete">DELETE</span> /api/registrations/:id &mdash; Cancel registration & release capacity</div>
        <div class="endpoint-box"><span class="method get">GET</span> <a href="/api/statistics">/api/statistics</a> &mdash; Real-time dynamic campus stats</div>

        <p class="text-muted" style="font-size: 0.85rem; color: #64748B; margin-top: 2rem;">Express Server active on port ${PORT} • Ready for full-stack React integration.</p>
      </div>
    </body>
    </html>
  `);
});

// 3. Mount Routes
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.get('/api/statistics', getStatistics);

// 4. Error Handling Middleware
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` CampusConnect Practical 05 - ExpressJS REST Server `);
  console.log(` Listening on: http://localhost:${PORT}/            `);
  console.log(`====================================================`);
});
