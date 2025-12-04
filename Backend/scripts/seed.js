require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('../models/Project');
const Testimonial = require('../models/Testimonial');

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/KataVerseBIMDB';
  await mongoose.connect(uri);

  const projects = [
    {
      title: '45-Story Commercial Tower',
      category: 'Commercial',
      description: 'Complete MEP coordination for high-rise commercial project with advanced clash detection',
      images: [],
      tags: ['MEP Coordination', 'Clash Detection', 'High-Rise'],
      metrics: { 'Clash Reduction': '87%', 'Floors': '45', 'Timeline': '18 months', 'Cost Saved': '$2.5M' },
      client: { name: 'ABC Construction', testimonial: 'Exceptional coordination and accuracy', rating: 5 },
      featured: true,
    },
    {
      title: 'Luxury Residential Complex',
      category: 'Residential',
      description: 'Full BIM modeling and coordination for 200-unit luxury residential development',
      images: [],
      tags: ['BIM Modeling', 'Residential', 'MEP'],
      metrics: { 'Units': '200', 'Buildings': '4', 'Timeline': '12 months', 'Cost Saved': '$350K' },
      client: { name: 'Premier Developers', testimonial: 'Professional service with attention to detail', rating: 5 },
      featured: true,
    },
    {
      title: 'Manufacturing Facility Expansion',
      category: 'Industrial',
      description: 'MEP shop drawings and as-built documentation for industrial manufacturing plant expansion',
      images: [],
      tags: ['Shop Drawings', 'Industrial', 'As-Built'],
      metrics: { 'Area': '150,000 sq ft', 'Systems': 'HVAC, Electrical, Plumbing', 'Timeline': '8 months', 'Accuracy': '99.5%' },
      client: { name: 'Industrial Solutions Ltd', testimonial: 'Precise documentation helped us avoid costly installation errors', rating: 5 },
      featured: true,
    },
    {
      title: 'Educational Campus Development',
      category: 'Educational',
      description: 'Comprehensive BIM modeling and MEP coordination for multi-building educational campus',
      images: [],
      tags: ['BIM Modeling', 'Educational', 'Multi-Building'],
      metrics: { 'Buildings': '8', 'Students': '5000', 'Timeline': '24 months', 'Clash Reduction': '92%' },
      client: { name: 'State Education Board', testimonial: 'Outstanding coordination across multiple buildings', rating: 5 },
      featured: false,
    },
    {
      title: 'Hospital HVAC Retrofit',
      category: 'Commercial',
      description: 'Critical HVAC system retrofit with minimal disruption to hospital operations',
      images: [],
      tags: ['HVAC', 'Healthcare', 'Retrofit'],
      metrics: { 'Beds': '500', 'Systems': 'HVAC, Medical Gas', 'Downtime': '0 hours', 'Timeline': '6 months' },
      client: { name: 'Metro Healthcare', testimonial: 'Seamless execution with zero operational downtime', rating: 5 },
      featured: false,
    },
    {
      title: 'Mixed-Use Development',
      category: 'Commercial',
      description: 'Integrated MEP design for mixed-use development with retail, office, and residential spaces',
      images: [],
      tags: ['Mixed-Use', 'MEP Design', 'Coordination'],
      metrics: { 'Area': '500,000 sq ft', 'Zones': 'Retail, Office, Residential', 'Timeline': '20 months', 'Cost Saved': '$1.8M' },
      client: { name: 'Urban Developers Inc', testimonial: 'Complex project delivered with precision', rating: 5 },
      featured: false,
    },
  ];

  const testimonials = [
    {
      quote: "KataVerse's BIM expertise transformed our project workflow. Exceptional coordination and precision. They delivered ahead of schedule with zero clashes.",
      author: 'Rajesh Kumar',
      role: 'Project Manager',
      company: 'ABC Construction',
      rating: 5,
      featured: true,
    },
    {
      quote: 'Outstanding MEP coordination. Their clash detection reduced rework significantly and saved us millions in potential delays.',
      author: 'Sarah Johnson',
      role: 'Lead Architect',
      company: 'Design Innovators',
      rating: 5,
      featured: true,
    },
    {
      quote: 'Professional team with deep technical knowledge. The shop drawings were accurate and helped us complete installation 2 weeks early.',
      author: 'Amit Patel',
      role: 'MEP Contractor',
      company: 'Industrial Solutions Ltd',
      rating: 5,
      featured: true,
    },
    {
      quote: 'Best BIM coordination service we have worked with. Their attention to detail and quick turnaround is impressive.',
      author: 'Michael Chen',
      role: 'Director of Engineering',
      company: 'Metro Healthcare',
      rating: 5,
      featured: false,
    },
  ];

  await Project.deleteMany({});
  await Testimonial.deleteMany({});
  
  // Insert projects one by one to trigger pre-validate hooks properly
  for (const project of projects) {
    await Project.create(project);
  }
  
  await Testimonial.insertMany(testimonials);

  console.log('Seed complete');
  await mongoose.disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });
