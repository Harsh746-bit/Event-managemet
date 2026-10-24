# CampusConnect — Smart Campus Engagement & Event Management Platform

> **"Find Your Place on Campus."**

CampusConnect is a production-grade, full-stack academic web platform designed to solve student campus discovery challenges. It unifies event registration, hackathons, club communities, department seminars, and campus announcements into a single, cohesive university product.

Built with **React 18, Bootstrap 5, Node.js, Express.js, and MongoDB (via Mongoose)**, fully implementing:
- **Practical 6**: RESTful API with full CRUD operations (`GET`, `POST`, `PUT`, `DELETE`), HTTP status codes, request validation, and automated Postman test suites.
- **Practical 7**: MongoDB integration via Mongoose, schema validation, aggregation pipelines, and cloud database persistence.

---

## 🎨 Visual Identity & Design System

The user interface strictly follows a custom, editorial, university-grade visual theme:

- **Deep Navy (`#0F172A`)**: Primary structural elements, headers, high-contrast badges, footers.
- **Secondary Navy (`#172554`)**: Secondary structural elements and deep accents.
- **Ivory / Background (`#F8FAFC`)**: Page background providing warm, readable contrast.
- **Primary Teal (`#0F766E`)**: Primary call-to-action buttons, active navigation states, highlights.
- **Bright Teal Accent (`#14B8A6`)**: Subtle highlights, icons, active state badges.
- **Dark Teal (`#115E59`)**: Hover and active interaction states.
- **Slate (`#475569`) & Muted Slate (`#64748B`)**: Body text, metadata, venue indicators.
- **Border (`#E2E8F0`)**: Clean 1px structural dividing lines.
- **Typography**: Inter & Manrope loaded from Google Fonts for high legibility.
- **Iconography**: Bootstrap Icons (`bi bi-*`).

*(Strictly adheres to zero purple, zero orange, zero neon gradients, and zero bloated card layouts).*

---

## 🚀 Quick Start & Local Execution

### Prerequisites
- Node.js (v18+)
- Local MongoDB running on `mongodb://127.0.0.1:27017` OR a MongoDB Atlas connection string.

### 1. Backend Server Setup
```bash
cd "final-app/backend"
npm install

# Seed default campus events and registrations into MongoDB:
npm run seed

# Run automated REST CRUD & MongoDB verification tests:
npm test

# Start the Express server:
npm start
```
* Backend API runs on: **`http://localhost:5000/api`**

### 2. Frontend Client Setup
```bash
cd "final-app/frontend"
npm install
npm run dev
```
* Frontend Web App runs on: **`http://localhost:3001`** *(automatically proxies `/api` to port 5000)*

---

## 📡 RESTful API Specification (Practical 6 & 7)

| Method | Endpoint | Description | Status Codes | Request Body / Query Params |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Diagnostic server & MongoDB status | `200` | Returns `{ status, database: { type, status, host, name } }` |
| `GET` | `/api/events` | Fetch all campus events with filtering | `200` | Query: `?category=Technology&search=Sprint&sort=recent` |
| `GET` | `/api/events/:id` | Fetch single event by custom ID or ObjectId | `200`, `400`, `404` | Path param: `:id` (e.g., `EVT-1001`) |
| `POST` | `/api/events` | Create new campus event in MongoDB | `201`, `400` | JSON: `title`, `category`, `date`, `time`, `location`, `capacity`, `description`, `department` |
| `PUT` | `/api/events/:id` | Full update of existing event record | `200`, `400`, `404` | JSON: fields to update (e.g. `capacity`, `location`, `title`) |
| `PATCH`| `/api/events/:id` | Partial update of event details | `200`, `400`, `404` | JSON: partial update fields |
| `DELETE`| `/api/events/:id` | Delete event and linked registration passes | `200`, `404` | Path param: `:id` |
| `GET` | `/api/registrations` | Fetch all active registration passes | `200` | Optional query: `?eventId=EVT-1001&studentId=STU2024001` |
| `GET` | `/api/registrations/:id` | Fetch single registration pass | `200`, `404` | Path param: `:id` (e.g., `REG-1042`) |
| `POST` | `/api/registrations` | Create pass & reserve seat in MongoDB | `201`, `400`, `404` | JSON: `fullName`, `email`, `phone`, `studentId`, `eventId`, `department`, `year` |
| `PUT` | `/api/registrations/:id` | Update student details on pass | `200`, `400`, `404` | JSON: fields to update (e.g. `phone`, `department`, `year`) |
| `DELETE`| `/api/registrations/:id` | Cancel pass & release seat back to MongoDB | `200`, `404` | Path param: `:id` |
| `GET` | `/api/statistics` | Live aggregated statistics via MongoDB pipeline | `200` | Computes total capacity, registered seats, available seats, and active clubs |

---

## 📮 Postman Collection & Automated API Testing

An importable Postman Collection is provided at:
[`CampusConnect_API.postman_collection.json`](CampusConnect_API.postman_collection.json)

### Importing into Postman:
1. Open Postman.
2. Click **Import** (top left) and select `CampusConnect_API.postman_collection.json`.
3. The collection includes 4 test suites with 18 automated test assertions:
   - **01. Diagnostics & Health**: Server health and MongoDB connection checks.
   - **02. Events (Practical 6 CRUD)**: Full CRUD suite with positive & negative test cases (404 Not Found, 400 Bad Request, malformed parameters).
   - **03. Registrations (Practical 6 & 7)**: Seat reservation, pass generation, seat release, and duplicate student prevention.
   - **04. Aggregation & Statistics**: Validates MongoDB `$group` aggregation pipeline calculations.

---

## 🗄️ MongoDB Compass / Atlas Viewing Guide

### Database: `campusconnect`
1. Connect via Compass to `mongodb://127.0.0.1:27017` or paste your Atlas connection URI.
2. Click database **`campusconnect`**.
3. View collections:
   - **`events`**: Campus events with capacity, registered counts, virtual available seats, and timestamps.
   - **`registrations`**: Verified student passes with contact info, department, year, and PRN.

---

## 🏛️ Project Directory Structure

```
EVent management/
│
├── final-app/
│   ├── backend/
│   │   ├── config/
│   │   │   └── db.js                 # Reusable MongoDB Mongoose connection module
│   │   ├── controllers/
│   │   │   ├── eventController.js    # MongoDB CRUD queries & aggregation pipeline
│   │   │   └── registrationController.js # Seat reservations & pass management
│   │   ├── data/
│   │   │   ├── events.json           # Default seed dataset
│   │   │   └── registrations.json    # Default seed dataset
│   │   ├── middleware/
│   │   │   ├── errorHandler.js       # Centralized error handling & status codes
│   │   │   └── validation.js         # Input validation for requests and IDs
│   │   ├── models/
│   │   │   ├── Event.js              # Mongoose schema for campus events
│   │   │   └── Registration.js       # Mongoose schema for student registrations
│   │   ├── routes/
│   │   │   ├── eventRoutes.js        # REST routes for /api/events
│   │   │   └── registrationRoutes.js # REST routes for /api/registrations
│   │   ├── .env.example              # Environment variables template
│   │   ├── .gitignore                # Node modules and secrets exclusion
│   │   ├── package.json              # Backend dependencies & test/seed scripts
│   │   ├── seed.js                   # Safe, idempotent database seeder
│   │   ├── server.js                 # Express server & MongoDB lifecycle
│   │   └── test_api.js               # 12-test automated verification suite
│   │
│   └── frontend/
│       ├── src/
│       │   ├── components/
│       │   │   ├── DeleteEventModal.jsx    # Event deletion confirmation (DELETE)
│       │   │   ├── EventCard.jsx           # Event card with CRUD action triggers
│       │   │   ├── EventDashboard.jsx      # Directory with "+ Add Event" trigger
│       │   │   ├── EventFormModal.jsx      # Modal for creating (POST) & editing (PUT)
│       │   │   ├── EventModal.jsx          # Event details & action modal
│       │   │   ├── Navbar.jsx              # Nav with live MongoDB indicator
│       │   │   ├── RegistrationCard.jsx    # Pass display & cancel pass (DELETE)
│       │   │   ├── RegistrationForm.jsx    # Registration pass form (POST)
│       │   │   └── ...                     # Skeletons, toasts, footer, hero, clubs
│       │   ├── services/
│       │   │   └── api.js                  # Centralized REST API client
│       │   ├── App.jsx                     # Master state, modal wiring, and handlers
│       │   ├── index.css                   # Editorial Deep Navy & Teal design tokens
│       │   └── main.jsx                    # Vite React entry point
│       ├── .env.example                    # Frontend environment variables template
│       ├── .gitignore                      # Dist & node_modules exclusion
│       ├── package.json                    # Frontend dependencies
│       └── vite.config.js                  # Port 3001 & /api proxy to port 5000
│
├── CampusConnect_API.postman_collection.json # 18-assertion importable Postman suite
├── .gitignore                                # Root gitignore
└── README.md                                 # Project documentation
```

---

## 🔒 Security & Quality Standards

- **Environment Isolation**: Database connection strings and server secrets are strictly loaded via `.env` and kept out of Git version control.
- **Input Validation**: Double validation (Express middleware regex checks + Mongoose schema validation) prevents invalid emails, short titles, and negative capacities.
- **Atomic Operations**: Registration and cancellation safely update event seat counts and prevent duplicate registrations per student.
- **Zero Forbidden Styles**: No purple, violet, or orange tones; pure Deep Navy + Ivory + Teal university palette.
