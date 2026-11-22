import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import RegistrationForm from '../../components/RegistrationForm';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';

export default function RegistrationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedEventId = searchParams.get('eventId') || '';

  const { events, handleRegisterSubmit, isSubmitting } = useEvents();
  const { user } = useAuth();
  const [serverError, setServerError] = useState(null);

  const onSubmit = async (formData) => {
    try {
      setServerError(null);
      await handleRegisterSubmit(formData);
      // Give a moment or let modal display
      return true;
    } catch (err) {
      setServerError(err.message || 'Registration failed');
      return false;
    }
  };

  const selectedEvent = events.find(e => e.id === selectedEventId || e._id === selectedEventId);

  return (
    <div className="py-4">
      <div className="container mb-3">
        {selectedEvent && (
          <div className="alert bg-white border border-teal-subtle shadow-sm d-flex flex-wrap align-items-center justify-content-between p-3 rounded-3 mb-4">
            <div className="d-flex align-items-center gap-3">
              <span className="cc-tag cc-tag-teal">{selectedEvent.category}</span>
              <div>
                <h6 className="fw-bold mb-0">{selectedEvent.title}</h6>
                <span className="small text-muted">
                  <i className="bi bi-calendar me-1"></i>{selectedEvent.date} &bull; <i className="bi bi-geo-alt me-1"></i>{selectedEvent.location}
                </span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 mt-2 mt-sm-0">
              <span className="small fw-semibold text-teal-primary" style={{ color: 'var(--cc-teal-primary)' }}>
                {selectedEvent.capacity - selectedEvent.registered} seats remaining
              </span>
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={() => navigate('/events')}
              >
                Change Event
              </button>
            </div>
          </div>
        )}
      </div>

      <RegistrationForm
        events={events}
        selectedEventId={selectedEventId}
        onRegisterSubmit={onSubmit}
        isSubmitting={isSubmitting}
        serverError={serverError}
      />
    </div>
  );
}
