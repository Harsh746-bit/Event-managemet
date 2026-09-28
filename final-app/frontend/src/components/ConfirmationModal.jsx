import React from 'react';

export default function ConfirmationModal({ registration, onClose }) {
  if (!registration) return null;

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-dialog-custom" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="modal-header-custom p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-check-circle-fill text-success fs-5"></i>
            <span className="fw-bold text-dark">REGISTRATION CONFIRMED</span>
          </div>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
        </div>

        <div className="modal-body-custom p-4 text-center">
          <div className="mb-3">
            <span className="badge bg-light text-dark border p-2 px-3 fw-bold" style={{ letterSpacing: '0.08em' }}>
              {registration.id}
            </span>
          </div>
          <h4 className="fw-bold mb-1">{registration.eventTitle}</h4>
          <p className="small text-muted mb-3">{registration.studentName} ({registration.studentId})</p>

          <div className="p-3 bg-light rounded border text-start mb-3">
            <div className="d-flex justify-content-between mb-2">
              <span className="small text-muted">Department:</span>
              <span className="small fw-bold text-dark">{registration.department}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="small text-muted">Verified & Synced:</span>
              <span className="small fw-bold text-dark">Express REST Backend</span>
            </div>
          </div>
          <p className="small text-muted mb-0">Your seat is reserved in the university database. Show this Pass ID at the gate.</p>
        </div>

        <div className="modal-footer-custom p-3 bg-light border-top">
          <button type="button" className="btn btn-cc-teal w-100" onClick={onClose}>
            View In My Registrations
          </button>
        </div>
      </div>
    </div>
  );
}
