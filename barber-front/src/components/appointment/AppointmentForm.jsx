import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppointment } from '../../hooks/useAppointment';
import { useAuth } from '../../context/AuthContext';
import '../../assets/styles/components/appointment/AppointmentForm.css';

function AppointmentForm({ selectedService, selectedBarber, selectedDate, selectedTime }) {
  const navigate = useNavigate();
  const { addAppointment } = useAppointment();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    
    // Verificar que el usuario esté autenticado
    if (!isAuthenticated) {
      setSubmitError('Debes iniciar sesión para agendar una cita. Por favor inicia sesión e intenta nuevamente.');
      return;
    }
    
    // Verificar que todos los campos necesarios estén completos
    if (!formData.service || !formData.barber || !formData.date || !formData.time) {
      setSubmitError('Por favor, completa todos los campos de la cita');
      return;
    }
    
    // Preparar datos para el backend
    const appointmentData = {
      serviceId: formData.service._id || formData.service.id,
      barberId: formData.barber._id || formData.barber.id,
      date: formData.date,
      startTime: formData.time,
      notes: `Cita para ${user.name}`
    };

    console.log('📅 Creando cita con datos:', {
      ...appointmentData,
      dateInfo: {
        original: formData.date,
        type: typeof formData.date,
        dateObject: new Date(formData.date),
        iso: new Date(formData.date).toISOString()
      }
    });
    setIsSubmitting(true);
    
    try {
      const response = await addAppointment(appointmentData);
      
      if (response.success) {
        console.log('✅ Cita creada exitosamente:', response.data);
        
        // Preparar datos para la página de confirmación
        const confirmationData = {
          id: response.data._id || response.data.id,
          service: formData.service,
          barber: formData.barber,
          date: formData.date,
          time: formData.time,
          customer: userDetails,
          status: response.data.status || 'pending',
          createdAt: response.data.createdAt || new Date().toISOString()
        };
        
        navigate('/confirmation', { 
          state: { appointmentDetails: confirmationData } 
        });
      } else {
        throw new Error(response.message || 'Error al crear la cita');
      }
    } catch (error) {
      console.error('❌ Error al crear cita:', {
        message: error.message,
        status: error.status,
        statusText: error.statusText,
        data: error.data,
        fullError: error
      });
      
      let errorMessage = 'Ha ocurrido un error al agendar la cita. Por favor intenta nuevamente.';
      
      if (error.data?.details && Array.isArray(error.data.details)) {
        errorMessage = `Errores de validación: ${error.data.details.join(', ')}`;
      } else if (error.data?.error) {
        errorMessage = error.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si no está autenticado, mostrar mensaje de login
  if (!isAuthenticated) {
    return (
      <div className="appointment-form">
        <h2>Inicia sesión para agendar tu cita</h2>
        <div className="auth-required">
          <div className="auth-message">
            <p>🔒 <strong>Autenticación requerida</strong></p>
            <p>Para agendar una cita, necesitas tener una cuenta e iniciar sesión.</p>
            <p>Esto nos permite:</p>
            <ul>
              <li>Gestionar tus citas de forma segura</li>
              <li>Enviarte recordatorios por email</li>
              <li>Mantener un historial de tus visitas</li>
              <li>Ofrecerte una mejor experiencia personalizada</li>
            </ul>
          </div>
          <div className="auth-actions">
            <button 
              className="service-button" 
              onClick={() => navigate('/auth/login')}
            >
              🔑 Iniciar Sesión
            </button>
            <button 
              className="service-button secondary" 
              onClick={() => navigate('/auth/register')}
            >
              📝 Crear Cuenta
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <span>${formData.service ? formData.service.price : '-'}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Duración:</span>
          <span>{formData.service ? `${formData.service.duration} min` : '-'}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Barbero:</span>
          <span>{formData.barber ? (formData.barber.user?.name || formData.barber.name) : 'No seleccionado'}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Fecha:</span>
          <span>{formData.date ? new Date(formData.date).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : 'No seleccionada'}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Hora:</span>
          <span>{formData.time || 'No seleccionada'}</span>
        </div>
      </div>

      <div className="customer-details">
        <h3>Datos de contacto</h3>
        <div className="customer-info">
          <p><strong>Cliente:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Teléfono:</strong> {user.phone}</p>
        </div>
      </div>

      {submitError && (
        <div className="form-error">
          <h4>❌ Error al crear la cita:</h4>
          <p>{submitError}</p>
          <button 
            className="service-button secondary"
            onClick={() => setSubmitError(null)}
          >
            Entendido
          </button>
        </div>
      )}
      
      <button 
        type="submit" 
        className="service-button"
        disabled={isSubmitting}
      >
        {isSubmitting ? '⏳ Creando cita...' : '✅ Confirmar cita'}
      </button>
    </form>
  );
}

export default AppointmentForm;