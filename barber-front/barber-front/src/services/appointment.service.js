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