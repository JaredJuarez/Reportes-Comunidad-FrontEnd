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

let reportsList = [
  { id: 1, municipioId: 1, municipio: 'Cuernavaca', title: 'Bache en la calle', status: 'Pendiente', area: '', description: 'Bache grande en Avenida Reforma' },
  { id: 2, municipioId: 1, municipio: 'Cuernavaca', title: 'Falla de alumbrado', status: 'Cancelado', area: '', description: 'Poste de luz sin funcionar' },
  { id: 3, municipioId: 2, municipio: 'Jiutepec', title: 'Inundación', status: 'Resuelto', area: 'Salud', description: 'Zona baja con agua estancada' }
];

const Reports = () => {
  const [selectedMunicipioId, setSelectedMunicipioId] = useState(municipalities[0].id);
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalInitialData, setModalInitialData] = useState(null);
  const [confirmAlertOpen, setConfirmAlertOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  useEffect(() => {
    setData(reportsList.filter(r => r.municipioId === selectedMunicipioId));
  }, [selectedMunicipioId]);

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Municipio', accessor: 'municipio' },
    { header: 'Título', accessor: 'title' },
    {
      header: 'Estado',
      accessor: 'status',
      cell: row => <Badge status={row.status} />
    },
    { header: 'Área', accessor: 'area' }
  ];

  const handleMunicipioChange = (e) => {
    const newId = Number(e.target.value);
    setSelectedMunicipioId(newId);
  };

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
    const m = municipalities.find(m => m.id === selectedMunicipioId);
    setModalTitle('Crear Nuevo Reporte');
    setModalInitialData({ id: '', municipioId: m.id, municipio: m.name, title: '', status: 'Pendiente', area: '', description: '' });
    setModalOpen(true);
  };

  const handleModalSubmit = (formData) => {
    if (modalTitle === 'Crear Nuevo Reporte') {
      const newId = reportsList.length ? Math.max(...reportsList.map(r => r.id)) + 1 : 1;
      const newItem = { ...formData, id: newId };
      reportsList = [...reportsList, newItem];
      setData(reportsList.filter(r => r.municipioId === selectedMunicipioId));
    } else {
      reportsList = reportsList.map(r => (r.id === formData.id ? formData : r));
      setData(reportsList.filter(r => r.municipioId === selectedMunicipioId));
    }
    setModalOpen(false);
  };

  const handleConfirmDelete = () => {
    reportsList = reportsList.filter(r => r.id !== rowToDelete.id);
    setData(reportsList.filter(r => r.municipioId === selectedMunicipioId));
    setConfirmAlertOpen(false);
    setRowToDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmAlertOpen(false);
    setRowToDelete(null);
  };

  const mObj = municipalities.find(m => m.id === selectedMunicipioId);
  const availableAreas = areasList.filter(a => a.municipioId === selectedMunicipioId).map(a => a.areaName);

  const reportFields = [
    { label: 'Municipio', name: 'municipio', type: 'select', options: [mObj.name], disabled: true },
    { label: 'Título', name: 'title', type: 'text', placeholder: 'Título del reporte' },
    { label: 'Estado', name: 'status', type: 'select', options: ['Pendiente', 'Cancelado', 'Resuelto'] },
    { label: 'Área', name: 'area', type: 'select', options: ['', ...availableAreas] },
    { label: 'Descripción', name: 'description', type: 'text', placeholder: 'Descripción del incidente' }
  ];

  return (
    <div className="p-8 bg-transparent">
      <div className="flex items-center justify-between mb-4">
        <select value={selectedMunicipioId} onChange={handleMunicipioChange} className="border border-gray-300 rounded p-2">
          {municipalities.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        <ButtonRegister label="Nuevo Reporte" onClick={handleCreate} />
      </div>
      <Table columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} />
      {modalOpen && (
        <ModalForm
          title={modalTitle}
          fields={reportFields}
          initialData={modalInitialData}
          onSubmit={handleModalSubmit}
          onClose={() => setModalOpen(false)}
        />
      )}
      {confirmAlertOpen && (
        <ConfirmAlert
          message="¿Estás seguro de eliminar este reporte?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default Reports;
