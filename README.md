# College Event Planner — Campus Pulse

A centralized, responsive web application for discovering, registering for, and remembering campus events. Built to satisfy all **seven academic web technology practicals (Practicals 01–07)** in a single coherent full-stack product.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB instance (`mongodb://localhost:27017/college_event_planner`)

### 1. Standalone Practical 02 (Vanilla JS & JSON)
Open `practical-02/index.html` directly in any web browser, or serve via Live Server.

### 2. Frontend Application (React + Vite + Bootstrap)
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Backend REST API Server (Node + Express + MongoDB)
```bash
cd server
npm install

# Seed sample database data
npm run seed

# Run Express server with watch mode
npm run dev
```
Base API Endpoint: `http://localhost:5000/api/v1`

---

## 🎓 Practical 01–07 Academic Mapping

| Practical | Tech Stack | Demonstrated In | How to Demo |
|---|---|---|---|
| **Practical 01** | HTML5, CSS3, Bootstrap 5 | `client/src/components/Navbar.jsx`, `EventCard.jsx`, `global.css` | Resize browser window (1440px → 320px); navbar collapses, grid reflows. |
| **Practical 02** | Vanilla JS, JSON, Arrays | `practical-02/` folder (`index.html`, `script.js`, `events.json`) | Open `practical-02/index.html` → test live filter/sort, form validation errors, array push log. |
| **Practical 03** | ReactJS, State, Controlled Inputs | `client/src/components/RegistrationForm.jsx`, `EventCard.jsx` | Open registration form → inline state-driven errors; same `EventCard` reused on Home & Discover. |
| **Practical 04** | Node.js Runtime & Async I/O | `server/services/registrationService.js` | Send raw HTTP POST directly via Postman; Node re-validates payload & handles DB async write. |
| **Practical 05** | Express.js, Routes & Middleware | `server/middleware/requireRole.js`, `errorHandler.js`, `routes/events.js` | Try creating event with student token (`403 Forbidden`); check centralized error handler JSON response. |
| **Practical 06** | REST API & Postman | `postman/College_Event_Planner.postman_collection.json` | Import Postman collection; test GET, POST, PUT, DELETE with 200, 201, 400, 403, 409 status codes. |
| **Practical 07** | MongoDB & Mongoose | `server/models/Registration.js`, `Event.js` | Check Atlas/Compass; duplicate registration blocked by unique compound index `(eventId, userId)`. |

---

## 👥 Demo User Credentials (from Seed)

- **Student:** `rohan@college.edu` / `Password123`
- **Organizer:** `ananya@college.edu` / `Password123`
- **Admin:** `admin@college.edu` / `Password123`
