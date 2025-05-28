import { useState } from 'react';
import { useAppointment } from '../../hooks/useAppointment';
import BarberSelection from './BarberSelection';
import Calendar from './Calendar';
import TimeSlots from './TimeSlots';

function AppointmentForm() {
  const { bookAppointment } = useAppointment();
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const appointmentData = {
      barber: selectedBarber,
      date: selectedDate,
      time: selectedTime,
      user: userDetails,
    };
    bookAppointment(appointmentData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Schedule an Appointment</h2>
      <BarberSelection setSelectedBarber={setSelectedBarber} />
      <Calendar setSelectedDate={setSelectedDate} />
      <TimeSlots setSelectedTime={setSelectedTime} />
      <div>
        <label>
          Name:
          <input
            type="text"
            value={userDetails.name}
            onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Email:
          <input
            type="email"
            value={userDetails.email}
            onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Phone:
          <input
            type="tel"
            value={userDetails.phone}
            onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
            required
          />
        </label>
      </div>
      <button type="submit">Book Appointment</button>
    </form>
  );
}

export default AppointmentForm;