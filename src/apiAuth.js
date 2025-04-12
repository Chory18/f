const API_BASE_URL = 'https://52.23.173.32'; // Asegúrate de que sea HTTPS válido

// Función de registro
export const register = async (correo, contraseña, nombre) => {
  try {
    const response = await fetch('https://52.23.173.32/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: correo,
        password: contraseña,
        name: nombre
      }),
      // Opción para desarrollo que ignora errores de certificado
      // ⚠️ Eliminar esto en producción
      mode: 'cors', // Necesario si el backend tiene CORS habilitado
      credentials: 'include' // Si usas cookies/sesiones
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error en el registro');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en register:', error);
    throw error;
  }
};
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
