import React, { useEffect, useState } from 'react';
import { getBarbers } from '../../services/barber.service';
import Loading from '../common/Loading';

const BarbersList = () => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const data = await getBarbers();
        setBarbers(data);
      } catch (error) {
        console.error('Error fetching barbers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBarbers();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h2>Barbers List</h2>
      <ul>
        {barbers.map((barber) => (
          <li key={barber.id}>
            {barber.name} - {barber.specialty}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BarbersList;