import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import FilterBar from '../../components/FilterBar';
import EventCard from '../../components/EventCard';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import ErrorState from '../../components/ErrorState';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';

export default function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const {
    events,
    isLoading,
    error,
    statistics,
    loadEvents,
    setActiveModalEventId,
    handleOpenCreateEvent,
    handleOpenEditEvent,
    handleOpenDeleteEvent
  } = useEvents();

  const initialCat = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  useEffect(() => {
    loadEvents(activeCategory, searchQuery);
  }, [activeCategory, searchQuery, loadEvents]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (cat === 'All') next.delete('category');
      else next.set('category', cat);
      return next;
    });
  };

  const handleSearchChange = (q) => {
    setSearchQuery(q);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (!q.trim()) next.delete('search');
      else next.set('search', q.trim());
      return next;
    });
  };

  const handleResetFilters = () => {
    setActiveCategory('All');
    setSearchQuery('');
    setSearchParams({});
  };

  const handleSelectEvent = (eventId) => {
    navigate(`/register?eventId=${encodeURIComponent(eventId)}`);
  };

  return (
    <div>
      {/* Page Header / Stats Banner */}
      <section className="container pt-4 pb-2">
        <div className="stats-banner mb-4">
          <div className="row g-4 align-items-center">
            <div className="col-6 col-lg-3">
              <div className="stat-item">
                <div className="stat-value">{statistics ? statistics.totalEvents : events.length}</div>
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

      {/* Main Directory */}
      <section className="cc-section pt-0">
        <div className="container">
          <div className="row mb-4 align-items-end">
            <div className="col-lg-7">
              <div className="cc-eyebrow">Campus Event Directory</div>
              <h2 className="cc-section-title">EXPLORE EVENTS</h2>
              <p className="cc-section-sub mb-0">
                Discover workshops, competitions, cultural galas, and tech sprints with real-time seat availability.
              </p>
            </div>
            <div className="col-lg-5 text-lg-end mt-3 mt-lg-0 d-flex justify-content-lg-end align-items-center gap-2">
              <button className="btn btn-sm btn-cc-outline" onClick={handleResetFilters}>
                <i className="bi bi-arrow-counterclockwise me-1"></i> Reset Filters
              </button>
              {isAdmin && (
                <button className="btn btn-sm btn-cc-teal" onClick={handleOpenCreateEvent}>
                  <i className="bi bi-plus-circle me-1"></i> Add Event
                </button>
              )}
            </div>
          </div>

          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            onReset={handleResetFilters}
          />

          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorState message={error} onRetry={() => loadEvents(activeCategory, searchQuery)} />
          ) : events.length === 0 ? (
            <div className="text-center py-5 bg-white border rounded">
              <i className="bi bi-search fs-1 text-muted"></i>
              <h4 className="fw-bold mt-3 mb-1">NO EVENTS FOUND</h4>
              <p className="text-muted mb-3">We couldn't find events matching your active filters or search term.</p>
              <div className="d-flex justify-content-center gap-2">
                <button className="btn btn-cc-outline" onClick={handleResetFilters}>Clear Filters</button>
                {isAdmin && (
                  <button className="btn btn-cc-teal" onClick={handleOpenCreateEvent}>
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
                  onOpenModal={(id) => setActiveModalEventId(id)}
                  onSelectEvent={handleSelectEvent}
                  onEditEvent={isAdmin ? handleOpenEditEvent : null}
                  onDeleteEvent={isAdmin ? handleOpenDeleteEvent : null}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
