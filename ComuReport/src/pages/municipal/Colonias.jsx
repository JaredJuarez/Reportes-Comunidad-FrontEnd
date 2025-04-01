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

let coloniasList = [
  { id: 1, municipioId: 1, municipio: 'Cuernavaca', colonia: 'San Miguel', nombre: 'Juan', apellido: 'Hernández', correo: 'juan@example.com', telefono: '555-1234' },
  { id: 2, municipioId: 1, municipio: 'Cuernavaca', colonia: 'Chamilpa', nombre: 'María', apellido: 'López', correo: 'maria@example.com', telefono: '555-5678' },
  { id: 3, municipioId: 2, municipio: 'Jiutepec', colonia: 'Centro', nombre: 'Carlos', apellido: 'Sánchez', correo: 'carlos@example.com', telefono: '555-8765' }
];

const Colonias = () => {
  const [selectedMunicipioId, setSelectedMunicipioId] = useState(municipalities[0].id);
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalInitialData, setModalInitialData] = useState(null);
  const [confirmAlertOpen, setConfirmAlertOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  useEffect(() => {
    const filtered = coloniasList.filter(item => item.municipioId === selectedMunicipioId);
    setData(filtered);
  }, [selectedMunicipioId]);

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Municipio', accessor: 'municipio' },
    { header: 'Colonia', accessor: 'colonia' },
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Apellido', accessor: 'apellido' },
    { header: 'Correo', accessor: 'correo' },
    { header: 'Teléfono', accessor: 'telefono' }
  ];

  const handleMunicipioChange = (e) => {
    const newId = Number(e.target.value);
    setSelectedMunicipioId(newId);
  };

  const handleEdit = (row) => {
    setModalTitle('Editar Enlace de Colonia');
    setModalInitialData(row);
    setModalOpen(true);
  };

  const handleDelete = (row) => {
    setRowToDelete(row);
    setConfirmAlertOpen(true);
  };

  const handleCreate = () => {
    const municipioObj = municipalities.find(m => m.id === selectedMunicipioId);
    setModalTitle('Crear Nuevo Enlace de Colonia');
    setModalInitialData({
      id: '',
      municipioId: municipioObj.id,
      municipio: municipioObj.name,
      colonia: '',
      nombre: '',
      apellido: '',
      correo: '',
      telefono: ''
    });
    setModalOpen(true);
  };

  const handleModalSubmit = (formData) => {
    if (modalTitle === 'Crear Nuevo Enlace de Colonia') {
      const newId = coloniasList.length ? Math.max(...coloniasList.map(item => item.id)) + 1 : 1;
      const newItem = { ...formData, id: newId };
      coloniasList = [...coloniasList, newItem];
      setData(coloniasList.filter(item => item.municipioId === selectedMunicipioId));
    } else {
      coloniasList = coloniasList.map(item => (item.id === formData.id ? formData : item));
      setData(coloniasList.filter(item => item.municipioId === selectedMunicipioId));
    }
    setModalOpen(false);
  };

  const handleConfirmDelete = () => {
    coloniasList = coloniasList.filter(item => item.id !== rowToDelete.id);
    setData(coloniasList.filter(item => item.municipioId === selectedMunicipioId));
    setConfirmAlertOpen(false);
    setRowToDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmAlertOpen(false);
    setRowToDelete(null);
  };

  const municipioObj = municipalities.find(m => m.id === selectedMunicipioId);

  const coloniaFields = [
    { label: 'Municipio', name: 'municipio', type: 'select', options: [municipioObj.name], disabled: true },
    { label: 'Colonia', name: 'colonia', type: 'text', placeholder: 'Ingrese el nombre de la colonia' },
    { label: 'Nombre', name: 'nombre', type: 'text', placeholder: 'Ingrese el nombre del enlace' },
    { label: 'Apellido', name: 'apellido', type: 'text', placeholder: 'Ingrese el apellido del enlace' },
    { label: 'Correo', name: 'correo', type: 'email', placeholder: 'Ingrese el correo electrónico' },
    { label: 'Teléfono', name: 'telefono', type: 'text', placeholder: 'Ingrese el teléfono' }
  ];

  return (
    <div className="p-8 bg-transparent">
      <div className="flex items-center justify-between mb-4">
        <select value={selectedMunicipioId} onChange={handleMunicipioChange} className="border border-gray-300 rounded p-2">
          {municipalities.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        <ButtonRegister label="Nuevo Enlace de Colonia" onClick={handleCreate} />
      </div>
      <Table columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} />
      {modalOpen && (
        <ModalForm
          title={modalTitle}
          fields={coloniaFields}
          initialData={modalInitialData}
          onSubmit={handleModalSubmit}
          onClose={() => setModalOpen(false)}
        />
      )}
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

export default Colonias;
