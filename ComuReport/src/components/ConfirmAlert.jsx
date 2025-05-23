// src/components/ConfirmAlert.jsx
import React from 'react';

const ConfirmAlert = ({ message, onConfirm, onCancel }) => {
  const handleOutsideClick = (e) => {
    if (e.target.id === 'confirm-alert-overlay') {
      onCancel();
    }
  };

  return (
    <div
      id="confirm-alert-overlay"
      className="fixed inset-0 flex items-center justify-center z-50 bg-transparent backdrop-blur-sm bg-opacity-50 fade-in"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-4">{message}</h3>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAlert;
