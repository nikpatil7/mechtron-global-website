// Site configuration - all values from environment variables
// This makes it easy to update for different clients

const siteConfig = {
  // Site Identity
  siteName: import.meta.env.VITE_SITE_NAME || 'Mechtron Global',
  siteUrl: import.meta.env.VITE_SITE_URL || 'http://localhost:5173',
  siteDomain: import.meta.env.VITE_SITE_DOMAIN || 'localhost:5173',
  
  // Contact Information
  contact: {
    email: import.meta.env.VITE_CONTACT_EMAIL || 'sales@mechtronglobal.com',
    supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || 'info@mechtronglobal.com',
    phone: import.meta.env.VITE_CONTACT_PHONE || '+91 93211 76790',
    phoneSecondary: import.meta.env.VITE_CONTACT_PHONE_SECONDARY || '',
    address: import.meta.env.VITE_COMPANY_ADDRESS || 'Vivesta Purnanagar, Pune, Maharashtra, India',
  },
  
  // Social Media Links
  social: {
    linkedin: import.meta.env.VITE_SOCIAL_LINKEDIN || 'https://www.linkedin.com/company/mechtronglobal',
    twitter: import.meta.env.VITE_SOCIAL_TWITTER || 'https://twitter.com',
    facebook: import.meta.env.VITE_SOCIAL_FACEBOOK || 'https://facebook.com',
    instagram: import.meta.env.VITE_SOCIAL_INSTAGRAM || 'https://instagram.com',
  },
  
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE || 'http://localhost:5000',
  },
  
  // Helper function to get full URL
  getFullUrl: (path = '') => {
    const base = import.meta.env.VITE_SITE_URL || 'http://localhost:5173';
    return `${base}${path}`;
  },
  
  // Helper function to check if in production
  isProduction: () => {
    return import.meta.env.MODE === 'production';
  },
};

export default siteConfig;
