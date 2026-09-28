import React from 'react';

const categories = [
  { name: "Technology", icon: "bi-cpu" },
  { name: "Workshop", icon: "bi-tools" },
  { name: "Cultural", icon: "bi-music-note-beamed" },
  { name: "Sports", icon: "bi-trophy" },
  { name: "Competition", icon: "bi-award" },
  { name: "Club", icon: "bi-people" },
  { name: "Seminar", icon: "bi-easel" }
];

export default function EventCategories({ activeCategory, onSelectCategory }) {
  return (
    <section className="cc-section-sm bg-light border-top border-bottom">
      <div className="container">
        <div className="row g-2 g-md-3">
          {categories.map(cat => {
            const isActive = activeCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <div key={cat.name} className="col-6 col-md-3 col-lg">
                <div
                  className={`category-card ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectCategory && onSelectCategory(cat.name)}
                >
                  <div className="cat-icon"><i className={`bi ${cat.icon}`}></i></div>
                  <div className="cat-title">{cat.name}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
