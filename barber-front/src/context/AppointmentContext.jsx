import { createContext, useState, useContext, useCallback } from 'react';

const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updateListeners, setUpdateListeners] = useState([]);

  // Función para notificar a todos los listeners que se ha actualizado una cita
  const notifyUpdate = useCallback(() => {
    updateListeners.forEach(listener => {
      if (typeof listener === 'function') {
        listener();
      }
    });
  }, [updateListeners]);

  // Función para suscribirse a actualizaciones de citas
  const subscribeToUpdates = useCallback((listener) => {
    setUpdateListeners(prev => [...prev, listener]);
    
    // Retornar función de limpieza
    return () => {
      setUpdateListeners(prev => prev.filter(l => l !== listener));
    };
  }, []);

  const addAppointment = useCallback((appointment) => {
    setAppointments((prev) => [...prev, appointment]);
    // Notificar que se ha agregado una nueva cita
    setTimeout(() => notifyUpdate(), 100); // Pequeño delay para asegurar que el estado se actualice
  }, [notifyUpdate]);

  const removeAppointment = useCallback((id) => {
    setAppointments((prev) => prev.filter((appt) => appt.id !== id));
    notifyUpdate();
  }, [notifyUpdate]);

  const updateAppointment = useCallback((id, updatedData) => {
    setAppointments((prev) => 
      prev.map((appt) => 
        appt.id === id ? { ...appt, ...updatedData } : appt
      )
    );
    notifyUpdate();
  }, [notifyUpdate]);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch appointments from an API or database
      // const response = await api.get('/appointments');
      // setAppointments(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        addAppointment,
        removeAppointment,
        updateAppointment,
        fetchAppointments,
        subscribeToUpdates,
        loading,
        error,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointment = () => {
  return useContext(AppointmentContext);
};