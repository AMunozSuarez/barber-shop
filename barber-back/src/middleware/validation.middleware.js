// Middleware de validación para registro de usuario
export const validateUserRegistration = (req, res, next) => {
  const { name, username, email, password, phone } = req.body;
  const errors = [];

  // Validar nombre (usar name o username)
  const userName = name || username;
  if (!userName || userName.trim().length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres');
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Por favor proporciona un email válido');
  }

  // Validar contraseña
  if (!password || password.length < 6) {
    errors.push('La contraseña debe tener al menos 6 caracteres');
  }

  // Validar teléfono (opcional pero si se proporciona debe ser válido)
  if (phone) {
    const phoneRegex = /^[0-9]{6,15}$/;
    if (!phoneRegex.test(phone.replace(/\s|-|\(|\)/g, ''))) {
      errors.push('Por favor proporciona un número de teléfono válido (6-15 dígitos)');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Errores de validación',
      details: errors
    });
  }

  next();
};

// Middleware de validación para creación de citas
export const validateAppointmentCreation = (req, res, next) => {
  console.log('🔍 Validando datos de cita recibidos:', req.body);
  
  const { barberId, serviceId, date, startTime } = req.body;
  const errors = [];

  console.log('🔍 Campos extraídos:', { barberId, serviceId, date, startTime });

  // Validar barbero
  if (!barberId) {
    console.log('❌ Falta barberId');
    errors.push('El ID del barbero es requerido');
  }

  // Validar servicio
  if (!serviceId) {
    console.log('❌ Falta serviceId');
    errors.push('El ID del servicio es requerido');
  }

  // Validar fecha
  if (!date) {
    console.log('❌ Falta date');
    errors.push('La fecha es requerida');
  } else {
    console.log('🔍 Validando fecha recibida:', date, 'Tipo:', typeof date);
    
    // Normalizar la fecha para evitar problemas de zona horaria
    const dateString = typeof date === 'string' && date.includes('T') ? date.split('T')[0] : date;
    const appointmentDate = new Date(dateString + 'T12:00:00.000Z'); // Usar mediodía UTC
    
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    const todayUTC = new Date(todayString + 'T12:00:00.000Z');
    
    console.log('🔍 Fechas normalizadas:');
    console.log('   - Fecha cita:', appointmentDate.toISOString(), '(' + dateString + ')');
    console.log('   - Hoy:', todayUTC.toISOString(), '(' + todayString + ')');
    console.log('   - Comparación:', appointmentDate.getTime(), 'vs', todayUTC.getTime());
    
    if (isNaN(appointmentDate.getTime())) {
      console.log('❌ Fecha inválida');
      errors.push('Formato de fecha inválido');
    } else if (appointmentDate < todayUTC) {
      console.log('❌ Fecha en el pasado');
      errors.push('No se pueden programar citas para fechas pasadas');
    } else {
      // No permitir citas más de 30 días en el futuro
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 30);
      maxDate.setHours(12, 0, 0, 0); // Usar mediodía para evitar problemas de zona horaria
      
      if (appointmentDate > maxDate) {
        console.log('❌ Fecha demasiado lejana');
        errors.push('No se pueden programar citas con más de 30 días de anticipación');
      } else {
        console.log('✅ Fecha válida');
      }
    }
  }

  // Validar hora de inicio
  if (!startTime) {
    console.log('❌ Falta startTime');
    errors.push('La hora de inicio es requerida');
  } else {
    console.log('🔍 Validando hora:', startTime);
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime)) {
      console.log('❌ Formato de hora inválido');
      errors.push('La hora debe estar en formato HH:MM');
    }
  }

  if (errors.length > 0) {
    console.log('❌ Errores de validación encontrados:', errors);
    return res.status(400).json({
      success: false,
      error: 'Errores de validación',
      details: errors
    });
  }

  console.log('✅ Validación exitosa, pasando al controlador');
  next();
};

// Middleware de validación para creación de servicios
export const validateServiceCreation = (req, res, next) => {
  const { name, price, duration, category } = req.body;
  const errors = [];

  // Validar nombre
  if (!name || name.trim().length < 2) {
    errors.push('El nombre del servicio debe tener al menos 2 caracteres');
  }

  // Validar precio
  if (price === undefined || price === null || price < 0) {
    errors.push('El precio debe ser un número positivo');
  }

  // Validar duración
  if (!duration || duration < 10 || duration > 300) {
    errors.push('La duración debe estar entre 10 y 300 minutos');
  }

  // Validar categoría
  const validCategories = ['haircut', 'beard', 'combo', 'special', 'other'];
  if (category && !validCategories.includes(category)) {
    errors.push('La categoría debe ser una de: ' + validCategories.join(', '));
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Errores de validación',
      details: errors
    });
  }

  next();
};

// Middleware de validación para creación de barberos
export const validateBarberCreation = (req, res, next) => {
  const { userId, specialty, experience, availability } = req.body;
  const errors = [];

  // Validar usuario
  if (!userId) {
    errors.push('El ID del usuario es requerido');
  }

  // Validar especialidad
  if (!specialty || specialty.trim().length < 3) {
    errors.push('La especialidad debe tener al menos 3 caracteres');
  }

  // Validar experiencia
  if (experience !== undefined && (experience < 0 || experience > 50)) {
    errors.push('La experiencia debe estar entre 0 y 50 años');
  }

  // Validar disponibilidad
  if (availability && Array.isArray(availability)) {
    const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    availability.forEach((slot, index) => {
      if (!slot.day || !validDays.includes(slot.day)) {
        errors.push(`Día inválido en slot ${index + 1}`);
      }
      
      if (slot.isAvailable && (!slot.startTime || !slot.endTime)) {
        errors.push(`Horario incompleto en slot ${index + 1}`);
      }
      
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (slot.startTime && !timeRegex.test(slot.startTime)) {
        errors.push(`Formato de hora de inicio inválido en slot ${index + 1}`);
      }
      
      if (slot.endTime && !timeRegex.test(slot.endTime)) {
        errors.push(`Formato de hora de fin inválido en slot ${index + 1}`);
      }
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Errores de validación',
      details: errors
    });
  }

  next();
};

// Middleware de validación para actualización de estado de cita
export const validateAppointmentStatusUpdate = (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: 'Estado inválido. Debe ser uno de: ' + validStatuses.join(', ')
    });
  }

  next();
};

// Middleware de validación para agregar reseñas
export const validateReviewCreation = (req, res, next) => {
  const { rating, comment } = req.body;
  const errors = [];

  // Validar calificación
  if (!rating || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    errors.push('La calificación debe ser un número entero entre 1 y 5');
  }

  // Validar comentario (opcional pero si se proporciona debe tener longitud mínima)
  if (comment && comment.trim().length < 10) {
    errors.push('El comentario debe tener al menos 10 caracteres');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Errores de validación',
      details: errors
    });
  }

  next();
}; 