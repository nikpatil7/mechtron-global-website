// Quick script to create an initial admin user
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mechtron');
    console.log('MongoDB Connected');

    // Check if admin exists
    const existing = await User.findOne({ email: 'admin@mechtronglobal.com' });
    if (existing) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin
    const admin = new User({
      name: 'Admin User',
      email: 'admin@mechtronglobal.com',
      password: 'admin123', // Change this!
      role: 'admin',
      permissions: ['*'],
      isActive: true,
    });

    await admin.save();
    console.log('✅ Admin user created successfully');
    console.log('Email: admin@mechtronglobal.com');
    console.log('Password: admin123');
    console.log('⚠️  Change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
