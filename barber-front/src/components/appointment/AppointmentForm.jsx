import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppointment } from '../../hooks/useAppointment';
import { useAuth } from '../../context/AuthContext';
import '../../assets/styles/components/appointment/AppointmentForm.css';

function AppointmentForm({ selectedService, selectedBarber, selectedDate, selectedTime }) {
  const navigate = useNavigate();
  const { bookAppointment } = useAppointment();
  const { isAuthenticated, user } = useAuth();
  
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
  const [formData, setFormData] = useState({
    service: null,
    barber: null,
    date: null,
    time: null,
  });

  // Actualizar formData cuando cambian las propiedades
  useEffect(() => {
    setFormData({
      service: selectedService,
      barber: selectedBarber,
      date: selectedDate,
      time: selectedTime,
    });
  }, [selectedService, selectedBarber, selectedDate, selectedTime]);

  // Pre-llenar datos del usuario si está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      setUserDetails({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [isAuthenticated, user]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError(null);
    
    // Verificar que todos los campos necesarios estén completos
    if (!formData.service || !formData.barber || !formData.date || !formData.time) {
      setSubmitError('Por favor, completa todos los campos de la cita');
      return;
    }
    
    const appointmentData = {
      serviceId: formData.service.id,
      serviceName: formData.service.name,
      servicePrice: formData.service.price,
      serviceDuration: formData.service.duration,
      barberId: formData.barber.id,
      barberName: formData.barber.name,
      date: formData.date,
      time: formData.time,
      status: 'confirmed',
      customer: userDetails,
      createdAt: new Date().toISOString()
    };

    setIsSubmitting(true);
    
    // Simular una llamada a la API
    setTimeout(() => {
      try {
        // Simular un ID de cita generado por el servidor
        const newAppointment = {
          ...appointmentData,
          id: 'appt-' + Date.now()
        };
        
        // Guardar en localStorage para persistencia entre recargas de página
        const savedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        savedAppointments.push(newAppointment);
        localStorage.setItem('appointments', JSON.stringify(savedAppointments));
        
        navigate('/confirmation', { 
          state: { appointmentDetails: newAppointment } 
        });
      } catch (error) {
        console.error('Error booking appointment:', error);
        setSubmitError('Ha ocurrido un error al agendar la cita. Por favor intenta nuevamente.');
      } finally {
        setIsSubmitting(false);
      }
    }, 1500);
  };

  return (
    <form className="appointment-form" onSubmit={handleSubmit}>
      <h2>Completa tu cita</h2>
      <div className="appointment-summary">
        <h3 className="summary-title">Resumen de la reserva</h3>
        <div className="summary-item">
          <span className="summary-label">Servicio:</span>
          <span>{formData.service ? formData.service.name : 'No seleccionado'}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Precio:</span>
          <span>{formData.service ? formData.service.price : '-'}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Duración:</span>
          <span>{formData.service ? formData.service.duration : '-'}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Barbero:</span>
          <span>{formData.barber ? formData.barber.name : 'No seleccionado'}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Fecha:</span>
          <span>{formData.date || 'No seleccionada'}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Hora:</span>
          <span>{formData.time || 'No seleccionada'}</span>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="name">Nombre:</label>
        <input
          id="name"
          type="text"
          value={userDetails.name}
          onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Correo electrónico:</label>
        <input
          id="email"
          type="email"
          value={userDetails.email}
          onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Teléfono:</label>
        <input
          id="phone"
          type="tel"
          value={userDetails.phone}
          onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
          required
        />
      </div>
      {submitError && (
        <div className="form-error">{submitError}</div>
      )}
      <button 
        type="submit" 
        className="service-button"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Procesando...' : 'Confirmar cita'}
      </button>
    </form>
  );
}

export default AppointmentForm;