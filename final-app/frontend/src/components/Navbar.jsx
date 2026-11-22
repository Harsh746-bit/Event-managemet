import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, isStudent, isOrganizer, logout, switchRole } = useAuth();
  const { registrations, dbConnected, handleOpenCreateEvent } = useEvents();
  const navigate = useNavigate();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const activePassCount = registrations.length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg cc-navbar sticky-top">
      <div className="container">
        {/* Brand */}
        <Link className="cc-brand" to={isAdmin ? "/admin/dashboard" : isOrganizer ? "/organizer/dashboard" : "/"}>
          <div className="cc-brand-icon">
            <i className="bi bi-mortarboard-fill"></i>
          </div>
          Campus<span>Connect</span>
        </Link>

        {/* Mobile toggler */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#finalNavbarContent"
          aria-controls="finalNavbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list fs-2 text-dark"></i>
        </button>

        <div className="collapse navbar-collapse" id="finalNavbarContent">
          {/* Navigation Links based on RBAC */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-1">
            {/* Common / Public link */}
            <li className="nav-item">
              <NavLink 
                to="/" 
                end 
                className={({ isActive }) => `nav-link cc-nav-link ${isActive ? 'active' : ''}`}
              >
                <i className="bi bi-house me-1"></i> Home
              </NavLink>
            </li>

            {/* Admin-only Links */}
            {isAdmin && (
              <>
                <li className="nav-item">
                  <NavLink 
                    to="/admin/dashboard" 
                    className={({ isActive }) => `nav-link cc-nav-link ${isActive ? 'active' : ''}`}
                  >
                    <i className="bi bi-speedometer2 me-1"></i> Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    to="/admin/events" 
                    className={({ isActive }) => `nav-link cc-nav-link ${isActive ? 'active' : ''}`}
                  >
                    <i className="bi bi-calendar-check me-1"></i> Manage Events
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    to="/admin/registrations" 
                    className={({ isActive }) => `nav-link cc-nav-link ${isActive ? 'active' : ''}`}
                  >
                    <i className="bi bi-people me-1"></i> Roster
                    {activePassCount > 0 && (
                      <span className="badge ms-1 bg-secondary text-white small">
                        {activePassCount}
                      </span>
                    )}
                  </NavLink>
                </li>
              </>
            )}

            {/* Organizer Links */}
            {isOrganizer && (
              <>
                <li className="nav-item">
                  <NavLink 
                    to="/organizer/dashboard" 
                    className={({ isActive }) => `nav-link cc-nav-link ${isActive ? 'active' : ''}`}
                  >
                    <i className="bi bi-award me-1"></i> Club Hub
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    to="/events" 
                    className={({ isActive }) => `nav-link cc-nav-link ${isActive ? 'active' : ''}`}
                  >
                    <i className="bi bi-calendar-event me-1"></i> All Events
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    to="/clubs" 
                    className={({ isActive }) => `nav-link cc-nav-link ${isActive ? 'active' : ''}`}
                  >
                    <i className="bi bi-people me-1"></i> Societies
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    to="/announcements" 
                    className={({ isActive }) => `nav-link cc-nav-link ${isActive ? 'active' : ''}`}
                  >
                    <i className="bi bi-megaphone me-1"></i> Notices
                  </NavLink>
                </li>
              </>
            )}

            {/* Student Links */}
            {isStudent && (
              <>
                <li className="nav-item">
                  <NavLink 
                    to="/events" 
                    className={({ isActive }) => `nav-link cc-nav-link ${isActive ? 'active' : ''}`}
                  >
                    <i className="bi bi-calendar-event me-1"></i> Events
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    to="/register" 
                    className={({ isActive }) => `nav-link cc-nav-link ${isActive ? 'active' : ''}`}
                  >
                    <i className="bi bi-pencil-square me-1"></i> Register
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    to="/my-passes" 
                    className={({ isActive }) => `nav-link cc-nav-link ${isActive ? 'active' : ''}`}
                  >
                    <i className="bi bi-ticket-perforated me-1"></i> My Passes
                    {activePassCount > 0 && (
                      <span 
                        className="badge ms-1" 
                        style={{ backgroundColor: 'var(--cc-teal-primary)', color: '#fff' }}
                      >
                        {activePassCount}
                      </span>
                    )}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    to="/clubs" 
                    className={({ isActive }) => `nav-link cc-nav-link ${isActive ? 'active' : ''}`}
                  >
                    <i className="bi bi-people me-1"></i> Clubs
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    to="/announcements" 
                    className={({ isActive }) => `nav-link cc-nav-link ${isActive ? 'active' : ''}`}
                  >
                    <i className="bi bi-megaphone me-1"></i> Notices
                  </NavLink>
                </li>
              </>
            )}

            {/* Public Guest Links */}
            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <NavLink 
                    to="/events" 
                    className={({ isActive }) => `nav-link cc-nav-link ${isActive ? 'active' : ''}`}
                  >
                    <i className="bi bi-calendar-event me-1"></i> Events
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    to="/clubs" 
                    className={({ isActive }) => `nav-link cc-nav-link ${isActive ? 'active' : ''}`}
                  >
                    <i className="bi bi-people me-1"></i> Clubs
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    to="/announcements" 
                    className={({ isActive }) => `nav-link cc-nav-link ${isActive ? 'active' : ''}`}
                  >
                    <i className="bi bi-megaphone me-1"></i> Notices
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {/* Right Controls: Role Badge, Quick Switcher, Profile */}
          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0 flex-wrap">
            {(isAdmin || isOrganizer) && (
              <button 
                type="button" 
                className="btn btn-sm btn-cc-teal d-none d-md-inline-flex" 
                onClick={handleOpenCreateEvent}
              >
                <i className="bi bi-plus-lg me-1"></i> Host Event
              </button>
            )}

            {/* Role Switcher Pill for instant demo & testing (Visible when authenticated) */}
            {isAuthenticated && (
              <div className="btn-group position-relative">
                <button
                  type="button"
                  className={`btn btn-sm dropdown-toggle d-flex align-items-center gap-1 ${
                    isAdmin ? 'btn-dark' : isOrganizer ? 'btn-primary' : 'btn-outline-secondary'
                  }`}
                  onClick={() => setIsRoleDropdownOpen(prev => !prev)}
                  aria-expanded={isRoleDropdownOpen}
                  style={{ fontSize: '0.82rem', padding: '0.35rem 0.65rem' }}
                >
                  {isAdmin ? (
                    <>
                      <i className="bi bi-shield-lock-fill text-warning"></i>
                      <span className="fw-bold">Admin Role</span>
                    </>
                  ) : isOrganizer ? (
                    <>
                      <i className="bi bi-award-fill text-warning"></i>
                      <span className="fw-bold">Organizer Role</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-fill text-teal-primary" style={{ color: 'var(--cc-teal-primary)' }}></i>
                      <span className="fw-semibold">Student Role</span>
                    </>
                  )}
                </button>
                <ul className={`dropdown-menu dropdown-menu-end shadow-sm ${isRoleDropdownOpen ? 'show' : ''}`} style={{ fontSize: '0.88rem' }}>
                  <li className="dropdown-header text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>Switch Role</li>
                  <li>
                    <button 
                      className={`dropdown-item d-flex align-items-center gap-2 ${isAdmin ? 'active' : ''}`}
                      onClick={() => {
                        setIsRoleDropdownOpen(false);
                        switchRole('admin');
                        navigate('/admin/dashboard');
                      }}
                    >
                      <i className="bi bi-shield-lock text-warning"></i> Campus Administrator
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`dropdown-item d-flex align-items-center gap-2 ${isOrganizer ? 'active' : ''}`}
                      onClick={() => {
                        setIsRoleDropdownOpen(false);
                        switchRole('organizer');
                        navigate('/organizer/dashboard');
                      }}
                    >
                      <i className="bi bi-award text-primary"></i> Club Organizer
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`dropdown-item d-flex align-items-center gap-2 ${isStudent ? 'active' : ''}`}
                      onClick={() => {
                        setIsRoleDropdownOpen(false);
                        switchRole('student');
                        navigate('/events');
                      }}
                    >
                      <i className="bi bi-person text-teal-primary"></i> Campus Student
                    </button>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link 
                      className="dropdown-item d-flex align-items-center gap-2" 
                      to="/login"
                      onClick={() => setIsRoleDropdownOpen(false)}
                    >
                      <i className="bi bi-box-arrow-in-right"></i> Role Selection Page
                    </Link>
                  </li>
                </ul>
              </div>
            )}

            {/* User Session Profile & Logout */}
            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-2 ms-1">
                <span 
                  className="rounded-circle d-none d-sm-inline-flex align-items-center justify-content-center text-white fw-bold" 
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    fontSize: '0.75rem', 
                    backgroundColor: isAdmin ? 'var(--cc-navy)' : isOrganizer ? '#4338CA' : 'var(--cc-teal-primary)' 
                  }}
                  title={`${user.name} (${user.role})`}
                >
                  {user.avatar || 'CC'}
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                  onClick={handleLogout}
                  title="Sign out"
                  style={{ fontSize: '0.82rem', padding: '0.35rem 0.65rem' }}
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span className="d-none d-sm-inline">Exit</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-sm btn-cc-teal">
                <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
