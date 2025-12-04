require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('../models/Project');
const Testimonial = require('../models/Testimonial');

async function verify() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/KataVerseBIMDB';
  await mongoose.connect(uri);
  
  console.log('\n✅ Connected to database\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const projects = await Project.find({});
  const testimonials = await Testimonial.find({});
  
  console.log(`📊 Database: ${uri.split('/').pop()}`);
  console.log(`📦 Projects: ${projects.length}`);
  console.log(`💬 Testimonials: ${testimonials.length}\n`);
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  if (projects.length > 0) {
    console.log('Sample Projects:');
    projects.slice(0, 3).forEach(p => {
      console.log(`  • ${p.title} (${p.category}) - Slug: ${p.slug}`);
    });
    console.log('');
  }
  
  if (testimonials.length > 0) {
    console.log('Sample Testimonials:');
    testimonials.slice(0, 2).forEach(t => {
      console.log(`  • ${t.author} (${t.company}) - ${t.rating}⭐`);
    });
    console.log('');
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  await mongoose.disconnect();
}

verify().catch(console.error);
