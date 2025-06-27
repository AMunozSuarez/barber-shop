import { useState, useEffect, useCallback } from 'react';
import { useAppointment as useAppointmentContext } from '../context/AppointmentContext';
import AppointmentService from '../services/appointment.service';

export const useAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Usar el contexto para notificaciones
  const { addAppointment: addToContext, updateAppointment: updateInContext, removeAppointment: removeFromContext } = useAppointmentContext();

  /**
   * Obtener todas las citas del usuario actual
   */
  const fetchMyAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await AppointmentService.getMyAppointments();
      if (response.success && response.data) {
        setAppointments(response.data);
      }
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Error al obtener citas';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener todas las citas (para administradores)
   */
  const fetchAllAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await AppointmentService.getAppointments();
      if (response.success && response.data) {
        setAppointments(response.data);
      }
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Error al obtener citas';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crear una nueva cita
   */
  const addAppointment = useCallback(async (appointmentData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AppointmentService.createAppointment(appointmentData);
      if (response.success && response.data) {
        setAppointments((prev) => [...prev, response.data]);
        // Notificar al contexto que se agregó una nueva cita
        addToContext(response.data);
        console.log('✅ Cita agregada y contexto notificado:', response.data);
      }
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Error al crear cita';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [addToContext]);

  // Alias para mantener compatibilidad
  const bookAppointment = addAppointment;

  /**
   * Cancelar/eliminar una cita
   */
  const removeAppointment = useCallback(async (appointmentId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AppointmentService.cancelAppointment(appointmentId);
      if (response.success) {
        setAppointments((prev) => prev.filter((appt) => 
          (appt._id || appt.id) !== appointmentId
        ));
        // Notificar al contexto
        removeFromContext(appointmentId);
      }
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Error al cancelar cita';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [removeFromContext]);

  /**
   * Actualizar una cita existente
   */
  const updateAppointment = useCallback(async (appointmentId, appointmentData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AppointmentService.updateAppointment(appointmentId, appointmentData);
      if (response.success && response.data) {
        setAppointments((prev) => prev.map((appt) => 
          (appt._id || appt.id) === appointmentId ? response.data : appt
        ));
        // Notificar al contexto
        updateInContext(appointmentId, response.data);
      }
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Error al actualizar cita';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [updateInContext]);

  /**
   * Obtener horarios disponibles para un barbero en una fecha
   */
  const getAvailableSlots = useCallback(async (barberId, date) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AppointmentService.getAvailableTimeSlots(barberId, date);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Error al obtener horarios disponibles';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Confirmar una cita (para barberos)
   */
  const confirmAppointment = useCallback(async (appointmentId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AppointmentService.confirmAppointment(appointmentId);
      if (response.success && response.data) {
        setAppointments((prev) => prev.map((appt) => 
          (appt._id || appt.id) === appointmentId ? response.data : appt
        ));
        // Notificar al contexto
        updateInContext(appointmentId, response.data);
      }
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Error al confirmar cita';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [updateInContext]);

  /**
   * Completar una cita (para barberos)
   */
  const completeAppointment = useCallback(async (appointmentId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AppointmentService.completeAppointment(appointmentId);
      if (response.success && response.data) {
        setAppointments((prev) => prev.map((appt) => 
          (appt._id || appt.id) === appointmentId ? response.data : appt
        ));
        // Notificar al contexto
        updateInContext(appointmentId, response.data);
      }
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Error al completar cita';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [updateInContext]);

  /**
   * Limpiar errores
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    appointments,
    loading,
    error,
    fetchMyAppointments,
    fetchAllAppointments,
    addAppointment,
    bookAppointment,
    removeAppointment,
    updateAppointment,
    getAvailableSlots,
    confirmAppointment,
    completeAppointment,
    clearError
  };
};

export default useAppointment;