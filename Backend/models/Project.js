const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  caseStudyUrl: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: true,
    enum: ['Commercial', 'Residential', 'High-Rise', 'Kitchen', 'Industrial', 'Educational']
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  metrics: {
    type: Map,
    of: String
  },
  client: {
    name: String,
    logo: String,
    testimonial: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    }
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Helper to generate slug from title
function toSlug(str) {
  return str
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

projectSchema.pre('validate', function(next) {
  if (this.title && !this.slug) {
    this.slug = toSlug(this.title);
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);
