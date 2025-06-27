import User from '../models/user.model.js';
import Appointment from '../models/appointment.model.js';
import Barber from '../models/barber.model.js';
import Service from '../models/service.model.js';

// @desc    Obtener estadísticas generales del dashboard
// @route   GET /api/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    // Contar usuarios por tipo
    const totalClients = await User.countDocuments({ role: 'client' });
    const totalBarbers = await User.countDocuments({ role: 'barber' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    // Contar citas por estado
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const confirmedAppointments = await Appointment.countDocuments({ status: 'confirmed' });
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
    const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });

    // Contar servicios activos
    const totalServices = await Service.countDocuments({ isActive: true });

    // Citas de hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = await Appointment.countDocuments({
      date: { $gte: today, $lt: tomorrow }
    });

    // Ingresos del mes actual
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const monthlyRevenue = await Appointment.aggregate([
      {
        $match: {
          date: { $gte: currentMonth },
          status: 'completed',
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$price' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: {
          clients: totalClients,
          barbers: totalBarbers,
          admins: totalAdmins,
          total: totalClients + totalBarbers + totalAdmins
        },
        appointments: {
          total: totalAppointments,
          pending: pendingAppointments,
          confirmed: confirmedAppointments,
          completed: completedAppointments,
          cancelled: cancelledAppointments,
          today: todayAppointments
        },
        services: {
          total: totalServices
        },
        revenue: {
          monthly: monthlyRevenue.length > 0 ? monthlyRevenue[0].total : 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Obtener estadísticas específicas del barbero
// @route   GET /api/dashboard/barber/stats
// @access  Private/Barber
export const getBarberDashboardStats = async (req, res) => {
  try {
    // Buscar el perfil de barbero del usuario actual
    const barber = await Barber.findOne({ user: req.user._id });

    if (!barber) {
      return res.status(404).json({
        success: false,
        error: 'Perfil de barbero no encontrado'
      });
    }

    // Contar citas del barbero por estado
    const totalAppointments = await Appointment.countDocuments({ barber: barber._id });
    const pendingAppointments = await Appointment.countDocuments({ 
      barber: barber._id, 
      status: 'pending' 
    });
    const confirmedAppointments = await Appointment.countDocuments({ 
      barber: barber._id, 
      status: 'confirmed' 
    });
    const completedAppointments = await Appointment.countDocuments({ 
      barber: barber._id, 
      status: 'completed' 
    });

    // Citas de hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = await Appointment.countDocuments({
      barber: barber._id,
      date: { $gte: today, $lt: tomorrow }
    });

    // Próximas citas (siguientes 7 días)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcomingAppointments = await Appointment.find({
      barber: barber._id,
      date: { $gte: today, $lte: nextWeek },
      status: { $in: ['pending', 'confirmed'] }
    })
    .populate('client', 'name phone')
    .populate('service', 'name duration')
    .sort({ date: 1, startTime: 1 })
    .limit(5);

    // Ingresos del mes actual
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const monthlyRevenue = await Appointment.aggregate([
      {
        $match: {
          barber: barber._id,
          date: { $gte: currentMonth },
          status: 'completed',
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$price' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        appointments: {
          total: totalAppointments,
          pending: pendingAppointments,
          confirmed: confirmedAppointments,
          completed: completedAppointments,
          today: todayAppointments
        },
        upcomingAppointments,
        revenue: {
          monthly: monthlyRevenue.length > 0 ? monthlyRevenue[0].total : 0
        },
        rating: {
          average: barber.rating,
          totalReviews: barber.reviewCount
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Obtener citas recientes
// @route   GET /api/dashboard/recent-appointments
// @access  Private/Admin
export const getRecentAppointments = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const recentAppointments = await Appointment.find()
      .populate('client', 'name email phone')
      .populate({
        path: 'barber',
        populate: {
          path: 'user',
          select: 'name'
        }
      })
      .populate('service', 'name price')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: recentAppointments.length,
      data: recentAppointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Obtener horarios disponibles de un barbero para una fecha específica
// @route   GET /api/dashboard/barber/:barberId/available-slots
// @access  Public
export const getAvailableTimeSlots = async (req, res) => {
  try {
    const { barberId } = req.params;
    const { date, serviceId } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        error: 'Por favor proporciona una fecha'
      });
    }

    if (!serviceId) {
      return res.status(400).json({
        success: false,
        error: 'Por favor selecciona un servicio'
      });
    }

    const barber = await Barber.findById(barberId);
    if (!barber) {
      return res.status(404).json({
        success: false,
        error: 'Barbero no encontrado'
      });
    }

    // Obtener información del servicio para conocer su duración
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Servicio no encontrado'
      });
    }

    // Obtener el día de la semana
    const requestedDate = new Date(date);
    const dayOfWeek = requestedDate.getDay();
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

    // Buscar disponibilidad del barbero para ese día
    const availability = barber.availability.find(av => av.day === dayName);

    if (!availability || !availability.isAvailable) {
      console.log(`❌ Barbero no disponible en ${dayName}`);
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    // Crear fechas más precisas para la consulta usando UTC
    // Asegurar que la fecha esté en formato YYYY-MM-DD
    const dateString = date.includes('T') ? date.split('T')[0] : date;
    const requestedDateObj = new Date(dateString + 'T00:00:00.000Z');
    
    console.log(`📅 Fecha recibida: "${date}"`);
    console.log(`📅 Fecha parseada: "${dateString}"`);
    console.log(`📅 Objeto Date: ${requestedDateObj.toISOString()}`);
    
    // Asegurar que la fecha sea válida
    if (isNaN(requestedDateObj.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Fecha inválida proporcionada'
      });
    }
    
    // Usar UTC para evitar problemas de zona horaria
    const startOfDay = new Date(dateString + 'T00:00:00.000Z');
    const endOfDay = new Date(dateString + 'T23:59:59.999Z');
    
    console.log(`📅 Rango de búsqueda (UTC):`);
    console.log(`   - Inicio: ${startOfDay.toISOString()}`);
    console.log(`   - Fin: ${endOfDay.toISOString()}`);
    
    // Verificar que no sea una fecha pasada (comparar solo las fechas, no las horas)
    const today = new Date();
    const todayDateString = today.toISOString().split('T')[0];
    const requestedDateString = requestedDateObj.toISOString().split('T')[0];
    
    console.log(`📅 Hoy: ${todayDateString}`);
    console.log(`📅 Fecha solicitada: ${requestedDateString}`);
    
    if (requestedDateString < todayDateString) {
      return res.status(400).json({
        success: false,
        error: 'No se pueden agendar citas en fechas pasadas'
      });
    }

    // Obtener citas existentes para esa fecha (solo pending y confirmed, NO cancelled o completed)
    const existingAppointments = await Appointment.find({
      barber: barberId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: { $in: ['pending', 'confirmed'] }
    }).select('startTime endTime status date')
    .populate('service', 'name duration')
    .populate('client', 'name');

    console.log(`🔍 Verificando disponibilidad para barbero ${barberId} en ${date}`);
    console.log(`📅 Fecha consulta - desde:`, startOfDay.toISOString(), 'hasta:', endOfDay.toISOString());
    console.log(`📅 Total citas existentes:`, existingAppointments.length);
    console.log(`📅 Citas existentes:`, existingAppointments.map(apt => ({
      id: apt._id,
      horario: `${apt.startTime}-${apt.endTime}`,
      estado: apt.status,
      fecha: apt.date,
      cliente: apt.client?.name,
      servicio: apt.service?.name
    })));
    console.log(`⏱️ Duración del servicio:`, service.duration, 'minutos');
    console.log(`🕐 Horario de trabajo: ${availability.startTime} - ${availability.endTime}`);

    // Generar slots de tiempo disponibles (cada 30 minutos)
    const slots = [];
    const startTime = availability.startTime;
    const endTime = availability.endTime;

    let current = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);

    // Restar la duración del servicio al tiempo final para asegurar que la cita quepa
    end.setMinutes(end.getMinutes() - service.duration);

    while (current <= end) {
      const timeString = current.toTimeString().slice(0, 5);
      
      // Verificar si hay espacio suficiente para el servicio
      const slotStart = timeToMinutes(timeString);
      const slotEnd = slotStart + service.duration;
      
      console.log(`🔍 Verificando slot ${timeString} (${slotStart}-${slotEnd} minutos)`);
      
      // Verificar si este slot está ocupado por alguna cita existente
      let isOccupied = false;
      let conflictingAppointment = null;
      
      for (const apt of existingAppointments) {
        const appointmentStart = timeToMinutes(apt.startTime);
        const appointmentEnd = timeToMinutes(apt.endTime);
        
        // Verificar si hay solapamiento entre el slot propuesto y la cita existente
        // Un slot está ocupado si:
        // 1. El slot comienza antes de que termine la cita Y
        // 2. El slot termina después de que comience la cita
        const hasOverlap = slotStart < appointmentEnd && slotEnd > appointmentStart;
        
        if (hasOverlap) {
          console.log(`⏰ Slot ${timeString} OCUPADO por cita existente:`);
          console.log(`   - Slot propuesto: ${slotStart}-${slotEnd} minutos (${timeString} - ${Math.floor(slotEnd/60)}:${String(slotEnd%60).padStart(2,'0')})`);
          console.log(`   - Cita existente: ${appointmentStart}-${appointmentEnd} minutos (${apt.startTime}-${apt.endTime})`);
          console.log(`   - Cliente: ${apt.client?.name || 'N/A'}`);
          console.log(`   - Estado: ${apt.status}`);
          console.log(`   - ID: ${apt._id}`);
          isOccupied = true;
          conflictingAppointment = apt;
          break;
        }
      }

      // Verificar que el slot completo esté dentro del horario de trabajo
      const isWithinWorkHours = slotEnd <= timeToMinutes(endTime);

      if (!isOccupied && isWithinWorkHours) {
        console.log(`✅ Slot ${timeString} DISPONIBLE`);
        slots.push(timeString);
      } else if (!isWithinWorkHours) {
        console.log(`❌ Slot ${timeString} fuera del horario de trabajo`);
      }

      current.setMinutes(current.getMinutes() + 30);
    }

    console.log(`✅ RESUMEN FINAL:`);
    console.log(`   - Barbero: ${barberId}`);
    console.log(`   - Fecha: ${date}`);
    console.log(`   - Servicio: ${service.name} (${service.duration} min)`);
    console.log(`   - Horario de trabajo: ${availability.startTime} - ${availability.endTime}`);
    console.log(`   - Citas existentes que bloquean: ${existingAppointments.length}`);
    console.log(`   - Total slots disponibles: ${slots.length}`);
    console.log(`   - Slots: [${slots.join(', ')}]`);

    res.status(200).json({
      success: true,
      data: slots,
      meta: {
        barberId,
        date,
        service: {
          id: service._id,
          name: service.name,
          duration: service.duration
        },
        workingHours: {
          start: availability.startTime,
          end: availability.endTime
        },
        existingAppointments: existingAppointments.length,
        totalSlotsAvailable: slots.length
      }
    });
  } catch (error) {
    console.error('❌ Error en getAvailableTimeSlots:', error);
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