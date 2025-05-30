import React, { useEffect, useState } from 'react';
import '../../assets/styles/components/appointment/BarberSelection.css';

const BarberSelection = ({ setSelectedBarber }) => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBarberId, setSelectedBarberId] = useState(null);

  useEffect(() => {
    // Simulamos una llamada a la API con un pequeño retraso
    setTimeout(() => {
      const mockBarbers = [
        { 
          id: 1, 
          name: 'Juan Martínez', 
          specialty: 'Cortes clásicos', 
          image: '/images/barber1.jpg',
          rating: 4.8,
          reviews: 120
        },
        { 
          id: 2, 
          name: 'Carlos Rodríguez', 
          specialty: 'Degradados y diseños', 
          image: '/images/barber2.jpg',
          rating: 4.9,
          reviews: 95
        },
        { 
          id: 3, 
          name: 'Miguel Sánchez', 
          specialty: 'Barbas y bigotes', 
          image: '/images/barber3.jpg',
          rating: 4.7,
          reviews: 87
        },
      ];
      setBarbers(mockBarbers);
      setLoading(false);
    }, 500);
  }, []);

  const handleSelectBarber = (barber) => {
    setSelectedBarberId(barber.id);
    setSelectedBarber(barber);
  };

  if (loading) {
    return <div className="barber-selection"><div className="loading">Cargando barberos...</div></div>;
  }

  return (
    <div className="barber-selection">
      <h2>Selecciona tu barbero</h2>
      {error && <p className="error">{error}</p>}
      <div className="barber-list">
        {barbers.map((barber) => (
          <div 
            key={barber.id} 
            className={`barber-item ${selectedBarberId === barber.id ? 'selected' : ''}`}
            onClick={() => handleSelectBarber(barber)}
          >
            <img src={barber.image} alt={barber.name} />
            <div className="barber-info">
              <div className="barber-name">{barber.name}</div>
              <div className="barber-specialty">{barber.specialty}</div>
              <div className="barber-rating">
                <div className="stars">★★★★★</div>
                <div className="rating-count">{barber.rating} ({barber.reviews} reseñas)</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarberSelection;