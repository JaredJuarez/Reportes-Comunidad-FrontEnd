// src/components/ButtonRegister.jsx
import React from 'react';
import { FaPlus } from 'react-icons/fa';

const ButtonRegister = ({
  label = 'Nuevo Registro',
  onClick,
  icon: Icon = FaPlus,
  className = '',
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md flex items-center ${className}`}
      {...props}
    >
      <Icon className="mr-2" />
      {label}
    </button>
  );
};

export default ButtonRegister;
