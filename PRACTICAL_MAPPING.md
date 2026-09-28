# PRACTICAL_MAPPING.md — College Event Planner
## Academic Practical Mapping & Viva Preparation

*Consistent with `PRD.md`, `ARCHITECTURE.md` §11, `API.md`, `DATABASE.md`, and `research.md` §32–40. This is the document to study directly before the viva.*

---

# Practical 01 — HTML/CSS/Bootstrap

**Feature:** Responsive Event Homepage (Home + Discover shell — navbar, hero/highlighted events, filter bar, responsive event-card grid, footer)

**Technology:** HTML5 + CSS3 + Bootstrap

**Demonstration:** Open the Discover page at desktop width, then resize down to mobile width live, showing the card grid reflow from 3 columns to 1 and the navbar collapse into a mobile menu.

**What examiner sees:** A visually distinct (not stock-template) responsive page with semantic structure.

**What code/module to show:** The page's HTML structure (`<nav>`, `<main>`, `<section>`, `<article>` per event card), the custom CSS overriding Bootstrap's default theme (colors/typography), and the Bootstrap grid classes in use (`container`, `row`, `col-md-4`, navbar component classes).

**Expected result:** Layout remains usable and readable at every width from 320px to desktop, with no horizontal scroll.

---

# Practical 02 — JavaScript

**Feature:** Event search/filter + interactive registration validation, running against a standalone `events.json` array (independent of the React app / backend, purpose-built for this practical)

**Technology:** JavaScript + JSON + Arrays

**Demonstration:** Load the standalone HTML/JS page → type a search term or pick a category/date filter → list re-renders live using `Array.filter()`/`Array.map()` → click "Register" on an event → submit the plain-JS form with a missing field → inline error message appears → submit again with valid data → success message appears and the new registration is pushed into a local `registrations` array (shown via `console.log` or on-screen).

**What examiner sees:** Dynamic re-rendering driven purely by array operations on a JSON dataset, with no framework involved.

**Validation:** Required-field checks, basic format checks (e.g. email), explicit error messages shown inline — implemented in plain JavaScript, not delegated to HTML5 `required` attributes alone, so the logic is visibly demonstrable.

---

# Practical 03 — ReactJS

**Feature:** Registration form (primary) + reusable `EventCard`/`ClubCard` components (secondary, strengthens the component-model demonstration)

**Technology:** ReactJS

**Demonstrate:**
- **Components** — `EventCard` reused identically on both the Home and Discover pages.
- **State** — `useState` per controlled input in `RegistrationForm`.
- **Controlled inputs** — every field's value and `onChange` bound to React state.
- **Client validation** — inline, conditional error messages rendered based on state, submit disabled until valid.
- **Error messages** — shown per-field, not just a single generic banner.

**Why this feature is ideal:** it is the one screen whose data flows directly into Practical 04/05's server-side validation on the exact same payload, letting the examiner compare client vs. server behavior on one concrete example (e.g., disabling JavaScript or using Postman to bypass the client and showing the server still rejects bad data).

---

# Practical 04 — NodeJS

**Feature:** Server-side validation of the registration submission (and event-listing) handlers, at the Node runtime level

**Technology:** NodeJS

**Demonstrate:** Asynchronous request handling (`async/await` around the MongoDB call), independent re-validation of the same fields React already checked, plus rules only the server can enforce (capacity, deadline, duplicate check), and structured JSON error objects returned on failure.

**What examiner sees:** A request sent directly via Postman (bypassing the React client entirely) with invalid data is still rejected correctly — proving Node, not just the browser, enforces correctness.

---

# Practical 05 — ExpressJS

**Feature:** Routes + middleware + validation across `/api/v1/events` and `/api/v1/registrations`

**Technology:** ExpressJS

**Demonstrate:**
- Route definitions per resource (`routes/events.js`, `routes/registrations.js`).
- `validate()` middleware rejecting malformed request bodies before the controller runs.
- `requireAuth` / `requireRole('organizer')` middleware rejecting an unauthorized request (e.g. a student token attempting `POST /events`) with `403`.
- Centralized `errorHandler` middleware converting a thrown error into the consistent JSON error shape (`API.md` §6).

---

# Practical 06 — REST API

**Feature:** Event CRUD API (plus Clubs and Registrations)

**Technology:** REST + Express + MongoDB

**Demonstrate using Postman:** Follow `API.md` §10 exactly — public `GET /events`, a `403` on `POST /events` as a student, a `400` on `POST /events` with a missing field as an organizer, a successful `201` create followed by a confirming `GET`, a `201` registration followed by a `409` on a duplicate registration attempt, and a `403`/`204` pair showing ownership-based delete authorization.

---

# Practical 07 — MongoDB

**Feature:** Persistent event, club, and registration data

**Technology:** MongoDB + NodeJS (via Mongoose)

**Demonstrate:** Open Atlas/Compass and show the `events`, `clubs`, and `registrations` collections with real sample documents; trigger a duplicate registration from the UI or Postman and show it rejected by the unique `(eventId, userId)` index; run a `find()` with a filter (e.g. `category: "workshop"`); run a `populate()`/aggregate query joining a registration to its event and user to show relationships without full embedding.

---

## FEATURE-TO-PRACTICAL MATRIX

| Feature | P01 | P02 | P03 | P04 | P05 | P06 | P07 |
|---|---|---|---|---|---|---|---|
| Responsive homepage/discover layout | ✓ | | | | | | |
| Standalone JS filter/search demo | | ✓ | | | | | |
| Standalone JS registration validation demo | | ✓ | | | | | |
| React event feed & filter UI | | | ✓ | | | | |
| React registration form (client validation) | | | ✓ | | | | |
| Reusable EventCard/ClubCard components | | | ✓ | | | | |
| Registration submission handling (async) | | | | ✓ | | | |
| Server-side validation (registration & event) | | | | ✓ | ✓ | | |
| Route definitions (events/clubs/registrations) | | | | | ✓ | | |
| Auth/role middleware | | | | | ✓ | | |
| Centralized error handling | | | | | ✓ | | |
| Events/Clubs/Registrations CRUD API | | | | | | ✓ | |
| Postman collection (all resources) | | | | | | ✓ | |
| MongoDB schema (7 collections) | | | | | | | ✓ |
| Duplicate-registration unique index | | | | | | | ✓ |
| Relationship queries (populate/aggregate) | | | | | | | ✓ |
| My Events / registrant list (query + API together) | | | | | | ✓ | ✓ |

---

## VIVA PREPARATION

### Practical 01
- **Likely questions:** "Is this a Bootstrap template?" / "What makes this responsive?"
- **Short answers:** "No — Bootstrap supplies the grid/utility classes, but colors, typography, and card styling are custom CSS." / "The grid uses Bootstrap breakpoints (`col-md-4` etc.) that reflow at defined widths, shown live by resizing."
- **Important concepts:** semantic HTML, CSS specificity/overrides, mobile-first responsive grid.
- **Files to show:** the Discover page markup, the custom stylesheet.
- **Live steps:** resize browser from desktop → mobile.

### Practical 02
- **Likely questions:** "Where does the data live?" / "Why use arrays here?"
- **Short answers:** "A local JSON array in this standalone file, not a database — the database comes in Practical 07." / "Filtering a list is naturally an array operation (`filter`), so arrays are the right data structure for in-memory search."
- **Important concepts:** JSON, array methods (`filter`, `map`, `find`), DOM manipulation, form validation without a framework.
- **Files to show:** `events.json`, the vanilla-JS filter/validation script.
- **Live steps:** filter live, submit invalid then valid registration.

### Practical 03
- **Likely questions:** "How is this different from Practical 02's validation?" / "What is a controlled input?"
- **Short answers:** "React validation is state-driven and reusable across components, not one-off DOM manipulation." / "An input whose value is fully controlled by React state via `value` + `onChange`, rather than the DOM tracking its own value."
- **Important concepts:** components, `useState`, controlled inputs, conditional rendering.
- **Files to show:** `RegistrationForm.jsx`, `EventCard.jsx` (reused in two places).
- **Live steps:** invalid submit → inline errors; valid submit → success state.

### Practical 04
- **Likely questions:** "Why validate again on the server if React already validated?"
- **Short answers:** "Client-side validation can be bypassed (disabled JS, direct API calls), so the server is the real trust boundary."
- **Important concepts:** async/await, request/response lifecycle, trust boundary.
- **Files to show:** the registration route handler / service function.
- **Live steps:** send an invalid payload directly via Postman, bypassing the UI; show it's still rejected.

### Practical 05
- **Likely questions:** "What is middleware?" / "How does role-based access work here?"
- **Short answers:** "A function that runs between the incoming request and the final handler — used here for auth, validation, and error handling." / "The JWT carries a `role` claim; `requireRole('organizer')` checks it before allowing the request through."
- **Important concepts:** middleware chaining, route protection, centralized error handling.
- **Files to show:** `middleware/requireRole.js`, `routes/events.js`.
- **Live steps:** student token attempts `POST /events` → `403`; organizer token → succeeds.

### Practical 06
- **Likely questions:** "Why REST and not just a form POST?" / "What status codes does the API use and why?"
- **Short answers:** "REST decouples frontend and backend so any client — web, mobile, Postman — can use the same API." / "Standard HTTP status codes (`400/401/403/404/409/422`) communicate exactly what went wrong without parsing a message string."
- **Important concepts:** resources, HTTP verbs, status codes, request/response contracts.
- **Files to show:** the Postman collection.
- **Live steps:** run the full sequence in `API.md` §10.

### Practical 07
- **Likely questions:** "Why MongoDB over MySQL?" / "How do you prevent duplicate registrations?"
- **Short answers:** "Event/result documents have optional, evolving fields that fit a flexible document model better than a rigid relational schema needing migrations." / "A unique compound index on `(eventId, userId)`, enforced by MongoDB itself."
- **Important concepts:** documents vs. rows, references vs. embedding, indexes.
- **Files to show:** Atlas/Compass collections, the schema definitions.
- **Live steps:** attempt a duplicate registration; run a filtered `find()`; run a populate/aggregate join.

---

## ACADEMIC COVERAGE CHECK

| Requirement | Covered? | Where? |
|---|---|---|
| HTML/DHTML | Yes | P01 — Discover/Home page markup |
| CSS/CSS3 | Yes | P01 — custom theme over Bootstrap |
| Bootstrap | Yes | P01 — grid, navbar, utility classes |
| Responsive website design | Yes | P01 — TC-022 in `TEST_PLAN.md`, §7 responsive testing |
| JavaScript | Yes | P02 — standalone filter/validation demo |
| JSON | Yes | P02 — `events.json`; also every API response body (P06) |
| Arrays | Yes | P02 — `filter`/`map`/`find` over `events.json` |
| Data storage using JSON/arrays | Yes | P02 — local `registrations` array demo |
| Validation before saving + error messages | Yes | P02 (client, plain JS), P03 (client, React), P04/05 (server) |
| Interactive application (JS) | Yes | P02 — live filtering and form feedback |
| ReactJS | Yes | P03 — `RegistrationForm`, `EventCard`/`ClubCard` |
| Client-side validation (React) | Yes | P03 — inline conditional error rendering |
| Interactive application (React) | Yes | P03 — full Discover + Registration flow |
| Deployment (React) | Yes | `ARCHITECTURE.md` §9 — Vercel/Netlify |
| NodeJS | Yes | P04 — registration/event handlers |
| Server-side validation (Node) | Yes | P04 — re-validation independent of client |
| Node capabilities (async) | Yes | P04 — `async/await` around DB calls |
| Deployment (Node) | Yes | `ARCHITECTURE.md` §9 — Render/Railway |
| ExpressJS | Yes | P05 — routers, middleware |
| Server-side validation (Express) | Yes | P05 — `validate()` middleware |
| Routing | Yes | P05 — resource routers |
| Middleware | Yes | P05 — auth, validation, error-handling middleware |
| Deployment (Express) | Yes | `ARCHITECTURE.md` §9 |
| REST API / CRUD | Yes | P06 — `API.md` full CRUD matrix |
| Database interaction (via API) | Yes | P06/P07 — API endpoints backed by MongoDB |
| Deployment (API) | Yes | `ARCHITECTURE.md` §9 |
| Postman testing | Yes | P06 — `API.md` §9 collection structure |
| NoSQL database / MongoDB | Yes | P07 — `DATABASE.md` full schema |
| Node application interaction with MongoDB | Yes | P07 — via Mongoose in the service layer |
| Deployment (MongoDB) | Yes | `ARCHITECTURE.md` §9 — MongoDB Atlas |
| Self-study: DynamoDB fundamentals | Documented, not implemented | Project report only — `research.md` §25 self-study note; **not** demonstrable live in the running app, by design (`research.md` explicitly instructs against forcing this into the app without a strong reason) |
| Self-study: Apache Cassandra fundamentals | Documented, not implemented | Project report only — same rationale as above |

**Note on the two self-study items:** these are intentionally **not** faked into the running application. They are covered as a written comparison (MongoDB's document model vs. DynamoDB's key-value/document model vs. Cassandra's wide-column model, and when each would be chosen) in the project report per `research.md` §25 and §41. This is flagged explicitly rather than silently omitted, per the instruction not to fake coverage.

---

## CROSS-DOCUMENT CONSISTENCY REVIEW

Performed against `PRD.md`, `ARCHITECTURE.md`, `DATABASE.md`, `API.md`, `PROJECT_PLAN.md`, `TEST_PLAN.md`, and this document:

1. **Roles** (`student`, `organizer`, `admin`) — identical set used in `PRD.md` §5, `ARCHITECTURE.md` §6, `DATABASE.md` `users.role`, `API.md` auth checks, `TEST_PLAN.md` role-based test cases. ✓ consistent.
2. **MVP feature set** — `PRD.md` §10 (auth, event feed+filters, event detail, registration w/ dual validation, My Events, club directory, organizer CRUD, admin approve/remove, REST API, MongoDB) matches exactly what `API.md` exposes as non-V1-marked endpoints and what `DATABASE.md`'s core collections support. ✓ consistent.
3. **V1 features** (results, photos, follow club/event, notifications, archive) — flagged consistently as *(V1)* in `API.md` §4, listed in `PRD.md` §11, and their supporting collections (`results`, `photos`, `notifications`, `clubs.followers`) are present in `DATABASE.md` even though not required for MVP — included now so the schema doesn't need breaking changes later. ✓ consistent, not contradictory.
4. **Registration business rules** (capacity, deadline, duplicate) — appear identically in `PRD.md` FR-008–010, `ARCHITECTURE.md` §7, `API.md` (`/registrations` error cases), `DATABASE.md` §6 (unique index) and §7 (capacity query), and `TEST_PLAN.md` TC-005–007, TC-021. ✓ consistent.
5. **Dropped scope** (departments, categories, venues as separate collections/endpoints; calendar as a separate page) — explained once in `DATABASE.md` §2 and `PRD.md` §14, and not reintroduced anywhere else. ✓ consistent, no contradiction.
6. **Error response shape** — defined once in `API.md` §6 and referred to (not redefined) in `ARCHITECTURE.md` §4 and `TEST_PLAN.md` §4–5. ✓ consistent.
7. **Deployment targets** (Vercel/Netlify, Render/Railway, MongoDB Atlas) — identical across `ARCHITECTURE.md` §9, `PROJECT_PLAN.md` Phase 14, and `API.md` §2 base-URL note. ✓ consistent.

No contradictions were found requiring resolution.

---

## FINAL VALIDATION

1. **Is the MVP realistic?** Yes — it is deliberately smaller than the original feature brainstorm (`research.md` §11–12), scoped to what a small student team can build and demo within the phases in `PROJECT_PLAN.md`.
2. **Does the architecture satisfy all practicals?** Yes, except the two explicitly self-study-only items (DynamoDB, Cassandra), which are documented, not implemented, by design.
3. **Does the database support the PRD?** Yes — every MVP functional requirement in `PRD.md` §8 maps to a collection/field/index in `DATABASE.md`.
4. **Does the API support the database and PRD?** Yes — every `API.md` endpoint reads/writes a collection defined in `DATABASE.md` and exists to satisfy a specific FR in `PRD.md`.
5. **Does the test plan cover the PRD?** Yes — `TEST_PLAN.md` §12's test cases map back to specific FRs and API error cases; see also §13's practical mapping.
6. **Does the project plan cover all implementation work?** Yes — `PROJECT_PLAN.md`'s 15 phases cover setup through deployment and viva rehearsal, with each MVP feature area assigned to a phase.
7. **Does Practical Mapping cover every syllabus requirement?** Yes, per the Academic Coverage Check table above, with the two self-study items explicitly flagged rather than silently dropped.
8. **Are there unnecessary features?** No — payments, waitlists, QR check-in, push notifications, and AI recommendations were deliberately excluded from MVP (`PRD.md` §4) specifically to avoid this.
9. **Are there missing features?** None relative to the MVP scope agreed in `PRD.md` §10; V1/V2 items are intentionally deferred, not missing.
10. **Are there contradictions?** None found — see Cross-Document Consistency Review above.
