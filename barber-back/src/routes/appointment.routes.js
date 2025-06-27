import express from 'express';
import {
  getAppointments,
  getMyAppointments,
  getBarberAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentStatus,
  addAppointmentNotes
} from '../controllers/appointment.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { 
  validateAppointmentCreation, 
  validateAppointmentStatusUpdate 
} from '../middleware/validation.middleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas para cualquier usuario autenticado
router.post('/', validateAppointmentCreation, createAppointment);
router.get('/me', getMyAppointments);
router.get('/:id', getAppointmentById);

// Rutas para barberos
router.get('/barber/me', authorize('barber'), getBarberAppointments);

// Rutas que requieren permisos de barbero o admin
router.put('/:id/status', validateAppointmentStatusUpdate, updateAppointmentStatus);
router.put('/:id/notes', authorize('barber', 'admin'), addAppointmentNotes);

// Rutas que requieren permisos de admin
router.get('/', authorize('admin'), getAppointments);

export default router;
