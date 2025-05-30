// filepath: c:\Users\alex3\OneDrive\Escritorio\Universidad\Barber software\barber-front\src\services\barber.service.js
import api from './api';

export const getBarbers = async () => {
  try {
    const response = await api.get('/barbers');
    return response.data;
  } catch (error) {
    throw new Error('Error fetching barbers: ' + error.message);
  }
};

export const getBarberById = async (id) => {
  try {
    const response = await api.get(`/barbers/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching barber: ' + error.message);
  }
};

export const createBarber = async (barberData) => {
  try {
    const response = await api.post('/barbers', barberData);
    return response.data;
  } catch (error) {
    throw new Error('Error creating barber: ' + error.message);
  }
};

export const updateBarber = async (id, barberData) => {
  try {
    const response = await api.put(`/barbers/${id}`, barberData);
    return response.data;
  } catch (error) {
    throw new Error('Error updating barber: ' + error.message);
  }
};

export const deleteBarber = async (id) => {
  try {
    await api.delete(`/barbers/${id}`);
  } catch (error) {
    throw new Error('Error deleting barber: ' + error.message);
  }
};

// Add additional barber-related functions
export const getBarberAvailability = async (barberId, date) => {
  try {
    const response = await api.get(`/barbers/${barberId}/availability`, {
      params: { date }
    });
    return response.data;
  } catch (error) {
    throw new Error('Error fetching barber availability: ' + error.message);
  }
};

export const getBarberServices = async (barberId) => {
  try {
    const response = await api.get(`/barbers/${barberId}/services`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching barber services: ' + error.message);
  }
};

export const getBarberReviews = async (barberId) => {
  try {
    const response = await api.get(`/barbers/${barberId}/reviews`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching barber reviews: ' + error.message);
  }
};

// Default export for consistency with other services
const BarberService = {
  getBarbers,
  getBarberById,
  createBarber,
  updateBarber,
  deleteBarber,
  getBarberAvailability,
  getBarberServices,
  getBarberReviews
};

export default BarberService;