import React, { useState, useEffect } from 'react';
import Table from '../../components/Table';
import ButtonRegister from '../../components/ButtonRegister';
import ModalForm from '../../components/ModalForm';
import ConfirmAlert from '../../components/ConfirmAlert';
import ErrorAlert from '../../components/ErrorAlert';
import API_BASE_URL from '../../api_config';

const Colonias = () => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalInitialData, setModalInitialData] = useState(null);
  const [confirmAlertOpen, setConfirmAlertOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Función para obtener las colonias desde la API
  const fetchColonias = async () => {
    const token = localStorage.getItem('token'); // Obtiene el token del localStorage

    if (!token) {
      console.error('No se encontró un token en localStorage.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/colony`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Agrega el token en el encabezado
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener las colonias. Verifica tu conexión o el token.');
      }

      const colonias = await response.json();

      // Mapea los datos para adaptarlos al formato esperado por la tabla
      const formattedData = colonias.map((colonia) => ({
        id: colonia.uuid,
        colonia: colonia.nameColony,
        nombre: colonia.personBean.name,
        apellido: colonia.personBean.lastname,
        correo: colonia.personBean.email,
        telefono: colonia.personBean.phone,
      }));

      setData(formattedData);
    } catch (error) {
      console.error('Error al obtener las colonias:', error.message);
    }
  };

  useEffect(() => {
    fetchColonias(); // Llama a la función para obtener las colonias al cargar el componente
  }, []);

  const columns = [
    { header: 'Colonia', accessor: 'colonia' },
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Apellido', accessor: 'apellido' },
    { header: 'Correo', accessor: 'correo' },
    { header: 'Teléfono', accessor: 'telefono' },
  ];

  const handleCreate = () => {
    setModalTitle('Crear Nueva Colonia');
    setModalInitialData({
      id: '',
      colonia: '',
      nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      password: '',
    });
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    setModalTitle('Editar Colonia');
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
      setErrorMessage('No se encontró un token en localStorage.');
      return;
    }

    // Validaciones de los campos
    if (!formData.colonia || formData.colonia.trim() === '') {
      setErrorMessage('El nombre de la colonia es obligatorio.');
      return;
    }

    if (!formData.nombre || formData.nombre.trim() === '') {
      setErrorMessage('El nombre del enlace es obligatorio.');
      return;
    }

    if (!formData.apellido || formData.apellido.trim() === '') {
      setErrorMessage('El apellido del enlace es obligatorio.');
      return;
    }

    if (!formData.correo || formData.correo.trim() === '') {
      setErrorMessage('El correo electrónico es obligatorio.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      setErrorMessage('El correo electrónico no tiene un formato válido.');
      return;
    }

    if (!formData.password || formData.password.trim() === '') {
      setErrorMessage('La contraseña es obligatoria.');
      return;
    }

    // Validación de contraseña segura
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setErrorMessage(
        'La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula, un número y un carácter especial.'
      );
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.telefono || !phoneRegex.test(formData.telefono)) {
      setErrorMessage('El teléfono debe contener 10 dígitos numéricos.');
      return;
    }

    try {
      if (modalTitle === 'Crear Nueva Colonia') {
        // Realiza el POST para crear una nueva colonia
        const response = await fetch(`${API_BASE_URL}/api/colony`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Agrega el token en el encabezado
          },
          body: JSON.stringify({
            colonyName: formData.colonia,
            name: formData.nombre,
            lastname: formData.apellido,
            email: formData.correo,
            phone: formData.telefono,
            password: formData.password,
          }),
        });

        if (!response.ok) {
          throw new Error('Error al crear la colonia. Verifica los datos enviados.');
        }

        // Maneja la respuesta como texto si no es JSON
        const result = await response.text();
        console.log('Respuesta del servidor:', result);

        // Actualiza el estado con los datos enviados (si el servidor no devuelve la colonia creada)
        setData((prevData) => [
          ...prevData,
          {
            id: Date.now(), // Genera un ID temporal
            colonia: formData.colonia,
            nombre: formData.nombre,
            apellido: formData.apellido,
            correo: formData.correo,
            telefono: formData.telefono,
          },
        ]);

        setSuccessMessage('Colonia agregada correctamente.');
        setTimeout(() => setSuccessMessage(''), 3000); // Limpia el mensaje después de 3 segundos
      } else if (modalTitle === 'Editar Colonia') {
        // Realiza el PUT para actualizar una colonia existente
        const response = await fetch(`${API_BASE_URL}/api/colony/${formData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Agrega el token en el encabezado
          },
          body: JSON.stringify({
            colonyName: formData.colonia,
            name: formData.nombre,
            lastname: formData.apellido,
            email: formData.correo,
            phone: formData.telefono,
          }),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar la colonia. Verifica los datos enviados.');
        }

        // Actualiza el estado con los datos editados
        setData((prevData) =>
          prevData.map((item) => (item.id === formData.id ? formData : item))
        );

        setSuccessMessage('Colonia actualizada correctamente.');
        setTimeout(() => setSuccessMessage(''), 3000); // Limpia el mensaje después de 3 segundos
      }

      setModalOpen(false); // Cierra el modal
    } catch (error) {
      console.error('Error al crear o actualizar la colonia:', error.message);
    }
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem('token'); // Obtiene el token del localStorage

    if (!token) {
      console.error('No se encontró un token en localStorage.');
      return;
    }

    try {
      // Realiza el DELETE para eliminar la colonia
      const response = await fetch(`${API_BASE_URL}/api/colony`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Agrega el token en el encabezado
        },
        body: JSON.stringify({ uuid: rowToDelete.id }), // Envía el UUID en el cuerpo
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la colonia. Verifica tu conexión o el token.');
      }

      // Actualiza el estado eliminando la colonia de la lista
      setData((prevData) => prevData.filter((item) => item.id !== rowToDelete.id));

      setSuccessMessage('Colonia eliminada correctamente.');
      setTimeout(() => setSuccessMessage(''), 3000); // Limpia el mensaje después de 3 segundos

      setConfirmAlertOpen(false); // Cierra el modal de confirmación
      setRowToDelete(null); // Limpia la fila seleccionada
    } catch (error) {
      console.error('Error al eliminar la colonia:', error.message);
    }
  };

  const handleCancelDelete = () => {
    setConfirmAlertOpen(false);
    setRowToDelete(null);
  };

  const coloniaFields = [
    { label: 'Colonia', name: 'colonia', type: 'text', placeholder: 'Ingrese el nombre de la colonia' },
    { label: 'Nombre', name: 'nombre', type: 'text', placeholder: 'Ingrese el nombre del enlace' },
    { label: 'Apellido', name: 'apellido', type: 'text', placeholder: 'Ingrese el apellido del enlace' },
    { label: 'Correo', name: 'correo', type: 'email', placeholder: 'Ingrese el correo electrónico' },
    { label: 'Teléfono', name: 'telefono', type: 'text', placeholder: 'Ingrese el teléfono' },
    { label: 'Contraseña', name: 'password', type: 'password', placeholder: 'Ingrese la contraseña' },
  ];

  return (
    <div className="p-8 bg-transparent">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Gestión de Colonias</h1>
        <ButtonRegister label="Nueva Colonia" onClick={handleCreate} />
      </div>

      {errorMessage && (
        <ErrorAlert
          message={errorMessage}
          onClose={() => setErrorMessage(null)} // Limpia el mensaje de error al cerrar
        />
      )}

      {successMessage && (
        <div className="bg-green-500 text-white text-center py-2 px-4 mb-4 rounded">
          {successMessage}
        </div>
      )}

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
          message="¿Estás seguro de eliminar esta colonia?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default Colonias;