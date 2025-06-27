import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppointment } from '../../hooks/useAppointment';
import { useAppointment as useAppointmentContext } from '../../context/AppointmentContext';
import '../../assets/styles/pages/profile/UserProfile.css';

const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  const { fetchMyAppointments, removeAppointment, loading: appointmentLoading } = useAppointment();
  const { subscribeToUpdates } = useAppointmentContext();
  const [appointments, setAppointments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('appointments');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para refrescar las citas
  const refreshAppointments = useCallback(async () => {
    try {
      console.log('🔄 Refrescando citas del cliente...');
      const response = await fetchMyAppointments();
      if (response.success && response.data) {
        console.log('✅ Citas del cliente actualizadas:', response.data);
        setAppointments(response.data);
      }
    } catch (err) {
      console.warn('⚠️ No se pudieron actualizar las citas:', err.message);
      setError('Error al cargar las citas');
    }
  }, [fetchMyAppointments]);

  useEffect(() => {
    if (user) {
      // Cargar los datos del usuario en el formulario
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });

      // Cargar las citas del usuario
      const loadAppointments = async () => {
        try {
          await refreshAppointments();
        } catch (err) {
          setError('Error al cargar las citas');
        } finally {
          setLoading(false);
        }
      };

      loadAppointments();
    }
  }, [user, refreshAppointments]);

  // Suscribirse a actualizaciones de citas para refrescar automáticamente
  useEffect(() => {
    if (subscribeToUpdates) {
      const unsubscribe = subscribeToUpdates(() => {
        console.log('📅 Nueva cita detectada, actualizando citas del cliente...');
        refreshAppointments();
      });

      return unsubscribe;
    }
  }, [subscribeToUpdates, refreshAppointments]);

  // Efecto para actualizar citas cuando la ventana vuelve a tener foco
  useEffect(() => {
    const handleFocus = () => {
      console.log('🔄 Ventana enfocada, actualizando citas...');
      refreshAppointments();
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshAppointments]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(user.id, formData);
      setIsEditing(false);
    } catch (err) {
      setError('Error al actualizar el perfil');
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await removeAppointment(appointmentId);
      // Actualizar la lista de citas después de cancelar
      await refreshAppointments();
    } catch (err) {
      setError('Error al cancelar la cita');
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error && !user) return <div className="error">{error}</div>;
  if (!user) return <div className="error">Usuario no encontrado</div>;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt="Avatar" />
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-subtitle">Cliente desde {new Date(user.createdAt).toLocaleDateString()}</p>
            
            <div className="profile-stats">
              <div className="stat-item">
                <div className="stat-icon">📅</div>
                <div className="stat-text">
                  <span className="stat-value">{appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length}</span>
                  Citas Programadas
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">✓</div>
                <div className="stat-text">
                  <span className="stat-value">{appointments.filter(a => a.status === 'completed').length}</span>
                  Citas Completadas
                </div>
              </div>
            </div>
            
            <div className="profile-actions">
              <button 
                className="edit-profile-btn"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancelar Edición' : 'Editar Perfil'}
              </button>
              <button 
                className="refresh-button" 
                onClick={refreshAppointments}
                title="Actualizar citas"
              >
                🔄 Actualizar
              </button>
            </div>
          </div>
        </div>
        
        <div className="profile-content">
          <div className="profile-sidebar">
            <h2 className="sidebar-title">Menú</h2>
            <ul className="sidebar-menu">
              <li className="sidebar-menu-item">
                <Link to="/appointment" className="sidebar-menu-link">
                  <span className="sidebar-menu-icon">📝</span> Nueva Cita
                </Link>
              </li>
              <li className="sidebar-menu-item">
                <Link to="/" className="sidebar-menu-link">
                  <span className="sidebar-menu-icon">🏠</span> Inicio
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="profile-main">
            {isEditing ? (
              <div className="profile-section">
                <h2 className="section-title">Editar Perfil</h2>
                <form onSubmit={handleSubmit} className="profile-form">
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">Nombre</label>
                    <input
                      className="form-input"
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email</label>
                    <input
                      className="form-input"
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">Teléfono</label>
                    <input
                      className="form-input"
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancelar</button>
                    <button type="submit" className="save-btn">Guardar Cambios</button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                <div className="content-tabs">
                  <div 
                    className={`content-tab ${activeTab === 'appointments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('appointments')}
                  >
                    Mis Citas
                  </div>
                  <div 
                    className={`content-tab ${activeTab === 'info' ? 'active' : ''}`}
                    onClick={() => setActiveTab('info')}
                  >
                    Información Personal
                  </div>
                </div>

                {activeTab === 'appointments' && (
                  <div className="appointments-section">
                    <h2 className="section-title">Mis Citas</h2>
                    {appointments.length > 0 ? (
                      <div className="appointments-list">
                        {appointments.map((appointment, index) => (
                          <div key={appointment._id || index} className="appointment-card">
                            <div className="appointment-header">
                              <div className="appointment-date">
                                <div className="date-day">
                                  {new Date(appointment.date).toLocaleDateString('es-ES', { 
                                    day: '2-digit',
                                    month: 'short' 
                                  })}
                                </div>
                                <div className="date-weekday">
                                  {new Date(appointment.date).toLocaleDateString('es-ES', { 
                                    weekday: 'short' 
                                  })}
                                </div>
                              </div>
                              <div className="appointment-time">
                                <div className="time-value">{appointment.startTime}</div>
                                <div className="time-duration">
                                  {appointment.service?.duration || 30} min
                                </div>
                              </div>
                              <div className={`appointment-status ${appointment.status}`}>
                                {appointment.status === 'pending' ? 'Pendiente' :
                                 appointment.status === 'confirmed' ? 'Confirmada' :
                                 appointment.status === 'completed' ? 'Completada' :
                                 appointment.status === 'cancelled' ? 'Cancelada' : 
                                 appointment.status}
                              </div>
                            </div>
                            <div className="appointment-details">
                              <div className="barber-info">
                                <div className="barber-name">
                                  💼 {appointment.barber?.user?.name || 'Barbero no especificado'}
                                </div>
                                {appointment.barber?.user?.phone && (
                                  <div className="barber-phone">
                                    📱 {appointment.barber.user.phone}
                                  </div>
                                )}
                              </div>
                              <div className="service-info">
                                <div className="service-name">
                                  ✂️ {appointment.service?.name || 'Servicio no especificado'}
                                </div>
                                {appointment.service?.price && (
                                  <div className="service-price">
                                    💰 ${appointment.service.price}
                                  </div>
                                )}
                              </div>
                            </div>
                            {appointment.notes && (
                              <div className="appointment-notes">
                                📝 <strong>Notas:</strong> {appointment.notes}
                              </div>
                            )}
                            {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                              <div className="appointment-actions">
                                <button 
                                  className="cancel-appointment-btn"
                                  onClick={() => handleCancelAppointment(appointment._id)}
                                >
                                  ❌ Cancelar Cita
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-appointments">
                        <div className="no-appointments-icon">📅</div>
                        <h3>No tienes citas programadas</h3>
                        <p>¡Agenda tu primera cita con nuestros barberos profesionales!</p>
                        <Link to="/appointment" className="schedule-btn">
                          📝 Agendar una cita
                        </Link>
                        <button 
                          className="refresh-button" 
                          onClick={refreshAppointments}
                        >
                          🔄 Actualizar
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'info' && (
                  <div className="profile-section">
                    <h2 className="section-title">Información Personal</h2>
                    <div className="profile-details">
                      <div className="detail-item">
                        <span className="detail-label">Nombre:</span>
                        <span className="detail-value">{user.name}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">{user.email}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Teléfono:</span>
                        <span className="detail-value">{user.phone || 'No especificado'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Nombre de usuario:</span>
                        <span className="detail-value">{user.username}</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;