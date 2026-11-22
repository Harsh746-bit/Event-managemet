import React, { useState } from 'react';
import { useEvents } from '../../context/EventContext';
import FilterBar from '../../components/FilterBar';

export default function AdminEventsPage() {
  const {
    events,
    handleOpenCreateEvent,
    handleOpenEditEvent,
    handleOpenDeleteEvent,
    setActiveModalEventId
  } = useEvents();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  const filteredEvents = events.filter(e => {
    const matchesCategory = activeCategory === 'All' || e.category === activeCategory;
    const matchesSearch = !searchQuery.trim() ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.department?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
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
              <span className="text-secondary small">Event Scheduling & Capacity Management</span>
            </div>
            <h2 className="cc-section-title mb-1">EVENT MANAGEMENT STUDIO</h2>
            <p className="text-secondary mb-0">
              Create new campus activities, update event venues and schedules, or adjust attendee seat quotas.
            </p>
          </div>
          <div className="col-lg-5 text-lg-end mt-3 mt-lg-0 d-flex justify-content-lg-end align-items-center gap-2">
            <div className="btn-group">
              <button
                type="button"
                className={`btn btn-sm ${viewMode === 'table' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                onClick={() => setViewMode('table')}
                title="Table View"
              >
                <i className="bi bi-table"></i>
              </button>
              <button
                type="button"
                className={`btn btn-sm ${viewMode === 'grid' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                onClick={() => setViewMode('grid')}
                title="Card Grid View"
              >
                <i className="bi bi-grid-3x3-gap"></i>
              </button>
            </div>
            <button className="btn btn-cc-teal" onClick={handleOpenCreateEvent}>
              <i className="bi bi-plus-lg me-1"></i> Create New Event
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
          activeCategory={activeCategory}
          onCategoryChange={(c) => setActiveCategory(c)}
          onReset={() => {
            setSearchQuery('');
            setActiveCategory('All');
          }}
        />

        {/* Table View */}
        {viewMode === 'table' ? (
          <div className="card border bg-white shadow-sm rounded-3">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.9rem' }}>
                <thead className="table-light">
                  <tr>
                    <th>Event Details</th>
                    <th>Category</th>
                    <th>Date & Time</th>
                    <th>Location</th>
                    <th>Capacity / Registered</th>
                    <th>Status</th>
                    <th className="text-end">Controls</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-muted">
                        <i className="bi bi-search fs-3 d-block mb-2"></i>
                        No events match the current filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredEvents.map(evt => {
                      const available = evt.capacity - evt.registered;
                      const isFull = available <= 0;
                      const percentage = Math.round((evt.registered / evt.capacity) * 100);

                      return (
                        <tr key={evt.id}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div>
                                <span className="badge bg-light text-dark border px-2 py-0 small me-1">
                                  {evt.id}
                                </span>
                                <span className="fw-bold text-dark">{evt.title}</span>
                              </div>
                            </div>
                            <div className="small text-muted text-truncate" style={{ maxWidth: '300px' }}>
                              {evt.description}
                            </div>
                          </td>
                          <td>
                            <span className="cc-tag cc-tag-teal">{evt.category}</span>
                          </td>
                          <td>
                            <div className="fw-semibold text-dark">{evt.date}</div>
                            <div className="small text-muted">{evt.time}</div>
                          </td>
                          <td>
                            <span className="text-secondary small">
                              <i className="bi bi-geo-alt me-1"></i>{evt.location}
                            </span>
                          </td>
                          <td style={{ minWidth: '140px' }}>
                            <div className="d-flex justify-content-between small mb-1">
                              <span><strong>{evt.registered}</strong> / {evt.capacity}</span>
                              <span className={isFull ? 'text-danger fw-bold' : 'text-muted'}>
                                {isFull ? 'Full' : `${available} left`}
                              </span>
                            </div>
                            <div className="progress" style={{ height: '6px' }}>
                              <div
                                className={`progress-bar ${isFull ? 'bg-danger' : 'bg-teal-primary'}`}
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: isFull ? undefined : 'var(--cc-teal-primary)'
                                }}
                              ></div>
                            </div>
                          </td>
                          <td>
                            <span className={`cc-tag ${isFull ? 'cc-tag-closed' : 'cc-tag-open'}`}>
                              {isFull ? 'Full' : evt.status || 'Active'}
                            </span>
                          </td>
                          <td className="text-end">
                            <div className="btn-group btn-group-sm">
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                title="Inspect Preview"
                                onClick={() => setActiveModalEventId(evt.id)}
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                title="Edit Event (PUT)"
                                onClick={() => handleOpenEditEvent(evt)}
                              >
                                <i className="bi bi-pencil-square"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                title="Delete Event (DELETE)"
                                onClick={() => handleOpenDeleteEvent(evt)}
                              >
                                <i className="bi bi-trash3"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="card-footer bg-white py-3 border-top d-flex justify-content-between align-items-center">
              <span className="small text-muted">
                Showing {filteredEvents.length} events
              </span>
              <button className="btn btn-sm btn-cc-teal" onClick={handleOpenCreateEvent}>
                <i className="bi bi-plus-circle me-1"></i> Add Another Event
              </button>
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className="row g-4">
            {filteredEvents.map(evt => {
              const available = evt.capacity - evt.registered;
              const isFull = available <= 0;
              return (
                <div key={evt.id} className="col-md-6 col-lg-4">
                  <div className="card h-100 p-4 border bg-white shadow-sm rounded-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge bg-light text-dark border">{evt.id}</span>
                      <span className="cc-tag cc-tag-teal">{evt.category}</span>
                    </div>
                    <h5 className="fw-bold mb-2">{evt.title}</h5>
                    <p className="small text-muted mb-3 flex-grow-1">{evt.description}</p>
                    <div className="small text-secondary mb-2">
                      <i className="bi bi-geo-alt me-1"></i> {evt.location}
                    </div>
                    <div className="small text-secondary mb-3">
                      <i className="bi bi-calendar me-1"></i> {evt.date} at {evt.time}
                    </div>
                    <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                      <span className="small fw-semibold">
                        {evt.registered} / {evt.capacity} registered
                      </span>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleOpenEditEvent(evt)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleOpenDeleteEvent(evt)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
