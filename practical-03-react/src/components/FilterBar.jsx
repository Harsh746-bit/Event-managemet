import React from 'react';

const categories = ["All", "Technology", "Workshop", "Cultural", "Sports", "Competition", "Seminar"];

export default function FilterBar({ searchQuery, onSearchChange, activeCategory, onCategoryChange, onReset }) {
  return (
    <div className="filter-bar-container">
      <div className="row g-3 align-items-center">
        <div className="col-md-5">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0 text-muted"><i className="bi bi-search"></i></span>
            <input
              type="text"
              className="form-control form-control-custom border-start-0"
              placeholder="Search by title, category, venue..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-7">
          <div className="d-flex flex-wrap gap-2 justify-content-md-end">
            {categories.map((cat) => {
              const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  className={`filter-pill ${isActive ? 'active' : ''}`}
                  onClick={() => onCategoryChange(cat)}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
