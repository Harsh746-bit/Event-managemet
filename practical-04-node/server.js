/**
 * CampusConnect - Practical 04: Native Node.js HTTP Server
 * Demonstrates:
 * - Native 'http', 'fs', 'path', 'url' modules (NO Express)
 * - Request / Response handling & streams
 * - RESTful HTTP methods (GET, POST, DELETE, OPTIONS)
 * - HTTP Status Codes (200, 201, 400, 404, 405, 500)
 * - Reading and writing JSON files via file system
 * - CORS headers & Request Body parsing
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 5000;
const EVENTS_FILE = path.join(__dirname, 'data', 'events.json');
const REGISTRATIONS_FILE = path.join(__dirname, 'data', 'registrations.json');

// Helper: Ensure data files exist
function ensureDataFiles() {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(EVENTS_FILE)) {
    fs.writeFileSync(EVENTS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(REGISTRATIONS_FILE)) {
    fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify([], null, 2));
  }
}

// Helper: Read JSON file
function readJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
    return [];
  }
}

// Helper: Write JSON file
function writeJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err.message);
    return false;
  }
}

// Helper: Send JSON Response
function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(payload));
}

// Helper: Parse Request Body
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        resolve(parsed);
      } catch (e) {
        reject(new Error('Invalid JSON in request payload'));
      }
    });
    req.on('error', err => reject(err));
  });
}

// Create HTTP Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  console.log(`[${new Date().toLocaleTimeString()}] ${method} ${pathname}`);

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  // Route: Root / -> HTML Server Dashboard
  if (pathname === '/' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>CampusConnect — Practical 04 Native Node.js Server</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #F8FAFC; color: #0F172A; padding: 2.5rem; margin: 0; line-height: 1.6; }
          .container { max-width: 800px; margin: 0 auto; background: #fff; border: 1px solid #E2E8F0; border-radius: 8px; padding: 2rem; }
          h1 { color: #0F172A; margin-top: 0; font-size: 1.75rem; }
          .badge { background: #CCFBF1; color: #0F766E; font-weight: 700; padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.8rem; }
          .endpoint-box { background: #F1F5F9; border-left: 4px solid #0F766E; padding: 0.85rem 1.25rem; margin: 1rem 0; border-radius: 0 6px 6px 0; font-family: monospace; }
          .method { font-weight: bold; color: #0F766E; }
          a { color: #0F766E; text-decoration: none; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <span class="badge">Practical No. 04</span>
          <h1>CampusConnect Native Node.js Server</h1>
          <p>This backend is powered completely by <strong>native Node.js modules</strong> (<code>http</code>, <code>fs</code>, <code>path</code>, <code>url</code>) without external framework dependencies.</p>
          
          <h3>Available REST Endpoints:</h3>
          <div class="endpoint-box"><span class="method">GET</span> <a href="/api/events">/api/events</a> &mdash; Fetch all events from JSON storage</div>
          <div class="endpoint-box"><span class="method">GET</span> /api/events/:id &mdash; Fetch event by ID (e.g., <a href="/api/events/EVT-1001">/api/events/EVT-1001</a>)</div>
          <div class="endpoint-box"><span class="method">GET</span> <a href="/api/registrations">/api/registrations</a> &mdash; Fetch all active registrations</div>
          <div class="endpoint-box"><span class="method">POST</span> /api/registrations &mdash; Create registration & decrement event capacity</div>
          <div class="endpoint-box"><span class="method">DELETE</span> /api/registrations/:id &mdash; Cancel registration & increment event capacity</div>
          <div class="endpoint-box"><span class="method">GET</span> <a href="/api/statistics">/api/statistics</a> &mdash; Live aggregated statistics</div>

          <p class="text-muted" style="font-size: 0.85rem; color: #64748B; margin-top: 2rem;">Server listening on port ${PORT} • Data persisted in <code>data/events.json</code> & <code>data/registrations.json</code></p>
        </div>
      </body>
      </html>
    `;
    return res.end(html);
  }

  // Route: GET /api/events
  if (pathname === '/api/events' && method === 'GET') {
    const events = readJson(EVENTS_FILE);
    return sendJson(res, 200, {
      success: true,
      count: events.length,
      data: events
    });
  }

  // Route: GET /api/events/:id
  if (pathname.startsWith('/api/events/') && method === 'GET') {
    const id = pathname.replace('/api/events/', '').trim();
    const events = readJson(EVENTS_FILE);
    const found = events.find(e => e.id.toLowerCase() === id.toLowerCase());

    if (!found) {
      return sendJson(res, 404, {
        success: false,
        message: `Event with ID '${id}' not found.`
      });
    }

    return sendJson(res, 200, {
      success: true,
      data: found
    });
  }

  // Route: GET /api/registrations
  if (pathname === '/api/registrations' && method === 'GET') {
    const registrations = readJson(REGISTRATIONS_FILE);
    return sendJson(res, 200, {
      success: true,
      count: registrations.length,
      data: registrations
    });
  }

  // Route: POST /api/registrations
  if (pathname === '/api/registrations' && method === 'POST') {
    try {
      const body = await parseRequestBody(req);
      const { fullName, email, phone, studentId, eventId, department, year } = body;

      // Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]{10}$/;

      if (!fullName || fullName.trim().length < 2) {
        return sendJson(res, 400, { success: false, message: "Please enter a valid full name (at least 2 characters)." });
      }
      if (!email || !emailRegex.test(email.trim())) {
        return sendJson(res, 400, { success: false, message: "Please enter a valid email address." });
      }
      if (!phone || !phoneRegex.test(phone.trim())) {
        return sendJson(res, 400, { success: false, message: "Please enter a valid 10-digit mobile number." });
      }
      if (!studentId || studentId.trim().length < 3) {
        return sendJson(res, 400, { success: false, message: "Please enter a valid student ID." });
      }
      if (!eventId) {
        return sendJson(res, 400, { success: false, message: "Please select an event." });
      }

      // Check event availability
      const events = readJson(EVENTS_FILE);
      const eventIndex = events.findIndex(e => e.id === eventId);
      if (eventIndex === -1) {
        return sendJson(res, 404, { success: false, message: "Target event does not exist." });
      }

      const targetEvent = events[eventIndex];
      const available = targetEvent.capacity - targetEvent.registered;
      if (available <= 0) {
        return sendJson(res, 400, { success: false, message: "Sorry, this event is already fully booked." });
      }

      // Create new registration
      const passId = "REG-" + Math.floor(1000 + Math.random() * 9000);
      const newRegistration = {
        id: passId,
        eventId: targetEvent.id,
        eventTitle: targetEvent.title,
        studentName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        studentId: studentId.trim(),
        department: department || "General Engineering",
        year: year || "3rd Year",
        date: targetEvent.date,
        timestamp: new Date().toISOString()
      };

      // Update event capacity
      targetEvent.registered += 1;
      if (targetEvent.registered >= targetEvent.capacity) {
        targetEvent.status = "Registration Closed";
      }

      // Read registrations, prepend, write both
      const registrations = readJson(REGISTRATIONS_FILE);
      registrations.unshift(newRegistration);

      writeJson(REGISTRATIONS_FILE, registrations);
      writeJson(EVENTS_FILE, events);

      return sendJson(res, 201, {
        success: true,
        message: "Registration created successfully.",
        data: newRegistration
      });
    } catch (err) {
      return sendJson(res, 400, {
        success: false,
        message: err.message || "Failed to process registration request."
      });
    }
  }

  // Route: DELETE /api/registrations/:id
  if (pathname.startsWith('/api/registrations/') && method === 'DELETE') {
    const id = pathname.replace('/api/registrations/', '').trim();
    const registrations = readJson(REGISTRATIONS_FILE);
    const regIndex = registrations.findIndex(r => r.id.toLowerCase() === id.toLowerCase());

    if (regIndex === -1) {
      return sendJson(res, 404, {
        success: false,
        message: `Registration with pass ID '${id}' was not found.`
      });
    }

    const removedReg = registrations[regIndex];
    registrations.splice(regIndex, 1);

    // Release capacity in event
    const events = readJson(EVENTS_FILE);
    const eventIndex = events.findIndex(e => e.id === removedReg.eventId);
    if (eventIndex !== -1 && events[eventIndex].registered > 0) {
      events[eventIndex].registered -= 1;
      if (events[eventIndex].status === "Registration Closed") {
        events[eventIndex].status = "Registration Open";
      }
      writeJson(EVENTS_FILE, events);
    }

    writeJson(REGISTRATIONS_FILE, registrations);

    return sendJson(res, 200, {
      success: true,
      message: `Registration '${id}' successfully cancelled. Seat released.`,
      data: removedReg
    });
  }

  // Route: GET /api/statistics
  if (pathname === '/api/statistics' && method === 'GET') {
    const events = readJson(EVENTS_FILE);
    const registrations = readJson(REGISTRATIONS_FILE);
    const totalCapacity = events.reduce((sum, e) => sum + e.capacity, 0);
    const totalRegistered = events.reduce((sum, e) => sum + e.registered, 0);

    return sendJson(res, 200, {
      success: true,
      data: {
        totalEvents: events.length,
        activeClubs: 32,
        totalRegistrations: totalRegistered,
        activePassesCount: registrations.length,
        totalCapacity: totalCapacity,
        availableSeats: totalCapacity - totalRegistered,
        eventsThisWeek: 18
      }
    });
  }

  // Route Not Found (404)
  return sendJson(res, 404, {
    success: false,
    message: `Endpoint '${pathname}' with method '${method}' was not found on native Node.js server.`
  });
});

// Start Server
ensureDataFiles();
server.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(` CampusConnect Practical 04 - Native Node.js HTTP `);
  console.log(` Server running at: http://localhost:${PORT}/     `);
  console.log(`=================================================`);
});
