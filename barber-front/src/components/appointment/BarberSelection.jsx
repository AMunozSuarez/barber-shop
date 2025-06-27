import React, { useEffect, useState } from 'react';
import { getBarbers } from '../../services/barber.service';
import '../../assets/styles/components/appointment/BarberSelection.css';

const BarberSelection = ({ setSelectedBarber }) => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBarberId, setSelectedBarberId] = useState(null);

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getBarbers();
        
        if (response.success && response.data) {
          setBarbers(response.data);
        } else {
          setError('No se pudieron cargar los barberos');
        }
      } catch (err) {
        console.error('Error al obtener barberos:', err);
        setError(err.message || 'Error al cargar barberos');
      } finally {
        setLoading(false);
      }
    };

    fetchBarbers();
  }, []);

  const handleSelectBarber = (barber) => {
    setSelectedBarberId(barber._id || barber.id);
    setSelectedBarber(barber);
  };

  if (loading) {
    return (
      <div className="barber-selection">
        <div className="loading">Cargando barberos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="barber-selection">
        <div className="error">
          <p>❌ {error}</p>
          <button onClick={() => window.location.reload()}>
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="barber-selection">
      <h3>Selecciona tu barbero</h3>
      <div className="barbers-grid">
        {barbers.map((barber) => (
          <div 
            key={barber._id || barber.id} 
            className={`barber-card ${selectedBarberId === (barber._id || barber.id) ? 'selected' : ''}`}
            onClick={() => handleSelectBarber(barber)}
          >
            <div className="barber-image">
              <img 
                src={barber.image || '/images/default-barber.jpg'} 
                alt={barber.name}
                onError={(e) => {
                  e.target.src = '/images/default-barber.jpg';
                }}
              />
            </div>
            <div className="barber-info">
              <h4>{barber.name}</h4>
              <p className="specialty">{barber.specialty || 'Barbero profesional'}</p>
              <div className="barber-rating">
                <span className="rating">⭐ {barber.rating || 4.5}</span>
                <span className="reviews">({barber.reviewCount || 0} reseñas)</span>
              </div>
              {barber.experience && (
                <p className="experience">{barber.experience} años de experiencia</p>
              )}
            </div>
          </div>
        ))}
      </div>
      {barbers.length === 0 && (
        <div className="no-barbers">
          <p>No hay barberos disponibles en este momento.</p>
        </div>
      )}
    </div>
  );
};

export default BarberSelection;