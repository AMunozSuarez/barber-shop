import api from './api';

// Obtener todos los servicios
export const getServices = async () => {
  try {
    const response = await api.get('/services');
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Error al obtener servicios');
  }
};

// Obtener un servicio específico por ID
export const getServiceById = async (id) => {
  try {
    const response = await api.get(`/services/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Error al obtener servicio');
  }
};

// Crear un nuevo servicio (solo admins)
export const createService = async (serviceData) => {
  try {
    const response = await api.post('/services', serviceData);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Error al crear servicio');
  }
};

// Actualizar un servicio (solo admins)
export const updateService = async (id, serviceData) => {
  try {
    const response = await api.put(`/services/${id}`, serviceData);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Error al actualizar servicio');
  }
};

// Eliminar un servicio (solo admins)
export const deleteService = async (id) => {
  try {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Error al eliminar servicio');
  }
};

// Obtener servicios por categoría
export const getServicesByCategory = async (category) => {
  try {
    const response = await api.get('/services', {
      params: { category }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Error al obtener servicios por categoría');
  }
};

// Obtener servicios activos únicamente
export const getActiveServices = async () => {
  try {
    const response = await api.get('/services', {
      params: { isActive: true }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Error al obtener servicios activos');
  }
};

const ServiceService = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServicesByCategory,
  getActiveServices
};

export default ServiceService; 