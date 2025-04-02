import React, { useState, useEffect } from 'react';
import Table from '../../components/Table';
import ModalForm from '../../components/ModalForm';
import API_BASE_URL from '../../api_config';

const StatusArea = () => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalInitialData, setModalInitialData] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Función para obtener los problemas asignados al área desde la API
  const fetchProblems = async () => {
    const token = localStorage.getItem('token'); // Obtiene el token del localStorage

    if (!token) {
      console.error('No se encontró un token en localStorage.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/problems`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Agrega el token en el encabezado
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los problemas. Verifica tu conexión o el token.');
      }

      const problems = await response.json();

      // Mapea los datos para adaptarlos al formato esperado por la tabla
      const formattedData = problems.map((problem) => ({
        id: problem.uuid,
        title: problem.title,
        description: problem.description,
        status: problem.status,
        assignedDate: problem.assignedDate,
      }));

      setData(formattedData);
    } catch (error) {
      console.error('Error al obtener los problemas:', error.message);
    }
  };

  useEffect(() => {
    fetchProblems(); // Llama a la función para obtener los problemas al cargar el componente
  }, []);

  const columns = [
    { header: 'Título', accessor: 'title' },
    { header: 'Descripción', accessor: 'description' },
    { header: 'Estado', accessor: 'status' },
    { header: 'Fecha Asignada', accessor: 'assignedDate' },
  ];

  const handleEdit = (row) => {
    setModalTitle('Actualizar Estado del Problema');
    setModalInitialData(row);
    setModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    const token = localStorage.getItem('token'); // Obtiene el token del localStorage

    if (!token) {
      console.error('No se encontró un token en localStorage.');
      return;
    }

    try {
      // Realiza el PUT para actualizar el estado del problema
      const response = await fetch(`${API_BASE_URL}/api/problems/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Agrega el token en el encabezado
        },
        body: JSON.stringify({
          status: formData.status, // Solo se actualiza el estado
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado del problema. Verifica los datos enviados.');
      }

      // Actualiza el estado con los datos editados
      setData((prevData) =>
        prevData.map((item) => (item.id === formData.id ? { ...item, status: formData.status } : item))
      );

      setSuccessMessage('Estado del problema actualizado correctamente.');
      setTimeout(() => setSuccessMessage(''), 3000); // Limpia el mensaje después de 3 segundos

      setModalOpen(false); // Cierra el modal
    } catch (error) {
      console.error('Error al actualizar el estado del problema:', error.message);
    }
  };

  const problemFields = [
    { label: 'Estado', name: 'status', type: 'text', placeholder: 'Ingrese el nuevo estado del problema' },
  ];

  return (
    <div className="p-8 bg-transparent">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Gestión de Problemas del Área</h1>
      </div>

      {successMessage && (
        <div className="bg-green-500 text-white text-center py-2 px-4 mb-4 rounded">
          {successMessage}
        </div>
      )}

      <Table columns={columns} data={data} onEdit={handleEdit} />

      {modalOpen && (
        <ModalForm
          title={modalTitle}
          fields={problemFields}
          initialData={modalInitialData}
          onSubmit={handleModalSubmit}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default StatusArea;