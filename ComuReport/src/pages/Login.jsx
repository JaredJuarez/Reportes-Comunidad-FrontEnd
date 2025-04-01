import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa'; 
import Logo from '../assets/logo.png';
import Form from '../components/Form';  

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const fields = [
    {
      name: 'email',
      type: 'email',
      placeholder: 'Ingresa tu correo electrónico',
      required: true,
      icon: FaUser,
    },
    {
      name: 'password',
      type: 'password',
      placeholder: 'Ingresa tu contraseña',
      required: true,
      icon: FaLock,
    },
  ];

  const users = [
    { email: 'colony@comureport.com', password: 'colony123', role: 'colonyAdmin' },
    { email: 'municipal@comureport.com', password: 'municipal123', role: 'municipalAdmin' },
    { email: 'state@comureport.com', password: 'state123', role: 'stateAdmin' },
  ];

  const handleSubmit = (formData) => {
    const { email, password } = formData;
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      if (user.role === 'stateAdmin') navigate('/state-dashboard');
      else if (user.role === 'colonyAdmin') navigate('/colony-dashboard');
      else navigate('/municipal-dashboard');
    } else {
      setError('Credenciales inválidas. Por favor, verifique sus datos e intente nuevamente.');
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#210d38]">
      <img
        src={Logo}
        alt="ComuReport Logo"
        className="w-80 h-auto"
      />

      <div className="bg-[#290f46] w-full max-w-md p-8 mt-6 rounded-xl shadow-lg border border-white/10">
        <h1 className="text-white text-2xl font-bold tracking-wide mb-6 text-center">
          Inicio de Sesión
        </h1>

        {error && (
          <div className="bg-purple-500 text-white text-center py-2 px-4 mb-4 rounded">
            {error}
          </div>
        )}

        <Form fields={fields} onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default Login;