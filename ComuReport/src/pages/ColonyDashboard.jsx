// src/pages/ColonyDashboard.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const ColonyDashboard = () => {
  return (
    <div className="flex min-h-screen">
      
      <Sidebar dashboardType="colony" />

      {/* Contenido principal a la derecha */}
      <div className="flex-1 p-8 bg-gray-200">
        <h1 className="text-3xl font-bold mb-4">Bienvenido Presidente de Colonia</h1>
        
        
        <Outlet />
      </div>
    </div>
  );
};

export default ColonyDashboard;
