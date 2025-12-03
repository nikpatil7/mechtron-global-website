const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  // Company Information
  companyName: {
    type: String,
    default: 'Mechtron Global'
  },
  tagline: {
    type: String,
    default: 'Advanced BIM Solutions'
  },
  description: {
    type: String
  },
  logo: {
    type: String // URL to logo
  },
  favicon: {
    type: String // URL to favicon
  },
  
  // Contact Information
  contact: {
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  
  // Social Media Links
  socialMedia: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String,
    youtube: String,
    github: String
  },
  
  // Theme Colors
  theme: {
    primaryColor: {
      type: String,
      default: '#0E3A5B'
    },
    secondaryColor: {
      type: String,
      default: '#0B1F2A'
    },
    accentColor: {
      type: String,
      default: '#14B8A6'
    },
    lightColor: {
      type: String,
      default: '#F8FAFC'
    }
  },
  
  // SEO Settings
  seo: {
    defaultMetaTitle: String,
    defaultMetaDescription: String,
    defaultKeywords: [String],
    googleAnalyticsId: String,
    googleTagManagerId: String
  },
  
  // Business Hours
  businessHours: {
    monday: { open: String, close: String, isOpen: Boolean },
    tuesday: { open: String, close: String, isOpen: Boolean },
    wednesday: { open: String, close: String, isOpen: Boolean },
    thursday: { open: String, close: String, isOpen: Boolean },
    friday: { open: String, close: String, isOpen: Boolean },
    saturday: { open: String, close: String, isOpen: Boolean },
    sunday: { open: String, close: String, isOpen: Boolean }
  },
  
  // Features Toggle
  features: {
    enableBlog: {
      type: Boolean,
      default: false
    },
    enableNewsletter: {
      type: Boolean,
      default: true
    },
    enableLiveChat: {
      type: Boolean,
      default: false
    },
    maintenanceMode: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
siteSettingsSchema.statics.getSiteSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
