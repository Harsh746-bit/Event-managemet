# API.md — College Event Planner
## REST API Specification

*Consistent with `ARCHITECTURE.md` §4/§6/§7 and `DATABASE.md` collections. No implementation code included — this is the contract, not the code.*

---

## 1. API Overview

A single REST API, built with Express, backing the React frontend and testable directly via Postman. All request/response bodies are JSON. Endpoints are grouped by resource: `auth`, `events`, `clubs`, `registrations`. No `departments`, `categories`, `venues`, `results`, `photos`, or `notifications` top-level resources are exposed as independent endpoints in MVP — `results` and `photos` are added as **nested/sub-resources under events in V1** (see §4, marked accordingly); notifications are system-generated (no public create endpoint needed).

---

## 2. Base URL

```
/api/v1
```

Placeholder for the deployed backend origin, e.g. `https://college-event-planner-api.onrender.com/api/v1`, per `ARCHITECTURE.md` §9. All paths below are relative to this base.

---

## 3. Authentication

- `POST /auth/register` and `POST /auth/login` are public.
- All other write endpoints require a valid JWT sent as `Authorization: Bearer <token>`.
- Role-restricted endpoints additionally require the token's `role` claim to match (`organizer` or `admin`), enforced by the `requireRole` middleware (`ARCHITECTURE.md` §4/§6).
- Organizer-only write endpoints additionally check **ownership** (the organizer's `clubId` must match the event's `clubId`) at the service layer, not just role.

---

## 4. Endpoints

### Auth

**`POST /auth/register`**
Purpose: create a new user account (student, or organizer pending approval).
Auth: none.
Request body:
```json
{ "name": "string", "email": "string", "password": "string", "role": "student|organizer", "clubId": "string (required if role=organizer)" }
```
Success: `201 Created`, returns user (without password) + token (students only; organizer accounts return `isApproved:false` and no token until approved — see §Notes below).
Validation failure: `400` — missing/invalid fields, weak password, invalid role.
Conflict: `409` — email already registered.

**`POST /auth/login`**
Purpose: authenticate and receive a JWT.
Auth: none.
Request: `{ "email": "string", "password": "string" }`
Success: `200`, `{ "token": "...", "user": { ...role, clubId, isApproved } }`
Failure: `401` — invalid credentials. `403` — organizer account not yet approved.

**`GET /auth/me`**
Purpose: return the currently authenticated user's profile.
Auth: required (any role).
Success: `200`, user object.

---

### Events

**`GET /events`**
Purpose: list/filter events (Discover feed).
Auth: none (public).
Query params: `category`, `clubId`, `dateFrom`, `dateTo`, `q` (keyword), `status` (defaults to `upcoming`), `page`, `limit` (see §7–8).
Success: `200`, `{ "results": [...], "total": n, "page": n }`

**`GET /events/:id`**
Purpose: single event detail.
Auth: none.
Success: `200`, full event object (plus, if `status: past`, nested `results` and `photos` summary per §Notes).
Not found: `404`.

**`POST /events`**
Purpose: create an event.
Auth: required, role `organizer`, must be `isApproved`.
Request body: `title, description, category, venue, dateTime, registrationDeadline, capacity?, eligibility?, fee?, imageUrl?` (`clubId` and `createdBy` are derived server-side from the authenticated user, not client-supplied, to prevent spoofing).
Success: `201`, created event.
Validation failure: `400` — missing required field, `dateTime`/`registrationDeadline` not a valid future date, `registrationDeadline` after `dateTime`.
Unauthorized: `401` (no token) / `403` (wrong role or not yet approved).

**`PUT /events/:id`** (also accepts `PATCH` for partial update)
Purpose: edit an event.
Auth: required, role `organizer`, and the event must belong to the organizer's club (or `admin`).
Success: `200`, updated event.
Validation failure: `400`. Forbidden: `403` — event belongs to a different club. Not found: `404`.

**`DELETE /events/:id`**
Purpose: remove an event.
Auth: required, role `organizer` (own club) or `admin`.
Success: `204 No Content`.
Forbidden: `403`. Not found: `404`.

**`POST /events/:id/results`** *(V1)*
Purpose: publish winners/summary for a past event.
Auth: required, role `organizer` (own club) or `admin`.
Request: `{ "winners": [{ "name", "position", "prize" }], "summary": "string" }`
Success: `201`.

**`POST /events/:id/photos`** *(V1)*
Purpose: attach a photo to a past event.
Auth: required, role `organizer` (own club) or `admin`.
Request: `{ "url": "string", "caption": "string?" }`
Success: `201`.

---

### Clubs

**`GET /clubs`**
Purpose: list all clubs (directory).
Auth: none.
Query params: `q` (name search), `type` (`club`|`department`).
Success: `200`, array of clubs.

**`GET /clubs/:id`**
Purpose: club detail (upcoming events, past events reference, follower count).
Auth: none.
Success: `200`.
Not found: `404`.

**`POST /clubs`**
Purpose: create a club/department record.
Auth: required, role `admin`.
Request: `{ "name", "type", "description", "logoUrl?", "socialLinks?" }`
Success: `201`.
Validation: `400`. Unauthorized: `401`/`403`.

**`PUT /clubs/:id`**
Purpose: edit club info.
Auth: required, role `admin` or the organizer belonging to that club (self-service profile edit).
Success: `200`.

**`DELETE /clubs/:id`**
Purpose: remove a club.
Auth: required, role `admin`.
Success: `204`.

**`POST /clubs/:id/follow`** *(V1)*
Purpose: current student follows a club.
Auth: required, role `student`.
Success: `200`.

---

### Registrations

**`POST /registrations`**
Purpose: register the current student for an event.
Auth: required, role `student`.
Request: `{ "eventId": "string" }` (student identity derived from token, not client-supplied).
Success: `201`, created registration.
Validation failure: `400` — event doesn't exist, or fields malformed.
Business-rule failure: `409` — duplicate registration for the same event; `422` — registration deadline passed or event at capacity (distinct from a plain validation error, since the *shape* of the request is valid but a business rule blocks it).
Unauthorized: `401`.

**`GET /registrations/mine`**
Purpose: "My Events" — all of the current student's registrations.
Auth: required, role `student`.
Query params: `status` (`registered`|`cancelled`).
Success: `200`, array of registrations with populated event summaries.

**`GET /registrations/event/:eventId`**
Purpose: registrant list for an event (organizer view).
Auth: required, role `organizer` (own club's event) or `admin`.
Success: `200`, array of `{ userId, name, email, registeredAt }`.
Forbidden: `403` — event doesn't belong to this organizer's club.

**`DELETE /registrations/:id`**
Purpose: cancel a registration.
Auth: required — the owning student, or `admin`.
Success: `200`, registration marked `status: cancelled` (soft delete, per `DATABASE.md` §3).
Forbidden: `403`. Not found: `404`.

---

### Admin

**`POST /admin/organizers/:userId/approve`**
Purpose: approve a pending organizer account (`PRD.md` FR-026).
Auth: required, role `admin`.
Success: `200`.

**`GET /admin/organizers/pending`**
Purpose: list organizer accounts awaiting approval.
Auth: required, role `admin`.
Success: `200`, array of users.

*(Event and club removal reuse `DELETE /events/:id` and `DELETE /clubs/:id` with the admin role, rather than duplicating a separate admin-only endpoint — keeps the API surface smaller and consistent.)*

---

## 5. CRUD Matrix

| Resource | GET | POST | PUT/PATCH | DELETE |
|---|---|---|---|---|
| `auth` | `/auth/me` (self) | `/auth/register`, `/auth/login` | — | — |
| `events` | ✓ (public list/detail) | ✓ (organizer) | ✓ (organizer, own club) | ✓ (organizer own / admin) |
| `events/:id/results` | via `GET /events/:id` | ✓ (organizer own / admin) *(V1)* | — | — |
| `events/:id/photos` | via `GET /events/:id` | ✓ (organizer own / admin) *(V1)* | — | — |
| `clubs` | ✓ (public) | ✓ (admin) | ✓ (admin / own organizer) | ✓ (admin) |
| `clubs/:id/follow` | — | ✓ (student) *(V1)* | — | ✓ (unfollow) *(V1)* |
| `registrations` | ✓ (`mine`, `event/:eventId`) | ✓ (student) | — (cancel via DELETE, not update) | ✓ (owning student / admin) |
| `admin/organizers` | ✓ (pending list) | ✓ (approve action) | — | — |

---

## 6. Error Response Format

All errors share one consistent shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Registration deadline has already passed.",
    "fields": {
      "registrationDeadline": "Deadline must be in the future"
    }
  }
}
```

`fields` is present only for `400` validation errors and omitted otherwise. `code` values used consistently across the API: `VALIDATION_ERROR` (400), `UNAUTHORIZED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `CONFLICT` (409), `BUSINESS_RULE_VIOLATION` (422), `SERVER_ERROR` (500).

---

## 7. Pagination

`GET /events` and `GET /registrations/mine` accept `page` (default `1`) and `limit` (default `20`, max `100`). Response includes `total` and `page` alongside `results`, so the frontend can render "Page X of Y" or infinite-scroll without a second request. No other endpoints need pagination at MVP scale (club count, single-event registrant lists, etc. are small enough not to require it).

---

## 8. Filtering and Search

| Endpoint | Query params |
|---|---|
| `GET /events` | `category`, `clubId`, `dateFrom`, `dateTo`, `q` (keyword against title/description), `status` |
| `GET /clubs` | `q` (name search), `type` |
| `GET /registrations/mine` | `status` |

All filters are optional and combinable (e.g. `?category=workshop&clubId=abc123&q=web`).

---

## 9. Postman Testing

Collection structure (one folder per resource, mirroring §4):

```
College Event Planner API
├── Auth
│   ├── Register (student)
│   ├── Register (organizer)
│   ├── Login
│   ├── Login - invalid password (expect 401)
│   └── Get current user
├── Events
│   ├── List events
│   ├── List events - filtered (category+date)
│   ├── Get event detail
│   ├── Create event (organizer)
│   ├── Create event - invalid payload (expect 400)
│   ├── Create event - as student (expect 403)
│   ├── Update event
│   ├── Delete event
├── Clubs
│   ├── List clubs
│   ├── Get club detail
│   ├── Create club (admin)
├── Registrations
│   ├── Register for event
│   ├── Register - duplicate (expect 409)
│   ├── Register - deadline passed (expect 422)
│   ├── Get my registrations
│   ├── Get event registrants (organizer)
│   ├── Cancel registration
└── Admin
    ├── List pending organizers
    └── Approve organizer
```

A Postman environment holds `baseUrl`, `studentToken`, `organizerToken`, `adminToken` as variables, set automatically by a small test script on the Login requests (chaining tokens), so the whole collection can be run top-to-bottom without manual copy-pasting during the viva.

---

## 10. Practical 06 Demonstration

Show, live, in this order:
1. `GET /events` — unauthenticated, public, returns the seeded list.
2. `POST /events` as a **student** token — `403 Forbidden` (role check).
3. `POST /events` as an **organizer** token with a deliberately invalid body (missing `title`) — `400` with field errors.
4. `POST /events` as an **organizer** token with a valid body — `201`, and immediately `GET /events/:id` to show it persisted.
5. `POST /registrations` for that event as a **student** — `201`.
6. `POST /registrations` again for the same event/student — `409` (duplicate).
7. `DELETE /events/:id` as the **wrong** organizer (different club) — `403`, then as the correct organizer or admin — `204`.

This single run-through exercises GET/POST/DELETE, auth, role authorization, validation, and a business-rule conflict — everything the practical asks for — from one Postman collection.
