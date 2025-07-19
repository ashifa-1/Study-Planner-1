import React, { useState, useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import '../styles/RegisterPage.css'; // 👈 Add this line to import CSS


const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Create Your Account</h2>
        {error && <p className="register-error">{error}</p>}
        <form className="register-form" onSubmit={handleSubmit}>
          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="register-input" />
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required className="register-input" />
          <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" required className="register-input" />
          <button type="submit" className="register-button">Register</button>
             {/* 🎯 Add buttons here */}
                  <div className="login-extra-links">
                    <Link to="/" className="login-link-button">🏠 Home</Link>
                    <Link to="/login" className="login-link-button">📝 Login</Link>
                  </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
