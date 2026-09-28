import React from 'react';

export default function Footer() {
  return (
    <footer className="cc-footer">
      <div className="container">
        <div className="row g-4 justify-content-between">
          <div className="col-lg-4">
            <div className="footer-brand">
              <i className="bi bi-mortarboard-fill me-2" style={{ color: 'var(--cc-teal-accent)' }}></i>Campus<span>Connect</span>
            </div>
            <div className="small text-light mb-3">"Find Your Place on Campus."</div>
            <p className="small text-secondary">
              Centralized platform empowering university students to discover flagship events, join student communities, register for workshops, and track credentials.
            </p>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <div className="footer-title">EXPLORE</div>
            <ul className="footer-links">
              <li><a href="#events">Upcoming Events</a></li>
              <li><a href="#clubs">Student Clubs</a></li>
              <li><a href="#announcements">Announcements</a></li>
              <li><a href="#featured">Featured Showcase</a></li>
            </ul>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <div className="footer-title">COMMUNITY</div>
            <ul className="footer-links">
              <li><a href="#register">Register</a></li>
              <li><a href="#my-registrations">My Passes</a></li>
              <li><a href="#clubs">Coding Club</a></li>
              <li><a href="#clubs">Robotics Society</a></li>
            </ul>
          </div>
          <div className="col-md-4 col-lg-3">
            <div className="footer-title">ARCHITECTURE</div>
            <p className="small text-secondary mb-1">
              <strong>Stack:</strong> React 18 + Bootstrap 5 + Express + Node.js
            </p>
            <p className="small text-secondary mb-0">
              RESTful API, JSON Storage, Client & Server-side Validation
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <div>&copy; 2026 CampusConnect. Smart Campus Engagement & Event Management Platform.</div>
          <div>Deep Navy + Ivory + Teal Design System.</div>
        </div>
      </div>
    </footer>
  );
}
