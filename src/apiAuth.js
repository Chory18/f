const API_BASE_URL = 'https://52.23.173.32:8000'; // Asegúrate de que sea HTTPS válido

// Función de registro
export const register = async (correo, contraseña, nombre) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo: correo,   // Cambié "email" por "correo"
        contraseña: contraseña,
        nombre: nombre    // Cambié "name" por "nombre"
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

// 🔐 Iniciar sesión
export const login = async (correo, contraseña) => {
    const response = await fetch(`${API_BASE_URL}/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            username: correo,       // FastAPI espera "username"
            password: contraseña,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Error en login:", errorData);
        throw new Error(errorData.detail || "Error desconocido");
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    return data;
};

// 📡 Peticiones autenticadas con token
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

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Error en la solicitud');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en fetchWithToken:', error);
        throw error;
    }
};

// 🚪 Cerrar sesión
export const logout = () => {
    localStorage.removeItem('token');
};

// 🔍 Verificar si el usuario está autenticado
export const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
};
