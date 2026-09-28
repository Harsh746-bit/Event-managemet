import React, { useState, useEffect } from 'react';

export default function RegistrationForm({ events, selectedEventId, onRegisterSubmit, isSubmitting, serverError }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    studentId: '',
    eventId: '',
    department: '',
    year: '3rd Year'
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (selectedEventId) {
      setFormData(prev => ({ ...prev, eventId: selectedEventId }));
    }
  }, [selectedEventId]);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your full name (at least 2 characters).';
    }

    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid university email address.';
    }

    if (!formData.phone.trim() || !phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (!formData.studentId.trim() || formData.studentId.trim().length < 3) {
      newErrors.studentId = 'Please enter your student ID / PRN.';
    }

    if (!formData.eventId) {
      newErrors.eventId = 'Please select a campus event.';
    }

    if (!formData.department) {
      newErrors.department = 'Please select your department.';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors(prev => {
        const nextErrors = { ...prev };
        delete nextErrors[name];
        return nextErrors;
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const currentErrors = validate();
    if (currentErrors[name]) {
      setErrors(prev => ({ ...prev, [name]: currentErrors[name] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      studentId: true,
      eventId: true,
      department: true
    });

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const success = await onRegisterSubmit(formData);
    if (success) {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        studentId: '',
        eventId: '',
        department: '',
        year: '3rd Year'
      });
      setErrors({});
      setTouched({});
    }
  };

  return (
    <section className="cc-section bg-light border-top border-bottom" id="register">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="text-center mb-5">
              <div className="cc-eyebrow justify-content-center">Event Pass</div>
              <h2 className="cc-section-title">REGISTER FOR AN EVENT</h2>
              <p className="cc-section-sub mx-auto">
                Validated client-side and submitted directly to the Express REST API backend.
              </p>
            </div>

            {serverError && (
              <div className="alert alert-danger mb-4 d-flex align-items-center gap-2" role="alert">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <div>{serverError}</div>
              </div>
            )}

            <div className="reg-box">
              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-4">
                  {/* Column 1: Personal Information */}
                  <div className="col-md-6 border-end-md pe-md-4">
                    <h6 className="fw-bold mb-3 text-uppercase text-dark">
                      <i className="bi bi-person-badge me-2 text-teal-primary"></i> 1. Personal Information
                    </h6>

                    <div className="mb-3">
                      <label htmlFor="fullName" className="form-label form-label-custom">Student Full Name *</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        className={`form-control form-control-custom ${errors.fullName ? 'is-invalid' : ''}`}
                        placeholder="e.g. Alex Morgan"
                        value={formData.fullName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isSubmitting}
                      />
                      {errors.fullName && <div className="invalid-feedback-custom">{errors.fullName}</div>}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label form-label-custom">University Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={`form-control form-control-custom ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="alex.morgan@university.edu"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isSubmitting}
                      />
                      {errors.email && <div className="invalid-feedback-custom">{errors.email}</div>}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="phone" className="form-label form-label-custom">Phone Number (10 Digits) *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className={`form-control form-control-custom ${errors.phone ? 'is-invalid' : ''}`}
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isSubmitting}
                      />
                      {errors.phone && <div className="invalid-feedback-custom">{errors.phone}</div>}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="studentId" className="form-label form-label-custom">Student ID / PRN *</label>
                      <input
                        type="text"
                        id="studentId"
                        name="studentId"
                        className={`form-control form-control-custom ${errors.studentId ? 'is-invalid' : ''}`}
                        placeholder="e.g. STU2024001"
                        value={formData.studentId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isSubmitting}
                      />
                      {errors.studentId && <div className="invalid-feedback-custom">{errors.studentId}</div>}
                    </div>
                  </div>

                  {/* Column 2: Event Details */}
                  <div className="col-md-6 ps-md-4">
                    <h6 className="fw-bold mb-3 text-uppercase text-dark">
                      <i className="bi bi-calendar2-check me-2 text-teal-primary"></i> 2. Academic & Event Selection
                    </h6>

                    <div className="mb-3">
                      <label htmlFor="eventId" className="form-label form-label-custom">Select Target Event *</label>
                      <select
                        id="eventId"
                        name="eventId"
                        className={`form-select form-select-custom ${errors.eventId ? 'is-invalid' : ''}`}
                        value={formData.eventId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isSubmitting}
                      >
                        <option value="" disabled>-- Choose an Event --</option>
                        {events.map(ev => {
                          const available = ev.capacity - ev.registered;
                          const isFull = available <= 0;
                          return (
                            <option key={ev.id} value={ev.id} disabled={isFull}>
                              {ev.title} ({ev.date}) {isFull ? '[FULL]' : `[${available} seats left]`}
                            </option>
                          );
                        })}
                      </select>
                      {errors.eventId && <div className="invalid-feedback-custom">{errors.eventId}</div>}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="department" className="form-label form-label-custom">Department / Branch *</label>
                      <select
                        id="department"
                        name="department"
                        className={`form-select form-select-custom ${errors.department ? 'is-invalid' : ''}`}
                        value={formData.department}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isSubmitting}
                      >
                        <option value="" disabled>-- Choose Department --</option>
                        <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Electronics & Telecommunication">Electronics & Telecommunication</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Business Administration">Business Administration</option>
                      </select>
                      {errors.department && <div className="invalid-feedback-custom">{errors.department}</div>}
                    </div>

                    <div className="mb-4">
                      <label htmlFor="year" className="form-label form-label-custom">Academic Year *</label>
                      <select
                        id="year"
                        name="year"
                        className="form-select form-select-custom"
                        value={formData.year}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      >
                        <option value="1st Year">1st Year (Freshman)</option>
                        <option value="2nd Year">2nd Year (Sophomore)</option>
                        <option value="3rd Year">3rd Year (Junior)</option>
                        <option value="4th Year">4th Year (Senior)</option>
                      </select>
                    </div>

                    <div className="p-3 bg-light rounded border mb-4">
                      <div className="d-flex align-items-center gap-2 small text-muted">
                        <i className="bi bi-shield-check text-teal-primary"></i>
                        <span>Client-side validated before sending payload to Express backend.</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-cc-teal w-100 py-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span><span className="spinner-border spinner-border-sm me-2"></span> Reserving Seat...</span>
                      ) : (
                        <span><i className="bi bi-check2-circle me-1"></i> Confirm Registration</span>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
