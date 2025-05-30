import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../../assets/styles/pages/booking/Confirmation.css';

const Confirmation = () => {
  const location = useLocation();
  const { appointmentDetails } = location.state || {};

  if (!appointmentDetails) {
    return (
      <div className="confirmation">
        <div className="confirmation-card error">
          <h1>Error</h1>
          <p>No se encontraron detalles de la cita. Es posible que hayas llegado a esta página por error.</p>
          <Link to="/appointment" className="button">Volver a Agendar</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation">
      <div className="confirmation-card">
        <div className="confirmation-header">
          <div className="confirmation-icon">✓</div>
          <h1>¡Cita Confirmada!</h1>
          <p className="confirmation-subtitle">Tu cita ha sido agendada exitosamente</p>
        </div>

        <div className="appointment-details">
          <h2>Detalles de tu cita:</h2>
          
          <div className="detail-item">
            <span className="detail-label">Servicio:</span>
            <span className="detail-value">{appointmentDetails.serviceName}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Precio:</span>
            <span className="detail-value">{appointmentDetails.servicePrice}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Duración:</span>
            <span className="detail-value">{appointmentDetails.serviceDuration}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Barbero:</span>
            <span className="detail-value">{appointmentDetails.barberName}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Fecha:</span>
            <span className="detail-value">{appointmentDetails.date}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Hora:</span>
            <span className="detail-value">{appointmentDetails.time}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Cliente:</span>
            <span className="detail-value">{appointmentDetails.customer.name}</span>
          </div>
        </div>

        <div className="confirmation-actions">
          <Link to="/" className="button primary">Volver al Inicio</Link>
          <Link to="/profile" className="button secondary">Ver Mis Citas</Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;