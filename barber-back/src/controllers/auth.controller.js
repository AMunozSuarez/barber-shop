import User from '../models/user.model.js';
import { generateToken } from '../utils/helpers.js';

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, username, email, password, phone, role } = req.body;

    // Usar name o username como nombre del usuario
    const userName = name || username;

    // Validar datos requeridos
    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Nombre, email y contraseña son requeridos'
      });
    }

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'El usuario ya existe'
      });
    }

    // Determinar el rol del usuario
    let userRole = 'client'; // Por defecto es cliente
    
    // Solo permitir crear admin o barber si el usuario actual es admin
    if (role && (role === 'admin' || role === 'barber')) {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'No tienes permisos para crear este tipo de usuario'
        });
      }
      userRole = role;
    } else if (role === 'client' || !role) {
      // Permitir crear clientes siempre (registro público)
      userRole = 'client';
    }

    // Crear el usuario
    const user = await User.create({
      name: userName,
      email,
      password,
      phone: phone || '',
      role: userRole
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
      },
      message: 'Usuario registrado exitosamente'
    });
  } catch (error) {
    console.error('Error en el registro:', error);
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
