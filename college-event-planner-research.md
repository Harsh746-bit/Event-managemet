# COLLEGE EVENT PLANNER
## PRODUCT + UX + TECHNICAL + ACADEMIC RESEARCH

*Prepared as a research and architectural-decision document. No UI or code is generated here — this is the evidence base a design/engineering agent (or you) should use to build the product and write the practical/viva demonstrations.*

**How to read this document:** claims are marked **[FACT]** (verifiable from a cited source), **[INFERENCE]** (a reasonable conclusion drawn from FACTs, not independently verified), or **[RECOMMENDATION]** (a decision this research is making for the project). Where competitor information could not be verified, it is marked **"Not verified."**

---

## 1. Executive Summary

College event information today is fragmented across WhatsApp groups, Instagram posts, posters, static department pages, and ad-hoc Google Forms. Dedicated campus-engagement platforms (CampusGroups, Localist, Modern Campus Involve, Guidebook) already solve this at the institutional level in the US, and general-purpose tools (Eventbrite) solve ticketing/discovery for the public. A single student developer/team can realistically build a **student- and club-scale version** of this category — a centralized event hub with discovery, registration, tracking, clubs, and an archive — and that same product happens to map almost perfectly onto a typical full-stack web syllabus (HTML/CSS/Bootstrap → JS → React → Node → Express → REST → MongoDB), because each layer is a genuine architectural tier of a real web app, not an artificial add-on.

**[RECOMMENDATION]** Build one product: a React + Bootstrap-styled frontend, an Express/Node REST API, and MongoDB storage, centered on four pillars — **Discover, Register, Track, Remember (Archive)** — with three roles (Student, Organizer, Admin). The registration flow is the natural spine that demonstrates client-side (React) and server-side (Node/Express) validation on the *same* form, and the events/clubs/registrations resources are the natural spine of the REST/MongoDB layers.

---

## 2. Problem Definition

Students need one reliable place to answer four questions: *What's happening? Should I go? How do I get in? Did I already register?* Today no such single source exists on most campuses; information lives wherever the organizing club chooses to post it. Existing campus-engagement software (CampusGroups, Modern Campus Involve, Localist) solves this well but is licensed institutional software, not something a student project can adopt — it does, however, tell us what "good" looks like and which patterns are proven **[FACT]**, e.g. centralized calendars, org profiles, QR/ID check-in, approval workflows.<cite index="3-1">CampusGroups is described as providing a centralized place where students can find and register for events across campus, with a dedicated event app, on-the-go registration, and multiple check-in methods including QR codes, ID swipes, and self-check-in.</cite>

---

## 3. Current College Event Discovery Landscape

**[FACT]** Messaging apps are central to how students stay informed: research on WhatsApp groups used for university induction found they help students navigate university life, find events, and connect with academic resources.<cite index="20-1">A dataset on WhatsApp groups' effectiveness in inducting first-years documents how such groups help students navigate university life, find events, and connect with academic resources.</cite> **[FACT]** A study of international community-college students similarly found <cite index="17-1">that Facebook Messenger, WhatsApp, and Instagram helped participants stay updated about campus events and communicate with instructors.</cite>

**[FACT]** A campus-community developer building a similar unified platform independently identified the same fragmentation problem: <cite index="31-1">campus event information is often scattered across WhatsApp groups, notice boards, and emails, forcing students to juggle WhatsApp forwards, Gmail threads, and dusty notice boards instead of having one place for everything.</cite>

**[FACT]** A UX case study of an Indian university engagement app found no dedicated solution existed in that market: <cite index="32-1">during competitive analysis the researcher could not find any app on the Play Store effectively solving campus event/club discovery for Indian university students.</cite> The same study found two concrete, recurring pain points worth carrying into requirements: <cite index="32-1">students found WhatsApp event groups became overrun with spammy chatter, and students struggled to discover all the clubs and teams at their university because there was no centralized source.</cite> Their fix — splitting each event's communication into a host-only "Updates" channel and an open "Chat" — and adding a dedicated Clubs directory, are both directly reusable patterns.

**[INFERENCE]** These sources consistently support (without contradiction) three of the assumed failure modes from the brief: information fragmentation, no centralized club directory, and noisy/low-signal channels. Two other assumed failure modes — "past events disappear" and "results are hard to find" — are plausible but were **not independently verified** by academic sources found in this search; they are treated as reasonable product hypotheses, not established facts.

---

## 4. Existing Alternatives (competitor landscape)

### Direct competitors (built specifically for campus events)
| Product | Relevance |
|---|---|
| **CampusGroups** (Ready Education) | Institutional campus-community platform: org profiles, events, registration, check-in, engagement analytics. |
| **Localist** (Concept3D) | Centralized campus event *calendar* product used by many universities (Boise State, Rutgers–Newark, UNR); strong on discovery, submission workflows, and API. |
| **Modern Campus Involve** (formerly Presence) | Co-curricular engagement portal with gamified involvement tracking. |
| **Guidebook** | Campus/event mobile-app builder, orientation & event-specific apps. |
| **CampVents** | A newer, purpose-built university events app (ticketing, QR check-in, club/community management) — closest analog in spirit to this project. |
| **CampusConnect** (independent dev project, 2026) | A solo/small-team build with nearly identical scope to this brief — validates that the scope is achievable at student-project scale. |

### Indirect competitors (solve part of the problem)
- **Eventbrite** — public event discovery + ticketing marketplace, not campus-specific.
- **Google Forms + WhatsApp/Instagram + posters** — the informal "system" most colleges actually run on today.
- **University static websites/notice boards** — one-way, non-interactive, not personalized.

**Why each is relevant:** direct competitors define the feature ceiling (what "good" looks like at institutional scale); indirect competitors define the *actual baseline* students are used to, which is what this product must beat, not the enterprise tools' entire feature set.

---

## 5. Competitor Analysis

| Dimension | CampusGroups | Localist | Eventbrite | Our Platform (target) |
|---|---|---|---|---|
| Primary purpose | Campus community + engagement suite | Campus event calendar/discovery | Public event marketplace + ticketing | Campus event discovery + registration + archive |
| Event discovery | In-app feed, org-based | <cite index="26-1">Personalized recommendations, tags, filters, mobile alerts</cite> | Marketplace search across public events | Category/date/club filters + "happening now" |
| Registration | <cite index="5-1">Free/paid tickets, tiers, secure payments in one platform</cite> | Register function, RSVP, waitlists | Ticketing, multiple ticket types | Simple in-app RSVP form, capacity + deadline aware |
| Check-in | <cite index="3-1">QR code, ID swipe, manual, self-check-in QR</cite> | Not verified | QR mobile ticketing | Out of MVP scope (V1/V2) |
| Org/club discovery | Org profiles, memberships | <cite index="36-1">Campus event organization, channels for multiple departments</cite> | Not a focus | Dedicated Clubs directory + follow |
| Archive/history | Co-curricular transcript of participation | Not verified for public archive | Not a focus (marketplace, not campus memory) | Yearly archive, results, galleries — core differentiator |
| Analytics for organizers | <cite index="5-1">Attendance tracking, feedback surveys, data-driven planning</cite> | Not verified | <cite index="9-1">Comprehensive reporting on performance and demographics</cite> | Basic registration counts (MVP), richer analytics (V2) |
| Personalization | Not verified in detail | <cite index="26-1">Personalized recommendations, tags, filters</cite> | Marketplace-style, competing events shown | Interest/club-based recommendations (V1) |
| Accessibility | Not verified | <cite index="26-1">WCAG 2.1 AA compliant, screen-reader support, responsive</cite> | Not verified | WCAG-informed baseline (see §23) |
| Notable weakness | Institutional pricing, not student-buildable | Calendar-first, weaker on registration UX for small clubs | <cite index="14-1">Per-ticket fees, weak multi-session support, limited customization</cite>; <cite index="10-1">discovery is a supplement, not a primary driver, since competing events are also shown</cite> | — |

**Patterns worth borrowing:** centralized calendar with tags/filters (Localist), org-centric profiles (CampusGroups), splitting "official updates" from "chat" (independent case study), QR check-in as a *future* enhancement, not MVP.
**Patterns worth avoiding:** Eventbrite's marketplace model showing *competing* events on your own event page — wrong incentive for a single-campus product; per-attendee fees; over-broad enterprise feature sets that <cite index="7-1">institutions may find more complex than necessary for simpler needs</cite>.

---

## 6. User Personas

**Student (baseline)** — Goals: know what's happening without hunting; register in under a minute; not miss deadlines. Frustrations: scattered WhatsApp/Instagram posts, forms with unclear deadlines, no memory of what they registered for. Current alternative: mental tracking + screenshots.

**Active Student** — High participation across competitions/workshops/tech events. Needs: fast filtering by category/date, reminders, a personal "My Events" schedule, conflict awareness. Objection: "will this actually have all the events, or just some clubs'?"

**Casual Student** — Rarely searches actively; discovers by accident via friends/social feeds. Needs: low-effort recommendations, a "why this matters to you" framing, one-tap registration. Objection: "another app to install/check."

**Club Organizer** — Publishes events, manages a registration list, needs to post updates fast. Needs: simple event creation form, a registrant list/export, an easy way to publish results/winners after the event. Frustrations today: re-typing the same info into Instagram, WhatsApp, Google Forms, and posters. Objection: "will this take more effort than what I do now?" — the product must be *faster*, not just "another channel."

**Department Organizer** — Similar to Club Organizer but oversees multiple events/clubs; wants a departmental view.

**College Administrator** — Needs oversight/moderation: approve new organizer accounts, resolve disputed/duplicate events, view platform-wide activity. Frustration: fake/unauthorized event postings, outdated information staying live. **[INFERENCE]** Given this is a student academic project rather than an institution-run rollout, Admin can be a thin role (approve organizers, remove events) rather than a full governance suite.

---

## 7. User Pain Points (synthesized from §3 and personas)

1. Fragmentation across WhatsApp/Instagram/posters/forms — no single source of truth **[FACT-supported]**.
2. Signal buried in noisy group chats **[FACT-supported]**.
3. No centralized club/organization directory **[FACT-supported]**.
4. No personal record of "what did I register for / attend" **[INFERENCE]**.
5. Past events and results vanish once the poster is taken down or the chat scrolls past **[INFERENCE, plausible but not independently verified]**.
6. Organizers repeat the same publishing work across four channels **[INFERENCE, supported indirectly by organizer-facing tooling emphasis in CampusGroups/Localist docs]**.

---

## 8. Student Journey

| Stage | Goal | Friction today | Platform opportunity |
|---|---|---|---|
| Discover | See what's on | Scattered channels | Central feed + filters + "happening now" |
| Explore | Compare options | Incomplete info in posters | Standard event-detail template |
| Evaluate | Decide to attend | Unclear eligibility/fee/deadline | Clear above-the-fold facts |
| Register | Commit | Google Form fatigue, duplicate entry | 60-second in-app form, remembers profile |
| Prepare | Not forget | No reminders | Notification before deadline & event |
| Attend | Show up correctly | Venue changes missed | Push/update on changes |
| Receive updates | Stay informed | Chat noise | Dedicated update channel per event |
| Participate | — | — | — |
| View results | Find outcome | Buried in a later Instagram post | Results tab per event |
| Remember/share | Recall past involvement | Nothing persists | Personal archive + club archive |

**Highest-friction stages:** Discover (fragmentation) and Register (repeated manual entry) — these should be the MVP's strongest features.

---

## 9. Organizer Journey

CREATE → PUBLISH → MANAGE REGISTRATIONS → UPDATE → CONDUCT EVENT → PUBLISH RESULTS → ARCHIVE

Friction today: retyping the same event across channels; no single registrant list; results posted informally and never centrally recorded. Opportunity: one creation form populates the whole lifecycle, including the eventual archive entry.

---

## 10. Administrator Journey

REVIEW NEW ORGANIZER/EVENT → APPROVE/REJECT → MONITOR → MODERATE/REMOVE → REPORT. Kept intentionally thin for MVP (see §24, §27).

---

## 11. Feature Inventory

**Must Have (MVP):** event feed with category/date filters, event detail page, registration form with client + server validation, "My Events" (registered list), club directory + club detail page, basic notifications (registration confirmation, reminder), organizer event-creation form, admin approve/remove.

**Should Have:** save/follow events without registering, follow a club, results/winners per event, photo gallery per event, search.

**Could Have:** personalized recommendations, event collections/curated lists, schedule-conflict detection, "happening now" live indicator.

**Future/Experimental:** QR check-in, certificates, co-curricular transcript, campus activity heatmap, AI-based recommendations, calendar (Google/Outlook) sync — **[FACT]** something Localist already offers: <cite index="35-1">integration with Google Calendar, Outlook, and campus CMS tools via RSS/ICS/API feeds</cite>.

---

## 12. Feature Prioritization

| Feature | User Value | Academic Value | Differentiation | Complexity | Priority |
|---|---|---|---|---|---|
| Event feed + filters | High | High (P01/P02) | Medium | Low | P0 |
| Event detail page | High | High (P01/P03) | Low | Low | P0 |
| Registration (client+server validation) | High | Very High (P02/P03/P04/P05) | Medium | Medium | P0 |
| My Events / tracking | High | Medium (P03/P06/P07) | Medium | Low | P0 |
| Club directory | High | Medium (P01/P06/P07) | High | Low | P0 |
| REST API (events/clubs/registrations) | — | Very High (P06) | — | Medium | P0 |
| MongoDB persistence | — | Very High (P07) | — | Medium | P0 |
| Notifications (basic) | Medium | Low | Medium | Medium | P1 |
| Results/winners | Medium | Low | High | Low | P1 |
| Archive/gallery | Medium | Low | Very High | Medium | P1 |
| Follow club/event | Medium | Low | Medium | Low | P2 |
| Recommendations | Low–Medium | Low | Medium | High | P2/Future |
| QR check-in / certificates | Low (for MVP) | Low | High (product) | High | Future |

---

## 13. Product Differentiation

**Why use this over Eventbrite/Forms/Instagram/WhatsApp/college site?** Because none of them is *campus-specific, two-way, and persistent* at once: Eventbrite surfaces competing events and charges fees <cite index="14-1">with per-ticket fees and weak multi-session support</cite>; Instagram/WhatsApp are one-way broadcast channels with no registration tracking or archive; Google Forms has no discovery layer at all; the college website is static and rarely mobile-optimized. This product's core value proposition: **one campus-scoped place where discovering, registering for, and remembering an event are the same action, not three separate tools.**

**Core value proposition:** a single, campus-scoped hub that turns event chaos into a trackable, memorable timeline.
**Primary differentiator:** the archive (turns past events into campus memory, not just a folder of photos).
**Secondary differentiators:** unified club directory; registration tracking ("My Events"); noise-free update channel per event.
**Defensible advantages (for a small/single-campus deployment):** none of the enterprise tools are affordable/available to a single club or student body without institutional buy-in — a lightweight, free, student-built version fills that gap. **[INFERENCE]**

---

## 14. Information Architecture

**[RECOMMENDATION]** Smallest architecture that still delivers value and demonstrates every practical:

- **Home** – highlighted/upcoming events, quick filters
- **Discover Events** – full feed, search, filters (category, date, club)
- **Event Details** – full event info, register/save, results (post-event)
- **Clubs** – directory
- **Club Details** – profile, upcoming/past events, gallery
- **My Events** – registered + saved events (student dashboard)
- **Archive** – past events, filterable by year/club, with results/photos
- **Organizer Dashboard** – create/manage events, view registrants, publish results
- **Admin Dashboard** – approve organizers/events, remove content
- **Login/Register (auth)** — required to support personalization + role separation

Dropped from the original brief as separate top-level pages for MVP: **Calendar** (folded into Discover as a view toggle, not a separate data model — reduces complexity without losing value) and **Notifications/Results/Profile** as standalone pages (folded into My Events / Event Detail / Auth respectively for MVP; can become dedicated pages in V1).

---

## 15. Navigation Recommendation

**[RECOMMENDATION]** Top navbar (Bootstrap) for desktop: Home · Discover · Clubs · Archive · My Events · (Organizer/Admin link if role applies) · Profile/Login. On mobile: collapse into a Bootstrap offcanvas/hamburger menu, since a five-to-seven-item navbar does not fit mobile width and bottom-nav would need custom Bootstrap components not central to the syllabus. Organizer and Admin get a small distinct dashboard shell (sidebar) reachable only after login with the right role — this also becomes a natural place to demonstrate route protection (client-side conditional rendering in React, server-side authorization middleware in Express).

---

## 16. Event Detail Requirements

**Above the fold:** title, image, date/time, venue, organizer/club, category, registration deadline, register/save CTA.
**Secondary:** description, eligibility, capacity/seats remaining, fee (if any).
**Expandable/optional:** schedule, rules, prizes, speaker info, contact, related events, results (only after the event has occurred).

**[RECOMMENDATION]** Not every field belongs on every event — a casual club meetup doesn't need "prizes" or "eligibility," so the detail page should render conditionally based on which fields the organizer filled in, rather than always showing every field (this is itself a good React conditional-rendering demonstration for Practical 03).

---

## 17. Registration UX

**[RECOMMENDATION]** Keep it to a single short step: name/roll-no (or auto-filled from profile), email, phone, optional team/notes field — submit — instant confirmation. Client-side (React) validates required fields, email/phone format, and shows inline errors before submission. Server-side (Node/Express) re-validates the same rules plus business rules a client can't fully enforce: capacity not exceeded, deadline not passed, no duplicate registration for the same user+event. This dual validation on the *same form* is exactly what Practicals 03–05 ask for, without inventing a second, unrelated form.

Waitlist and payment are explicitly **out of MVP** — they add real complexity (concurrency handling, payment gateway integration) without adding syllabus coverage.

---

## 18. Discovery & Personalization

**[RECOMMENDATION]** MVP: category, date, and club filters plus keyword search — enough to demonstrate JS array filtering (P02) and React state-driven UI (P03) without machine-learning complexity. Simple personalization ("events from clubs you follow" or "events in categories you've registered for before") is a reasonable **V1** feature: it's just a filtered query against registrations/follows, no ML needed. Full AI-based recommendation is explicitly **not warranted** for MVP — it adds complexity without adding syllabus value and risks becoming a feature added "because AI," which the brief itself warns against.

---

## 19. Club & Department Experience

**[RECOMMENDATION]** Club detail page: name, logo/description, upcoming events, past events, achievements/results summary, gallery, contact/social links, follow button. Students should be able to follow clubs — it's a cheap way (one join-table write) to power personalization and notifications later, and it directly answers the discovery gap found in research (**[FACT-supported]**, §3: <cite index="32-1">students struggled to discover all the clubs and teams because there was no centralized source</cite>).

---

## 20. Archive Strategy

**[RECOMMENDATION]** This is the strongest product differentiator (§13). Structure it as: Archive → filter by year/club/category → each past event shows its original detail info **plus** results/winners and a photo gallery. This reuses the Event and Gallery/Result data models already needed for MVP — it's the same event record with `status: "past"` plus attached Result and Photo documents, not a separate subsystem. That keeps it cheap to build while being the most memorable feature to demo.

---

## 21. Notification Strategy

**[RECOMMENDATION]** MVP notifications: registration confirmation, reminder before deadline, reminder before event start. V1: venue/schedule change, cancellation, results published, club announcement. Keep to in-app/email only for MVP (no push infrastructure needed) — this avoids notification fatigue and keeps the Node/Express layer's job simple (an email/queue call on specific write operations) rather than building a real-time push system.

---

## 22. Mobile/Desktop Strategy

**[INFERENCE]** Students overwhelmingly encounter campus info via mobile (WhatsApp/Instagram usage patterns above), so discovery, event-detail, and registration flows should be mobile-first responsive (Bootstrap grid + breakpoints), while the Organizer/Admin dashboards can be designed desktop-first since they involve more data entry and table review, typically done at a laptop.

---

## 23. Accessibility

Baseline informed by Localist's stated compliance target: **[FACT]** <cite index="35-1">Localist's calendar meets WCAG 2.1 AA standards, with screen-reader support and responsive layouts across devices</cite>. **[RECOMMENDATION]** apply the same bar where feasible: semantic HTML landmarks, keyboard-navigable filters/forms, visible focus states, alt text for event/gallery images, sufficient color contrast for category tags, and touch targets ≥44px on mobile cards/buttons. Avoid motion-heavy transitions on the event feed for users with reduced-motion preferences.

---

## 24. Security

**[RECOMMENDATION, minimum viable]**
- Passwords hashed (bcrypt) — never stored plain.
- JWT (or session) based auth; role stored in token/session (student/organizer/admin).
- Express middleware for route protection (`requireAuth`, `requireRole`) — a clean, natural P05 demonstration.
- Server-side validation on every write endpoint (never trust client-only validation) — this *is* Practical 04/05's requirement, not an add-on.
- Rate-limit/duplicate-check on registration writes to avoid duplicate/spam registrations.
- Organizer accounts require Admin approval before they can publish events, to reduce fake/unauthorized events (addresses the Trust & Safety concern from the first brief).

Do not over-engineer: no need for OAuth providers, 2FA, or encryption-at-rest beyond what MongoDB Atlas provides by default for an academic project.

---

## 25. MongoDB Data Model

**[RECOMMENDATION — kept intentionally simple for an academic viva]**

Collections and key fields:
- **users**: `_id, name, email, passwordHash, role (student|organizer|admin), club (ref, optional for organizers), createdAt`
- **clubs**: `_id, name, description, logoUrl, socialLinks, followers: [userId]`
- **events**: `_id, title, description, clubId (ref), category, venue, dateTime, registrationDeadline, capacity, eligibility, fee, imageUrl, status (upcoming|past|cancelled), createdBy (ref users)`
- **registrations**: `_id, eventId (ref), userId (ref), status (registered|cancelled), registeredAt` — unique index on `(eventId, userId)` to block duplicates
- **results**: `_id, eventId (ref), winners: [{ userId or name, position, prize }], summary`
- **photos**: `_id, eventId (ref), url, caption`
- **notifications**: `_id, userId (ref), type, message, read, createdAt`

**Embedding vs referencing:** Reference events↔clubs and events↔registrations (many-to-many-ish, high write volume, needs independent querying) rather than embedding, since registrations grow unboundedly and must be queryable per-user ("My Events") and per-event (organizer's registrant list) independently — a classic case for references over embedding in MongoDB schema design. Photos can be embedded as a small array inside `events` if galleries stay small, or kept as a separate collection if a club/event could have many photos — **[RECOMMENDATION]** keep as a separate `photos` collection referencing `eventId`, since archive browsing benefits from querying photos independently of full event documents.

**Indexes:** `events.dateTime`, `events.category`, `events.clubId`, `registrations.(eventId,userId)` unique, `users.email` unique.

**Self-study note (DynamoDB/Cassandra):** these are not part of the running app; document them in the report as a comparison of eventual-consistency, wide-column (Cassandra) or key-value/document (DynamoDB) models versus MongoDB's document model, and note that MongoDB's flexible schema and native aggregation pipeline are why it, not those, is the natural fit for an events/registrations app with evolving fields (§35 architecture rationale).

---

## 26. REST API Architecture

**[RECOMMENDATION]** Base resources: `/api/events`, `/api/clubs`, `/api/registrations`, `/api/users` (auth).

| Endpoint | Method | Purpose | Auth |
|---|---|---|---|
| `/api/events` | GET | List/filter events | Public |
| `/api/events/:id` | GET | Event detail | Public |
| `/api/events` | POST | Create event | Organizer |
| `/api/events/:id` | PUT/PATCH | Update event | Organizer (own club) |
| `/api/events/:id` | DELETE | Remove event | Organizer/Admin |
| `/api/clubs` | GET/POST | List/create clubs | Public / Admin |
| `/api/clubs/:id` | GET/PUT/DELETE | Club detail/update/remove | Public / Organizer / Admin |
| `/api/registrations` | POST | Register for event | Student |
| `/api/registrations/mine` | GET | "My Events" | Student |
| `/api/registrations/:eventId` | GET | Registrant list | Organizer |
| `/api/registrations/:id` | DELETE | Cancel registration | Student/Owner |
| `/api/users/register`, `/api/users/login` | POST | Auth | Public |

Each write endpoint returns standard status codes: `200/201` success, `400` validation error (with field-level messages), `401/403` auth errors, `404` not found, `409` duplicate registration. This should be captured as a Postman collection with one saved request per endpoint plus example success/error responses for the viva.

---

## 27. Technical Architecture

**Frontend:** React (component-based UI, client-side validation, routing) + Bootstrap/CSS for layout and responsiveness.
**Backend:** Node.js runtime + Express.js for routing/middleware/REST API.
**Database:** MongoDB (via Mongoose) for flexible, evolving event/registration schemas.
**API layer:** REST, JSON request/response, tested with Postman.

**[RECOMMENDATION]** This stack is verified as sensible against the syllabus constraints: every layer maps to exactly one practical, and none is artificial — see §35 for the role of each technology.

---

## 28. Deployment Architecture

**[RECOMMENDATION]** Frontend on Vercel (or Netlify) as a static React build; backend (Node/Express) on Render or Railway; database on MongoDB Atlas free tier. This is the standard, low-friction student deployment path and keeps the REST API publicly reachable for Postman demonstration during the viva without needing a local server running on the evaluator's machine.

---

## 29. MVP

Auth (student/organizer/admin roles) · Event feed with filters · Event detail page · Registration with client+server validation · My Events · Club directory + club detail · Organizer event CRUD · Admin approve/remove · REST API for events/clubs/registrations · MongoDB persistence.

## 30. V1
Results/winners per event · Photo gallery · Archive page (year/club filter) · Follow club · Basic notifications (confirmation, reminder) · Search.

## 31. V2
Personalized recommendations · Schedule-conflict detection · QR check-in · Certificates · Calendar sync (Google/Outlook, following Localist's proven pattern) · Organizer analytics dashboard.

---

## 32. PRACTICAL 01 — HTML/CSS/BOOTSTRAP

**Feature used:** a single-page version of the event **Discover** experience — navbar, hero/highlighted events, filter bar, responsive event-card grid, footer.
**Demonstrate:** semantic HTML5 (`<nav>`, `<main>`, `<section>`, `<article>` per card), CSS3 for custom theming layered over Bootstrap grid/utility classes, a responsive breakpoint change from a 3-column card grid (desktop) to 1-column stacked cards (mobile) shown live by resizing the browser or using dev-tools device mode.
**Avoid:** leaving it looking like an unmodified Bootstrap template — override the default theme colors/typography to give it a distinct campus identity.

## 33. PRACTICAL 02 — JAVASCRIPT

**Feature used:** client-side event discovery on top of a static `events.json` array (before the backend exists, or as a standalone demo file).
**Flow:** `events.json` (array of event objects) → JS reads it → renders cards dynamically → user types in search / picks category+date filters → JS filters the array and re-renders → user clicks "Register" → a plain-JS form validates required fields and shows inline error messages → on success, a confirmation message appears (and the entry can be pushed into a local `registrations` array to show array mutation).
**Demonstrates:** JSON data handling, arrays (`filter`, `map`, `find`), DOM manipulation, form validation with explicit error messages.

## 34. PRACTICAL 03 — REACTJS

**Best candidate:** the **Registration form** (as stated in the brief) — but the **Event Discovery feed with filters** is a strong second demonstration and should be built as reusable components regardless, since it shows more of React's component model.
**Demonstrate:** controlled inputs (`useState` per field), inline conditional error rendering, disabling submit until valid, a loading/success state after submit, and reusable `EventCard` components consumed by both Home and Discover pages (component reuse is easy to explain in a viva).
**Why registration is ideal:** it is the one screen that must show validation *and* pairs directly with the Node/Express server-side validation on the same data — letting the examiner compare client vs. server behavior on one form (e.g., disable JS in devtools and show the server still rejects bad data).

## 35. PRACTICAL 04 — NODEJS

**Feature used:** the registration-submission handler and event-listing handler, run on plain Node request/response cycles (before/under Express).
**Demonstrate:** asynchronous request handling (`async/await` around the DB call), server-side re-validation of the registration payload (required fields, deadline check, capacity check), and structured JSON responses/error objects. Avoid bolting on an unrelated filesystem demo — the natural Node capability to show is async I/O against the database, which the app already needs.

## 36. PRACTICAL 05 — EXPRESSJS

**Feature used:** the full `/api/events`, `/api/registrations` route set.
**Demonstrate:** route definitions per resource, a validation **middleware** (e.g. `validateRegistration`) applied before the controller, an **auth/role middleware** (`requireRole('organizer')`) protecting event-creation routes, and centralized error-handling middleware returning consistent JSON error shapes with correct status codes.

## 37. PRACTICAL 06 — REST API

Use the architecture in §26. Prepare a Postman collection with one folder per resource (Events, Clubs, Registrations, Users) and, inside each, example requests for every verb plus at least one deliberately invalid request per resource to show a `400` validation response live.

## 38. PRACTICAL 07 — MONGODB

Use the schema in §25. Demonstrate: a `find()` query with a filter (e.g., events by category), a `create` (new registration) showing the unique-index duplicate rejection, an `aggregate`/`populate` query joining a registration to its event and user (shows relationships without embedding everything), and an index explained via `explain()` if time allows.

---

## 39. FEATURE → PRACTICAL MAPPING

| Product Feature | Practical | Technology | Demonstration |
|---|---|---|---|
| Event discovery UI (cards, navbar, responsive grid) | 01 | HTML/CSS/Bootstrap | Resize browser; responsive grid collapses |
| Client-side event filtering (category/date/search) | 02 | JavaScript + JSON + arrays | Type in search, pick filter, list updates live |
| Static registration form + validation (pre-backend) | 02 | JavaScript | Submit invalid data → inline error message |
| Registration form (production) | 03 | React (controlled inputs, state) | Submit invalid → red inline errors; valid → success state |
| Reusable EventCard, ClubCard components | 03 | React (component reuse) | Same component rendered on Home and Discover |
| Registration submission handling | 04 | Node.js (async request handling) | Server logs incoming request, awaits DB write, responds |
| Server-side validation of registration | 04/05 | Node + Express middleware | Disable JS validation → server still rejects bad payload |
| Route protection for organizer/admin actions | 05 | Express middleware (auth/role) | Try creating event as student → 403 |
| Events/Clubs/Registrations CRUD API | 06 | REST | Postman: GET/POST/PUT/DELETE per resource |
| Persisted events, clubs, registrations, results | 07 | MongoDB (Mongoose) | Show documents in Atlas/Compass after a POST |
| Duplicate-registration prevention | 07 | MongoDB unique index | Attempt duplicate registration → 409 from unique index |
| My Events (per-user registration list) | 06/07 | REST + MongoDB query | GET `/api/registrations/mine` filtered by JWT user id |

---

## 40. VIVA / PRACTICAL DEMONSTRATION PLAN

**Practical 01 (HTML/CSS/Bootstrap)**
1. Open the Discover page. 2. Resize the window from desktop to mobile width. 3. Explain Bootstrap grid classes used (`col-md-4`, `container`, navbar component). 4. Show the HTML source for one event card (semantic tags). 5. No error case (this practical is presentational). 6. Likely question: *"Is this a Bootstrap template?"* → Answer: no, base grid/utilities are Bootstrap, but colors/typography/cards are custom CSS.

**Practical 02 (JavaScript)**
1. Open the standalone JS demo page. 2. Type a search term / pick a filter — list updates. 3. Try submitting the registration form with an empty field — show the JS-generated error message. 4. Submit correctly — show success state and the array being updated (console.log or on-screen). 5. Question: *"Where does the data live?"* → Answer: a local JSON array, not a database (that's Practical 07's job).

**Practical 03 (React)**
1. Open the live registration form. 2. Show state values via React DevTools. 3. Submit empty/invalid → inline errors render conditionally. 4. Submit valid → loading then success UI. 5. Point out the same `EventCard` component reused on two pages. 6. Question: *"How is this different from Practical 02's validation?"* → Answer: React validation is component/state-driven and reusable; Practical 02 was plain DOM manipulation.

**Practical 04 (Node.js)**
1. Show the route handler file. 2. Trigger a registration submission from the UI. 3. Show server console logging the async request lifecycle. 4. Trigger an invalid payload (e.g. via Postman, bypassing the client) → show the server still rejects it. 5. Question: *"Why validate again on the server if React already validated?"* → Answer: client validation can be bypassed; the server is the trust boundary.

**Practical 05 (Express)**
1. Show `routes/events.js` and the validation + auth middleware. 2. Attempt to create an event while logged in as a student → 403 Forbidden. 3. Log in as organizer → succeeds. 4. Show the centralized error handler catching a thrown validation error. 5. Question: *"What is middleware?"* → short answer: a function that runs between the request and the final handler, e.g. for auth or validation.

**Practical 06 (REST API)**
1. Open Postman collection. 2. Run GET/POST/PUT/DELETE on `/api/events`. 3. Run an intentionally invalid POST → show 400 with field errors. 4. Question: *"Why REST and not just a form POST?"* → Answer: REST decouples the frontend/backend so any client (web, mobile, Postman) can use the same API.

**Practical 07 (MongoDB)**
1. Open MongoDB Atlas/Compass. 2. Show `events`, `clubs`, `registrations` collections and a sample document each. 3. Register twice for the same event from the UI → show the second attempt rejected by the unique index. 4. Run a `find()` with a filter in Compass or via `mongosh`. 5. Question: *"Why MongoDB over MySQL?"* → Answer: event/club/registration documents have flexible, evolving fields (e.g., optional prize/eligibility fields) that fit a document model without frequent schema migrations.

---

## 41. Project Report Structure

Problem statement · Objectives · Existing system (WhatsApp/Instagram/forms + brief note on CampusGroups/Localist as institutional-scale references) · Proposed system · Scope (MVP boundary from §29) · Requirements (functional/non-functional) · Technology stack & justification (§27, §35) · System architecture diagram · UI/UX design (wireframe references, IA from §14) · Database design (§25 schema diagrams) · API design (§26 endpoint table) · Validation strategy (client + server, §17) · Implementation notes per practical (§32–38) · Testing (Postman collection, manual test cases) · Deployment (§28) · Screenshots · Practical mapping table (§39) · Results/outcomes · Limitations (§43) · Future scope (§31) · DynamoDB comparison · Cassandra comparison · References (§42).

---

## 42. UX Risks

| Risk | Mitigation |
|---|---|
| Low student adoption (yet another app) | Keep registration to <60 seconds; make the archive/results genuinely useful so people return even between events |
| Empty event feed at launch | Seed with real upcoming club events before demoing; organizer onboarding is part of MVP, not an afterthought |
| Poor organizer adoption (extra work vs. WhatsApp) | Event creation form must be faster than retyping into 3 channels — keep required fields minimal |
| Notification fatigue | Limit MVP notifications to confirmation + reminder only (§21) |
| Complicated registration | Single-step form, no unnecessary fields (§17) |
| Duplicate/conflicting event info | Unique index + organizer-only edit rights on their own events |
| Archive becoming irrelevant | Tie archive entries directly to real event records (auto-generated), not a manual second data-entry step |

## 43. Academic Risks

| Risk | Mitigation |
|---|---|
| Practical demo requires switching apps | Avoided by design — every practical lives inside this one product (§39) |
| Examiner can't see server-side validation clearly | Explicitly demonstrate bypassing client validation via Postman (§40, Practical 04/05) |
| MongoDB schema too complex to explain in a viva | Kept to 6 collections with clear references (§25) |
| Scope creep beyond available hours (60 total across practicals) | Strict MVP boundary (§29); V1/V2 explicitly deferred |
| Deployment breaking before the viva | Deploy early, keep a local fallback (README with `npm run dev` instructions) |

---

## 44. Key Product Decisions

- Build one product across all seven practicals, not seven mini-apps.
- Registration is the spine: it is the one flow that legitimately needs React (client validation) AND Node/Express (server validation) on the same data.
- Archive is the strategic differentiator; it costs little extra (reuses Event/Result/Photo models) but is what makes this feel like a real product rather than a listing site.
- Calendar and Notifications are folded into other pages for MVP rather than becoming standalone modules — reduces scope without losing user value.
- Admin role stays deliberately thin (approve/remove) — enough to demonstrate role-based authorization without building a governance platform.

## 45. Open Questions

- Will events be manually seeded for demo purposes, or will real club organizers use it before the viva? (Affects how "real" the discovery/archive demo feels.)
- Is a payment flow required by the assigning department, or explicitly out of scope? (Assumed out of scope here.)
- Should Admin approval of organizer accounts be manual (MVP) or automatic based on college email domain (V1)?
- Push notifications (browser/mobile) vs. in-app/email only — is a PWA/service-worker layer expected, or is in-app sufficient? (Assumed in-app/email sufficient for MVP.)

## 46. Research Sources

- Ready Education — CampusGroups product pages: https://www.readyeducation.com/campusgroups/ and https://www.readyeducation.com/campusgroups/streamline-university-event-management-campusgroups/ and https://www.readyeducation.com/articles/event-management-and-engagement-made-easy-with-campusgroups/
- Software Advice — CampusGroups profile: https://www.softwareadvice.com/event-management/campusgroups-profile/
- Lounge Blog — Student engagement platform comparison: https://about.lounge.live/blog/top-student-engagement-platforms-in-2026-best-alternatives-to-engage
- Eventbrite reviews/features: https://www.selecthub.com/p/event-management-software/eventbrite/ , https://blog.promotix.com/eventbrite-review , https://softwarefinder.com/event-management-software/eventbrite , https://www.regform.com/articles/best-event-registration-platforms-compared , https://www.expopass.com/articles/what-is-eventbrite-features-pricing-when-its-the-right-choice
- Localist / Concept3D: https://concept3d.com/student-event-calendar-software/ , https://www.localist.com/ , https://www.localist.com/campus-calendar-app , https://www.capterra.com/p/240692/Localist/ , https://www.softwareadvice.com/event-marketing/localist-profile/ , university adoption pages: Boise State (https://www.boisestate.edu/oit/2024/12/12/new-events-calendar-system-localist/), Rutgers–Newark (https://mytech.newark.rutgers.edu/working-technology/campus-event-calendar), UNR (https://www.unr.edu/marketing-communications/web/localist)
- Guidebook: https://www.guidebook.com/schools/campus-resources , https://www.guidebook.com/post/build-a-university-app-for-events-and-year-round-engagement
- CampVents: https://campvents.app/
- CampusConnect independent build (DEV Community): https://dev.to/keshavchauhan/building-for-my-campus-community-a-unified-event-platform-for-students-organizers-admins-2d22
- UX case study, Indian university engagement app: https://medium.com/design-bootcamp/increasing-campus-engagement-amongst-university-students-a-case-study-88f013b19bdf
- WhatsApp groups and first-year induction dataset (ScienceDirect): https://www.sciencedirect.com/science/article/pii/S2352340924004256
- Social media & community college international student engagement (dissertation, ResearchGate): https://www.researchgate.net/publication/385349464_Social_Media_and_Community_College_International_Student_Engagement_at_a_Mid-Atlantic_Community_College
- Concept3D — campus event tech stack: https://concept3d.com/blog/event-calendar/what-tech-tools-do-you-need-run-successful-university-event/
- GetApp — student engagement platforms with event calendar: https://www.getapp.com/education-childcare-software/student-engagement-platform/f/event-calendar/

---

# FINAL RECOMMENDATION

1. **Is this a strong project for these practicals?** Yes. Registration is a form that genuinely needs both client- and server-side validation; events/clubs/registrations are genuinely CRUD resources; the data has evolving optional fields that justify MongoDB over a rigid relational schema. Nothing here is forced.

2. **What should the final MVP contain?** Auth + roles, event feed with filters, event detail, registration (client+server validated), My Events, club directory, organizer event CRUD, thin admin approve/remove, full REST API, MongoDB persistence. Nothing beyond that.

3. **What should the homepage contain?** A short hero/highlight of 3–5 upcoming events + a quick category filter bar + a link into full Discover — not a wall of every event on campus.

4. **What should the main navigation contain?** Home, Discover, Clubs, Archive, My Events, and a role-aware Dashboard/Profile/Login control.

5. **Five most important student features:** event discovery with filters, one-step registration, My Events tracking, club directory, archive with results.

6. **Five most important organizer features:** event creation form, registrant list view, event edit/update, results/winners publishing, basic update/announcement per event.

7. **How does each practical map to the product?** See §39's mapping table — every practical is a layer of the same registration/events/clubs feature set, not a separate app.

8. **What should NOT be built?** Payments, waitlists, QR check-in, push notifications, AI recommendations, a full governance/reporting admin suite. All are legitimate future features but add complexity without adding syllabus value now.

9. **Strongest differentiator:** the archive — turning past events into a searchable, browsable campus memory (results + photos + winners tied to real event records), something none of Instagram/WhatsApp/Forms/the static college site do today.

10. **Simplest architecture that satisfies the syllabus:** React + Bootstrap frontend → Express REST API on Node → MongoDB via Mongoose, deployed on Vercel + Render/Railway + Atlas. No extra services needed.

11. **What should be demonstrated to the examiner overall?** One coherent flow: browse → filter → open event → register (client error, then success) → show it land in MongoDB → show it appear in "My Events" and in the organizer's registrant list.

12. **What should be shown in Postman?** Full CRUD on `/api/events`, a registration POST with a deliberately invalid payload (400), and a duplicate registration attempt (409).

13. **What should be shown in MongoDB?** The `events`, `clubs`, and `registrations` collections, the unique index in action, and one populate/aggregate query joining a registration to its event.

14. **What should be shown in the React frontend?** The registration form's controlled inputs, inline validation, and a reused `EventCard` component across two pages.

15. **What should be shown in Node/Express?** The validation and auth-role middleware rejecting a bad or unauthorized request even when the frontend would have blocked it — proving the server, not just the UI, enforces the rules.

16. **What should be in the project report?** Everything in §41, with the practical-mapping table (§39) and viva plan (§40) placed early enough that the report itself functions as a study guide.
