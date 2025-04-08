import React, { useEffect } from 'react';

const ErrorAlert = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Llama a la función para cerrar la alerta después del tiempo definido
    }, duration);

    return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta
  }, [onClose, duration]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent backdrop-blur-sm bg-opacity-50 fade-in">
      <div className="bg-red-500 text-white rounded-lg shadow-lg w-full max-w-sm p-4">
        <h3 className="text-lg font-bold mb-2">Error</h3>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ErrorAlert;