import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Replace with your actual API URL

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Export the axios instance as default
export default api;

// Mock data para simular respuesta de API
const mockBarbers = [
  { 
    id: 1, 
    name: 'Juan Martínez', 
    specialty: 'Cortes clásicos', 
    image: '/images/barber1.jpg',
    rating: 4.8,
    reviews: 120,
    availability: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  },
  { 
    id: 2, 
    name: 'Carlos Rodríguez', 
    specialty: 'Degradados y diseños', 
    image: '/images/barber2.jpg',
    rating: 4.9,
    reviews: 95,
    availability: ['monday', 'wednesday', 'friday', 'saturday']
  },
  { 
    id: 3, 
    name: 'Miguel Sánchez', 
    specialty: 'Barbas y bigotes', 
    image: '/images/barber3.jpg',
    rating: 4.7,
    reviews: 87,
    availability: ['tuesday', 'thursday', 'saturday', 'sunday']
  },
];

// Function to get all barbers
export const getBarbers = async () => {
  // Simular demora de llamada a API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockBarbers);
    }, 300);
  });
};

// Function to get a specific barber by ID
export const getBarberById = async (id) => {
  // Simular demora de llamada a API
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const barber = mockBarbers.find(b => b.id === parseInt(id));
      if (barber) {
        resolve(barber);
      } else {
        reject(new Error(`Barber with ID ${id} not found`));
      }
    }, 300);
  });
};

// Function to create a new appointment
export const createAppointment = async (appointmentData) => {
  const response = await api.post('/appointments', appointmentData);
  return response.data;
};

// Function to get all appointments for a user
export const getUserAppointments = async (userId) => {
  const response = await api.get(`/appointments/user/${userId}`);
  return response.data;
};

// Function to update an appointment
export const updateAppointment = async (id, appointmentData) => {
  const response = await api.put(`/appointments/${id}`, appointmentData);
  return response.data;
};

// Function to delete an appointment
export const deleteAppointment = async (id) => {
  const response = await api.delete(`/appointments/${id}`);
  return response.data;
};