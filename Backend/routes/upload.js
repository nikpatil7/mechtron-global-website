const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { cloudinary, cloudinaryUpload, isCloudinaryConfigured } = require('../config/cloudinary');

const router = express.Router();

// Check if using Cloudinary or local storage
const useCloudinary = isCloudinaryConfigured();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
const optimizedDir = path.join(uploadsDir, 'optimized');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir);
}

// Multer storage config for local dev
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${base}-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  }
});

// Image optimization function
async function optimizeImage(inputPath, filename) {
  try {
    // Check if file exists
    if (!fs.existsSync(inputPath)) {
      throw new Error(`File not found: ${inputPath}`);
    }

    const ext = path.extname(filename).toLowerCase();
    const base = path.basename(filename, ext);
    
    // Generate optimized versions
    const optimizedFilename = `${base}-opt${ext}`;
    const webpFilename = `${base}.webp`;
    
    const optimizedPath = path.join(optimizedDir, optimizedFilename);
    const webpPath = path.join(optimizedDir, webpFilename);

    // Get image metadata to determine format
    const metadata = await sharp(inputPath).metadata();
    const isJpeg = ['jpg', 'jpeg'].includes(ext);
    const isPng = ext === 'png';

    // Resize and compress based on format
    const sharpInstance = sharp(inputPath)
      .resize(1920, 1080, { 
        fit: 'inside', 
        withoutEnlargement: true 
      });

    if (isJpeg) {
      await sharpInstance.jpeg({ quality: 85, progressive: true }).toFile(optimizedPath);
    } else if (isPng) {
      await sharpInstance.png({ compressionLevel: 8, progressive: true }).toFile(optimizedPath);
    } else {
      // For other formats (gif, webp, etc.), just resize
      await sharpInstance.toFile(optimizedPath);
    }

    // Generate WebP version (if supported)
    try {
      await sharp(inputPath)
        .resize(1920, 1080, { 
          fit: 'inside', 
          withoutEnlargement: true 
        })
        .webp({ quality: 85 })
        .toFile(webpPath);
    } catch (webpError) {
      console.warn('WebP conversion failed, using original:', webpError.message);
      // If WebP fails, use optimized version
    }

    return {
      original: `/uploads/${filename}`,
      optimized: `/uploads/optimized/${optimizedFilename}`,
      webp: fs.existsSync(webpPath) ? `/uploads/optimized/${webpFilename}` : `/uploads/optimized/${optimizedFilename}`
    };
  } catch (error) {
    console.error('Image optimization error:', error);
    // Fallback to original
    return {
      original: `/uploads/${filename}`,
      optimized: `/uploads/${filename}`,
      webp: `/uploads/${filename}`
    };
  }
}

// Single file upload with optimization
router.post('/single', (req, res, next) => {
  // Use Cloudinary if configured, otherwise use local storage
  const uploadMiddleware = useCloudinary ? cloudinaryUpload.single('file') : upload.single('file');
  
  uploadMiddleware(req, res, (err) => {
    // Handle multer errors
    if (err) {
      console.error('Multer upload error:', err);
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ success: false, error: 'File size too large. Maximum size is 10MB.' });
        }
        return res.status(400).json({ success: false, error: `Upload error: ${err.message}` });
      }
      // Handle other errors (like file type validation)
      return res.status(400).json({ success: false, error: err.message || 'File upload failed' });
    }
    // No error, proceed to handler
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    
    // If using Cloudinary, return Cloudinary URL
    if (useCloudinary) {
      return res.json({ 
        success: true, 
        url: req.file.path, // Cloudinary URL
        urls: {
          original: req.file.path,
          optimized: req.file.path,
          webp: req.file.path
        },
        filename: req.file.filename,
        storage: 'cloudinary'
      });
    }
    
    // Local storage: optimize image
    try {
      const inputPath = req.file.path;
      const optimizedUrls = await optimizeImage(inputPath, req.file.filename);
      
      res.json({ 
        success: true, 
        url: optimizedUrls.optimized,
        urls: optimizedUrls,
        filename: req.file.filename,
        storage: 'local'
      });
    } catch (optimizeError) {
      console.error('Image optimization error:', optimizeError);
      // Return original file if optimization fails
      res.json({ 
        success: true, 
        url: `/uploads/${req.file.filename}`,
        urls: {
          original: `/uploads/${req.file.filename}`,
          optimized: `/uploads/${req.file.filename}`,
          webp: `/uploads/${req.file.filename}`
        },
        filename: req.file.filename,
        storage: 'local'
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to process image' });
  }
});

// Multiple files upload with optimization
router.post('/multiple', (req, res, next) => {
  // Use Cloudinary if configured, otherwise use local storage
  const uploadMiddleware = useCloudinary ? cloudinaryUpload.array('files', 10) : upload.array('files', 10);
  
  uploadMiddleware(req, res, (err) => {
    // Handle multer errors
    if (err) {
      console.error('Multer upload error:', err);
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ success: false, error: 'File size too large. Maximum size is 10MB.' });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({ success: false, error: 'Too many files. Maximum is 10 files.' });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({ success: false, error: 'Unexpected file field name. Use "files" for multiple uploads.' });
        }
        return res.status(400).json({ success: false, error: `Upload error: ${err.message}` });
      }
      // Handle other errors (like file type validation)
      return res.status(400).json({ success: false, error: err.message || 'File upload failed' });
    }
    // No error, proceed to handler
    next();
  });
}, async (req, res) => {
  try {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ success: false, error: 'No files uploaded' });
    }
    
    // If using Cloudinary, return Cloudinary URLs
    if (useCloudinary) {
      const urls = req.files.map(file => file.path); // Cloudinary URLs
      const details = req.files.map(file => ({
        original: file.path,
        optimized: file.path,
        webp: file.path
      }));
      
      return res.json({ 
        success: true, 
        urls,
        details,
        storage: 'cloudinary'
      });
    }
    
    // Local storage: optimize images
    const optimizedResults = await Promise.all(
      req.files.map(async (file) => {
        try {
          const inputPath = file.path;
          return await optimizeImage(inputPath, file.filename);
        } catch (error) {
          console.error(`Error optimizing file ${file.filename}:`, error);
          // Return original file if optimization fails
          return {
            original: `/uploads/${file.filename}`,
            optimized: `/uploads/${file.filename}`,
            webp: `/uploads/${file.filename}`
          };
        }
      })
    );
    
    const urls = optimizedResults.map(r => r.optimized);
    
    res.json({ 
      success: true, 
      urls,
      details: optimizedResults,
      storage: 'local'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to process images' });
  }
});

// Delete image from Cloudinary (admin only)
router.delete('/cloudinary/:publicId', async (req, res) => {
  try {
    if (!useCloudinary) {
      return res.status(400).json({ error: 'Cloudinary not configured' });
    }
    
    const publicId = req.params.publicId.replace(/-/g, '/');
    const result = await cloudinary.uploader.destroy(publicId);
    
    res.json({ 
      success: true, 
      result 
    });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    res.status(500).json({ error: 'Failed to delete image from Cloudinary' });
  }
});

// Get upload configuration info
router.get('/config', (req, res) => {
  res.json({
    storage: useCloudinary ? 'cloudinary' : 'local',
    maxFileSize: '10MB',
    maxFiles: 10,
    allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
  });
});

module.exports = router;
