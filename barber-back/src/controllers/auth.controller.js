import User from '../models/user.model.js';
import { generateToken } from '../utils/helpers.js';

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'El usuario ya existe'
      });
    }

    // Verificar que el rol sea válido (solo admin puede crear otros admins o barberos)
    if ((role === 'admin' || role === 'barber') && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para crear este tipo de usuario'
      });
    }

    // Crear el usuario
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'client' // Por defecto es cliente
    });

    // Responder con el usuario creado y token
    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Iniciar sesión
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar que se proporcionen email y password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Por favor proporciona email y contraseña'
      });
    }

    // Buscar usuario por email y obtener la contraseña
    const user = await User.findOne({ email }).select('+password');

    // Verificar si el usuario existe
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    // Verificar si la contraseña coincide
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    // Responder con el usuario y token
    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Obtener perfil del usuario actual
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Actualizar perfil del usuario
// @route   PUT /api/auth/updateprofile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Buscar usuario
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    // Actualizar campos
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (password) user.password = password; // Se encriptará automáticamente por el middleware

    // Guardar cambios
    await user.save();

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
