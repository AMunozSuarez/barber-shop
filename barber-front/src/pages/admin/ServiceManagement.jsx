import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/common/Loading';
import ServiceService from '../../services/service.service';
import '../../assets/styles/pages/admin/ServiceManagement.css';

const ServiceManagement = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: 'other',
    isActive: true
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isAdmin()) {
      navigate('/');
      return;
    }

    fetchServices();
  }, [isAuthenticated, isAdmin, navigate]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await ServiceService.getServices();
      setServices(data.data || []);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
      setError('Error al cargar servicios: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isAuthenticated || !isAdmin()) {
        setError('No tienes permisos para realizar esta acción');
        return;
      }

      const serviceData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        category: formData.category,
        isActive: formData.isActive
      };

      const data = editingService
        ? await ServiceService.updateService(editingService._id, serviceData)
        : await ServiceService.createService(serviceData);

      if (editingService) {
        setServices(services.map(s => s._id === editingService._id ? data.data : s));
        setSuccess('Servicio actualizado correctamente');
      } else {
        setServices([...services, data.data]);
        setSuccess('Servicio creado correctamente');
      }

      resetForm();
      setShowModal(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error al guardar servicio:', error);
      setError('Error al guardar servicio: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      try {
        await ServiceService.deleteService(id);
        setServices(services.filter(service => service._id !== id));
        setSuccess('Servicio eliminado correctamente');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        console.error('Error al eliminar servicio:', error);
        setError('Error al eliminar servicio: ' + error.message);
      }
    }
  };

  const handleToggleStatus = async (service) => {
    try {
      const updatedService = { ...service, isActive: !service.isActive };
      const data = await ServiceService.updateService(service._id, updatedService);
      setServices(services.map(s => s._id === service._id ? data.data : s));
      setSuccess('Estado del servicio actualizado correctamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      setError('Error al actualizar estado: ' + error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      category: 'other',
      isActive: true
    });
    setEditingService(null);
    setError('');
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price.toString(),
      duration: service.duration.toString(),
      category: service.category,
      isActive: service.isActive
    });
    setShowModal(true);
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && service.isActive) ||
      (statusFilter === 'inactive' && !service.isActive);
    return matchesSearch && matchesStatus;
  });

  if (loading) return <Loading />;

  return (
    <div className="service-management">
      <div className="management-header">
        <div className="header-content">
          <h1>Gestión de Servicios</h1>
          <p className="header-subtitle">Administra y controla todos los servicios de tu barbería</p>
        </div>
        
        <div className="header-controls">
          <div className="search-controls">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Buscar servicios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-wrapper">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="status-filter"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Solo activos</option>
                <option value="inactive">Solo inactivos</option>
              </select>
            </div>
          </div>
          
          <button 
            className="add-service-btn"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            <span className="btn-icon">+</span>
            <span className="btn-text">Agregar Servicio</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="alert error">
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {success && (
        <div className="alert success">
          {success}
          <button onClick={() => setSuccess('')}>×</button>
        </div>
      )}

      <div className="services-grid">
        {filteredServices.map(service => (
          <div key={service._id} className="service-card">
            <div className="card-header">
              <div className="service-status">
                <span className={service.isActive ? 'status-active' : 'status-inactive'}>
                  {service.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
            
            <div className="card-body">
              <h3>{service.name}</h3>
              <p className="description">{service.description || 'Sin descripción'}</p>
              
              <div className="info-section">
                <div className="price-info">
                  <h4>Precio:</h4>
                  <p>${service.price.toFixed(2)}</p>
                </div>
                
                <div className="duration-info">
                  <h4>Duración:</h4>
                  <p>{service.duration} minutos</p>
                </div>
              </div>
              
              <div className="category-info">
                <h4>Categoría:</h4>
                <p>{service.category}</p>
              </div>
            </div>

            <div className="card-actions">
              <button className="edit" onClick={() => handleEdit(service)}>
                Editar
              </button>
              <button 
                className={service.isActive ? 'deactivate' : 'activate'}
                onClick={() => handleToggleStatus(service)}
              >
                {service.isActive ? 'Desactivar' : 'Activar'}
              </button>
              <button className="delete" onClick={() => handleDelete(service._id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && !loading && (
        <div className="no-results">
          <p>No se encontraron servicios que coincidan con los filtros.</p>
          <button 
            className="add-service-button"
            onClick={() => setShowModal(true)}
          >
            Agregar el primer servicio
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingService ? 'Editar Servicio' : 'Nuevo Servicio'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Descripción:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label>Precio:</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Duración (minutos):</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Categoría:</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="haircut">Corte de pelo</option>
                  <option value="beard">Barba</option>
                  <option value="combo">Combo</option>
                  <option value="special">Especial</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  Activo
                </label>
              </div>

              <div className="modal-actions">
                <button type="submit" className="save">
                  {editingService ? 'Guardar Cambios' : 'Crear Servicio'}
                </button>
                <button
                  type="button"
                  className="cancel"
                  onClick={() => {
                    resetForm();
                    setShowModal(false);
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
