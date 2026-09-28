# TEST_PLAN.md — College Event Planner
## Test Plan

*Consistent with `PRD.md` functional requirements (FR-001–030), `API.md` endpoints, and `DATABASE.md` schema. No test has been run yet — all statuses are `Not Run` until the corresponding feature is built (per `PROJECT_PLAN.md` Phase 13).*

---

## 1. Testing Strategy

Testing happens at four layers, matching the validation architecture in `ARCHITECTURE.md` §7: **client-side** (React form behavior), **API** (Postman, direct HTTP requests bypassing the UI), **database** (data integrity independent of the API), and **manual UAT** (full user flows as a real student/organizer/admin would perform them). Server-side/API testing is treated as mandatory and independent of client-side testing — a client-only test suite would not catch a bug where the server trusts unvalidated input.

---

## 2. Functional Testing

Covers: registration, login, event creation, event editing, event deletion, event discovery, search, filters, event registration, duplicate registration, capacity, notifications, archive, results — one pass through the full feature set as described in `PRD.md` §8, executed manually against the running application (not automated for this project scope).

---

## 3. Client-Side Validation

Test on the `RegistrationForm` and `EventForm` (create/edit) components:
- Empty required field → inline error, submit blocked.
- Invalid email format → inline error.
- Invalid phone format (if phone is collected) → inline error.
- `registrationDeadline` before current date/time (event creation) → inline error.
- `registrationDeadline` after `dateTime` (event creation) → inline error.
- All fields valid → submit proceeds, loading state shown, then success state.

---

## 4. Server-Side Validation

Explicitly test by sending requests **directly to the API** (Postman), bypassing the React client entirely, per `PRD.md` FR-007 and `ARCHITECTURE.md` §7:
- Submit a registration with a missing `eventId` → `400`.
- Submit a registration for an event whose `registrationDeadline` has passed → `422`.
- Submit a registration for an event at full `capacity` → `422`.
- Submit a duplicate registration (same user, same event) → `409`.
- Submit an event-creation request as a `student` role token → `403`.
- Submit an event-creation request with no token → `401`.
- Submit an event-edit request for an event belonging to a different club → `403`.
- Submit malformed JSON or an unexpected field type (e.g. `capacity: "abc"`) → `400`.

This section exists specifically to demonstrate that the server does not rely on the client having validated correctly — the same bad inputs above must be rejected identically whether or not the React form would have blocked them.

---

## 5. API Testing

Full Postman coverage per `API.md` §9, including:
- **GET** — list and detail endpoints return correct shape and status `200`; nonexistent `:id` returns `404`.
- **POST** — valid creates succeed (`201`); invalid creates fail (`400`); unauthorized creates fail (`401`/`403`).
- **PUT/PATCH** — valid updates succeed (`200`); updates to another club's resource fail (`403`); nonexistent `:id` returns `404`.
- **DELETE** — valid deletes succeed (`204`/`200`); unauthorized deletes fail (`403`); nonexistent `:id` returns `404`.
- **Authentication** — login with correct credentials succeeds; incorrect password fails (`401`); expired/invalid token on a protected route fails (`401`).
- **Unauthorized access** — every role-protected endpoint tested with a token of the wrong role.
- **Invalid IDs** — malformed `ObjectId` strings passed as `:id` return `400`, not a server crash (`500`).

---

## 6. Database Testing

- **Insert** — creating a document via the API results in a matching document visible in MongoDB Atlas/Compass.
- **Update** — an edit via the API is reflected in the stored document (`updatedAt` changes).
- **Delete** — a delete via the API removes (or soft-deletes, for registrations) the document as expected.
- **Retrieval** — filtered queries (`GET /events?category=...`) return only matching documents.
- **Relationships/references** — a populated `GET /registrations/mine` correctly joins registration → event data; a populated registrant list correctly joins registration → user data.
- **Invalid data** — attempting to insert a document missing a required field (bypassing the API, e.g. via a direct script) is rejected by the Mongoose schema.
- **Unique index enforcement** — attempting to insert two `registrations` with the same `(eventId, userId)` directly at the database layer is rejected independent of application logic.

---

## 7. Responsive Testing

Manually test the Home, Discover, Event Detail, and Registration Form pages at:

| Width | Device class |
|---|---|
| 320px | Small mobile |
| 375px | Standard mobile |
| 768px | Tablet |
| 1024px | Small desktop/laptop |
| 1440px+ | Large desktop |

Confirm: navbar collapses to a mobile menu below tablet width (`ARCHITECTURE.md`/`research.md` §15), event-card grid reflows from multi-column to single-column, no horizontal scroll appears at any width, and touch targets remain usable at 320–375px.

---

## 8. Browser Testing

Recommended browsers, reflecting realistic student device usage rather than exhaustive enterprise coverage: **Chrome** (primary — most common on student laptops/Android devices), **Safari** (iOS devices, common among students), **Firefox** (secondary desktop check), **Edge** (secondary desktop check). Formal cross-browser automation is out of scope for this project size; manual spot-checks in each are sufficient.

---

## 9. Accessibility Testing

- **Keyboard navigation** — every interactive element (nav links, filters, form fields, buttons) reachable and operable via Tab/Enter/Space without a mouse.
- **Focus states** — a visible focus outline on every focusable element.
- **Contrast** — text and category-tag colors checked against WCAG AA contrast ratios.
- **Labels** — every form input has an associated, programmatically-linked label (not placeholder-only).
- **Screen-reader basics** — spot-check the event feed and registration form with a screen reader (e.g. VoiceOver/NVDA) to confirm headings and form errors are announced.
- **Reduced motion** — any transition/animation on the event feed respects `prefers-reduced-motion`.

---

## 10. Security Testing

- **Authentication** — cannot access any protected endpoint without a valid token; expired tokens are rejected.
- **Authorization** — a student token cannot perform organizer/admin actions (event create/edit/delete, approve organizer); an organizer token cannot edit another club's event.
- **Input validation** — server rejects malformed/oversized input rather than crashing (see §4).
- **Injection prevention** — confirm Mongoose's parameterized query building is used throughout (no raw string concatenation into queries), and that search/filter query params are not passed unsanitized into `$where` or similar constructs.
- **Password handling** — passwords are never returned in any API response; stored only as bcrypt hashes, confirmed by inspecting the `users` collection directly.
- **API access control** — every role-protected route in `API.md` §5 (CRUD Matrix) is individually tested against a token of each *other* role to confirm it's rejected.

---

## 11. User Acceptance Testing

**Student scenario:** Log in → browse Discover → filter by category → open an event → register → see confirmation → find the event in "My Events" → cancel the registration → confirm it no longer appears as active.

**Organizer scenario:** Log in (approved account) → create a new event → confirm it appears in the public Discover feed → view the registrant list after a student registers → edit the event's venue → confirm the change is visible on the public detail page.

**Admin scenario:** Log in → view pending organizer approvals → approve one → confirm that organizer can now create events → remove an event → confirm it no longer appears publicly.

---

## 12. Test Case Table

| ID | Feature | Test Case | Input | Expected Result | Status |
|---|---|---|---|---|---|
| TC-001 | Registration (client) | Submit empty required field | Empty `name` | Inline error, no request sent | Not Run |
| TC-002 | Registration (client) | Submit invalid email | `email: "not-an-email"` | Inline error | Not Run |
| TC-003 | Registration (client) | Submit fully valid form | Valid data | Success state shown | Not Run |
| TC-004 | Registration (server) | POST with missing eventId | `{}` | `400 VALIDATION_ERROR` | Not Run |
| TC-005 | Registration (server) | POST after deadline passed | Valid eventId, past deadline | `422 BUSINESS_RULE_VIOLATION` | Not Run |
| TC-006 | Registration (server) | POST at full capacity | Valid eventId, capacity reached | `422 BUSINESS_RULE_VIOLATION` | Not Run |
| TC-007 | Registration (server) | Duplicate registration | Same user+event twice | `409 CONFLICT` | Not Run |
| TC-008 | Event creation | Create as student role | Valid body, student token | `403 FORBIDDEN` | Not Run |
| TC-009 | Event creation | Create as approved organizer | Valid body, organizer token | `201 Created` | Not Run |
| TC-010 | Event creation | Create with missing title | Body missing `title` | `400 VALIDATION_ERROR` | Not Run |
| TC-011 | Event update | Edit another club's event | Organizer token, foreign `eventId` | `403 FORBIDDEN` | Not Run |
| TC-012 | Event delete | Delete own event as organizer | Valid `eventId` | `204 No Content` | Not Run |
| TC-013 | Discovery | Filter by category | `?category=workshop` | Only workshop events returned | Not Run |
| TC-014 | Discovery | Keyword search | `?q=web` | Events matching title/description | Not Run |
| TC-015 | My Events | Get registrations for logged-in student | Student token | List of own registrations only | Not Run |
| TC-016 | Registrant list | Organizer views own event's registrants | Organizer token, own `eventId` | List of registrants | Not Run |
| TC-017 | Registrant list | Organizer views another club's event registrants | Organizer token, foreign `eventId` | `403 FORBIDDEN` | Not Run |
| TC-018 | Admin approval | Organizer creates event before approval | Unapproved organizer token | `403 FORBIDDEN` | Not Run |
| TC-019 | Admin approval | Admin approves organizer | Admin token, valid `userId` | `200`, organizer can then create events | Not Run |
| TC-020 | Auth | Login with wrong password | Valid email, wrong password | `401 UNAUTHORIZED` | Not Run |
| TC-021 | Database | Duplicate registration at DB layer | Direct duplicate insert | Rejected by unique index | Not Run |
| TC-022 | Responsive | Discover page at 320px | — | No horizontal scroll; single-column cards | Not Run |
| TC-023 | Accessibility | Tab through registration form | Keyboard only | All fields reachable, visible focus | Not Run |
| TC-024 | Security | Access admin route with student token | Student token | `403 FORBIDDEN` | Not Run |

*(Table intentionally covers representative cases per section above, not an exhaustive enumeration; extend directly from §2–11 as implementation proceeds.)*

---

## 13. Practical Demonstration Tests

| Practical | Relevant test cases |
|---|---|
| P01 (HTML/CSS/Bootstrap) | TC-022 (responsive) |
| P02 (JavaScript) | TC-001–003 equivalent, run against the standalone JS/JSON demo rather than React |
| P03 (React) | TC-001–003, TC-023 |
| P04 (Node.js) | TC-004–007 (server-side rejection independent of client) |
| P05 (Express) | TC-008, TC-011, TC-017, TC-018, TC-024 (middleware/auth/role enforcement) |
| P06 (REST API) | TC-004–012, TC-020 (full Postman run per `API.md` §10) |
| P07 (MongoDB) | TC-007, TC-021 (unique index), plus a live `find()`/populate query shown in Compass |
