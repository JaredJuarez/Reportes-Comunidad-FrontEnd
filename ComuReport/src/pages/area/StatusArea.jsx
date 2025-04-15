import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import API_BASE_URL from "../../api_config";
import Badge from "../../components/Badge";
import ErrorAlert from "../../components/ErrorAlert";

const StatusArea = () => {
  const [data, setData] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [statusDescription, setStatusDescription] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  // Función para mostrar el mensaje de error
  const showError = (message) => {
    setErrorMessage(message);
  };

  const fetchProblems = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No se encontró un token en localStorage.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/report`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          "Error al obtener los problemas. Verifica tu conexión o el token."
        );
      }

      const problems = await response.json();

      const formattedData = problems.map((problem) => ({
        id: problem.uuid,
        title: problem.title,
        description: problem.description || "Sin descripción",
        status: problem.status,
        date: problem.date,
        colonyName: problem.colonyName,
        municipalityName: problem.municipalityName,
        images: problem.image || [],
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Error al obtener los problemas:", error.message);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleCancelReport = (report) => {
    setSelectedReport(report);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!statusDescription.trim()) {
      showError("La descripción de la cancelación es obligatoria.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_BASE_URL}/api/report/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uuid: selectedReport.id,
          statusDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al cancelar el reporte. Intenta nuevamente.");
      }
      setCancelModalOpen(false);
      setStatusDescription("");
      fetchProblems(); // Actualiza la lista de problemas
    } catch (error) {
      console.error("Error al cancelar el reporte:", error.message);
      showError("Error al cancelar el reporte.");
    }
  };

  const handleSendToArea = (report) => {
    setSelectedReport(report);
    setConfirmOpen(true);
  };

  const handleConfirmSend = async () => {
    if (!statusDescription.trim()) {
      showError("La descripción del estatus es obligatoria.");
      return;
    }
    if (!statusDescription.trim()) {
      console.error("La descripción del estatus es obligatoria.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/report`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uuid: selectedReport.id,
          statusDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el problema. Intenta nuevamente.");
      }
      setConfirmOpen(false);
      setStatusDescription("");
      fetchProblems();
    } catch (error) {
      console.error("Error al actualizar el problema:", error.message);
    }
  };

  const columns = [
    { header: "Título", accessor: "title" },
    { header: "Descripción", accessor: "description" },
    {
      header: "Estado",
      accessor: "status",
      cell: (row) => <Badge status={row.status} />,
    },
    { header: "Fecha", accessor: "date" },
    { header: "Colonia", accessor: "colonyName" },
    { header: "Municipio", accessor: "municipalityName" },
    {
      header: "Evidencias",
      accessor: "images",
      cell: (row) =>
        row.images && row.images.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {row.images.map((image, idx) => (
              <img
                key={idx}
                src={image.url}
                alt={image.image}
                className="w-12 h-12 object-cover cursor-pointer rounded-md shadow-md hover:opacity-80"
                onClick={() => setPreviewImage(image.url)}
              />
            ))}
          </div>
        ) : (
          <span className="text-gray-500 italic">Sin evidencias</span>
        ),
    },
    {
      header: "Actualizar Estado",
      accessor: "actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleSendToArea(row)}
            className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition-all cursor-pointer"
          >
            Realizado
          </button>
          <button
            onClick={() => handleCancelReport(row)}
            className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition-all cursor-pointer"
          >
            Cancelado
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 bg-transparent">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Gestión de Problemas del Área</h1>
      </div>
      {errorMessage && (
        <ErrorAlert
          message={errorMessage}
          onClose={() => setErrorMessage(null)} // Limpia el mensaje de error al cerrar
        />
      )}
      <Table columns={columns} data={data} showActions={false} />
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
      {confirmOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-40 backdrop-blur-sm z-40"
          onClick={() => setConfirmOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">
              Confirmar Actualización de Estado
            </h3>
            <label className="block text-gray-700 mb-2">
              Descripción del estatus
            </label>
            <textarea
              value={statusDescription}
              onChange={(e) => setStatusDescription(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded mb-4"
              placeholder="Ingresa la descripción del estatus"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSend}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
      {cancelModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-40 backdrop-blur-sm z-40"
          onClick={() => setCancelModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">
              Confirmar Cancelación del Reporte
            </h3>
            <label className="block text-gray-700 mb-2">
              Descripción de la cancelación
            </label>
            <textarea
              value={statusDescription}
              onChange={(e) => setStatusDescription(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded mb-4"
              placeholder="Ingresa la descripción de la cancelación"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusArea;
