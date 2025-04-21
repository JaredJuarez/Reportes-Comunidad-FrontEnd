import React from "react";

const ReusableModal = ({
  isOpen,
  onClose,
  title,
  description,
  value,
  onChange,
  onConfirm,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-40 backdrop-blur-sm z-40"
      role="dialog"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onClose();
        }
      }}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <label className="block text-gray-700 mb-2">{description}</label>
        <textarea
          value={value}
          onChange={onChange}
          className="w-full border border-gray-300 p-2 rounded mb-4"
          placeholder="Ingresa la descripción"
          aria-label={description}
        />
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReusableModal;