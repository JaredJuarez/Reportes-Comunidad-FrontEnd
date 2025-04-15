import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import Badge from "../../components/Badge";
import API_BASE_URL from "../../api_config";

const Reports = () => {
  const [data, setData] = useState([]);
  const [areas, setAreas] = useState([]); // Estado para almacenar las áreas disponibles
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null); // Reporte seleccionado para modificar
  const [selectedArea, setSelectedArea] = useState(""); // Área seleccionada
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // Estado para la vista previa de la imagen

  // Función para obtener los reportes
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
      setErrorMessage(error.message);
    }
  };

  const fetchAreas = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/area`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          "Error al obtener las áreas. Verifica tu conexión o el token."
        );
      }

      const areasData = await response.json();
      setAreas(areasData);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchAreas();
  }, []);

  const handleEditStatus = (report) => {
    setSelectedReport(report);
    setModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedArea) {
      setErrorMessage("Por favor, selecciona un área.");
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
          uuid: selectedReport.uuid,
          uuidArea: selectedArea,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el reporte. Intenta nuevamente.");
      }

      setSuccessMessage("El reporte se actualizó correctamente.");
      setTimeout(() => setSuccessMessage(null), 3000);
      setModalOpen(false);
      fetchReports(); // Actualiza la lista de reportes
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

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
    {
      header: "Acciones",
      accessor: "actions",
      cell: (row) => (
        <button
          onClick={() => handleEditStatus(row)}
          className="px-4 py-2 bg-[#210d38] text-white rounded hover:bg-[#210d38]/60 cursor-pointer"
        >
          Mandar a área
        </button>
      ),
    },
  ];

  return (
    <div className="p-8 bg-transparent">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Reportes</h2>
      </div>
      <div className="bg-transparent h-11/12 overflow-y-auto">
        {errorMessage && (
          <div className="bg-red-500 text-white text-center py-2 px-4 mb-4 rounded">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-500 text-white text-center py-2 px-4 mb-4 rounded">
            {successMessage}
          </div>
        )}

        <Table columns={columns} data={data} showActions={false} />

        {/* Modal para modificar estatus */}
        {modalOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-40 backdrop-blur-sm z-50"
            onClick={() => setModalOpen(false)}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">
                Modificar Estatus del Reporte
              </h3>
              <label className="block text-gray-700 mb-2">
                Selecciona un área
              </label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded mb-4 cursor-pointer"
              >
                <option value="">-- Selecciona un área --</option>
                {areas.map((area) => (
                  <option key={area.uuid} value={area.uuid}>
                    {area.nameArea}
                  </option>
                ))}
              </select>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdateStatus}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
                >
                  Guardar
                </button>
              </div>
            </div>
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
      </div>
    </div>
  );
};

export default Reports;
