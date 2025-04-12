import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UserForm = () => {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    useEffect(() => {
        if (isEditing) {
            fetchUser();
        }
    }, [id]);

    const fetchUser = async () => {
        try {
            const response = await fetch(`https://52.23.173.32:8000/usuarios/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();
            setNombre(data.nombre);
            setCorreo(data.correo);
        } catch (err) {
            console.error('Error al cargar usuario', err);
            alert('Error al cargar los datos del usuario.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { nombre, correo };
        if (!isEditing) payload.contraseña = contraseña;

        try {
            const url = isEditing
                ? `https://52.23.173.32:8000/usuarios/${id}`
                : 'https://52.23.173.32:8000/usuarios';

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Respuesta del backend:', data);
                alert(`Error: ${data.detail || 'Error desconocido'}`);
                return;
            }

            navigate('/users');
        } catch (err) {
            console.error('Error al guardar', err);
            alert('Error inesperado al guardar.');
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '50px auto' }}>
            <h2>{isEditing ? 'Editar Usuario' : 'Crear Usuario'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre completo:</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                </div>
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
                {!isEditing && (
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
                )}
                <button type="submit">{isEditing ? 'Actualizar' : 'Crear'}</button>
            </form>
        </div>
    );
};

export default UserForm;
