import React from 'react';

export default function Navbar({ activePassCount, onNavigate }) {
  return (
    <nav className="navbar navbar-expand-lg cc-navbar sticky-top">
      <div className="container">
        <a className="cc-brand" href="#home" onClick={() => onNavigate && onNavigate('home')}>
          <div className="cc-brand-icon">
            <i className="bi bi-mortarboard-fill"></i>
          </div>
          Campus<span>Connect</span>
        </a>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#reactNavbarContent"
        >
          <i className="bi bi-list fs-2 text-dark"></i>
        </button>

        <div className="collapse navbar-collapse" id="reactNavbarContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-1">
            <li className="nav-item">
              <a className="nav-link cc-nav-link active" href="#home"><i className="bi bi-house me-1"></i> Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link cc-nav-link" href="#events"><i className="bi bi-calendar-event me-1"></i> Events</a>
            </li>
            <li className="nav-item">
              <a className="nav-link cc-nav-link" href="#clubs"><i className="bi bi-people me-1"></i> Clubs</a>
            </li>
            <li className="nav-item">
              <a className="nav-link cc-nav-link" href="#announcements"><i className="bi bi-megaphone me-1"></i> Announcements</a>
            </li>
            <li className="nav-item">
              <a className="nav-link cc-nav-link" href="#my-registrations">
                <i className="bi bi-ticket-perforated me-1"></i> My Registrations
                {activePassCount > 0 && (
                  <span className="badge bg-teal-primary ms-1" style={{ backgroundColor: 'var(--cc-teal-primary)' }}>{activePassCount}</span>
                )}
              </a>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            <a href="#register" className="btn btn-cc-outline"><i className="bi bi-pencil-square"></i> Register</a>
            <a href="#events" className="btn btn-cc-teal"><i className="bi bi-compass"></i> Explore Events</a>
          </div>
        </div>
      </div>
    </nav>
  );
}
