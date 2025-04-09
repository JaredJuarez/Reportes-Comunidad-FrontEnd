import React, { useState, useEffect } from 'react';
import Table from '../../components/Table';
import API_BASE_URL from '../../api_config';

const StatusArea = () => {
    const [data, setData] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    // Función para obtener los problemas asignados al área desde la API
    const fetchProblems = async () => {
        const token = localStorage.getItem('token'); // Obtiene el token del localStorage

        if (!token) {
            console.error('No se encontró un token en localStorage.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/report`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Agrega el token en el encabezado
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener los problemas. Verifica tu conexión o el token.');
            }

            const problems = await response.json();

            // Mapea los datos para adaptarlos al formato esperado por la tabla
            const formattedData = problems.map((problem) => ({
                id: problem.uuid,
                title: problem.title,
                description: problem.description || 'Sin descripción',
                status: problem.status,
                date: problem.date,
                colonyName: problem.colonyName,
                municipalityName: problem.municipalityName,
                images: problem.image || [],
            }));

            setData(formattedData);
        } catch (error) {
            console.error('Error al obtener los problemas:', error.message);
        }
    };

    useEffect(() => {
        fetchProblems(); // Llama a la función para obtener los problemas al cargar el componente
    }, []);

    const columns = [
        { header: 'Título', accessor: 'title' },
        { header: 'Descripción', accessor: 'description' },
        {
            header: 'Estado',
            accessor: 'status',
            cell: (row) => (
                <span
                    className={`px-2 py-1 rounded ${row.status === 'Procesado por Area'
                            ? 'bg-green-400 text-gray-700 font-semibold'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                >
                    {row.status}
                </span>
            ),
        },
        { header: 'Fecha', accessor: 'date' },
        { header: 'Colonia', accessor: 'colonyName' },
        { header: 'Municipio', accessor: 'municipalityName' },
        {
            header: 'Evidencias',
            accessor: 'images',
            cell: (row) =>
                row.images && row.images.length > 0 ? (
                    row.images.map((image, idx) => (
                        <img
                            key={idx}
                            src={image.url}
                            alt={image.image}
                            className="w-10 h-10 object-cover cursor-pointer mr-2"
                            onClick={() => window.open(image.url, '_blank')} // Abre la imagen en una nueva pestaña
                        />
                    ))
                ) : (
                    'Sin evidencias'
                ),
        },
    ];

    return (
        <div className="p-8 bg-transparent">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">Gestión de Problemas del Área</h1>
            </div>

            {successMessage && (
                <div className="bg-green-500 text-white text-center py-2 px-4 mb-4 rounded">
                    {successMessage}
                </div>
            )}

            {/* Pasa showActions={false} para eliminar la columna de acciones */}
            <Table columns={columns} data={data} showActions={false} />
        </div>
    );
};

export default StatusArea;