import api from './api'

export const getAppointments = async () => {
  try {
    const response = await api.get('/appointments')
    return response.data
  } catch (error) {
    throw new Error('Error fetching appointments: ' + error.message)
  }
}

export const createAppointment = async (appointmentData) => {
  try {
    const response = await api.post('/appointments', appointmentData)
    return response.data
  } catch (error) {
    throw new Error('Error creating appointment: ' + error.message)
  }
}

export const updateAppointment = async (appointmentId, appointmentData) => {
  try {
    const response = await api.put(`/appointments/${appointmentId}`, appointmentData)
    return response.data
  } catch (error) {
    throw new Error('Error updating appointment: ' + error.message)
  }
}

export const deleteAppointment = async (appointmentId) => {
  try {
    await api.delete(`/appointments/${appointmentId}`)
  } catch (error) {
    throw new Error('Error deleting appointment: ' + error.message)
  }
}

// Alias cancelAppointment to deleteAppointment for better semantics
export const cancelAppointment = deleteAppointment;

// Add additional appointment-related functions
export const getAppointmentById = async (appointmentId) => {
  try {
    const response = await api.get(`/appointments/${appointmentId}`)
    return response.data
  } catch (error) {
    throw new Error('Error fetching appointment: ' + error.message)
  }
}

export const getAppointmentsByBarber = async (barberId) => {
  try {
    const response = await api.get(`/appointments/barber/${barberId}`)
    return response.data
  } catch (error) {
    throw new Error('Error fetching barber appointments: ' + error.message)
  }
}

export const getAvailableTimeSlots = async (barberId, date) => {
  try {
    const response = await api.get(`/appointments/available-slots`, {
      params: { barberId, date }
    })
    return response.data
  } catch (error) {
    throw new Error('Error fetching available time slots: ' + error.message)
  }
}

// Default export for consistency with other services
const AppointmentService = {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  cancelAppointment,
  getAppointmentById,
  getAppointmentsByBarber,
  getAvailableTimeSlots
}

export default AppointmentService;