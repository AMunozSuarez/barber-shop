import mongoose from 'mongoose';

const barberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialty: {
    type: [String],
    default: []
  },
  experience: {
    type: Number,
    default: 0
  },
  bio: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  availability: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  }],
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Método para calcular y actualizar la calificación promedio
barberSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.reviewCount = 0;
    return;
  }
  
  const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
  this.rating = (sum / this.reviews.length).toFixed(1);
  this.reviewCount = this.reviews.length;
};

const Barber = mongoose.model('Barber', barberSchema);

export default Barber;
