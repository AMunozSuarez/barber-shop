#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function updateMongoDBConfig() {
  console.log('🌐 CONFIGURADOR DE MONGODB ATLAS');
  console.log('=' .repeat(50));
  console.log('');
  
  console.log('📋 Necesito algunos datos para configurar tu MongoDB Atlas:');
  console.log('');

  try {
    // Solicitar información
    const username = await question('👤 Usuario de MongoDB Atlas: ');
    const password = await question('🔑 Contraseña de MongoDB Atlas: ');
    const clusterUrl = await question('🌐 URL del cluster (ej: barbershop.xxxxx.mongodb.net): ');
    const dbName = await question('📊 Nombre de la base de datos [barber_shop_db]: ') || 'barber_shop_db';

    // Construir la cadena de conexión
    const mongoUri = `mongodb+srv://${username}:${password}@${clusterUrl}/${dbName}?retryWrites=true&w=majority`;

    // Leer archivo actual
    const envPath = path.join(__dirname, '../.env.development');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Actualizar o agregar MONGODB_URI
    const lines = envContent.split('\n');
    let updated = false;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('MONGODB_URI=')) {
        lines[i] = `MONGODB_URI=${mongoUri}`;
        updated = true;
        break;
      }
    }

    if (!updated) {
      lines.unshift(`MONGODB_URI=${mongoUri}`);
    }

    // Asegurar que otras variables existan
    const requiredVars = {
      'JWT_SECRET': 'barber_shop_jwt_secret_key_super_secure_2024',
      'JWT_EXPIRE': '30d',
      'PORT': '5000',
      'NODE_ENV': 'development',
      'FRONTEND_URL': 'http://localhost:3000'
    };

    Object.entries(requiredVars).forEach(([key, defaultValue]) => {
      const exists = lines.some(line => line.startsWith(`${key}=`));
      if (!exists) {
        lines.push(`${key}=${defaultValue}`);
      }
    });

    // Escribir archivo actualizado
    const newEnvContent = lines.filter(line => line.trim() !== '').join('\n') + '\n';
    fs.writeFileSync(envPath, newEnvContent);

    console.log('');
    console.log('✅ Configuración actualizada exitosamente!');
    console.log('');
    console.log('📄 Archivo actualizado: .env.development');
    console.log('🔗 Nueva cadena de conexión configurada');
    console.log('');
    console.log('🚀 Próximos pasos:');
    console.log('1. Verifica que tu cluster de MongoDB Atlas esté activo');
    console.log('2. Ejecuta: node src/scripts/init-server.js');
    console.log('3. Si la conexión es exitosa, ejecuta: npm run seed');
    console.log('4. Inicia el servidor: npm run dev');
    console.log('');
    console.log('⚠️  IMPORTANTE: Nunca compartas el archivo .env.development');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

// Ejecutar el configurador
updateMongoDBConfig(); 