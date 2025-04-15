import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import API_BASE_URL from "../../api_config";
import Badge from "../../components/Badge";

const StatusArea = () => {
  const [data, setData] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

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

  const handleSendToArea = (report) => {
    setSelectedReport(report);
    setConfirmOpen(true);
  };

  const handleConfirmSend = async () => {
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
          statusDescription: "Se realizo con eficacia el asunto",
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el problema. Intenta nuevamente.");
      }

      console.log("Problema actualizado correctamente.");
      setConfirmOpen(false);
      fetchProblems(); // Actualiza la lista de problemas
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
        row.images && row.images.length > 0
          ? row.images.map((image, idx) => (
              <img
                key={idx}
                src={image.url}
                alt={image.image}
                className="w-10 h-10 object-cover cursor-pointer mr-2"
                onClick={() => setPreviewImage(image.url)}
              />
            ))
          : "Sin evidencias",
    },
    {
      header: "Acciones",
      accessor: "actions",
      cell: (row) => (
        <button
          onClick={() => handleSendToArea(row)}
          className="px-4 py-2 bg-[#210d38] text-white rounded hover:bg-[#210d38]/60 cursor-pointer"
        >
          Actualizar Estado
        </button>
      ),
    },
  ];

  return (
    <div className="p-8 bg-transparent">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Gestión de Problemas del Área</h1>
      </div>
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
          className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-40 backdrop-blur-sm z-50"
          onClick={() => setConfirmOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">
              Confirmar Actualización de Estado
            </h3>
            <p className="text-gray-700 mb-4">
              ¿Estás seguro de que deseas actualizar el estado del problema?
            </p>
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
    </div>
  );
};

export default StatusArea;
