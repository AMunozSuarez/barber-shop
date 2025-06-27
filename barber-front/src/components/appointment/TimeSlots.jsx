import React, { useState, useEffect, useCallback } from 'react';
import { getAvailableTimeSlots } from '../../services/appointment.service';
import '../../assets/styles/components/appointment/TimeSlots.css';

const TimeSlots = ({ onSelect, selectedDate, selectedBarber, selectedService }) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener horarios disponibles del backend
  const fetchTimeSlots = useCallback(async () => {
    if (!selectedDate || !selectedBarber || !selectedService) {
      setAvailableSlots([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`🕐 Obteniendo horarios para barbero ${selectedBarber._id || selectedBarber.id} en fecha ${selectedDate} para servicio ${selectedService._id}`);
      
      const response = await getAvailableTimeSlots(
        selectedBarber._id || selectedBarber.id, 
        selectedDate,
        selectedService._id
      );
      
      if (response.success && Array.isArray(response.data)) {
        console.log('✅ Horarios disponibles:', response.data);
        setAvailableSlots(response.data);
      } else {
        console.warn('⚠️ No se encontraron horarios:', response);
        setAvailableSlots([]);
        setError('No hay horarios disponibles para esta fecha');
      }
    } catch (err) {
      console.error('❌ Error al obtener horarios:', err);
      setError(err.message || 'Error al cargar horarios disponibles');
      setAvailableSlots([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, selectedBarber, selectedService]);

  useEffect(() => {
    fetchTimeSlots();
  }, [fetchTimeSlots]);

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    onSelect(slot);
  };

  const handleRetry = () => {
    fetchTimeSlots();
  };

  if (!selectedDate || !selectedBarber || !selectedService) {
    return (
      <div className="time-slots">
        <h2>Selecciona una hora</h2>
        <div className="time-slots-message">
          <p>📅 Por favor, selecciona un barbero, servicio y fecha primero.</p>
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
        <p>✂️ <strong>Servicio:</strong> {selectedService.name} ({selectedService.duration} min)</p>
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
          <p>💡 Intenta seleccionar otra fecha o barbero.</p>
          <p>Recuerda que los horarios se actualizan según:</p>
          <ul>
            <li>La disponibilidad del barbero</li>
            <li>Las citas ya programadas</li>
            <li>La duración del servicio ({selectedService.duration} minutos)</li>
            <li>El horario de trabajo del barbero</li>
          </ul>
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