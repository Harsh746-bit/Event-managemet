import React, { useState, useEffect, useCallback } from 'react';
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
import EventModal from './components/EventModal';
import ConfirmationModal from './components/ConfirmationModal';
import CancelConfirmationModal from './components/CancelConfirmationModal';
import ToastAlert from './components/ToastAlert';
import Footer from './components/Footer';

import { apiService } from './services/api';
import { initialClubs, initialAnnouncements } from './data/staticContent';

export default function App() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [clubs] = useState(initialClubs);
  const [announcements] = useState(initialAnnouncements);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedEventId, setSelectedEventId] = useState('');

  // Modals & Feedback State
  const [activeModalEventId, setActiveModalEventId] = useState(null);
  const [confirmedRegistration, setConfirmedRegistration] = useState(null);
  const [registrationToCancel, setRegistrationToCancel] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [toast, setToast] = useState(null);

  // Fetch Events from API
  const loadEvents = useCallback(async (cat, search) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.getEvents(cat, search);
      setEvents(data);
    } catch (err) {
      setError(err.message || 'Failed to communicate with campus backend server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch Registrations & Stats from API
  const loadRegistrationsAndStats = useCallback(async () => {
    try {
      const [regs, stats] = await Promise.all([
        apiService.getRegistrations(),
        apiService.getStatistics()
      ]);
      setRegistrations(regs);
      setStatistics(stats);
    } catch (err) {
      console.warn('Could not fetch registrations/statistics:', err.message);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    loadEvents(activeCategory, searchQuery);
    loadRegistrationsAndStats();
  }, [loadEvents, loadRegistrationsAndStats, activeCategory, searchQuery]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleResetFilters = () => {
    setActiveCategory('All');
    setSearchQuery('');
  };

  const handleSelectEventForRegistration = (eventId) => {
    setSelectedEventId(eventId);
    const regSection = document.getElementById('register');
    if (regSection) {
      regSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Create Registration Handler
  const handleRegisterSubmit = async (formData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const newRegistration = await apiService.createRegistration(formData);
      
      // Update local state and refresh
      setConfirmedRegistration(newRegistration);
      setToast({
        type: 'success',
        title: 'Registration Confirmed',
        message: `Pass ID ${newRegistration.id} generated for ${newRegistration.eventTitle}.`
      });

      // Reload fresh data from backend
      loadEvents(activeCategory, searchQuery);
      loadRegistrationsAndStats();
      return true;
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please verify your details.');
      setToast({
        type: 'error',
        title: 'Registration Error',
        message: err.message
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel Registration Handler
  const handleConfirmCancel = async () => {
    if (!registrationToCancel) return;
    setIsCancelling(true);

    try {
      await apiService.cancelRegistration(registrationToCancel.id);
      setToast({
        type: 'success',
        title: 'Pass Cancelled',
        message: `Event pass ${registrationToCancel.id} was successfully cancelled and seat released.`
      });
      setRegistrationToCancel(null);

      // Reload data
      loadEvents(activeCategory, searchQuery);
      loadRegistrationsAndStats();
    } catch (err) {
      setToast({
        type: 'error',
        title: 'Cancellation Error',
        message: err.message
      });
    } finally {
      setIsCancelling(false);
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
        onSelectCategory={handleCategoryChange}
      />

      <HowItWorks />

      <EventDashboard
        statistics={statistics}
        events={events}
        isLoading={isLoading}
        error={error}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        onResetFilters={handleResetFilters}
        onOpenModal={(id) => setActiveModalEventId(id)}
        onSelectEvent={handleSelectEventForRegistration}
        onRetry={() => {
          loadEvents(activeCategory, searchQuery);
          loadRegistrationsAndStats();
        }}
      />

      <ClubSection clubs={clubs} />

      <AnnouncementList announcements={announcements} />

      <RegistrationForm
        events={events}
        selectedEventId={selectedEventId}
        onRegisterSubmit={handleRegisterSubmit}
        isSubmitting={isSubmitting}
        serverError={serverError}
      />

      {/* MY REGISTRATIONS TIMELINE */}
      <section className="cc-section" id="my-registrations">
        <div className="container">
          <div className="row mb-4 align-items-end">
            <div className="col-md-8">
              <div className="cc-eyebrow">Student Portal</div>
              <h2 className="cc-section-title">MY REGISTRATIONS</h2>
              <p className="cc-section-sub mb-0">Manage active event passes, verify QR barcodes, and release seats.</p>
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
              <h6 className="fw-bold mt-2 mb-1">No Active Registrations Found</h6>
              <p className="small text-muted mb-3">You haven't registered for any events yet.</p>
              <a href="#events" className="btn btn-sm btn-cc-teal">Explore Events</a>
            </div>
          ) : (
            <div>
              {registrations.map(reg => (
                <RegistrationCard
                  key={reg.id}
                  registration={reg}
                  onCancelClick={(item) => setRegistrationToCancel(item)}
                  onViewPass={(item) => setConfirmedRegistration(item)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* MODALS & NOTIFICATIONS */}
      <EventModal
        event={activeEventForModal}
        onClose={() => setActiveModalEventId(null)}
        onRegister={handleSelectEventForRegistration}
      />

      <ConfirmationModal
        registration={confirmedRegistration}
        onClose={() => setConfirmedRegistration(null)}
      />

      <CancelConfirmationModal
        registration={registrationToCancel}
        onConfirm={handleConfirmCancel}
        onCancel={() => setRegistrationToCancel(null)}
        isCancelling={isCancelling}
      />

      <ToastAlert
        toast={toast}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
