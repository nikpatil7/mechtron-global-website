const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

// HTTPS redirect middleware for production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      return res.redirect(`https://${req.header('host')}${req.url}`);
    }
    next();
  });
}

// Middleware
// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'https://mechtronglobal.vercel.app' // Add your production domain
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mechtron');
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use('/api/contact', require('./routes/contact'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/services', require('./routes/services'));
app.use('/api/site-settings', require('./routes/siteSettings'));
// Auth
app.use('/api/auth', require('./routes/auth'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});
// Static serving for uploaded media
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Upload route (mounted dynamically to avoid circular requires)
app.use('/api/upload', require('./routes/upload'));

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
