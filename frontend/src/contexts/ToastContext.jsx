/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => <Toast key={t.id} toast={t} />)}
      </div>
    </ToastContext.Provider>
  );
};
