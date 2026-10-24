import React from 'react';

export default function EventCard({ event, onOpenModal, onSelectEvent, onEditEvent, onDeleteEvent }) {
  const dateObj = new Date(event.date + "T00:00:00");
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();

  const availableSeats = event.capacity - event.registered;
  const isFull = availableSeats <= 0;
  const percentage = Math.round((event.registered / event.capacity) * 100);

  const statusBadgeClass = isFull 
    ? 'cc-tag-closed' 
    : (event.status === 'Upcoming' ? 'cc-tag-upcoming' : 'cc-tag-open');
  const statusText = isFull ? 'Full' : event.status;

  return (
    <div className="col-md-6 col-lg-4">
      <div className="cc-event-card">
        <div>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="event-date-col">
              <span className="day">{day}</span>
              <span className="month">{month}</span>
            </div>
            <div className="text-end">
              <div className="d-flex align-items-center justify-content-end gap-1 mb-1">
                <span className="cc-tag cc-tag-teal">{event.category}</span>
                {onEditEvent && (
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-secondary p-0 px-1"
                    title="Edit Event (PUT)"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditEvent(event);
                    }}
                  >
                    <i className="bi bi-pencil-square" style={{ fontSize: '0.95rem' }}></i>
                  </button>
                )}
                {onDeleteEvent && (
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-danger p-0 px-1"
                    title="Delete Event (DELETE)"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteEvent(event);
                    }}
                  >
                    <i className="bi bi-trash3" style={{ fontSize: '0.95rem' }}></i>
                  </button>
                )}
              </div>
              <div><span className={`cc-tag ${statusBadgeClass}`}>{statusText}</span></div>
            </div>
          </div>
          <h5 className="fw-bold mb-2">{event.title}</h5>
          <p className="small text-muted mb-3" style={{ minHeight: '48px' }}>{event.description}</p>
          <div className="event-meta-item mb-2">
            <i className="bi bi-geo-alt"></i> <span>{event.location}</span>
          </div>
          <div className="event-meta-item mb-2">
            <i className="bi bi-clock"></i> <span>{event.time}</span>
          </div>
        </div>
        <div>
          <div className="capacity-indicator">
            <span><i className="bi bi-people me-1"></i> Capacity: {event.capacity}</span>
            <span className="fw-bold text-teal-primary" style={{ color: 'var(--cc-teal-primary)' }}>
              {isFull ? 'Sold Out' : `${availableSeats} seats left`}
            </span>
          </div>
          <div className="progress-mini">
            <div className="progress-mini-bar" style={{ width: `${percentage}%` }}></div>
          </div>
          <div className="d-flex gap-2 mt-3 pt-2">
            <button
              type="button"
              className="btn btn-sm btn-cc-outline w-50"
              onClick={() => onOpenModal && onOpenModal(event.id)}
            >
              <i className="bi bi-info-circle me-1"></i> Details
            </button>
            <button
              type="button"
              className="btn btn-sm btn-cc-teal w-50"
              disabled={isFull}
              onClick={() => onSelectEvent && onSelectEvent(event.id)}
            >
              {isFull ? 'Full' : 'Register'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
