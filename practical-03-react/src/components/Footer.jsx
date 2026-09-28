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
              Centralized platform for university event discovery and student engagement. Built to demonstrate React functional components, hooks, props, state, and client-side validation.
            </p>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <div className="footer-title">EXPLORE</div>
            <ul className="footer-links">
              <li><a href="#events">Events</a></li>
              <li><a href="#clubs">Clubs</a></li>
              <li><a href="#announcements">Announcements</a></li>
            </ul>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <div className="footer-title">COMMUNITY</div>
            <ul className="footer-links">
              <li><a href="#register">Register</a></li>
              <li><a href="#my-registrations">My Passes</a></li>
            </ul>
          </div>
          <div className="col-md-4 col-lg-3">
            <div className="footer-title">PRACTICAL DETAILS</div>
            <p className="small text-secondary mb-1">
              <strong>Practical No. 03:</strong> ReactJS Framework
            </p>
            <p className="small text-secondary mb-0">
              Components, Props, State, useState, useEffect, Controlled Forms & Validation
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <div>&copy; 2026 CampusConnect. Web Technology Practical No. 03.</div>
          <div>Deep Navy + Ivory + Teal Palette.</div>
        </div>
      </div>
    </footer>
  );
}
