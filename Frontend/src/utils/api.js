import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Contact API
export const submitContactForm = async (formData) => {
  const response = await api.post('/api/contact/submit', formData);
  return response.data;
};

// Projects API
export const getProjects = async (category = null, page = 1, limit = 20) => {
  const params = {};
  if (category) params.category = category;
  params.page = page;
  params.limit = limit;
  const response = await api.get('/api/projects', { params });
  return response.data;
};

export const getProjectById = async (id) => {
  const response = await api.get(`/api/projects/${id}`);
  return response.data;
};

export const getProjectBySlug = async (slug) => {
  const response = await api.get(`/api/projects/slug/${slug}`);
  return response.data;
};

// Testimonials API
export const getTestimonials = async () => {
  const response = await api.get('/api/testimonials');
  return response.data;
};

// Services API
export const getServices = async (filters = {}) => {
  const response = await api.get('/api/services', { params: filters });
  return response.data;
};

export const getServiceById = async (id) => {
  const response = await api.get(`/api/services/${id}`);
  return response.data;
};

export const getServiceBySlug = async (slug) => {
  const response = await api.get(`/api/services/slug/${slug}`);
  return response.data;
};

// Site Settings API
export const getSiteSettings = async () => {
  const response = await api.get('/api/site-settings');
  return response.data;
};

export const getAdminSiteSettings = async () => {
  const response = await api.get('/api/site-settings/admin');
  return response.data;
};

// Create (admin)
export const createProject = async (payload) => {
  const response = await api.post('/api/projects', payload);
  return response.data;
};

export const createTestimonial = async (payload) => {
  const response = await api.post('/api/testimonials', payload);
  return response.data;
};

export const createService = async (payload) => {
  const response = await api.post('/api/services', payload);
  return response.data;
};

export default api;
