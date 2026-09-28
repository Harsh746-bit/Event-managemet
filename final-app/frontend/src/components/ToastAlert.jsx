import React, { useEffect } from 'react';

export default function ToastAlert({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === 'error';
  const icon = isError ? 'bi-exclamation-circle-fill text-danger' : 'bi-check-circle-fill text-teal-primary';
  const borderColor = isError ? 'var(--cc-error)' : 'var(--cc-teal-primary)';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1100,
        backgroundColor: '#FFFFFF',
        color: '#0F172A',
        border: '1px solid #E2E8F0',
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: '6px',
        boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.1)',
        padding: '1rem 1.25rem',
        maxWidth: '380px',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div className="d-flex align-items-start gap-3">
        <i className={`bi ${icon} fs-5 mt-1`} style={{ color: isError ? 'var(--cc-error)' : 'var(--cc-teal-primary)' }}></i>
        <div className="flex-grow-1">
          <div className="fw-bold small">{toast.title || (isError ? 'Notice' : 'Success')}</div>
          <div className="small text-muted">{toast.message}</div>
        </div>
        <button
          type="button"
          className="btn-close btn-close-sm"
          style={{ fontSize: '0.75rem' }}
          onClick={onClose}
          aria-label="Close"
        ></button>
      </div>
    </div>
  );
}
