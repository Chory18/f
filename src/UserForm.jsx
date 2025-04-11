import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchWithToken } from './apiAuth';

const UserForm = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            setFullName(data.full_name);
            setEmail(data.email);
        } catch (err) {
            console.error('Error al cargar usuario', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { full_name: fullName, email };
        if (!isEditing) payload.password = password;

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
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                </div>
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
                {!isEditing && (
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
                )}
                <button type="submit">{isEditing ? 'Actualizar' : 'Crear'}</button>
            </form>
        </div>
    );
};

export default UserForm;
