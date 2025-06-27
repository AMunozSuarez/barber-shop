export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log para desarrollo
  console.error(err);

  // Error de Mongoose - ID inválido
  if (err.name === 'CastError') {
    const message = 'Recurso no encontrado';
    error = { message, statusCode: 404 };
  }

  // Error de Mongoose - campos duplicados
  if (err.code === 11000) {
    const message = 'Ya existe un registro con estos datos';
    error = { message, statusCode: 400 };
  }

  // Error de Mongoose - validación
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Error del servidor'
  });
};

export const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
