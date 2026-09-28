import React from 'react';

export default function CancelConfirmationModal({ registration, onConfirm, onCancel, isCancelling }) {
  if (!registration) return null;

  return (
    <div className="modal-backdrop-custom" onClick={onCancel}>
      <div className="modal-dialog-custom" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modal-header-custom p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill text-danger fs-5"></i>
            <span className="fw-bold text-dark">Cancel Event Pass</span>
          </div>
          <button type="button" className="btn-close" onClick={onCancel} aria-label="Close" disabled={isCancelling}></button>
        </div>

        <div className="modal-body-custom p-4">
          <p className="mb-3">
            Are you sure you want to cancel pass <strong>{registration.id}</strong> for <strong>"{registration.eventTitle}"</strong>?
          </p>
          <div className="alert alert-warning small mb-0">
            <i className="bi bi-info-circle me-1"></i> Cancelling will release this reserved seat back to the campus pool immediately.
          </div>
        </div>

        <div className="modal-footer-custom p-3 bg-light border-top d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-cc-outline" onClick={onCancel} disabled={isCancelling}>
            Keep Pass
          </button>
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={onConfirm}
            disabled={isCancelling}
          >
            {isCancelling ? (
              <span><span className="spinner-border spinner-border-sm me-1"></span> Cancelling...</span>
            ) : (
              <span>Confirm Cancellation</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
