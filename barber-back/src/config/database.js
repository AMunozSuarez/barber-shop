import mongoose from 'mongoose';

// Configuración de la conexión a MongoDB
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/barber_shop_db', {
      // Opciones de conexión para evitar warnings deprecados
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

// Configuración de eventos de la conexión
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB desconectado');
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB conectado exitosamente');
});

export default { connectDB }; 