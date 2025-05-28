import React from 'react';
import AppointmentForm from '../../components/appointment/AppointmentForm';
import BarberSelection from '../../components/appointment/BarberSelection';
import Calendar from '../../components/appointment/Calendar';
import TimeSlots from '../../components/appointment/TimeSlots';

const Appointment = () => {
  return (
    <div>
      <h1>Book an Appointment</h1>
      <Calendar />
      <BarberSelection />
      <TimeSlots />
      <AppointmentForm />
    </div>
  );
};

export default Appointment;