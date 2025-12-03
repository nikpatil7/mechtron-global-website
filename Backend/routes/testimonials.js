const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const authenticateToken = require('../middleware/auth');

// Get all testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch testimonials' 
    });
  }
});

// Create new testimonial (admin route)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { quote, author, role, company, rating, featured, photo, logo } = req.body || {};
    const errors = [];
    if (!quote || typeof quote !== 'string' || quote.trim().length < 5) errors.push('Quote is required (min 5 characters).');
    if (!author || typeof author !== 'string' || author.trim().length < 2) errors.push('Author is required.');
    if (!role || typeof role !== 'string' || role.trim().length < 2) errors.push('Role is required.');
    if (!company || typeof company !== 'string' || company.trim().length < 2) errors.push('Company is required.');
    if (rating !== undefined) {
      const r = Number(rating);
      if (!(r >= 1 && r <= 5)) errors.push('Rating must be between 1 and 5.');
    }
    if (typeof featured !== 'undefined' && typeof featured !== 'boolean') errors.push('Featured must be a boolean.');
    if (errors.length) return res.status(400).json({ success: false, error: errors.join(' ') });

    const testimonial = new Testimonial({
      quote: quote.trim(),
      author: author.trim(),
      role: role.trim(),
      company: company.trim(),
      rating: rating !== undefined ? Number(rating) : undefined,
      featured: !!featured,
      photo,
      logo,
    });
    await testimonial.save();
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    if (error.name === 'ValidationError') {
      const msg = Object.values(error.errors).map(e => e.message).join(' ');
      return res.status(400).json({ success: false, error: msg || 'Validation failed.' });
    }
    res.status(500).json({ success: false, error: 'Failed to create testimonial' });
  }
});

// Get single testimonial by ID
router.get('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, error: 'Testimonial not found' });
    }
    res.json({ success: true, data: testimonial });
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch testimonial' });
  }
});

// Update testimonial (admin route)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { quote, author, role, company, rating, featured, photo, logo } = req.body || {};
    
    const updates = {};
    if (quote) updates.quote = quote.trim();
    if (author) updates.author = author.trim();
    if (role) updates.role = role.trim();
    if (company) updates.company = company.trim();
    if (rating !== undefined) updates.rating = Number(rating);
    if (featured !== undefined) updates.featured = featured;
    if (photo !== undefined) updates.photo = photo;
    if (logo !== undefined) updates.logo = logo;

    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!testimonial) {
      return res.status(404).json({ success: false, error: 'Testimonial not found' });
    }

    res.json({ success: true, data: testimonial });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    if (error.name === 'ValidationError') {
      const msg = Object.values(error.errors).map(e => e.message).join(' ');
      return res.status(400).json({ success: false, error: msg || 'Validation failed.' });
    }
    res.status(500).json({ success: false, error: 'Failed to update testimonial' });
  }
});

// Delete testimonial (admin route)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, error: 'Testimonial not found' });
    }
    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ success: false, error: 'Failed to delete testimonial' });
  }
});

module.exports = router;
