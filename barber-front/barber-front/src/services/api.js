import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Replace with your actual API URL

// Function to get all barbers
export const getBarbers = async () => {
  const response = await axios.get(`${API_URL}/barbers`);
  return response.data;
};

// Function to get a specific barber by ID
export const getBarberById = async (id) => {
  const response = await axios.get(`${API_URL}/barbers/${id}`);
  return response.data;
};

// Function to create a new appointment
export const createAppointment = async (appointmentData) => {
  const response = await axios.post(`${API_URL}/appointments`, appointmentData);
  return response.data;
};

// Function to get all appointments for a user
export const getUserAppointments = async (userId) => {
  const response = await axios.get(`${API_URL}/appointments/user/${userId}`);
  return response.data;
};

// Function to update an appointment
export const updateAppointment = async (id, appointmentData) => {
  const response = await axios.put(`${API_URL}/appointments/${id}`, appointmentData);
  return response.data;
};

// Function to delete an appointment
export const deleteAppointment = async (id) => {
  const response = await axios.delete(`${API_URL}/appointments/${id}`);
  return response.data;
};