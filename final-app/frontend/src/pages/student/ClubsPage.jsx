import React, { useState } from 'react';
import { useEvents } from '../../context/EventContext';
import ClubSection from '../../components/ClubSection';

export default function ClubsPage() {
  const { clubs } = useEvents();
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', ...new Set(clubs.map(c => c.category))];

  const filteredClubs = clubs.filter(club => {
    const matchesCat = filterCategory === 'All' || club.category === filterCategory;
    const matchesSearch = !searchTerm.trim() || 
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="py-4">
      <div className="container mb-3">
        {/* Category Pill Filters */}
        <div className="card p-3 bg-white border rounded-3 mb-2 shadow-sm">
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search campus clubs and societies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 d-flex flex-wrap gap-1 justify-content-md-end">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`btn btn-sm ${filterCategory === cat ? 'btn-dark' : 'btn-outline-secondary'}`}
                  onClick={() => setFilterCategory(cat)}
                  style={{ fontSize: '0.8rem' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ClubSection clubs={filteredClubs} />
    </div>
  );
}
