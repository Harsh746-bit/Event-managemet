import React from 'react';

export default function RegistrationCard({ registration, onCancelClick, onViewPass }) {
  const dateObj = new Date((registration.date || "2026-10-24") + "T00:00:00");
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();

  return (
    <div className="reg-timeline-item">
      <div className="d-flex align-items-center gap-4">
        <div className="event-date-col">
          <span className="day">{day}</span>
          <span className="month">{month}</span>
        </div>
        <div>
          <span className="badge bg-success-subtle text-success border border-success-subtle mb-1">Registration Confirmed</span>
          <h5 className="fw-bold mb-1">{registration.eventTitle}</h5>
          <div className="small text-muted">
            <span><i className="bi bi-person me-1"></i> {registration.studentName} ({registration.studentId})</span> •
            <span className="ms-1"><i className="bi bi-building me-1"></i> {registration.department}</span> •
            <span className="ms-1 fw-bold text-dark"><i className="bi bi-qr-code me-1"></i> Pass: {registration.id}</span>
          </div>
        </div>
      </div>
      <div className="d-flex gap-2 mt-3 mt-md-0">
        <button
          type="button"
          className="btn btn-sm btn-cc-outline"
          onClick={() => onViewPass && onViewPass(registration)}
        >
          <i className="bi bi-eye"></i> View Pass
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          onClick={() => onCancelClick && onCancelClick(registration)}
        >
          <i className="bi bi-x-circle"></i> Cancel
        </button>
      </div>
    </div>
  );
}
