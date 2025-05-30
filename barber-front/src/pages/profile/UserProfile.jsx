import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBarberAppointment } from '../../hooks/useBarberAppointment';
import '../../assets/styles/pages/profile/UserProfile.css';

const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  const { getUserAppointments, cancelAppointment } = useBarberAppointment();
  const [appointments, setAppointments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      // Cargar los datos del usuario en el formulario
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });

      // Cargar las citas del usuario
      try {
        const userAppointments = getUserAppointments(user.id);
        setAppointments(userAppointments);
      } catch (err) {
        setError('Error al cargar las citas');
      } finally {
        setLoading(false);
      }
    }
  }, [user, getUserAppointments]);

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
      await cancelAppointment(appointmentId);
      // Actualizar la lista de citas después de cancelar
      const updatedAppointments = getUserAppointments(user.id);
      setAppointments(updatedAppointments);
    } catch (err) {
      setError('Error al cancelar la cita');
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!user) return <div className="error">Usuario no encontrado</div>;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {/* Placeholder para avatar de usuario */}
            <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt="Avatar" />
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-subtitle">Cliente desde {new Date(user.createdAt).toLocaleDateString()}</p>
            
            <div className="profile-stats">
              <div className="stat-item">
                <div className="stat-icon">📅</div>
                <div className="stat-text">
                  <span className="stat-value">{appointments.filter(a => a.status === 'confirmed').length}</span>
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
            
            <div className="profile-section">
              <h2 className="section-title">Mis Citas</h2>
              {appointments.length > 0 ? (
                <div className="appointments-list">
                  {appointments.map(appointment => (
                    <div key={appointment.id} className="appointment-item">
                      <div className="appointment-info">
                        <div className="appointment-date">
                          {appointment.date} - {appointment.time}
                        </div>
                        <div className="appointment-service">
                          {appointment.serviceName}
                        </div>
                        <div className="appointment-barber">
                          Barbero: {appointment.barberName}
                        </div>
                      </div>
                      <div className={`appointment-status status-${appointment.status}`}>
                        {appointment.status === 'confirmed' ? 'Confirmada' : 
                         appointment.status === 'cancelled' ? 'Cancelada' : 
                         appointment.status === 'completed' ? 'Completada' : 'Pendiente'}
                      </div>
                      {appointment.status === 'confirmed' && (
                        <div className="appointment-actions">
                          <button 
                            className="appointment-action cancel"
                            onClick={() => handleCancelAppointment(appointment.id)}
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-appointments">
                  <p>No tienes citas programadas.</p>
                  <Link to="/appointment" className="schedule-btn">Agendar una cita</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;