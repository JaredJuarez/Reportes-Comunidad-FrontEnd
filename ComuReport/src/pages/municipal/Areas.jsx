import React, { useState, useEffect } from 'react';
import Table from '../../components/Table';
import ButtonRegister from '../../components/ButtonRegister';
import ModalForm from '../../components/ModalForm';
import ConfirmAlert from '../../components/ConfirmAlert';
import API_BASE_URL from '../../api_config';

const Areas = () => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalInitialData, setModalInitialData] = useState(null);
  const [confirmAlertOpen, setConfirmAlertOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchAreas = async () => {
    const token = localStorage.getItem('token'); // Obtiene el token del localStorage

    if (!token) {
      console.error('No se encontró un token en localStorage.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/area/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Agrega el token en el encabezado
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener las áreas. Verifica tu conexión o el token.');
      }

      const areas = await response.json();

      // Mapea los datos para adaptarlos al formato esperado por la tabla
      const formattedData = areas.map((area) => ({
        id: area.uuid,
        nameArea: area.nameArea,
        name: area.personBean.name,
        lastname: area.personBean.lastname,
        email: area.personBean.email,
        phone: area.personBean.phone,
      }));

      setData(formattedData);
    } catch (error) {
      console.error('Error al obtener las áreas:', error.message);
    }
  };

  useEffect(() => {
    fetchAreas(); // Llama a la función para obtener las áreas al cargar el componente
  }, []);

  const columns = [
    { header: 'Área', accessor: 'nameArea' },
    { header: 'Nombre', accessor: 'name' },
    { header: 'Apellido', accessor: 'lastname' },
    { header: 'Correo', accessor: 'email' },
    { header: 'Teléfono', accessor: 'phone' },
  ];

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
    setModalTitle('Crear Nueva Área');
    setModalInitialData({
      id: '',
      nameArea: '',
      name: '',
      lastname: '',
      email: '',
      phone: '',
      password: '',
    });
    setModalOpen(true);
  };

   const handleModalSubmit = async (formData) => {
    const token = localStorage.getItem('token'); // Obtiene el token del localStorage
  
    if (!token) {
      console.error('No se encontró un token en localStorage.');
      return;
    }
  
    try {
      if (modalTitle === 'Crear Nueva Área') {
        // Realiza el POST para crear una nueva área
        const response = await fetch(`${API_BASE_URL}/api/area/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Agrega el token en el encabezado
          },
          body: JSON.stringify({
            nameArea: formData.nameArea,
            name: formData.name,
            lastname: formData.lastname,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Error al crear el área. Verifica los datos enviados.');
        }
  
        // Maneja la respuesta como texto si no es JSON
        const result = await response.text();
  
        // Actualiza el estado con la nueva área (opcional, si el servidor no devuelve el área creada)
        setData((prevData) => [
          ...prevData,
          {
            id: Date.now(), // Genera un ID temporal
            nameArea: formData.nameArea,
            name: formData.name,
            lastname: formData.lastname,
            email: formData.email,
            phone: formData.phone,
          },
        ]);
  
        // Muestra el mensaje de éxito
        setSuccessMessage('Área agregada correctamente.');
        setTimeout(() => setSuccessMessage(''), 3000); // Limpia el mensaje después de 3 segundos
      }
  
      setModalOpen(false); // Cierra el modal
    } catch (error) {
      console.error('Error al crear o actualizar el área:', error.message);
    }
  };

  const handleConfirmDelete = () => {
    setData(data.filter((a) => a.id !== rowToDelete.id));
    setConfirmAlertOpen(false);
    setRowToDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmAlertOpen(false);
    setRowToDelete(null);
  };

  const areaFields = [
    { label: 'Área', name: 'nameArea', type: 'text', placeholder: 'Nombre del área' },
    { label: 'Nombre', name: 'name', type: 'text', placeholder: 'Nombre del responsable' },
    { label: 'Apellido', name: 'lastname', type: 'text', placeholder: 'Apellido del responsable' },
    { label: 'Correo', name: 'email', type: 'email', placeholder: 'Correo de contacto' },
    { label: 'Teléfono', name: 'phone', type: 'text', placeholder: 'Teléfono de contacto' },
    { label: 'Contraseña', name: 'password', type: 'password', placeholder: 'Contraseña' },
  ];

  return (
    <div className="p-8 bg-transparent">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Gestión de Áreas</h1>
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