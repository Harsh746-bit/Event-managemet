import React from 'react';

export default function ClubSection({ clubs }) {
  const featuredClub = clubs.find(c => c.isFeatured) || clubs[0];
  const otherClubs = clubs.filter(c => c.id !== featuredClub.id);

  return (
    <section className="cc-section bg-white border-top border-bottom" id="clubs">
      <div className="container">
        <div className="row mb-5 align-items-end">
          <div className="col-md-8">
            <div className="cc-eyebrow">Student Communities</div>
            <h2 className="cc-section-title">FIND YOUR COMMUNITY.</h2>
            <p className="cc-section-sub mb-0">Meet fellow students who are building, creating, competing, and exploring together.</p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <a href="#register" className="btn btn-cc-outline">Join a Club <i className="bi bi-arrow-right ms-1"></i></a>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-5">
            <div className="p-4 rounded border h-100 d-flex flex-column justify-content-between" style={{ backgroundColor: 'var(--cc-bg-subtle)' }}>
              <div>
                <span className="cc-tag cc-tag-teal mb-3">Featured Club</span>
                <h3 className="fw-bold mb-2">{featuredClub.name}</h3>
                <p className="text-secondary mb-4">{featuredClub.description}</p>
              </div>
              <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                <span className="small fw-semibold text-dark"><i className="bi bi-people-fill text-teal-primary" style={{ color: 'var(--cc-teal-primary)' }}></i> {featuredClub.memberCount}+ Members</span>
                <a href="#register" className="btn btn-sm btn-cc-navy">Join Community</a>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="row g-3">
              {otherClubs.map(club => (
                <div key={club.id} className="col-sm-6">
                  <div className="club-item-card">
                    <i className={`bi ${club.icon} fs-3 text-teal-primary mb-2`} style={{ color: 'var(--cc-teal-primary)' }}></i>
                    <h6 className="fw-bold mb-1">{club.name}</h6>
                    <p className="small text-muted mb-2">{club.description}</p>
                    <span className="badge bg-light text-dark border">{club.memberCount} Members</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
