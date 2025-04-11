import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithToken, logout, isAuthenticated } from './apiAuth';

const Users = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
        } else {
            fetchUsers();
        }
    }, [navigate]);

    const fetchUsers = async () => {
        try {
            const data = await fetchWithToken('/users');
            setUsers(data);
        } catch (err) {
            console.error('Error al cargar usuarios', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;

        try {
            await fetchWithToken(`/users/${id}`, { method: 'DELETE' });
            fetchUsers();
        } catch (err) {
            console.error('Error al eliminar', err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ maxWidth: '800px', margin: '50px auto' }}>
            <h2>Lista de Usuarios</h2>
            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => navigate('/users/new')} style={{ marginRight: '10px' }}>
                    Crear Usuario
                </button>
                <button onClick={handleLogout}>Cerrar sesión</button>
            </div>
            <table border="1" cellPadding="10" width="100%">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.full_name}</td>
                            <td>{u.email}</td>
                            <td>
                                <button onClick={() => navigate(`/users/${u.id}/edit`)}>Editar</button>{' '}
                                <button onClick={() => handleDelete(u.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Users;
