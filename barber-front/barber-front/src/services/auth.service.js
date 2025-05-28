// filepath: c:\Users\alex3\OneDrive\Escritorio\Universidad\Barber software\barber-front\src\services\auth.service.js
import api from './api';

const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

const logout = async () => {
  await api.post('/auth/logout');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;