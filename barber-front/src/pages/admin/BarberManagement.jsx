import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBarbers, deleteBarber, createBarber, updateBarber } from '../../services/barber.service';
import Loading from '../../components/common/Loading';
import { useAuth } from '../../context/AuthContext';
import '../../assets/styles/pages/admin/BarberManagement.css';

const BarberManagement = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingBarber, setEditingBarber] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    password: '',
    isActive: true
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Verificar autenticación y rol
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isAdmin()) {
      navigate('/');
      return;
    }

    fetchBarbers();
  }, [isAuthenticated, isAdmin, navigate]);

  const fetchBarbers = async () => {
    try {
      setLoading(true);
      const response = await getBarbers();
      const data = response.data || response;
      console.log('Barbers data:', data);
      setBarbers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching barbers:', error);
      setError('Error al cargar barberos: ' + error.message);
      setBarbers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este barbero?')) {
      try {
        await deleteBarber(id);
        setBarbers(barbers.filter(barber => barber._id !== id));
        setSuccess('Barbero eliminado correctamente');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        console.error('Error deleting barber:', error);
        setError('Error al eliminar barbero: ' + error.message);
      }
    }
  };

  const handleToggleStatus = async (barber) => {
    try {
      const response = await updateBarber(barber._id, {
        ...barber,
        isActive: !barber.isActive
      });
      const updatedBarber = response.data || response;
      setBarbers(barbers.map(b => b._id === barber._id ? updatedBarber : b));
      setSuccess(`Estado del barbero actualizado correctamente`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating barber status:', error);
      setError('Error al actualizar estado: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Verificar autenticación y rol nuevamente
      if (!isAuthenticated || !isAdmin()) {
        setError('No tienes permisos para realizar esta acción');
        return;
      }

      const barberData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        specialties: formData.specialty.split(',').map(s => s.trim()).filter(s => s),
        password: formData.password
      };

      console.log('Enviando datos del barbero:', barberData);

      let response;
      if (editingBarber) {
        response = await updateBarber(editingBarber._id, barberData);
        const updatedBarber = response.data || response;
        setBarbers(prevBarbers => 
          prevBarbers.map(b => b._id === editingBarber._id ? updatedBarber : b)
        );
        setSuccess('Barbero actualizado correctamente');
      } else {
        response = await createBarber(barberData);
        const newBarber = response.data || response;
        if (!newBarber._id) {
          throw new Error('El servidor no devolvió un ID válido para el nuevo barbero');
        }
        setBarbers(prevBarbers => [...prevBarbers, newBarber]);
        setSuccess('Barbero creado correctamente');
      }
      
      resetForm();
      setShowModal(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving barber:', error);
      setError('Error al guardar barbero: ' + (error.response?.data?.error || error.message));
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
      email: '',
      phone: '',
      specialty: '',
      password: '',
      isActive: true
    });
    setEditingBarber(null);
    setError('');
  };

  const handleEdit = (barber) => {
    setEditingBarber(barber);
    setFormData({
      name: barber.user?.name || '',
      email: barber.user?.email || '',
      phone: barber.user?.phone || '',
      specialty: Array.isArray(barber.specialty) ? barber.specialty.join(', ') : '',
      password: '',
      isActive: barber.isActive !== false
    });
    setShowModal(true);
  };

  const filteredBarbers = barbers.filter(barber => {
    const name = barber.user?.name || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && barber.isActive) ||
      (statusFilter === 'inactive' && !barber.isActive);
    return matchesSearch && matchesStatus;
  });

  if (loading) return <Loading />;

  return (
    <div className="barber-management">
      <div className="management-header">
        <div className="header-content">
          <h1>Gestión de Barberos</h1>
          <p className="header-subtitle">Administra y controla a todos los barberos de tu establecimiento</p>
        </div>
        
        <div className="header-controls">
          <div className="search-controls">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Buscar barberos..."
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
            className="add-barber-btn"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            <span className="btn-icon">+</span>
            <span className="btn-text">Agregar Barbero</span>
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

      <div className="barbers-grid">
        {filteredBarbers.map(barber => (
          <div key={barber._id} className="barber-card">
            <div className="card-header">
              <div className="barber-status">
                <span className={barber.isActive ? 'status-active' : 'status-inactive'}>
                  {barber.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
            
            <div className="card-body">
              <h3>{barber.user?.name || 'Sin nombre'}</h3>
              <div className="info-section">
                <div className="contact-info">
                  <h4>Contacto:</h4>
                  <p>{barber.user?.email || 'Sin email'}</p>
                  <p>{barber.user?.phone || 'Sin teléfono'}</p>
                </div>
              </div>
              
              <div className="specialties-info">
                <h4>Especialidades:</h4>
                <p>{Array.isArray(barber.specialty) ? barber.specialty.join(', ') : barber.specialty || 'Sin especialidades'}</p>
              </div>
            </div>

            <div className="card-actions">
              <button className="edit" onClick={() => handleEdit(barber)}>
                Editar
              </button>
              <button 
                className={barber.isActive ? 'deactivate' : 'activate'}
                onClick={() => handleToggleStatus(barber)}
              >
                {barber.isActive ? 'Desactivar' : 'Activar'}
              </button>
              <button className="delete" onClick={() => handleDelete(barber._id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredBarbers.length === 0 && !loading && (
        <div className="no-results">
          <p>No se encontraron barberos que coincidan con los filtros.</p>
          <button 
            className="add-barber-button"
            onClick={() => setShowModal(true)}
          >
            Agregar el primer barbero
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingBarber ? 'Editar Barbero' : 'Nuevo Barbero'}</h2>
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
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Teléfono:</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Contraseña:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={editingBarber ? "Dejar vacío para mantener la actual" : "Mínimo 6 caracteres"}
                  required={!editingBarber}
                />
                {!editingBarber && (
                  <small style={{color: 'var(--medium)', fontSize: '0.9em', marginTop: '5px', display: 'block'}}>
                    Si no especificas una contraseña, se usará la temporal: Barber2024!
                  </small>
                )}
              </div>
              
              <div className="form-group">
                <label>Especialidades (separadas por comas):</label>
                <input
                  type="text"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  placeholder="Ej: Corte moderno, Barba, Tinte"
                  required
                />
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
                  {editingBarber ? 'Guardar Cambios' : 'Crear Barbero'}
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

export default BarberManagement;
