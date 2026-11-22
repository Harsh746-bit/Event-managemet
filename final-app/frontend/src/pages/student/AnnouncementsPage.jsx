import React, { useState } from 'react';
import { useEvents } from '../../context/EventContext';
import AnnouncementList from '../../components/AnnouncementList';

export default function AnnouncementsPage() {
  const { announcements } = useEvents();
  const [filterUrgent, setFilterUrgent] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = announcements.filter(item => {
    if (filterUrgent === 'urgent' && !item.isUrgent) return false;
    if (filterUrgent === 'standard' && item.isUrgent) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="py-4">
      <div className="container mb-3">
        <div className="card p-3 bg-white border rounded-3 mb-2 shadow-sm">
          <div className="row g-3 align-items-center">
            <div className="col-md-7">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Filter announcements by department or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-5 d-flex gap-2 justify-content-md-end">
              <button
                className={`btn btn-sm ${filterUrgent === 'All' ? 'btn-dark' : 'btn-outline-secondary'}`}
                onClick={() => setFilterUrgent('All')}
              >
                All Notices
              </button>
              <button
                className={`btn btn-sm ${filterUrgent === 'urgent' ? 'btn-danger' : 'btn-outline-danger'}`}
                onClick={() => setFilterUrgent('urgent')}
              >
                <i className="bi bi-exclamation-circle me-1"></i> Urgent Only
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnnouncementList announcements={filtered} />
    </div>
  );
}
