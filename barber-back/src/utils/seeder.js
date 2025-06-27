import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/user.model.js';
import Service from '../models/service.model.js';
import Barber from '../models/barber.model.js';

// Configuración para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de variables de entorno con ruta específica
dotenv.config({ path: path.join(__dirname, '../../.env.development') });

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/barber_shop_db')
  .then(() => console.log('Conexión a MongoDB establecida para cargar datos iniciales'))
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err);
    process.exit(1);
  });

// Datos de usuarios iniciales
const users = [
  {
    name: 'Admin Usuario',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    phone: '123456789'
  },
  {
    name: 'Carlos Rodríguez',
    email: 'barber1@example.com',
    password: 'barber123',
    role: 'barber',
    phone: '987654321'
  },
  {
    name: 'Miguel Sánchez',
    email: 'barber2@example.com',
    password: 'barber123',
    role: 'barber',
    phone: '123789456'
  },
  {
    name: 'Juan Pérez',
    email: 'client1@example.com',
    password: 'client123',
    role: 'client',
    phone: '456123789'
  }
];

// Datos de servicios iniciales
const services = [
  {
    name: 'Corte de cabello',
    description: 'Corte clásico o moderno según preferencia',
    price: 15,
    duration: 30,
    category: 'haircut'
  },
  {
    name: 'Afeitado clásico',
    description: 'Afeitado tradicional con navaja y toalla caliente',
    price: 10,
    duration: 20,
    category: 'beard'
  },
  {
    name: 'Corte y barba',
    description: 'Combinación de corte de cabello y arreglo de barba',
    price: 22,
    duration: 45,
    category: 'combo'
  },
  {
    name: 'Degradado',
    description: 'Corte con degradado de longitud',
    price: 18,
    duration: 35,
    category: 'haircut'
  },
  {
    name: 'Tratamiento facial',
    description: 'Limpieza facial completa con mascarilla',
    price: 25,
    duration: 40,
    category: 'special'
  }
];

// Función para importar datos
const importData = async () => {
  try {
    // Limpiar la base de datos
    await User.deleteMany();
    await Service.deleteMany();
    await Barber.deleteMany();

    console.log('Datos eliminados...');

    // Crear usuarios directamente sin usar el método map
    const adminUser = await User.create({
      name: 'Admin Usuario',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      phone: '123456789'
    });

    const barberUser1 = await User.create({
      name: 'Carlos Rodríguez',
      email: 'barber1@example.com',
      password: 'barber123',
      role: 'barber',
      phone: '987654321'
    });

    const barberUser2 = await User.create({
      name: 'Miguel Sánchez',
      email: 'barber2@example.com',
      password: 'barber123',
      role: 'barber',
      phone: '123789456'
    });

    await User.create({
      name: 'Juan Pérez',
      email: 'client1@example.com',
      password: 'client123',
      role: 'client',
      phone: '456123789'
    });

    console.log('Usuarios creados...');

    // Crear servicios
    const createdServices = await Service.insertMany(services);

    console.log('Servicios creados...');

    // Crear perfiles de barberos
    const barbers = [
      {
        user: barberUser1._id,
        specialty: 'Cortes clásicos',
        experience: 5,
        bio: 'Especialista en cortes clásicos con 5 años de experiencia.',
        image: '/images/barber1.jpg',
        availability: [
          { day: 'monday', startTime: '09:00', endTime: '18:00', isAvailable: true },
          { day: 'tuesday', startTime: '09:00', endTime: '18:00', isAvailable: true },
          { day: 'wednesday', startTime: '09:00', endTime: '18:00', isAvailable: true },
          { day: 'thursday', startTime: '09:00', endTime: '18:00', isAvailable: true },
          { day: 'friday', startTime: '09:00', endTime: '18:00', isAvailable: true },
          { day: 'saturday', startTime: '10:00', endTime: '14:00', isAvailable: false },
          { day: 'sunday', startTime: '00:00', endTime: '00:00', isAvailable: false }
        ],
        services: [createdServices[0]._id, createdServices[1]._id, createdServices[2]._id]
      },
      {
        user: barberUser2._id,
        specialty: 'Degradados y diseños',
        experience: 3,
        bio: 'Experto en degradados y diseños personalizados.',
        image: '/images/barber2.jpg',
        availability: [
          { day: 'monday', startTime: '09:00', endTime: '18:00', isAvailable: true },
          { day: 'tuesday', startTime: '00:00', endTime: '00:00', isAvailable: false },
          { day: 'wednesday', startTime: '09:00', endTime: '18:00', isAvailable: true },
          { day: 'thursday', startTime: '00:00', endTime: '00:00', isAvailable: false },
          { day: 'friday', startTime: '09:00', endTime: '18:00', isAvailable: true },
          { day: 'saturday', startTime: '10:00', endTime: '16:00', isAvailable: true },
          { day: 'sunday', startTime: '00:00', endTime: '00:00', isAvailable: false }
        ],
        services: [createdServices[0]._id, createdServices[3]._id, createdServices[4]._id]
      }
    ];

    await Barber.insertMany(barbers);

    console.log('Perfiles de barberos creados...');
    console.log('Datos importados correctamente!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Ejecutar la importación
importData();
