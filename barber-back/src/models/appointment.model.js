import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  barber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Barber',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Por favor proporciona una fecha para la cita']
  },
  startTime: {
    type: String,
    required: [true, 'Por favor proporciona una hora de inicio para la cita']
  },
  endTime: {
    type: String,
    required: [true, 'Por favor proporciona una hora de fin para la cita']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'online', 'none'],
    default: 'none'
  }
}, {
  timestamps: true
});

// Índice no único para mejorar rendimiento de consultas
appointmentSchema.index({ barber: 1, date: 1, status: 1 });
appointmentSchema.index({ client: 1, date: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
