import React from 'react';
export default function Modal({ isOpen, onClose, title, icon, children }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">
          <i className={`fa-solid ${icon}`}></i> {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
