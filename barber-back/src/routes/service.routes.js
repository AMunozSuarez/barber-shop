import express from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} from '../controllers/service.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', getServices);
router.get('/:id', getServiceById);

// Rutas protegidas que requieren autenticación de admin
router.use(protect);
router.use(authorize('admin'));

router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

export default router;
