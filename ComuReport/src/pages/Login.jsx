import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import Logo from '../assets/logo.png';
import Form from '../components/Form';
import API_BASE_URL from '../api_config';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  // Verifica si el usuario ya está autenticado
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token) {
      // Redirige al dashboard correspondiente según el rol
      if (role === 'State') navigate('/state-dashboard/municipios', { replace: true });
      else if (role === 'Colony') navigate('/colony-dashboard/presidents', { replace: true });
      else if (role === 'Municipality') navigate('/municipal-dashboard/colonies', { replace: true });
      else if (role === 'Area') navigate('/area-dashboard/statusControl', { replace: true });
    }
  }, [navigate]);

  const fields = [
    {
      name: 'email',
      type: 'email',
      placeholder: 'Ingresa tu correo electrónico',
      required: true,
      icon: FaUser,
      pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
      title: 'Por favor, ingresa un correo electrónico válido.',
    },
    {
      name: 'password',
      type: 'password',
      placeholder: 'Ingresa tu contraseña',
      required: true,
      icon: FaLock,
      pattern: '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$',
      title: 'La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra y un número.',
    },
  ];

  const handleSubmit = async (formData) => {
    const { email, password } = formData;

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas. Por favor, verifique sus datos e intente nuevamente.');
      }

      const data = await response.json();
      const { role, token } = data;

      // Almacena el token y el rol en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // Redirige según el rol del usuario
      if (role === 'State') navigate('/state-dashboard/municipios');
      else if (role === 'Colony') navigate('/colony-dashboard/presidents');
      else if (role === 'Municipality') navigate('/municipal-dashboard/colonies');
      else if (role === 'Area') navigate('/area-dashboard/statusControl');
      else throw new Error('Rol de usuario no reconocido.');
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
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