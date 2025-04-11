import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchWithToken } from './apiAuth';

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
            const data = await fetchWithToken(`/users/${id}`);
            setNombre(data.nombre);
            setCorreo(data.correo);
        } catch (err) {
            console.error('Error al cargar usuario', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { nombre, correo };
        if (!isEditing) payload.contraseña = contraseña;

        try {
            if (isEditing) {
                await fetchWithToken(`/users/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(payload),
                    headers: { 'Content-Type': 'application/json' },
                });
            } else {
                await fetchWithToken('/users', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            navigate('/users');
        } catch (err) {
            console.error('Error al guardar', err);
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
