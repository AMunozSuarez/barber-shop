// Custom hook para operaciones de barbero
import { useState, useCallback } from 'react';
import BarberService from '../services/barber.service';

export const useBarber = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Obtiene todos los barberos
   */
  const getBarbers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await BarberService.getBarbers();
      return response;
    } catch (err) {
      setError(err.message || 'Error al obtener barberos');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene un barbero específico por ID
   */
  const getBarberById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await BarberService.getBarberById(id);
      return response;
    } catch (err) {
      setError(err.message || 'Error al obtener barbero');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene el perfil del barbero actualmente autenticado
   * (Este método asume que el usuario autenticado es un barbero)
   */
  const getBarberProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await BarberService.getMyBarberProfile();
      return response.data;
    } catch (err) {
      setError(err.message || 'Error al obtener perfil del barbero');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Actualiza el perfil del barbero
   * @param {string} barberId - ID del barbero
   * @param {Object} profileData - Datos del perfil a actualizar
   */
  const updateBarberProfile = useCallback(async (barberId, profileData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await BarberService.updateBarber(barberId, profileData);
      return response;
    } catch (err) {
      setError(err.message || 'Error al actualizar perfil del barbero');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene las citas del barbero con filtros opcionales
   * @param {string} barberId - ID del barbero
   * @param {Object} filters - Filtros a aplicar (fecha, estado)
   */
  const getBarberAppointments = useCallback(async (barberId, filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await BarberService.getBarberAppointments(barberId, filters);
      return response;
    } catch (err) {
      setError(err.message || 'Error al obtener citas del barbero');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene la disponibilidad de un barbero para una fecha
   * @param {string} barberId - ID del barbero
   * @param {string} date - Fecha en formato YYYY-MM-DD
   */
  const getBarberAvailability = useCallback(async (barberId, date) => {
    setLoading(true);
    setError(null);
    try {
      const response = await BarberService.getBarberAvailability(barberId, date);
      return response;
    } catch (err) {
      setError(err.message || 'Error al obtener disponibilidad del barbero');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene estadísticas del barbero autenticado
   */
  const getBarberStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await BarberService.getBarberStats();
      return response;
    } catch (err) {
      setError(err.message || 'Error al obtener estadísticas del barbero');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crear un nuevo barbero (solo para administradores)
   * @param {Object} barberData - Datos del barbero a crear
   */
  const createBarber = useCallback(async (barberData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await BarberService.createBarber(barberData);
      return response;
    } catch (err) {
      setError(err.message || 'Error al crear barbero');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Eliminar un barbero (solo para administradores)
   * @param {string} barberId - ID del barbero a eliminar
   */
  const deleteBarber = useCallback(async (barberId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await BarberService.deleteBarber(barberId);
      return response;
    } catch (err) {
      setError(err.message || 'Error al eliminar barbero');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Actualizar disponibilidad del barbero autenticado
   * @param {Array} availability - Array de horarios por día
   */
  const updateBarberAvailability = useCallback(async (availability) => {
    setLoading(true);
    setError(null);
    try {
      const response = await BarberService.updateMyBarberAvailability(availability);
      return response;
    } catch (err) {
      setError(err.message || 'Error al actualizar disponibilidad');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Limpiar errores
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    getBarbers,
    getBarberById,
    getBarberProfile,
    updateBarberProfile,
    getBarberAppointments,
    getBarberAvailability,
    getBarberStats,
    createBarber,
    deleteBarber,
    updateBarberAvailability,
    clearError
  };
};

export default useBarber;
