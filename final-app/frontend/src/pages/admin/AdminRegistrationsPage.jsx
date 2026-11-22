import React, { useState } from 'react';
import { useEvents } from '../../context/EventContext';

export default function AdminRegistrationsPage() {
  const {
    registrations,
    events,
    setConfirmedRegistration,
    setRegistrationToCancel
  } = useEvents();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventFilter, setSelectedEventFilter] = useState('All');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');

  // Unique departments for filter
  const departments = ['All', ...new Set(registrations.map(r => r.department).filter(Boolean))];

  const filtered = registrations.filter(reg => {
    const matchesEvent = selectedEventFilter === 'All' || reg.eventId === selectedEventFilter;
    const matchesDept = selectedDeptFilter === 'All' || reg.department === selectedDeptFilter;
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q ||
      reg.id?.toLowerCase().includes(q) ||
      reg.fullName?.toLowerCase().includes(q) ||
      reg.email?.toLowerCase().includes(q) ||
      reg.studentId?.toLowerCase().includes(q) ||
      reg.eventTitle?.toLowerCase().includes(q);

    return matchesEvent && matchesDept && matchesSearch;
  });

  return (
    <div className="py-4" style={{ backgroundColor: '#F8FAFC', minHeight: '85vh' }}>
      <div className="container">
        {/* Header */}
        <div className="row mb-4 align-items-end">
          <div className="col-lg-7">
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-dark text-white px-2 py-1 small">
                <i className="bi bi-shield-lock-fill text-warning me-1"></i> Admin Console
              </span>
              <span className="text-secondary small">Attendee Database & Pass Verification</span>
            </div>
            <h2 className="cc-section-title mb-1">ATTENDEE & REGISTRATION ROSTER</h2>
            <p className="text-secondary mb-0">
              Audit registered attendees, verify student credentials, and manage seat reservations and passes.
            </p>
          </div>
          <div className="col-lg-5 text-lg-end mt-3 mt-lg-0">
            <span className="badge bg-white text-dark border p-2 shadow-sm">
              <i className="bi bi-ticket-fill me-1" style={{ color: 'var(--cc-teal-primary)' }}></i>
              {registrations.length} Active Student Passes
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="card p-3 mb-4 bg-white border rounded-3 shadow-sm">
          <div className="row g-3">
            <div className="col-md-5">
              <label className="form-label small fw-semibold text-muted mb-1">Search Students / Passes</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search by Pass ID, Name, Email, or PRN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted mb-1">Filter by Campus Event</label>
              <select
                className="form-select"
                value={selectedEventFilter}
                onChange={(e) => setSelectedEventFilter(e.target.value)}
              >
                <option value="All">All Events ({events.length})</option>
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({ev.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted mb-1">Department</label>
              <select
                className="form-select"
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
              >
                {departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Roster Table */}
        <div className="card border bg-white shadow-sm rounded-3">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.88rem' }}>
              <thead className="table-light">
                <tr>
                  <th>Pass ID</th>
                  <th>Student Info</th>
                  <th>Event Registered</th>
                  <th>Department & Year</th>
                  <th>Contact Details</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                      No registration passes match your search parameters.
                    </td>
                  </tr>
                ) : (
                  filtered.map(reg => (
                    <tr key={reg.id || reg._id}>
                      <td>
                        <span className="badge bg-light text-dark border font-monospace px-2 py-1">
                          {reg.id}
                        </span>
                      </td>
                      <td>
                        <div className="fw-bold text-dark">{reg.fullName}</div>
                        <div className="small text-muted font-monospace">{reg.studentId}</div>
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">{reg.eventTitle || reg.eventId}</div>
                        <div className="small text-muted">ID: {reg.eventId}</div>
                      </td>
                      <td>
                        <div>{reg.department}</div>
                        <div className="small text-muted">{reg.year}</div>
                      </td>
                      <td>
                        <div><i className="bi bi-envelope me-1 text-muted"></i>{reg.email}</div>
                        <div className="small text-muted"><i className="bi bi-telephone me-1"></i>{reg.phone}</div>
                      </td>
                      <td>
                        <span className="cc-tag cc-tag-open">Confirmed</span>
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            title="Inspect QR Pass"
                            onClick={() => setConfirmedRegistration(reg)}
                          >
                            <i className="bi bi-qr-code"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            title="Revoke / Cancel Pass (Release Seat)"
                            onClick={() => setRegistrationToCancel(reg)}
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="card-footer bg-white py-3 border-top d-flex justify-content-between align-items-center">
            <span className="small text-muted">
              Displaying {filtered.length} of {registrations.length} total registrations
            </span>
            {(searchTerm || selectedEventFilter !== 'All' || selectedDeptFilter !== 'All') && (
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedEventFilter('All');
                  setSelectedDeptFilter('All');
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
