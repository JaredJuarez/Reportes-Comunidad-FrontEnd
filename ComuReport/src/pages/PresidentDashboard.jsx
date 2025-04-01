import React from 'react';
import Sidebar from '../components/Sidebar';

const PresidentDashboard = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100">
        <h1 className="text-3xl font-bold">Welcome to the President Dashboard</h1>
        
      </div>
    </div>
  );
};

export default PresidentDashboard;
