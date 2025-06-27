import axios from 'axios';

// Configuración base de la API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para agregar token de autenticación a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('barber_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log para debugging en desarrollo
    if (import.meta.env.DEV) {
      console.log(`🔄 ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    // Log para debugging en desarrollo
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    // Log del error
    console.error('❌ Response error:', error);
    
    // Si es error 401, limpiar token y redirigir a login
    if (error.response?.status === 401) {
      localStorage.removeItem('barber_token');
      localStorage.removeItem('barber_user');
      
      // Solo redirigir si no estamos ya en login/register
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        window.location.href = '/login';
      }
    }
    
    // Formatear el error para mejor manejo
    const formattedError = {
      message: error.response?.data?.message || error.message || 'Error desconocido',
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    };
    
    return Promise.reject(formattedError);
  }
);

export default api;

// Funciones auxiliares para manejo de tokens
export const authUtils = {
  setToken: (token) => {
    localStorage.setItem('barber_token', token);
  },
  
  getToken: () => {
    return localStorage.getItem('barber_token');
  },
  
  removeToken: () => {
    localStorage.removeItem('barber_token');
    localStorage.removeItem('barber_user');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('barber_token');
  }
};

// Función para verificar conectividad con el backend
export const checkBackendHealth = async () => {
  try {
    const response = await axios.get(API_URL.replace('/api', '/'));
    return {
      status: 'connected',
      message: response.data.message || 'Backend conectado correctamente'
    };
  } catch (error) {
    return {
      status: 'disconnected',
      message: 'No se puede conectar al backend. Verifica que esté ejecutándose.'
    };
  }
};