#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../.env.development') });

async function testAtlasConnection() {
  console.log('🌐 PROBANDO CONEXIÓN A MONGODB ATLAS');
  console.log('=' .repeat(50));
  console.log('');

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.log('❌ No se encontró MONGODB_URI en las variables de entorno');
    console.log('💡 Ejecuta: node scripts/update-mongodb-config.js');
    process.exit(1);
  }

  // Ocultar la contraseña en el log
  const safeUri = mongoUri.replace(/:([^:@]+)@/, ':****@');
  console.log('🔗 Intentando conectar a:', safeUri);
  console.log('');

  try {
    console.log('⏳ Conectando...');
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // 10 segundos timeout
    });

    console.log('✅ ¡Conexión exitosa a MongoDB Atlas!');
    console.log('');
    console.log('📊 Detalles de la conexión:');
    console.log(`   🏢 Host: ${conn.connection.host}`);
    console.log(`   📂 Base de datos: ${conn.connection.name}`);
    console.log(`   🔄 Estado: ${conn.connection.readyState === 1 ? 'Conectado' : 'Desconectado'}`);
    console.log('');

    // Probar una operación básica
    console.log('🧪 Probando operación básica...');
    const admin = conn.connection.db.admin();
    const result = await admin.ping();
    
    if (result.ok === 1) {
      console.log('✅ Ping exitoso - La base de datos responde correctamente');
    }

    // Listar colecciones existentes
    console.log('');
    console.log('📋 Colecciones existentes:');
    const collections = await conn.connection.db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('   📭 No hay colecciones (base de datos nueva)');
      console.log('   💡 Ejecuta "npm run seed" para cargar datos de prueba');
    } else {
      collections.forEach(col => {
        console.log(`   📄 ${col.name}`);
      });
    }

    console.log('');
    console.log('🎉 ¡Todo funcionando correctamente!');
    console.log('');
    console.log('🚀 Siguiente paso: npm run seed (para cargar datos de prueba)');

  } catch (error) {
    console.log('❌ Error de conexión:');
    console.log('');
    
    if (error.message.includes('authentication failed')) {
      console.log('🔐 Error de autenticación:');
      console.log('   - Verifica tu usuario y contraseña');
      console.log('   - Asegúrate de que el usuario tenga permisos');
    } else if (error.message.includes('serverSelectionTimeoutMS')) {
      console.log('⏰ Timeout de conexión:');
      console.log('   - Verifica tu conexión a internet');
      console.log('   - Confirma que la URL del cluster sea correcta');
      console.log('   - Revisa la configuración de IP whitelist en Atlas');
    } else if (error.message.includes('bad auth')) {
      console.log('🔑 Credenciales incorrectas:');
      console.log('   - Verifica usuario y contraseña en MongoDB Atlas');
      console.log('   - Confirma que el usuario existe en Database Access');
    } else {
      console.log(`💥 Error: ${error.message}`);
    }

    console.log('');
    console.log('🔧 Soluciones comunes:');
    console.log('1. Ejecuta: node scripts/update-mongodb-config.js');
    console.log('2. Verifica en MongoDB Atlas:');
    console.log('   - Database Access: usuario y contraseña correctos');
    console.log('   - Network Access: IP 0.0.0.0/0 permitida');
    console.log('   - Cluster: que esté activo y corriendo');
    
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('');
    console.log('🔌 Desconectado de MongoDB');
    process.exit(0);
  }
}

testAtlasConnection(); 