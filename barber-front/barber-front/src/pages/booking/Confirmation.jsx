import React from 'react';
import { useLocation } from 'react-router-dom';

const Confirmation = () => {
  const location = useLocation();
  const { appointmentDetails } = location.state || {};

  return (
    <div className="confirmation">
      <h1>Appointment Confirmation</h1>
      {appointmentDetails ? (
        <div>
          <h2>Your Appointment Details:</h2>
          <p><strong>Service:</strong> {appointmentDetails.service}</p>
          <p><strong>Barber:</strong> {appointmentDetails.barber}</p>
          <p><strong>Date:</strong> {appointmentDetails.date}</p>
          <p><strong>Time:</strong> {appointmentDetails.time}</p>
        </div>
      ) : (
        <p>No appointment details available.</p>
      )}
      <button onClick={() => window.location.href = '/'}>Go to Home</button>
    </div>
  );
};

export default Confirmation;