# PRD.md — College Event Planner
## Product Requirements Document

*Source of truth: `research.md`. This document does not contradict it; where a decision needed sharpening for implementation, that is noted explicitly.*

---

## 1. Product Overview

**Product name:** College Event Planner

**Product vision:** Become the one place a student, a club, and a college department all go to publish, discover, register for, and remember campus events — replacing the current mix of WhatsApp groups, Instagram posts, posters, and Google Forms with a single interactive web application.

**Product purpose:** Centralize event discovery, registration, tracking, and historical archiving for a college campus.

**Problem being solved:** Event information is fragmented across channels no single person or system owns, so students miss events, organizers repeat the same publishing work multiple times, and past events/results disappear once a chat scrolls or a poster comes down (research.md §2–3, §7).

---

## 2. Background

Today, students discover events primarily through informal, high-noise channels. Research (research.md §3) confirms:

- **[FACT]** Messaging apps (WhatsApp, Instagram, Facebook Messenger) are a primary way students stay informed about campus happenings and events.
- **[FACT]** WhatsApp groups are widely used for orientation/induction-style event and resource discovery.
- **[FACT]** In at least one documented case, event-group chat noise ("spammy chatter") was found to actively work against students finding the information they need.
- **[FACT]** Students in at least one studied context reported no centralized way to discover all clubs/organizations at their university.

Other channels in common use: posters, static college websites, department announcements, club social pages, and Google Forms for registration. These are treated as **assumptions grounded in general observation**, not independently cited in research, since no academic source specifically measuring poster/college-website usage was found.

---

## 3. Goals

1. Provide a single, centralized event feed covering all participating clubs/departments.
2. Reduce the time to register for an event to under 60 seconds for a returning user.
3. Give every student a persistent, personal record of what they registered for and attended.
4. Give every past event a permanent, browsable archive entry (details + results + photos).
5. Demonstrate, within one coherent product, all seven required web-technology practicals (see `PRACTICAL_MAPPING.md`).

These are directional/qualitative goals appropriate to a course project; no usage-volume targets are set (no user base exists yet to measure against).

---

## 4. Non-Goals (v1 / MVP)

The first version will explicitly **not** attempt to:

- Process payments or paid ticketing.
- Support event waitlists.
- Provide QR-code or ID-swipe check-in.
- Send push notifications (browser or mobile).
- Provide AI-based or machine-learning-driven recommendations.
- Provide a full administrative governance/reporting suite.
- Support multi-college / multi-tenant deployment.
- Integrate with external calendars (Google/Outlook sync).

(research.md §29–31, §44)

---

## 5. Target Users

- **Student** (baseline persona)
- **Active Student** — frequent participant across competitions/workshops/technical events
- **Casual Student** — low-effort, recommendation-driven participant
- **Club Organizer** — creates/manages events for a single club
- **Department Organizer** — oversees multiple clubs/events at department level
- **College Administrator** — approves organizers, moderates content

(Full persona detail: research.md §6)

---

## 6. User Problems

1. No single source of truth for what events exist.
2. Signal buried in noisy chat groups.
3. No centralized club/organization directory.
4. No personal record of what a student registered for.
5. Past events and their results are not durably archived anywhere.
6. Organizers must republish the same event information across multiple disconnected channels.

(research.md §7)

---

## 7. User Stories

### Student

- As a **student**, I want to browse a feed of upcoming events, so that I know what's happening on campus without checking multiple apps.
- As a **student**, I want to search events by keyword, so that I can quickly find something specific.
- As a **student**, I want to filter events by category, date, and club, so that I only see what's relevant to me.
- As a **student**, I want to view full event details (date, time, venue, eligibility, deadline, description), so that I can decide whether to attend.
- As a **student**, I want to register for an event in one short form, so that committing takes as little effort as possible.
- As a **student**, I want to see clear inline errors if I fill the registration form incorrectly, so that I can fix mistakes before submitting.
- As a **student**, I want to save/follow an event I'm interested in without registering yet, so that I can decide later.
- As a **student**, I want to see all events I've registered for in one place ("My Events"), so that I can track my commitments.
- As a **student**, I want to receive a confirmation and a reminder before an event I registered for, so that I don't forget it.
- As a **student**, I want to browse a directory of clubs/departments, so that I can discover organizations I didn't know existed.
- As a **student**, I want to follow a club, so that I can more easily find its future events.
- As a **student**, I want to browse an archive of past events, so that I can see what happened before I joined or before I found out about it.
- As a **student**, I want to view results/winners for a past event, so that I know the outcome without hunting through social media.

### Organizer

- As an **organizer**, I want to create a new event with all relevant details, so that students can discover and register for it.
- As an **organizer**, I want to edit an event after publishing it, so that I can correct mistakes or update details.
- As an **organizer**, I want to see the list of students registered for my event, so that I can plan capacity and logistics.
- As an **organizer**, I want to post an update to an already-published event, so that registered students are informed of changes.
- As an **organizer**, I want to publish results/winners after an event, so that the outcome is recorded and visible.
- As an **organizer**, I want to upload photos to an event after it happens, so that it becomes part of the archive.

### Admin

- As an **admin**, I want to approve new organizer accounts, so that only legitimate club/department representatives can publish events.
- As an **admin**, I want to remove an event that violates platform rules or is a duplicate, so that the feed stays trustworthy.
- As an **admin**, I want to view basic platform activity, so that I can spot problems (e.g. an inactive club account posting spam).

---

## 8. Functional Requirements

| ID | Requirement |
|---|---|
| FR-001 | The system shall display a list of upcoming events on the Home and Discover pages. |
| FR-002 | The system shall allow filtering the event list by category, date range, and club. |
| FR-003 | The system shall allow keyword search across event titles/descriptions. |
| FR-004 | The system shall display a dedicated detail page for each event, showing all fields the organizer provided. |
| FR-005 | The system shall allow an authenticated student to register for an event via a form. |
| FR-006 | The system shall validate registration input on the client (React) before submission. |
| FR-007 | The system shall re-validate registration input on the server (Express) independent of client validation. |
| FR-008 | The system shall reject a registration if the event's capacity has been reached. |
| FR-009 | The system shall reject a registration submitted after the event's registration deadline. |
| FR-010 | The system shall reject a duplicate registration by the same user for the same event. |
| FR-011 | The system shall allow a student to view all events they are registered for ("My Events"). |
| FR-012 | The system shall allow a student to cancel their own registration. |
| FR-013 | The system shall allow a student to save/follow an event without registering. |
| FR-014 | The system shall display a directory of clubs. |
| FR-015 | The system shall display a club detail page showing its upcoming events, past events, and gallery. |
| FR-016 | The system shall allow a student to follow a club. |
| FR-017 | The system shall allow an authenticated organizer to create a new event. |
| FR-018 | The system shall allow an organizer to edit or delete only events belonging to their own club. |
| FR-019 | The system shall allow an organizer to view the registrant list for their own event. |
| FR-020 | The system shall allow an organizer to publish results/winners for a past event. |
| FR-021 | The system shall allow an organizer to attach photos to a past event. |
| FR-022 | The system shall display an Archive view of past events, filterable by year and club. |
| FR-023 | The system shall display results/winners on the detail page of a past event, when published. |
| FR-024 | The system shall send a registration-confirmation notification upon successful registration. |
| FR-025 | The system shall send a reminder notification before the registration deadline and before the event start time. |
| FR-026 | The system shall require Admin approval before a new organizer account can publish events. |
| FR-027 | The system shall allow an Admin to remove any event or organizer account. |
| FR-028 | The system shall expose all core operations (events, clubs, registrations) via a documented REST API. |
| FR-029 | The system shall persist all data in MongoDB. |
| FR-030 | The system shall return structured, consistent JSON error responses for all API failures. |

Each FR above is testable — see `TEST_PLAN.md` for corresponding test cases.

---

## 9. Non-Functional Requirements

- **Performance:** Event feed and filter operations should return results in well under 1 second for a dataset sized for a single campus (hundreds, not millions, of events/registrations) — no specific SLA is set given this is a course project, not a production system.
- **Accessibility:** Semantic HTML, keyboard-navigable forms/filters, visible focus states, alt text on images, WCAG-informed contrast (research.md §23) — not formally audited/certified.
- **Responsiveness:** Fully usable from 320px mobile width up through desktop (research.md §22, §32).
- **Security:** Hashed passwords, role-based authorization, server-side validation on every write endpoint, organizer approval gate (research.md §24).
- **Maintainability:** Clear separation of frontend/backend/database layers; consistent naming across all documents (this PRD, `ARCHITECTURE.md`, `DATABASE.md`, `API.md`).
- **Scalability:** Not a design priority for MVP; `ARCHITECTURE.md` §10 notes what would change if this grew beyond a single campus.
- **Reliability:** Server-side validation must be the final authority on data correctness — client-side validation is a convenience, not a guarantee (research.md §17, §24).
- **Usability:** Registration should be completable in under 60 seconds; no unnecessary required fields (research.md §17, §42).

---

## 10. MVP

Per research.md §29, the MVP is strictly:

- Auth with three roles (student, organizer, admin)
- Event feed with category/date/club filters + keyword search
- Event detail page
- Registration with client-side **and** server-side validation, capacity/deadline/duplicate enforcement
- My Events (registered list + cancel)
- Club directory + club detail page
- Organizer: event create/edit/delete (own club only), registrant list view
- Admin: approve organizer accounts, remove events
- Full REST API covering the above
- MongoDB persistence for all of the above

**Explicitly excluded from MVP:** save/follow events, follow clubs, results/winners, photo galleries, archive page, notifications beyond none, search beyond keyword-in-title/description. These are V1 (research.md §30).

---

## 11. Future Scope

**V1** (research.md §30): results/winners per event, photo gallery, archive page (year/club filter), follow club, save/follow events, basic notifications (confirmation + reminder), improved search.

**V2** (research.md §31): personalized recommendations, schedule-conflict detection, QR check-in, certificates, external calendar sync, organizer analytics dashboard.

---

## 12. Success Criteria

Because this is a course project without a live user base, success is defined functionally rather than by usage metrics:

1. A student can go from "open the site" to "registered for an event" in one continuous flow without leaving the app.
2. An organizer can create an event and see registrants appear in their dashboard without any manual/external step.
3. Every MVP functional requirement (§8) is demonstrably working end-to-end (frontend → API → database → back to frontend).
4. Every one of the seven practicals is demonstrable from within this single running application (`PRACTICAL_MAPPING.md`).
5. Client-side and server-side validation can both be shown independently rejecting the same bad input.

---

## 13. Acceptance Criteria (major features)

**Event Registration**
- Given a logged-in student on an event detail page, when they submit the registration form with all required fields valid, then a registration record is created, a confirmation is shown, and the event appears in "My Events."
- Given the same form with a missing/invalid field, then the client blocks submission and shows an inline error, without any request reaching the server.
- Given a request sent directly to the API (bypassing the client) with the same invalid data, then the server independently rejects it with a `400` and field-level error messages.
- Given a student who has already registered for an event, when they attempt to register again, then the server rejects the request with `409`.
- Given an event whose registration deadline has passed, when any student attempts to register, then the server rejects the request.
- Given an event at full capacity, when any student attempts to register, then the server rejects the request.

**Event Creation (Organizer)**
- Given a logged-in, approved organizer, when they submit a valid event-creation form, then the event appears in the public feed immediately (or per publish setting) and is attributed to their club.
- Given a logged-in student (not an organizer), when they attempt to access the event-creation endpoint directly, then the server responds `403 Forbidden`.

**Club Directory**
- Given any visitor, when they open the Clubs page, then all clubs are listed with name, description, and a link to their detail page.

**Admin Approval**
- Given a newly registered organizer account, when they attempt to create an event before Admin approval, then the server rejects the request until an Admin approves the account.
