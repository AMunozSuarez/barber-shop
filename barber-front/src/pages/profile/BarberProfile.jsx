import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBarber } from '../../hooks/useBarber';
import '../../assets/styles/pages/profile/BarberProfile.css';

const BarberProfile = () => {
  const { user } = useAuth();
  const { 
    loading: barberLoading, 
    error: barberError, 
    getBarberProfile, 
    updateBarberProfile,
    getBarberStats 
  } = useBarber();
  
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    specialty: '',
    bio: '',
    availability: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await getBarberProfile();
        setProfileData(data);
        
        // Inicializar formData con datos del perfil
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          specialty: data.specialty || '',
          bio: data.bio || '',
          availability: data.availability || []
        });
        
        // Obtener estadísticas
        const statsData = await getBarberStats();
        setStats(statsData);
      } catch (err) {
        setError(err.message || 'Error al obtener datos del perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleAvailabilityChange = (day) => {
    const updatedAvailability = [...formData.availability];
    if (updatedAvailability.includes(day)) {
      // Remover el día si ya está seleccionado
      const index = updatedAvailability.indexOf(day);
      updatedAvailability.splice(index, 1);
    } else {
      // Agregar el día si no está seleccionado
      updatedAvailability.push(day);
    }
    setFormData({ ...formData, availability: updatedAvailability });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedProfile = await updateBarberProfile(formData);
      setProfileData(updatedProfile);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData) return <div className="loading">Cargando...</div>;
  if (error && !profileData) return <div className="error">{error}</div>;
  if (!profileData) return <div className="error">Perfil de barbero no encontrado</div>;

  return (
    <div className="barber-profile-page">
      <div className="barber-profile-container">
        <div className="barber-profile-header">
          <div className="barber-profile-avatar">
            <img 
              src={profileData.image || `https://ui-avatars.com/api/?name=${profileData.name}&background=random`} 
              alt={`${profileData.name}`} 
            />
          </div>
          <div className="barber-profile-info">
            <h1 className="barber-profile-name">{profileData.name}</h1>
            <p className="barber-profile-specialty">{profileData.specialty}</p>
            
            <div className="barber-profile-stats">
              <div className="stat-item">
                <div className="stat-icon">⭐</div>
                <div className="stat-text">
                  <span className="stat-value">{profileData.rating}</span>
                  Calificación
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">💬</div>
                <div className="stat-text">
                  <span className="stat-value">{profileData.reviews}</span>
                  Reseñas
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">💈</div>
                <div className="stat-text">
                  <span className="stat-value">{profileData.experience}</span>
                  Años exp.
                </div>
              </div>
            </div>
            
            <div className="barber-profile-actions">
              <button
                className="edit-profile-btn"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancelar Edición' : 'Editar Perfil'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="barber-profile-content">
          <div className="barber-profile-sidebar">
            <h2 className="sidebar-title">Menú</h2>
            <ul className="sidebar-menu">
              <li className="sidebar-menu-item">
                <Link to="/admin/dashboard" className="sidebar-menu-link">
                  <span className="sidebar-menu-icon">📊</span> Dashboard
                </Link>
              </li>
              <li className="sidebar-menu-item">
                <Link to="/" className="sidebar-menu-link">
                  <span className="sidebar-menu-icon">🏠</span> Inicio
                </Link>
              </li>
            </ul>
            
            {stats && (
              <div className="sidebar-stats">
                <h3>Resumen</h3>
                <div className="sidebar-stat-item">
                  <span className="stat-label">Citas programadas:</span>
                  <span className="stat-value">{stats.upcomingAppointments}</span>
                </div>
                <div className="sidebar-stat-item">
                  <span className="stat-label">Citas completadas:</span>
                  <span className="stat-value">{stats.completedAppointments}</span>
                </div>
                <div className="sidebar-stat-item">
                  <span className="stat-label">Ingresos:</span>
                  <span className="stat-value">${stats.totalRevenue}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="barber-profile-main">
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
                  <div className="form-group">
                    <label className="form-label" htmlFor="specialty">Especialidad</label>
                    <input
                      className="form-input"
                      type="text"
                      id="specialty"
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="bio">Biografía</label>
                    <textarea
                      className="form-input"
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="4"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Disponibilidad</label>
                    <div className="availability-selector">
                      {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                        <div key={day} className="availability-day">
                          <input
                            type="checkbox"
                            id={`day-${day}`}
                            checked={formData.availability.includes(day)}
                            onChange={() => handleAvailabilityChange(day)}
                          />
                          <label htmlFor={`day-${day}`}>
                            {day === 'monday' ? 'Lunes' :
                             day === 'tuesday' ? 'Martes' :
                             day === 'wednesday' ? 'Miércoles' :
                             day === 'thursday' ? 'Jueves' :
                             day === 'friday' ? 'Viernes' :
                             day === 'saturday' ? 'Sábado' : 'Domingo'}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancelar</button>
                    <button type="submit" className="save-btn">Guardar Cambios</button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                <div className="profile-section">
                  <h2 className="section-title">Información Personal</h2>
                  <div className="profile-details">
                    <div className="detail-item">
                      <span className="detail-label">Nombre:</span>
                      <span className="detail-value">{profileData.name}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{profileData.email}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Teléfono:</span>
                      <span className="detail-value">{profileData.phone || 'No especificado'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Especialidad:</span>
                      <span className="detail-value">{profileData.specialty}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Experiencia:</span>
                      <span className="detail-value">{profileData.experience} años</span>
                    </div>
                  </div>
                </div>
                
                <div className="profile-section">
                  <h2 className="section-title">Biografía</h2>
                  <p className="barber-bio">{profileData.bio || 'Sin biografía'}</p>
                </div>
                
                <div className="profile-section">
                  <h2 className="section-title">Servicios</h2>
                  {profileData.services && profileData.services.length > 0 ? (
                    <div className="services-list">
                      {profileData.services.map(service => (
                        <div key={service.id} className="service-item">
                          <div className="service-name">{service.name}</div>
                          <div className="service-details">
                            <span className="service-duration">{service.duration} min</span>
                            <span className="service-price">${service.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No hay servicios disponibles</p>
                  )}
                </div>
                
                <div className="profile-section">
                  <h2 className="section-title">Disponibilidad</h2>
                  <div className="availability-list">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                      <div 
                        key={day} 
                        className={`availability-day-display ${profileData.availability && profileData.availability.includes(day) ? 'available' : 'unavailable'}`}
                      >
                        <span className="day-name">
                          {day === 'monday' ? 'Lunes' :
                           day === 'tuesday' ? 'Martes' :
                           day === 'wednesday' ? 'Miércoles' :
                           day === 'thursday' ? 'Jueves' :
                           day === 'friday' ? 'Viernes' :
                           day === 'saturday' ? 'Sábado' : 'Domingo'}
                        </span>
                        <span className="day-status">
                          {profileData.availability && profileData.availability.includes(day) ? '✓' : '✕'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberProfile;