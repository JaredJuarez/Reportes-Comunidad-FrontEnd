import React from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '../components/Form';

const Login = () => {
  const navigate = useNavigate();

  const fields = [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter your email',
      required: true,
      validate: (value) => /\S+@\S+\.\S+/.test(value),
      errorMessage: 'Please enter a valid email address',
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password',
      required: true,
      errorMessage: 'Password is required',
    },
  ];

  const handleLogin = (formData) => {
    const { email, password } = formData;

    const users = [
      { email: 'admin@example.com', password: 'admin123', role: 'admin' },
      { email: 'president@example.com', password: 'president123', role: 'president' },
      { email: 'user@example.com', password: 'user123', role: 'user' },
    ];

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      if (user.role === 'admin') navigate('/admin-dashboard');
      else if (user.role === 'president') navigate('/president-dashboard');
      else navigate('/user-dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-page flex items-center justify-center min-h-screen bg-gray-100">
      <div className="login-container bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h1>
        <Form fields={fields} onSubmit={handleLogin} />
      </div>
    </div>
  );
};

export default Login;