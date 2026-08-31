import React from 'react';
export default function Toast({ toast }) {
  return (
    <div className={`toast ${toast.type}`}>
      <i className={`fa-solid ${
        toast.type === 'success' ? 'fa-circle-check' :
        toast.type === 'info' ? 'fa-circle-info' : 'fa-circle-exclamation'
      }`}></i>
      {toast.message}
    </div>
  );
}
