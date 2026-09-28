import React from 'react';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="text-center py-5 bg-white border rounded p-4">
      <i className="bi bi-exclamation-triangle-fill fs-1 text-danger"></i>
      <h4 className="fw-bold mt-3 mb-1">SOMETHING WENT WRONG</h4>
      <p className="text-muted mb-3">{message || "We couldn't load campus events right now."}</p>
      {onRetry && (
        <button className="btn btn-cc-teal" onClick={onRetry}>
          <i className="bi bi-arrow-clockwise me-1"></i> Try Again
        </button>
      )}
    </div>
  );
}
