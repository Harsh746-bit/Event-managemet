import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedEvents from './components/FeaturedEvents';
import EventCategories from './components/EventCategories';
import HowItWorks from './components/HowItWorks';
import EventDashboard from './components/EventDashboard';
import ClubSection from './components/ClubSection';
import AnnouncementList from './components/AnnouncementList';
import RegistrationForm from './components/RegistrationForm';
import RegistrationCard from './components/RegistrationCard';
import Footer from './components/Footer';
import EventModal from './components/EventModal';
import ConfirmationModal from './components/ConfirmationModal';

import { initialEvents } from './data/events';
import { initialClubs } from './data/clubs';
import { initialAnnouncements } from './data/announcements';

export default function App() {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('cc_react_events');
    return saved ? JSON.parse(saved) : initialEvents;
  });

  const [registrations, setRegistrations] = useState(() => {
    const saved = localStorage.getItem('cc_react_registrations');
    return saved ? JSON.parse(saved) : [
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
  });

  const [clubs] = useState(initialClubs);
  const [announcements] = useState(initialAnnouncements);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [activeModalEventId, setActiveModalEventId] = useState(null);
  const [confirmedRegistration, setConfirmedRegistration] = useState(null);

  // Sync with LocalStorage on state change
  useEffect(() => {
    localStorage.setItem('cc_react_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('cc_react_registrations', JSON.stringify(registrations));
  }, [registrations]);

  // Filtered Events computed in React
  const filteredEvents = events.filter(evt => {
    const matchesCategory = activeCategory === 'All' || evt.category.toLowerCase() === activeCategory.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      evt.title.toLowerCase().includes(q) ||
      evt.category.toLowerCase().includes(q) ||
      evt.location.toLowerCase().includes(q) ||
      evt.description.toLowerCase().includes(q)
    );
    return matchesCategory && matchesSearch;
  });

  const handleSelectEventForRegistration = (eventId) => {
    setSelectedEventId(eventId);
    const regEl = document.getElementById('register');
    if (regEl) {
      regEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRegisterSubmit = (formData) => {
    const targetEvent = events.find(e => e.id === formData.eventId);
    if (!targetEvent) return;

    if (targetEvent.capacity - targetEvent.registered <= 0) {
      alert("This event is fully booked.");
      return;
    }

    const passId = "REG-" + Math.floor(1000 + Math.random() * 9000);
    const newReg = {
      id: passId,
      eventId: targetEvent.id,
      eventTitle: targetEvent.title,
      studentName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      studentId: formData.studentId,
      department: formData.department,
      year: formData.year,
      date: targetEvent.date,
      timestamp: new Date().toISOString()
    };

    // Update state immutably
    setRegistrations(prev => [newReg, ...prev]);

    setEvents(prev => prev.map(ev => {
      if (ev.id === targetEvent.id) {
        const newRegistered = ev.registered + 1;
        return {
          ...ev,
          registered: newRegistered,
          status: newRegistered >= ev.capacity ? "Registration Closed" : ev.status
        };
      }
      return ev;
    }));

    setConfirmedRegistration(newReg);
  };

  const handleCancelRegistration = (regId) => {
    const targetReg = registrations.find(r => r.id === regId);
    if (!targetReg) return;

    if (window.confirm(`Are you sure you want to cancel pass ${regId} for "${targetReg.eventTitle}"?`)) {
      setRegistrations(prev => prev.filter(r => r.id !== regId));

      setEvents(prev => prev.map(ev => {
        if (ev.id === targetReg.eventId) {
          const newRegistered = Math.max(0, ev.registered - 1);
          return {
            ...ev,
            registered: newRegistered,
            status: "Registration Open"
          };
        }
        return ev;
      }));
    }
  };

  const activeEventForModal = events.find(e => e.id === activeModalEventId);

  return (
    <div>
      <Navbar activePassCount={registrations.length} />

      <Hero onOpenModal={(id) => setActiveModalEventId(id)} />

      <FeaturedEvents
        onOpenModal={(id) => setActiveModalEventId(id)}
        onSelectEvent={handleSelectEventForRegistration}
      />

      <EventCategories
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat)}
      />

      <HowItWorks />

      <EventDashboard
        events={events}
        filteredEvents={filteredEvents}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onResetFilters={() => {
          setSearchQuery('');
          setActiveCategory('All');
        }}
        onOpenModal={(id) => setActiveModalEventId(id)}
        onSelectEvent={handleSelectEventForRegistration}
      />

      <ClubSection clubs={clubs} />

      <AnnouncementList announcements={announcements} />

      <RegistrationForm
        events={events}
        selectedEventId={selectedEventId}
        onRegisterSubmit={handleRegisterSubmit}
      />

      {/* MY REGISTRATIONS SECTION */}
      <section className="cc-section" id="my-registrations">
        <div className="container">
          <div className="row mb-4 align-items-end">
            <div className="col-md-8">
              <div className="cc-eyebrow">Student Portal</div>
              <h2 className="cc-section-title">MY REGISTRATIONS</h2>
              <p className="cc-section-sub mb-0">Manage active event tickets, pass barcodes, and cancellations in React state.</p>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <span className="badge bg-light text-dark border p-2">
                <i className="bi bi-ticket-fill me-1" style={{ color: 'var(--cc-teal-primary)' }}></i>
                {registrations.length} Active Passes
              </span>
            </div>
          </div>

          {registrations.length === 0 ? (
            <div className="p-4 text-center bg-white border rounded">
              <i className="bi bi-ticket-perforated fs-1 text-muted"></i>
              <h6 className="fw-bold mt-2 mb-1">No Active Registrations</h6>
              <p className="small text-muted mb-3">You have not registered for any campus events yet.</p>
              <a href="#events" className="btn btn-sm btn-cc-teal">Explore Events</a>
            </div>
          ) : (
            <div>
              {registrations.map(reg => (
                <RegistrationCard
                  key={reg.id}
                  registration={reg}
                  onCancel={handleCancelRegistration}
                  onViewPass={(item) => setConfirmedRegistration(item)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* MODALS */}
      <EventModal
        event={activeEventForModal}
        onClose={() => setActiveModalEventId(null)}
        onRegister={handleSelectEventForRegistration}
      />

      <ConfirmationModal
        registration={confirmedRegistration}
        onClose={() => setConfirmedRegistration(null)}
      />
    </div>
  );
}
