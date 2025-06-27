import Barber from '../models/barber.model.js';
import User from '../models/user.model.js';
import Service from '../models/service.model.js';
import Appointment from '../models/appointment.model.js';

// @desc    Obtener todos los barberos
// @route   GET /api/barbers
// @access  Public
export const getBarbers = async (req, res) => {
  try {
    const barbers = await Barber.find()
      .populate('user', 'name email phone')
      .populate('services');

    console.log(`📊 Found ${barbers.length} barbers`);

    // Obtener el conteo de citas para cada barbero
    const barbersWithAppointments = await Promise.all(barbers.map(async (barber) => {
      // Contar todas las citas pendientes y confirmadas a partir de hoy
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const appointmentsCount = await Appointment.countDocuments({
        barber: barber._id,
        status: { $in: ['pending', 'confirmed'] },
        date: { $gte: today }
      });

      // Para debug: obtener el conteo total de citas del barbero
      const totalAppointments = await Appointment.countDocuments({
        barber: barber._id
      });

      console.log(`👨‍💼 Barbero ${barber.user?.name}: ${appointmentsCount} citas pendientes/confirmadas, ${totalAppointments} citas totales`);

      return {
        ...barber.toObject(),
        appointmentsCount,
        totalAppointments // Para debug
      };
    }));

    res.status(200).json({
      success: true,
      count: barbersWithAppointments.length,
      data: barbersWithAppointments
    });
  } catch (error) {
    console.error('❌ Error en getBarbers:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Obtener un barbero por ID
// @route   GET /api/barbers/:id
// @access  Public
export const getBarberById = async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('services');

    if (!barber) {
      return res.status(404).json({
        success: false,
        error: 'Barbero no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: barber
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Crear un nuevo barbero
// @route   POST /api/barbers
// @access  Private/Admin
export const createBarber = async (req, res) => {
  try {
    const { name, email, phone, specialties } = req.body;

    // 1. Validar datos requeridos
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Nombre y email son requeridos'
      });
    }

    // 2. Verificar si ya existe un usuario con este email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Ya existe un usuario con este email'
      });
    }

    // 3. Crear el usuario
    const user = await User.create({
      name,
      email,
      phone: phone || '',
      role: 'barber',
      password: 'Barber2024!' // Contraseña temporal
    });

    // 4. Crear el perfil de barbero
    const barber = await Barber.create({
      user: user._id,
      specialty: specialties || [],
      isActive: true
    });

    // 5. Obtener el barbero con los datos del usuario
    const populatedBarber = await Barber.findById(barber._id)
      .populate('user', 'name email phone');

    // 6. Enviar respuesta
    res.status(201).json({
      success: true,
      data: populatedBarber,
      message: 'Barbero creado exitosamente. Contraseña temporal: Barber2024!'
    });

  } catch (error) {
    console.error('Error al crear barbero:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Actualizar un barbero
// @route   PUT /api/barbers/:id
// @access  Private/Admin-Barber
export const updateBarber = async (req, res) => {
  try {
    const { name, email, phone, specialties, experience, bio, availability, services, isActive } = req.body;

    // Buscar el barbero
    let barber = await Barber.findById(req.params.id);

    if (!barber) {
      return res.status(404).json({
        success: false,
        error: 'Barbero no encontrado'
      });
    }

    // Verificar permiso: solo el propio barbero o un admin puede actualizar
    if (req.user.role !== 'admin' && barber.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permiso para actualizar este perfil'
      });
    }

    // Actualizar información del usuario si se proporcionan datos
    if (name || email || phone) {
      const user = await User.findById(barber.user);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuario asociado no encontrado'
        });
      }

      // Verificar si el email ya está en uso por otro usuario
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            error: 'El email ya está en uso por otro usuario'
          });
        }
      }

      // Actualizar datos del usuario
      if (name) user.name = name;
      if (email) user.email = email;
      if (phone) user.phone = phone;
      await user.save();
    }

    // Actualizar campos del barbero
    if (specialties) barber.specialty = Array.isArray(specialties) ? specialties : [specialties];
    if (experience !== undefined) barber.experience = experience;
    if (bio !== undefined) barber.bio = bio;
    if (availability) barber.availability = availability;
    if (services) barber.services = services;
    if (isActive !== undefined) barber.isActive = isActive;

    // Guardar cambios
    await barber.save();

    // Obtener el barbero actualizado con referencias pobladas
    barber = await Barber.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('services');

    res.status(200).json({
      success: true,
      data: barber
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Actualizar disponibilidad del barbero
// @route   PUT /api/barbers/availability
// @access  Private/Barber
export const updateBarberAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    // Buscar el perfil de barbero del usuario actual
    const barber = await Barber.findOne({ user: req.user._id });

    if (!barber) {
      return res.status(404).json({
        success: false,
        error: 'Perfil de barbero no encontrado'
      });
    }

    // Validar formato de disponibilidad
    if (!Array.isArray(availability)) {
      return res.status(400).json({
        success: false,
        error: 'La disponibilidad debe ser un array'
      });
    }

    // Validar cada día de disponibilidad
    const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    for (const daySchedule of availability) {
      if (!validDays.includes(daySchedule.day)) {
        return res.status(400).json({
          success: false,
          error: `Día inválido: ${daySchedule.day}`
        });
      }

      if (daySchedule.isAvailable && (!daySchedule.startTime || !daySchedule.endTime)) {
        return res.status(400).json({
          success: false,
          error: `Horarios requeridos para el día ${daySchedule.day}`
        });
      }

      // Validar formato de hora (HH:MM)
      if (daySchedule.isAvailable) {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(daySchedule.startTime) || !timeRegex.test(daySchedule.endTime)) {
          return res.status(400).json({
            success: false,
            error: `Formato de hora inválido para el día ${daySchedule.day}. Use HH:MM`
          });
        }

        // Validar que la hora de inicio sea antes que la de fin
        const startTime = new Date(`2000-01-01T${daySchedule.startTime}:00`);
        const endTime = new Date(`2000-01-01T${daySchedule.endTime}:00`);
        
        if (startTime >= endTime) {
          return res.status(400).json({
            success: false,
            error: `La hora de inicio debe ser anterior a la hora de fin para el día ${daySchedule.day}`
          });
        }
      }
    }

    // Actualizar disponibilidad
    barber.availability = availability;
    await barber.save();

    // Obtener el barbero actualizado con referencias pobladas
    const updatedBarber = await Barber.findById(barber._id)
      .populate('user', 'name email phone')
      .populate('services');

    res.status(200).json({
      success: true,
      message: 'Disponibilidad actualizada exitosamente',
      data: updatedBarber
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Eliminar un barbero
// @route   DELETE /api/barbers/:id
// @access  Private/Admin
export const deleteBarber = async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id);

    if (!barber) {
      return res.status(404).json({
        success: false,
        error: 'Barbero no encontrado'
      });
    }

    // Eliminar el barbero
    await barber.deleteOne();

    // Actualizar el rol del usuario a cliente
    const user = await User.findById(barber.user);
    if (user) {
      user.role = 'client';
      await user.save();
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Agregar una reseña a un barbero
// @route   POST /api/barbers/:id/reviews
// @access  Private
export const addBarberReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    // Validar calificación
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Por favor proporciona una calificación válida entre 1 y 5'
      });
    }

    // Buscar el barbero
    const barber = await Barber.findById(req.params.id);
    
    if (!barber) {
      return res.status(404).json({
        success: false,
        error: 'Barbero no encontrado'
      });
    }

    // Verificar si el usuario ya ha dejado una reseña
    const alreadyReviewed = barber.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        error: 'Ya has dejado una reseña para este barbero'
      });
    }

    // Verificar si el usuario ha tenido al menos una cita completada con el barbero
    const hasCompletedAppointment = await Appointment.exists({
      client: req.user._id,
      barber: barber._id,
      status: 'completed'
    });

    if (!hasCompletedAppointment) {
      return res.status(400).json({
        success: false,
        error: 'Solo puedes dejar una reseña si has tenido al menos una cita completada con este barbero'
      });
    }

    // Crear la reseña
    const review = {
      user: req.user._id,
      rating: Number(rating),
      comment
    };

    // Agregar la reseña al barbero
    barber.reviews.push(review);
    
    // Actualizar rating promedio
    barber.updateRating();

    // Guardar cambios
    await barber.save();

    res.status(201).json({
      success: true,
      data: barber
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Obtener disponibilidad de un barbero para una fecha específica
// @route   GET /api/barbers/:id/availability?date=YYYY-MM-DD
// @access  Public
export const getBarberAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({
        success: false,
        error: 'Por favor proporciona una fecha'
      });
    }

    // Buscar el barbero
    const barber = await Barber.findById(req.params.id);
    
    if (!barber) {
      return res.status(404).json({
        success: false,
        error: 'Barbero no encontrado'
      });
    }

    // Obtener el día de la semana (0 = domingo, 1 = lunes, etc.)
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();
    
    // Mapear al formato que usamos en el modelo
    const dayMap = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday'
    };

    // Verificar si el barbero trabaja ese día
    const dayAvailability = barber.availability.find(
      day => day.day === dayMap[dayOfWeek] && day.isAvailable
    );

    if (!dayAvailability) {
      return res.status(200).json({
        success: true,
        message: 'El barbero no trabaja en esta fecha',
        data: []
      });
    }

    // Obtener las citas ya programadas para esa fecha (solo pending y confirmed)
    const appointments = await Appointment.find({
      barber: barber._id,
      date: {
        $gte: new Date(date),
        $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
      },
      status: { $in: ['pending', 'confirmed'] }
    }).select('startTime endTime');

    // Generar slots de tiempo disponibles (cada 30 minutos)
    const timeSlots = [];
    const [startHour, startMinute] = dayAvailability.startTime.split(':').map(Number);
    const [endHour, endMinute] = dayAvailability.endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    const slotDuration = 30; // 30 minutos por slot

    for (let mins = startMinutes; mins < endMinutes; mins += slotDuration) {
      const hour = Math.floor(mins / 60);
      const minute = mins % 60;
      const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // Verificar si este slot está ocupado usando la misma lógica que el endpoint principal
      const isBooked = appointments.some(apt => {
        // Convertir horarios a minutos para comparación más precisa
        const slotStart = mins;
        const slotEnd = mins + slotDuration;
        
        const appointmentStart = timeToMinutes(apt.startTime);
        const appointmentEnd = timeToMinutes(apt.endTime);
        
        // Verificar si hay solapamiento entre el slot y la cita
        return slotStart < appointmentEnd && slotEnd > appointmentStart;
      });

      if (!isBooked) {
        timeSlots.push(timeSlot);
      }
    }

    res.status(200).json({
      success: true,
      data: timeSlots
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Función auxiliar para convertir tiempo HH:MM a minutos
function timeToMinutes(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

// @desc    Obtener perfil del barbero autenticado actual
// @route   GET /api/barbers/me
// @access  Private/Barber
export const getMyBarberProfile = async (req, res) => {
  try {
    // Buscar el perfil de barbero del usuario actual
    const barber = await Barber.findOne({ user: req.user._id })
      .populate('user', 'name email phone')
      .populate('services');

    if (!barber) {
      return res.status(404).json({
        success: false,
        error: 'Perfil de barbero no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: barber
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Debug - Verificar citas en la base de datos
// @route   GET /api/barbers/debug/appointments
// @access  Private/Admin
export const debugAppointments = async (req, res) => {
  try {
    console.log('🔍 Iniciando debug de citas...');
    
    // Obtener todas las citas
    const allAppointments = await Appointment.find()
      .populate({
        path: 'barber',
        populate: {
          path: 'user',
          select: 'name email'
        }
      })
      .populate('client', 'name email')
      .populate('service', 'name');

    console.log(`📋 Total de citas en la base de datos: ${allAppointments.length}`);

    // Agrupar citas por barbero
    const appointmentsByBarber = {};
    allAppointments.forEach(appointment => {
      const barberId = appointment.barber._id.toString();
      const barberName = appointment.barber.user?.name || 'Sin nombre';
      
      if (!appointmentsByBarber[barberId]) {
        appointmentsByBarber[barberId] = {
          barberName,
          appointments: []
        };
      }
      
      appointmentsByBarber[barberId].appointments.push({
        id: appointment._id,
        client: appointment.client?.name || 'Sin cliente',
        service: appointment.service?.name || 'Sin servicio',
        date: appointment.date,
        startTime: appointment.startTime,
        status: appointment.status
      });
    });

    // Obtener conteos por estado
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const pendingCount = await Appointment.countDocuments({
      status: 'pending',
      date: { $gte: today }
    });
    
    const confirmedCount = await Appointment.countDocuments({
      status: 'confirmed',
      date: { $gte: today }
    });
    
    const completedCount = await Appointment.countDocuments({
      status: 'completed'
    });
    
    const cancelledCount = await Appointment.countDocuments({
      status: 'cancelled'
    });

    console.log('📊 Conteos por estado:', {
      pending: pendingCount,
      confirmed: confirmedCount,
      completed: completedCount,
      cancelled: cancelledCount
    });

    res.status(200).json({
      success: true,
      data: {
        totalAppointments: allAppointments.length,
        appointmentsByBarber,
        countsByStatus: {
          pending: pendingCount,
          confirmed: confirmedCount,
          completed: completedCount,
          cancelled: cancelledCount
        },
        todayDate: today
      }
    });
  } catch (error) {
    console.error('❌ Error en debug de citas:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
