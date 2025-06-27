import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/auth.service';
import { checkBackendHealth } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);

  // Verificar conexión con el backend y cargar usuario
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Verificar conexión con el backend
        const healthCheck = await checkBackendHealth();
        setBackendConnected(healthCheck.status === 'connected');
        
        // Si el backend está conectado, verificar usuario actual
        if (healthCheck.status === 'connected') {
          const currentUser = AuthService.getCurrentUser();
          
          if (currentUser && AuthService.isAuthenticated()) {
            try {
              // Verificar que el token sigue siendo válido
              const profileResponse = await AuthService.getMyProfile();
              if (profileResponse.success) {
                setUser(profileResponse.user);
                setIsAuthenticated(true);
              }
            } catch (err) {
              // Si el token no es válido, limpiar datos locales
              console.warn('Token inválido, limpiando sesión:', err.message);
              AuthService.logout();
              setUser(null);
              setIsAuthenticated(false);
            }
          }
        } else {
          setError('No se puede conectar al servidor. Verifica que el backend esté ejecutándose.');
        }
      } catch (err) {
        console.error('Error al inicializar autenticación:', err);
        setError('Error al conectar con el servidor');
        setBackendConnected(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await AuthService.login({ email, password });
      
      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        setError(null);
        return response;
      } else {
        throw new Error(response.message || 'Error en el login');
      }
    } catch (err) {
      const errorMessage = err.message || 'Error al iniciar sesión';
      setError(errorMessage);
      setIsAuthenticated(false);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await AuthService.logout();
    } catch (err) {
      console.warn('Error al hacer logout en el servidor:', err.message);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await AuthService.register(userData);
      
      if (response.success) {
        // Si el registro fue exitoso y devuelve un token, hacer login automático
        if (response.token && response.user) {
          setUser(response.user);
          setIsAuthenticated(true);
        }
        return response;
      } else {
        throw new Error(response.message || 'Error en el registro');
      }
    } catch (err) {
      const errorMessage = err.message || 'Error al registrar usuario';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await AuthService.updateMyProfile(profileData);
      
      if (response.success && response.user) {
        setUser(response.user);
        return response;
      } else {
        throw new Error(response.message || 'Error al actualizar perfil');
      }
    } catch (err) {
      const errorMessage = err.message || 'Error al actualizar perfil';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await AuthService.getMyProfile();
      if (response.success && response.user) {
        setUser(response.user);
      }
    } catch (err) {
      console.error('Error al refrescar perfil:', err.message);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const checkUserRole = (role) => {
    return user && user.role === role;
  };

  const isAdmin = () => checkUserRole('admin');
  const isBarber = () => checkUserRole('barber');
  const isClient = () => checkUserRole('client');

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error,
        isAuthenticated,
        backendConnected,
        login, 
        logout, 
        register,
        updateProfile,
        refreshProfile,
        clearError,
        checkUserRole,
        isAdmin,
        isBarber,
        isClient
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};