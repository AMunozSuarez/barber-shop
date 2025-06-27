import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import * as XLSX from "xlsx";
import {
  getAppointments,
  getAppointmentStats,
  searchAppointments
} from "../../services/appointment.service";
import "../../assets/styles/pages/admin/Reports.css";

const Reports = () => {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    cancelled: 0,
    pending: 0,
    confirmed: 0
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
    barberId: "",
    page: 1,
    limit: 10
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData();
  }, [currentPage, filters.startDate, filters.endDate, filters.status]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Obtener estadísticas
      const statsResponse = await getAppointmentStats();
      if (statsResponse.success && statsResponse.data) {
        setStats({
          total: statsResponse.data.appointments.total || 0,
          completed: statsResponse.data.appointments.completed || 0,
          cancelled: statsResponse.data.appointments.cancelled || 0,
          pending: statsResponse.data.appointments.pending || 0,
          confirmed: statsResponse.data.appointments.confirmed || 0
        });
      }

      // Obtener citas con filtros
      const appointmentsResponse = await searchAppointments({
        ...filters,
        page: currentPage
      });

      if (appointmentsResponse.success) {
        setAppointments(appointmentsResponse.appointments || []);
        setTotalPages(appointmentsResponse.totalPages || 1);
      }
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Resetear a la primera página al cambiar filtros
  };

  const exportToExcel = () => {
    const dataToExport = appointments.map(appointment => ({
      'Fecha': format(new Date(appointment.date), 'dd/MM/yyyy'),
      'Hora': format(new Date(appointment.date), 'HH:mm'),
      'Cliente': appointment.client?.name || 'N/A',
      'Barbero': appointment.barber?.user?.name || 'N/A',
      'Servicio': appointment.service?.name || 'N/A',
      'Estado': getStatusText(appointment.status),
      'Precio': `$${appointment.service?.price || 0}`,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Citas");
    XLSX.writeFile(wb, `reporte-citas-${format(new Date(), 'dd-MM-yyyy')}.xlsx`);
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: "Pendiente",
      confirmed: "Confirmada",
      completed: "Completada",
      cancelled: "Cancelada"
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status}`;
  };

  if (loading) {
    return (
      <div className="reports-container">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>Reportes y Estadísticas</h1>
        <button className="export-button" onClick={exportToExcel}>
          Exportar a Excel
        </button>
      </div>

      <div className="reports-stats">
        <div className="stat-card">
          <h3>Total de Citas</h3>
          <div className="value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <h3>Citas Completadas</h3>
          <div className="value">{stats.completed}</div>
        </div>
        <div className="stat-card">
          <h3>Citas Pendientes</h3>
          <div className="value">{stats.pending}</div>
        </div>
        <div className="stat-card">
          <h3>Citas Canceladas</h3>
          <div className="value">{stats.cancelled}</div>
        </div>
      </div>

      <div className="reports-filters">
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          placeholder="Fecha inicio"
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          placeholder="Fecha fin"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="confirmed">Confirmada</option>
          <option value="completed">Completada</option>
          <option value="cancelled">Cancelada</option>
        </select>
      </div>

      <table className="appointments-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Cliente</th>
            <th>Barbero</th>
            <th>Servicio</th>
            <th>Estado</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment._id}>
              <td>{format(new Date(appointment.date), 'dd/MM/yyyy')}</td>
              <td>{format(new Date(appointment.date), 'HH:mm')}</td>
              <td>{appointment.client?.name || 'N/A'}</td>
              <td>{appointment.barber?.user?.name || 'N/A'}</td>
              <td>{appointment.service?.name || 'N/A'}</td>
              <td>
                <span className={getStatusClass(appointment.status)}>
                  {getStatusText(appointment.status)}
                </span>
              </td>
              <td>${appointment.service?.price || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {appointments.length === 0 && (
        <div className="no-appointments">
          No se encontraron citas con los filtros seleccionados
        </div>
      )}

      <div className="pagination">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>Página {currentPage} de {totalPages}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Reports;
