import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const CATEGORIES = [
  'Technology',
  'Workshop',
  'Cultural',
  'Sports',
  'Competition',
  'Club',
  'Seminar',
  'Academic',
  'Other'
];

export default function EventFormModal({ isOpen, event, onClose, onSaved }) {
  const isEdit = Boolean(event && event.id);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    location: '',
    capacity: 60,
    department: 'Computer Engineering',
    status: 'Registration Open',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        category: event.category || 'Technology',
        date: event.date || new Date().toISOString().split('T')[0],
        time: event.time || '10:00 AM',
        location: event.location || '',
        capacity: event.capacity || 60,
        department: event.department || 'Computer Engineering',
        status: event.status || 'Registration Open',
        description: event.description || ''
      });
    } else {
      setFormData({
        title: '',
        category: 'Technology',
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM',
        location: '',
        capacity: 60,
        department: 'Computer Engineering',
        status: 'Registration Open',
        description: ''
      });
    }
    setErrors({});
    setServerError(null);
  }, [event, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.title.trim() || formData.title.trim().length < 3) {
      errs.title = 'Event title must be at least 3 characters.';
    }
    if (!formData.category) {
      errs.category = 'Category is required.';
    }
    if (!formData.date || !/^\d{4}-\d{2}-\d{2}$/.test(formData.date)) {
      errs.date = 'Date must follow YYYY-MM-DD format.';
    }
    if (!formData.time.trim()) {
      errs.time = 'Event time is required.';
    }
    if (!formData.location.trim()) {
      errs.location = 'Venue/location is required.';
    }
    const cap = Number(formData.capacity);
    if (isNaN(cap) || cap <= 0) {
      errs.capacity = 'Capacity must be greater than 0.';
    } else if (isEdit && event.registered && cap < event.registered) {
      errs.capacity = `Capacity cannot be lower than registered students (${event.registered}).`;
    }
    if (!formData.department.trim()) {
      errs.department = 'Organizing department or club is required.';
    }
    if (!formData.description.trim() || formData.description.trim().length < 10) {
      errs.description = 'Description must be at least 10 characters long.';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    try {
      const payload = {
        ...formData,
        capacity: Number(formData.capacity)
      };

      let result;
      if (isEdit) {
        result = await apiService.updateEvent(event.id, payload);
      } else {
        result = await apiService.createEvent(payload);
      }

      onSaved(result, isEdit);
      onClose();
    } catch (err) {
      setServerError(err.message || 'Failed to save event to database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-dialog-custom" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        <div className="modal-header-custom p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <span className="cc-brand-icon" style={{ width: '28px', height: '28px', fontSize: '0.9rem' }}>
              <i className={isEdit ? 'bi bi-pencil-square' : 'bi bi-calendar-plus'}></i>
            </span>
            <span className="fw-bold text-dark fs-6">
              {isEdit ? `Edit Event: ${event.id}` : 'Create Campus Event (Practical 6: POST /api/events)'}
            </span>
          </div>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close" disabled={isSubmitting}></button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body-custom p-4" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
            {serverError && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
                <i className="bi bi-exclamation-octagon-fill"></i>
                <div>{serverError}</div>
              </div>
            )}

            <div className="row g-3">
              {/* Title */}
              <div className="col-12">
                <label className="form-label form-label-custom">Event Title *</label>
                <input
                  type="text"
                  name="title"
                  className={`form-control form-control-custom ${errors.title ? 'is-invalid' : ''}`}
                  placeholder="e.g. AI & Cloud Architecture Summit 2026"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.title && <div className="invalid-feedback-custom">{errors.title}</div>}
              </div>

              {/* Category */}
              <div className="col-md-6">
                <label className="form-label form-label-custom">Category *</label>
                <select
                  name="category"
                  className={`form-select form-select-custom ${errors.category ? 'is-invalid' : ''}`}
                  value={formData.category}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && <div className="invalid-feedback-custom">{errors.category}</div>}
              </div>

              {/* Department */}
              <div className="col-md-6">
                <label className="form-label form-label-custom">Organizing Department / Club *</label>
                <input
                  type="text"
                  name="department"
                  className={`form-control form-control-custom ${errors.department ? 'is-invalid' : ''}`}
                  placeholder="e.g. Computer Engineering"
                  value={formData.department}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.department && <div className="invalid-feedback-custom">{errors.department}</div>}
              </div>

              {/* Date */}
              <div className="col-md-4">
                <label className="form-label form-label-custom">Date (YYYY-MM-DD) *</label>
                <input
                  type="date"
                  name="date"
                  className={`form-control form-control-custom ${errors.date ? 'is-invalid' : ''}`}
                  value={formData.date}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.date && <div className="invalid-feedback-custom">{errors.date}</div>}
              </div>

              {/* Time */}
              <div className="col-md-4">
                <label className="form-label form-label-custom">Time *</label>
                <input
                  type="text"
                  name="time"
                  className={`form-control form-control-custom ${errors.time ? 'is-invalid' : ''}`}
                  placeholder="10:00 AM"
                  value={formData.time}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.time && <div className="invalid-feedback-custom">{errors.time}</div>}
              </div>

              {/* Capacity */}
              <div className="col-md-4">
                <label className="form-label form-label-custom">Capacity (Seats) *</label>
                <input
                  type="number"
                  name="capacity"
                  min="1"
                  className={`form-control form-control-custom ${errors.capacity ? 'is-invalid' : ''}`}
                  value={formData.capacity}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.capacity && <div className="invalid-feedback-custom">{errors.capacity}</div>}
              </div>

              {/* Location */}
              <div className="col-md-8">
                <label className="form-label form-label-custom">Location / Venue *</label>
                <input
                  type="text"
                  name="location"
                  className={`form-control form-control-custom ${errors.location ? 'is-invalid' : ''}`}
                  placeholder="e.g. Innovation Hall A / Auditorium 2"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.location && <div className="invalid-feedback-custom">{errors.location}</div>}
              </div>

              {/* Status */}
              <div className="col-md-4">
                <label className="form-label form-label-custom">Status</label>
                <select
                  name="status"
                  className="form-select form-select-custom"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="Registration Open">Registration Open</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Registration Closed">Registration Closed</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Description */}
              <div className="col-12">
                <label className="form-label form-label-custom">Event Description *</label>
                <textarea
                  name="description"
                  rows="3"
                  className={`form-control form-control-custom ${errors.description ? 'is-invalid' : ''}`}
                  placeholder="Detailed overview of syllabus, agenda, speakers, or contest rules..."
                  value={formData.description}
                  onChange={handleChange}
                  disabled={isSubmitting}
                ></textarea>
                {errors.description && <div className="invalid-feedback-custom">{errors.description}</div>}
              </div>
            </div>

            <div className="mt-3 p-2 bg-light rounded border text-muted small">
              <i className="bi bi-database me-1 text-teal-primary"></i>
              <span>Persisted via Mongoose to MongoDB collection <code>events</code> with timestamps.</span>
            </div>
          </div>

          <div className="modal-footer-custom p-3 bg-light border-top d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-cc-outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-cc-teal" disabled={isSubmitting}>
              {isSubmitting ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Saving to MongoDB...
                </span>
              ) : (
                <span>
                  <i className="bi bi-cloud-arrow-up me-1"></i>
                  {isEdit ? 'Update Event (PUT)' : 'Create Event (POST)'}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
