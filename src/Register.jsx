import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', full_name: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('https://tu-ip-publica-ec2/users/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || 'Error al registrar');
            }

            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '80px auto' }}>
            <h2>Registro</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    value={form.email}
                    onChange={handleChange}
                    required
                    style={{ display: 'block', width: '100%', marginBottom: 10 }}
                />
                <input
                    type="text"
                    name="full_name"
                    placeholder="Nombre completo"
                    value={form.full_name}
                    onChange={handleChange}
                    style={{ display: 'block', width: '100%', marginBottom: 10 }}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={handleChange}
                    required
                    style={{ display: 'block', width: '100%', marginBottom: 10 }}
                />
                <button type="submit" style={{ width: '100%' }}>Registrarse</button>
            </form>
        </div>
    );
};

export default Register;
