import React, { useState } from 'react';
import Table from '../../components/Table';
import ButtonRegister from '../../components/ButtonRegister';
import ModalForm from '../../components/ModalForm';
import ConfirmAlert from '../../components/ConfirmAlert';

const stateData = {
  Morelos: [
    { id: 1, state: 'Morelos', name: 'Cuernavaca', description: 'Capital del estado de Morelos' },
    { id: 2, state: 'Morelos', name: 'Jiutepec', description: 'Municipio con crecimiento industrial' },
    { id: 3, state: 'Morelos', name: 'Cuautla', description: 'Importante centro comercial e industrial' },
    { id: 4, state: 'Morelos', name: 'Temixco', description: 'Municipio en expansión urbana' },
  ],
  CDMX: [
    { id: 1, state: 'CDMX', name: 'Cuauhtémoc', description: 'Centro histórico de la ciudad' },
    { id: 2, state: 'CDMX', name: 'Miguel Hidalgo', description: 'Zona de museos y parques' },
  ],
};

const Municipios = () => {
  const [selectedState, setSelectedState] = useState('Morelos');
  const [data, setData] = useState(stateData[selectedState]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalInitialData, setModalInitialData] = useState(null);
  const [confirmAlertOpen, setConfirmAlertOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Estado', accessor: 'state' },
    { header: 'Nombre del Municipio', accessor: 'name' },
    { header: 'Descripción', accessor: 'description' },
  ];

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);
    setData(stateData[newState]);
  };

  const handleEdit = (row) => {
    setModalTitle('Editar Municipio');
    setModalInitialData(row);
    setModalOpen(true);
  };

  const handleDelete = (row) => {
    setRowToDelete(row);
    setConfirmAlertOpen(true);
  };

  const handleCreate = () => {
    setModalTitle('Crear Nuevo Municipio');
    setModalInitialData({ id: '', state: selectedState, name: '', description: '' });
    setModalOpen(true);
  };

  const handleModalSubmit = (formData) => {
    if (modalTitle === 'Crear Nuevo Municipio') {
      const newId = data.length ? Math.max(...data.map(item => item.id)) + 1 : 1;
      const newData = [...data, { ...formData, id: newId }];
      setData(newData);
      stateData[selectedState] = newData;
    } else {
      const newData = data.map(item => (item.id === formData.id ? formData : item));
      setData(newData);
      stateData[selectedState] = newData;
    }
    setModalOpen(false);
  };

  const handleConfirmDelete = () => {
    const newData = data.filter(item => item.id !== rowToDelete.id);
    setData(newData);
    stateData[selectedState] = newData;
    setConfirmAlertOpen(false);
    setRowToDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmAlertOpen(false);
    setRowToDelete(null);
  };

  const municipioFields = [
    { label: 'Estado', name: 'state', type: 'select', options: [selectedState], disabled: true },
    { label: 'Nombre del Municipio', name: 'name', type: 'text', placeholder: 'Ingrese el nombre del municipio' },
    { label: 'Descripción', name: 'description', type: 'text', placeholder: 'Ingrese una descripción' },
  ];

  return (
    <div className="p-8 bg-transparent">
      <div className="flex items-center justify-between mb-4">
        <select
          value={selectedState}
          onChange={handleStateChange}
          className="border border-gray-300 rounded p-2"
        >
          <option value="Morelos">Morelos</option>
          <option value="CDMX">CDMX</option>
        </select>
        <ButtonRegister label="Nuevo Municipio" onClick={handleCreate} />
      </div>
      <Table columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} />
      {modalOpen && (
        <ModalForm
          title={modalTitle}
          fields={municipioFields}
          initialData={modalInitialData}
          onSubmit={handleModalSubmit}
          onClose={() => setModalOpen(false)}
        />
      )}
      {confirmAlertOpen && (
        <ConfirmAlert
          message="¿Estás seguro de eliminar este municipio?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default Municipios;
