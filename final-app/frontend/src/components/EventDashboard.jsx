import React from 'react';
import FilterBar from './FilterBar';
import EventCard from './EventCard';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorState from './ErrorState';

export default function EventDashboard({
  statistics,
  events,
  isLoading,
  error,
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  onResetFilters,
  onOpenModal,
  onSelectEvent,
  onCreateEvent,
  onEditEvent,
  onDeleteEvent,
  onRetry
}) {
  return (
    <div>
      {/* STATS BANNER */}
      <section className="container py-5">
        <div className="stats-banner">
          <div className="row g-4 align-items-center">
            <div className="col-6 col-lg-3">
              <div className="stat-item">
                <div className="stat-value">{statistics ? statistics.totalEvents : (events ? events.length : 8)}</div>
                <div className="stat-label">Events This Semester</div>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="stat-item">
                <div className="stat-value">{statistics ? statistics.activeClubs : 32}</div>
                <div className="stat-label">Active Student Clubs</div>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="stat-item">
                <div className="stat-value">{statistics ? statistics.totalRegistrations + "+" : "724+"}</div>
                <div className="stat-label">Student Registrations</div>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="stat-item">
                <div className="stat-value">{statistics ? statistics.eventsThisWeek : 18}</div>
                <div className="stat-label">Events This Week</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EVENT DIRECTORY */}
      <section className="cc-section pt-0" id="events">
        <div className="container">
          <div className="row mb-4 align-items-end">
            <div className="col-lg-6">
              <div className="cc-eyebrow">REST & MongoDB Connected Directory</div>
              <h2 className="cc-section-title">EXPLORE EVENTS</h2>
              <p className="cc-section-sub mb-0">Search, filter, create, and manage campus activities in real-time.</p>
            </div>
            <div className="col-lg-6 text-lg-end mt-3 mt-lg-0 d-flex justify-content-lg-end align-items-center gap-2">
              <button className="btn btn-sm btn-cc-outline" onClick={onResetFilters}>
                <i className="bi bi-arrow-counterclockwise me-1"></i> Reset Filters
              </button>
              {onCreateEvent && (
                <button className="btn btn-sm btn-cc-teal" onClick={onCreateEvent}>
                  <i className="bi bi-plus-circle me-1"></i> Add Event
                </button>
              )}
            </div>
          </div>

          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            activeCategory={activeCategory}
            onCategoryChange={onCategoryChange}
            onReset={onResetFilters}
          />

          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorState message={error} onRetry={onRetry} />
          ) : events.length === 0 ? (
            <div className="text-center py-5 bg-white border rounded">
              <i className="bi bi-search fs-1 text-muted"></i>
              <h4 className="fw-bold mt-3 mb-1">NO EVENTS FOUND</h4>
              <p className="text-muted mb-3">We couldn't find events matching your active filters or search term.</p>
              <div className="d-flex justify-content-center gap-2">
                <button className="btn btn-cc-outline" onClick={onResetFilters}>Clear Filters</button>
                {onCreateEvent && (
                  <button className="btn btn-cc-teal" onClick={onCreateEvent}>
                    <i className="bi bi-plus-lg me-1"></i> Create First Event
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {events.map((evt) => (
                <EventCard
                  key={evt.id || evt._id}
                  event={evt}
                  onOpenModal={onOpenModal}
                  onSelectEvent={onSelectEvent}
                  onEditEvent={onEditEvent}
                  onDeleteEvent={onDeleteEvent}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
