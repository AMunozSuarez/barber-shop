import express from 'express';
import { register, login, getMe, updateProfile } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validateUserRegistration } from '../middleware/validation.middleware.js';

const router = express.Router();

// Rutas públicas
router.post('/register', validateUserRegistration, register);
router.post('/login', login);

// Rutas protegidas
router.get('/me', protect, getMe);
router.put('/updateprofile', protect, updateProfile);

export default router;
