import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import ButtonRegister from "../../components/ButtonRegister";
import ModalForm from "../../components/ModalForm";
import ConfirmAlert from "../../components/ConfirmAlert";
import ErrorAlert from "../../components/ErrorAlert";
import API_BASE_URL from "../../api_config";
import LoadingScreen from "../../components/LoadingScreen";

const Colonias = () => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalInitialData, setModalInitialData] = useState(null);
  const [confirmAlertOpen, setConfirmAlertOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showInactive, setShowInactive] = useState(false); // Estado para mostrar/ocultar colonias inactivas
  const [isLoading, setIsLoading] = useState(false); // Estado para la pantalla de carga

  // Función para obtener las colonias desde la API
  const fetchColonias = async () => {
    const token = localStorage.getItem("token"); // Obtiene el token del localStorage

    if (!token) {
      console.error("No se encontró un token en localStorage.");
      return;
    }

    setIsLoading(true); // Muestra la pantalla de carga

    try {
      const response = await fetch(`${API_BASE_URL}/api/colony`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Agrega el token en el encabezado
        },
      });

      if (!response.ok) {
        throw new Error(
          "Error al obtener las colonias. Verifica tu conexión o el token."
        );
      }

      const colonias = await response.json();
      console.log("Colonias obtenidas:", colonias); // Verifica la respuesta de la API

      // Filtra las colonias según el estado `showInactive`
      const filteredColonias = colonias.filter((colonia) =>
        showInactive ? colonia.status === false : colonia.status !== false
      );

      // Mapea los datos para adaptarlos al formato esperado por la tabla
      const formattedData = filteredColonias.map((colonia) => ({
        id: colonia.uuid,
        colonia: colonia.nameColony,
        nombre: colonia.personBean.name,
        apellido: colonia.personBean.lastname,
        correo: colonia.personBean.email,
        telefono: colonia.personBean.phone,
        status: colonia.status, // Incluye el status para usarlo en la tabla
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Error al obtener las colonias:", error.message);
    } finally {
      setIsLoading(false); // Oculta la pantalla de carga
    }
  };

  useEffect(() => {
    fetchColonias(); // Llama a la función para obtener las colonias al cargar el componente
  }, [showInactive]); // Vuelve a ejecutar cuando cambia `showInactive`

  const columns = [
    { header: "Colonia", accessor: "colonia" },
    { header: "Nombre", accessor: "nombre" },
    { header: "Apellido", accessor: "apellido" },
    { header: "Correo", accessor: "correo" },
    { header: "Teléfono", accessor: "telefono" },
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

  const handleCreate = () => {
    setModalTitle("Crear Nuevo Presidente");
    setModalInitialData({
      id: "",
      colonia: "",
      nombre: "",
      apellido: "",
      correo: "",
      telefono: "",
      password: "",
    });
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    const phoneWithoutCountryCode = row.telefono.slice(-10);
    setModalTitle("Editar Contacto");
    setModalInitialData({
      id: row.id,
      correo: row.correo,
      telefono: phoneWithoutCountryCode,
    });
    setModalOpen(true);
  };

  const handleDelete = (row) => {
    setRowToDelete(row);
    setConfirmAlertOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    const token = localStorage.getItem("token"); // Obtiene el token del localStorage

    if (!token) {
      setErrorMessage("No se encontró un token en localStorage.");
      return;
    }

    try {
      if (modalTitle === "Crear Nuevo Presidente") {
        // Validaciones para creación
        if (!formData.colonia || formData.colonia.trim() === "") {
          setErrorMessage("El nombre de la colonia es obligatorio.");
          return;
        }

        if (!formData.nombre || formData.nombre.trim() === "") {
          setErrorMessage("El nombre del enlace es obligatorio.");
          return;
        }

        if (!formData.apellido || formData.apellido.trim() === "") {
          setErrorMessage("El apellido del enlace es obligatorio.");
          return;
        }

        if (!formData.correo || formData.correo.trim() === "") {
          setErrorMessage("El correo electrónico es obligatorio.");
          return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(formData.correo)) {
          setErrorMessage("El correo electrónico no tiene un formato válido.");
          return;
        }

        if (!formData.password || formData.password.trim() === "") {
          setErrorMessage("La contraseña es obligatoria.");
          return;
        }

        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
          setErrorMessage(
            "La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula, un número y un carácter especial."
          );
          return;
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!formData.telefono || !phoneRegex.test(formData.telefono)) {
          setErrorMessage("El teléfono debe contener 10 dígitos numéricos.");
          return;
        }

        setIsLoading(true);

        // Agregar el prefijo +52 al número de teléfono
        const formattedPhone = `+52${formData.telefono}`;

        // Realiza el POST para crear un nuevo presidente
        const response = await fetch(`${API_BASE_URL}/api/colony`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            colonyName: formData.colonia,
            name: formData.nombre,
            lastname: formData.apellido,
            email: formData.correo,
            phone: formattedPhone,
            password: formData.password,
          }),
        });

        if (!response.ok) {
          throw new Error(
            "Error al crear la colonia. Verifica los datos enviados."
          );
        }

        const result = await response.text();
        console.log("Respuesta del servidor:", result);

        setData((prevData) => [
          ...prevData,
          {
            id: Date.now(),
            colonia: formData.colonia,
            nombre: formData.nombre,
            apellido: formData.apellido,
            correo: formData.correo,
            telefono: formData.telefono,
          },
        ]);

        setSuccessMessage("Colonia agregada correctamente.");
        setTimeout(() => setSuccessMessage(""), 3000);
        setTimeout(() => fetchColonias(), 1000);
      } else if (modalTitle === "Editar Contacto") {
        // Validaciones para edición
        if (!formData.correo || formData.correo.trim() === "") {
          setErrorMessage("El correo electrónico es obligatorio.");
          return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(formData.correo)) {
          setErrorMessage("El correo electrónico no tiene un formato válido.");
          return;
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!formData.telefono || !phoneRegex.test(formData.telefono)) {
          setErrorMessage("El teléfono debe contener 10 dígitos numéricos.");
          return;
        }

        // Agregar el prefijo +52 al número de teléfono
        const formattedPhone = `+52${formData.telefono}`;

        // Realiza el PUT para actualizar el contacto
        const response = await fetch(`${API_BASE_URL}/api/colony`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            uuid: formData.id, // Enviar el UUID del elemento seleccionado
            email: formData.correo,
            phone: formattedPhone,
          }),
        });

        if (!response.ok) {
          throw new Error(
            "Error al actualizar el contacto. Verifica los datos enviados."
          );
        }

        setData((prevData) =>
          prevData.map((item) =>
            item.id === formData.id
              ? {
                  ...item,
                  correo: formData.correo,
                  telefono: formData.telefono,
                }
              : item
          )
        );

        setSuccessMessage("Contacto actualizado correctamente.");
        setTimeout(() => setSuccessMessage(""), 3000);
        setTimeout(() => fetchColonias(), 1000);
      }

      setModalOpen(false); // Cierra el modal
    } catch (error) {
      console.error("Error al procesar la solicitud:", error.message);
      setErrorMessage("Ocurrió un error al procesar la solicitud.");
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
      console.log(rowToDelete); // Verifica el valor de rowToDelete

      // Realiza el DELETE para eliminar la colonia
      const response = await fetch(`${API_BASE_URL}/api/colony`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Agrega el token en el encabezado
        },
        body: JSON.stringify({ uuid: rowToDelete.id }), // Envía el UUID en el cuerpo
      });

      if (!response.ok) {
        throw new Error(
          "Error al eliminar la colonia. Verifica tu conexión o el token."
        );
      }

      // Actualiza el estado eliminando la colonia de la lista
      setData((prevData) =>
        prevData.filter((item) => item.id !== rowToDelete.id)
      );
      setSuccessMessage("Colonia eliminada correctamente.");
      setTimeout(() => setSuccessMessage(""), 3000); // Limpia el mensaje después de 3 segundos
      
      setConfirmAlertOpen(false); // Cierra el modal de confirmación
      setRowToDelete(null); // Limpia la fila seleccionada
      setIsLoading(false); // Oculta la pantalla de carga
    } catch (error) {
      console.error("Error al eliminar la colonia:", error.message);
    }
  };

  const handleCancelDelete = () => {
    setConfirmAlertOpen(false);
    setRowToDelete(null);
  };

  const handleTransfer = (row) => {
    setModalTitle("Transferir Presidente");
    setModalInitialData({
      uuid: row.id,
      colonyName: row.colonia,
      name: "",
      lastname: "",
      correo: "",
      telefono: "",
      password: "",
    });
    setModalOpen(true);
  };

  const handleTransferSubmit = async (formData) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("No se encontró un token en localStorage.");
      return;
    }

    setIsLoading(true); // Muestra la pantalla de carga

    try {
      // Validaciones de los campos
      if (!formData.name || formData.name.trim() === "") {
        setErrorMessage("El nombre del responsable es obligatorio.");
        return;
      }

      if (!formData.lastname || formData.lastname.trim() === "") {
        setErrorMessage("El apellido del responsable es obligatorio.");
        return;
      }

      if (!formData.correo || formData.correo.trim() === "") {
        setErrorMessage("El correo electrónico es obligatorio.");
        return;
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.correo)) {
        setErrorMessage("El correo electrónico no tiene un formato válido.");
        return;
      }

      if (!formData.password || formData.password.trim() === "") {
        setErrorMessage("La contraseña es obligatoria.");
        return;
      }

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        setErrorMessage(
          "La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula, un número y un carácter especial."
        );
        return;
      }

      const phoneRegex = /^[0-9]{10}$/;
      if (!formData.telefono || !phoneRegex.test(formData.telefono)) {
        setErrorMessage("El teléfono debe contener 10 dígitos numéricos.");
        return;
      }

      const formattedPhone = `+52${formData.telefono}`;

      const response = await fetch(`${API_BASE_URL}/api/colony/transfer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uuid: formData.uuid,
          colonyName: formData.colonyName,
          password: formData.password,
          email: formData.correo,
          name: formData.name,
          lastname: formData.lastname,
          phone: formattedPhone,
        }),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Detalles del error:", errorDetails);
        throw new Error(
          "Error al transferir el presidente. Verifica los datos."
        );
      }

      setSuccessMessage(
        "Transferencia realizada correctamente. La cuenta actual será bloqueada y cerrará sesión."
      );
      setTimeout(() => setSuccessMessage(""), 3000);
      setModalOpen(false); // Cierra el modal
      fetchColonias();
    } catch (error) {
      console.error("Error al transferir el presidente:", error.message);
      setErrorMessage("Ocurrió un error al procesar la transferencia.");
    } finally {
      setIsLoading(false); // Oculta la pantalla de carga
    }
  };

  const coloniaFieldsCreate = [
    {
      label: "Colonia",
      name: "colonia",
      type: "text",
      placeholder: "Ingrese el nombre de la colonia",
    },
    {
      label: "Nombre",
      name: "nombre",
      type: "text",
      placeholder: "Ingrese el nombre del enlace",
    },
    {
      label: "Apellido",
      name: "apellido",
      type: "text",
      placeholder: "Ingrese el apellido del enlace",
    },
    {
      label: "Correo",
      name: "correo",
      type: "email",
      placeholder: "Ingrese el correo electrónico",
    },
    {
      label: "Teléfono",
      name: "telefono",
      type: "text",
      placeholder: "Ingrese el teléfono",
    },
    {
      label: "Contraseña",
      name: "password",
      type: "password",
      placeholder: "Ingrese la contraseña",
    },
  ];

  const coloniaFieldsEdit = [
    {
      label: "Correo",
      name: "correo",
      type: "email",
      placeholder: "Ingrese el correo electrónico",
    },
    {
      label: "Teléfono",
      name: "telefono",
      type: "text",
      placeholder: "Ingrese el teléfono",
    },
  ];

  return (
    <div className="p-8 bg-transparent">
      {isLoading && <LoadingScreen />} {/* Muestra la pantalla de carga */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Gestión de Presidentes</h1>
        <div className="flex space-x-4">
          <ButtonRegister label="Nuevo Presidente" onClick={handleCreate} />
          <button
            onClick={handleToggleInactive}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
          >
            {showInactive ? "Mostrar Activos" : "Mostrar Inactivos"}
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
        showActions={!showInactive} // Oculta las acciones si se muestran colonias inactivas
      />
      {modalOpen && (
        <ModalForm
          title={modalTitle}
          fields={
            modalTitle === "Crear Nuevo Presidente"
              ? coloniaFieldsCreate
              : modalTitle === "Transferir Presidente"
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
                    name: "correo",
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
                    name: "telefono",
                    type: "text",
                    placeholder: "Teléfono de contacto",
                  },
                ]
              : coloniaFieldsEdit
          }
          initialData={modalInitialData}
          onSubmit={
            modalTitle === "Crear Nuevo Presidente"
              ? handleModalSubmit
              : modalTitle === "Transferir Presidente"
              ? handleTransferSubmit
              : handleModalSubmit
          }
          onClose={() => setModalOpen(false)}
          type={
            modalTitle === "Crear Nuevo Presidente"
              ? "create"
              : modalTitle === "Transferir Presidente"
              ? "transfer"
              : "edit"
          }
        />
      )}
      {confirmAlertOpen && (
        <ConfirmAlert
          message="El perfil pasara a inactivo, ¿estás seguro de que deseas eliminarlo?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default Colonias;
