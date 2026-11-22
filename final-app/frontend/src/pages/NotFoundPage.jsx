import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container py-5 my-5 text-center">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="p-4 p-md-5 bg-white border rounded-3 shadow-sm">
            <h1 className="fw-black text-muted display-1 mb-2" style={{ fontWeight: 800 }}>404</h1>
            <h3 className="fw-bold mb-2">Page Not Found</h3>
            <p className="text-secondary mb-4">
              The campus page or resource you are looking for does not exist or has been relocated.
            </p>
            <div className="d-flex justify-content-center gap-2">
              <Link to="/" className="btn btn-cc-outline">
                <i className="bi bi-house me-1"></i> Home
              </Link>
              <Link to="/events" className="btn btn-cc-teal">
                <i className="bi bi-compass me-1"></i> Browse Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
