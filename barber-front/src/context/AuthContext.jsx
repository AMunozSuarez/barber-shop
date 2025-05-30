import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthMockService from '../services/authMock.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si hay un usuario en localStorage al cargar la aplicación
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = AuthMockService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Error al cargar el usuario:', err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await AuthMockService.login(email, password);
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await AuthMockService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      setError(err.message || 'Error al cerrar sesión');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await AuthMockService.register(userData);
      return newUser;
    } catch (err) {
      setError(err.message || 'Error al registrar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const updateProfile = async (userId, userData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await AuthMockService.updateUserProfile(userId, userData);
      if (user && user.id === updatedUser.id) {
        setUser(updatedUser);
      }
      return updatedUser;
    } catch (err) {
      setError(err.message || 'Error al actualizar perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error,
        isAuthenticated, 
        login, 
        logout, 
        register,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};