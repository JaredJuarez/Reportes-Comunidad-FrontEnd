import React, { useState, useEffect } from "react";

const ModalForm = ({ title, fields, initialData, onSubmit, onClose ,type }) => {
  const [formData, setFormData] = useState(initialData || {});
  const [file, setFile] = useState([]); // Cambia el nombre del estado de imágenes
  const [previewImages, setPreviewImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null); // Estado para mensajes de error

  useEffect(() => {
    setFormData(initialData || {});
    setFile(initialData && initialData.images ? initialData.images : []);
    setPreviewImages([]);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    const validPreviews = [];
    let invalidFileFound = false;

    files.forEach((file) => {
      if (
        (file.type === "image/jpeg" || file.type === "image/png") &&
        file.size <= 10 * 1024 * 1024
      ) {
        validFiles.push(file); // Asegúrate de que sean instancias de File
        validPreviews.push(URL.createObjectURL(file)); // Crear URL para previsualización
      } else {
        invalidFileFound = true; // Marca si se encuentra un archivo no válido
      }
    });

    if (invalidFileFound) {
      setErrorMessage(
        "Solo se permiten imágenes en formato JPG o PNG de máximo 10 MB."
      );
      setTimeout(() => setErrorMessage(null), 3000); // Limpia el mensaje después de 3 segundos
    }

    if (validFiles.length + file.length <= 3) {
      setFile((prev) => [...prev, ...validFiles]); // Actualiza el estado `file`
      setPreviewImages((prev) => [...prev, ...validPreviews]);
    } else {
      setErrorMessage("Solo puedes subir un máximo de 3 imágenes.");
      setTimeout(() => setErrorMessage(null), 3000); // Limpia el mensaje después de 3 segundos
    }
  };

  const handleRemoveImage = (index) => {
    const updatedFiles = file.filter((_, i) => i !== index);
    const updatedPreviews = previewImages.filter((_, i) => i !== index);
    setFile(updatedFiles); // Actualiza el estado `file`
    setPreviewImages(updatedPreviews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file.length === 0) {
      onSubmit(formData);
    } else {
      const { title, description } = formData;
      onSubmit({ title, description, file });
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 flex items-center justify-center z-40 bg-transparent backdrop-filter fade-in backdrop-blur-sm"
      onClick={handleOutsideClick}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>
        {type === "create" && (
          <p className="text-sm text-gray-500 mb-4">
            Después de crear el presidente, solo se podrán modificar los datos
            de contacto como el correo y el teléfono.
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field, i) => {
            if (
              (field.type === "images" || field.type === "file") &&
              field.name
            ) {
              return (
                <div key={i}>
                  <label className="block text-gray-700 mb-1">
                    {field.label}
                  </label>
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
                    <div className="flex flex-wrap gap-2 mt-2">
                      {previewImages.map((preview, idx) => (
                        <div
                          key={idx}
                          className="relative w-20 h-20 border rounded overflow-hidden"
                        >
                          <img
                            src={preview}
                            alt={`Preview ${idx}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="cursor-pointer absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            } else if (field.type === "select") {
              return (
                <div key={i}>
                  <label className="block text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <select
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    disabled={field.disabled}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {field.options &&
                      field.options.map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                  </select>
                </div>
              );
            } else {
              return (
                <div key={i}>
                  <label className="block text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              );
            }
          })}
          {errorMessage && (
            <div className="bg-red-500 text-white text-center py-2 px-4 rounded">
              {errorMessage}
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="cursor-pointer px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
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
