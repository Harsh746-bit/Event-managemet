import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth, MASTER_ADMIN } from '../context/AuthContext';

export default function LoginPage() {
  const { loginWithCredentials, registerStudent, registerOrganizer, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Signup form state
  const [signupRole, setSignupRole] = useState('student'); // 'student' or 'organizer'
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '',
    clubName: '',
    department: 'Computer Science',
    year: '3rd Year'
  });

  const from = location.state?.from?.pathname;

  const getDashboardForRole = (role) => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'organizer') return '/organizer/dashboard';
    return '/events';
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (!email.trim()) {
        throw new Error('Please enter your university email address.');
      }
      const loggedIn = loginWithCredentials(email, password);
      const target = from || getDashboardForRole(loggedIn.role);
      navigate(target, { replace: true });
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleQuickDemoLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('demo123');
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const loggedIn = loginWithCredentials(demoEmail, 'demo123');
      const target = from || getDashboardForRole(loggedIn.role);
      navigate(target, { replace: true });
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (!signupData.name.trim() || !signupData.email.trim()) {
        throw new Error('Please fill in your name and university email.');
      }

      if (signupRole === 'student') {
        const newStu = registerStudent(signupData);
        setSuccessMessage(`Welcome, ${newStu.name}! Your student account has been created.`);
        setTimeout(() => {
          navigate(from || '/events', { replace: true });
        }, 800);
      } else {
        // Club Organizer Application
        if (!signupData.clubName.trim()) {
          throw new Error('Please specify your student club or society name.');
        }
        const newOrg = registerOrganizer(signupData);
        setSuccessMessage(
          `Application Submitted for "${newOrg.clubName}"! As a Club Organizer, your account is currently PENDING verification from the Master Administrator. You can log in once approved.`
        );
        setActiveTab('login');
        setEmail(newOrg.email);
      }
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--cc-ivory)', minHeight: '85vh' }}>
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-9 col-xl-8">
            
            {/* Header */}
            <div className="text-center mb-4">
              <div 
                className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle mb-3 shadow-sm" 
                style={{ backgroundColor: 'var(--cc-navy)', color: 'var(--cc-teal-accent)' }}
              >
                <i className="bi bi-mortarboard-fill fs-2"></i>
              </div>
              <h2 className="fw-bold mb-1">CampusConnect Portal Access</h2>
              <p className="text-secondary mx-auto" style={{ maxWidth: '540px', fontSize: '0.95rem' }}>
                Sign in to your university account or register. Only approved club leads and authorized members can access event operations.
              </p>
              {location.state?.from && (
                <div className="alert alert-warning d-inline-block py-2 px-3 small mt-1">
                  <i className="bi bi-shield-lock me-1"></i>
                  Please sign in to access <code>{location.state.from.pathname}</code>
                </div>
              )}
            </div>

            {/* Error or Success Notice */}
            {errorMessage && (
              <div className="alert alert-danger d-flex align-items-start gap-2 mb-4 p-3 shadow-sm" role="alert">
                <i className="bi bi-shield-x fs-4 text-danger mt-1"></i>
                <div>
                  <h6 className="fw-bold mb-1">Authentication Notice</h6>
                  <div className="small">{errorMessage}</div>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="alert alert-success d-flex align-items-start gap-2 mb-4 p-3 shadow-sm" role="alert">
                <i className="bi bi-check-circle fs-4 text-success mt-1"></i>
                <div>
                  <h6 className="fw-bold mb-1">Status Update</h6>
                  <div className="small">{successMessage}</div>
                </div>
              </div>
            )}

            {/* Main Auth Card */}
            <div className="card border bg-white shadow-sm rounded-3 overflow-hidden mb-4">
              {/* Tabs */}
              <div className="d-flex border-bottom bg-light">
                <button
                  type="button"
                  className={`flex-fill py-3 border-0 fw-semibold text-center ${
                    activeTab === 'login' ? 'bg-white border-bottom border-3 border-teal text-teal-dark fw-bold' : 'text-muted'
                  }`}
                  style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMessage(null);
                  }}
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i> Sign In to Account
                </button>
                <button
                  type="button"
                  className={`flex-fill py-3 border-0 fw-semibold text-center ${
                    activeTab === 'signup' ? 'bg-white border-bottom border-3 border-teal text-teal-dark fw-bold' : 'text-muted'
                  }`}
                  style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                  onClick={() => {
                    setActiveTab('signup');
                    setErrorMessage(null);
                  }}
                >
                  <i className="bi bi-person-plus me-2"></i> Register / Apply
                </button>
              </div>

              <div className="card-body p-4 p-md-5">
                {/* 1. SIGN IN TAB */}
                {activeTab === 'login' ? (
                  <div>
                    <form onSubmit={handleLoginSubmit}>
                      <div className="mb-3">
                        <label className="form-label fw-semibold small">University Email Address *</label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="e.g. aarav@campusconnect.edu or admin@campusconnect.edu"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-semibold small">Password *</label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="••••••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>

                      <button type="submit" className="btn btn-cc-teal w-100 py-2 mb-3">
                        <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
                      </button>
                    </form>

                    {/* Quick Demo Helper Box */}
                    <div className="p-3 bg-light rounded-3 border mt-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="small fw-bold text-uppercase text-secondary" style={{ fontSize: '0.75rem' }}>
                          <i className="bi bi-lightning-charge-fill text-warning me-1"></i> Instant Demo Sign-In
                        </span>
                        <span className="badge bg-secondary-subtle text-dark border small" style={{ fontSize: '0.7rem' }}>
                          RBAC Test Suite
                        </span>
                      </div>
                      <div className="row g-2">
                        <div className="col-sm-6">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-dark w-100 text-start py-2"
                            onClick={() => handleQuickDemoLogin('admin@campusconnect.edu')}
                          >
                            <div className="fw-bold small d-flex align-items-center gap-1">
                              <i className="bi bi-shield-lock-fill text-warning"></i> Master Admin (Single)
                            </div>
                            <div className="text-muted" style={{ fontSize: '0.72rem' }}>admin@campusconnect.edu</div>
                          </button>
                        </div>

                        <div className="col-sm-6">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary w-100 text-start py-2"
                            onClick={() => handleQuickDemoLogin('techclub@campusconnect.edu')}
                          >
                            <div className="fw-bold small d-flex align-items-center gap-1">
                              <i className="bi bi-award-fill text-primary"></i> Approved Club Lead
                            </div>
                            <div className="text-muted" style={{ fontSize: '0.72rem' }}>techclub@campusconnect.edu</div>
                          </button>
                        </div>

                        <div className="col-sm-6">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger w-100 text-start py-2"
                            onClick={() => handleQuickDemoLogin('robotics@campusconnect.edu')}
                            title="Click to test admin approval requirement!"
                          >
                            <div className="fw-bold small d-flex align-items-center gap-1">
                              <i className="bi bi-hourglass-split text-danger"></i> Pending Club Lead (Test Gate)
                            </div>
                            <div className="text-muted" style={{ fontSize: '0.72rem' }}>robotics@campusconnect.edu</div>
                          </button>
                        </div>

                        <div className="col-sm-6">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-success w-100 text-start py-2"
                            onClick={() => handleQuickDemoLogin('aarav@campusconnect.edu')}
                          >
                            <div className="fw-bold small d-flex align-items-center gap-1">
                              <i className="bi bi-person-fill text-success"></i> Campus Student
                            </div>
                            <div className="text-muted" style={{ fontSize: '0.72rem' }}>aarav@campusconnect.edu</div>
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                ) : (
                  /* 2. SIGN UP / APPLY TAB */
                  <div>
                    <div className="mb-4">
                      <label className="form-label fw-bold small text-muted text-uppercase mb-2">Account Type</label>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className={`btn btn-sm flex-fill py-2 ${
                            signupRole === 'student' ? 'btn-dark' : 'btn-outline-secondary'
                          }`}
                          onClick={() => setSignupRole('student')}
                        >
                          <i className="bi bi-person me-1"></i> Campus Student
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm flex-fill py-2 ${
                            signupRole === 'organizer' ? 'btn-primary' : 'btn-outline-secondary'
                          }`}
                          onClick={() => setSignupRole('organizer')}
                        >
                          <i className="bi bi-award me-1"></i> Apply as Club Organizer
                        </button>
                      </div>
                      <div className="small text-muted mt-2">
                        {signupRole === 'student' ? (
                          <span><i className="bi bi-info-circle me-1"></i> Student accounts have instant access to explore, register, and save passes.</span>
                        ) : (
                          <span className="text-warning-emphasis">
                            <i className="bi bi-shield-exclamation me-1"></i> <strong>Important:</strong> Club Organizer accounts require verification and approval by the Master Administrator before login access is granted.
                          </span>
                        )}
                      </div>
                    </div>

                    <form onSubmit={handleSignupSubmit}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold small">Full Name *</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="e.g. Priya Patel"
                            value={signupData.name}
                            onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                            required
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold small">University Email *</label>
                          <input
                            type="email"
                            className="form-control form-control-sm"
                            placeholder="priya@campusconnect.edu"
                            value={signupData.email}
                            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                            required
                          />
                        </div>

                        {signupRole === 'student' ? (
                          <>
                            <div className="col-md-6">
                              <label className="form-label fw-semibold small">PRN / Student ID *</label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="STU2026101"
                                value={signupData.studentId}
                                onChange={(e) => setSignupData({ ...signupData, studentId: e.target.value })}
                                required
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-semibold small">Academic Year</label>
                              <select
                                className="form-select form-select-sm"
                                value={signupData.year}
                                onChange={(e) => setSignupData({ ...signupData, year: e.target.value })}
                              >
                                <option value="1st Year">1st Year</option>
                                <option value="2nd Year">2nd Year</option>
                                <option value="3rd Year">3rd Year</option>
                                <option value="4th Year">4th Year</option>
                              </select>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="col-12">
                              <label className="form-label fw-semibold small">Club / Society Name *</label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="e.g. Photography Club, E-Cell, Robotics Society"
                                value={signupData.clubName}
                                onChange={(e) => setSignupData({ ...signupData, clubName: e.target.value })}
                                required
                              />
                            </div>
                          </>
                        )}

                        <div className="col-md-6">
                          <label className="form-label fw-semibold small">Department</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Computer Engineering"
                            value={signupData.department}
                            onChange={(e) => setSignupData({ ...signupData, department: e.target.value })}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold small">Password *</label>
                          <input
                            type="password"
                            className="form-control form-control-sm"
                            placeholder="••••••••••••"
                            value={signupData.password}
                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                            required
                          />
                        </div>

                        <div className="col-12 pt-2">
                          <button type="submit" className="btn btn-cc-teal w-100 py-2">
                            {signupRole === 'student' ? (
                              <span><i className="bi bi-check2-circle me-1"></i> Complete Student Registration</span>
                            ) : (
                              <span><i className="bi bi-send me-1"></i> Submit Organizer Application (Admin Review)</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center small text-muted">
              <span>Security Policy: Master Administrator account is single and pre-configured.</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
