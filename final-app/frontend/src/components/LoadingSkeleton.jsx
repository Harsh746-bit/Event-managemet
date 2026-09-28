import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="row g-4">
      {[1, 2, 3, 4, 5, 6].map((idx) => (
        <div key={idx} className="col-md-6 col-lg-4">
          <div className="cc-event-card">
            <div>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="skeleton-box" style={{ width: '58px', height: '60px' }}></div>
                <div className="skeleton-box" style={{ width: '80px', height: '24px' }}></div>
              </div>
              <div className="skeleton-box mb-2" style={{ width: '85%', height: '22px' }}></div>
              <div className="skeleton-box mb-2" style={{ width: '100%', height: '16px' }}></div>
              <div className="skeleton-box mb-3" style={{ width: '70%', height: '16px' }}></div>
              <div className="skeleton-box mb-2" style={{ width: '60%', height: '14px' }}></div>
              <div className="skeleton-box mb-2" style={{ width: '50%', height: '14px' }}></div>
            </div>
            <div>
              <div className="skeleton-box mt-3 mb-3" style={{ width: '100%', height: '8px' }}></div>
              <div className="d-flex gap-2">
                <div className="skeleton-box w-50" style={{ height: '32px' }}></div>
                <div className="skeleton-box w-50" style={{ height: '32px' }}></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
