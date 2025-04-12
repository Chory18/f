import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithToken, logout, isAuthenticated } from './apiAuth';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null); // Para capturar errores
    const navigate = useNavigate();

    // Cargar usuarios al montar el componente
    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login'); // Si no está autenticado, redirigir a login
        } else {
            fetchUsers();
        }
    }, [navigate]);

    // Obtener lista de usuarios desde la API
    const fetchUsers = async () => {
        try {
            const data = await fetchWithToken('https://52.23.173.32:8000/usuarios'); // Asegúrate de que esta ruta sea correcta
            if (data) {
                setUsers(data); // Asignar usuarios a estado
            }
        } catch (err) {
            console.error('Error al cargar usuarios:', err);
            setError('Hubo un error al cargar los usuarios'); // Mensaje de error
        }
    };

    // Eliminar usuario
    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;

        try {
            await fetchWithToken(`https://52.23.173.32:8000/usuarios/${id}`, { method: 'DELETE' });
            fetchUsers(); // Volver a cargar usuarios
        } catch (err) {
            console.error('Error al eliminar:', err);
            setError('Hubo un error al eliminar el usuario');
        }
    };

    // Cerrar sesión
    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirigir al login
    };

    return (
        <div style={{ maxWidth: '800px', margin: '50px auto' }}>
            <h2>Lista de Usuarios</h2>
            {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>} {/* Mostrar mensaje de error */}
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
                        <th>Correo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((u) => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.nombre}</td>
                                <td>{u.correo}</td>
                                <td>
                                    <button onClick={() => navigate(`/users/${u.id}/edit`)}>Editar</button>{' '}
                                    <button onClick={() => handleDelete(u.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>
                                No hay usuarios disponibles.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Users;
