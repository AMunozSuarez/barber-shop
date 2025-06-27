import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAppointmentStats } from '../../services/appointment.service';
import '../../assets/styles/pages/admin/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Obtener estadísticas del dashboard de admin
        const statsData = await getAppointmentStats();
        setStats(statsData);
      } catch (err) {
        setError(err.message || 'Error al cargar estadísticas del dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) return <div className="loading">Cargando dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard de Administrador</h1>
        <p>Bienvenido, {user.name}</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="stats-grid">
        {stats && (
          <>
            <div className="stats-card">
              <div className="stats-icon appointments">📅</div>
              <div className="stats-content">
                <div className="stats-value">{stats.data?.appointments?.total || 0}</div>
                <div className="stats-label">Total de Citas</div>
              </div>
            </div>
            
            <div className="stats-card">
              <div className="stats-icon clients">👥</div>
              <div className="stats-content">
                <div className="stats-value">{stats.data?.users?.clients || 0}</div>
                <div className="stats-label">Clientes</div>
              </div>
            </div>
            
            <div className="stats-card">
              <div className="stats-icon revenue">💰</div>
              <div className="stats-content">
                <div className="stats-value">${stats.data?.revenue?.monthly || 0}</div>
                <div className="stats-label">Ingresos Mensuales</div>
              </div>
            </div>
            
            <div className="stats-card">
              <div className="stats-icon services">🛠️</div>
              <div className="stats-content">
                <div className="stats-value">{stats.data?.services?.total || 0}</div>
                <div className="stats-label">Servicios Activos</div>
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Resumen de Citas</h3>
          </div>
          {stats && (
            <div className="appointments-summary">
              <div className="summary-item">
                <span className="summary-label">Pendientes:</span>
                <span className="summary-value">{stats.data?.appointments?.pending || 0}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Confirmadas:</span>
                <span className="summary-value">{stats.data?.appointments?.confirmed || 0}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Completadas:</span>
                <span className="summary-value">{stats.data?.appointments?.completed || 0}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Canceladas:</span>
                <span className="summary-value">{stats.data?.appointments?.cancelled || 0}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Hoy:</span>
                <span className="summary-value">{stats.data?.appointments?.today || 0}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Usuarios del Sistema</h3>
          </div>
          {stats && (
            <div className="users-summary">
              <div className="summary-item">
                <span className="summary-label">Total de usuarios:</span>
                <span className="summary-value">{stats.data?.users?.total || 0}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Clientes:</span>
                <span className="summary-value">{stats.data?.users?.clients || 0}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Barberos:</span>
                <span className="summary-value">{stats.data?.users?.barbers || 0}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Administradores:</span>
                <span className="summary-value">{stats.data?.users?.admins || 0}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="dashboard-actions">
        <div className="action-group">
          <h3>Gestión de Barberos</h3>
          <div className="action-buttons">
            <Link to="/admin/barbers" className="action-btn primary">
              Ver Barberos
            </Link>
            <Link to="/admin/barbers/new" className="action-btn secondary">
              Agregar Barbero
            </Link>
          </div>
        </div>
        
        <div className="action-group">
          <h3>Gestión de Servicios</h3>
          <div className="action-buttons">
            <Link to="/admin/services" className="action-btn primary">
              Ver Servicios
            </Link>
            <Link to="/admin/services/new" className="action-btn secondary">
              Agregar Servicio
            </Link>
          </div>
        </div>
        
        <div className="action-group">
          <h3>Reportes</h3>
          <div className="action-buttons">
            <Link to="/admin/appointments" className="action-btn primary">
              Ver Todas las Citas
            </Link>
            <Link to="/admin/reports" className="action-btn secondary">
              Generar Reportes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
