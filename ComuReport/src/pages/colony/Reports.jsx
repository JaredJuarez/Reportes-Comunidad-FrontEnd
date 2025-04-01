// src/pages/Reports.jsx
import React, { useState } from 'react';
import Table from '../../components/Table';
import ButtonRegister from '../../components/ButtonRegister';
import ModalForm from '../../components/ModalForm';
import ConfirmAlert from '../../components/ConfirmAlert';
import Badge from '../../components/Badge';

const Reports = () => {
  const [data, setData] = useState([
    { id: 1, reportName: 'Reporte de Ventas', date: '2025-03-01', status: 'Resuelto', area: 'Seguridad' },
    { id: 2, reportName: 'Reporte de Inventario', date: '2025-03-05', status: 'Pendiente', area: 'Infraestructura' },
    { id: 3, reportName: 'Reporte de Usuarios', date: '2025-03-10', status: 'Cancelada', area: 'Salud' },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalInitialData, setModalInitialData] = useState(null);
  const [confirmAlertOpen, setConfirmAlertOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nombre del Reporte', accessor: 'reportName' },
    { header: 'Fecha', accessor: 'date' },
    { 
      header: 'Estado', 
      accessor: 'status', 
      cell: (row) => <Badge status={row.status} /> 
    },
    { header: 'Área', accessor: 'area' },
  ];

  const handleEdit = (row) => {
    setModalTitle('Editar Reporte');
    setModalInitialData(row);
    setModalOpen(true);
  };

  const handleDelete = (row) => {
    setRowToDelete(row);
    setConfirmAlertOpen(true);
  };

  const handleCreate = () => {
    setModalTitle('Crear Nuevo Reporte');
    // Se precarga el campo "area" con el primer valor de las opciones disponibles
    setModalInitialData({ id: '', reportName: '', date: '', status: '', area: 'Seguridad' });
    setModalOpen(true);
  };

  const handleModalSubmit = (formData) => {
    if (modalTitle === 'Crear Nuevo Reporte') {
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

  // Se actualiza el formulario para incluir el campo "Área" con opciones fijas
  const reportFields = [
    { label: 'Nombre del Reporte', name: 'reportName', type: 'text', placeholder: 'Ingrese nombre del reporte' },
    { label: 'Fecha', name: 'date', type: 'date', placeholder: 'Ingrese fecha' },
    { 
      label: 'Estado', 
      name: 'status', 
      type: 'select', 
      options: ['Cancelada', 'Pendiente', 'Resuelto'] 
    },
    { 
      label: 'Área', 
      name: 'area', 
      type: 'select', 
      options: ['Seguridad', 'Infraestructura', 'Salud'] 
    },
  ];

  return (
    <div className="p-8 bg-transparent">
      {/* Encabezado: título y botón de creación */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Reportes</h2>
        <ButtonRegister label="Nuevo Reporte" onClick={handleCreate} />
      </div>

      {/* Tabla */}
      <Table columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} />

      {/* Modal de creación/edición */}
      {modalOpen && (
        <ModalForm
          title={modalTitle}
          fields={reportFields}
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

export default Reports;
