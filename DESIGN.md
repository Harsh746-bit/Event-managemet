# DESIGN.md — College Event Planner

## 1. PRODUCT

### Product name
College Event Planner

### Product purpose
A centralized and interactive college event platform where students can:

- discover ongoing and upcoming events
- explore event details
- register for events
- save/follow events
- receive important updates
- discover events by club or department
- view schedules and event timelines
- explore past events
- browse photographs, results, winners, and activity archives

### Primary users

1. Students
   - discover events
   - register
   - track registrations
   - save interesting events
   - receive updates
   - explore past events

2. Clubs and departments
   - publish events
   - manage registrations
   - share announcements
   - upload photographs
   - publish results
   - maintain an event archive

3. College administrators
   - moderate events
   - manage clubs/departments
   - oversee registrations
   - manage platform-wide content

---

# 2. DESIGN CONCEPT

## Core visual idea

### "Campus Pulse"

The interface should feel like the digital heartbeat of a college campus.

It should communicate:

- activity
- discovery
- community
- anticipation
- participation
- memories

The visual language should sit between:

**editorial event magazine + modern campus application**

It should NOT look like:

- a generic SaaS dashboard
- an AI startup landing page
- a generic university website
- a social media clone
- a basic CRUD event management system

The experience should feel like a place students WANT to browse.

---

# 3. DESIGN PERSONALITY

The product should feel:

- energetic
- youthful
- organized
- social
- credible
- contemporary
- expressive
- approachable

Avoid making it childish.

Avoid making it overly corporate.

Avoid making it visually noisy.

The interface should feel like a premium college product designed specifically for students.

---

# 4. VISUAL DIRECTION

## Primary visual approach

Use an editorial-inspired event discovery layout.

Important events should feel like stories rather than database records.

Use:

- large event imagery
- strong event titles
- dates as visual anchors
- club identity
- category labels
- clear registration actions
- editorial-style sections
- varied card sizes
- intentional whitespace
- subtle visual rhythm

Do NOT use a repetitive grid where every event card has exactly the same dimensions.

Create hierarchy:

1. Featured event
2. Upcoming events
3. Happening today
4. Popular / recommended events
5. Clubs and departments
6. Past events / archive
7. Memories and results

---

# 5. COLOR SYSTEM

## Color philosophy

Use a restrained neutral base with one strong campus accent and a small number of semantic colors.

The interface should not rely on gradients for personality.

### Base

Background:
- warm off-white / very light neutral

Surface:
- white

Elevated surface:
- slightly tinted neutral

Text:
- deep charcoal / near-black

Muted text:
- cool gray

Border:
- subtle neutral gray

### Primary accent

Use a distinctive campus-inspired accent.

Recommended direction:

- deep indigo / electric blue as the primary interaction color
- warm amber/orange as a selective event highlight

Do not use both colors everywhere.

Primary accent should be reserved for:
- primary CTAs
- selected navigation
- active filters
- important links
- focus states
- registration actions

Warm accent should be used sparingly for:
- featured events
- important dates
- "happening today"
- special highlights

### Semantic colors

Success:
- green

Warning:
- amber

Error:
- red

Info:
- blue

These must remain visually distinct from decorative colors.

---

# 6. DARK MODE

Dark mode is supported if the application architecture allows it.

Dark mode should not simply invert colors.

Use:

- near-black background
- dark elevated surfaces
- softened white text
- muted gray secondary text
- controlled accent colors

Avoid pure #000000 backgrounds if a softer near-black improves readability.

Maintain contrast.

---

# 7. TYPOGRAPHY

Typography should give the product a recognizable identity.

## Recommended structure

Use a distinctive display/heading typeface paired with a highly readable UI/body typeface.

Possible direction:

Display:
- Manrope
- Plus Jakarta Sans
- DM Sans
- Space Grotesk
- another contemporary geometric/display family

Body/UI:
- Inter
- Geist
- DM Sans
- another highly readable sans-serif

Do not automatically use Inter for everything.

### Hierarchy

Display:
- major page introductions
- featured event titles

H1:
- primary page heading

H2:
- section headings

H3:
- event titles / subsections

Body:
- descriptions and supporting content

Label:
- categories
- dates
- club names
- metadata

Caption:
- secondary information

Numerical:
- registration counts
- event dates
- results
- statistics

Typography should create hierarchy before decoration is added.

---

# 8. SPACING

Use a consistent spacing system.

Preferred base:
- 4px or 8px rhythm

Typical values:
- 4
- 8
- 12
- 16
- 24
- 32
- 40
- 48
- 64
- 80
- 96

Large spacing should be used to separate meaningful sections.

Do not add whitespace simply because a modern landing page has lots of empty space.

Dense areas such as schedules and dashboards should use tighter spacing.

---

# 9. BORDER RADIUS

Use moderate rounding.

Suggested direction:

- small controls: 8px
- cards: 12–16px
- large featured media: 16–20px
- dialogs: 16–20px

Do not make every element pill-shaped.

Pills should be reserved for:
- event categories
- status labels
- filters
- compact metadata

---

# 10. BORDERS AND ELEVATION

Prefer subtle borders over heavy shadows.

Default cards:
- subtle border
- little or no shadow

Elevated elements:
- modal
- dropdown
- floating action
- important interactive panel

Use shadows only when elevation communicates hierarchy.

Avoid "floating everything".

---

# 11. ICONOGRAPHY

Use one coherent icon family.

Recommended:
- Lucide Icons
- another consistent outline icon system

Icons should generally:
- have consistent stroke weight
- align with text
- communicate actions
- not be used purely as decoration

Avoid decorative emoji as primary UI icons.

---

# 12. IMAGERY

Photography is a major part of the product identity.

The archive should feel alive.

Use imagery for:

- featured events
- club highlights
- past event memories
- galleries
- winners
- campus activities

Prefer authentic-looking campus/event photography over generic corporate stock imagery.

When real event imagery is unavailable:
- use clearly intentional placeholders
- use gradient/image treatments sparingly
- use event-category visual motifs
- do not pretend generated imagery is an actual college event photograph

Maintain consistent image aspect ratios within each component type.

---

# 13. EVENT CARD SYSTEM

Event cards should not all look identical.

Define several card types.

## Featured event

Large visual card.

Contains:
- event image
- date
- category
- event title
- short supporting information
- club/department
- primary CTA

Use for the highest-priority event.

## Standard event

Contains:
- date
- title
- club
- venue
- category
- registration state

## Compact event

Used for:
- schedules
- sidebars
- search results
- dense lists

## Archive card

Focuses more heavily on:
- photograph
- event title
- year/date
- organizing club
- result/highlight

## Result card

Contains:
- event
- winner
- runner-up
- category
- result status

---

# 14. HOME PAGE STRUCTURE

The homepage should prioritize discovery.

Recommended structure:

## Header

Desktop:
- brand
- Events
- Clubs
- Archive
- My Events
- search
- notifications
- profile

Mobile:
- compact brand
- search
- profile/menu

Do not overload the navigation.

---

## Hero / discovery area

Do not create a generic marketing hero.

Instead create an event discovery introduction.

Example structure:

Small context:
"What's happening on campus"

Large heading:
"Find your next thing to do."

Supporting text:
"Discover events, clubs, competitions and activities happening across campus."

Primary interaction:
- search events

Secondary:
- browse categories

The hero should feel like an application discovery surface, not a startup landing page.

---

## Happening today

This section should create urgency.

Show:
- events happening today
- current time relevance
- venue
- remaining time when useful

Use a visually distinct but restrained "LIVE / TODAY" treatment.

---

## Upcoming events

Primary browsing area.

Support:
- category filters
- date filters
- club filters
- department filters

Allow quick scanning.

---

## Featured event

Give one major event visual priority.

It can use an asymmetric layout rather than another standard card.

---

## Clubs and departments

Show discoverable organizations.

Each club card can include:
- logo/avatar
- name
- short descriptor
- event count
- follow button

Avoid making this look like a corporate customer-logo section.

---

## Past events / memories

Use photography.

Possible layout:
- editorial mosaic
- featured memory
- compact archive list

---

# 15. EVENTS DISCOVERY PAGE

Primary goal:
Help students quickly find something relevant.

Include:

- search
- date range
- categories
- clubs
- departments
- event status
- venue
- sort

Recommended views:
- card view
- compact list view
- calendar view if useful

Filters should remain understandable.

Do not create an overly complex filter panel.

---

# 16. EVENT DETAILS PAGE

The event detail page is one of the most important screens.

Recommended hierarchy:

1. Event image
2. Event title
3. Date and time
4. Venue
5. Club/department
6. Registration CTA
7. Short description
8. About the event
9. Schedule
10. Rules / eligibility
11. Organizers
12. Registration information
13. Related events

The primary registration action should remain visually accessible.

On mobile, consider a sticky bottom registration action.

---

# 17. REGISTRATION EXPERIENCE

Registration should be short and clear.

Show:

- event title
- date/time
- participant information
- eligibility
- required fields
- confirmation

After registration:

Show a clear confirmation state.

Include:
- registration status
- event date
- venue
- add-to-calendar action if supported
- cancellation option when applicable

Avoid unnecessary multi-step forms.

---

# 18. MY EVENTS

This is the student's personal event area.

Possible sections:

- Registered
- Saved
- Upcoming
- Past
- Certificates/results if applicable

Use clear status indicators.

Example:

Registered
Saved
Waitlisted
Completed
Cancelled

Do not overload the page with statistics.

The primary purpose is helping students manage their participation.

---

# 19. CLUB / DEPARTMENT PAGE

Each organization should have a recognizable profile.

Include:

- logo
- name
- description
- department/club type
- upcoming events
- past events
- results
- gallery
- contact/social links
- follow action

Give clubs personality without allowing every club page to break the platform's design system.

---

# 20. ARCHIVE

The archive is a core differentiator.

It should feel like a digital memory of campus life.

Allow browsing by:

- year
- club
- department
- event category
- event type

Show:

- event photographs
- event title
- year
- organizers
- results
- highlights
- related events

Use editorial layouts rather than a plain database table.

---

# 21. RESULTS

Results should be easy to scan.

Possible structure:

Event
→ Category
→ Winner
→ Runner-up
→ Special mentions

Use clear hierarchy.

Avoid excessive decoration.

---

# 22. SEARCH

Search should support:

- event names
- clubs
- departments
- categories
- venues

Results should show useful context immediately.

Example:

Event title
Club
Date
Venue
Category

Avoid generic search result cards with no useful metadata.

---

# 23. FILTERS

Filters should be:

- easy to understand
- reversible
- visible when active
- mobile friendly

Active filters should be clearly represented.

Provide:
- clear all
- remove individual filter

Do not hide important filter state.

---

# 24. CALENDAR

If a calendar view is implemented:

Prioritize:
- event density
- readability
- date navigation
- event category indicators
- mobile usability

Do not make the calendar unnecessarily decorative.

Selecting a date should clearly reveal its events.

---

# 25. NOTIFICATIONS

Notifications should focus on useful event information:

- registration confirmation
- event reminder
- venue change
- time change
- cancellation
- result announcement
- club update

Avoid notification spam.

---

# 26. EMPTY STATES

Examples:

No upcoming events:

"Nothing scheduled yet."
"Check back soon or explore past events."

No registrations:

"Your event list is empty."
"Find something happening on campus."

No search results:

"No events matched your search."
"Try another keyword or remove a filter."

Empty states should always provide a useful next action.

---

# 27. LOADING STATES

Use skeleton loading for content-heavy areas.

Skeletons should roughly match the final content geometry.

Avoid giant generic loading spinners when the page structure is known.

---

# 28. ERROR STATES

Errors should be human-readable.

Example:

"Couldn't load events."
"Please try again."

For actionable errors:
- retry
- go back
- clear filters

Do not expose raw backend errors.

---

# 29. MOTION

Motion should communicate campus energy without becoming distracting.

Use:
- subtle card hover
- image transitions
- filter transitions
- modal transitions
- registration confirmation
- list updates

Avoid:
- excessive parallax
- floating blobs
- constant movement
- animation on every section

Use reduced-motion support.

---

# 30. RESPONSIVE DESIGN

## Mobile

Priorities:

1. Search
2. Upcoming events
3. Registration
4. My Events
5. Archive

Use:
- stacked layouts
- horizontally scrollable event categories when appropriate
- bottom/sticky primary actions when useful
- simplified navigation

Avoid squeezing desktop layouts into mobile.

## Tablet

Use:
- two-column layouts where useful
- comfortable event browsing
- larger image treatments

## Desktop

Use:
- wider editorial compositions
- multi-column discovery
- richer event imagery
- persistent navigation where useful

---

# 31. ACCESSIBILITY

Requirements:

- semantic HTML
- keyboard navigation
- visible focus
- accessible forms
- sufficient color contrast
- meaningful labels
- logical headings
- alt text for meaningful images
- reduced-motion support
- touch-friendly controls
- accessible event status indicators

Do not rely on color alone to communicate:
- registration status
- event type
- errors
- success

---

# 32. DESIGN ANTI-PATTERNS

Avoid:

- generic SaaS hero
- excessive gradients
- excessive glassmorphism
- excessive rounded cards
- everything in cards
- generic stock imagery
- unnecessary illustrations
- huge CTA buttons
- repetitive three-column layouts
- excessive shadows
- excessive pills
- over-animated pages
- tiny text
- poor contrast
- overly dense dashboards
- decorative UI without function
- fake statistics
- fake testimonials
- generic AI marketing copy

---

# 33. DESIGN PRINCIPLE

The platform should feel like:

"the place students go to see what's happening on campus"

not:

"an event database."

The interface should create a sense of discovery.

A student should be able to open the homepage and immediately answer:

- What's happening today?
- What can I join?
- What is interesting this week?
- Which clubs are active?
- What did I miss?
- What did I register for?

---

# 34. PRIMARY UX PRIORITY

The core user journey is:

DISCOVER
→ EXPLORE
→ DECIDE
→ REGISTER
→ REMEMBER

Every major page should support one or more parts of this journey.

---

# 35. FINAL DESIGN QUALITY BAR

Before finalizing the UI, verify:

- [ ] It feels specific to a college campus.
- [ ] It does not look like generic AI SaaS.
- [ ] Event discovery is immediately understandable.
- [ ] Today's events have clear priority.
- [ ] Registration is obvious but not aggressive.
- [ ] Past events feel like a real archive.
- [ ] Photography contributes to the identity.
- [ ] Clubs and departments feel discoverable.
- [ ] Typography creates hierarchy.
- [ ] The color palette is restrained.
- [ ] Cards are not overused.
- [ ] Layouts have meaningful variation.
- [ ] Mobile is intentionally designed.
- [ ] Search and filters are easy to use.
- [ ] Loading, empty, error, and success states exist.
- [ ] Accessibility is handled.
- [ ] Motion is purposeful.
- [ ] The interface works with realistic content.
- [ ] The design system is internally consistent.
- [ ] The final implementation passes a UI/UX audit.

---

# 36. DESIGN NORTH STAR

## "Discover campus. Join the moment. Remember it."

The platform should combine the excitement of discovering a new
college event with the usefulness of a reliable event-management
system and the emotional value of a long-term campus archive.

Do not make it look like an administration portal.

Make it feel like a living campus.
