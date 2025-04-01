// src/components/Badge.jsx
import React from 'react';

const Badge = ({ status }) => {
  let bgColor = '';
  const normalizedStatus = status.toLowerCase();
  if (normalizedStatus === 'cancelada') {
    bgColor = 'bg-red-500';
  } else if (normalizedStatus === 'pendiente') {
    bgColor = 'bg-yellow-500';
  } else if (normalizedStatus === 'resuelto') {
    bgColor = 'bg-green-500';
  } else {
    bgColor = 'bg-gray-500';
  }

  return (
    <span className={`text-white text-xs font-medium px-2 py-1 rounded-full ${bgColor}`}>
      {status}
    </span>
  );
};

export default Badge;
