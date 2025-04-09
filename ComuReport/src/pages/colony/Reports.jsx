import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import ButtonRegister from "../../components/ButtonRegister";
import ModalForm from "../../components/ModalForm";
import ConfirmAlert from "../../components/ConfirmAlert";
import Badge from "../../components/Badge";
import ErrorAlert from "../../components/ErrorAlert";
import API_BASE_URL from "../../api_config";

const Reports = () => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalInitialData, setModalInitialData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const columns = [
    { header: "Título", accessor: "title" },
    { header: "Fecha", accessor: "date" },
    {
      header: "Estado",
      accessor: "status",
      cell: (row) => <Badge status={row.status} />,
    },
    { header: "Colonia", accessor: "colonyName" },
    { header: "Municipio", accessor: "municipalityName" },
    {
      header: "Evidencias",
      accessor: "image",
      cell: (row) =>
        row.image && row.image.length > 0
          ? row.image.map((file, idx) => (
              <img
                key={idx}
                src={file.url}
                alt="Evidencia"
                onClick={() => setPreviewImage(file.url)} // Muestra la vista previa al hacer clic
                className="w-10 h-10 object-cover cursor-pointer mr-2"
              />
            ))
          : "Sin evidencias",
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
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/report`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          "Error al obtener los reportes. Verifica tu conexión o el token."
        );
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
    setModalTitle("Crear Nuevo Reporte");
    setModalInitialData({ title: "", description: "", file: [] });
    setModalOpen(true);
  };

  const handleModalSubmit = async (formDataToSend) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("No se encontró un token en localStorage.");
      return;
    }

    // Validaciones de los campos
    if (
      !formDataToSend.get("title") ||
      formDataToSend.get("title").trim() === ""
    ) {
      setErrorMessage("El título del reporte es obligatorio.");
      return;
    }

    if (
      !formDataToSend.get("description") ||
      formDataToSend.get("description").trim() === ""
    ) {
      setErrorMessage("La descripción del reporte es obligatoria.");
      return;
    }

    // Validación de longitud de caracteres
    if (formDataToSend.get("title").length > 100) {
      setErrorMessage("El título no puede exceder los 100 caracteres.");
      return;
    }

    if (formDataToSend.get("description").length > 500) {
      setErrorMessage("La descripción no puede exceder los 500 caracteres.");
      return;
    }

    // Validación de imágenes
    const files = formDataToSend.getAll("file");
    if (!files || files.length === 1) {
      setErrorMessage("Debes subir al menos una imagen.");
      return;
    }

    if (files.length > 3) {
      setErrorMessage("Solo puedes subir un máximo de 3 imágenes.");
      return;
    }

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("Cada imagen debe pesar menos de 10 MB.");
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/report`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Asegúrate de que el token esté en el formato correcto
        },
        body: formDataToSend, // Enviar el FormData directamente
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("No autorizado. Por favor, verifica tu sesión.");
        }
        throw new Error("Error al registrar el reporte.");
      }

      showSuccess("Reporte registrado correctamente.");
      fetchReports();
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

      {previewImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-40 backdrop-blur-sm z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Vista previa"
            className="h-1/2 max-h-screen object-contain"
          />
        </div>
      )}

      <Table columns={columns} data={data} showActions={false} />

      {modalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm z-40"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">{modalTitle}</h3>
            <ModalForm
              title={modalTitle}
              fields={[
                {
                  label: "Título",
                  name: "title",
                  type: "text",
                  placeholder: "Ingrese el título del reporte",
                  required: true,
                },
                {
                  label: "Descripción",
                  name: "description",
                  type: "text",
                  placeholder: "Ingrese la descripción del reporte",
                  required: true,
                },
                {
                  label: "Evidencias (máx 3, JPG/PNG, 10MB c/u)",
                  name: "images",
                  type: "images",
                  required: true,
                },
              ]}
              initialData={modalInitialData}
              onSubmit={handleModalSubmit}
              onClose={() => setModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
