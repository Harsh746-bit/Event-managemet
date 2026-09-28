/**
 * CampusConnect - Practical 02 (Vanilla JavaScript)
 * Demonstrates:
 * 1. JavaScript Array of Event Objects
 * 2. JavaScript Array of Registration Objects
 * 3. JSON serialization with JSON.stringify()
 * 4. JSON parsing with JSON.parse()
 * 5. Dynamic DOM manipulation & event listeners
 * 6. Client-side form validation (No alert())
 * 7. Live search and category filtering
 * 8. Real-time capacity and dynamic statistics update
 */

// ==========================================
// 1. INITIAL EVENTS DATA (Array of Objects)
// ==========================================
const defaultEvents = [
  {
    id: "EVT-1001",
    title: "TechSprint 2026",
    category: "Technology",
    date: "2026-10-24",
    time: "09:00 AM",
    location: "Innovation Lab",
    capacity: 100,
    registered: 72,
    description: "A 24-hour student hackathon focused on building high-impact software, AI systems, and IoT prototypes.",
    status: "Registration Open",
    department: "Computer Engineering"
  },
  {
    id: "EVT-1002",
    title: "Design Thinking Workshop",
    category: "Workshop",
    date: "2026-10-28",
    time: "10:00 AM",
    location: "Design Studio B",
    capacity: 60,
    registered: 45,
    description: "Hands-on masterclass on human-centered design, user research, wireframing, and Figma prototyping.",
    status: "Registration Open",
    department: "Information Technology"
  },
  {
    id: "EVT-1003",
    title: "Campus Cultural Gala",
    category: "Cultural",
    date: "2026-11-02",
    time: "05:30 PM",
    location: "Open Air Amphitheatre",
    capacity: 300,
    registered: 220,
    description: "Annual university cultural fest featuring student musical bands, theatre plays, and classical dances.",
    status: "Registration Open",
    department: "Student Affairs"
  },
  {
    id: "EVT-1004",
    title: "Inter-College Volleyball Meet",
    category: "Sports",
    date: "2026-11-06",
    time: "08:30 AM",
    location: "University Sports Complex",
    capacity: 150,
    registered: 110,
    description: "Annual competitive volleyball tournament with teams from across 12 regional technical institutions.",
    status: "Registration Open",
    department: "Physical Education"
  },
  {
    id: "EVT-1005",
    title: "Startup Pitch Challenge",
    category: "Competition",
    date: "2026-11-10",
    time: "02:00 PM",
    location: "Auditorium Hall 2",
    capacity: 80,
    registered: 58,
    description: "Pitch university startup ideas to angel investors and incubation cell directors with grant opportunities.",
    status: "Registration Open",
    department: "Entrepreneurship Cell"
  },
  {
    id: "EVT-1006",
    title: "Photography Walk & Critique",
    category: "Club",
    date: "2026-11-12",
    time: "07:00 AM",
    location: "North Botanical Garden",
    capacity: 40,
    registered: 32,
    description: "Guided photowalk exploring architectural aesthetics and macro natural photography, followed by review.",
    status: "Registration Open",
    department: "Photography Club"
  },
  {
    id: "EVT-1007",
    title: "Autonomous Robotics Showcase",
    category: "Technology",
    date: "2026-11-16",
    time: "11:00 AM",
    location: "Robotics Workshop",
    capacity: 75,
    registered: 75,
    description: "Live demonstration of student-built wheeled robots, computer-vision quadcopters, and robotic arms.",
    status: "Registration Closed",
    department: "Electronics & Robotics"
  },
  {
    id: "EVT-1008",
    title: "Industry AI & Cloud Keynote",
    category: "Seminar",
    date: "2026-11-20",
    time: "03:00 PM",
    location: "Central Auditorium",
    capacity: 250,
    registered: 155,
    description: "Distinguished tech keynote on distributed enterprise systems and large multimodal AI applications.",
    status: "Registration Open",
    department: "Dean of Academics"
  }
];

// ==========================================
// 2. STATE STORAGE USING JSON & ARRAYS
// ==========================================
let events = [];
let registrations = [];

// Initialize data from LocalStorage using JSON.parse, or default to initial arrays
function initializeData() {
  const savedEvents = localStorage.getItem("campusconnect_events");
  if (savedEvents) {
    try {
      events = JSON.parse(savedEvents);
    } catch (e) {
      events = [...defaultEvents];
    }
  } else {
    events = [...defaultEvents];
    saveEventsToJson();
  }

  const savedRegistrations = localStorage.getItem("campusconnect_registrations");
  if (savedRegistrations) {
    try {
      registrations = JSON.parse(savedRegistrations);
    } catch (e) {
      registrations = getInitialRegistrations();
    }
  } else {
    registrations = getInitialRegistrations();
    saveRegistrationsToJson();
  }
}

function getInitialRegistrations() {
  return [
    {
      id: "REG-1042",
      eventId: "EVT-1001",
      eventTitle: "TechSprint 2026",
      studentName: "Alex Morgan",
      email: "alex.morgan@university.edu",
      phone: "9876543210",
      studentId: "STU2024001",
      department: "Computer Science & Engineering",
      year: "3rd Year",
      date: "2026-10-24",
      timestamp: new Date().toISOString()
    },
    {
      id: "REG-1043",
      eventId: "EVT-1002",
      eventTitle: "Design Thinking Workshop",
      studentName: "Alex Morgan",
      email: "alex.morgan@university.edu",
      phone: "9876543210",
      studentId: "STU2024001",
      department: "Computer Science & Engineering",
      year: "3rd Year",
      date: "2026-10-28",
      timestamp: new Date().toISOString()
    }
  ];
}

// JSON Serialization methods demonstrating JSON.stringify()
function saveEventsToJson() {
  const jsonData = JSON.stringify(events, null, 2);
  localStorage.setItem("campusconnect_events", jsonData);
  updateJsonLiveViewer();
}

function saveRegistrationsToJson() {
  const jsonData = JSON.stringify(registrations, null, 2);
  localStorage.setItem("campusconnect_registrations", jsonData);
  updateJsonLiveViewer();
}

// ==========================================
// 3. UI RENDERING FUNCTIONS
// ==========================================

// Helper: Format date for badges
function formatDateParts(dateString) {
  const dateObj = new Date(dateString + "T00:00:00");
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  return { day, month };
}

// Render dynamic event cards in the DOM
function renderEvents(itemsToRender) {
  const container = document.getElementById("eventsContainer");
  const emptyState = document.getElementById("emptyStateContainer");

  if (!container) return;
  container.innerHTML = "";

  if (itemsToRender.length === 0) {
    if (emptyState) emptyState.classList.remove("d-none");
    return;
  }

  if (emptyState) emptyState.classList.add("d-none");

  itemsToRender.forEach(evt => {
    const { day, month } = formatDateParts(evt.date);
    const availableSeats = evt.capacity - evt.registered;
    const isFull = availableSeats <= 0;
    const percentage = Math.round((evt.registered / evt.capacity) * 100);

    const statusBadgeClass = isFull 
      ? 'cc-tag-closed' 
      : (evt.status === 'Upcoming' ? 'cc-tag-upcoming' : 'cc-tag-open');
    const statusText = isFull ? 'Full' : evt.status;

    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4";
    col.innerHTML = `
      <div class="cc-event-card">
        <div>
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div class="event-date-col">
              <span class="day">${day}</span>
              <span class="month">${month}</span>
            </div>
            <div class="text-end">
              <span class="cc-tag cc-tag-teal mb-1">${evt.category}</span>
              <div><span class="cc-tag ${statusBadgeClass}">${statusText}</span></div>
            </div>
          </div>
          <h5 class="fw-bold mb-2">${evt.title}</h5>
          <p class="small text-muted mb-3" style="min-height: 48px;">${evt.description}</p>
          <div class="event-meta-item mb-2">
            <i class="bi bi-geo-alt"></i> <span>${evt.location}</span>
          </div>
          <div class="event-meta-item mb-2">
            <i class="bi bi-clock"></i> <span>${evt.time}</span>
          </div>
        </div>
        <div>
          <div class="capacity-indicator">
            <span><i class="bi bi-people me-1"></i> Capacity: ${evt.capacity}</span>
            <span class="fw-bold text-teal-primary" style="color: var(--cc-teal-primary);">${isFull ? 'Sold Out' : availableSeats + ' seats left'}</span>
          </div>
          <div class="progress-mini">
            <div class="progress-mini-bar" style="width: ${percentage}%;"></div>
          </div>
          <div class="d-flex gap-2 mt-3 pt-2">
            <button type="button" class="btn btn-sm btn-cc-outline w-50" onclick="openEventDetailsModal('${evt.id}')">
              <i class="bi bi-info-circle me-1"></i> Details
            </button>
            <button type="button" class="btn btn-sm btn-cc-teal w-50" ${isFull ? 'disabled' : ''} onclick="prefillAndScrollToRegister('${evt.id}')">
              ${isFull ? 'Full' : 'Register'}
            </button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

// Render dynamic registrations in the DOM
function renderRegistrations() {
  const container = document.getElementById("registrationsContainer");
  const countBadge = document.getElementById("activeRegCountBadge");

  if (!container) return;
  container.innerHTML = "";

  if (countBadge) {
    countBadge.innerHTML = `<i class="bi bi-ticket-fill me-1" style="color: var(--cc-teal-primary);"></i> ${registrations.length} Active Passes`;
  }

  if (registrations.length === 0) {
    container.innerHTML = `
      <div class="p-4 text-center bg-white border rounded">
        <i class="bi bi-ticket-perforated fs-1 text-muted"></i>
        <h6 class="fw-bold mt-2 mb-1">No Active Registrations</h6>
        <p class="small text-muted mb-3">You haven't registered for any events yet.</p>
        <a href="#events" class="btn btn-sm btn-cc-teal">Explore Events</a>
      </div>
    `;
    return;
  }

  registrations.forEach(reg => {
    const { day, month } = formatDateParts(reg.date || "2026-10-24");
    const item = document.createElement("div");
    item.className = "reg-timeline-item";
    item.innerHTML = `
      <div class="d-flex align-items-center gap-4">
        <div class="event-date-col">
          <span class="day">${day}</span>
          <span class="month">${month}</span>
        </div>
        <div>
          <span class="badge bg-success-subtle text-success border border-success-subtle mb-1">Registration Confirmed</span>
          <h5 class="fw-bold mb-1">${reg.eventTitle || 'Campus Event'}</h5>
          <div class="small text-muted">
            <span><i class="bi bi-person me-1"></i> ${reg.studentName} (${reg.studentId})</span> •
            <span class="ms-1"><i class="bi bi-building me-1"></i> ${reg.department}</span> •
            <span class="ms-1 fw-bold text-dark"><i class="bi bi-qr-code me-1"></i> Pass: ${reg.id}</span>
          </div>
        </div>
      </div>
      <div class="d-flex gap-2 mt-3 mt-md-0">
        <button class="btn btn-sm btn-cc-outline" onclick="showTicketPassModal('${reg.id}')">
          <i class="bi bi-eye"></i> View Pass
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="cancelRegistration('${reg.id}')">
          <i class="bi bi-x-circle"></i> Cancel
        </button>
      </div>
    `;
    container.appendChild(item);
  });
}

// Update Dynamic Statistics Counter
function updateStatistics() {
  const statEvents = document.getElementById("statTotalEvents");
  const statClubs = document.getElementById("statActiveClubs");
  const statRegs = document.getElementById("statTotalRegistrations");
  const statWeek = document.getElementById("statThisWeek");

  if (statEvents) statEvents.innerText = events.length;
  if (statClubs) statClubs.innerText = "32";
  if (statRegs) {
    const totalCapacityTaken = events.reduce((sum, e) => sum + e.registered, 0);
    statRegs.innerText = totalCapacityTaken + "+";
  }
  if (statWeek) statWeek.innerText = "18";
}

// Populate Registration Event Select dropdown dynamically
function populateEventDropdown() {
  const select = document.getElementById("p2EventSelect");
  if (!select) return;

  const currentValue = select.value;
  select.innerHTML = `<option value="" disabled selected>-- Choose an Event --</option>`;

  events.forEach(e => {
    const isFull = (e.capacity - e.registered) <= 0;
    const option = document.createElement("option");
    option.value = e.id;
    option.disabled = isFull;
    option.textContent = `${e.title} (${e.date}) ${isFull ? '[FULL]' : `[${e.capacity - e.registered} seats left]`}`;
    select.appendChild(option);
  });

  if (currentValue) select.value = currentValue;
}

// ==========================================
// 4. SEARCH & FILTER LOGIC
// ==========================================
let activeCategory = "All";
let searchQuery = "";

function applyFilters() {
  let filtered = [...events];

  if (activeCategory !== "All") {
    filtered = filtered.filter(e => e.category.toLowerCase() === activeCategory.toLowerCase());
  }

  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q)
    );
  }

  renderEvents(filtered);
}

function handleCategoryFilter(category, buttonElement) {
  activeCategory = category;
  document.querySelectorAll(".filter-pill").forEach(btn => btn.classList.remove("active"));
  if (buttonElement) buttonElement.classList.add("active");
  applyFilters();
}

function clearFilters() {
  activeCategory = "All";
  searchQuery = "";
  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.value = "";
  document.querySelectorAll(".filter-pill").forEach((btn, idx) => {
    btn.classList.toggle("active", idx === 0);
  });
  applyFilters();
}

// ==========================================
// 5. REGISTRATION & VALIDATION (PRACTICAL 02)
// ==========================================
function validateField(input, condition) {
  if (!condition) {
    input.classList.add("is-invalid");
    return false;
  } else {
    input.classList.remove("is-invalid");
    return true;
  }
}

function handleFormSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById("p2FullName");
  const emailInput = document.getElementById("p2Email");
  const phoneInput = document.getElementById("p2Phone");
  const idInput = document.getElementById("p2StudentId");
  const eventSelect = document.getElementById("p2EventSelect");
  const deptSelect = document.getElementById("p2Dept");
  const yearSelect = document.getElementById("p2Year");

  const nameVal = nameInput.value.trim();
  const emailVal = emailInput.value.trim();
  const phoneVal = phoneInput.value.trim();
  const idVal = idInput.value.trim();
  const eventVal = eventSelect.value;
  const deptVal = deptSelect.value;
  const yearVal = yearSelect.value;

  // Validation rules
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  const isNameValid = validateField(nameInput, nameVal.length >= 2);
  const isEmailValid = validateField(emailInput, emailRegex.test(emailVal));
  const isPhoneValid = validateField(phoneInput, phoneRegex.test(phoneVal));
  const isIdValid = validateField(idInput, idVal.length >= 3);
  const isEventValid = validateField(eventSelect, eventVal !== "");
  const isDeptValid = validateField(deptSelect, deptVal !== "");

  if (!isNameValid || !isEmailValid || !isPhoneValid || !isIdValid || !isEventValid || !isDeptValid) {
    return; // Form validation failed; errors displayed directly next to inputs
  }

  // Find target event in array
  const targetEvent = events.find(ev => ev.id === eventVal);
  if (!targetEvent) return;

  if (targetEvent.capacity - targetEvent.registered <= 0) {
    alert("Sorry! This event has reached full capacity.");
    return;
  }

  // Create Registration Object
  const passId = "REG-" + Math.floor(1000 + Math.random() * 9000);
  const newRegistration = {
    id: passId,
    eventId: targetEvent.id,
    eventTitle: targetEvent.title,
    studentName: nameVal,
    email: emailVal,
    phone: phoneVal,
    studentId: idVal,
    department: deptVal,
    year: yearVal,
    date: targetEvent.date,
    timestamp: new Date().toISOString()
  };

  // 1. Add to registrations array
  registrations.unshift(newRegistration);

  // 2. Update event capacity in events array
  targetEvent.registered += 1;
  if (targetEvent.registered >= targetEvent.capacity) {
    targetEvent.status = "Registration Closed";
  }

  // 3. Persist with JSON.stringify
  saveRegistrationsToJson();
  saveEventsToJson();

  // 4. Update UI
  renderEvents(events);
  renderRegistrations();
  updateStatistics();
  populateEventDropdown();

  // 5. Reset form
  document.getElementById("practical2RegForm").reset();

  // 6. Show Success Confirmation Modal
  showSuccessConfirmationModal(newRegistration, targetEvent);
}

// Handle Cancellation
function cancelRegistration(regId) {
  const regIndex = registrations.findIndex(r => r.id === regId);
  if (regIndex === -1) return;

  const reg = registrations[regIndex];
  const targetEvent = events.find(e => e.id === reg.eventId);

  // Confirm via UI
  if (confirm(`Are you sure you want to cancel registration pass ${regId} for "${reg.eventTitle}"?`)) {
    // Remove from array
    registrations.splice(regIndex, 1);

    // Release capacity
    if (targetEvent && targetEvent.registered > 0) {
      targetEvent.registered -= 1;
      if (targetEvent.status === "Registration Closed") {
        targetEvent.status = "Registration Open";
      }
    }

    // Save state using JSON
    saveRegistrationsToJson();
    saveEventsToJson();

    // Re-render
    renderEvents(events);
    renderRegistrations();
    updateStatistics();
    populateEventDropdown();
  }
}

// Prefill and smooth scroll
function prefillAndScrollToRegister(eventId) {
  const select = document.getElementById("p2EventSelect");
  if (select) {
    select.value = eventId;
  }
  const regSection = document.getElementById("register");
  if (regSection) {
    regSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// Open Dynamic Event Details Modal
function openEventDetailsModal(eventId) {
  const evt = events.find(e => e.id === eventId);
  if (!evt) return;

  const modalTitle = document.getElementById("dynamicModalTitle");
  const modalCategory = document.getElementById("dynamicModalCategory");
  const modalDate = document.getElementById("dynamicModalDate");
  const modalTime = document.getElementById("dynamicModalTime");
  const modalLocation = document.getElementById("dynamicModalLocation");
  const modalSeats = document.getElementById("dynamicModalSeats");
  const modalDesc = document.getElementById("dynamicModalDesc");
  const modalRegBtn = document.getElementById("dynamicModalRegisterBtn");

  const availableSeats = evt.capacity - evt.registered;
  const isFull = availableSeats <= 0;

  if (modalTitle) modalTitle.innerText = evt.title;
  if (modalCategory) modalCategory.innerText = evt.category;
  if (modalDate) modalDate.innerText = evt.date;
  if (modalTime) modalTime.innerText = evt.time;
  if (modalLocation) modalLocation.innerText = evt.location;
  if (modalSeats) modalSeats.innerText = `${availableSeats} / ${evt.capacity}`;
  if (modalDesc) modalDesc.innerText = evt.description;

  if (modalRegBtn) {
    modalRegBtn.onclick = () => {
      const modalEl = document.getElementById("eventDetailsModal");
      const bsModal = bootstrap.Modal.getInstance(modalEl);
      if (bsModal) bsModal.hide();
      prefillAndScrollToRegister(evt.id);
    };
    modalRegBtn.disabled = isFull;
    modalRegBtn.innerText = isFull ? "Registration Full" : "Register Now";
  }

  const modalEl = document.getElementById("eventDetailsModal");
  const bsModal = new bootstrap.Modal(modalEl);
  bsModal.show();
}

// Show Confirmation Modal
function showSuccessConfirmationModal(reg, evt) {
  const modalPassId = document.getElementById("confirmPassId");
  const modalEventTitle = document.getElementById("confirmEventTitle");
  const modalDate = document.getElementById("confirmEventDate");
  const modalLocation = document.getElementById("confirmEventLocation");
  const modalStudent = document.getElementById("confirmStudentName");

  if (modalPassId) modalPassId.innerText = reg.id;
  if (modalEventTitle) modalEventTitle.innerText = reg.eventTitle;
  if (modalDate) modalDate.innerText = evt ? `${evt.date} at ${evt.time}` : reg.date;
  if (modalLocation) modalLocation.innerText = evt ? evt.location : "Campus Center";
  if (modalStudent) modalStudent.innerText = `${reg.studentName} (${reg.studentId})`;

  const modalEl = document.getElementById("registrationSuccessModal");
  const bsModal = new bootstrap.Modal(modalEl);
  bsModal.show();
}

// Show Single Ticket Pass Modal
function showTicketPassModal(regId) {
  const reg = registrations.find(r => r.id === regId);
  if (!reg) return;
  const evt = events.find(e => e.id === reg.eventId);
  showSuccessConfirmationModal(reg, evt);
}

// Update the interactive JSON debug panel to show JSON.stringify in real time
function updateJsonLiveViewer() {
  const viewer = document.getElementById("liveJsonViewer");
  if (!viewer) return;
  const stateSnapshot = {
    practicalNumber: "02",
    concept: "JavaScript Array + JSON.stringify() & JSON.parse()",
    totalEventsCount: events.length,
    activeRegistrationsCount: registrations.length,
    sampleRegistrationJson: registrations.length > 0 ? registrations[0] : null
  };
  viewer.textContent = JSON.stringify(stateSnapshot, null, 2);
}

// ==========================================
// 6. INITIALIZATION ON DOM READY
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  initializeData();
  renderEvents(events);
  renderRegistrations();
  updateStatistics();
  populateEventDropdown();
  updateJsonLiveViewer();

  // Search input listener
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      applyFilters();
    });
  }

  // Registration form submit listener
  const regForm = document.getElementById("practical2RegForm");
  if (regForm) {
    regForm.addEventListener("submit", handleFormSubmit);
  }
});
