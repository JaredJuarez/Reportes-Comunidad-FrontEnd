import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import ButtonRegister from "../../components/ButtonRegister";
import ModalForm from "../../components/ModalForm";
import ConfirmAlert from "../../components/ConfirmAlert";
import ErrorAlert from "../../components/ErrorAlert";
import API_BASE_URL from "../../api_config";
import LoadingScreen from "../../components/LoadingScreen";

const Municipios = () => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalInitialData, setModalInitialData] = useState(null);
  const [confirmAlertOpen, setConfirmAlertOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(null); // Estado para manejar el mensaje de error
  const [isLoading, setIsLoading] = useState(false); // Estado para la pantalla de carga
  const [showInactive, setShowInactive] = useState(false); // Estado para alternar entre activos e inactivos

  // Función para mostrar el mensaje de error
  const showError = (message) => {
    setErrorMessage(message);
  };

  // Función para obtener los municipios desde la API
  const fetchMunicipios = async () => {
    const token = localStorage.getItem("token"); // Obtiene el token del localStorage

    if (!token) {
      console.error("No se encontró un token en localStorage.");
      return;
    }
    setIsLoading(true); // Muestra la pantalla de carga

    try {
      const response = await fetch(`${API_BASE_URL}/api/municipality`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Agrega el token en el encabezado
        },
      });

      if (!response.ok) {
        throw new Error(
          "Error al obtener los municipios. Verifica tu conexión o el token."
        );
      }

      const municipios = await response.json();

      // Filtra los municipios según el estado `showInactive`
      const filteredMunicipios = municipios.filter((municipio) =>
        showInactive ? municipio.status === false : municipio.status === true
      );

      // Mapea los datos para adaptarlos al formato esperado por la tabla
      const formattedData = filteredMunicipios.map((municipio) => ({
        id: municipio.uuid,
        nameMunicipality: municipio.nameMunicipality,
        name: municipio.personBean.name,
        lastname: municipio.personBean.lastname,
        email: municipio.personBean.email,
        phone: municipio.personBean.phone,
        status: municipio.status,
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Error al obtener los municipios:", error.message);
    } finally {
      setIsLoading(false); // Oculta la pantalla de carga
    }
  };

  useEffect(() => {
    fetchMunicipios(); // Llama a la función para obtener los municipios al cargar el componente
  }, [showInactive]);

  const columns = [
    { header: "Municipio", accessor: "nameMunicipality" },
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
    setShowInactive((prev) => !prev); // Alterna entre mostrar activos e inactivos
  };

  const handleCreate = () => {
    setModalTitle("Crear Nuevo Municipio");
    setModalInitialData({
      nameMunicipality: "",
      name: "",
      lastname: "",
      email: "",
      phone: "",
      password: "",
    });
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    const phoneWithoutCountryCode = row.phone.slice(-10);
    setModalTitle("Editar Municipio");
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

  const handleTransfer = (row) => {
    setModalTitle("Transferir Municipio");
    setModalInitialData({
      uuid: row.id,
      municipalityName: row.nameMunicipality,
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

      // Agregar el prefijo +52 al número de teléfono
      const formattedPhone = `${formData.phone}`;

      console.log("Datos enviados:", {
        uuid: formData.uuid,
        municipalityName: formData.municipalityName,
        password: formData.password,
        email: formData.email,
        name: formData.name,
        lastname: formData.lastname,
        phone: formattedPhone,
      });
      

      const response = await fetch(
        `${API_BASE_URL}/api/municipality/transfer`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            uuid: formData.uuid,
            nameMunicipality: formData.municipalityName,
            password: formData.password,
            email: formData.email,
            name: formData.name,
            lastname: formData.lastname,
            phone: formattedPhone,
          }),
        }
      );

      if (!response.ok) {
        console.error("Error en la respuesta:", response.statusText);
        const errorText = await response.text();
        console.error("Texto de error:", errorText);
        showError("Error al transferir el municipio. Verifica los datos.");
        throw new Error(
          "Error al transferir el municipio. Verifica los datos enviados."
        );
      }

      setSuccessMessage(
        "Transferencia realizada correctamente. La cuenta actual será bloqueada y cerrará sesión."
      );
      setTimeout(() => setSuccessMessage(""), 3000);

      setModalOpen(false); // Cierra el modal
      fetchMunicipios(); // Actualiza la lista de municipios
      setTimeout(() => {
        localStorage.clear(); // Borra todo el localStorage
        window.location.href = "/"; // Redirige a la página principal
      }, 3000); // Cierra sesión después de 3 segundos
    } catch (error) {
      console.error("Error al transferir el municipio:", error.message);
      showError("Ocurrió un error al procesar la transferencia.");
    } finally {
      setIsLoading(false); // Oculta la pantalla de carga
    }
  };

  const handleModalSubmit = async (formData) => {
    const token = localStorage.getItem("token");

    if (!token) {
      showError("No se encontró un token en localStorage.");
      return;
    }

    try {
      if (modalTitle === "Crear Nuevo Municipio") {
        // Validaciones de los campos
        if (
          !formData.nameMunicipality ||
          formData.nameMunicipality.trim() === ""
        ) {
          showError("El nombre del municipio es obligatorio.");
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

        setIsLoading(true);

        // Agregar el prefijo +52 al número de teléfono
        const formattedPhone = `+52${formData.phone}`;

        const response = await fetch(`${API_BASE_URL}/api/municipality`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nameMunicipality: formData.nameMunicipality,
            password: formData.password,
            email: formData.email,
            name: formData.name,
            lastname: formData.lastname,
            phone: formattedPhone,
          }),
        });

        if (!response.ok) {
          throw new Error(
            "Error al crear el municipio. Verifica los datos enviados."
          );
        }

        const result = await response.text();
        console.log("Respuesta del servidor:", result);

        setData((prevData) => [
          ...prevData,
          {
            nameMunicipality: formData.nameMunicipality,
            name: formData.name,
            lastname: formData.lastname,
            email: formData.email,
            phone: formData.phone,
          },
        ]);

        setSuccessMessage("Municipio agregado correctamente.");
        setTimeout(() => setSuccessMessage(""), 3000);
        setTimeout(() => fetchMunicipios(), 1000);
      } else if (modalTitle === "Editar Municipio") {
        // Validaciones para edición
        if (!formData.email || formData.email.trim() === "") {
          showError("El correo electrónico es obligatorio.");
          return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          showError("El correo electrónico no tiene un formato válido.");
          return;
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!formData.phone || !phoneRegex.test(formData.phone)) {
          showError("El teléfono debe contener 10 dígitos numéricos.");
          return;
        }

        // Agregar el prefijo +52 al número de teléfono
        const formattedPhone = `+52${formData.phone}`;

        const response = await fetch(`${API_BASE_URL}/api/municipality`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            uuid: formData.id,
            email: formData.email,
            phone: formattedPhone,
          }),
        });

        if (!response.ok) {
          throw new Error(
            "Error al actualizar el municipio. Verifica los datos enviados."
          );
        }

        setData((prevData) =>
          prevData.map((item) => (item.id === formData.id ? formData : item))
        );

        setSuccessMessage("Municipio actualizado correctamente.");
        setTimeout(() => setSuccessMessage(""), 3000);
        setTimeout(() => fetchMunicipios(), 1000);
      }

      setModalOpen(false); // Cierra el modal solo si no hay errores
    } catch (error) {
      console.error("Error al crear o actualizar el municipio:", error.message);
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
      // Realiza el DELETE para eliminar el municipio
      const response = await fetch(`${API_BASE_URL}/api/municipality`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Agrega el token en el encabezado
        },
        body: JSON.stringify({ uuid: rowToDelete.id }), // Envía el UUID en el cuerpo
      });

      if (!response.ok) {
        throw new Error(
          "Error al eliminar el municipio. Verifica tu conexión o el token."
        );
      }

      // Actualiza el estado eliminando el municipio de la lista
      setData((prevData) =>
        prevData.filter((item) => item.id !== rowToDelete.id)
      );

      setSuccessMessage("Municipio eliminado correctamente.");
      setTimeout(() => setSuccessMessage(""), 3000); // Limpia el mensaje después de 3 segundos

      setConfirmAlertOpen(false); // Cierra el modal de confirmación
      setRowToDelete(null); // Limpia la fila seleccionada
    } catch (error) {
      console.error("Error al eliminar el municipio:", error.message);
    } finally {
      setIsLoading(false); // Oculta la pantalla de carga
    }
  };

  const handleCancelDelete = () => {
    setConfirmAlertOpen(false);
    setRowToDelete(null);
  };

  const municipioFieldsCreate = [
    {
      label: "Nombre del Municipio",
      name: "nameMunicipality",
      type: "text",
      placeholder: "Ingrese el nombre del municipio",
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
  ];

  const municipioFieldsEdit = [
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
      {isLoading && <LoadingScreen />} {/* Pantalla de carga */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Gestión de Municipios</h1>
        <div className="flex space-x-4">
          <ButtonRegister label="Nuevo Municipio" onClick={handleCreate} />
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
        onTransfer={handleTransfer} // No se usa en este caso
        showActions={!showInactive} // Oculta las acciones si se muestran municipios inactivos
      />
      {modalOpen && (
        <ModalForm
          title={modalTitle}
          fields={
            modalTitle === "Crear Nuevo Municipio"
              ? municipioFieldsCreate
              : modalTitle === "Transferir Municipio"
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
              : municipioFieldsEdit
          }
          initialData={modalInitialData}
          onSubmit={
            modalTitle === "Crear Nuevo Municipio"
              ? handleModalSubmit
              : modalTitle === "Transferir Municipio"
              ? handleTransferSubmit
              : handleModalSubmit
          }
          onClose={() => setModalOpen(false)}
          type={
            modalTitle === "Crear Nuevo Municipio"
              ? "create"
              : modalTitle === "Transferir Municipio"
              ? "transfer"
              : "edit"
          }
        >
        </ModalForm>
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

export default Municipios;
