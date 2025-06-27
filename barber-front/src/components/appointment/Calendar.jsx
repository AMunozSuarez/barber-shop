import React, { useState, useEffect } from 'react';
import '../../assets/styles/components/appointment/Calendar.css';

const Calendar = ({ selectedBarber, setSelectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const daysInSpanish = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const monthsInSpanish = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Agregar días del mes anterior para completar la primera semana
    for (let i = 0; i < firstDay.getDay(); i++) {
      const prevDate = new Date(year, month, -i);
      days.unshift({
        date: prevDate,
        isCurrentMonth: false,
        isSelectable: false
      });
    }

    // Agregar días del mes actual
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDate = new Date(year, month, i);
      days.push({
        date: currentDate,
        isCurrentMonth: true,
        isSelectable: isDateSelectable(currentDate)
      });
    }

    // Agregar días del mes siguiente para completar la última semana
    const remainingDays = 42 - days.length; // 6 semanas x 7 días = 42
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        isSelectable: false
      });
    }

    return days;
  };

  const isDateSelectable = (date) => {
    if (!selectedBarber || !selectedBarber.availability) return false;

    // No permitir fechas pasadas
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return false;

    // Obtener el día de la semana (0 = domingo, 1 = lunes, etc.)
    const dayOfWeek = date.getDay();
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = daysOfWeek[dayOfWeek];

    // Buscar la disponibilidad para este día
    const dayAvailability = selectedBarber.availability.find(
      day => day.day === dayName && day.isAvailable
    );

    // Verificar si el barbero trabaja ese día
    return !!dayAvailability;
  };

  const handleDateSelect = (day) => {
    if (!day.isSelectable) return;
    
    const selectedDate = day.date;
    setSelectedDay(selectedDate);

    // Formatear la fecha en formato ISO (YYYY-MM-DD)
    const formattedDate = selectedDate.toISOString().split('T')[0];
    setSelectedDate(formattedDate);
  };

  const handleMonthChange = (increment) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
    setSelectedDay(null);
    setSelectedDate(null);
  };

  const renderCalendarHeader = () => (
    <div className="calendar-header">
      <button onClick={() => handleMonthChange(-1)} className="month-nav">
        ←
      </button>
      <h2>
        {monthsInSpanish[currentDate.getMonth()]} {currentDate.getFullYear()}
      </h2>
      <button onClick={() => handleMonthChange(1)} className="month-nav">
        →
      </button>
    </div>
  );

  const renderDayNames = () => (
    <div className="calendar-days">
      {daysInSpanish.map((day, index) => (
        <div key={index} className="day-name">
          {day.slice(0, 3)}
        </div>
      ))}
    </div>
  );

  const renderCalendarDays = () => {
    const days = getDaysInMonth(currentDate);
    
    return (
      <div className="calendar-grid">
        {days.map((day, index) => {
          const isSelected = selectedDay && 
            day.date.toDateString() === selectedDay.toDateString();
          
          const isToday = day.date.toDateString() === new Date().toDateString();
          
          const className = [
            'calendar-day',
            !day.isCurrentMonth ? 'other-month' : '',
            day.isSelectable ? 'selectable' : 'not-selectable',
            isSelected ? 'selected' : '',
            isToday ? 'today' : ''
          ].filter(Boolean).join(' ');

          return (
            <div
              key={index}
              className={className}
              onClick={() => handleDateSelect(day)}
            >
              <span className="day-number">{day.date.getDate()}</span>
              {day.isSelectable && (
                <span className="availability-indicator"></span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (!selectedBarber) {
    return (
      <div className="calendar-container">
        <div className="calendar-message">
          <p>👨‍💇‍♂️ Por favor, selecciona un barbero primero.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-container">
      <div className="calendar-info">
        <p>💇‍♂️ <strong>Barbero:</strong> {selectedBarber.user?.name || selectedBarber.name}</p>
        <p>📅 <strong>Días disponibles:</strong></p>
        <ul className="working-days-list">
          {selectedBarber.availability
            .filter(day => day.isAvailable)
            .map(day => (
              <li key={day.day}>
                {daysInSpanish[['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(day.day)]}: {day.startTime} - {day.endTime}
              </li>
            ))}
        </ul>
      </div>
      {renderCalendarHeader()}
      {renderDayNames()}
      {renderCalendarDays()}
    </div>
  );
};

export default Calendar;