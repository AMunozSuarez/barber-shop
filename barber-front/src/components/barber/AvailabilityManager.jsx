import React, { useState, useEffect } from 'react';
import { useBarber } from '../../hooks/useBarber';
import '../../assets/styles/components/barber/AvailabilityManager.css';

const AvailabilityManager = ({ currentAvailability = [], onUpdate }) => {
  const { updateBarberAvailability, loading } = useBarber();
  const [availability, setAvailability] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [message, setMessage] = useState('');

  // Días de la semana en español
  const daysOfWeek = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ];

  // Inicializar disponibilidad
  useEffect(() => {
    const initializeAvailability = () => {
      const defaultAvailability = daysOfWeek.map(day => {
        const existing = currentAvailability.find(av => av.day === day.key);
        return existing || {
          day: day.key,
          isAvailable: false,
          startTime: '09:00',
          endTime: '18:00'
        };
      });
      setAvailability(defaultAvailability);
    };

    initializeAvailability();
  }, [currentAvailability]);

  // Manejar cambio en disponibilidad de un día
  const handleAvailabilityChange = (dayKey, field, value) => {
    setAvailability(prev => prev.map(day => 
      day.day === dayKey 
        ? { ...day, [field]: value }
        : day
    ));
    setHasChanges(true);
    setMessage('');
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Validaciones
    const errors = [];
    availability.forEach(day => {
      if (day.isAvailable) {
        if (!day.startTime || !day.endTime) {
          errors.push(`${getDayLabel(day.day)}: Debe especificar horario de inicio y fin`);
        } else {
          const start = new Date(`2000-01-01T${day.startTime}:00`);
          const end = new Date(`2000-01-01T${day.endTime}:00`);
          if (start >= end) {
            errors.push(`${getDayLabel(day.day)}: La hora de inicio debe ser anterior a la de fin`);
          }
        }
      }
    });

    if (errors.length > 0) {
      setMessage(`❌ Errores de validación:\n${errors.join('\n')}`);
      return;
    }

    try {
      const response = await updateBarberAvailability(availability);
      setMessage('✅ Disponibilidad actualizada exitosamente');
      setHasChanges(false);
      
      // Notificar al componente padre
      if (onUpdate) {
        onUpdate(response.data);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  // Obtener etiqueta del día
  const getDayLabel = (dayKey) => {
    return daysOfWeek.find(day => day.key === dayKey)?.label || dayKey;
  };

  // Preset de horarios comunes
  const applyPreset = (preset) => {
    let presetSchedule = {};
    
    switch (preset) {
      case 'standard':
        presetSchedule = {
          startTime: '09:00',
          endTime: '18:00',
          weekdays: true,
          weekends: false
        };
        break;
      case 'extended':
        presetSchedule = {
          startTime: '08:00',
          endTime: '20:00',
          weekdays: true,
          weekends: true
        };
        break;
      case 'parttime':
        presetSchedule = {
          startTime: '14:00',
          endTime: '18:00',
          weekdays: true,
          weekends: false
        };
        break;
      default:
        return;
    }

    setAvailability(prev => prev.map(day => {
      const isWeekend = day.day === 'saturday' || day.day === 'sunday';
      const shouldBeAvailable = presetSchedule.weekdays && !isWeekend || 
                               presetSchedule.weekends && isWeekend;
      
      return {
        ...day,
        isAvailable: shouldBeAvailable,
        startTime: presetSchedule.startTime,
        endTime: presetSchedule.endTime
      };
    }));
    
    setHasChanges(true);
    setMessage('');
  };

  return (
    <div className="availability-manager">
      <div className="availability-header">
        <h3>🗓️ Gestionar Disponibilidad</h3>
        <p>Configure los días y horarios en los que está disponible para citas</p>
      </div>

      {/* Presets rápidos */}
      <div className="preset-buttons">
        <h4>Horarios predefinidos:</h4>
        <div className="preset-grid">
          <button 
            type="button" 
            className="preset-btn"
            onClick={() => applyPreset('standard')}
          >
            📅 Estándar<br/>
            <small>L-V: 9:00-18:00</small>
          </button>
          <button 
            type="button" 
            className="preset-btn"
            onClick={() => applyPreset('extended')}
          >
            🕐 Extendido<br/>
            <small>L-D: 8:00-20:00</small>
          </button>
          <button 
            type="button" 
            className="preset-btn"
            onClick={() => applyPreset('parttime')}
          >
            ⏰ Medio tiempo<br/>
            <small>L-V: 14:00-18:00</small>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="availability-grid">
          {daysOfWeek.map(day => {
            const daySchedule = availability.find(av => av.day === day.key) || {};
            
            return (
              <div key={day.key} className="day-schedule">
                <div className="day-header">
                  <label className="day-checkbox">
                    <input
                      type="checkbox"
                      checked={daySchedule.isAvailable || false}
                      onChange={(e) => handleAvailabilityChange(day.key, 'isAvailable', e.target.checked)}
                    />
                    <span className="day-label">{day.label}</span>
                  </label>
                </div>
                
                {daySchedule.isAvailable && (
                  <div className="time-inputs">
                    <div className="time-group">
                      <label htmlFor={`start-${day.key}`}>Inicio:</label>
                      <input
                        id={`start-${day.key}`}
                        type="time"
                        value={daySchedule.startTime || '09:00'}
                        onChange={(e) => handleAvailabilityChange(day.key, 'startTime', e.target.value)}
                        required
                      />
                    </div>
                    <div className="time-group">
                      <label htmlFor={`end-${day.key}`}>Fin:</label>
                      <input
                        id={`end-${day.key}`}
                        type="time"
                        value={daySchedule.endTime || '18:00'}
                        onChange={(e) => handleAvailabilityChange(day.key, 'endTime', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}
                
                {!daySchedule.isAvailable && (
                  <div className="day-disabled">
                    <span>No disponible</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            <pre>{message}</pre>
          </div>
        )}

        <div className="form-actions">
          <button 
            type="submit" 
            className="save-btn"
            disabled={loading || !hasChanges}
          >
            {loading ? '⏳ Guardando...' : '💾 Guardar Disponibilidad'}
          </button>
          
          {hasChanges && (
            <span className="changes-indicator">
              ⚠️ Hay cambios sin guardar
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default AvailabilityManager; 