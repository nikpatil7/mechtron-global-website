const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const authenticateToken = require('../middleware/auth');

// Get all projects with pagination
router.get('/', async (req, res) => {
  try {
    const { category, featured, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (featured === 'true') filter.featured = true;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Project.countDocuments(filter);
    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    res.json({ 
      success: true, 
      data: projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
        hasMore: skip + projects.length < total
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch projects' 
    });
  }
});

// Get project by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    console.error('Error fetching project by slug:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch project' });
  }
});

// Get single project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ 
        success: false,
        error: 'Project not found' 
      });
    }
    
    res.json({ success: true, data: project });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch project' 
    });
  }
});

// Create new project (admin route)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const allowedCategories = ['Commercial', 'Residential', 'High-Rise', 'Kitchen', 'Industrial', 'Educational'];
    const {
      title,
      category,
      description,
      tags,
      metrics,
      client,
      featured,
      images,
      caseStudyUrl,
    } = req.body || {};

    const errors = [];
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      errors.push('Title is required (min 3 characters).');
    }
    if (!category || !allowedCategories.includes(category)) {
      errors.push('Category is required and must be one of: ' + allowedCategories.join(', ') + '.');
    }
    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      errors.push('Description is required (min 10 characters).');
    }
    if (client && client.rating !== undefined) {
      const r = Number(client.rating);
      if (!(r >= 1 && r <= 5)) errors.push('Client rating must be between 1 and 5.');
    }
    if (tags && !Array.isArray(tags)) {
      errors.push('Tags must be an array of strings.');
    }
    if (metrics && (typeof metrics !== 'object' || Array.isArray(metrics))) {
      errors.push('Metrics must be an object of key/value pairs.');
    }
    if (images && !Array.isArray(images)) {
      errors.push('Images must be an array of URLs.');
    }
    if (caseStudyUrl && typeof caseStudyUrl !== 'string') {
      errors.push('Case study URL must be a string.');
    }
    if (typeof featured !== 'undefined' && typeof featured !== 'boolean') {
      errors.push('Featured must be a boolean.');
    }

    if (errors.length) {
      return res.status(400).json({ success: false, error: errors.join(' ') });
    }

    const project = new Project({
      title: title.trim(),
      category,
      description: description.trim(),
      tags,
      metrics,
      client,
      featured: !!featured,
      images,
      caseStudyUrl: caseStudyUrl?.trim() || '',
    });
    await project.save();
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error('Error creating project:', error);
    if (error.name === 'ValidationError') {
      const msg = Object.values(error.errors).map(e => e.message).join(' ');
      return res.status(400).json({ success: false, error: msg || 'Validation failed.' });
    }
    res.status(500).json({ success: false, error: 'Failed to create project' });
  }
});

// Update project (admin route)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, category, description, tags, metrics, client, featured, images, caseStudyUrl } = req.body || {};
    
    const updates = {};
    if (title) updates.title = title.trim();
    if (category) updates.category = category;
    if (description) updates.description = description.trim();
    if (tags !== undefined) updates.tags = tags;
    if (metrics !== undefined) updates.metrics = metrics;
    if (client !== undefined) updates.client = client;
    if (featured !== undefined) updates.featured = featured;
    if (images !== undefined) updates.images = images;
    if (caseStudyUrl !== undefined) updates.caseStudyUrl = caseStudyUrl?.trim() || '';

    const project = await Project.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    console.error('Error updating project:', error);
    if (error.name === 'ValidationError') {
      const msg = Object.values(error.errors).map(e => e.message).join(' ');
      return res.status(400).json({ success: false, error: msg || 'Validation failed.' });
    }
    res.status(500).json({ success: false, error: 'Failed to update project' });
  }
});

// Delete project (admin route)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ success: false, error: 'Failed to delete project' });
  }
});

module.exports = router;
