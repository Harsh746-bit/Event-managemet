import React from 'react';

export default function Hero({ onOpenModal }) {
  return (
    <header className="cc-hero" id="home">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <div className="cc-eyebrow">Campus Engagement / 2026</div>
            <h1 className="cc-hero-title">FIND YOUR PLACE<br />ON CAMPUS.</h1>
            <p className="cc-hero-desc">
              Discover upcoming campus events, student communities, technical workshops, and premier experiences powered by our university full-stack platform.
            </p>
            <div className="d-flex flex-wrap gap-3 mb-4">
              <a href="#events" className="btn btn-cc-teal btn-lg"><i className="bi bi-compass"></i> Explore Events</a>
              <a href="#clubs" className="btn btn-cc-navy btn-lg"><i className="bi bi-people"></i> Join a Community</a>
            </div>
            <div className="d-flex align-items-center gap-4 text-muted pt-2">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-hdd-network-fill text-teal-primary" style={{ color: 'var(--cc-teal-primary)' }}></i>
                <span className="small fw-semibold text-dark">Express REST API Connected</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-shield-check text-success"></i>
                <span className="small fw-semibold text-dark">Instant Seat Allocation</span>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="hero-composition">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <span className="cc-tag cc-tag-teal"><i className="bi bi-stars"></i> Flagship Showcase</span>
                <span className="cc-tag cc-tag-open">Live REST Sync</span>
              </div>
              <div className="d-flex gap-3 align-items-start mb-3">
                <div className="hero-date-badge">
                  <div className="day">24</div>
                  <div className="month">OCT</div>
                </div>
                <div>
                  <span className="text-uppercase fw-bold small text-muted">Technology</span>
                  <h3 className="fw-bold mb-1" style={{ fontSize: '1.4rem' }}>TechSprint 2026</h3>
                  <p className="small text-muted mb-0"><i className="bi bi-geo-alt me-1"></i> Innovation Lab, Tech Block</p>
                </div>
              </div>
              <p className="small text-secondary mb-3">
                24-hour student hackathon focused on building high-impact software, AI systems, and IoT prototypes.
              </p>
              <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                <span className="small fw-semibold text-dark"><i className="bi bi-people me-1 text-teal-primary" style={{ color: 'var(--cc-teal-primary)' }}></i> 72 / 100 Seats Filled</span>
                <button
                  type="button"
                  className="btn btn-sm btn-cc-teal"
                  onClick={() => onOpenModal && onOpenModal("EVT-1001")}
                >
                  View Event <i className="bi bi-arrow-right ms-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
