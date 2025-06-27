import api from './api'

// Obtener todas las citas del usuario actual
export const getMyAppointments = async () => {
  try {
    const response = await api.get('/appointments/me')
    return response.data
  } catch (error) {
    throw new Error(error.message || 'Error al obtener mis citas')
  }
}

// Obtener todas las citas (solo para admins)
export const getAppointments = async () => {
  try {
    const response = await api.get('/appointments')
    return response.data
  } catch (error) {
    throw new Error(error.message || 'Error al obtener citas')
  }
}

// Crear una nueva cita
export const createAppointment = async (appointmentData) => {
  try {
    console.log('📝 Creando cita con datos:', appointmentData);
    const response = await api.post('/appointments', appointmentData);
    console.log('✅ Respuesta del servidor:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear cita:', {
      status: error.response?.status,
      message: error.response?.data?.error || error.message,
      details: error.response?.data?.details || {},
      fullError: error.response?.data || {}
    });
    throw error;
  }
}

// Actualizar una cita
export const updateAppointment = async (appointmentId, appointmentData) => {
  try {
    const response = await api.put(`/appointments/${appointmentId}`, appointmentData)
    return response.data
  } catch (error) {
    throw new Error(error.message || 'Error al actualizar cita')
  }
}

// Cancelar/eliminar una cita
export const deleteAppointment = async (appointmentId) => {
  try {
    // Usar el endpoint de cambio de estado para cancelar
    const response = await api.put(`/appointments/${appointmentId}/status`, {
      status: 'cancelled'
    })
    return response.data
  } catch (error) {
    throw new Error(error.message || 'Error al cancelar cita')
  }
}

// Alias para cancelar cita (mejor semántica)
export const cancelAppointment = deleteAppointment;

// Obtener una cita específica por ID
export const getAppointmentById = async (appointmentId) => {
  try {
    const response = await api.get(`/appointments/${appointmentId}`)
    return response.data
  } catch (error) {
    throw new Error(error.message || 'Error al obtener cita')
  }
}

// Obtener citas de un barbero específico (para barberos y admins)
export const getBarberAppointments = async (barberId) => {
  try {
    const response = await api.get(`/appointments/barber/${barberId}`)
    return response.data
  } catch (error) {
    throw new Error(error.message || 'Error al obtener citas del barbero')
  }
}

// Obtener horarios disponibles para un barbero en una fecha específica
export const getAvailableTimeSlots = async (barberId, date, serviceId) => {
  try {
    const response = await api.get(`/dashboard/barber/${barberId}/available-slots`, {
      params: { date, serviceId }
    })
    return response.data
  } catch (error) {
    throw new Error(error.message || 'Error al obtener horarios disponibles')
  }
}

// Confirmar una cita (para barberos)
export const confirmAppointment = async (appointmentId) => {
  try {
    const response = await api.put(`/appointments/${appointmentId}/status`, {
      status: 'confirmed'
    })
    return response.data
  } catch (error) {
    throw new Error(error.message || 'Error al confirmar cita')
  }
}

// Completar una cita (para barberos)
export const completeAppointment = async (appointmentId) => {
  try {
    const response = await api.put(`/appointments/${appointmentId}/status`, {
      status: 'completed'
    })
    return response.data
  } catch (error) {
    throw new Error(error.message || 'Error al completar cita')
  }
}

// Obtener estadísticas de citas (para dashboard)
export const getAppointmentStats = async () => {
  try {
    const response = await api.get('/dashboard/stats')
    return response.data
  } catch (error) {
    throw new Error(error.message || 'Error al obtener estadísticas')
  }
}

// Buscar citas por filtros
export const searchAppointments = async (filters) => {
  try {
    // Convertir las fechas a formato ISO para el backend
    const queryParams = new URLSearchParams();
    
    if (filters.startDate) {
      queryParams.append('startDate', filters.startDate);
    }
    if (filters.endDate) {
      queryParams.append('endDate', filters.endDate);
    }
    if (filters.status) {
      queryParams.append('status', filters.status);
    }
    if (filters.barberId) {
      queryParams.append('barberId', filters.barberId);
    }
    if (filters.page) {
      queryParams.append('page', filters.page);
    }
    if (filters.limit) {
      queryParams.append('limit', filters.limit);
    }

    const response = await api.get(`/appointments?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message || 'Error al buscar citas');
  }
};

const AppointmentService = {
  getMyAppointments,
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  cancelAppointment,
  getAppointmentById,
  getBarberAppointments,
  getAvailableTimeSlots,
  confirmAppointment,
  completeAppointment,
  getAppointmentStats,
  searchAppointments
}

export default AppointmentService;