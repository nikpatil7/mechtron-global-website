// Quick script to create an initial admin user
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Get email and password from command line arguments or use defaults
const email = process.argv[2] || 'admin@mechtronglobal.com';
const password = process.argv[3] || 'admin123';
const name = process.argv[4] || 'Admin User';

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mechtron');
    console.log('MongoDB Connected');

    // Check if admin exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`Admin user with email ${email} already exists`);
      console.log('To create a different user, provide email as first argument:');
      console.log('node scripts/createAdminUser.js newemail@example.com password123 "User Name"');
      process.exit(0);
    }

    // Create admin
    const admin = new User({
      name,
      email,
      password, // Will be hashed automatically by the pre-save hook
      role: 'admin',
      permissions: ['*'],
      isActive: true,
    });

    await admin.save();
    console.log('✅ Admin user created successfully');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Name: ${name}`);
    console.log('⚠️  Change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.code === 11000) {
      console.error('Email already exists in database');
    }
    process.exit(1);
  }
}

createAdmin();
