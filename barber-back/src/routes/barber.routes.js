import express from 'express';
import {
  getBarbers,
  getBarberById,
  createBarber,
  updateBarber,
  deleteBarber,
  addBarberReview,
  getBarberAvailability,
  getMyBarberProfile,
  updateBarberAvailability,
  debugAppointments
} from '../controllers/barber.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Rutas públicas específicas (sin parámetros)
router.get('/', getBarbers);

// Rutas públicas con parámetros
router.get('/:id', getBarberById);
router.get('/:id/availability', getBarberAvailability);

// Aplicar middleware de protección para todas las rutas privadas
router.use(protect);

// Ruta de debug (solo para admin)
router.get('/debug/appointments', authorize('admin'), debugAppointments);

// Rutas protegidas específicas (ANTES de /:id para evitar conflictos)
router.get('/profile', authorize('barber'), getMyBarberProfile);
router.put('/availability', authorize('barber'), updateBarberAvailability);

// Rutas que requieren autenticación de cliente
router.post('/:id/reviews', addBarberReview);

// Rutas que requieren autenticación de barbero o admin
router.put('/:id', authorize('barber', 'admin'), updateBarber);

// Rutas que requieren autenticación de admin
router.post('/', authorize('admin'), createBarber);
router.delete('/:id', authorize('admin'), deleteBarber);

export default router;
