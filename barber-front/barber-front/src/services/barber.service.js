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