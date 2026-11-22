import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import EventModal from './EventModal';
import EventFormModal from './EventFormModal';
import DeleteEventModal from './DeleteEventModal';
import ConfirmationModal from './ConfirmationModal';
import CancelConfirmationModal from './CancelConfirmationModal';
import ToastAlert from './ToastAlert';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';

export default function AppLayout() {
  const {
    activeEventForModal,
    setActiveModalEventId,
    isEventFormOpen,
    setIsEventFormOpen,
    eventToEdit,
    eventToDelete,
    setEventToDelete,
    handleOpenEditEvent,
    handleOpenDeleteEvent,
    handleEventSaved,
    handleEventDeleted,
    confirmedRegistration,
    setConfirmedRegistration,
    registrationToCancel,
    setRegistrationToCancel,
    handleConfirmCancel,
    isCancelling,
    toast,
    setToast
  } = useEvents();

  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleRegisterFromModal = (eventId) => {
    setActiveModalEventId(null);
    navigate(`/register?eventId=${eventId}`);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-grow-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals & Notifications */}
      <EventModal
        event={activeEventForModal}
        onClose={() => setActiveModalEventId(null)}
        onRegister={handleRegisterFromModal}
        onEdit={isAdmin ? handleOpenEditEvent : null}
        onDelete={isAdmin ? handleOpenDeleteEvent : null}
      />

      <EventFormModal
        isOpen={isEventFormOpen}
        event={eventToEdit}
        onClose={() => setIsEventFormOpen(false)}
        onSaved={handleEventSaved}
      />

      <DeleteEventModal
        isOpen={Boolean(eventToDelete)}
        event={eventToDelete}
        onClose={() => setEventToDelete(null)}
        onDeleted={handleEventDeleted}
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
