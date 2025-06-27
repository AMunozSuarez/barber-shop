import React, { useState, useEffect, useCallback } from 'react';
import { getAvailableTimeSlots } from '../../services/appointment.service';
import '../../assets/styles/components/appointment/TimeSlots.css';

const TimeSlots = ({ onSelect, selectedDate, selectedBarber }) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener horarios disponibles del backend
  const fetchTimeSlots = useCallback(async () => {
    if (!selectedDate || !selectedBarber) {
      setAvailableSlots([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`🕐 Obteniendo horarios para barbero ${selectedBarber._id || selectedBarber.id} en fecha ${selectedDate}`);
      
      const response = await getAvailableTimeSlots(
        selectedBarber._id || selectedBarber.id, 
        selectedDate
      );
      
      if (response.success && response.data) {
        console.log('✅ Horarios obtenidos:', response.data);
        // El endpoint devuelve los slots directamente en response.data
        setAvailableSlots(Array.isArray(response.data) ? response.data : []);
      } else {
        console.warn('⚠️ No se encontraron horarios:', response);
        setAvailableSlots([]);
        setError('No hay horarios disponibles para esta fecha');
      }
    } catch (err) {
      console.error('❌ Error al obtener horarios:', err);
      setError(err.message || 'Error al cargar horarios disponibles');
      
      // Como fallback, generar algunos horarios predeterminados
      const defaultSlots = generateDefaultTimeSlots();
      setAvailableSlots(defaultSlots);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, selectedBarber]);

  useEffect(() => {
    fetchTimeSlots();
  }, [fetchTimeSlots]);

  // Función de respaldo para generar horarios predeterminados
  const generateDefaultTimeSlots = useCallback(() => {
    const slots = [];
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
      // Generar horarios cada 30 minutos
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < endHour - 1) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    
    // Filtrar algunos horarios aleatoriamente para simular disponibilidad
    return slots.filter(() => Math.random() > 0.3);
  }, []);

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    onSelect(slot);
  };

  const handleRetry = () => {
    fetchTimeSlots();
  };

  if (!selectedDate || !selectedBarber) {
    return (
      <div className="time-slots">
        <h2>Selecciona una hora</h2>
        <div className="time-slots-message">
          <p>📅 Por favor, selecciona un barbero y una fecha primero.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="time-slots">
        <h2>Selecciona una hora</h2>
        <div className="time-slots-message">
          <p>⏳ Cargando horarios disponibles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="time-slots">
      <h2>Selecciona una hora</h2>
      <div className="time-slots-info">
        <p>📅 <strong>Fecha:</strong> {new Date(selectedDate).toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</p>
        <p>💇‍♂️ <strong>Barbero:</strong> {selectedBarber.user?.name || selectedBarber.name}</p>
      </div>
      
      {error && (
        <div className="time-slots-error">
          <p>❌ {error}</p>
          <button onClick={handleRetry} className="retry-button">
            Intentar nuevamente
          </button>
        </div>
      )}
      
      {availableSlots.length > 0 ? (
        <div className="time-slots-grid">
          {availableSlots.map((slot, index) => (
            <button
              key={index}
              className={`time-slot ${selectedSlot === slot ? 'selected' : ''}`}
              onClick={() => handleSelectSlot(slot)}
            >
              {slot}
            </button>
          ))}
        </div>
      ) : !error && (
        <div className="time-slots-message">
          <p>⚠️ No hay horarios disponibles para la fecha seleccionada.</p>
          <p>💡 Intenta seleccionar otra fecha.</p>
        </div>
      )}
      
      {selectedSlot && (
        <div className="selected-time-info">
          <p>✅ <strong>Hora seleccionada:</strong> {selectedSlot}</p>
        </div>
      )}
    </div>
  );
};

export default TimeSlots;