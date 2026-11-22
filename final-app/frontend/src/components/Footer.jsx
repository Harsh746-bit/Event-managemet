import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="cc-footer">
      <div className="container">
        <div className="row g-4 justify-content-between">
          <div className="col-lg-4">
            <div className="footer-brand">
              <i className="bi bi-mortarboard-fill me-2" style={{ color: 'var(--cc-teal-accent)' }}></i>
              Campus<span>Connect</span>
            </div>
            <div className="small text-light mb-3">"Find Your Place on Campus."</div>
            <p className="small text-secondary">
              Centralized platform empowering university students to discover flagship events, join student communities, register for workshops, and track credentials.
            </p>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <div className="footer-title">EXPLORE</div>
            <ul className="footer-links">
              <li><Link to="/events">Upcoming Events</Link></li>
              <li><Link to="/clubs">Student Clubs</Link></li>
              <li><Link to="/announcements">Announcements</Link></li>
              <li><Link to="/">Featured Showcase</Link></li>
            </ul>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <div className="footer-title">COMMUNITY</div>
            <ul className="footer-links">
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/my-passes">My Passes</Link></li>
              <li><Link to="/clubs">Clubs Directory</Link></li>
              <li><Link to="/login">Role Switcher</Link></li>
            </ul>
          </div>
          <div className="col-md-4 col-lg-3">
            <div className="footer-title">ARCHITECTURE</div>
            <p className="small text-secondary mb-1">
              <strong>Stack:</strong> React 18 + Bootstrap 5 + Express + MongoDB
            </p>
            <p className="small text-secondary mb-0">
              Role-Based Access Control (RBAC), Multi-Page Routing, RESTful CRUD APIs
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <div>&copy; 2026 CampusConnect. Smart Campus Engagement & Event Management Platform.</div>
          <div>Role-Based Access Control & Multi-Page Architecture.</div>
        </div>
      </div>
    </footer>
  );
}
