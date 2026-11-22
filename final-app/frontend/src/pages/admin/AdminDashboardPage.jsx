import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboardPage() {
  const {
    events,
    registrations,
    statistics,
    dbConnected,
    handleOpenCreateEvent,
    handleOpenEditEvent,
    setRegistrationToCancel,
    setConfirmedRegistration
  } = useEvents();

  const { user, organizers, approveOrganizer, rejectOrganizer } = useAuth();
  const navigate = useNavigate();

  const pendingOrganizers = (organizers || []).filter(o => o.status === 'pending');
  const approvedOrganizers = (organizers || []).filter(o => o.status === 'approved');

  // Metrics calculation
  const totalCapacity = events.reduce((sum, e) => sum + (e.capacity || 0), 0);
  const totalRegistered = events.reduce((sum, e) => sum + (e.registered || 0), 0);
  const totalAvailable = Math.max(0, totalCapacity - totalRegistered);
  const utilizationRate = totalCapacity > 0 ? Math.round((totalRegistered / totalCapacity) * 100) : 0;

  // High occupancy events
  const criticalEvents = events.filter(e => {
    const remaining = e.capacity - e.registered;
    return remaining <= 10;
  });

  return (
    <div className="py-4" style={{ backgroundColor: '#F8FAFC', minHeight: '85vh' }}>
      <div className="container">
        {/* Welcome & Role Header */}
        <div className="row mb-4 align-items-center">
          <div className="col-lg-8">
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-dark text-white px-2 py-1 small">
                <i className="bi bi-shield-lock-fill text-warning me-1"></i> Admin Console
              </span>
              <span className="text-secondary small">Authenticated as <strong>{user?.name}</strong></span>
            </div>
            <h2 className="cc-section-title mb-1">CAMPUS OPERATIONS OVERVIEW</h2>
            <p className="text-secondary mb-0">
              Real-time executive oversight of seat quotas, attendee registrations, and database operations.
            </p>
          </div>
          <div className="col-lg-4 text-lg-end mt-3 mt-lg-0 d-flex gap-2 justify-content-lg-end">
            <button className="btn btn-cc-teal" onClick={handleOpenCreateEvent}>
              <i className="bi bi-plus-lg me-1"></i> Add Event
            </button>
            <Link to="/admin/events" className="btn btn-cc-outline">
              <i className="bi bi-sliders me-1"></i> Manage All
            </Link>
          </div>
        </div>

        {/* Executive KPI Cards */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <div className="card p-3 border-0 bg-white shadow-sm rounded-3 h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-bold text-uppercase">Total Events</span>
                <span className="p-2 rounded bg-light text-dark"><i className="bi bi-calendar-check"></i></span>
              </div>
              <h3 className="fw-bold mb-0">{events.length}</h3>
              <div className="small text-muted mt-1">Across 5 departments</div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="card p-3 border-0 bg-white shadow-sm rounded-3 h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-bold text-uppercase">Passes Issued</span>
                <span className="p-2 rounded text-white" style={{ backgroundColor: 'var(--cc-teal-primary)' }}>
                  <i className="bi bi-ticket-perforated"></i>
                </span>
              </div>
              <h3 className="fw-bold mb-0" style={{ color: 'var(--cc-teal-primary)' }}>
                {registrations.length}
              </h3>
              <div className="small text-muted mt-1">Active student tickets</div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="card p-3 border-0 bg-white shadow-sm rounded-3 h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-bold text-uppercase">Seat Utilization</span>
                <span className="p-2 rounded bg-warning-subtle text-warning"><i className="bi bi-pie-chart"></i></span>
              </div>
              <h3 className="fw-bold mb-0">{utilizationRate}%</h3>
              <div className="small text-muted mt-1">{totalRegistered} / {totalCapacity} seats filled</div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="card p-3 border-0 bg-white shadow-sm rounded-3 h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-bold text-uppercase">Active Clubs</span>
                <span className="p-2 rounded bg-info-subtle text-info"><i className="bi bi-people"></i></span>
              </div>
              <h3 className="fw-bold mb-0">32</h3>
              <div className="small text-muted mt-1">Student societies & cells</div>
            </div>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div 
              className="card p-3 border bg-white shadow-sm rounded-3 h-100" 
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/admin/events')}
            >
              <div className="d-flex align-items-center gap-3">
                <div className="p-3 rounded-circle bg-light text-primary">
                  <i className="bi bi-calendar2-range fs-4"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Event Management Studio</h6>
                  <p className="small text-muted mb-0">Create, edit, and manage campus events and seat capacities.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div 
              className="card p-3 border bg-white shadow-sm rounded-3 h-100" 
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/admin/registrations')}
            >
              <div className="d-flex align-items-center gap-3">
                <div className="p-3 rounded-circle bg-light text-success">
                  <i className="bi bi-people-fill fs-4"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Attendee & Passes Roster</h6>
                  <p className="small text-muted mb-0">Inspect student PRNs, contacts, barcode passes, and revoke tickets.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div 
              className="card p-3 border bg-white shadow-sm rounded-3 h-100" 
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/announcements')}
            >
              <div className="d-flex align-items-center gap-3">
                <div className="p-3 rounded-circle bg-light text-warning">
                  <i className="bi bi-megaphone-fill fs-4 text-warning"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Notices & Announcements</h6>
                  <p className="small text-muted mb-0">Review campus alerts, department bulletins, and student updates.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Critical Occupancy & Event Status */}
          <div className="col-lg-7">
            <div className="card border bg-white shadow-sm rounded-3 h-100">
              <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                <h6 className="fw-bold mb-0">
                  <i className="bi bi-speedometer me-2 text-warning"></i> Capacity & Event Occupancy
                </h6>
                <Link to="/admin/events" className="small fw-semibold text-teal-primary" style={{ color: 'var(--cc-teal-primary)' }}>
                  View All ({events.length}) &rarr;
                </Link>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.88rem' }}>
                    <thead className="table-light">
                      <tr>
                        <th>Event</th>
                        <th>Category</th>
                        <th>Capacity</th>
                        <th>Occupancy</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.slice(0, 5).map(ev => {
                        const remaining = ev.capacity - ev.registered;
                        const pct = Math.round((ev.registered / ev.capacity) * 100);
                        return (
                          <tr key={ev.id}>
                            <td>
                              <div className="fw-bold text-dark">{ev.title}</div>
                              <div className="small text-muted">{ev.date} &bull; {ev.location}</div>
                            </td>
                            <td>
                              <span className="cc-tag cc-tag-teal">{ev.category}</span>
                            </td>
                            <td>{ev.capacity}</td>
                            <td style={{ minWidth: '130px' }}>
                              <div className="d-flex justify-content-between small mb-1">
                                <span>{ev.registered} filled</span>
                                <span className={remaining <= 5 ? 'text-danger fw-bold' : 'text-muted'}>
                                  {remaining} left
                                </span>
                              </div>
                              <div className="progress" style={{ height: '6px' }}>
                                <div 
                                  className={`progress-bar ${remaining <= 5 ? 'bg-danger' : 'bg-success'}`} 
                                  style={{ width: `${pct}%` }}
                                ></div>
                              </div>
                            </td>
                            <td className="text-end">
                              <button
                                className="btn btn-sm btn-link text-secondary p-1"
                                title="Edit Event"
                                onClick={() => handleOpenEditEvent(ev)}
                              >
                                <i className="bi bi-pencil-square"></i>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Registrations Log */}
          <div className="col-lg-5">
            <div className="card border bg-white shadow-sm rounded-3 h-100">
              <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                <h6 className="fw-bold mb-0">
                  <i className="bi bi-clock-history me-2 text-teal-primary" style={{ color: 'var(--cc-teal-primary)' }}></i>
                  Latest Student Passes
                </h6>
                <Link to="/admin/registrations" className="small fw-semibold text-teal-primary" style={{ color: 'var(--cc-teal-primary)' }}>
                  Full Roster &rarr;
                </Link>
              </div>
              <div className="card-body p-3">
                {registrations.length === 0 ? (
                  <div className="text-center py-4 text-muted small">
                    No active registrations on record.
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {registrations.slice(0, 4).map(reg => (
                      <div key={reg.id} className="p-2 rounded border bg-light d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-bold small text-dark">{reg.fullName}</div>
                          <div className="small text-muted" style={{ fontSize: '0.78rem' }}>
                            <span className="badge bg-secondary-subtle text-dark border me-1">{reg.id}</span>
                            {reg.eventTitle}
                          </div>
                        </div>
                        <div className="d-flex gap-1">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary p-1 px-2"
                            style={{ fontSize: '0.75rem' }}
                            title="Inspect Pass"
                            onClick={() => setConfirmedRegistration(reg)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger p-1 px-2"
                            style={{ fontSize: '0.75rem' }}
                            title="Revoke / Cancel"
                            onClick={() => setRegistrationToCancel(reg)}
                          >
                            <i className="bi bi-x-circle"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CLUB ORGANIZER APPROVAL & ACCESS CONTROL */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card border bg-white shadow-sm rounded-3">
              <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="fw-bold mb-0">
                    <i className="bi bi-shield-check me-2 text-primary"></i>
                    Club Organizer Verifications & Approvals
                  </h6>
                  <span className="small text-muted">
                    Only verified club organizers approved by the Master Administrator can log in and manage society activities.
                  </span>
                </div>
                <span className="badge bg-warning-subtle text-dark border px-2 py-1">
                  {pendingOrganizers.length} Pending Approval
                </span>
              </div>
              <div className="card-body p-0">
                {pendingOrganizers.length === 0 ? (
                  <div className="p-4 text-center text-muted small">
                    <i className="bi bi-check2-circle fs-3 text-success d-block mb-1"></i>
                    No pending organizer requests. All club leads are verified.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.88rem' }}>
                      <thead className="table-light">
                        <tr>
                          <th>Club / Society</th>
                          <th>Applicant / Lead</th>
                          <th>Department</th>
                          <th>Submitted Date</th>
                          <th>Status</th>
                          <th className="text-end">Admin Decision</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingOrganizers.map(org => (
                          <tr key={org.id}>
                            <td>
                              <div className="fw-bold text-dark">{org.clubName}</div>
                              <div className="small text-muted">{org.email}</div>
                            </td>
                            <td>
                              <div className="fw-semibold">{org.name}</div>
                            </td>
                            <td>{org.department}</td>
                            <td>{org.appliedAt || 'Recent'}</td>
                            <td>
                              <span className="badge bg-warning-subtle text-warning border border-warning-subtle">
                                <i className="bi bi-hourglass-split me-1"></i> Pending Review
                              </span>
                            </td>
                            <td className="text-end">
                              <div className="btn-group btn-group-sm">
                                <button
                                  type="button"
                                  className="btn btn-success px-3"
                                  onClick={() => approveOrganizer(org.id)}
                                  title="Approve access to Club Hub"
                                >
                                  <i className="bi bi-check-lg me-1"></i> Approve
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline-danger"
                                  onClick={() => rejectOrganizer(org.id)}
                                  title="Reject application"
                                >
                                  <i className="bi bi-x-lg"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* List of active approved organizers */}
              <div className="card-footer bg-light py-2 px-3 border-top small">
                <span className="text-muted me-2"><strong>Approved Club Leads:</strong></span>
                {approvedOrganizers.map(ao => (
                  <span key={ao.id} className="badge bg-white text-dark border me-1">
                    <i className="bi bi-patch-check-fill text-success me-1"></i>
                    {ao.name} ({ao.clubName})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
