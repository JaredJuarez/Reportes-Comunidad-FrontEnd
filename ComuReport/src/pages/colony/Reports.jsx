import React, { useState, useEffect } from 'react';
import Table from '../../components/Table';
import ButtonRegister from '../../components/ButtonRegister';
import ModalForm from '../../components/ModalForm';
import ConfirmAlert from '../../components/ConfirmAlert';
import Badge from '../../components/Badge';
import ErrorAlert from '../../components/ErrorAlert';
import API_BASE_URL from '../../api_config';

const Reports = () => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalInitialData, setModalInitialData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const columns = [
    { header: 'Título', accessor: 'title' },
    { header: 'Fecha', accessor: 'date' },
    { header: 'Estado', accessor: 'status', cell: row => <Badge status={row.status} /> },
    { header: 'Colonia', accessor: 'colonyName' },
    { header: 'Municipio', accessor: 'municipalityName' },
    {
      header: 'Evidencias',
      accessor: 'image',
      cell: row =>
        row.image && row.image.length > 0 ? (
          row.image.map((file, idx) => (
            <img
              key={idx}
              src={file.url}
              alt="Evidencia"
              onClick={() => setPreviewImage(file.url)} // Muestra la vista previa al hacer clic
              className="w-10 h-10 object-cover cursor-pointer mr-2"
            />
          ))
        ) : (
          'Sin evidencias'
        ),
    },
  ];

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 3000);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/report`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los reportes. Verifica tu conexión o el token.');
      }

      const reports = await response.json();
      setData(reports);
    } catch (error) {
      showError(error.message);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleCreate = () => {
    setModalTitle('Crear Nuevo Reporte');
    setModalInitialData({ title: '', description: '', file: [] });
    setModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();

      // Agrega los campos de texto al FormData
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);

      // Agrega todas las imágenes al campo "file" como archivos binarios
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((image) => {
          formDataToSend.append('file', image); // Agrega cada imagen al campo "file"
        });
      }
      console.log(formData);
      

      const response = await fetch(`${API_BASE_URL}/api/report`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Error al registrar el reporte. Verifica los datos enviados.');
      }

      showSuccess('Reporte registrado correctamente.');
      fetchReports(); // Actualiza la lista de reportes
      setModalOpen(false);
    } catch (error) {
      showError(error.message);
    }
  };

  return (
    <div className="p-8 bg-transparent">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Reportes</h2>
        <ButtonRegister label="Nuevo Reporte" onClick={handleCreate} />
      </div>

      {errorMessage && (
        <ErrorAlert
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}

      {successMessage && (
        <div className="bg-green-500 text-white text-center py-2 px-4 mb-4 rounded">
          {successMessage}
        </div>
      )}

      <Table columns={columns} data={data} />

      {modalOpen && (
        <ModalForm
          title={modalTitle}
          fields={[
            { label: 'Título', name: 'title', type: 'text', placeholder: 'Ingrese el título del reporte', required: true },
            { label: 'Descripción', name: 'description', type: 'text', placeholder: 'Ingrese la descripción del reporte', required: true },
            { label: 'Evidencias (máx 3, JPG/PNG, 10MB c/u)', name: 'images', type: 'images', required: true },
          ]}
          initialData={modalInitialData}
          onSubmit={handleModalSubmit}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Reports;