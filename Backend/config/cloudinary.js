const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Check if Cloudinary is configured
const isCloudinaryConfigured = () => {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

// Cloudinary storage for Multer (Images)
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mechtron-global', // Cloudinary folder
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    transformation: [
      { width: 1920, height: 1080, crop: 'limit' }, // Max dimensions
      { quality: 'auto:good' }, // Auto quality optimization
      { fetch_format: 'auto' } // Auto format selection (WebP when supported)
    ]
  }
});

// Cloudinary storage for 3D Models (GLB/GLTF)
const cloudinaryModelStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mechtron-global/models',
    allowed_formats: ['glb', 'gltf'],
    resource_type: 'raw' // Store as raw files (no transformation)
  }
});

// Upload middleware for Cloudinary (Images)
const cloudinaryUpload = multer({
  storage: cloudinaryStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  }
});

// Upload middleware for 3D Models
const cloudinaryModelUpload = multer({
  storage: cloudinaryModelStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for models
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['model/gltf-binary', 'model/gltf+json', 'application/octet-stream'];
    const allowedExts = ['.glb', '.gltf'];
    const hasValidExt = allowedExts.some(ext => file.originalname.toLowerCase().endsWith(ext));
    
    if (!hasValidExt) {
      return cb(new Error('Only GLB/GLTF model files are allowed'), false);
    }
    cb(null, true);
  }
});

module.exports = {
  cloudinary,
  cloudinaryUpload,
  cloudinaryModelUpload,
  isCloudinaryConfigured
};
