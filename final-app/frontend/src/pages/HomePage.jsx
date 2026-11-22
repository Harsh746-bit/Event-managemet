import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import FeaturedEvents from '../components/FeaturedEvents';
import EventCategories from '../components/EventCategories';
import HowItWorks from '../components/HowItWorks';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { setActiveModalEventId } = useEvents();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSelectCategory = (category) => {
    navigate(`/events?category=${encodeURIComponent(category)}`);
  };

  const handleSelectEvent = (eventId) => {
    navigate(`/register?eventId=${encodeURIComponent(eventId)}`);
  };

  return (
    <div>
      <Hero onOpenModal={(id) => setActiveModalEventId(id)} />

      <FeaturedEvents
        onOpenModal={(id) => setActiveModalEventId(id)}
        onSelectEvent={handleSelectEvent}
      />

      <EventCategories
        activeCategory="All"
        onSelectCategory={handleSelectCategory}
      />

      <HowItWorks />

      {/* Role-oriented CTA banner */}
      <section className="container py-5">
        <div className="p-4 p-md-5 rounded-3 border bg-white shadow-sm">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <span className="cc-tag cc-tag-teal mb-2">Role-Based Campus Portal</span>
              <h3 className="fw-bold mb-2">Designed for Students and Campus Administrators</h3>
              <p className="text-secondary mb-0">
                Switch seamlessly between discovering events as a student and managing live schedules, seat quotas, and registrations as an administrator.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end d-flex gap-2 justify-content-lg-end flex-wrap">
              {isAdmin ? (
                <button 
                  className="btn btn-cc-navy" 
                  onClick={() => navigate('/admin/dashboard')}
                >
                  <i className="bi bi-speedometer2 me-1"></i> Admin Console
                </button>
              ) : (
                <button 
                  className="btn btn-cc-navy" 
                  onClick={() => navigate('/login')}
                >
                  <i className="bi bi-shield-lock me-1"></i> Administrator Login
                </button>
              )}
              <button 
                className="btn btn-cc-teal" 
                onClick={() => navigate('/events')}
              >
                <i className="bi bi-calendar-event me-1"></i> Browse All Events
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
