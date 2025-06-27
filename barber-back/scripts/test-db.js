#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../.env.development') });

// Importar modelos
import User from '../src/models/user.model.js';
import Barber from '../src/models/barber.model.js';
import Service from '../src/models/service.model.js';
import Appointment from '../src/models/appointment.model.js';

// Conectar a MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/barber_shop_db');
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
}

// Función para mostrar estadísticas de la base de datos
async function showDatabaseStats() {
  console.log('\n📊 ESTADÍSTICAS DE LA BASE DE DATOS');
  console.log('=' .repeat(50));

  try {
    // Contar documentos por colección
    const usersCount = await User.countDocuments();
    const barbersCount = await Barber.countDocuments();
    const servicesCount = await Service.countDocuments();
    const appointmentsCount = await Appointment.countDocuments();

    console.log(`👥 Usuarios: ${usersCount}`);
    console.log(`✂️  Barberos: ${barbersCount}`);
    console.log(`🛠️  Servicios: ${servicesCount}`);
    console.log(`📅 Citas: ${appointmentsCount}`);

    // Mostrar usuarios por rol
    const clientsCount = await User.countDocuments({ role: 'client' });
    const barbersUserCount = await User.countDocuments({ role: 'barber' });
    const adminsCount = await User.countDocuments({ role: 'admin' });

    console.log('\n🎭 USUARIOS POR ROL:');
    console.log(`   Clientes: ${clientsCount}`);
    console.log(`   Barberos: ${barbersUserCount}`);
    console.log(`   Administradores: ${adminsCount}`);

    // Mostrar citas por estado
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const confirmedAppointments = await Appointment.countDocuments({ status: 'confirmed' });
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
    const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });

    console.log('\n📊 CITAS POR ESTADO:');
    console.log(`   Pendientes: ${pendingAppointments}`);
    console.log(`   Confirmadas: ${confirmedAppointments}`);
    console.log(`   Completadas: ${completedAppointments}`);
    console.log(`   Canceladas: ${cancelledAppointments}`);

  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error.message);
  }
}

// Función para mostrar todos los usuarios
async function showUsers() {
  console.log('\n👥 USUARIOS EN LA BASE DE DATOS');
  console.log('=' .repeat(50));

  try {
    const users = await User.find().select('-password');
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Teléfono: ${user.phone || 'No especificado'}`);
      console.log(`   Rol: ${user.role}`);
      console.log(`   Creado: ${user.createdAt?.toLocaleDateString()}`);
    });

    if (users.length === 0) {
      console.log('No hay usuarios en la base de datos');
    }

  } catch (error) {
    console.error('❌ Error obteniendo usuarios:', error.message);
  }
}

// Función para mostrar todos los barberos
async function showBarbers() {
  console.log('\n✂️ BARBEROS EN LA BASE DE DATOS');
  console.log('=' .repeat(50));

  try {
    const barbers = await Barber.find()
      .populate('user', 'name email phone')
      .populate('services', 'name price');
    
    barbers.forEach((barber, index) => {
      console.log(`\n${index + 1}. ${barber.user.name}`);
      console.log(`   Email: ${barber.user.email}`);
      console.log(`   Especialidad: ${barber.specialty}`);
      console.log(`   Experiencia: ${barber.experience} años`);
      console.log(`   Calificación: ${barber.rating}/5 (${barber.reviewCount} reseñas)`);
      console.log(`   Servicios: ${barber.services.map(s => s.name).join(', ')}`);
      
      // Mostrar disponibilidad
      const availableDays = barber.availability.filter(av => av.isAvailable);
      console.log(`   Disponible: ${availableDays.map(av => 
        `${av.day} ${av.startTime}-${av.endTime}`
      ).join(', ')}`);
    });

    if (barbers.length === 0) {
      console.log('No hay barberos en la base de datos');
    }

  } catch (error) {
    console.error('❌ Error obteniendo barberos:', error.message);
  }
}

// Función para mostrar todos los servicios
async function showServices() {
  console.log('\n🛠️ SERVICIOS DISPONIBLES');
  console.log('=' .repeat(50));

  try {
    const services = await Service.find();
    
    services.forEach((service, index) => {
      console.log(`\n${index + 1}. ${service.name}`);
      console.log(`   Descripción: ${service.description}`);
      console.log(`   Precio: $${service.price}`);
      console.log(`   Duración: ${service.duration} minutos`);
      console.log(`   Categoría: ${service.category}`);
      console.log(`   Estado: ${service.isActive ? 'Activo' : 'Inactivo'}`);
    });

    if (services.length === 0) {
      console.log('No hay servicios en la base de datos');
    }

  } catch (error) {
    console.error('❌ Error obteniendo servicios:', error.message);
  }
}

// Función para mostrar citas
async function showAppointments() {
  console.log('\n📅 CITAS EN LA BASE DE DATOS');
  console.log('=' .repeat(50));

  try {
    const appointments = await Appointment.find()
      .populate('client', 'name email')
      .populate({
        path: 'barber',
        populate: {
          path: 'user',
          select: 'name'
        }
      })
      .populate('service', 'name price')
      .sort({ date: -1 });
    
    if (appointments.length === 0) {
      console.log('No hay citas en la base de datos');
      return;
    }

    appointments.forEach((appointment, index) => {
      console.log(`\n${index + 1}. Cita #${appointment._id.toString().slice(-6)}`);
      console.log(`   Cliente: ${appointment.client.name} (${appointment.client.email})`);
      console.log(`   Barbero: ${appointment.barber.user.name}`);
      console.log(`   Servicio: ${appointment.service.name} - $${appointment.service.price}`);
      console.log(`   Fecha: ${new Date(appointment.date).toLocaleDateString()}`);
      console.log(`   Hora: ${appointment.startTime} - ${appointment.endTime}`);
      console.log(`   Estado: ${appointment.status}`);
      console.log(`   Pago: ${appointment.paymentStatus}`);
      if (appointment.notes) {
        console.log(`   Notas: ${appointment.notes}`);
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo citas:', error.message);
  }
}

// Función para limpiar la base de datos
async function clearDatabase() {
  console.log('\n🗑️ LIMPIANDO BASE DE DATOS');
  console.log('=' .repeat(50));

  try {
    await User.deleteMany({});
    await Barber.deleteMany({});
    await Service.deleteMany({});
    await Appointment.deleteMany({});

    console.log('✅ Base de datos limpiada correctamente');
  } catch (error) {
    console.error('❌ Error limpiando base de datos:', error.message);
  }
}

// Función principal
async function main() {
  await connectDB();

  const args = process.argv.slice(2);
  const command = args[0];

  console.log('🚀 EXPLORADOR DE BASE DE DATOS - BARBER SHOP');
  console.log('=' .repeat(60));

  switch (command) {
    case 'stats':
      await showDatabaseStats();
      break;
    case 'users':
      await showUsers();
      break;
    case 'barbers':
      await showBarbers();
      break;
    case 'services':
      await showServices();
      break;
    case 'appointments':
      await showAppointments();
      break;
    case 'clear':
      await clearDatabase();
      break;
    case 'all':
      await showDatabaseStats();
      await showUsers();
      await showBarbers();
      await showServices();
      await showAppointments();
      break;
    default:
      console.log('\n📋 COMANDOS DISPONIBLES:');
      console.log('   node scripts/test-db.js stats        - Mostrar estadísticas');
      console.log('   node scripts/test-db.js users        - Mostrar usuarios');
      console.log('   node scripts/test-db.js barbers      - Mostrar barberos');
      console.log('   node scripts/test-db.js services     - Mostrar servicios');
      console.log('   node scripts/test-db.js appointments - Mostrar citas');
      console.log('   node scripts/test-db.js all          - Mostrar todo');
      console.log('   node scripts/test-db.js clear        - Limpiar base de datos');
      console.log('\n💡 Ejemplo: node scripts/test-db.js stats');
  }

  await mongoose.disconnect();
  console.log('\n✅ Desconectado de MongoDB');
  process.exit(0);
}

// Ejecutar función principal
main().catch(error => {
  console.error('💥 Error:', error);
  process.exit(1);
}); 