// Custom hook para operaciones de barbero
import { useState } from 'react';
import BarberMockService from '../services/barberMock.service';

export const useBarber = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Obtiene el perfil del barbero actualmente autenticado
   */
  const getBarberProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = await BarberMockService.getBarberProfile();
      return profile;
    } catch (err) {
      setError(err.message || 'Error al obtener perfil del barbero');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualiza el perfil del barbero
   * @param {Object} profileData - Datos del perfil a actualizar
   */
  const updateBarberProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedProfile = await BarberMockService.updateBarberProfile(profileData);
      return updatedProfile;
    } catch (err) {
      setError(err.message || 'Error al actualizar perfil del barbero');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtiene las citas del barbero con filtros opcionales
   * @param {Object} filters - Filtros a aplicar (fecha, estado)
   */
  const getBarberAppointments = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const appointments = await BarberMockService.getBarberAppointments(filters);
      return appointments;
    } catch (err) {
      setError(err.message || 'Error al obtener citas del barbero');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualiza el estado de una cita
   * @param {number} appointmentId - ID de la cita
   * @param {string} status - Nuevo estado ('confirmed', 'completed', 'cancelled')
   */
  const updateAppointmentStatus = async (appointmentId, status) => {
    setLoading(true);
    setError(null);
    try {
      const updatedAppointment = await BarberMockService.updateAppointmentStatus(appointmentId, status);
      return updatedAppointment;
    } catch (err) {
      setError(err.message || 'Error al actualizar estado de la cita');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Agrega una nota a una cita
   * @param {number} appointmentId - ID de la cita
   * @param {string} note - Nota a agregar
   */
  const addAppointmentNote = async (appointmentId, note) => {
    setLoading(true);
    setError(null);
    try {
      const updatedAppointment = await BarberMockService.addAppointmentNote(appointmentId, note);
      return updatedAppointment;
    } catch (err) {
      setError(err.message || 'Error al agregar nota a la cita');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtiene estadísticas del barbero
   */
  const getBarberStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const stats = await BarberMockService.getBarberStats();
      return stats;
    } catch (err) {
      setError(err.message || 'Error al obtener estadísticas del barbero');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getBarberProfile,
    updateBarberProfile,
    getBarberAppointments,
    updateAppointmentStatus,
    addAppointmentNote,
    getBarberStats
  };
};

export default useBarber;
