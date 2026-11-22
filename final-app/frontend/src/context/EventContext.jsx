import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { initialClubs, initialAnnouncements } from '../data/staticContent';

const EventContext = createContext(null);

export function EventProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [clubs] = useState(initialClubs);
  const [announcements] = useState(initialAnnouncements);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dbConnected, setDbConnected] = useState(false);

  // Modals & Feedback State
  const [activeModalEventId, setActiveModalEventId] = useState(null);
  const [confirmedRegistration, setConfirmedRegistration] = useState(null);
  const [registrationToCancel, setRegistrationToCancel] = useState(null);
  
  // Event CRUD Modals State
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [toast, setToast] = useState(null);

  // Load Events from API
  const loadEvents = useCallback(async (cat = 'All', search = '') => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.getEvents(cat, search);
      setEvents(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to communicate with campus backend server.');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch Registrations, Stats & Health from API
  const loadRegistrationsAndStats = useCallback(async () => {
    try {
      const [regs, stats, health] = await Promise.allSettled([
        apiService.getRegistrations(),
        apiService.getStatistics(),
        apiService.getHealth()
      ]);

      if (regs.status === 'fulfilled') setRegistrations(regs.value);
      if (stats.status === 'fulfilled') setStatistics(stats.value);
      if (health.status === 'fulfilled' && health.value?.database?.status === 'connected') {
        setDbConnected(true);
      } else {
        setDbConnected(false);
      }
    } catch (err) {
      console.warn('Could not fetch registrations/statistics:', err.message);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    loadEvents();
    loadRegistrationsAndStats();
  }, [loadEvents, loadRegistrationsAndStats]);

  // Event CRUD Handlers
  const handleOpenCreateEvent = () => {
    setEventToEdit(null);
    setIsEventFormOpen(true);
  };

  const handleOpenEditEvent = (evt) => {
    setEventToEdit(evt);
    setIsEventFormOpen(true);
  };

  const handleOpenDeleteEvent = (evt) => {
    setEventToDelete(evt);
  };

  const handleEventSaved = (savedResult, isEdit) => {
    setToast({
      type: 'success',
      title: isEdit ? 'Event Updated (PUT)' : 'Event Created (POST)',
      message: isEdit
        ? `"${savedResult.data?.title}" updated successfully in MongoDB.`
        : `"${savedResult.data?.title}" created successfully with ID ${savedResult.data?.id}.`
    });
    loadEvents();
    loadRegistrationsAndStats();
  };

  const handleEventDeleted = (deletedEvent) => {
    setToast({
      type: 'success',
      title: 'Event Deleted (DELETE)',
      message: `Event "${deletedEvent.title}" (${deletedEvent.id}) and linked passes deleted from MongoDB.`
    });
    loadEvents();
    loadRegistrationsAndStats();
  };

  // Create Registration
  const handleRegisterSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const newRegistration = await apiService.createRegistration(formData);
      setConfirmedRegistration(newRegistration);
      setToast({
        type: 'success',
        title: 'Registration Confirmed (POST)',
        message: `Pass ID ${newRegistration.id} generated for ${newRegistration.eventTitle}.`
      });
      loadEvents();
      loadRegistrationsAndStats();
      return true;
    } catch (err) {
      setToast({
        type: 'error',
        title: 'Registration Error',
        message: err.message || 'Registration failed.'
      });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel Registration
  const handleConfirmCancel = async () => {
    if (!registrationToCancel) return;
    setIsCancelling(true);
    try {
      await apiService.cancelRegistration(registrationToCancel.id);
      setToast({
        type: 'success',
        title: 'Pass Cancelled (DELETE)',
        message: `Event pass ${registrationToCancel.id} cancelled. Seat released back to MongoDB.`
      });
      setRegistrationToCancel(null);
      loadEvents();
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

  const activeEventForModal = events.find(
    e => e.id === activeModalEventId || e._id === activeModalEventId
  );

  const value = {
    events,
    registrations,
    statistics,
    clubs,
    announcements,
    isLoading,
    error,
    dbConnected,
    loadEvents,
    loadRegistrationsAndStats,

    // Modal controls
    activeModalEventId,
    setActiveModalEventId,
    activeEventForModal,
    confirmedRegistration,
    setConfirmedRegistration,
    registrationToCancel,
    setRegistrationToCancel,

    // CRUD Event Modal
    isEventFormOpen,
    setIsEventFormOpen,
    eventToEdit,
    setEventToEdit,
    eventToDelete,
    setEventToDelete,
    handleOpenCreateEvent,
    handleOpenEditEvent,
    handleOpenDeleteEvent,
    handleEventSaved,
    handleEventDeleted,

    // Registration Actions
    isSubmitting,
    isCancelling,
    handleRegisterSubmit,
    handleConfirmCancel,

    // Toast
    toast,
    setToast
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}
