import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from './apiAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Email y contraseña son requeridos');
            return;
        }

        try {
            await login(email, password);
            navigate('/users');
        } catch (err) {
            setError('Credenciales inválidas');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto' }}>
            <h2>Iniciar sesión</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px 20px' }}>
                    Iniciar sesión
                </button>
                <p style={{ marginTop: 10 }}>
                    ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
                </p>
            </form>
        </div>
    );
};

export default Login;
