# CampusConnect — Smart Campus Engagement & Event Management Platform

> **"Find Your Place on Campus."**

CampusConnect is a production-grade, full-stack academic web platform designed to solve student campus discovery challenges. It unifies event registration, hackathons, club communities, department seminars, and campus announcements into a single, cohesive university product.

The platform is systematically structured and progressively built across all **five Web Technology practicals**:

```
Practical No. 01 (HTML5 + CSS3 + Bootstrap 5)
                     ↓
Practical No. 02 (Vanilla JavaScript + Arrays + JSON + Validation)
                     ↓
Practical No. 03 (ReactJS + Components + State + Hooks)
                     ↓
Practical No. 04 (Node.js Native HTTP Server + File System JSON)
                     ↓
Practical No. 05 (Express.js REST API + Middleware + Controller)
                     ↓
Final Application (React 18 + Bootstrap 5 + Express + Node.js)
```

---

## 🎨 Visual Identity & Design System

The entire user interface strictly follows a custom, editorial, university-grade visual theme:

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

## 📋 Comprehensive Practical Mapping Table

| Practical | Technology Stack | Core Concepts & Demonstrations | Location |
| :--- | :--- | :--- | :--- |
| **Practical 01** | HTML5, CSS3, Bootstrap 5 | Semantic HTML5, Bootstrap 5 Grid, Navbar, Asymmetrical Hero, Badges, Modals, Forms, 100% Responsive without JS frameworks. | [`practical-01-html-css-bootstrap/`](file:///c:/College/3rd%20Year/Web%20technology/EVent%20management/practical-01-html-css-bootstrap) |
| **Practical 02** | HTML5, CSS3, Vanilla JS | Array of Event Objects, Array of Registrations, `JSON.stringify()`, `JSON.parse()`, DOM rendering, regex validation, search, category filter, dynamic stats, live JSON state inspector. | [`practical-02-javascript/`](file:///c:/College/3rd%20Year/Web%20technology/EVent%20management/practical-02-javascript) |
| **Practical 03** | React 18, Vite, Bootstrap 5 | Functional components, Props, State (`useState`), Lifecycle (`useEffect`), Controlled forms, Client-side validation, Dynamic seat counters, Modal workflows. | [`practical-03-react/`](file:///c:/College/3rd%20Year/Web%20technology/EVent%20management/practical-03-react) |
| **Practical 04** | Node.js (Native HTTP) | Native `http`, `fs`, `path`, `url` modules without external frameworks, stream parsing, HTTP status codes, REST endpoints (`GET`, `POST`, `DELETE`), filesystem JSON storage. | [`practical-04-node/`](file:///c:/College/3rd%20Year/Web%20technology/EVent%20management/practical-04-node) |
| **Practical 05** | Express.js, Node.js | Modular Router (`express.Router`), Controllers, Custom Validation Middleware, Error Handling Middleware, CORS, full REST API (`GET`, `POST`, `PATCH`, `DELETE`). | [`practical-05-express/`](file:///c:/College/3rd%20Year/Web%20technology/EVent%20management/practical-05-express) |
| **Final Full-Stack** | React + Bootstrap + Express + Node | Full-Stack integration via Fetch API, loading skeletons, error fallback with retry, dynamic live statistics, atomic registration & seat release, confirmation toasts. | [`final-app/`](file:///c:/College/3rd%20Year/Web%20technology/EVent%20management/final-app) |

---

## 🚀 How to Run Each Practical

### Practical No. 01 — HTML, CSS & Bootstrap 5
1. Navigate to `practical-01-html-css-bootstrap/`.
2. Double click `index.html` or open with Live Server in VS Code / IDE.
3. No build tools or Node.js server required.

### Practical No. 02 — Vanilla JavaScript & JSON
1. Navigate to `practical-02-javascript/`.
2. Open `index.html` in any browser.
3. Interact with dynamic search, category filtering, registration form with client-side regex validation, cancellation, and inspect the live `JSON.stringify()` debug output box.

### Practical No. 03 — ReactJS (Vite)
1. Navigate to `practical-03-react/`:
   ```bash
   cd "practical-03-react"
   npm install
   npm run dev
   ```
2. Open your browser at `http://localhost:3000`.

### Practical No. 04 — Native Node.js HTTP Server
1. Navigate to `practical-04-node/`:
   ```bash
   cd "practical-04-node"
   npm start
   ```
2. Open `http://localhost:5000` in your browser or test with Postman / cURL.

### Practical No. 05 — Express.js REST API
1. Navigate to `practical-05-express/`:
   ```bash
   cd "practical-05-express"
   npm install
   npm start
   ```
2. Open `http://localhost:5001` in your browser to view the interactive API directory.

### Final Full-Stack Application (React + Express)
Run both backend and frontend concurrently:

1. **Start Backend API Server** (Port 5000):
   ```bash
   cd "final-app/backend"
   npm install
   npm start
   ```

2. **Start Frontend Dev Server** (Port 3001 with proxy):
   ```bash
   cd "final-app/frontend"
   npm install
   npm run dev
   ```
3. Open `http://localhost:3001` in your browser to experience the complete university platform.

---

## 📡 REST API Documentation (Practical 05 & Final Backend)

| Method | Endpoint | Description | Request Body / Query |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/events` | Fetch all campus events | Optional query: `?category=Technology&search=hackathon` |
| `GET` | `/api/events/:id` | Fetch single event by ID | Path param: `:id` (e.g., `EVT-1001`) |
| `PATCH`| `/api/events/:id` | Update event details | JSON fields to update |
| `GET` | `/api/registrations` | Fetch all active passes | None |
| `GET` | `/api/registrations/:id` | Fetch registration pass | Path param: `:id` (e.g., `REG-1042`) |
| `POST`| `/api/registrations` | Create registration & reserve seat | Required JSON: `fullName`, `email`, `phone`, `studentId`, `eventId`, `department`, `year` |
| `DELETE` | `/api/registrations/:id` | Cancel registration pass & release seat | Path param: `:id` |
| `GET` | `/api/statistics` | Aggregated campus statistics | Returns total events, registrations, capacity, and active clubs |

---

## 🏛️ Project File Hierarchy

```
EVent management/
│
├── practical-01-html-css-bootstrap/
│   ├── index.html
│   └── style.css
│
├── practical-02-javascript/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── practical-03-react/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnnouncementList.jsx
│   │   │   ├── ClubSection.jsx
│   │   │   ├── ConfirmationModal.jsx
│   │   │   ├── EventCard.jsx
│   │   │   ├── EventCategories.jsx
│   │   │   ├── EventDashboard.jsx
│   │   │   ├── EventModal.jsx
│   │   │   ├── FeaturedEvents.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── RegistrationCard.jsx
│   │   │   └── RegistrationForm.jsx
│   │   ├── data/
│   │   │   ├── announcements.js
│   │   │   ├── clubs.js
│   │   │   └── events.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── practical-04-node/
│   ├── data/
│   │   ├── events.json
│   │   └── registrations.json
│   ├── package.json
│   └── server.js
│
├── practical-05-express/
│   ├── controllers/
│   │   ├── eventController.js
│   │   └── registrationController.js
│   ├── data/
│   │   ├── events.json
│   │   └── registrations.json
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── routes/
│   │   ├── eventRoutes.js
│   │   └── registrationRoutes.js
│   ├── package.json
│   └── server.js
│
├── final-app/
│   ├── backend/
│   │   ├── controllers/
│   │   ├── data/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── package.json
│   │   └── server.js
│   └── frontend/
│       ├── src/
│       │   ├── components/
│       │   ├── data/
│       │   ├── services/
│       │   ├── App.jsx
│       │   ├── index.css
│       │   └── main.jsx
│       ├── index.html
│       ├── package.json
│       └── vite.config.js
│
└── README.md
```

---

## 🔒 Quality & Accessibility Standards

- **Semantic HTML5**: Elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) used throughout.
- **Form UX**: Inline validation feedback beside form controls, responsive two-column desktop layouts.
- **Network Resilience**: Loading skeletons, error state boundaries with retry mechanisms, and toast notifications.
- **Zero Forbidden Styles**: No purple, violet, or orange tones; pure Deep Navy + Ivory + Teal palette.
- **Fully Verified**: Every practical is self-contained and independently testable.
