const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    trim: true
  },
  icon: {
    type: String, // Icon class name (e.g., 'FaCube' or URL)
    trim: true
  },
  image: {
    type: String, // URL to service image
    trim: true
  },
  features: [{
    type: String
  }],
  benefits: [{
    type: String
  }],
  category: {
    type: String,
    enum: ['BIM Modeling', 'MEP Coordination', 'Clash Detection', 'Visualization', 'Other'],
    default: 'Other'
  },
  pricing: {
    startingFrom: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    unit: String // e.g., 'per project', 'per hour'
  },
  order: {
    type: Number,
    default: 0 // For custom ordering
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

// Generate slug from title before saving
serviceSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Service', serviceSchema);
