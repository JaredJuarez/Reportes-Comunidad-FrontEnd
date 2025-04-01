import React, { useState, useEffect } from 'react';
import Table from '../../components/Table';
import ButtonRegister from '../../components/ButtonRegister';
import ModalForm from '../../components/ModalForm';
import ConfirmAlert from '../../components/ConfirmAlert';

const municipalities = [
  { id: 1, name: 'Cuernavaca', state: 'Morelos' },
  { id: 2, name: 'Jiutepec', state: 'Morelos' },
  { id: 3, name: 'Temixco', state: 'Morelos' }
];

let areasList = [
  { id: 1, municipioId: 1, municipio: 'Cuernavaca', areaName: 'Seguridad', responsable: 'Ana', correo: 'ana@example.com', telefono: '555-1111' },
  { id: 2, municipioId: 1, municipio: 'Cuernavaca', areaName: 'Obras Públicas', responsable: 'Luis', correo: 'luis@example.com', telefono: '555-2222' },
  { id: 3, municipioId: 2, municipio: 'Jiutepec', areaName: 'Salud', responsable: 'Pedro', correo: 'pedro@example.com', telefono: '555-3333' }
];

const Areas = () => {
  const [selectedMunicipioId, setSelectedMunicipioId] = useState(municipalities[0].id);
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalInitialData, setModalInitialData] = useState(null);
  const [confirmAlertOpen, setConfirmAlertOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  useEffect(() => {
    setData(areasList.filter(a => a.municipioId === selectedMunicipioId));
  }, [selectedMunicipioId]);

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Municipio', accessor: 'municipio' },
    { header: 'Área', accessor: 'areaName' },
    { header: 'Responsable', accessor: 'responsable' },
    { header: 'Correo', accessor: 'correo' },
    { header: 'Teléfono', accessor: 'telefono' }
  ];

  const handleMunicipioChange = (e) => {
    const newId = Number(e.target.value);
    setSelectedMunicipioId(newId);
  };

  const handleEdit = (row) => {
    setModalTitle('Editar Área');
    setModalInitialData(row);
    setModalOpen(true);
  };

  const handleDelete = (row) => {
    setRowToDelete(row);
    setConfirmAlertOpen(true);
  };

  const handleCreate = () => {
    const m = municipalities.find(m => m.id === selectedMunicipioId);
    setModalTitle('Crear Nueva Área');
    setModalInitialData({ id: '', municipioId: m.id, municipio: m.name, areaName: '', responsable: '', correo: '', telefono: '' });
    setModalOpen(true);
  };

  const handleModalSubmit = (formData) => {
    if (modalTitle === 'Crear Nueva Área') {
      const newId = areasList.length ? Math.max(...areasList.map(a => a.id)) + 1 : 1;
      const newItem = { ...formData, id: newId };
      areasList = [...areasList, newItem];
      setData(areasList.filter(a => a.municipioId === selectedMunicipioId));
    } else {
      areasList = areasList.map(a => (a.id === formData.id ? formData : a));
      setData(areasList.filter(a => a.municipioId === selectedMunicipioId));
    }
    setModalOpen(false);
  };

  const handleConfirmDelete = () => {
    areasList = areasList.filter(a => a.id !== rowToDelete.id);
    setData(areasList.filter(a => a.municipioId === selectedMunicipioId));
    setConfirmAlertOpen(false);
    setRowToDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmAlertOpen(false);
    setRowToDelete(null);
  };

  const mObj = municipalities.find(m => m.id === selectedMunicipioId);

  const areaFields = [
    { label: 'Municipio', name: 'municipio', type: 'select', options: [mObj.name], disabled: true },
    { label: 'Área', name: 'areaName', type: 'text', placeholder: 'Nombre de la área' },
    { label: 'Responsable', name: 'responsable', type: 'text', placeholder: 'Responsable del área' },
    { label: 'Correo', name: 'correo', type: 'email', placeholder: 'Correo de contacto' },
    { label: 'Teléfono', name: 'telefono', type: 'text', placeholder: 'Teléfono de contacto' }
  ];

  return (
    <div className="p-8 bg-transparent">
      <div className="flex items-center justify-between mb-4">
        <select value={selectedMunicipioId} onChange={handleMunicipioChange} className="border border-gray-300 rounded p-2">
          {municipalities.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        <ButtonRegister label="Nueva Área" onClick={handleCreate} />
      </div>
      <Table columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} />
      {modalOpen && (
        <ModalForm
          title={modalTitle}
          fields={areaFields}
          initialData={modalInitialData}
          onSubmit={handleModalSubmit}
          onClose={() => setModalOpen(false)}
        />
      )}
      {confirmAlertOpen && (
        <ConfirmAlert
          message="¿Estás seguro de eliminar esta área?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default Areas;
