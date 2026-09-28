import React from 'react';

export default function AnnouncementList({ announcements }) {
  return (
    <section className="cc-section" id="announcements">
      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-6">
            <div className="cc-eyebrow">Official Notices</div>
            <h2 className="cc-section-title">ON CAMPUS</h2>
            <p className="cc-section-sub">Real-time circulars, department deadlines, and club updates.</p>
          </div>
        </div>

        <div className="bg-white border rounded p-4 p-md-5">
          {announcements.map(ann => (
            <div key={ann.id} className="announcement-row">
              <div className="announcement-idx">{ann.index}</div>
              <div className="flex-grow-1">
                <h5 className="announcement-title">{ann.title}</h5>
                <div className="announcement-meta">
                  <span><i className="bi bi-tag me-1"></i> {ann.department}</span>
                  <span><i className="bi bi-calendar3 me-1"></i> {ann.date}</span>
                  {ann.isUrgent && <span className="badge bg-success-subtle text-success">Urgent</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
