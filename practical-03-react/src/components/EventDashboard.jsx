import React from 'react';
import FilterBar from './FilterBar';
import EventCard from './EventCard';

export default function EventDashboard({
  events,
  filteredEvents,
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  onResetFilters,
  onOpenModal,
  onSelectEvent
}) {
  const totalRegistrations = events.reduce((sum, e) => sum + e.registered, 0);

  return (
    <div>
      {/* STATS BANNER */}
      <section className="container py-5">
        <div className="stats-banner">
          <div className="row g-4 align-items-center">
            <div className="col-6 col-lg-3">
              <div className="stat-item">
                <div className="stat-value">{events.length}</div>
                <div className="stat-label">Events This Semester</div>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="stat-item">
                <div className="stat-value">32</div>
                <div className="stat-label">Active Student Clubs</div>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="stat-item">
                <div className="stat-value">{totalRegistrations}+</div>
                <div className="stat-label">Student Registrations</div>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="stat-item">
                <div className="stat-value">18</div>
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
              <div className="cc-eyebrow">Event Directory</div>
              <h2 className="cc-section-title">EXPLORE EVENTS</h2>
              <p className="cc-section-sub mb-0">Search and filter campus activities by category or keyword.</p>
            </div>
            <div className="col-lg-6 text-lg-end mt-3 mt-lg-0">
              <button className="btn btn-sm btn-cc-outline" onClick={onResetFilters}>
                <i className="bi bi-arrow-counterclockwise me-1"></i> Reset Filters
              </button>
            </div>
          </div>

          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            activeCategory={activeCategory}
            onCategoryChange={onCategoryChange}
            onReset={onResetFilters}
          />

          {filteredEvents.length === 0 ? (
            <div className="text-center py-5 bg-white border rounded">
              <i className="bi bi-search fs-1 text-muted"></i>
              <h4 className="fw-bold mt-3 mb-1">NO EVENTS FOUND</h4>
              <p className="text-muted mb-3">We couldn't find events matching your active filters or search term.</p>
              <button className="btn btn-cc-teal" onClick={onResetFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="row g-4">
              {filteredEvents.map(evt => (
                <EventCard
                  key={evt.id}
                  event={evt}
                  onOpenModal={onOpenModal}
                  onSelectEvent={onSelectEvent}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
