import React, { useState, useEffect } from 'react';
import Table from '../../components/Table';
import ButtonRegister from '../../components/ButtonRegister';
import ModalForm from '../../components/ModalForm';
import ConfirmAlert from '../../components/ConfirmAlert';
import API_BASE_URL from '../../api_config';

const Municipios = () => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalInitialData, setModalInitialData] = useState(null);
  const [confirmAlertOpen, setConfirmAlertOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Función para obtener los municipios desde la API
  const fetchMunicipios = async () => {
    const token = localStorage.getItem('token'); // Obtiene el token del localStorage

    if (!token) {
      console.error('No se encontró un token en localStorage.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/municipality`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Agrega el token en el encabezado
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los municipios. Verifica tu conexión o el token.');
      }

      const municipios = await response.json();

      // Mapea los datos para adaptarlos al formato esperado por la tabla
      const formattedData = municipios.map((municipio) => ({
        id: municipio.uuid,
        nameMunicipality: municipio.nameMunicipality,
        name: municipio.personBean.name,
        lastname: municipio.personBean.lastname,
        email: municipio.personBean.email,
        phone: municipio.personBean.phone,
      }));

      setData(formattedData);
    } catch (error) {
      console.error('Error al obtener los municipios:', error.message);
    }
  };

  useEffect(() => {
    fetchMunicipios(); // Llama a la función para obtener los municipios al cargar el componente
  }, []);

  const columns = [
    { header: 'Municipio', accessor: 'nameMunicipality' },
    { header: 'Nombre', accessor: 'name' },
    { header: 'Apellido', accessor: 'lastname' },
    { header: 'Correo', accessor: 'email' },
    { header: 'Teléfono', accessor: 'phone' },
  ];

  const handleCreate = () => {
    setModalTitle('Crear Nuevo Municipio');
    setModalInitialData({
      id: '',
      municipalityName: '',
      name: '',
      lastname: '',
      email: '',
      phone: '',
      password: '',
    });
    setModalOpen(true);
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

  const handleModalSubmit = async (formData) => {
    const token = localStorage.getItem('token'); // Obtiene el token del localStorage

    if (!token) {
      console.error('No se encontró un token en localStorage.');
      return;
    }

    try {
      if (modalTitle === 'Crear Nuevo Municipio') {
        // Realiza el POST para crear un nuevo municipio
        const response = await fetch(`${API_BASE_URL}/api/municipality`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Agrega el token en el encabezado
          },
          body: JSON.stringify({
            municipalityName: formData.municipalityName,
            password: formData.password,
            email: formData.email,
            name: formData.name,
            lastname: formData.lastname,
            phone: formData.phone,
          }),
        });

        if (!response.ok) {
          throw new Error('Error al crear el municipio. Verifica los datos enviados.');
        }

        // Maneja la respuesta como texto si no es JSON
        const result = await response.text();
        console.log('Respuesta del servidor:', result);

        // Actualiza el estado con los datos enviados (si el servidor no devuelve el municipio creado)
        setData((prevData) => [
          ...prevData,
          {
            id: Date.now(), // Genera un ID temporal
            nameMunicipality: formData.municipalityName,
            name: formData.name,
            lastname: formData.lastname,
            email: formData.email,
            phone: formData.phone,
          },
        ]);

        setSuccessMessage('Municipio agregado correctamente.');
        setTimeout(() => setSuccessMessage(''), 3000); // Limpia el mensaje después de 3 segundos
      } else if (modalTitle === 'Editar Municipio') {
        // Realiza el PUT para actualizar un municipio existente
        const response = await fetch(`${API_BASE_URL}/api/municipality/${formData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Agrega el token en el encabezado
          },
          body: JSON.stringify({
            municipalityName: formData.municipalityName,
            email: formData.email,
            name: formData.name,
            lastname: formData.lastname,
            phone: formData.phone,
          }),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar el municipio. Verifica los datos enviados.');
        }

        // Actualiza el estado con los datos editados
        setData((prevData) =>
          prevData.map((item) => (item.id === formData.id ? formData : item))
        );

        setSuccessMessage('Municipio actualizado correctamente.');
        setTimeout(() => setSuccessMessage(''), 3000); // Limpia el mensaje después de 3 segundos
      }

      setModalOpen(false); // Cierra el modal
    } catch (error) {
      console.error('Error al crear o actualizar el municipio:', error.message);
    }
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem('token'); // Obtiene el token del localStorage

    if (!token) {
      console.error('No se encontró un token en localStorage.');
      return;
    }

    try {
      // Realiza el DELETE para eliminar el municipio
      const response = await fetch(`${API_BASE_URL}/api/municipality`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Agrega el token en el encabezado
        },
        body: JSON.stringify({ uuid: rowToDelete.id }), // Envía el UUID en el cuerpo
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el municipio. Verifica tu conexión o el token.');
      }

      // Actualiza el estado eliminando el municipio de la lista
      setData((prevData) => prevData.filter((item) => item.id !== rowToDelete.id));

      setSuccessMessage('Municipio eliminado correctamente.');
      setTimeout(() => setSuccessMessage(''), 3000); // Limpia el mensaje después de 3 segundos

      setConfirmAlertOpen(false); // Cierra el modal de confirmación
      setRowToDelete(null); // Limpia la fila seleccionada
    } catch (error) {
      console.error('Error al eliminar el municipio:', error.message);
    }
  };

  const handleCancelDelete = () => {
    setConfirmAlertOpen(false);
    setRowToDelete(null);
  };

  const municipioFields = [
    { label: 'Nombre del Municipio', name: 'municipalityName', type: 'text', placeholder: 'Ingrese el nombre del municipio' },
    { label: 'Nombre', name: 'name', type: 'text', placeholder: 'Nombre del responsable' },
    { label: 'Apellido', name: 'lastname', type: 'text', placeholder: 'Apellido del responsable' },
    { label: 'Correo', name: 'email', type: 'email', placeholder: 'Correo de contacto' },
    { label: 'Contraseña', name: 'password', type: 'password', placeholder: 'Ingrese la contraseña' },
    { label: 'Teléfono', name: 'phone', type: 'text', placeholder: 'Teléfono de contacto' },
  ];

  return (
    <div className="p-8 bg-transparent">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Gestión de Municipios</h1>
        <ButtonRegister label="Nuevo Municipio" onClick={handleCreate} />
      </div>

      {successMessage && (
        <div className="bg-green-500 text-white text-center py-2 px-4 mb-4 rounded">
          {successMessage}
        </div>
      )}

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