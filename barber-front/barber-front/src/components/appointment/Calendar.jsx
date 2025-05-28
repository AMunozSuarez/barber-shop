import React from 'react';
import { Calendar as ReactCalendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

const Calendar = ({ onDateChange }) => {
  const handleDateChange = (date) => {
    onDateChange(date);
  };

  return (
    <div className="calendar-container">
      <ReactCalendar onChange={handleDateChange} />
    </div>
  );
};

export default Calendar;