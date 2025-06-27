import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor proporciona un nombre para el servicio'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Por favor proporciona un precio para el servicio'],
    min: 0
  },
  duration: {
    type: Number,
    required: [true, 'Por favor proporciona la duración del servicio en minutos'],
    min: 0
  },
  category: {
    type: String,
    enum: ['haircut', 'beard', 'combo', 'special', 'other'],
    default: 'other'
  },
  image: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;
