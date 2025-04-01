import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-[#210d38] text-white flex flex-col">
     
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        Menú
      </div>
     
      <nav className="p-4 flex-1">
        <ul className="space-y-4">
          <li>
            <NavLink 
              to="/president-dashboard" 
              className={({ isActive }) => 
                isActive 
                  ? "block p-2 bg-gray-700 rounded" 
                  : "block p-2 hover:bg-gray-700 rounded"
              }
            >
              Presidentes
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/reports" 
              className={({ isActive }) => 
                isActive 
                  ? "block p-2 bg-gray-700 rounded" 
                  : "block p-2 hover:bg-gray-700 rounded"
              }
            >
              Reportes
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive 
                  ? "block p-2 bg-gray-700 rounded" 
                  : "block p-2 hover:bg-gray-700 rounded"
              }
            >
              Cerrar Sesión
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
