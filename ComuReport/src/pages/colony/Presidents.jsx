// src/pages/Presidentes.jsx
import React, { useState } from 'react';
import Table from '../../components/Table';
import { FaPlus } from 'react-icons/fa';
import ModalForm from '../../components/ModalForm';
import ConfirmAlert from '../../components/ConfirmAlert';
import ButtonRegister from '../../components/ButtonRegister';

const Presidentes = () => {
  const [data, setData] = useState([
    { id: 1, name: 'Juan Pérez', email: 'juan.perez@example.com', phone: '555-1234' },
    { id: 2, name: 'María López', email: 'maria.lopez@example.com', phone: '555-5678' },
    { id: 3, name: 'Carlos Sánchez', email: 'carlos.sanchez@example.com', phone: '555-8765' },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalInitialData, setModalInitialData] = useState(null);
  const [confirmAlertOpen, setConfirmAlertOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nombre', accessor: 'name' },
    { header: 'Correo', accessor: 'email' },
    { header: 'Teléfono', accessor: 'phone' },
  ];

  const handleEdit = (row) => {
    setModalTitle('Editar Presidente');
    setModalInitialData(row);
    setModalOpen(true);
  };

  const handleDelete = (row) => {
    setRowToDelete(row);
    setConfirmAlertOpen(true);
  };

  const handleCreate = () => {
    setModalTitle('Crear Nuevo Presidente');
    setModalInitialData({ id: '', name: '', email: '', phone: '' });
    setModalOpen(true);
  };

  const handleModalSubmit = (formData) => {
    if (modalTitle === 'Crear Nuevo Presidente') {
      const newId = data.length ? Math.max(...data.map((item) => item.id)) + 1 : 1;
      setData([...data, { ...formData, id: newId }]);
    } else {
      setData(data.map((item) => (item.id === formData.id ? formData : item)));
    }
    setModalOpen(false);
  };

  const handleConfirmDelete = () => {
    setData(data.filter((item) => item.id !== rowToDelete.id));
    setConfirmAlertOpen(false);
    setRowToDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmAlertOpen(false);
    setRowToDelete(null);
  };

  const presidentFields = [
    { label: 'Nombre', name: 'name', type: 'text', placeholder: 'Ingrese nombre' },
    { label: 'Correo', name: 'email', type: 'email', placeholder: 'Ingrese correo' },
    { label: 'Teléfono', name: 'phone', type: 'text', placeholder: 'Ingrese teléfono' },
  ];

  return (
    <div className="p-8 bg-transparent">
      {/* Encabezado: título y botón de creación */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Presidentes</h2>
        <ButtonRegister
          label="Nuevo Presidente"
          icon={FaPlus}
          onClick={handleCreate}
        />
      </div>

      {/* Tabla */}
      <Table columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} />

      {/* Modal de creación/edición */}
      {modalOpen && (
        <ModalForm
          title={modalTitle}
          fields={presidentFields}
          initialData={modalInitialData}
          onSubmit={handleModalSubmit}
          onClose={() => setModalOpen(false)}
        />
      )}

      {/* Confirmación de eliminación */}
      {confirmAlertOpen && (
        <ConfirmAlert
          message="¿Estás seguro de eliminar este registro?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default Presidentes;
