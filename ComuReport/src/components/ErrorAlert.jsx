import React, { useEffect, useRef } from 'react';

const ErrorAlert = ({ message, onClose, duration = 8000 }) => {
  const alertRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (alertRef.current && !alertRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-start mt-2 justify-center z-50 fade-in">
      <div
        ref={alertRef}
        className="bg-red-500 text-white rounded-lg shadow-lg w-full max-w-sm p-4"
      >
        <h3 className="text-lg font-bold mb-2">Error</h3>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ErrorAlert;