import jwt from 'jsonwebtoken';

// Generar token JWT
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Verificar disponibilidad de horarios
export const isTimeSlotAvailable = (availableSlots, requestedDate, requestedStartTime) => {
  // Convertir la fecha solicitada a formato ISO para comparación
  const requestedDateStr = new Date(requestedDate).toISOString().split('T')[0];
  
  // Verificar si existe un slot disponible para esa fecha y hora
  return availableSlots.some(slot => {
    const slotDate = new Date(slot.date).toISOString().split('T')[0];
    return slotDate === requestedDateStr && slot.startTime === requestedStartTime && slot.isAvailable;
  });
};

// Calcular hora de finalización basada en duración del servicio
export const calculateEndTime = (startTime, durationMinutes) => {
  // Convertir el tiempo de inicio a minutos desde la medianoche
  const [hours, minutes] = startTime.split(':').map(Number);
  let totalMinutes = hours * 60 + minutes + durationMinutes;
  
  // Convertir los minutos totales de nuevo a formato HH:MM
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
};
