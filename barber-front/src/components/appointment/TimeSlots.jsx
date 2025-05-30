import React, { useState, useEffect, useCallback } from 'react';
import { useBarberAppointment } from '../../hooks/useBarberAppointment';
import '../../assets/styles/components/appointment/TimeSlots.css';

const TimeSlots = ({ onSelect, selectedDate, selectedBarber }) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getAvailableTimeSlots } = useBarberAppointment();

  // Extraer la función de obtención de horarios a un useCallback para estabilizar la referencia
  const fetchTimeSlots = useCallback(() => {
    if (!selectedDate || !selectedBarber) {
      setAvailableSlots([]);
      return;
    }
    
    setIsLoading(true);
    
    // Simular una pequeña demora como si fuera una llamada a API
    const timeoutId = setTimeout(() => {
      // Usar el método del hook para obtener horarios disponibles
      let slots = [];
      
      try {
        slots = getAvailableTimeSlots(selectedBarber.id, selectedDate);
        
        // Si no hay horarios disponibles por alguna razón, generamos algunos predeterminados
        if (!slots || slots.length === 0) {
          slots = generateDefaultTimeSlots();
        }
      } catch (error) {
        console.error("Error al obtener horarios disponibles:", error);
        slots = generateDefaultTimeSlots();
      }
      
      setAvailableSlots(slots);
      setIsLoading(false);
    }, 500);
    
    // Limpieza del timeout si el componente se desmonta
    return () => clearTimeout(timeoutId);
  }, [selectedDate, selectedBarber, getAvailableTimeSlots]);

  useEffect(() => {
    fetchTimeSlots();
  }, [fetchTimeSlots]);

  // Función de respaldo para generar horarios predeterminados
  const generateDefaultTimeSlots = useCallback(() => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      // Aleatoriamente marcar algunos horarios como no disponibles
      const morning = Math.random() > 0.3;
      const afternoon = Math.random() > 0.3;
      
      if (morning) slots.push(`${hour}:00`);
      if (hour < 17 && afternoon) slots.push(`${hour}:30`);
    }
    return slots;
  }, []);

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    onSelect(slot);
  };

  if (!selectedDate || !selectedBarber) {
    return (
      <div className="time-slots">
        <h2>Selecciona una hora</h2>
        <div className="time-slots-message">
          Por favor, selecciona un barbero y una fecha primero.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="time-slots">
        <h2>Selecciona una hora</h2>
        <div className="time-slots-message">
          Cargando horarios disponibles...
        </div>
      </div>
    );
  }

  return (
    <div className="time-slots">
      <h2>Selecciona una hora</h2>
      {availableSlots.length > 0 ? (
        <ul>
          {availableSlots.map((slot, index) => (
            <li key={index}>
              <button 
                className={selectedSlot === slot ? 'selected' : ''}
                onClick={() => handleSelectSlot(slot)}
              >
                {slot}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="time-slots-message">
          No hay horarios disponibles para la fecha seleccionada.
        </div>
      )}
    </div>
  );
};

export default TimeSlots;