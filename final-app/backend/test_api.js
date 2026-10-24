/**
 * Automated Verification Script for Practical 6 & 7 Backend
 * Tests all REST CRUD operations against the live Express server & MongoDB
 */

require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const app = require('./server');

const PORT = 5001;
let server;

const request = (method, path, body = null) => {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : '';
    const req = http.request(
      {
        hostname: 'localhost',
        port: PORT,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(body ? { 'Content-Length': Buffer.byteLength(dataString) } : {})
        }
      },
      (res) => {
        let resBody = '';
        res.on('data', (chunk) => (resBody += chunk));
        res.on('end', () => {
          try {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body: resBody ? JSON.parse(resBody) : null
            });
          } catch (e) {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body: resBody
            });
          }
        });
      }
    );

    req.on('error', reject);
    if (body) req.write(dataString);
    req.end();
  });
};

const runTests = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Database connection failed before test start:', err.message);
    process.exit(1);
  }

  server = app.listen(PORT, async () => {
    console.log(`\n=== STARTING AUTOMATED REST CRUD & MONGODB VERIFICATION ===\n`);

    try {
      // 1. Health check & DB connection
      console.log('1. Testing Health & DB status (/api/health)...');
      const health = await request('GET', '/api/health');
      console.log(`   Status: ${health.statusCode}, DB: ${health.body.database?.status}`);
      if (health.statusCode !== 200 || health.body.database?.status !== 'connected') {
        throw new Error('Health check failed or database disconnected');
      }

      // 2. GET all events
      console.log('\n2. Testing GET /api/events...');
      const eventsRes = await request('GET', '/api/events');
      console.log(`   Status: ${eventsRes.statusCode}, Count: ${eventsRes.body.count}`);
      if (eventsRes.statusCode !== 200 || !Array.isArray(eventsRes.body.data)) {
        throw new Error('GET /api/events failed');
      }

      // 3. GET single event
      console.log('\n3. Testing GET /api/events/EVT-1001...');
      const eventRes = await request('GET', '/api/events/EVT-1001');
      console.log(`   Status: ${eventRes.statusCode}, Title: ${eventRes.body.data?.title}`);
      if (eventRes.statusCode !== 200 || eventRes.body.data?.id !== 'EVT-1001') {
        throw new Error('GET /api/events/EVT-1001 failed');
      }

      // 4. POST create event (Practical 6: Create)
      console.log('\n4. Testing POST /api/events (Create Event)...');
      const testEventId = 'EVT-TEST-' + Math.floor(100 + Math.random() * 900);
      const newEventPayload = {
        id: testEventId,
        title: 'Cloud & AI DevOps Masterclass',
        category: 'Technology',
        date: '2026-11-25',
        time: '11:00 AM',
        location: 'Virtual Aud 1',
        capacity: 50,
        description: 'Comprehensive hands-on workshop covering Docker, Kubernetes, and MongoDB Atlas CI/CD workflows.',
        department: 'Computer Science'
      };
      const createRes = await request('POST', '/api/events', newEventPayload);
      console.log(`   Status: ${createRes.statusCode}, Message: ${createRes.body.message}`);
      if (createRes.statusCode !== 201 || createRes.body.data?.id !== testEventId) {
        throw new Error('POST /api/events failed');
      }

      // 5. PUT update event (Practical 6: Update)
      console.log('\n5. Testing PUT /api/events/${testEventId} (Update Event)...');
      const updatePayload = {
        title: 'Cloud & AI DevOps Masterclass (Updated)',
        capacity: 65,
        location: 'Main Auditorium'
      };
      const updateRes = await request('PUT', `/api/events/${testEventId}`, updatePayload);
      console.log(`   Status: ${updateRes.statusCode}, Updated Title: ${updateRes.body.data?.title}`);
      if (updateRes.statusCode !== 200 || updateRes.body.data?.title !== updatePayload.title) {
        throw new Error('PUT /api/events failed');
      }

      // 6. POST create registration for test event
      console.log('\n6. Testing POST /api/registrations (Create Registration Pass)...');
      const regPayload = {
        fullName: 'Jane Developer',
        email: 'jane.dev@university.edu',
        phone: '9123456789',
        studentId: 'STU999901',
        eventId: testEventId,
        department: 'Computer Science',
        year: '3rd Year'
      };
      const regRes = await request('POST', '/api/registrations', regPayload);
      console.log(`   Status: ${regRes.statusCode}, Pass ID: ${regRes.body.data?.id}`);
      if (regRes.statusCode !== 201 || !regRes.body.data?.id) {
        throw new Error('POST /api/registrations failed');
      }
      const testPassId = regRes.body.data.id;

      // 7. Verify seat decrement in MongoDB
      console.log('\n7. Verifying Event seat count increment in MongoDB...');
      const verifyEventRes = await request('GET', `/api/events/${testEventId}`);
      console.log(`   Registered seats: ${verifyEventRes.body.data?.registered} (expected 1)`);
      if (verifyEventRes.body.data?.registered !== 1) {
        throw new Error('Event registration counter did not increment properly');
      }

      // 8. DELETE cancel registration (release seat)
      console.log(`\n8. Testing DELETE /api/registrations/${testPassId} (Cancel Pass)...`);
      const cancelRes = await request('DELETE', `/api/registrations/${testPassId}`);
      console.log(`   Status: ${cancelRes.statusCode}, Message: ${cancelRes.body.message}`);
      if (cancelRes.statusCode !== 200) {
        throw new Error('DELETE /api/registrations failed');
      }

      // 9. DELETE delete test event (Practical 6: Delete)
      console.log(`\n9. Testing DELETE /api/events/${testEventId} (Delete Event)...`);
      const deleteRes = await request('DELETE', `/api/events/${testEventId}`);
      console.log(`   Status: ${deleteRes.statusCode}, Message: ${deleteRes.body.message}`);
      if (deleteRes.statusCode !== 200) {
        throw new Error('DELETE /api/events failed');
      }

      // 10. Test 404 behavior for nonexistent record
      console.log('\n10. Testing GET /api/events/NONEXISTENT (404 Handling)...');
      const notFoundRes = await request('GET', '/api/events/EVT-NONEXISTENT');
      console.log(`   Status: ${notFoundRes.statusCode}, Message: ${notFoundRes.body.message}`);
      if (notFoundRes.statusCode !== 404) {
        throw new Error('404 handling failed');
      }

      // 11. Test 400 validation error on malformed payload
      console.log('\n11. Testing POST /api/events with invalid payload (400 Handling)...');
      const invalidRes = await request('POST', '/api/events', { title: 'AB' }); // title too short
      console.log(`   Status: ${invalidRes.statusCode}, Field: ${invalidRes.body.field}, Message: ${invalidRes.body.message}`);
      if (invalidRes.statusCode !== 400) {
        throw new Error('400 validation error handling failed');
      }

      // 12. GET Live Statistics from MongoDB
      console.log('\n12. Testing GET /api/statistics (MongoDB Aggregation)...');
      const statsRes = await request('GET', '/api/statistics');
      console.log(`   Status: ${statsRes.statusCode}, Total Events: ${statsRes.body.data?.totalEvents}, Total Capacity: ${statsRes.body.data?.totalCapacity}`);
      if (statsRes.statusCode !== 200) {
        throw new Error('GET /api/statistics failed');
      }

      console.log(`\n============================================================`);
      console.log(`>>> ALL 12 REST CRUD & MONGODB TESTS PASSED PERFECTLY! <<<`);
      console.log(`============================================================\n`);
    } catch (err) {
      console.error(`\n❌ TEST FAILED: ${err.message}`);
    } finally {
      server.close();
      await mongoose.connection.close();
      process.exit(0);
    }
  });
};

runTests();
