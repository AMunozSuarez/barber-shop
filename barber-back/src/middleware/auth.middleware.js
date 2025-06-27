import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
  let token;

  console.log('🔒 Checking authorization header:', req.headers.authorization);

  // Verificar si existe el token en los headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Obtener el token
      token = req.headers.authorization.split(' ')[1];
      console.log('🔑 Token found:', token.substring(0, 20) + '...');

      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token decoded:', decoded);

      // Obtener el usuario del token
      req.user = await User.findById(decoded.id).select('-password');
      console.log('👤 User found:', req.user ? `${req.user.name} (${req.user.role})` : 'No user found');

      if (!req.user) {
        console.log('❌ User not found in database');
        return res.status(401).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      next();
    } catch (error) {
      console.error('❌ Error in protect middleware:', error);
      return res.status(401).json({
        success: false,
        error: 'No autorizado, token inválido'
      });
    }
  }

  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({
      success: false,
      error: 'No autorizado, no se proporcionó token'
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    console.log('👮 Checking role authorization:', { userRole: req.user.role, allowedRoles: roles });
    
    if (!roles.includes(req.user.role)) {
      console.log('❌ Role not authorized');
      return res.status(403).json({
        success: false,
        error: `El rol ${req.user.role} no está autorizado para acceder a este recurso`
      });
    }
    
    console.log('✅ Role authorized');
    next();
  };
};
