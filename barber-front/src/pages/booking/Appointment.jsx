import React, { useState, useEffect } from 'react';
import BarberSelection from '../../components/appointment/BarberSelection';
import Calendar from '../../components/appointment/Calendar';
import TimeSlots from '../../components/appointment/TimeSlots';
import AppointmentForm from '../../components/appointment/AppointmentForm';
import '../../assets/styles/pages/booking/Booking.css';

const Appointment = () => {
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Datos simulados de servicios de barbería (similar a la imagen)
  const services = [
    {
      id: 1,
      name: "Corte Adulto",
      duration: "45 min",
      price: "$15.000",
      description: "Corte de cabello en seco",
      images: []
    },
    {
      id: 2,
      name: "Corte de pelo Niño (Hasta 10 años)",
      duration: "40 min",
      price: "$12.000",
      description: "Corte de pelo en seco para niños",
      images: ["/images/kid1.jpg", "/images/kid2.jpg"]
    },
    {
      id: 3,
      name: "Corte de cabello Largo Hombre (solo tijeras)",
      duration: "50 min",
      price: "$18.000",
      description: "Este corte de cabello es un corte estilizado hecho solo a tijeras con terminaciones largas y personalizadas. El largo mínimo para esta...",
      images: ["/images/long1.jpg", "/images/long2.jpg", "/images/long3.jpg"]
    },
    {
      id: 4,
      name: "Corte Adulto Premium (corte de cabello + limpieza facial)",
      duration: "1 hrs 20 min",
      price: "$23.000",
      description: "Corte completo con limpieza facial incluida",
      images: ["/images/premium1.jpg", "/images/premium2.jpg"]
    }
  ];

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setCurrentStep(2);
  };
  
  const handleBarberSelect = (barber) => {
    setSelectedBarber(barber);
    setCurrentStep(3);
  };
  
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setCurrentStep(3);
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Selección de servicio
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
            <div className="service-category">
              <h1>Cortes de cabello</h1>
              <button className="collapse-button">-</button>
            </div>
            <div className="appointment-container">
              {filteredServices.map(service => (
                <div key={service.id} className="service-card">
                  <h2>{service.name}</h2>
                  <div className="service-info">
                    <span className="service-time">{service.duration}</span>
                    <span className="service-price">{service.price}</span>
                  </div>
                  <p className="service-description">{service.description}</p>
                  
                  {service.images.length > 0 && (
                    <div className="service-images">
                      {service.images.map((img, index) => (
                        <img key={index} src={img} alt={`Estilo ${index + 1}`} className="service-image" />
                      ))}
                    </div>
                  )}
                  
                  {service.description.length > 50 && (
                    <a href="#" className="more-info">Más información</a>
                  )}
                  
                  <button 
                    className="service-button"
                    onClick={() => handleServiceSelect(service)}
                  >
                    Agendar servicio
                  </button>
                </div>
              ))}
            </div>
          </>
        );
      case 2: // Selección de barbero
        return <BarberSelection setSelectedBarber={handleBarberSelect} />;
      case 3: // Selección de fecha y hora
        return (
          <>
            <Calendar setSelectedDate={handleDateSelect} />
            <TimeSlots 
              selectedBarber={selectedBarber}
              selectedDate={selectedDate}
              onSelect={handleTimeSelect}
            />
          </>
        );
      case 4: // Confirmación de detalles
        return (
          <AppointmentForm 
            selectedService={selectedService}
            selectedBarber={selectedBarber}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
          />
        );
      default:
        return <div>Error: Paso desconocido</div>;
    }
  };

  const handleGoBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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