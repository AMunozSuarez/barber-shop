import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBarber } from '../../hooks/useBarber';
import '../../assets/styles/pages/admin/BarberDashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { 
    loading: barberLoading, 
    error: barberError, 
    getBarberStats, 
    getBarberAppointments,
    updateAppointmentStatus
  } = useBarber();
  
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('today'); // 'today', 'upcoming', 'all'
  const [statusFilter, setStatusFilter] = useState('confirmed'); // 'confirmed', 'completed', 'cancelled', 'all'

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Obtener estadísticas del barbero
        const statsData = await getBarberStats();
        setStats(statsData);
        
        // Obtener citas del barbero con filtros
        const dateFilters = {};
        if (filter === 'today') {
          const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
          dateFilters.date = today;
        }
        
        const statusFilters = {};
        if (statusFilter !== 'all') {
          statusFilters.status = statusFilter;
        }
        
        const appointmentsData = await getBarberAppointments({
          ...dateFilters,
          ...statusFilters
        });
        
        setAppointments(appointmentsData);
      } catch (err) {
        setError(err.message || 'Error al cargar datos del dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [filter, statusFilter]);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      
      // Actualizar la lista de citas después de cambiar el estado
      const updatedAppointments = await getBarberAppointments({
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
      
      setAppointments(updatedAppointments);
      
      // Actualizar estadísticas
      const updatedStats = await getBarberStats();
      setStats(updatedStats);
    } catch (err) {
      setError(err.message || 'Error al actualizar estado de cita');
    }
  };
  
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  if (loading && !stats) return <div className="loading">Cargando...</div>;

  return (
    <div className="barber-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard de Barbero</h1>
        <p>Bienvenido, {user.name}</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="dashboard-stats">
        {stats && (
          <>
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <h3>Citas Programadas</h3>
                <p className="stat-value">{stats.upcomingAppointments}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">✓</div>
              <div className="stat-content">
                <h3>Citas Completadas</h3>
                <p className="stat-value">{stats.completedAppointments}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">💲</div>
              <div className="stat-content">
                <h3>Ingresos Totales</h3>
                <p className="stat-value">${stats.totalRevenue}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">🔄</div>
              <div className="stat-content">
                <h3>Total de Citas</h3>
                <p className="stat-value">{stats.totalAppointments}</p>
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="dashboard-content">
        <div className="appointments-section">
          <div className="appointments-header">
            <h2>Mis Citas</h2>
            <div className="filters">
              <div className="filter-group">
                <label>Fecha:</label>
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="today">Hoy</option>
                  <option value="upcoming">Próximas</option>
                  <option value="all">Todas</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>Estado:</label>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="confirmed">Confirmadas</option>
                  <option value="completed">Completadas</option>
                  <option value="cancelled">Canceladas</option>
                  <option value="all">Todas</option>
                </select>
              </div>
            </div>
          </div>
          
          {appointments.length > 0 ? (
            <div className="appointments-list">
              {appointments.map(appointment => (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-date">
                    {formatDate(appointment.date)}
                  </div>
                  <div className="appointment-time">
                    {appointment.time} ({appointment.duration} min)
                  </div>
                  <div className="appointment-customer">
                    <strong>Cliente:</strong> {appointment.userName}
                  </div>
                  <div className="appointment-service">
                    <strong>Servicio:</strong> {appointment.service}
                  </div>
                  <div className="appointment-price">
                    <strong>Precio:</strong> ${appointment.price}
                  </div>
                  <div className="appointment-notes">
                    <strong>Notas:</strong> {appointment.notes || 'Sin notas'}
                  </div>
                  <div className="appointment-status">
                    <span className={`status-badge status-${appointment.status}`}>
                      {appointment.status === 'confirmed' ? 'Confirmada' :
                       appointment.status === 'completed' ? 'Completada' :
                       appointment.status === 'cancelled' ? 'Cancelada' : 'Pendiente'}
                    </span>
                  </div>
                  
                  <div className="appointment-actions">
                    {appointment.status === 'confirmed' && (
                      <>
                        <button 
                          className="action-btn complete-btn"
                          onClick={() => handleStatusChange(appointment.id, 'completed')}
                        >
                          Completar
                        </button>
                        <button 
                          className="action-btn cancel-btn"
                          onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                        >
                          Cancelar
                        </button>
                      </>
                    )}
                    {appointment.status === 'completed' && (
                      <button 
                        className="action-btn edit-btn"
                        onClick={() => {/* Implementar edición de notas */}}
                      >
                        Añadir Nota
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-appointments">
              <p>No hay citas {filter === 'today' ? 'para hoy' : 
                             filter === 'upcoming' ? 'próximas' : ''} 
                 {statusFilter !== 'all' ? ` con estado "${
                   statusFilter === 'confirmed' ? 'confirmadas' :
                   statusFilter === 'completed' ? 'completadas' :
                   'canceladas'
                 }"` : ''}.</p>
            </div>
          )}
        </div>
        
        <div className="dashboard-sidebar">
          <div className="sidebar-section">
            <h3>Acciones Rápidas</h3>
            <div className="quick-actions">
              <Link to="/barber-profile" className="action-link">
                <span className="action-icon">👤</span>
                Ver Perfil
              </Link>
              <Link to="/appointment" className="action-link">
                <span className="action-icon">📅</span>
                Ver Calendario
              </Link>
            </div>
          </div>
          
          {stats && (
            <div className="sidebar-section">
              <h3>Resumen por Día</h3>
              <div className="day-summary">
                {Object.entries(stats.appointmentsByDay).map(([day, count]) => (
                  <div key={day} className="day-item">
                    <span className="day-name">
                      {day === 'monday' ? 'Lunes' :
                       day === 'tuesday' ? 'Martes' :
                       day === 'wednesday' ? 'Miércoles' :
                       day === 'thursday' ? 'Jueves' :
                       day === 'friday' ? 'Viernes' :
                       day === 'saturday' ? 'Sábado' : 'Domingo'}
                    </span>
                    <span className="day-count">{count} citas</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
