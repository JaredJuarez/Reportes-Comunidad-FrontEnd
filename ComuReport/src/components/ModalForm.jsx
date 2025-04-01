// src/components/ModalForm.jsx
import React, { useState, useEffect } from 'react';

const ModalForm = ({ title, fields, initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(initialData || {});
  const [errors, setErrors] = useState({});

  // Al cargar o cambiar initialData, precargamos select con el primer valor si está vacío
  useEffect(() => {
    let newFormData = { ...initialData } || {};
    fields.forEach((field) => {
      if (
        field.type === 'select' &&
        (!newFormData[field.name] || newFormData[field.name] === '') &&
        field.options &&
        field.options.length > 0
      ) {
        newFormData[field.name] = field.options[0];
      }
    });
    setFormData(newFormData);
  }, [initialData, fields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Limpiar error para el campo modificado
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación: verificar que ningún campo esté vacío
    const newErrors = {};
    fields.forEach((field) => {
      if (!formData[field.name] || formData[field.name].trim() === '') {
        newErrors[field.name] = 'Este campo es requerido';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent backdrop-filter backdrop-blur-sm fade-in">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field, index) => (
            <div key={index}>
              <label className="block text-gray-700 mb-1">{field.label}</label>
              {field.type === 'select' ? (
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {field.options &&
                    field.options.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              )}
              {errors[field.name] && (
                <span className="text-red-500 text-xs">{errors[field.name]}</span>
              )}
            </div>
          ))}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalForm;
