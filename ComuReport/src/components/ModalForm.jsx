import React, { useState, useEffect } from 'react';

const ModalForm = ({ title, fields, initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(initialData || {});
  const [images, setImages] = useState([]);

  useEffect(() => {
    setFormData(initialData || {});
    setImages(initialData && initialData.images ? initialData.images : []);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  };

  const processFiles = (files) => {
    const validFiles = [];
    files.forEach(file => {
      if ((file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 10 * 1024 * 1024) {
        validFiles.push(file);
      }
    });
    const total = [...images, ...validFiles];
    if (total.length <= 3) {
      setImages(total);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, file: images });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 bg-transparent backdrop-filter fade-in backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field, i) => {
            if ((field.type === 'images' || field.type === 'file') && field.name) {
              return (
                <div key={i}>
                  <label className="block text-gray-700 mb-1">{field.label}</label>
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded mb-2 text-center text-gray-600"
                  >
                    Arrastra y suelta tus imágenes aquí
                  </div>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    multiple
                    onChange={handleFileSelect}
                  />
                  <div className="mt-2 text-sm text-gray-700">
                    Imágenes seleccionadas:
                    <ul className="list-disc ml-4">
                      {images.map((img, idx) => (
                        <li key={idx}>{img.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            } else if (field.type === 'select') {
              return (
                <div key={i}>
                  <label className="block text-gray-700 mb-1">{field.label}</label>
                  <select
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    disabled={field.disabled}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {field.options && field.options.map((option, idx) => (
                      <option key={idx} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              );
            } else {
              return (
                <div key={i}>
                  <label className="block text-gray-700 mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              );
            }
          })}
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
