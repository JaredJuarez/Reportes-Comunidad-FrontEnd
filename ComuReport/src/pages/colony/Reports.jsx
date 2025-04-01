import React, { useState, useEffect } from 'react';
import Table from '../../components/Table';
import ButtonRegister from '../../components/ButtonRegister';
import ModalForm from '../../components/ModalForm';
import ConfirmAlert from '../../components/ConfirmAlert';
import Badge from '../../components/Badge';

const municipalities = [
  { id: 1, name: 'Cuernavaca', state: 'Morelos' },
  { id: 2, name: 'Jiutepec', state: 'Morelos' },
  { id: 3, name: 'Temixco', state: 'Morelos' }
];

let areasList = [
  { id: 1, municipioId: 1, municipio: 'Cuernavaca', areaName: 'Seguridad' },
  { id: 2, municipioId: 1, municipio: 'Cuernavaca', areaName: 'Obras Públicas' },
  { id: 3, municipioId: 2, municipio: 'Jiutepec', areaName: 'Salud' }
];

let reportsData = [
  { id: 1, municipioId: 1, municipio: 'Cuernavaca', reportName: 'Reporte de Ventas', date: '2025-03-01', status: 'Resuelto', area: 'Seguridad', images: [] },
  { id: 2, municipioId: 1, municipio: 'Cuernavaca', reportName: 'Reporte de Inventario', date: '2025-03-05', status: 'Pendiente', area: 'Obras Públicas', images: [] },
  { id: 3, municipioId: 2, municipio: 'Jiutepec', reportName: 'Reporte de Usuarios', date: '2025-03-10', status: 'Cancelado', area: 'Salud', images: [] }
];

const Reports = () => {
  const currentMunicipioId = 1;
  const currentMunicipio = municipalities.find(m => m.id === currentMunicipioId);
  const availableAreas = areasList.filter(a => a.municipioId === currentMunicipioId).map(a => a.areaName);
  const [data, setData] = useState(reportsData.filter(r => r.municipioId === currentMunicipioId));
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalInitialData, setModalInitialData] = useState(null);
  const [confirmAlertOpen, setConfirmAlertOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nombre del Reporte', accessor: 'reportName' },
    { header: 'Fecha', accessor: 'date' },
    { header: 'Estado', accessor: 'status', cell: row => <Badge status={row.status} /> },
    { header: 'Área', accessor: 'area' },
    { header: 'Evidencias', accessor: 'images', cell: row => row.images && row.images.length > 0 ? row.images.map((file, idx) => <img key={idx} src={URL.createObjectURL(file)} alt="" onClick={() => setPreviewImage(URL.createObjectURL(file))} className="w-10 h-10 object-cover cursor-pointer mr-2" />) : 'Sin evidencias' }
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
    setModalInitialData({ id: '', municipioId: currentMunicipioId, municipio: currentMunicipio.name, reportName: '', date: '', status: 'Pendiente', area: availableAreas[0] || '', images: [] });
    setModalOpen(true);
  };
  const handleModalSubmit = (formData) => {
    if (modalTitle === 'Crear Nuevo Reporte') {
      const newId = reportsData.length ? Math.max(...reportsData.map(item => item.id)) + 1 : 1;
      const newItem = { ...formData, id: newId };
      reportsData = [...reportsData, newItem];
      setData(reportsData.filter(r => r.municipioId === currentMunicipioId));
    } else {
      reportsData = reportsData.map(item => (item.id === formData.id ? formData : item));
      setData(reportsData.filter(r => r.municipioId === currentMunicipioId));
    }
    setModalOpen(false);
  };
  const handleConfirmDelete = () => {
    reportsData = reportsData.filter(item => item.id !== rowToDelete.id);
    setData(reportsData.filter(r => r.municipioId === currentMunicipioId));
    setConfirmAlertOpen(false);
    setRowToDelete(null);
  };
  const handleCancelDelete = () => {
    setConfirmAlertOpen(false);
    setRowToDelete(null);
  };
  const reportFields = [
    { label: 'Nombre del Reporte', name: 'reportName', type: 'text', placeholder: 'Ingrese nombre del reporte', required: true },
    { label: 'Fecha', name: 'date', type: 'date', placeholder: 'Ingrese fecha', required: true },
    { label: 'Estado', name: 'status', type: 'select', options: ['Pendiente', 'Cancelado', 'Resuelto'], required: true },
    { label: 'Área', name: 'area', type: 'select', options: availableAreas, required: true },
    { label: 'Evidencias (máx 3, JPG/PNG, 10MB c/u)', name: 'images', type: 'images', required: true }
  ];
  return (
    <div className="p-8 bg-transparent">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Reportes</h2>
        <ButtonRegister label="Nuevo Reporte" onClick={handleCreate} />
      </div>
      <Table columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} />
      {modalOpen && (
        <ModalForm title={modalTitle} fields={reportFields} initialData={modalInitialData} onSubmit={handleModalSubmit} onClose={() => setModalOpen(false)} />
      )}
      {confirmAlertOpen && (
        <ConfirmAlert message="¿Estás seguro de eliminar este reporte?" onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />
      )}
      {previewImage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent backdrop-filter backdrop-blur-sm" onClick={() => setPreviewImage(null)}>
          <img src={previewImage} alt="" className="max-w-full max-h-full" />
        </div>
      )}
    </div>
  );
};

export default Reports;
