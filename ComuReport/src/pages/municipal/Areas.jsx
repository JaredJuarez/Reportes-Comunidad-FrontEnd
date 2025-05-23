import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import ButtonRegister from "../../components/ButtonRegister";
import ModalForm from "../../components/ModalForm";
import ConfirmAlert from "../../components/ConfirmAlert";
import ErrorAlert from "../../components/ErrorAlert";
import API_BASE_URL from "../../api_config";
import LoadingScreen from "../../components/LoadingScreen";

const Areas = () => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalInitialData, setModalInitialData] = useState(null);
  const [confirmAlertOpen, setConfirmAlertOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(null); // Estado para manejar el mensaje de error
  const [showInactive, setShowInactive] = useState(false); // Estado para alternar entre activas e inactivas
  const [isLoading, setIsLoading] = useState(false); // Estado para la pantalla de carga

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
    setIsLoading(true); // Muestra la pantalla de carga

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

      // Filtra las áreas según el estado `showInactive`
      const filteredAreas = areas.filter((area) =>
        showInactive ? area.status === false : area.status === true
      );

      // Mapea los datos filtrados para adaptarlos al formato esperado por la tabla
      const formattedData = filteredAreas.map((area) => ({
        id: area.uuid,
        nameArea: area.nameArea,
        name: area.personBean.name,
        lastname: area.personBean.lastname,
        email: area.personBean.email,
        phone: area.personBean.phone,
        status: area.status, // Incluye el status para usarlo en la tabla
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Error al obtener las áreas:", error.message);
    } finally {
      setIsLoading(false); // Oculta la pantalla de carga
    }
  };

  useEffect(() => {
    fetchAreas(); // Llama a la función para obtener las colonias al cargar el componente
  }, [showInactive]);

  const columns = [
    { header: "Área", accessor: "nameArea" },
    { header: "Nombre", accessor: "name" },
    { header: "Apellido", accessor: "lastname" },
    { header: "Correo", accessor: "email" },
    { header: "Teléfono", accessor: "phone" },
    {
      header: "Estado",
      accessor: "status",
      cell: (row) =>
        row.status ? (
          <span className="text-green-500 font-semibold">Activo</span>
        ) : (
          <span className="text-red-500 font-semibold">Inactivo</span>
        ),
    },
  ];

  const handleToggleInactive = () => {
    setShowInactive((prev) => !prev); // Alterna entre mostrar activas e inactivas
  };

  const handleEdit = (row) => {
    const phoneWithoutCountryCode = row.phone.slice(-10);
    setModalTitle("Editar Área");
    setModalInitialData({
      id: row.id,
      email: row.email,
      phone: phoneWithoutCountryCode,
    });
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
    const token = localStorage.getItem("token"); // Obtiene el token del localStorage

    if (!token) {
      showError("No se encontró un token en localStorage.");
      return;
    }

    // Validaciones comunes
    if (!formData.email || formData.email.trim() === "") {
      showError("El correo electrónico es obligatorio.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      showError("El correo electrónico no tiene un formato válido.");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      showError("El teléfono debe contener 10 dígitos numéricos.");
      return;
    }

    // Si todas las validaciones pasan, activa la pantalla de carga
    setIsLoading(true);

    // Agregar el prefijo +52 al número de teléfono
    const formattedPhone = `+52${formData.phone}`;
    console.log("Formatted Phone:", formattedPhone); // Verifica el número de teléfono formateado
    

    try {
      if (modalTitle === "Crear Nueva Área") {
        // Realiza el POST para crear una nueva área
        const response = await fetch(`${API_BASE_URL}/api/area`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nameArea: formData.nameArea,
            name: formData.name,
            lastname: formData.lastname,
            email: formData.email,
            phone: formattedPhone,
            password: formData.password,
          }),
        });

        if (!response.ok) {
          throw new Error(
            "Error al crear el área. Verifica los datos enviados."
          );
        }

        setSuccessMessage("Área agregada correctamente.");
        setTimeout(() => setSuccessMessage(""), 3000);
        setTimeout(() => fetchAreas(), 1000); // Actualiza la lista de áreas
      } else if (modalTitle === "Editar Área") {
        // Realiza el PUT para actualizar un área existente
        const response = await fetch(
          `${API_BASE_URL}/api/area`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              email: formData.email,
              phone: formattedPhone,
              uuid: formData.id,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            "Error al actualizar el área. Verifica los datos enviados."
          );
        }

        setSuccessMessage("Área actualizada correctamente.");
        setTimeout(() => setSuccessMessage(""), 3000);

        // Llama a fetchAreas para obtener los datos actualizados
        await fetchAreas();
      }

      setModalOpen(false); // Cierra el modal
    } catch (error) {
      console.error("Error al procesar la solicitud:", error.message);
      showError("Ocurrió un error al procesar la solicitud.");
    } finally {
      setIsLoading(false); // Oculta la pantalla de carga
    }
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem("token"); // Obtiene el token del localStorage

    if (!token) {
      console.error("No se encontró un token en localStorage.");
      return;
    }
    setIsLoading(true); // Muestra la pantalla de carga

    try {
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
    } finally {
      setIsLoading(false); // Oculta la pantalla de carga
    }
  };

  const handleTransfer = (row) => {
    setModalTitle("Transferir Responsable de Área");
    setModalInitialData({
      uuid: row.id,
      areaName: row.nameArea,
      name: "",
      lastname: "",
      email: "",
      phone: "",
      password: "",
    });
    setModalOpen(true);
  };

  const handleTransferSubmit = async (formData) => {
    const token = localStorage.getItem("token");

    if (!token) {
      showError("No se encontró un token en localStorage.");
      return;
    }

    setIsLoading(true); // Muestra la pantalla de carga

    try {
      // Validaciones de los campos
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

      const formattedPhone = `+52${formData.phone}`; // Con prefijo

      const response = await fetch(`${API_BASE_URL}/api/area/transfer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uuid: formData.uuid,
          nameArea: formData.areaName,
          password: formData.password,
          email: formData.email,
          name: formData.name,
          lastname: formData.lastname,
          phone: formattedPhone,
        }),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Detalles del error:", errorDetails);
        throw new Error(
          "Error al transferir el responsable del área. Verifica los datos."
        );
      }

      setSuccessMessage(
        "Transferencia realizada correctamente. La cuenta actual será bloqueada y cerrará sesión."
      );
      setTimeout(() => setSuccessMessage(""), 3000);

      setModalOpen(false); // Cierra el modal
      fetchAreas(); // Actualiza la lista de áreas
      setIsLoading(false); // Oculta la pantalla de carga
    } catch (error) {
      console.error(
        "Error al transferir el responsable del área:",
        error.message
      );
      showError("Ocurrió un error al procesar la transferencia.");
    } finally {
      setIsLoading(false); // Oculta la pantalla de carga
    }
  };

  const areaFieldsCreate = [
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

  const areaFieldsEdit = [
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
  ];

  return (
    <div className="p-8 bg-transparent">
      {isLoading && <LoadingScreen />} {/* Muestra la pantalla de carga */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Gestión de Áreas</h1>
        <div className="flex space-x-4">
          <ButtonRegister label="Nueva Área" onClick={handleCreate} />
          <button
            onClick={handleToggleInactive}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
          >
            {showInactive ? "Mostrar Activas" : "Mostrar Inactivas"}
          </button>
        </div>
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
        onTransfer={handleTransfer} // Agrega esta línea
        showActions={!showInactive} // Oculta las acciones si se muestran áreas inactivas
      />
      {modalOpen && (
        <ModalForm
          title={modalTitle}
          fields={
            modalTitle === "Crear Nueva Área"
              ? areaFieldsCreate
              : modalTitle === "Transferir Responsable de Área"
              ? [
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
                    label: "Contraseña",
                    name: "password",
                    type: "password",
                    placeholder: "Ingrese la contraseña",
                  },
                  {
                    label: "Teléfono",
                    name: "phone",
                    type: "text",
                    placeholder: "Teléfono de contacto",
                  },
                ]
              : areaFieldsEdit
          }
          initialData={modalInitialData}
          onSubmit={
            modalTitle === "Crear Nueva Área"
              ? handleModalSubmit
              : modalTitle === "Transferir Responsable de Área"
              ? handleTransferSubmit
              : handleModalSubmit
          }
          onClose={() => setModalOpen(false)}
          type={
            modalTitle === "Crear Nueva Área"
              ? "create"
              : modalTitle === "Transferir Responsable de Área"
              ? "transfer"
              : "edit"
          }
        />
      )}
      {confirmAlertOpen && (
        <ConfirmAlert
          message="¿Estás seguro de eliminar esta área?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmAlertOpen(false)}
        />
      )}
    </div>
  );
};

export default Areas;
