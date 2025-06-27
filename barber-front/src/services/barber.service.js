// filepath: c:\Users\alex3\OneDrive\Escritorio\Universidad\Barber software\barber-front\src\services\barber.service.js
import api from './api';

// Obtener todos los barberos
export const getBarbers = async () => {
  try {
    const response = await api.get('/barbers');
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Error al obtener barberos');
  }
};

// Obtener un barbero específico por ID
export const getBarberById = async (id) => {
  try {
    const response = await api.get(`/barbers/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Error al obtener barbero');
  }
};

// Obtener perfil del barbero autenticado actual
export const getMyBarberProfile = async () => {
  try {
    const response = await api.get('/barbers/me');
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Error al obtener perfil del barbero');
  }
};

// Crear un nuevo barbero (solo para admins)
export const createBarber = async (barberData) => {
  try {
    console.log('🚀 Enviando datos para crear barbero:', barberData);
    const response = await api.post('/barbers', barberData);
    console.log('✅ Barbero creado exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear barbero:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Actualizar información de un barbero
export const updateBarber = async (id, barberData) => {
  try {
    const response = await api.put(`/barbers/${id}`, barberData);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Error al actualizar barbero');
  }
};

// Eliminar un barbero (solo para admins)
export const deleteBarber = async (id) => {
  try {
    const response = await api.delete(`/barbers/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Error al eliminar barbero');
  }
};

// Obtener horarios disponibles de un barbero para una fecha específica
export const getBarberAvailability = async (barberId, date) => {
  try {
    const response = await api.get(`/dashboard/barber/${barberId}/available-slots`, {
      params: { date }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Error al obtener disponibilidad del barbero');
  }
};

// Obtener estadísticas específicas del barbero
export const getBarberStats = async () => {
  try {
    const response = await api.get('/dashboard/barber/stats');
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Error al obtener estadísticas del barbero');
  }
};

// Obtener citas de un barbero específico
export const getBarberAppointments = async (barberId, filters = {}) => {
  try {
    const response = await api.get(`/appointments/barber/${barberId}`, {
      params: filters
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Error al obtener citas del barbero');
  }
};

// Actualizar horario de trabajo del barbero
export const updateBarberSchedule = async (barberId, scheduleData) => {
  try {
    const response = await api.put(`/barbers/${barberId}/schedule`, scheduleData);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Error al actualizar horario del barbero');
  }
};

// Obtener servicios que ofrece un barbero específico
export const getBarberServices = async (barberId) => {
  try {
    // Por ahora usamos todos los servicios, pero se puede personalizar
    const response = await api.get('/services');
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Error al obtener servicios del barbero');
  }
};

// Actualizar servicios que ofrece un barbero
export const updateBarberServices = async (barberId, serviceIds) => {
  try {
    const response = await api.put(`/barbers/${barberId}/services`, {
      services: serviceIds
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Error al actualizar servicios del barbero');
  }
};

// Obtener reseñas de un barbero (placeholder para futuras funciones)
export const getBarberReviews = async (barberId) => {
  try {
    // Por ahora retornamos un array vacío, pero se puede implementar después
    return { success: true, data: [] };
  } catch (error) {
    throw new Error(error.message || 'Error al obtener reseñas del barbero');
  }
};

// Cambiar estado de disponibilidad del barbero
export const toggleBarberAvailability = async (barberId, isAvailable) => {
  try {
    const response = await api.patch(`/barbers/${barberId}/availability`, {
      isAvailable
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Error al cambiar disponibilidad del barbero');
  }
};

// Actualizar disponibilidad del barbero autenticado
export const updateMyBarberAvailability = async (availability) => {
  try {
    const response = await api.put('/barbers/availability', { availability });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Error al actualizar disponibilidad');
  }
};

const BarberService = {
  getBarbers,
  getBarberById,
  getMyBarberProfile,
  createBarber,
  updateBarber,
  deleteBarber,
  getBarberAvailability,
  getBarberStats,
  getBarberAppointments,
  updateBarberSchedule,
  getBarberServices,
  updateBarberServices,
  getBarberReviews,
  toggleBarberAvailability,
  updateMyBarberAvailability
};

export default BarberService;