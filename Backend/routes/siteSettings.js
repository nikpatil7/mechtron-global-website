const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');
const authenticateToken = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for logo/favicon uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/branding');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'brand-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|ico|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'image/x-icon';
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// Get site settings (public - limited fields)
router.get('/', async (req, res) => {
  try {
    const settings = await SiteSettings.getSiteSettings();
    
    // Return only public-facing settings
    const publicSettings = {
      companyName: settings.companyName,
      tagline: settings.tagline,
      description: settings.description,
      logo: settings.logo,
      favicon: settings.favicon,
      contact: settings.contact,
      socialMedia: settings.socialMedia,
      theme: settings.theme,
      businessHours: settings.businessHours,
      features: {
        enableBlog: settings.features?.enableBlog,
        enableNewsletter: settings.features?.enableNewsletter,
        enableLiveChat: settings.features?.enableLiveChat,
        maintenanceMode: settings.features?.maintenanceMode
      }
    };
    
    res.json({ success: true, data: publicSettings });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch site settings' 
    });
  }
});

// Get full site settings (admin)
router.get('/admin', authenticateToken, async (req, res) => {
  try {
    const settings = await SiteSettings.getSiteSettings();
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch site settings' 
    });
  }
});

// Update site settings (admin)
router.put('/', authenticateToken, upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'favicon', maxCount: 1 }
]), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Handle logo upload
    if (req.files?.logo) {
      updateData.logo = `/uploads/branding/${req.files.logo[0].filename}`;
    }
    
    // Handle favicon upload
    if (req.files?.favicon) {
      updateData.favicon = `/uploads/branding/${req.files.favicon[0].filename}`;
    }
    
    // Parse JSON fields
    if (typeof updateData.contact === 'string') {
      updateData.contact = JSON.parse(updateData.contact);
    }
    if (typeof updateData.socialMedia === 'string') {
      updateData.socialMedia = JSON.parse(updateData.socialMedia);
    }
    if (typeof updateData.theme === 'string') {
      updateData.theme = JSON.parse(updateData.theme);
    }
    if (typeof updateData.seo === 'string') {
      updateData.seo = JSON.parse(updateData.seo);
    }
    if (typeof updateData.businessHours === 'string') {
      updateData.businessHours = JSON.parse(updateData.businessHours);
    }
    if (typeof updateData.features === 'string') {
      updateData.features = JSON.parse(updateData.features);
    }
    
    const settings = await SiteSettings.getSiteSettings();
    Object.assign(settings, updateData);
    await settings.save();
    
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error updating site settings:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to update site settings' 
    });
  }
});

module.exports = router;
