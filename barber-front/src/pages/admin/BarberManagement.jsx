import { useEffect, useState } from 'react';
import { getBarbers, deleteBarber } from '../../services/barber.service';
import BarbersList from '../../components/admin/BarbersList';
import Button from '../../components/common/Button';

function BarberManagement() {
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

  const handleDelete = async (id) => {
    try {
      await deleteBarber(id);
      setBarbers(barbers.filter(barber => barber.id !== id));
    } catch (error) {
      console.error('Error deleting barber:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Barber Management</h1>
      <Button onClick={() => {/* Logic to add a new barber */}}>Add Barber</Button>
      <BarbersList barbers={barbers} onDelete={handleDelete} />
    </div>
  );
}

export default BarberManagement;