// src/pages/ColonyDashboard.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const StateDashboard = () => {
  return (
    <div className="flex min-h-screen">
      
      <Sidebar dashboardType="state" />

     
      <div className="flex-1 p-8 bg-gray-200">
        <h1 className="text-3xl font-bold mb-4">Bienvenido Administrador Estatal</h1>
        
        
        <Outlet />
      </div>
    </div>
  );
};

export default StateDashboard;
