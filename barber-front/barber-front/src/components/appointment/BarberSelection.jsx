import React, { useEffect, useState } from 'react';
import { getBarbers } from '../../services/barber.service';

const BarberSelection = ({ onSelectBarber }) => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const data = await getBarbers();
        setBarbers(data);
      } catch (err) {
        setError('Failed to load barbers');
      } finally {
        setLoading(false);
      }
    };

    fetchBarbers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Select a Barber</h2>
      <ul>
        {barbers.map((barber) => (
          <li key={barber.id} onClick={() => onSelectBarber(barber)}>
            {barber.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BarberSelection;