#!/usr/bin/env node

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

// Configuración para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../../.env.development') });

// Función para verificar la conexión a MongoDB
const checkMongoConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/barber_shop_db');
    console.log('✅ Conexión a MongoDB exitosa');
    
    // Verificar colecciones existentes
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Colecciones disponibles:', collections.map(col => col.name));
    
    await mongoose.disconnect();
    return true;
  } catch (error) {
    console.error('❌ Error de conexión a MongoDB:', error.message);
    return false;
  }
};

// Función para verificar variables de entorno requeridas
const checkEnvVariables = () => {
  const requiredVars = ['JWT_SECRET', 'MONGODB_URI'];
  const missingVars = [];

  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.error('❌ Variables de entorno faltantes:', missingVars);
    console.log('💡 Asegúrate de crear un archivo .env.development con:');
    console.log('   - JWT_SECRET=tu_jwt_secret_aqui');
    console.log('   - MONGODB_URI=mongodb://localhost:27017/barber_shop_db');
    return false;
  }

  console.log('✅ Variables de entorno configuradas correctamente');
  return true;
};

// Función principal de verificación
const initializeServer = async () => {
  console.log('🚀 Iniciando verificación del servidor...\n');

  // 1. Verificar variables de entorno
  const envCheck = checkEnvVariables();
  if (!envCheck) return false;

  // 2. Verificar conexión a MongoDB
  const mongoCheck = await checkMongoConnection();
  if (!mongoCheck) return false;

  console.log('\n✅ Todas las verificaciones pasaron exitosamente!');
  console.log('🎉 El servidor está listo para ejecutarse');
  console.log('\n📋 Comandos disponibles:');
  console.log('   npm run dev     - Ejecutar en modo desarrollo');
  console.log('   npm start       - Ejecutar en producción');
  console.log('   npm run seed    - Cargar datos de prueba');
  
  return true;
};

// Ejecutar la inicialización
initializeServer()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Error durante la inicialización:', error);
    process.exit(1);
  }); 