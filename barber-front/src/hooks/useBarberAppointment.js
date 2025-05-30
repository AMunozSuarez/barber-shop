import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personalizado para manejar las citas de barbería
 * con almacenamiento local ya que no hay backend real
 */
export const useBarberAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar citas al iniciar
  useEffect(() => {
    try {
      // Recuperar citas del localStorage
      const savedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      setAppointments(savedAppointments);
    } catch (err) {
      setError('Error al cargar las citas: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para crear una nueva cita
  const createAppointment = async (appointmentData) => {
    try {
      // Crear una nueva cita con ID único
      const newAppointment = {
        ...appointmentData,
        id: 'appt-' + Date.now(),
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
      
      // Actualizar el estado local
      const updatedAppointments = [...appointments, newAppointment];
      setAppointments(updatedAppointments);
      
      // Guardar en localStorage
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      
      return newAppointment;
    } catch (err) {
      setError('Error al crear la cita: ' + err.message);
      throw err;
    }
  };

  // Función para cancelar una cita
  const cancelAppointment = async (appointmentId) => {
    try {
      // Filtrar para eliminar la cita cancelada
      const updatedAppointments = appointments.map(appointment => 
        appointment.id === appointmentId 
        ? { ...appointment, status: 'cancelled' } 
        : appointment
      );
      
      // Actualizar el estado local
      setAppointments(updatedAppointments);
      
      // Guardar en localStorage
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      
      return true;
    } catch (err) {
      setError('Error al cancelar la cita: ' + err.message);
      throw err;
    }
  };

  // Función para obtener las citas de un usuario específico
  const getUserAppointments = (userId) => {
    return appointments.filter(appointment => 
      appointment.customer && appointment.customer.id === userId
    );
  };

  // Función para obtener las citas de un barbero específico
  const getBarberAppointments = (barberId) => {
    return appointments.filter(appointment => 
      appointment.barberId === barberId
    );
  };
  // Función para obtener disponibilidad de horarios
  const getAvailableTimeSlots = useCallback((barberId, date) => {
    // Definir todos los horarios posibles
    const allTimeSlots = [];
    for (let hour = 9; hour <= 17; hour++) {
      allTimeSlots.push(`${hour}:00`);
      if (hour < 17) allTimeSlots.push(`${hour}:30`);
    }
    
    // Filtrar las citas del barbero en la fecha seleccionada
    const barberAppointmentsOnDate = appointments.filter(appointment => 
      appointment.barberId === barberId && 
      appointment.date === date &&
      appointment.status === 'confirmed'
    );
    
    // Extraer los horarios ya reservados
    const bookedTimeSlots = barberAppointmentsOnDate.map(appointment => appointment.time);
    
    // Devolver los horarios disponibles
    return allTimeSlots.filter(slot => !bookedTimeSlots.includes(slot));
  }, [appointments]);

  return {
    appointments,
    loading,
    error,
    createAppointment,
    cancelAppointment,
    getUserAppointments,
    getBarberAppointments,
    getAvailableTimeSlots
  };
};
