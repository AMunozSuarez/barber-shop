import Appointment from '../models/appointment.model.js';
import Barber from '../models/barber.model.js';
import Service from '../models/service.model.js';
import { calculateEndTime } from '../utils/helpers.js';

// @desc    Obtener todas las citas
// @route   GET /api/appointments
// @access  Private/Admin
export const getAppointments = async (req, res) => {
  try {
    const { startDate, endDate, status, barberId, page = 1, limit = 10 } = req.query;
    const query = {};

    // Aplicar filtros si existen
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        query.date.$lte = endDateTime;
      }
    }

    if (status) {
      query.status = status;
    }

    if (barberId) {
      query.barber = barberId;
    }

    // Calcular skip para paginación
    const skip = (page - 1) * limit;

    // Obtener total de documentos para la paginación
    const total = await Appointment.countDocuments(query);

    // Obtener citas con filtros y paginación
    const appointments = await Appointment.find(query)
      .populate('client', 'name email phone')
      .populate({
        path: 'barber',
        populate: {
          path: 'user',
          select: 'name email phone'
        }
      })
      .populate('service')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      appointments
    });
  } catch (error) {
    console.error('Error al obtener citas:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Obtener citas del cliente actual
// @route   GET /api/appointments/me
// @access  Private
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ client: req.user._id })
      .populate({
        path: 'barber',
        populate: {
          path: 'user',
          select: 'name email phone'
        }
      })
      .populate('service')
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Obtener citas del barbero actual
// @route   GET /api/appointments/barber/me
// @access  Private/Barber
export const getBarberAppointments = async (req, res) => {
  try {
    // Buscar el perfil de barbero del usuario actual
    const barber = await Barber.findOne({ user: req.user._id });

    if (!barber) {
      return res.status(404).json({
        success: false,
        error: 'Perfil de barbero no encontrado'
      });
    }

    const appointments = await Appointment.find({ barber: barber._id })
      .populate('client', 'name email phone')
      .populate('service')
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Obtener citas de un barbero específico por ID
// @route   GET /api/appointments/barber/:barberId
// @access  Public (para verificar disponibilidad)
export const getBarberAppointmentsByID = async (req, res) => {
  try {
    const { barberId } = req.params;

    console.log(`🔍 Obteniendo citas para barbero ID: ${barberId}`);

    // Verificar que el barbero existe
    const barber = await Barber.findById(barberId);
    if (!barber) {
      return res.status(404).json({
        success: false,
        error: 'Barbero no encontrado'
      });
    }

    const appointments = await Appointment.find({ barber: barberId })
      .populate('client', 'name email phone')
      .populate('service', 'name duration price')
      .sort({ date: 1, startTime: 1 });

    console.log(`✅ Encontradas ${appointments.length} citas para barbero ${barberId}`);

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('❌ Error al obtener citas del barbero:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Obtener una cita por ID
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('client', 'name email phone')
      .populate({
        path: 'barber',
        populate: {
          path: 'user',
          select: 'name email phone'
        }
      })
      .populate('service');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Cita no encontrada'
      });
    }

    // Verificar que el usuario sea el cliente, el barbero o un admin
    const isClient = appointment.client._id.toString() === req.user._id.toString();
    const isBarber = appointment.barber.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isClient && !isBarber && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permiso para acceder a esta cita'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Crear una nueva cita
// @route   POST /api/appointments
// @access  Private
export const createAppointment = async (req, res) => {
  try {
    const { barberId, serviceId, date, startTime, notes } = req.body;

    console.log('📝 Creando nueva cita con datos:', {
      barberId, 
      serviceId, 
      date, 
      startTime, 
      notes,
      clientId: req.user._id
    });

    // Verificar que se proporcionen todos los campos necesarios
    if (!barberId || !serviceId || !date || !startTime) {
      console.log('❌ Faltan campos requeridos:', { 
        barberId: !!barberId, 
        serviceId: !!serviceId, 
        date: !!date, 
        startTime: !!startTime 
      });
      return res.status(400).json({
        success: false,
        error: 'Por favor proporciona todos los campos requeridos',
        missingFields: {
          barberId: !barberId,
          serviceId: !serviceId,
          date: !date,
          startTime: !startTime
        }
      });
    }

    // Validar que la fecha no sea en el pasado (usando misma lógica que el middleware)
    const dateString = typeof date === 'string' && date.includes('T') ? date.split('T')[0] : date;
    const appointmentDate = new Date(dateString + 'T12:00:00.000Z');
    
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    const todayUTC = new Date(todayString + 'T12:00:00.000Z');
    
    console.log('🔍 Validación de fecha en controlador:');
    console.log('   - Fecha original:', date);
    console.log('   - Fecha normalizada:', appointmentDate.toISOString());
    console.log('   - Hoy normalizado:', todayUTC.toISOString());
    
    if (isNaN(appointmentDate.getTime())) {
      console.log('❌ Fecha inválida en controlador');
      return res.status(400).json({
        success: false,
        error: 'Formato de fecha inválido'
      });
    }
    
    if (appointmentDate < todayUTC) {
      console.log('❌ Fecha en el pasado en controlador:', { 
        appointmentDate: appointmentDate.toISOString(), 
        today: todayUTC.toISOString(),
        difference: appointmentDate.getTime() - todayUTC.getTime() 
      });
      return res.status(400).json({
        success: false,
        error: 'No se pueden programar citas para fechas pasadas',
        details: {
          requestedDate: appointmentDate.toISOString(),
          currentDate: todayUTC.toISOString()
        }
      });
    }

    // Verificar que el barbero existe
    const barber = await Barber.findById(barberId);
    if (!barber) {
      console.log('❌ Barbero no encontrado:', barberId);
      return res.status(404).json({
        success: false,
        error: 'Barbero no encontrado',
        barberId
      });
    }
    console.log('✅ Barbero encontrado:', {
      id: barber._id,
      name: barber.user?.name,
      isActive: barber.isActive
    });

    // Verificar que el servicio existe
    const service = await Service.findById(serviceId);
    if (!service) {
      console.log('❌ Servicio no encontrado:', serviceId);
      return res.status(404).json({
        success: false,
        error: 'Servicio no encontrado',
        serviceId
      });
    }
    console.log('✅ Servicio encontrado:', {
      id: service._id,
      name: service.name,
      duration: service.duration,
      isActive: service.isActive
    });

    // Verificar disponibilidad del barbero para esa fecha y hora
    const dayOfWeek = appointmentDate.getDay();
    const dayMap = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday'
    };

    const dayName = dayMap[dayOfWeek];
    console.log('📅 Verificando disponibilidad para:', {
      date: appointmentDate,
      dayOfWeek,
      dayName
    });

    // Verificar si el barbero trabaja ese día
    const dayAvailability = barber.availability.find(
      day => day.day === dayName && day.isAvailable
    );

    if (!dayAvailability) {
      console.log('❌ Barbero no trabaja en', dayName, {
        availability: barber.availability,
        requestedDay: dayName
      });
      return res.status(400).json({
        success: false,
        error: 'El barbero no trabaja en esta fecha',
        details: {
          requestedDay: dayName,
          barberAvailability: barber.availability
        }
      });
    }
    console.log('✅ Barbero disponible:', {
      day: dayName,
      startTime: dayAvailability.startTime,
      endTime: dayAvailability.endTime
    });

    // Verificar si la hora está dentro del horario de trabajo
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const startTimeInMinutes = startHour * 60 + startMinute;
    
    const [workStartHour, workStartMinute] = dayAvailability.startTime.split(':').map(Number);
    const workStartTimeInMinutes = workStartHour * 60 + workStartMinute;
    
    const [workEndHour, workEndMinute] = dayAvailability.endTime.split(':').map(Number);
    const workEndTimeInMinutes = workEndHour * 60 + workEndMinute;

    console.log('⏰ Verificando horarios:', {
      requested: {
        time: startTime,
        minutes: startTimeInMinutes
      },
      workStart: {
        time: dayAvailability.startTime,
        minutes: workStartTimeInMinutes
      },
      workEnd: {
        time: dayAvailability.endTime,
        minutes: workEndTimeInMinutes
      },
      serviceDuration: service.duration
    });

    if (startTimeInMinutes < workStartTimeInMinutes || 
        startTimeInMinutes + service.duration > workEndTimeInMinutes) {
      console.log('❌ Hora fuera del horario de trabajo');
      return res.status(400).json({
        success: false,
        error: 'La hora seleccionada está fuera del horario de trabajo del barbero',
        details: {
          requestedTime: startTime,
          serviceDuration: service.duration,
          workingHours: {
            start: dayAvailability.startTime,
            end: dayAvailability.endTime
          }
        }
      });
    }

    // Verificar si ya existe una cita para ese barbero en esa fecha y hora
    const existingAppointment = await Appointment.findOne({
      barber: barberId,
      date: {
        $gte: new Date(date),
        $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
      },
      startTime,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      console.log('❌ Ya existe cita:', {
        id: existingAppointment._id,
        startTime: existingAppointment.startTime,
        status: existingAppointment.status
      });
      return res.status(400).json({
        success: false,
        error: 'Ya existe una cita programada para esta fecha y hora',
        details: {
          existingAppointment: {
            id: existingAppointment._id,
            startTime: existingAppointment.startTime,
            status: existingAppointment.status
          }
        }
      });
    }

    // Calcular hora de finalización
    const endTime = calculateEndTime(startTime, service.duration);
    console.log('✅ Hora de finalización calculada:', endTime);

    // Crear la cita
    const appointment = await Appointment.create({
      client: req.user._id,
      barber: barberId,
      service: serviceId,
      date: appointmentDate,
      startTime,
      endTime,
      notes,
      price: service.price,
      status: 'pending'
    });

    console.log('✅ Cita creada exitosamente:', {
      id: appointment._id,
      date: appointment.date,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      status: appointment.status,
      barber: appointment.barber
    });

    // Obtener la cita con las referencias pobladas
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('client', 'name email phone')
      .populate({
        path: 'barber',
        populate: {
          path: 'user',
          select: 'name email phone'
        }
      })
      .populate('service');

    console.log('📤 Enviando respuesta con cita poblada');

    res.status(201).json({
      success: true,
      data: populatedAppointment
    });
  } catch (error) {
    console.error('❌ Error al crear cita:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Actualizar estado de una cita
// @route   PUT /api/appointments/:id/status
// @access  Private/Barber-Admin
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Verificar que el estado sea válido
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Estado de cita inválido'
      });
    }

    // Buscar la cita
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Cita no encontrada'
      });
    }

    // Verificar permisos: solo el barbero asignado o un admin pueden cambiar el estado
    // (o el cliente puede cancelar su propia cita)
    const barber = await Barber.findById(appointment.barber);
    
    const isBarber = barber && barber.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isClient = appointment.client.toString() === req.user._id.toString() && status === 'cancelled';

    if (!isBarber && !isAdmin && !isClient) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permiso para actualizar esta cita'
      });
    }

    // Actualizar estado
    appointment.status = status;
    
    // Si se marca como completada, actualizar el método de pago y estado de pago
    if (status === 'completed' && (isBarber || isAdmin)) {
      appointment.paymentStatus = req.body.paymentStatus || 'paid';
      appointment.paymentMethod = req.body.paymentMethod || 'cash';
    }

    // Guardar cambios
    await appointment.save();

    // Obtener la cita actualizada con referencias pobladas
    const updatedAppointment = await Appointment.findById(req.params.id)
      .populate('client', 'name email phone')
      .populate({
        path: 'barber',
        populate: {
          path: 'user',
          select: 'name email phone'
        }
      })
      .populate('service');

    res.status(200).json({
      success: true,
      data: updatedAppointment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Agregar notas a una cita
// @route   PUT /api/appointments/:id/notes
// @access  Private/Barber-Admin
export const addAppointmentNotes = async (req, res) => {
  try {
    const { notes } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Cita no encontrada'
      });
    }

    // Verificar permisos: solo el barbero asignado o un admin pueden agregar notas
    const barber = await Barber.findById(appointment.barber);
    
    const isBarber = barber && barber.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isBarber && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permiso para agregar notas a esta cita'
      });
    }

    // Actualizar notas
    appointment.notes = notes;

    // Guardar cambios
    await appointment.save();

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
