import express from 'express';
import {
  getDashboardStats,
  getBarberDashboardStats,
  getRecentAppointments,
  getAvailableTimeSlots
} from '../controllers/dashboard.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Rutas públicas
router.get('/barber/:barberId/available-slots', getAvailableTimeSlots);

// Rutas protegidas
router.use(protect);

// Rutas para barberos
router.get('/barber/stats', authorize('barber'), getBarberDashboardStats);

// Rutas para administradores
router.get('/stats', authorize('admin'), getDashboardStats);
router.get('/recent-appointments', authorize('admin'), getRecentAppointments);

export default router; 