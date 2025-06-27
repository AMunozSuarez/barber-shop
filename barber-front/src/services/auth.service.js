import api, { authUtils } from './api';

// Registro de nuevo usuario
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    
    // Si el registro incluye auto-login, guardar el token
    if (response.data.success && response.data.token) {
      authUtils.setToken(response.data.token);
      localStorage.setItem('barber_user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Error en el registro');
  }
};

// Alias para mantener compatibilidad
export const registerUser = register;

// Inicio de sesión
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    
    if (response.data.success && response.data.token) {
      // Guardar token y datos del usuario
      authUtils.setToken(response.data.token);
      localStorage.setItem('barber_user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Error en el login');
  }
};

// Cierre de sesión
export const logout = async () => {
  try {
    // Llamar al endpoint de logout del backend si existe
    await api.post('/auth/logout');
  } catch (error) {
    // Si falla, continuar con logout local
    console.warn('Error al hacer logout en el servidor:', error.message);
  } finally {
    // Limpiar datos locales siempre
    authUtils.removeToken();
  }
};

// Obtener usuario actual del localStorage
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('barber_user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    return null;
  }
};

// Obtener perfil del usuario actual del servidor
export const getMyProfile = async () => {
  try {
    const response = await api.get('/auth/me');
    
    // Actualizar datos locales con la información más reciente
    if (response.data.success && response.data.user) {
      localStorage.setItem('barber_user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Error al obtener perfil');
  }
};

// Obtener perfil de un usuario específico (para admins)
export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Error al obtener perfil de usuario');
  }
};

// Actualizar perfil del usuario actual
export const updateMyProfile = async (profileData) => {
  try {
    const response = await api.put('/auth/profile', profileData);
    
    // Actualizar datos locales
    if (response.data.success && response.data.user) {
      localStorage.setItem('barber_user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Error al actualizar perfil');
  }
};

// Cambiar contraseña
export const changePassword = async (passwordData) => {
  try {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Error al cambiar contraseña');
  }
};

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  return authUtils.isAuthenticated() && getCurrentUser() !== null;
};

// Verificar si el usuario tiene un rol específico
export const hasRole = (role) => {
  const user = getCurrentUser();
  return user && user.role === role;
};

// Verificar si el usuario es administrador
export const isAdmin = () => {
  return hasRole('admin');
};

// Verificar si el usuario es barbero
export const isBarber = () => {
  return hasRole('barber');
};

// Verificar si el usuario es cliente
export const isClient = () => {
  return hasRole('client');
};

const AuthService = {
  register,
  registerUser,
  login,
  logout,
  getCurrentUser,
  getMyProfile,
  getUserProfile,
  updateMyProfile,
  changePassword,
  isAuthenticated,
  hasRole,
  isAdmin,
  isBarber,
  isClient
};

export default AuthService;