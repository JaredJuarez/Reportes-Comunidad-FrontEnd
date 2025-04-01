import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaBuilding,
  FaUsers,
  FaChartBar,
  FaSitemap,
  FaUserTie,
  FaSignOutAlt,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from 'react-icons/fa';

const Sidebar = ({ dashboardType }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token del localStorage
    navigate('/'); // Redirige al usuario a la página de inicio
  };

  const menuMapping = {
    state: [
      { label: 'Municipios', route: '/state-dashboard/municipios', icon: FaBuilding },
    ],
    municipal: [
      { label: 'Colonias', route: '/municipal-dashboard/colonies', icon: FaUsers },
      { label: 'Reportes', route: '/municipal-dashboard/reports', icon: FaChartBar },
      { label: 'Áreas', route: '/municipal-dashboard/areas', icon: FaSitemap },
    ],
    colony: [
      { label: 'Presidentes', route: '/colony-dashboard/presidents', icon: FaUserTie },
      { label: 'Reportes', route: '/colony-dashboard/reports', icon: FaChartBar },
    ],
  };

  const menuItems = menuMapping[dashboardType] || [];

  return (
    <div
      className={`${
        isExpanded ? 'w-64' : 'w-20'
      } h-screen bg-[#210d38] text-white flex flex-col justify-between transition-all duration-300`}
    >
      <div>
        <div className="p-4 flex items-center justify-between">
          {isExpanded && <span className="text-2xl font-bold">Menú</span>}
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-white focus:outline-none">
            {isExpanded ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-4">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index}>
                  <NavLink
                    to={item.route}
                    className={({ isActive }) =>
                      isActive
                        ? 'flex items-center p-2 bg-gray-700 rounded'
                        : 'flex items-center p-2 hover:bg-gray-700 rounded'
                    }
                  >
                    <Icon className="text-xl" />
                    {isExpanded && <span className="ml-4">{item.label}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center p-2 hover:bg-gray-700 rounded w-full text-left"
        >
          <FaSignOutAlt className="text-xl" />
          {isExpanded && <span className="ml-4">Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
