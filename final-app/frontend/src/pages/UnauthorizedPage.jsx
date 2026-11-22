import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UnauthorizedPage() {
  const { user, switchRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const attemptedPath = location.state?.attemptedPath || 'a restricted administrator resource';

  return (
    <div className="container py-5 my-5 text-center">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="p-4 p-md-5 bg-white border rounded-3 shadow-sm">
            <div 
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
              style={{ width: '80px', height: '80px', backgroundColor: '#FEE2E2', color: 'var(--cc-error)' }}
            >
              <i className="bi bi-shield-x fs-1"></i>
            </div>
            
            <span className="badge bg-danger-subtle text-danger border border-danger-subtle mb-2 px-3 py-1">
              403 Access Denied
            </span>

            <h2 className="fw-bold mb-2">Restricted Route</h2>
            
            <p className="text-secondary mb-4">
              Your current role (<strong>{user?.role || 'Guest'}</strong>) does not have authorization to view <code>{attemptedPath}</code>. This area requires Administrator privileges.
            </p>

            <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
              <Link to="/events" className="btn btn-cc-teal">
                <i className="bi bi-compass me-1"></i> Return to Events
              </Link>
              <button 
                type="button" 
                className="btn btn-cc-navy"
                onClick={() => {
                  switchRole('admin');
                  navigate('/admin/dashboard');
                }}
              >
                <i className="bi bi-shield-lock me-1"></i> Switch to Admin Persona
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
