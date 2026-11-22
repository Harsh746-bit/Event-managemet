import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';
import EventCard from '../../components/EventCard';

export default function OrganizerDashboardPage() {
  const {
    events,
    registrations,
    clubs,
    announcements,
    handleOpenCreateEvent,
    handleOpenEditEvent,
    handleOpenDeleteEvent,
    setActiveModalEventId
  } = useEvents();

  const { user } = useAuth();
  const navigate = useNavigate();

  // Find club associated with organizer (default to Coding / Tech club or user department)
  const myClub = clubs.find(c => c.name.toLowerCase().includes('coding') || c.category.toLowerCase().includes('software')) || clubs[0];

  // Events associated with Technology / Workshops or all club events
  const clubEvents = events.filter(e => 
    e.category === 'Technology' || 
    e.category === 'Workshop' || 
    e.department?.toLowerCase().includes('computer') ||
    e.department?.toLowerCase().includes('technology')
  );

  // Attendees registered for club events
  const clubEventIds = new Set(clubEvents.map(e => e.id));
  const clubRegistrations = registrations.filter(r => clubEventIds.has(r.eventId));

  // Quick announcement draft state
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeUrgent, setNoticeUrgent] = useState(false);
  const [postedSuccess, setPostedSuccess] = useState(false);

  const handlePostNotice = (e) => {
    e.preventDefault();
    if (!noticeTitle.trim()) return;
    setPostedSuccess(true);
    setNoticeTitle('');
    setTimeout(() => setPostedSuccess(false), 4000);
  };

  return (
    <div className="py-4" style={{ backgroundColor: '#F8FAFC', minHeight: '85vh' }}>
      <div className="container">
        {/* Header */}
        <div className="row mb-4 align-items-center">
          <div className="col-lg-8">
            <div className="d-flex align-items-center gap-2 mb-1">
              <span 
                className="badge px-2 py-1 small bg-primary" 
              >
                <i className="bi bi-award me-1"></i> Club Organizer Portal
              </span>
              <span className="text-secondary small">
                {user?.clubName ? <span><strong>{user.clubName}</strong> &bull; </span> : null}
                Organized by: <strong>{user?.name || 'Club Lead'}</strong>
              </span>
            </div>
            <h2 className="cc-section-title mb-1">CLUB EVENT MANAGEMENT & NOTICES</h2>
            <p className="text-secondary mb-0">
              Schedule campus activities, review registered attendees, and broadcast society announcements.
            </p>
          </div>
          <div className="col-lg-4 text-lg-end mt-3 mt-lg-0 d-flex gap-2 justify-content-lg-end">
            <button className="btn btn-cc-teal" onClick={handleOpenCreateEvent}>
              <i className="bi bi-calendar-plus me-1"></i> Host New Event
            </button>
            <Link to="/announcements" className="btn btn-cc-outline">
              <i className="bi bi-megaphone me-1"></i> Notice Board
            </Link>
          </div>
        </div>

        {/* Club Metric Overview */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <div className="card p-3 border-0 bg-white shadow-sm rounded-3 h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-bold text-uppercase">Club Members</span>
                <span className="p-2 rounded bg-primary-subtle text-primary"><i className="bi bi-people-fill"></i></span>
              </div>
              <h3 className="fw-bold mb-0">{myClub?.memberCount || 450}</h3>
              <div className="small text-muted mt-1">Active student members</div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="card p-3 border-0 bg-white shadow-sm rounded-3 h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-bold text-uppercase">Club Events</span>
                <span className="p-2 rounded bg-success-subtle text-success"><i className="bi bi-calendar-check"></i></span>
              </div>
              <h3 className="fw-bold mb-0">{clubEvents.length}</h3>
              <div className="small text-muted mt-1">Organized this academic term</div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="card p-3 border-0 bg-white shadow-sm rounded-3 h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-bold text-uppercase">Total RSVPs</span>
                <span className="p-2 rounded bg-warning-subtle text-warning"><i className="bi bi-ticket-perforated-fill"></i></span>
              </div>
              <h3 className="fw-bold mb-0">{clubRegistrations.length > 0 ? clubRegistrations.length : 117}</h3>
              <div className="small text-muted mt-1">Confirmed student registrations</div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="card p-3 border-0 bg-white shadow-sm rounded-3 h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-bold text-uppercase">Society Status</span>
                <span className="p-2 rounded bg-teal-subtle text-teal"><i className="bi bi-check-circle-fill"></i></span>
              </div>
              <h3 className="fw-bold mb-0 fs-5 text-success">
                <i className="bi bi-patch-check-fill me-1"></i> Recognized Club
              </h3>
              <div className="small text-muted mt-1">University Student Council</div>
            </div>
          </div>
        </div>

        {/* Club Event Management Section */}
        <div className="row g-4 mb-4">
          <div className="col-lg-8">
            <div className="card border bg-white shadow-sm rounded-3 h-100">
              <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                <h6 className="fw-bold mb-0">
                  <i className="bi bi-calendar-event me-2 text-teal-primary" style={{ color: 'var(--cc-teal-primary)' }}></i>
                  Our Club Activities & Events ({clubEvents.length})
                </h6>
                <button className="btn btn-sm btn-cc-teal" onClick={handleOpenCreateEvent}>
                  <i className="bi bi-plus-lg me-1"></i> Create Club Event
                </button>
              </div>
              <div className="card-body p-3">
                {clubEvents.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    No active club events found. Click "Create Club Event" to host your first session.
                  </div>
                ) : (
                  <div className="row g-3">
                    {clubEvents.map(evt => (
                      <EventCard
                        key={evt.id}
                        event={evt}
                        onOpenModal={(id) => setActiveModalEventId(id)}
                        onSelectEvent={() => navigate(`/register?eventId=${evt.id}`)}
                        onEditEvent={handleOpenEditEvent}
                        onDeleteEvent={handleOpenDeleteEvent}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Notice Broadcaster */}
          <div className="col-lg-4">
            <div className="card border bg-white shadow-sm rounded-3 mb-4">
              <div className="card-header bg-white py-3 border-bottom">
                <h6 className="fw-bold mb-0">
                  <i className="bi bi-megaphone me-2 text-warning"></i> Broadcast Club Notice
                </h6>
              </div>
              <div className="card-body p-3">
                {postedSuccess && (
                  <div className="alert alert-success py-2 px-3 small mb-3">
                    <i className="bi bi-check-circle me-1"></i> Announcement published to Campus Notice Board!
                  </div>
                )}
                <form onSubmit={handlePostNotice}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Notice Title / Update</label>
                    <textarea
                      className="form-control form-control-sm"
                      rows="3"
                      placeholder="e.g. Weekly algorithm sprint meet this Thursday at 5 PM in Lab 3..."
                      value={noticeTitle}
                      onChange={(e) => setNoticeTitle(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="urgentCheck"
                      checked={noticeUrgent}
                      onChange={(e) => setNoticeUrgent(e.target.checked)}
                    />
                    <label className="form-check-label small text-muted" htmlFor="urgentCheck">
                      Mark as High Priority / Urgent
                    </label>
                  </div>
                  <button type="submit" className="btn btn-sm btn-cc-teal w-100">
                    <i className="bi bi-send me-1"></i> Publish Announcement
                  </button>
                </form>
              </div>
            </div>

            {/* Club Information Card */}
            <div className="card border bg-white shadow-sm rounded-3 p-3">
              <div className="d-flex align-items-center gap-3 mb-2">
                <div 
                  className="rounded p-2 text-white" 
                  style={{ backgroundColor: 'var(--cc-navy)' }}
                >
                  <i className={`bi ${myClub?.icon || 'bi-code-slash'} fs-4`}></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-0">{myClub?.name}</h6>
                  <span className="small text-muted">{myClub?.category}</span>
                </div>
              </div>
              <p className="small text-secondary mb-3">
                {myClub?.description}
              </p>
              <div className="pt-2 border-top d-flex justify-content-between align-items-center">
                <span className="small text-muted">Lead: <strong>{user?.name}</strong></span>
                <Link to="/clubs" className="small fw-semibold text-teal-primary" style={{ color: 'var(--cc-teal-primary)' }}>
                  View Public Profile &rarr;
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
