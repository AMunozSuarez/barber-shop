import express from 'express';
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación y rol de administrador
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getUsers);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

export default router;
