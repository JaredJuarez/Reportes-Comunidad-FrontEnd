import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import ButtonRegister from "../../components/ButtonRegister";
import ModalForm from "../../components/ModalForm";
import ConfirmAlert from "../../components/ConfirmAlert";
import ErrorAlert from "../../components/ErrorAlert";
import API_BASE_URL from "../../api_config";

const Areas = () => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalInitialData, setModalInitialData] = useState(null);
  const [confirmAlertOpen, setConfirmAlertOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(null); // Estado para manejar el mensaje de error

  // Función para mostrar el mensaje de error
  const showError = (message) => {
    setErrorMessage(message);
  };

  const fetchAreas = async () => {
    const token = localStorage.getItem("token"); // Obtiene el token del localStorage

    if (!token) {
      console.error("No se encontró un token en localStorage.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/area`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Agrega el token en el encabezado
        },
      });

      if (!response.ok) {
        throw new Error(
          "Error al obtener las áreas. Verifica tu conexión o el token."
        );
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
      console.error("Error al obtener las áreas:", error.message);
    }
  };

  useEffect(() => {
    fetchAreas(); // Llama a la función para obtener las áreas al cargar el componente
  }, []);

  const columns = [
    { header: "Área", accessor: "nameArea" },
    { header: "Nombre", accessor: "name" },
    { header: "Apellido", accessor: "lastname" },
    { header: "Correo", accessor: "email" },
    { header: "Teléfono", accessor: "phone" },
  ];

  const handleEdit = (row) => {
    setModalTitle("Editar Área");
    setModalInitialData(row);
    setModalOpen(true);
  };

  const handleDelete = (row) => {
    setRowToDelete(row);
    setConfirmAlertOpen(true);
  };

  const handleCreate = () => {
    setModalTitle("Crear Nueva Área");
    setModalInitialData({
      nameArea: "",
      name: "",
      lastname: "",
      email: "",
      phone: "",
      password: "",
    });
    setModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    console.log("Valor de nameArea:", formData);
    const token = localStorage.getItem("token"); // Obtiene el token del localStorage

    if (!token) {
      showError("No se encontró un token en localStorage.");
      return;
    }

    // Validaciones de los campos
    if (!formData.nameArea || formData.nameArea.trim() === "") {
      showError("El nombre del área es obligatorio.");
      return;
    }

    if (!formData.name || formData.name.trim() === "") {
      showError("El nombre del responsable es obligatorio.");
      return;
    }

    if (!formData.lastname || formData.lastname.trim() === "") {
      showError("El apellido del responsable es obligatorio.");
      return;
    }

    if (!formData.email || formData.email.trim() === "") {
      showError("El correo electrónico es obligatorio.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showError("El correo electrónico no tiene un formato válido.");
      return;
    }

    if (!formData.password || formData.password.trim() === "") {
      showError("La contraseña es obligatoria.");
      return;
    }

    // Validación de contraseña segura
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      showError(
        "La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula, un número y un carácter especial."
      );
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      showError("El teléfono debe contener 10 dígitos numéricos.");
      return;
    }

    try {
      if (modalTitle === "Crear Nueva Área") {
        // Realiza el POST para crear una nueva área
        const response = await fetch(`${API_BASE_URL}/api/area`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
          throw new Error(
            "Error al crear el área. Verifica los datos enviados."
          );
        }

        // Maneja la respuesta como texto si no es JSON
        const result = await response.text();
        console.log("Respuesta del servidor:", result);

        // Actualiza el estado con los datos enviados (si el servidor no devuelve el área creada)
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

        setSuccessMessage("Área agregada correctamente.");
        setTimeout(() => setSuccessMessage(""), 3000); // Limpia el mensaje después de 3 segundos
      } else if (modalTitle === "Editar Área") {
        // Realiza el PUT para actualizar un área existente
        const response = await fetch(
          `${API_BASE_URL}/api/area/${formData.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Agrega el token en el encabezado
            },
            body: JSON.stringify({
              nameArea: formData.nameArea,
              name: formData.name,
              lastname: formData.lastname,
              email: formData.email,
              phone: formData.phone,
              password: formData.password,
              uuid: formData.id,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            "Error al actualizar el área. Verifica los datos enviados."
          );
        }

        // Actualiza el estado con los datos editados
        setData((prevData) =>
          prevData.map((item) => (item.id === formData.id ? formData : item))
        );

        setSuccessMessage("Área actualizada correctamente.");
        setTimeout(() => setSuccessMessage(""), 3000); // Limpia el mensaje después de 3 segundos
      }

      setModalOpen(false); // Cierra el modal
    } catch (error) {
      showError(`Error al crear o actualizar el área: ${error.message}`);
    }
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem("token"); // Obtiene el token del localStorage

    if (!token) {
      console.error("No se encontró un token en localStorage.");
      return;
    }

    try {
      console.log("ID del área a eliminar:", rowToDelete.id); // Verifica el ID del área a eliminar

      // Realiza el DELETE para eliminar el área
      const response = await fetch(`${API_BASE_URL}/api/area`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Agrega el token en el encabezado
        },
        body: JSON.stringify({ uuid: rowToDelete.id }), // Envía el UUID en el cuerpo
      });

      if (!response.ok) {
        throw new Error(
          "Error al eliminar el área. Verifica tu conexión o el token."
        );
      }

      // Actualiza el estado eliminando el área de la lista
      setData((prevData) =>
        prevData.filter((area) => area.id !== rowToDelete.id)
      );

      // Muestra un mensaje de éxito
      setSuccessMessage("Área eliminada correctamente.");
      setTimeout(() => setSuccessMessage(""), 3000); // Limpia el mensaje después de 3 segundos

      setConfirmAlertOpen(false); // Cierra el modal de confirmación
      setRowToDelete(null); // Limpia la fila seleccionada
    } catch (error) {
      console.error("Error al eliminar el área:", error.message);
    }
  };

  const handleCancelDelete = () => {
    setConfirmAlertOpen(false);
    setRowToDelete(null);
  };

  const areaFields = [
    {
      label: "Área",
      name: "nameArea",
      type: "text",
      placeholder: "Nombre del área",
    },
    {
      label: "Nombre",
      name: "name",
      type: "text",
      placeholder: "Nombre del responsable",
    },
    {
      label: "Apellido",
      name: "lastname",
      type: "text",
      placeholder: "Apellido del responsable",
    },
    {
      label: "Correo",
      name: "email",
      type: "email",
      placeholder: "Correo de contacto",
    },
    {
      label: "Teléfono",
      name: "phone",
      type: "text",
      placeholder: "Teléfono de contacto",
    },
    {
      label: "Contraseña",
      name: "password",
      type: "password",
      placeholder: "Contraseña",
    },
  ];

  return (
    <div className="p-8 bg-transparent">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Gestión de Áreas</h1>
        <ButtonRegister label="Nueva Área" onClick={handleCreate} />
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

      <Table
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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
