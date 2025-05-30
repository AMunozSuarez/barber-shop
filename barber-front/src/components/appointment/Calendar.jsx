import React, { useState } from 'react';
import { Calendar as ReactCalendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../assets/styles/components/appointment/Calendar.css';

const Calendar = ({ setSelectedDate }) => {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    setDate(newDate);
    // Formatear la fecha como string para enviarla al componente padre
    const formattedDate = newDate.toLocaleDateString();
    setSelectedDate(formattedDate);
  };

  // Filtrar fechas pasadas para no permitir seleccionarlas
  const tileDisabled = ({ date, view }) => {
    // Deshabilitar fechas anteriores a hoy
    return view === 'month' && date < new Date().setHours(0, 0, 0, 0);
  };

  return (
    <div className="calendar-container">
      <h2>Selecciona una fecha</h2>
      <ReactCalendar 
        onChange={handleDateChange} 
        value={date}
        tileDisabled={tileDisabled}
        minDate={new Date()}
        maxDate={new Date(new Date().setMonth(new Date().getMonth() + 3))}
        prev2Label={null}
        next2Label={null}
        locale="es-ES"
      />
    </div>
  );
};

export default Calendar;