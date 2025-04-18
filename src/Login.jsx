import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from './apiAuth'; // Asegúrate de que esta ruta es correcta

const Login = () => {
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpiar errores anteriores

        if (!correo || !contraseña) {
            setError('Correo y contraseña son requeridos');
            return;
        }

        try {
            const response = await login(correo, contraseña); // Aquí estamos llamando a la función 'login'
            // Si la respuesta es exitosa, redirigimos
            navigate('/users'); // Redirige a la ruta de usuarios
        } catch (err) {
            // Aquí mostramos el error de manera comprensible
            setError(`Error de login: ${err.message}`); // Mostramos el mensaje de error
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto' }}>
            <h2>Iniciar sesión</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Correo:</label>
                    <input
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
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
