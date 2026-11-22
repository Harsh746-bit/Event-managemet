import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RegistrationCard from '../../components/RegistrationCard';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';

export default function MyPassesPage() {
  const { registrations, setRegistrationToCancel, setConfirmedRegistration } = useEvents();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter registrations: if user has a studentId, show matching or show all if demo
  const displayedRegistrations = registrations.filter(reg => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      reg.eventTitle?.toLowerCase().includes(term) ||
      reg.id?.toLowerCase().includes(term) ||
      reg.studentId?.toLowerCase().includes(term) ||
      reg.fullName?.toLowerCase().includes(term)
    );
  });

  return (
    <section className="cc-section pt-4" id="my-registrations">
      <div className="container">
        {/* Header */}
        <div className="row mb-4 align-items-end">
          <div className="col-md-7">
            <div className="cc-eyebrow">Student Pass Wallet</div>
            <h2 className="cc-section-title">MY REGISTRATIONS & PASSES</h2>
            <p className="cc-section-sub mb-0">
              Access your digital entry tickets, inspect QR barcodes for campus admission, or cancel a pass to release your seat.
            </p>
          </div>
          <div className="col-md-5 text-md-end mt-3 mt-md-0 d-flex justify-content-md-end align-items-center gap-2">
            <span className="badge bg-light text-dark border p-2">
              <i className="bi bi-ticket-fill me-1" style={{ color: 'var(--cc-teal-primary)' }}></i>
              {registrations.length} Active Passes
            </span>
            <Link to="/events" className="btn btn-sm btn-cc-teal">
              <i className="bi bi-plus-circle me-1"></i> New Registration
            </Link>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="card p-3 mb-4 bg-white border rounded-3 shadow-sm">
          <div className="row g-2 align-items-center">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search passes by event title, pass ID (e.g. REG-1001), or student name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4 text-md-end">
              <span className="small text-muted">
                Showing {displayedRegistrations.length} of {registrations.length} registrations
              </span>
            </div>
          </div>
        </div>

        {/* Passes List */}
        {displayedRegistrations.length === 0 ? (
          <div className="p-5 text-center bg-white border rounded-3 shadow-sm">
            <i className="bi bi-ticket-perforated fs-1 text-muted"></i>
            <h5 className="fw-bold mt-3 mb-1">No Active Registrations Found</h5>
            <p className="small text-muted mb-4">
              {searchTerm ? 'No passes matched your search term.' : "You haven't reserved any event tickets yet."}
            </p>
            <div className="d-flex justify-content-center gap-2">
              {searchTerm && (
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setSearchTerm('')}>
                  Clear Search
                </button>
              )}
              <Link to="/events" className="btn btn-sm btn-cc-teal">
                <i className="bi bi-compass me-1"></i> Explore Campus Events
              </Link>
            </div>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {displayedRegistrations.map(reg => (
              <RegistrationCard
                key={reg.id || reg._id}
                registration={reg}
                onCancelClick={(item) => setRegistrationToCancel(item)}
                onViewPass={(item) => setConfirmedRegistration(item)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
