import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Appointment from '../src/models/appointment.model.js';
import Barber from '../src/models/barber.model.js';
import User from '../src/models/user.model.js';
import Service from '../src/models/service.model.js';

dotenv.config();

const createTestAppointments = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Conectado a MongoDB');

    // Buscar barberos existentes
    const barbers = await Barber.find().populate('user');
    console.log(`👨‍💼 Barberos encontrados: ${barbers.length}`);

    if (barbers.length === 0) {
      console.log('❌ No hay barberos en la base de datos');
      return;
    }

    // Buscar usuarios clientes
    const clients = await User.find({ role: 'client' });
    console.log(`👥 Clientes encontrados: ${clients.length}`);

    if (clients.length === 0) {
      console.log('❌ No hay clientes en la base de datos');
      return;
    }

    // Buscar servicios
    const services = await Service.find();
    console.log(`✂️ Servicios encontrados: ${services.length}`);

    if (services.length === 0) {
      console.log('❌ No hay servicios en la base de datos');
      return;
    }

    // Eliminar citas existentes para empezar limpio
    await Appointment.deleteMany({});
    console.log('🗑️ Citas anteriores eliminadas');

    // Crear citas de prueba
    const testAppointments = [];
    const today = new Date();
    
    for (let i = 0; i < 10; i++) {
      const randomBarber = barbers[Math.floor(Math.random() * barbers.length)];
      const randomClient = clients[Math.floor(Math.random() * clients.length)];
      const randomService = services[Math.floor(Math.random() * services.length)];
      
      // Crear fechas futuras aleatorias
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + Math.floor(Math.random() * 30) + 1);
      
      // Horas aleatorias entre 9:00 y 17:00
      const hours = 9 + Math.floor(Math.random() * 8);
      const minutes = Math.random() < 0.5 ? '00' : '30';
      const startTime = `${hours.toString().padStart(2, '0')}:${minutes}`;
      
      // Calcular hora de fin basada en la duración del servicio
      const totalMinutes = hours * 60 + parseInt(minutes) + randomService.duration;
      const endHours = Math.floor(totalMinutes / 60);
      const endMinutes = totalMinutes % 60;
      const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
      
      // Estados aleatorios con mayor probabilidad de pending/confirmed
      const statuses = ['pending', 'pending', 'confirmed', 'confirmed', 'completed', 'cancelled'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      testAppointments.push({
        client: randomClient._id,
        barber: randomBarber._id,
        service: randomService._id,
        date: futureDate,
        startTime,
        endTime,
        status: randomStatus,
        price: randomService.price,
        notes: `Cita de prueba ${i + 1}`,
        paymentStatus: randomStatus === 'completed' ? 'paid' : 'pending'
      });
    }

    // Insertar citas
    const createdAppointments = await Appointment.insertMany(testAppointments);
    console.log(`✅ ${createdAppointments.length} citas de prueba creadas`);

    // Mostrar estadísticas
    for (const barber of barbers) {
      const appointmentCount = await Appointment.countDocuments({
        barber: barber._id,
        status: { $in: ['pending', 'confirmed'] },
        date: { $gte: today }
      });
      
      const totalCount = await Appointment.countDocuments({
        barber: barber._id
      });

      console.log(`👨‍💼 ${barber.user.name}: ${appointmentCount} citas pendientes/confirmadas, ${totalCount} citas totales`);
    }

    console.log('🎉 Citas de prueba creadas exitosamente');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📦 Desconectado de MongoDB');
  }
};

createTestAppointments(); 