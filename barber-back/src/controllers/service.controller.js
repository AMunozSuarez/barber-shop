import Service from '../models/service.model.js';

// @desc    Obtener todos los servicios
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Obtener un servicio por ID
// @route   GET /api/services/:id
// @access  Public
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Servicio no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Crear un nuevo servicio
// @route   POST /api/services
// @access  Private/Admin
export const createService = async (req, res) => {
  try {
    const { name, description, price, duration, category, image } = req.body;

    const service = await Service.create({
      name,
      description,
      price,
      duration,
      category,
      image
    });

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Actualizar un servicio
// @route   PUT /api/services/:id
// @access  Private/Admin
export const updateService = async (req, res) => {
  try {
    const { name, description, price, duration, category, image, isActive } = req.body;

    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Servicio no encontrado'
      });
    }

    // Actualizar campos
    service.name = name || service.name;
    service.description = description || service.description;
    service.price = price !== undefined ? price : service.price;
    service.duration = duration !== undefined ? duration : service.duration;
    service.category = category || service.category;
    service.image = image || service.image;
    service.isActive = isActive !== undefined ? isActive : service.isActive;

    // Guardar cambios
    await service.save();

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Eliminar un servicio
// @route   DELETE /api/services/:id
// @access  Private/Admin
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Servicio no encontrado'
      });
    }

    // Eliminar servicio
    await service.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
