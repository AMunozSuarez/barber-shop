#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 ARREGLANDO CONFIGURACIÓN DE MONGODB ATLAS');
console.log('=' .repeat(50));

const envPath = path.join(__dirname, '../.env.development');

try {
  // Leer archivo actual
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('📄 Configuración actual:');
  console.log(envContent.replace(/:[^@]*@/, ':****@'));
  
  // Buscar y reemplazar la URI
  let newContent = envContent;
  
  // Si no tiene nombre de base de datos, agregarlo
  if (newContent.includes('mongodb.net/?') || newContent.includes('mongodb.net?')) {
    newContent = newContent.replace(
      /(mongodb\.net)\/?\?/g, 
      '$1/barber_shop_db?'
    );
    console.log('✅ Agregado nombre de base de datos: barber_shop_db');
  } else if (newContent.includes('mongodb.net/test?')) {
    newContent = newContent.replace(
      /mongodb\.net\/test\?/g,
      'mongodb.net/barber_shop_db?'
    );
    console.log('✅ Cambiado de "test" a "barber_shop_db"');
  } else {
    console.log('⚠️  No se detectó problema en la URI');
  }

  // Escribir archivo actualizado
  fs.writeFileSync(envPath, newContent);
  
  console.log('');
  console.log('📄 Nueva configuración:');
  console.log(newContent.replace(/:[^@]*@/, ':****@'));
  
  console.log('🎉 ¡Configuración actualizada!');
  console.log('');
  console.log('🚀 Próximos pasos:');
  console.log('1. node scripts/test-atlas-connection.js  (probar conexión)');
  console.log('2. npm run seed                           (cargar datos)');
  console.log('3. node scripts/test-db.js stats          (verificar datos)');

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
} 