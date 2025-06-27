import React, { useState, useEffect } from 'react';
import { getBarbers } from '../../services/barber.service';
import Loading from '../common/Loading';
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
        
        console.log('🧔 Respuesta completa del servicio de barberos:', response);
        
        if (response.success && response.data) {
          console.log('📋 Datos de barberos recibidos:', response.data);
          // Log de cada barbero para verificar estructura
          response.data.forEach((barber, index) => {
            console.log(`Barbero ${index + 1}:`, {
              id: barber._id || barber.id,
              name: barber.name,
              user: barber.user,
              specialty: barber.specialty,
              allFields: barber
            });
          });
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

  const handleBarberSelect = (barber) => {
    setSelectedBarberId(barber._id);
    setSelectedBarber(barber);
  };

  const getBarberName = (barber) => {
    // Buscar el nombre en diferentes campos posibles
    if (barber.name) return barber.name;
    if (barber.user?.name) return barber.user.name;
    if (barber.user?.username) return barber.user.username;
    return `Barbero ${barber._id?.slice(-4) || 'Sin ID'}`;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Agregar estrellas llenas
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="star">★</span>);
    }

    // Agregar media estrella si es necesario
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }

    // Agregar estrellas vacías
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }

    return stars;
  };

  const formatAvailability = (schedule) => {
    const daysInSpanish = {
      monday: 'Lunes',
      tuesday: 'Martes',
      wednesday: 'Miércoles',
      thursday: 'Jueves',
      friday: 'Viernes',
      saturday: 'Sábado',
      sunday: 'Domingo'
    };

    return Object.entries(schedule || {}).map(([day, hours]) => {
      if (!hours || !hours.start || !hours.end) return null;
      return (
        <div key={day} className="availability-day">
          <span className="day-name">{daysInSpanish[day]}</span>
          <span className="day-hours">
            {hours.start} - {hours.end}
          </span>
        </div>
      );
    }).filter(Boolean);
  };

  if (loading) {
    return (
      <div className="loading">
        <p>Cargando barberos disponibles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Intentar nuevamente
        </button>
      </div>
    );
  }

  if (!barbers.length) {
    return (
      <div className="no-barbers">
        <p>No hay barberos disponibles en este momento.</p>
      </div>
    );
  }

  return (
    <div className="barber-selection">
      <div className="barbers-grid">
        {barbers.map((barber) => (
          <div
            key={barber._id}
            className={`barber-card ${selectedBarberId === barber._id ? 'selected' : ''}`}
            onClick={() => handleBarberSelect(barber)}
          >
            <div className="barber-info">
              <h4>{getBarberName(barber)}</h4>
              <span className="specialty">{barber.specialty || 'Barbero profesional'}</span>
              
              <div className="barber-rating">
                <div className="stars">
                  {renderStars(barber.rating || 4.5)}
                </div>
                <span className="reviews">
                  ({barber.reviewCount || '120'} reseñas)
                </span>
              </div>

              <span className="experience">
                {barber.experience || '5'} años de experiencia
              </span>

              <div className="availability-info">
                <h5>Horario de atención</h5>
                <div className="availability-grid">
                  {formatAvailability(barber.schedule)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarberSelection;