import https from 'https';
const API_BASE_URL = 'https://52.23.173.32'; // Asegúrate de que sea HTTPS válido
// Crear un agente HTTPS que permite certificados autofirmados
const agent = new https.Agent({  
    rejectUnauthorized: false  
});
// Función de registro
export const register = async (correo, contraseña, nombre) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            correo,
            contraseña,
            nombre,
        }),
                agent: agent, // Usar el agente aquí

    });

    if (!response.ok) {
        const error = await response.json();
        throw error;
    }

    return response.json();
};

// Función de login
export const login = async (correo, contraseña) => {
    const response = await fetch(`${API_BASE_URL}/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: correo, // Asegúrate de que el backend reciba 'username' como correo
            password: contraseña,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw error;
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    return data;
};

// Función para hacer peticiones autenticadas
export const fetchWithToken = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const config = {
        ...options,
        headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
        const error = await response.json();
        throw error;
    }

    return response.json();
};

// Cerrar sesión
export const logout = () => {
    localStorage.removeItem('token');
};

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
};
