import React, { useState, useEffect } from 'react';
import BarberSelection from '../../components/appointment/BarberSelection';
import Calendar from '../../components/appointment/Calendar';
import TimeSlots from '../../components/appointment/TimeSlots';
import AppointmentForm from '../../components/appointment/AppointmentForm';
import TimeSlotsDebug from '../../components/common/TimeSlotsDebug';
import { getServices } from '../../services/service.service';
import Loading from '../../components/common/Loading';
import '../../assets/styles/pages/booking/Booking.css';

const Appointment = () => {
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para servicios del backend
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState(null);

  // Cargar servicios del backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setServicesLoading(true);
        setServicesError(null);
        
        const response = await getServices();
        
        if (response.success && response.data) {
          setServices(response.data);
        } else {
          setServicesError('No se pudieron cargar los servicios');
        }
      } catch (err) {
        console.error('Error al obtener servicios:', err);
        setServicesError(err.message || 'Error al cargar servicios');
      } finally {
        setServicesLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setCurrentStep(2);
  };
  
  const handleBarberSelect = (barber) => {
    setSelectedBarber(barber);
    // Al seleccionar un barbero, reseteamos la fecha y hora
    setSelectedDate(null);
    setSelectedTime(null);
    setCurrentStep(3);
  };
  
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    // No avanzamos al siguiente paso hasta que se seleccione una hora
  };
  
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setCurrentStep(4);
  };

  // Filtrar servicios basados en el término de búsqueda
  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agrupar servicios por categoría
  const servicesByCategory = filteredServices.reduce((acc, service) => {
    const category = service.category || 'general';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {});

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Selección de servicio
        if (servicesLoading) {
          return <Loading />;
        }
        
        if (servicesError) {
          return (
            <div className="services-error">
              <p>❌ {servicesError}</p>
              <button onClick={() => window.location.reload()}>
                Intentar nuevamente
              </button>
            </div>
          );
        }
        
        return (
          <>
            <div className="search-bar">
              <input 
                type="text" 
                placeholder="¿Qué servicio buscas?" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
              <div key={category}>
                <div className="service-category">
                  <h1>{category === 'haircut' ? 'Cortes de cabello' : 
                       category === 'beard' ? 'Barbas y afeitado' :
                       category === 'combo' ? 'Servicios combinados' :
                       category === 'special' ? 'Servicios especiales' :
                       'Servicios generales'}</h1>
                  <button className="collapse-button">-</button>
                </div>
                <div className="appointment-container">
                  {categoryServices.map(service => (
                    <div key={service._id || service.id} className="service-card">
                      <h2>{service.name}</h2>
                      <div className="service-info">
                        <span className="service-time">{service.duration} min</span>
                        <span className="service-price">${service.price}</span>
                      </div>
                      <p className="service-description">{service.description}</p>
                      
                      {service.image && (
                        <div className="service-image">
                          <img src={service.image} alt={service.name} />
                        </div>
                      )}
                      
                      <button 
                        className="service-button"
                        onClick={() => handleServiceSelect(service)}
                        disabled={!service.isActive}
                      >
                        {service.isActive ? 'Agendar servicio' : 'No disponible'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {filteredServices.length === 0 && !servicesLoading && (
              <div className="no-services">
                <p>No se encontraron servicios.</p>
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')}>
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            )}
          </>
        );
        
      case 2: // Selección de barbero
        return (
          <div className="step-container">
            <h3>🧔 Selecciona tu barbero preferido</h3>
            <p className="step-description">
              Elige entre nuestros barberos profesionales. Cada uno tiene su especialidad y horarios disponibles.
            </p>
            <BarberSelection setSelectedBarber={handleBarberSelect} />
          </div>
        );
        
      case 3: // Selección de fecha y hora
        return (
          <div className="step-container">
            <h3>Selecciona fecha y hora</h3>
            <div className="date-time-selection">
              <Calendar 
                selectedBarber={selectedBarber} 
                setSelectedDate={handleDateSelect} 
              />
              {selectedDate && (
                <>
                  <TimeSlots 
                    selectedBarber={selectedBarber}
                    selectedDate={selectedDate}
                    selectedService={selectedService}
                    onSelect={handleTimeSelect}
                  />
                  <TimeSlotsDebug 
                    selectedBarber={selectedBarber}
                    selectedDate={selectedDate}
                    selectedService={selectedService}
                  />
                </>
              )}
            </div>
          </div>
        );
        
      case 4: // Confirmación de detalles
        return (
          <div className="step-container">
            <h3>Confirma tu cita</h3>
            <AppointmentForm 
              selectedService={selectedService}
              selectedBarber={selectedBarber}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
            />
          </div>
        );
        
      default:
        return <div>Error: Paso desconocido</div>;
    }
  };

  const handleGoBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Resetear estados según el paso
      switch (currentStep) {
        case 4:
          setSelectedTime(null);
          break;
        case 3:
          setSelectedDate(null);
          setSelectedTime(null);
          break;
        case 2:
          setSelectedBarber(null);
          setSelectedDate(null);
          setSelectedTime(null);
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="appointment-page">
      <div className="booking-steps">
        <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Seleccionar servicio</div>
        </div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Elegir barbero</div>
        </div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Seleccionar fecha/hora</div>
        </div>
        <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
          <div className="step-number">4</div>
          <div className="step-label">Confirmar detalles</div>
        </div>
      </div>

      {currentStep > 1 && (
        <button onClick={handleGoBack} className="back-button">
          Volver atrás
        </button>
      )}

      {renderStepContent()}
    </div>
  );
};

export default Appointment;