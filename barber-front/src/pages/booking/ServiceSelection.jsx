import React, { useState, useEffect } from 'react';
import { getServices } from '../../services/service.service';
import Loading from '../../components/common/Loading';

const ServiceSelection = ({ onServiceSelect, selectedService }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getServices();
        
        if (response.success && response.data) {
          setServices(response.data);
        } else {
          setError('No se pudieron cargar los servicios');
        }
      } catch (err) {
        console.error('Error al obtener servicios:', err);
        setError(err.message || 'Error al cargar servicios');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleServiceSelect = (service) => {
    if (onServiceSelect) {
      onServiceSelect(service);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="service-selection-error">
        <p>❌ {error}</p>
        <button onClick={() => window.location.reload()}>
          Intentar nuevamente
        </button>
      </div>
    );
  }

  return (
    <div className="service-selection">
      <h1>Selecciona un Servicio</h1>
      <div className="services-grid">
        {services.map(service => (
          <div 
            key={service._id || service.id} 
            className={`service-card ${selectedService?._id === service._id ? 'selected' : ''}`}
            onClick={() => handleServiceSelect(service)}
          >
            <div className="service-header">
              <h2>{service.name}</h2>
              <span className="service-category">{service.category}</span>
            </div>
            <div className="service-details">
              <p className="service-description">{service.description}</p>
              <div className="service-info">
                <span className="service-duration">⏰ {service.duration} min</span>
                <span className="service-price">${service.price}</span>
              </div>
            </div>
            {service.image && (
              <div className="service-image">
                <img src={service.image} alt={service.name} />
              </div>
            )}
            <button 
              className={`select-button ${selectedService?._id === service._id ? 'selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleServiceSelect(service);
              }}
            >
              {selectedService?._id === service._id ? 'Seleccionado' : 'Seleccionar'}
            </button>
          </div>
        ))}
      </div>
      
      {services.length === 0 && (
        <div className="no-services">
          <p>No hay servicios disponibles en este momento.</p>
        </div>
      )}
    </div>
  );
};

export default ServiceSelection;