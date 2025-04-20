import React from "react";
import { FaEdit, FaTrash, FaExchangeAlt } from "react-icons/fa";

const Table = ({
  columns,
  data,
  onEdit,
  onDelete,
  onTransfer,
  showActions = true,
}) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow border border-purple-200">
      <div className="max-h-[70vh] overflow-y-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-purple-100 text-gray-600 text-sm uppercase tracking-wider">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-4 py-3 sticky top-0 bg-purple-100 z-10"
                >
                  {col.header}
                </th>
              ))}
              {showActions && (
                <th className="px-4 py-3 sticky top-0 bg-purple-100 z-10">
                  Acciones
                </th>
              )}
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
                {showActions && (
                  <td className="px-4 py-3 flex items-center space-x-4">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="text-yellow-500 hover:text-yellow-700 cursor-pointer"
                      >
                        <FaEdit />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <FaTrash />
                      </button>
                    )}
                    {onTransfer && (
                      <button
                        onClick={() => onTransfer(row)}
                        className="text-blue-500 hover:text-blue-700 cursor-pointer"
                      >
                        <FaExchangeAlt />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
