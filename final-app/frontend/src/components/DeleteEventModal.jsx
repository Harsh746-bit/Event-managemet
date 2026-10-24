import React, { useState } from 'react';
import { apiService } from '../services/api';

export default function DeleteEventModal({ isOpen, event, onClose, onDeleted }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!isOpen || !event) return null;

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await apiService.deleteEvent(event.id);
      onDeleted(event);
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to delete event from database.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-dialog-custom" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
        <div className="modal-header-custom p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-trash3-fill text-danger fs-5"></i>
            <span className="fw-bold text-dark">Delete Event (Practical 6: DELETE /api/events/:id)</span>
          </div>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close" disabled={isDeleting}></button>
        </div>

        <div className="modal-body-custom p-4">
          {errorMessage && (
            <div className="alert alert-danger py-2 small mb-3">
              <i className="bi bi-exclamation-triangle-fill me-1"></i>
              {errorMessage}
            </div>
          )}

          <p className="mb-3">
            Are you sure you want to permanently delete <strong>"{event.title}"</strong> (<code>{event.id}</code>)?
          </p>

          <div className="alert alert-warning small mb-0">
            <i className="bi bi-exclamation-circle-fill me-1"></i>
            This will remove the event record from MongoDB and delete any associated registration passes.
          </div>
        </div>

        <div className="modal-footer-custom p-3 bg-light border-top d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-cc-outline" onClick={onClose} disabled={isDeleting}>
            Keep Event
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span>
                <span className="spinner-border spinner-border-sm me-1"></span> Deleting...
              </span>
            ) : (
              <span>
                <i className="bi bi-trash3 me-1"></i> Confirm Delete
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
