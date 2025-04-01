// src/components/Table.jsx
import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Table = ({ columns, data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow border border-purple-200">
      <table className="w-full text-left whitespace-nowrap">
        <thead className="bg-purple-100 text-gray-600 text-sm uppercase tracking-wider">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-4 py-3">
                {col.header}
              </th>
            ))}
            <th className="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-gray-700">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-purple-50">
              {columns.map((col, cIdx) => (
                <td key={cIdx} className="px-4 py-3">
                  {col.cell ? col.cell(row) : row[col.accessor]}
                </td>
              ))}
              <td className="px-4 py-3 flex items-center space-x-4">
                <button
                  onClick={() => onEdit(row)}
                  className="text-yellow-500 hover:text-yellow-700"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onDelete(row)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
