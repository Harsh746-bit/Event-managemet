import React from 'react';

export default function EventModal({ event, onClose, onRegister }) {
  if (!event) return null;

  const availableSeats = event.capacity - event.registered;
  const isFull = availableSeats <= 0;

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-dialog-custom" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-custom p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <span className="cc-tag cc-tag-teal">{event.category}</span>
            <span className="cc-tag cc-tag-open">Verified Campus Event</span>
          </div>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
        </div>

        <div className="modal-body-custom p-4">
          <h3 className="fw-bold mb-2">{event.title}</h3>
          <p className="text-secondary mb-4">{event.description}</p>

          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-md-3">
              <div className="p-3 bg-light rounded border text-center">
                <div className="small text-muted text-uppercase fw-bold" style={{ fontSize: '0.75rem' }}>Date</div>
                <div className="fw-bold text-dark mt-1">{event.date}</div>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="p-3 bg-light rounded border text-center">
                <div className="small text-muted text-uppercase fw-bold" style={{ fontSize: '0.75rem' }}>Time</div>
                <div className="fw-bold text-dark mt-1">{event.time}</div>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="p-3 bg-light rounded border text-center">
                <div className="small text-muted text-uppercase fw-bold" style={{ fontSize: '0.75rem' }}>Venue</div>
                <div className="fw-bold text-dark mt-1">{event.location}</div>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="p-3 bg-light rounded border text-center">
                <div className="small text-muted text-uppercase fw-bold" style={{ fontSize: '0.75rem' }}>Available</div>
                <div className="fw-bold text-teal-primary mt-1" style={{ color: 'var(--cc-teal-primary)' }}>
                  {availableSeats} / {event.capacity}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer-custom p-3 bg-light border-top d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-cc-outline" onClick={onClose}>Close</button>
          <button
            type="button"
            className="btn btn-cc-teal"
            disabled={isFull}
            onClick={() => {
              onClose();
              onRegister(event.id);
            }}
          >
            {isFull ? "Registration Full" : "Register Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
