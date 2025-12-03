const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const authenticateToken = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/services');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'service-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// Get all services (public)
router.get('/', async (req, res) => {
  try {
    const { category, featured, isActive } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (featured !== undefined) filter.featured = featured === 'true';
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    else filter.isActive = true; // By default, only show active services

    const services = await Service.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: services });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch services' 
    });
  }
});

// Get single service by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const service = await Service.findOne({ 
      slug: req.params.slug,
      isActive: true 
    });
    
    if (!service) {
      return res.status(404).json({ 
        success: false,
        error: 'Service not found' 
      });
    }
    
    res.json({ success: true, data: service });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch service' 
    });
  }
});

// Get single service by ID (admin)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ 
        success: false,
        error: 'Service not found' 
      });
    }
    
    res.json({ success: true, data: service });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch service' 
    });
  }
});

// Create service (admin)
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const serviceData = { ...req.body };
    
    // Handle image upload
    if (req.file) {
      serviceData.image = `/uploads/services/${req.file.filename}`;
    }
    
    // Parse JSON fields
    if (typeof serviceData.features === 'string') {
      serviceData.features = JSON.parse(serviceData.features);
    }
    if (typeof serviceData.benefits === 'string') {
      serviceData.benefits = JSON.parse(serviceData.benefits);
    }
    if (typeof serviceData.pricing === 'string') {
      serviceData.pricing = JSON.parse(serviceData.pricing);
    }
    if (typeof serviceData.seo === 'string') {
      serviceData.seo = JSON.parse(serviceData.seo);
    }
    
    const service = new Service(serviceData);
    await service.save();
    
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to create service' 
    });
  }
});

// Update service (admin)
router.put('/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const serviceData = { ...req.body };
    
    // Handle image upload
    if (req.file) {
      serviceData.image = `/uploads/services/${req.file.filename}`;
    }
    
    // Parse JSON fields
    if (typeof serviceData.features === 'string') {
      serviceData.features = JSON.parse(serviceData.features);
    }
    if (typeof serviceData.benefits === 'string') {
      serviceData.benefits = JSON.parse(serviceData.benefits);
    }
    if (typeof serviceData.pricing === 'string') {
      serviceData.pricing = JSON.parse(serviceData.pricing);
    }
    if (typeof serviceData.seo === 'string') {
      serviceData.seo = JSON.parse(serviceData.seo);
    }
    
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      serviceData,
      { new: true, runValidators: true }
    );
    
    if (!service) {
      return res.status(404).json({ 
        success: false,
        error: 'Service not found' 
      });
    }
    
    res.json({ success: true, data: service });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to update service' 
    });
  }
});

// Delete service (admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    
    if (!service) {
      return res.status(404).json({ 
        success: false,
        error: 'Service not found' 
      });
    }
    
    res.json({ 
      success: true,
      message: 'Service deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete service' 
    });
  }
});

module.exports = router;
