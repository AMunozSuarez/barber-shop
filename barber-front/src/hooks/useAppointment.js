import { useState, useEffect } from 'react';
import { getAppointments, createAppointment, cancelAppointment } from '../services/appointment.service';

export const useAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAppointments();
        setAppointments(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const addAppointment = async (appointmentData) => {
    try {
      const newAppointment = await createAppointment(appointmentData);
      setAppointments((prev) => [...prev, newAppointment]);
      return newAppointment;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // Alias for addAppointment to maintain compatibility with components
  const bookAppointment = addAppointment;

  const removeAppointment = async (appointmentId) => {
    try {
      await cancelAppointment(appointmentId);
      setAppointments((prev) => prev.filter((appt) => appt.id !== appointmentId));
    } catch (err) {
      setError(err);
    }
  };

  return {
    appointments,
    loading,
    error,
    addAppointment,
    removeAppointment,
    bookAppointment, // Add bookAppointment as an alias
  };
};

// Export as default for backwards compatibility
export default useAppointment;