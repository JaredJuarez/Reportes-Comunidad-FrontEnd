import React from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const MunicipalDashboard = () => {
  return (
    <div className="flex min-h-screen">
      
      <Sidebar dashboardType="municipal" />

      {/* Contenido principal a la derecha */}
      <div className="flex-1 p-8 bg-gray-200 h-screen">
        <h1 className="text-3xl font-bold mb-4">Bienvenido Administrador de Municipio</h1>
        
        
        <Outlet />
      </div>
    </div>
  );
};

export default MunicipalDashboard;
