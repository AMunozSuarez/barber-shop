import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBarber } from '../../hooks/useBarber';
import { useAppointment } from '../../hooks/useAppointment';
import { useAppointment as useAppointmentContext } from '../../context/AppointmentContext';
import AvailabilityManager from '../../components/barber/AvailabilityManager';
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
  const { completeAppointment, removeAppointment, loading: appointmentLoading } = useAppointment();
  const { subscribeToUpdates } = useAppointmentContext();
  
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('appointments');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    specialty: '',
    bio: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para refrescar solo las estadísticas
  const refreshStats = useCallback(async () => {
    try {
      console.log('🔄 Refrescando estadísticas...');
      const statsData = await getBarberStats();
      console.log('✅ Estadísticas actualizadas:', statsData);
      setStats(statsData.data);
    } catch (statsError) {
      console.warn('⚠️ No se pudieron actualizar estadísticas:', statsError.message);
    }
  }, [getBarberStats]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        console.log('🔍 Obteniendo perfil del barbero...');
        const data = await getBarberProfile();
        console.log('✅ Perfil obtenido:', data);
        setProfileData(data);
        
        // Inicializar formData con datos del perfil
        setFormData({
          name: data.user?.name || '',
          phone: data.user?.phone || '',
          specialty: data.specialty || '',
          bio: data.bio || ''
        });
        
        // Obtener estadísticas del barbero
        console.log('🔍 Obteniendo estadísticas...');
        try {
          const statsData = await getBarberStats();
          console.log('✅ Estadísticas obtenidas:', statsData);
          setStats(statsData.data);
        } catch (statsError) {
          console.warn('⚠️ No se pudieron obtener estadísticas:', statsError.message);
          // Usar estadísticas por defecto
          setStats({
            appointments: { completed: 0, total: 0 },
            revenue: { monthly: 0 }
          });
        }
      } catch (err) {
        console.error('❌ Error al obtener datos del perfil:', err);
        setError(err.message || 'Error al obtener datos del perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [getBarberProfile, getBarberStats]);

  // Efecto para actualizar estadísticas cuando la ventana vuelve a tener foco
  useEffect(() => {
    const handleFocus = () => {
      console.log('🔄 Ventana enfocada, actualizando estadísticas...');
      refreshStats();
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshStats]);

  // Efecto para actualizar estadísticas cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('⏰ Actualización automática de estadísticas...');
      refreshStats();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [refreshStats]);

  // Suscribirse a actualizaciones de citas para refrescar estadísticas automáticamente
  useEffect(() => {
    if (subscribeToUpdates) {
      const unsubscribe = subscribeToUpdates(() => {
        console.log('📅 Nueva cita detectada, actualizando estadísticas...');
        refreshStats();
      });

      return unsubscribe;
    }
  }, [subscribeToUpdates, refreshStats]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  // Funciones para gestionar citas
  const handleCompleteAppointment = async (appointmentId) => {
    try {
      console.log('🟢 Completando cita:', appointmentId);
      const response = await completeAppointment(appointmentId);
      if (response.success) {
        console.log('✅ Cita completada exitosamente');
        // Refrescar estadísticas para mostrar cambios
        await refreshStats();
      }
    } catch (err) {
      console.error('❌ Error al completar cita:', err);
      setError('Error al completar la cita');
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
      try {
        console.log('🔴 Cancelando cita:', appointmentId);
        const response = await removeAppointment(appointmentId);
        if (response.success) {
          console.log('✅ Cita cancelada exitosamente');
          // Refrescar estadísticas para mostrar cambios
          await refreshStats();
        }
      } catch (err) {
        console.error('❌ Error al cancelar cita:', err);
        setError('Error al cancelar la cita');
      }
    }
  };

  if (loading && !profileData) return <div className="loading">Cargando...</div>;
  if (error && !profileData) return <div className="error">{error}</div>;
  if (!profileData) return <div className="error">Perfil de barbero no encontrado</div>;

  return (
    <div className="barber-profile-page">
      <div className="barber-container">
        {/* Sección de portada */}
        <div className="barber-header">
          <div className="barber-cover">
            <img 
              src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Barber shop background" 
            />
          </div>
          
          
          <div className="barber-info-card">
            
            <h1 className="barber-name">{profileData.user?.name || 'Nombre no disponible'}</h1>
            <p className="barber-title">{profileData.specialty || 'Especialidad no especificada'}</p>
            
            <div className="barber-rating">
              <div className="barber-stars">⭐⭐⭐⭐⭐</div>
              <span className="barber-rating-count">{profileData.rating || 0} ({profileData.reviewCount || 0} reseñas)</span>
            </div>
            
            <div className="barber-tags">
              <span className="barber-tag">Cortes de Cabello</span>
              <span className="barber-tag">Barba</span>
              <span className="barber-tag">Afeitado Clásico</span>
            </div>
            
            <p className="barber-bio">{profileData.bio || 'Sin biografía'}</p>
            
            <div className="barber-stats">
              <div className="barber-stat">
                <div className="barber-stat-value">{profileData.experience || 0}</div>
                <div className="barber-stat-label">Años de experiencia</div>
              </div>
              <div className="barber-stat">
                <div className="barber-stat-value">{stats?.appointments?.completed || 0}</div>
                <div className="barber-stat-label">Citas completadas</div>
              </div>
              <div className="barber-stat">
                <div className="barber-stat-value">{profileData.services?.length || 0}</div>
                <div className="barber-stat-label">Servicios</div>
              </div>
            </div>
            
            <div className="barber-actions">
              <button
                className="book-button"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancelar Edición' : 'Editar Perfil'}
              </button>
              {!isEditing && (
                <>
                  <button className="contact-button">Contactar</button>
                  <button 
                    className="refresh-button" 
                    onClick={refreshStats}
                    title="Actualizar estadísticas"
                  >
                    🔄 Actualizar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Contenido principal */}
        <div className="barber-content">
          <div className="barber-main">
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
                    Información
                  </div>
                  <div 
                    className={`content-tab ${activeTab === 'availability' ? 'active' : ''}`}
                    onClick={() => setActiveTab('availability')}
                  >
                    Disponibilidad
                  </div>
                  <div 
                    className={`content-tab ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                  >
                    Reseñas
                  </div>
                </div>
                
                
                {activeTab === 'appointments' && (
                  <div className="appointments-section">
                    <h2 className="section-title">Mis Citas Próximas</h2>
                    {stats?.upcomingAppointments && stats.upcomingAppointments.length > 0 ? (
                      <div className="appointments-list">
                        {stats.upcomingAppointments.map((appointment, index) => (
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
                                 appointment.status}
                              </div>
                            </div>
                            <div className="appointment-details">
                              <div className="client-info">
                                <div className="client-name">
                                  👤 {appointment.client?.name || 'Cliente no especificado'}
                                </div>
                                {appointment.client?.phone && (
                                  <div className="client-phone">
                                    📱 {appointment.client.phone}
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
                            {/* Botones de acción para el barbero */}
                            <div className="appointment-actions">
                              {appointment.status === 'pending' && (
                                <>
                                  <button 
                                    className="action-btn complete-btn"
                                    onClick={() => handleCompleteAppointment(appointment._id)}
                                    disabled={appointmentLoading}
                                  >
                                    🎯 Completar
                                  </button>
                                  <button 
                                    className="action-btn cancel-btn"
                                    onClick={() => handleCancelAppointment(appointment._id)}
                                    disabled={appointmentLoading}
                                  >
                                    ❌ Cancelar
                                  </button>
                                </>
                              )}
                              {appointment.status === 'completed' && (
                                <div className="completed-badge">
                                  🎉 Cita completada
                                </div>
                              )}
                              {appointment.status === 'cancelled' && (
                                <div className="cancelled-badge">
                                  🚫 Cita cancelada
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-appointments">
                        <div className="no-appointments-icon">📅</div>
                        <h3>No tienes citas próximas</h3>
                        <p>Las citas que se programen contigo aparecerán aquí.</p>
                        <button 
                          className="refresh-button" 
                          onClick={refreshStats}
                        >
                          🔄 Actualizar
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'availability' && (
                  <div className="availability-section">
                    <AvailabilityManager 
                      currentAvailability={profileData.availability || []}
                      onUpdate={(updatedBarber) => {
                        setProfileData(updatedBarber);
                        console.log('✅ Disponibilidad actualizada:', updatedBarber);
                      }}
                    />
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="reviews-list">
                    {profileData.reviewsList && profileData.reviewsList.length > 0 ? (
                      profileData.reviewsList.map(review => (
                        <div key={review.id} className="review-item">
                          <div className="review-header">
                            <div className="reviewer">
                              <img 
                                className="reviewer-avatar"
                                src={review.avatar || `https://ui-avatars.com/api/?name=${review.name}`} 
                                alt={review.name} 
                              />
                              <div className="reviewer-name">{review.name}</div>
                            </div>
                            <div className="review-date">{review.date}</div>
                          </div>
                          <div className="review-rating">{'⭐'.repeat(review.rating)}</div>
                          <div className="review-content">{review.comment}</div>
                          <div className="review-service">Servicio: {review.service}</div>
                        </div>
                      ))
                    ) : (
                      <p>No hay reseñas disponibles</p>
                    )}
                  </div>
                )}
                
                {activeTab === 'info' && (
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
              </>
            )}
          </div>
          
          {/* Barra lateral */}
          <div className="barber-sidebar">
            <div className="sidebar-card">
              <h3 className="sidebar-title">Horario</h3>
              <div className="availability-days">
                <div className="day-item">
                  <span className="day-name">Lunes</span>
                  <span className="day-hours">9:00 AM - 6:00 PM</span>
                </div>
                <div className="day-item">
                  <span className="day-name">Martes</span>
                  <span className="day-hours">9:00 AM - 6:00 PM</span>
                </div>
                <div className="day-item">
                  <span className="day-name">Miércoles</span>
                  <span className="day-hours">9:00 AM - 6:00 PM</span>
                </div>
                <div className="day-item">
                  <span className="day-name">Jueves</span>
                  <span className="day-hours">9:00 AM - 6:00 PM</span>
                </div>
                <div className="day-item">
                  <span className="day-name">Viernes</span>
                  <span className="day-hours">9:00 AM - 7:00 PM</span>
                </div>
                <div className="day-item">
                  <span className="day-name">Sábado</span>
                  <span className="day-hours">10:00 AM - 4:00 PM</span>
                </div>
                <div className="day-item">
                  <span className="day-name">Domingo</span>
                  <span className="day-hours closed">Cerrado</span>
                </div>
              </div>
            </div>
            
            <div className="sidebar-card">
              <h3 className="sidebar-title">Contacto</h3>
              <div className="contact-info">
                <div className="contact-item">
                  <div className="contact-icon">📱</div>
                  <div className="contact-text">{profileData.phone || 'No disponible'}</div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">📧</div>
                  <div className="contact-text">{profileData.email}</div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">📍</div>
                  <div className="contact-text">Calle Principal #123, Ciudad</div>
                </div>
              </div>
            </div>
            
            <div className="sidebar-card">
              <h3 className="sidebar-title">Galería</h3>
              <div className="gallery-grid">
                <div className="gallery-item">
                  <img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" alt="Corte de pelo" />
                </div>
                <div className="gallery-item">
                  <img src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" alt="Afeitado de barba" />
                </div>
                <div className="gallery-item">
                  <img src="https://images.unsplash.com/photo-1621607950931-2de456e2d2e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" alt="Corte con tijeras" />
                </div>
                <div className="gallery-item">
                  <img src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" alt="Herramientas de barbería" />
                </div>
              </div>
              <a href="#" className="view-all">Ver más fotos</a>
            </div>
            
            {stats && (
              <div className="sidebar-card">
                <h3 className="sidebar-title">Estadísticas</h3>
                <div className="contact-item">
                  <div className="contact-icon">📅</div>
                  <div className="contact-text">
                    <strong>{stats.upcomingAppointments?.length || 0}</strong> citas programadas
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">✅</div>
                  <div className="contact-text">
                    <strong>{stats.appointments?.completed || 0}</strong> citas completadas
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">📊</div>
                  <div className="contact-text">
                    <strong>{stats.appointments?.total || 0}</strong> citas totales
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">💰</div>
                  <div className="contact-text">
                    <strong>${stats.revenue?.monthly || 0}</strong> ingresos mensuales
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberProfile;