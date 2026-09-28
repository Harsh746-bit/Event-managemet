import React from 'react';

export default function FeaturedEvents({ onOpenModal, onSelectEvent }) {
  return (
    <section className="cc-section bg-white border-top border-bottom" id="featured">
      <div className="container">
        <div className="row mb-5 align-items-end">
          <div className="col-md-8">
            <div className="cc-eyebrow">Curated Selection</div>
            <h2 className="cc-section-title">WHAT'S HAPPENING ON CAMPUS</h2>
            <p className="cc-section-sub mb-0">A selection of flagship experiences and high-impact workshops worth showing up for.</p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <a href="#events" className="btn btn-cc-outline">View All Events <i className="bi bi-arrow-right ms-1"></i></a>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="editorial-hero-box">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="cc-tag cc-tag-teal">Flagship Hackathon</span>
                  <span className="cc-tag cc-tag-open">Registration Open</span>
                </div>
                <div className="mb-3">
                  <span className="text-teal-accent text-uppercase fw-bold small" style={{ color: 'var(--cc-teal-accent)' }}>Technology Department</span>
                  <h3 className="mt-1 mb-3">TechSprint 2026: The 24-Hour Innovation Marathon</h3>
                  <p>
                    Join 100+ multidisciplinary students to design, develop, and pitch transformative software applications and smart engineering solutions under mentorship from industry leaders.
                  </p>
                </div>
              </div>
              <div className="pt-4 border-top border-secondary border-opacity-25 d-flex flex-wrap justify-content-between align-items-center gap-3">
                <div className="d-flex align-items-center gap-4 text-light small">
                  <div><i className="bi bi-calendar-check me-1" style={{ color: 'var(--cc-teal-accent)' }}></i> Oct 24, 2026</div>
                  <div><i className="bi bi-clock me-1" style={{ color: 'var(--cc-teal-accent)' }}></i> 09:00 AM</div>
                  <div><i className="bi bi-geo-alt me-1" style={{ color: 'var(--cc-teal-accent)' }}></i> Innovation Lab</div>
                </div>
                <button
                  className="btn btn-cc-teal"
                  onClick={() => onOpenModal && onOpenModal("EVT-1001")}
                >
                  Explore Event <i className="bi bi-arrow-up-right ms-1"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-4 d-flex flex-column gap-4">
            <div className="supporting-event-card">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="cc-tag cc-tag-upcoming">Workshop</span>
                <span className="small fw-bold text-muted">28 OCT</span>
              </div>
              <h5 className="fw-bold mb-2">Design Thinking & Product UX</h5>
              <p className="small text-muted mb-3">Learn user research and low-fidelity wireframing with Figma.</p>
              <div className="d-flex justify-content-between align-items-center pt-2 border-top border-light">
                <span className="small text-slate"><i className="bi bi-geo-alt me-1"></i> Studio B</span>
                <button
                  className="btn btn-sm btn-cc-outline"
                  onClick={() => onSelectEvent && onSelectEvent("EVT-1002")}
                >
                  Register
                </button>
              </div>
            </div>

            <div className="supporting-event-card">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="cc-tag cc-tag-open">Cultural</span>
                <span className="small fw-bold text-muted">02 NOV</span>
              </div>
              <h5 className="fw-bold mb-2">Annual Campus Cultural Gala</h5>
              <p className="small text-muted mb-3">An evening of student band performances, theatre, and visual arts.</p>
              <div className="d-flex justify-content-between align-items-center pt-2 border-top border-light">
                <span className="small text-slate"><i className="bi bi-geo-alt me-1"></i> Open Air Amphitheatre</span>
                <button
                  className="btn btn-sm btn-cc-outline"
                  onClick={() => onSelectEvent && onSelectEvent("EVT-1003")}
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
