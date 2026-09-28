# PROJECT_PLAN.md — College Event Planner
## Project Development Plan

*Assumes a small student team (1–3 people), not a professional multi-team org. Consistent with the MVP defined in `PRD.md` §10 and the architecture in `ARCHITECTURE.md`.*

---

## Phase 1 — Research and Requirements
**Objectives:** Establish the problem, competitive landscape, and product scope.
**Tasks:** Complete `research.md`; finalize `PRD.md` (this has been done).
**Deliverables:** `research.md`, `PRD.md`.
**Dependencies:** None.
**Risks:** Scope creep from the original brief's larger feature list — mitigated by the explicit MVP/V1/V2 split.
**Completion criteria:** PRD reviewed and functional requirements finalized (§8 of `PRD.md`).

## Phase 2 — UX and Design
**Objectives:** Define information architecture, navigation, and page-level content priority.
**Tasks:** Confirm IA (`research.md` §14), navigation (`research.md` §15), event-detail field priority (`research.md` §16); produce a `DESIGN.md` (visual language) if not already provided.
**Deliverables:** Page list, navigation model, event-detail field priority table, (optional) `DESIGN.md`.
**Dependencies:** Phase 1.
**Risks:** Designing more pages than MVP needs — mitigated by sticking to the IA in `PRD.md`/`research.md`.
**Completion criteria:** Every MVP page in `PRD.md` §10 has an agreed layout intent (even if only as a written description, not final visuals).

## Phase 3 — Project Setup
**Objectives:** Stand up the repo, tooling, and environments.
**Tasks:** Initialize frontend (React) and backend (Node/Express) projects; set up MongoDB Atlas cluster; configure environment variables; set up the Git repo and branching model (see "Suggested Git Workflow" below).
**Deliverables:** Empty-but-running frontend and backend skeletons; Atlas cluster reachable from local dev.
**Dependencies:** Phase 1–2.
**Risks:** Environment/config drift between team members — mitigated by a checked-in `.env.example` and a short setup README.
**Completion criteria:** `npm run dev` works for both frontend and backend on a fresh clone.

## Phase 4 — Frontend Foundation
**Objectives:** Build the shared shell: routing, navbar, layout, Bootstrap theme.
**Tasks:** Implement `Navbar`, page routing (`react-router-dom`), base Bootstrap theme override (per `research.md` §32, not a stock template look).
**Deliverables:** Navigable app shell with empty pages.
**Dependencies:** Phase 3.
**Risks:** Over-customizing the theme before content exists — keep theme work minimal until Phase 5 has real content to style.
**Completion criteria:** All MVP routes exist and are reachable via the navbar.

## Phase 5 — Student Event Discovery
**Objectives:** Home + Discover pages, event feed, filters, search (client-side against mock/static data first).
**Tasks:** `EventCard`, `FilterBar` components; static `events.json` demo for Practical 02; wire Discover page to filters.
**Deliverables:** Working discovery UI against mock data.
**Dependencies:** Phase 4.
**Risks:** Building filter logic twice (once in vanilla JS for P02, once in React) — acceptable and intentional per `PRACTICAL_MAPPING.md`, but keep the vanilla-JS demo as a small standalone file, not duplicated app logic.
**Completion criteria:** Filtering/search works against static data; matches `PRD.md` FR-001–003.

## Phase 6 — Event Details and Registration
**Objectives:** Event detail page + registration form with client-side validation.
**Tasks:** `EventDetail` page (conditional field rendering per `research.md` §16); `RegistrationForm` component with inline validation.
**Deliverables:** Working detail + registration UI (still against mock data / no backend yet).
**Dependencies:** Phase 5.
**Risks:** None significant.
**Completion criteria:** Invalid submissions show inline errors; valid submissions show a success state (`PRD.md` FR-004–006).

## Phase 7 — Authentication
**Objectives:** Login/Register pages, auth context, protected routes.
**Tasks:** `Login`, `Register` pages; `AuthContext`; `ProtectedRoute` wrapper.
**Deliverables:** Working auth UI (against backend once Phase 8/9 land; can be stubbed earlier).
**Dependencies:** Phase 4; integrates fully once Phase 9 (REST API) exists.
**Risks:** Building auth UI before the API exists can create rework — keep the API contract (`API.md` §Auth) fixed from the start to avoid this.
**Completion criteria:** Role-based route protection working end-to-end once connected to the real API.

## Phase 8 — Backend
**Objectives:** Node/Express app skeleton, middleware, error handling.
**Tasks:** Set up Express app, `requireAuth`, `requireRole`, `validate`, `errorHandler` middleware (`ARCHITECTURE.md` §4).
**Deliverables:** Running Express server with middleware wired but few real routes yet.
**Dependencies:** Phase 3.
**Risks:** None significant.
**Completion criteria:** A test route demonstrates auth middleware rejecting an unauthenticated request.

## Phase 9 — REST API
**Objectives:** Implement all endpoints in `API.md`.
**Tasks:** Build `auth`, `events`, `clubs`, `registrations`, `admin` routers/controllers/services per `API.md`.
**Deliverables:** Full API matching `API.md`'s CRUD matrix.
**Dependencies:** Phase 8, Phase 10 (models must exist).
**Risks:** Endpoint drift from `API.md` — treat `API.md` as the contract; update it first if a change is needed, then implement.
**Completion criteria:** Every endpoint in `API.md` §4 is implemented and passes its corresponding Postman request (§9 of `API.md`).

## Phase 10 — MongoDB
**Objectives:** Implement Mongoose models/schemas per `DATABASE.md`.
**Tasks:** Define schemas for all seven collections, indexes (`DATABASE.md` §6), seed script with sample events/clubs/users for demo purposes.
**Deliverables:** Working models; a seed script producing a non-empty, demoable dataset.
**Dependencies:** Phase 3.
**Risks:** Empty database at demo time (`research.md` §42) — mitigated by the seed script being a required deliverable, not optional.
**Completion criteria:** Seed script populates Atlas with enough data to demo discovery, registration, and (if in scope) archive.

## Phase 11 — Organizer Functionality
**Objectives:** Organizer dashboard — event create/edit/delete, registrant list.
**Tasks:** `EventForm` (shared create/edit component), registrant-list view, ownership-based route protection.
**Deliverables:** Working organizer dashboard.
**Dependencies:** Phase 7, 9.
**Risks:** Forgetting ownership checks (an organizer editing another club's event) — explicitly tested in `TEST_PLAN.md`.
**Completion criteria:** Organizer can create an event and immediately see it in the public feed and in their own dashboard.

## Phase 12 — Integration
**Objectives:** Connect all previously-mock frontend flows to the real API.
**Tasks:** Replace mock data with live API calls throughout; wire registration and event-creation forms to real client+server validation end-to-end.
**Deliverables:** Fully integrated app, no mock data remaining in MVP flows.
**Dependencies:** Phases 5–11.
**Risks:** Validation drift between client and server rules — cross-check both against the same field list in `PRD.md` FR-006/FR-007 before integration is considered done.
**Completion criteria:** Every MVP acceptance criterion in `PRD.md` §13 passes manually.

## Phase 13 — Testing
**Objectives:** Execute `TEST_PLAN.md`.
**Tasks:** Run functional, validation, API, database, responsive, and accessibility test cases; fix defects found.
**Deliverables:** Completed test-case table with results (`TEST_PLAN.md` §12).
**Dependencies:** Phase 12.
**Risks:** Running out of time before the deadline — prioritize P0 test cases (core registration/auth/CRUD flows) if time is short.
**Completion criteria:** All P0 test cases pass; known P1/P2 issues documented.

## Phase 14 — Deployment
**Objectives:** Deploy frontend, backend, and database per `ARCHITECTURE.md` §9.
**Tasks:** Deploy React build to Vercel/Netlify; deploy Express app to Render/Railway; connect to MongoDB Atlas; verify Postman collection works against the deployed URL.
**Deliverables:** Publicly reachable, working deployment.
**Dependencies:** Phase 13.
**Risks:** Free-tier backend hosts can "sleep" and cause slow first-request demos — mitigated by warming up the deployed backend shortly before the viva.
**Completion criteria:** The deployed app and API both work identically to local dev.

## Phase 15 — Practical Demonstration Preparation
**Objectives:** Rehearse the viva flow for all seven practicals.
**Tasks:** Walk through `PRACTICAL_MAPPING.md`'s demonstration steps for each practical; prepare the Postman collection/environment; prepare MongoDB Atlas/Compass access; write short answers to likely viva questions.
**Deliverables:** A rehearsed, timed run-through of all seven practical demonstrations.
**Dependencies:** Phase 14.
**Risks:** Running long — time-box each practical's demo to ~2–3 minutes per the steps in `PRACTICAL_MAPPING.md`.
**Completion criteria:** A full dry run completes without needing to explain away a broken feature.

---

## Milestone Table

| Milestone | Deliverable | Dependency | Status |
|---|---|---|---|
| M1 — Requirements locked | `PRD.md` finalized | Phase 1 | Not Started |
| M2 — Design/IA locked | Page list + navigation confirmed | Phase 2 | Not Started |
| M3 — Environments running | Frontend + backend skeletons, Atlas connected | Phase 3 | Not Started |
| M4 — Discovery UI (mock data) | Home/Discover working | Phases 4–5 | Not Started |
| M5 — Registration UI (mock data) | Event detail + registration form | Phase 6 | Not Started |
| M6 — Auth working | Login/Register + protected routes | Phase 7 | Not Started |
| M7 — API complete | All `API.md` endpoints implemented | Phases 8–10 | Not Started |
| M8 — Organizer dashboard | Event CRUD + registrant list | Phase 11 | Not Started |
| M9 — Full integration | No mock data remaining | Phase 12 | Not Started |
| M10 — Test plan executed | `TEST_PLAN.md` results filled in | Phase 13 | Not Started |
| M11 — Deployed | Public URLs live | Phase 14 | Not Started |
| M12 — Viva-ready | Rehearsed demo for all 7 practicals | Phase 15 | Not Started |

---

## Suggested Git Workflow

Kept intentionally simple for a small student team:

- **`main`** — always deployable; only merged into via reviewed pull requests from `development`.
- **`development`** — integration branch; feature branches merge here first.
- **`feature/<short-name>`** branches (e.g. `feature/registration-form`, `feature/event-api`) — one per phase/task above, branched from `development`, merged back via PR once working locally.

Avoid: long-lived personal branches, direct commits to `main`, and branching per-file — none of that is needed at this team size. A short PR description referencing the relevant phase number (e.g. "Phase 9 — events CRUD") keeps history traceable to this plan without extra tooling.
