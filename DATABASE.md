# DATABASE.md — College Event Planner
## MongoDB Database Design

*Consistent with `research.md` §25 and `PRD.md` §8 (functional requirements). No implementation code (schema definitions, Mongoose model code) included — field-level design only.*

---

## 1. Database Overview

The application uses a single MongoDB database (e.g. `college_event_planner`) accessed exclusively from the Express backend via Mongoose. Seven collections are used. This is deliberately fewer than the maximal list suggested in the original brief (`users, events, clubs, departments, registrations, categories, venues, notifications, galleries, photos, results`) — several of those are collapsed into fields rather than their own collections, explained in §2.

---

## 2. Collections

| Collection | Included? | Rationale |
|---|---|---|
| `users` | Yes | Core identity + role for all three personas |
| `events` | Yes | Core entity of the whole product |
| `clubs` | Yes | Needed for the Club directory (`PRD.md` FR-014–016) |
| `registrations` | Yes | Needed for tracking, capacity, duplicate-prevention |
| `results` | Yes | Needed for V1 results/winners feature and the archive |
| `photos` | Yes | Needed for V1 gallery/archive feature |
| `notifications` | Yes | Needed for V1 confirmation/reminder feature |
| `departments` | **No** | For MVP scope, a department is treated as a `type` field on `clubs` rather than a separate collection — there is no requirement (`PRD.md`) that departments have independent membership, events, or media beyond what a club already models. Revisit only if department-level reporting becomes a real requirement. |
| `categories` | **No** | Modeled as a fixed enum/string field on `events` (e.g. `"technical" \| "cultural" \| "sports" \| "workshop" \| "other"`) rather than its own collection — the set of categories is small and does not need independent CRUD, ownership, or metadata. |
| `venues` | **No** | Modeled as a plain string field on `events` (`venue: "Auditorium A"`) — a college project does not need a normalized venue-booking system with its own availability logic; that would be a real scope expansion beyond `PRD.md`'s MVP. |

This keeps the model explainable in a viva (research.md §38, "MongoDB Viva Points" below) while still covering every functional requirement in `PRD.md`.

---

## 3. Collection Schemas

### `users`

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | auto | Primary key |
| `name` | String | Yes | Display name |
| `email` | String | Yes, unique | Login identifier |
| `passwordHash` | String | Yes | bcrypt hash — never plaintext |
| `role` | String (`student`\|`organizer`\|`admin`) | Yes | Determines authorization |
| `clubId` | ObjectId (ref `clubs`) | Only if `role === 'organizer'` | Which club this organizer represents |
| `isApproved` | Boolean | Yes (default `false` for organizers, `true` for students) | Gate per `PRD.md` FR-026 |
| `createdAt` | Date | Yes | Auto-set on creation |

### `clubs`

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | auto | Primary key |
| `name` | String | Yes | Club/department name |
| `type` | String (`club`\|`department`) | Yes | Distinguishes club vs department without a separate collection (§2) |
| `description` | String | Yes | Shown on club detail page |
| `logoUrl` | String | No | Optional image |
| `socialLinks` | Array of String | No | Instagram/website etc. |
| `followers` | Array of ObjectId (ref `users`) | No | For V1 "follow club" feature |
| `createdAt` | Date | Yes | Auto-set |

### `events`

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | auto | Primary key |
| `title` | String | Yes | Event name |
| `description` | String | Yes | Full description |
| `clubId` | ObjectId (ref `clubs`) | Yes | Organizing club |
| `category` | String (enum) | Yes | See §2 rationale |
| `venue` | String | Yes | Plain text location |
| `dateTime` | Date | Yes | Event start |
| `registrationDeadline` | Date | Yes | Last valid registration time |
| `capacity` | Number | No | If absent, treated as unlimited |
| `eligibility` | String | No | Optional free text (e.g. "Open to all", "3rd/4th year only") |
| `fee` | Number | No | Defaults to 0 (free) — retained as a data field even though a *payment flow* is out of MVP scope (`PRD.md` §4); this lets an event display "Fee: ₹100, pay at venue" without building online payment |
| `imageUrl` | String | No | Cover image |
| `status` | String (`upcoming`\|`past`\|`cancelled`) | Yes | Drives archive vs. active-feed placement |
| `createdBy` | ObjectId (ref `users`) | Yes | Organizer who created it |
| `createdAt` / `updatedAt` | Date | Yes | Auto-set/updated |

### `registrations`

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | auto | Primary key |
| `eventId` | ObjectId (ref `events`) | Yes | Which event |
| `userId` | ObjectId (ref `users`) | Yes | Which student |
| `status` | String (`registered`\|`cancelled`) | Yes | Soft-cancel rather than delete, to preserve history |
| `registeredAt` | Date | Yes | Auto-set |

**Unique compound index on `(eventId, userId)`** — the database-level enforcement of "no duplicate registration" (`PRD.md` FR-010).

### `results`

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | auto | Primary key |
| `eventId` | ObjectId (ref `events`), unique | Yes | One results document per event |
| `winners` | Array of `{ name: String, userId: ObjectId (optional), position: String, prize: String }` | No | Embedded sub-array — small, always read/written together with the parent result, so embedding is appropriate here (contrast with `registrations`, which is referenced because it is high-volume and independently queried) |
| `summary` | String | No | Short recap text |
| `publishedAt` | Date | Yes | Auto-set |

### `photos`

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | auto | Primary key |
| `eventId` | ObjectId (ref `events`) | Yes | Which event this photo belongs to |
| `url` | String | Yes | Image location |
| `caption` | String | No | Optional |
| `uploadedAt` | Date | Yes | Auto-set |

### `notifications`

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | auto | Primary key |
| `userId` | ObjectId (ref `users`) | Yes | Recipient |
| `type` | String (`confirmation`\|`reminder`\|`update`\|`cancellation`\|`result`) | Yes | Determines message template |
| `message` | String | Yes | Rendered text |
| `eventId` | ObjectId (ref `events`) | No | Related event, if any |
| `read` | Boolean | Yes (default `false`) | Read state |
| `createdAt` | Date | Yes | Auto-set |

---

## 4. Relationships

- `events.clubId` → `clubs._id` (many events per club)
- `events.createdBy` → `users._id` (many events per organizer)
- `registrations.eventId` → `events._id`, `registrations.userId` → `users._id` (many-to-many between students and events, materialized as its own collection)
- `results.eventId` → `events._id` (one-to-one)
- `photos.eventId` → `events._id` (many photos per event)
- `notifications.userId` → `users._id`, `notifications.eventId` → `events._id` (optional)
- `clubs.followers` → array of `users._id` (many-to-many, embedded as an array on the smaller/less-volatile side of the relationship — see §5)

---

## 5. Embedded vs Referenced Data

| Relationship | Choice | Why |
|---|---|---|
| Event ↔ Club | Reference | Clubs are independently queried (club directory, club detail page) and events must be queryable without loading a club's full document |
| Event ↔ Registration | Reference | High write volume, unbounded growth, needs independent per-user and per-event queries (`PRD.md` FR-011, FR-019) — a textbook case for referencing over embedding |
| Event ↔ Result | Reference (1:1) via `eventId`, but `winners` sub-array is **embedded inside `results`** | Winners are small, fixed-size, and always read/written together with the result they belong to — no independent query need |
| Event ↔ Photos | Reference (separate collection) | A gallery could grow large; archive browsing benefits from querying photos independently of full event documents, rather than bloating every event document (research.md §25) |
| Club ↔ Followers | Embedded array of `userId` on `clubs` | Follower lists are small relative to registrations, read far more often ("is this club followed by me?") than written, and don't need independent pagination for MVP scope |

---

## 6. Indexes

| Collection | Index | Purpose |
|---|---|---|
| `events` | `dateTime` | Sort/filter by date |
| `events` | `category` | Filter by category |
| `events` | `clubId` | Club-detail "upcoming/past events" query |
| `events` | `status` | Separate active feed from archive quickly |
| `registrations` | `(eventId, userId)` **unique** | Enforce FR-010 (no duplicate registration) at the database level |
| `registrations` | `userId` | "My Events" query |
| `users` | `email` **unique** | Enforce one account per email, fast login lookup |
| `clubs` | `name` | Directory search/sort |

No index is proposed purely for theoretical completeness — each one maps directly to a query the application actually performs.

---

## 7. Important Queries

- **Event feed with filters:** `events.find({ status: 'upcoming', category?, clubId?, dateTime: { $gte, $lte } })`, sorted by `dateTime`.
- **Keyword search:** text search or regex match against `title`/`description` (a MongoDB text index can be added if search needs to scale beyond MVP).
- **My Events:** `registrations.find({ userId, status: 'registered' })`, then populate `eventId`.
- **Registrant list (organizer):** `registrations.find({ eventId, status: 'registered' })`, then populate `userId` (name/email only).
- **Duplicate-registration check:** attempt `registrations.create({eventId, userId, ...})`; rely on the unique index to reject with a Mongo duplicate-key error, translated to `409` by the error-handling middleware.
- **Capacity check:** `registrations.countDocuments({ eventId, status: 'registered' })` compared against `events.capacity` before allowing a new registration (an application-layer check, since MongoDB has no native "max array length across a related collection" constraint).
- **Club detail (upcoming/past events):** `events.find({ clubId, status: 'upcoming' })` and a second query for `status: 'past'`.
- **Archive:** `events.find({ status: 'past', clubId?, dateTime: { year filter } })`, joined with `results` and `photos` via `eventId`.

---

## 8. Data Validation

- **Application-layer (Mongoose schema):** required fields, type coercion/checking, enum constraints (`role`, `category`, `status`) — the first line of defense, and the "database validation" referenced in `ARCHITECTURE.md` §7.
- **Unique indexes:** `users.email`, `registrations.(eventId, userId)` — enforced by MongoDB itself, catching violations even if application code has a bug.
- **Referential checks:** since MongoDB does not enforce foreign keys, the service layer is responsible for confirming a referenced `clubId`/`eventId`/`userId` actually exists before writing a document that references it (e.g. reject event creation if `clubId` doesn't resolve to a real club).

---

## 9. Sample Documents

**`users` (organizer):**
```json
{
  "_id": "665f1a2b3c4d5e6f70718293",
  "name": "Ananya Rao",
  "email": "ananya@college.edu",
  "passwordHash": "$2b$10$examplehash...",
  "role": "organizer",
  "clubId": "665f1a2b3c4d5e6f70718201",
  "isApproved": true,
  "createdAt": "2026-07-01T10:00:00Z"
}
```

**`events`:**
```json
{
  "_id": "665f1a2b3c4d5e6f70718310",
  "title": "Intro to Web Dev Workshop",
  "description": "A hands-on session covering HTML, CSS and JS basics.",
  "clubId": "665f1a2b3c4d5e6f70718201",
  "category": "workshop",
  "venue": "Seminar Hall 2",
  "dateTime": "2026-09-15T14:00:00Z",
  "registrationDeadline": "2026-09-14T18:00:00Z",
  "capacity": 60,
  "eligibility": "Open to all years",
  "fee": 0,
  "imageUrl": "https://cdn.example.com/events/webdev.jpg",
  "status": "upcoming",
  "createdBy": "665f1a2b3c4d5e6f70718293",
  "createdAt": "2026-08-20T09:00:00Z",
  "updatedAt": "2026-08-20T09:00:00Z"
}
```

**`registrations`:**
```json
{
  "_id": "665f1a2b3c4d5e6f70718401",
  "eventId": "665f1a2b3c4d5e6f70718310",
  "userId": "665f1a2b3c4d5e6f70718150",
  "status": "registered",
  "registeredAt": "2026-08-25T11:32:00Z"
}
```

**`results`:**
```json
{
  "_id": "665f1a2b3c4d5e6f70718501",
  "eventId": "665f1a2b3c4d5e6f70718099",
  "winners": [
    { "name": "Team Byte Force", "position": "1st", "prize": "₹5000" },
    { "name": "Team Nullptr", "position": "2nd", "prize": "₹2500" }
  ],
  "summary": "20 teams competed in the 24-hour hackathon.",
  "publishedAt": "2026-08-10T20:00:00Z"
}
```

---

## 10. MongoDB Viva Points

A student should be able to explain, unprompted:

1. **Why MongoDB over a relational database** — events, results, and users have optional/evolving fields (e.g. `eligibility`, `fee`, `winners`) that fit a flexible document schema more naturally than a rigid relational table requiring frequent migrations.
2. **Why `registrations` is a separate, referenced collection** rather than an array embedded in `events` — it grows unboundedly and must be queried independently both "by user" (My Events) and "by event" (registrant list); embedding would force loading the entire registrant list every time an event document is read.
3. **Why `winners` is embedded inside `results`** — it's small, fixed, and always read/written as a unit with its parent document; embedding avoids an unnecessary extra collection and query.
4. **How duplicate registrations are prevented** — a unique compound index on `(eventId, userId)`, enforced by MongoDB itself, not just application logic.
5. **How relationships work without foreign keys** — via `ObjectId` references plus `.populate()` calls (Mongoose) that manually join documents at query time.
6. **What indexes exist and why** — each one (§6) maps to an actual query the app runs; none exist "just in case."
