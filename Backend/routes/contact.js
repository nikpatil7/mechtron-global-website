const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const axios = require('axios');
const Inquiry = require('../models/Inquiry');
const authenticateToken = require('../middleware/auth');

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Submit contact form
router.post('/submit', async (req, res) => {
  try {
    const { name, email, phone, company, service, message, recaptchaToken } = req.body;

    // Verify reCAPTCHA token (skip in development if no secret set)
    if (recaptchaToken && process.env.RECAPTCHA_SECRET_KEY) {
      try {
        const recaptchaResponse = await axios.post(
          `https://www.google.com/recaptcha/api/siteverify`,
          null,
          {
            params: {
              secret: process.env.RECAPTCHA_SECRET_KEY,
              response: recaptchaToken
            }
          }
        );

        if (!recaptchaResponse.data.success || recaptchaResponse.data.score < 0.5) {
          return res.status(400).json({
            success: false,
            error: 'reCAPTCHA verification failed. Please try again.'
          });
        }
      } catch (recaptchaError) {
        console.error('reCAPTCHA verification error:', recaptchaError);
        // Continue anyway in case of reCAPTCHA service issues
      }
    }

    // Validate required fields
    if (!name || !email || !message || !service) {
      return res.status(400).json({ 
        success: false,
        error: 'Please provide all required fields' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    // Save to database
    const inquiry = new Inquiry({
      name,
      email,
      phone: phone || '',
      company: company || '',
      service,
      message
    });

    await inquiry.save();

    // Send email notification to admin
    const adminMailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: `New Inquiry from ${name} - Mechtron Global`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2D7A8E; border-bottom: 3px solid #E67E4D; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p style="margin: 10px 0;"><strong>Company:</strong> ${company || 'Not provided'}</p>
            <p style="margin: 10px 0;"><strong>Service Interest:</strong> ${service}</p>
            <p style="margin: 10px 0;"><strong>Message:</strong></p>
            <p style="background-color: white; padding: 15px; border-radius: 5px; line-height: 1.6;">
              ${message}
            </p>
          </div>
          <p style="color: #666; font-size: 12px;">
            Submitted on: ${new Date().toLocaleString()}
          </p>
        </div>
      `
    };

    // Send auto-reply to user
    const userMailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Thank You for Contacting Mechtron Global',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2D7A8E 0%, #0a2f47 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Mechtron Global</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Advanced BIM Solutions</p>
          </div>
          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #2D7A8E; margin-top: 0;">Thank You, ${name}!</h2>
            <p style="line-height: 1.6; color: #333;">
              We've received your inquiry about our <strong>${service}</strong> services. 
              Our team will review your message and get back to you within 24 hours.
            </p>
            <p style="line-height: 1.6; color: #333;">
              In the meantime, feel free to explore our portfolio and learn more about 
              our BIM services on our website.
            </p>
            <div style="background-color: white; padding: 20px; margin: 20px 0; border-left: 4px solid #E67E4D; border-radius: 4px;">
              <p style="margin: 0; color: #666;"><strong>Your Message:</strong></p>
              <p style="margin: 10px 0 0 0; color: #333;">${message}</p>
            </div>
            <p style="line-height: 1.6; color: #333;">
              <strong>Best regards,</strong><br/>
              The Mechtron Global Team
            </p>
          </div>
          <div style="background-color: #1F2121; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
            <p style="margin: 0; font-size: 14px; opacity: 0.8;">
              © ${new Date().getFullYear()} Mechtron Global. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    // Send emails
    try {
      await transporter.sendMail(adminMailOptions);
      await transporter.sendMail(userMailOptions);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the request if email fails - inquiry is still saved
    }

    res.json({ 
      success: true, 
      message: 'Inquiry submitted successfully. We\'ll contact you within 24 hours.' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to submit inquiry. Please try again later.' 
    });
  }
});

// Get all inquiries (admin route - protected)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const { status, priority } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const inquiries = await Inquiry.find(filter)
      .populate('respondedBy', 'username email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: inquiries });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch inquiries' 
    });
  }
});

// Get single inquiry by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('respondedBy', 'username email');
    
    if (!inquiry) {
      return res.status(404).json({ 
        success: false,
        error: 'Inquiry not found' 
      });
    }
    
    res.json({ success: true, data: inquiry });
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch inquiry' 
    });
  }
});

// Update inquiry (status, priority, response)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { status, priority, response } = req.body;
    const updateData = {};
    
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (response) {
      updateData.response = response;
      updateData.respondedAt = new Date();
      updateData.respondedBy = req.user.id;
    }
    
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('respondedBy', 'username email');
    
    if (!inquiry) {
      return res.status(404).json({ 
        success: false,
        error: 'Inquiry not found' 
      });
    }
    
    res.json({ success: true, data: inquiry });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update inquiry' 
    });
  }
});

// Export inquiries as CSV with enhanced data
router.get('/export/csv', authenticateToken, async (req, res) => {
  try {
    const { status, priority, startDate, endDate } = req.query;
    const filter = {};
    
    // Apply filters if provided
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    
    const inquiries = await Inquiry.find(filter)
      .populate('respondedBy', 'username email')
      .sort({ createdAt: -1 });
    
    // Enhanced CSV with more fields
    const escapeCSV = (str) => {
      if (!str) return '';
      return `"${String(str).replace(/"/g, '""')}"`;
    };
    
    const csv = [
      ['ID', 'Name', 'Email', 'Phone', 'Company', 'Service', 'Status', 'Priority', 'Message', 'Response', 'Responded By', 'Responded At', 'Created At'].join(','),
      ...inquiries.map(inquiry => [
        escapeCSV(inquiry._id),
        escapeCSV(inquiry.name),
        escapeCSV(inquiry.email),
        escapeCSV(inquiry.phone),
        escapeCSV(inquiry.company),
        escapeCSV(inquiry.service),
        escapeCSV(inquiry.status),
        escapeCSV(inquiry.priority),
        escapeCSV(inquiry.message),
        escapeCSV(inquiry.response),
        escapeCSV(inquiry.respondedBy?.username),
        inquiry.respondedAt ? new Date(inquiry.respondedAt).toISOString() : '',
        new Date(inquiry.createdAt).toISOString()
      ].join(','))
    ].join('\n');
    
    // Generate filename with date range if filtered
    let filename = 'inquiries';
    if (startDate || endDate) {
      filename += `_${startDate || 'all'}_to_${endDate || 'now'}`;
    }
    filename += `_${new Date().toISOString().split('T')[0]}.csv`;
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send('\ufeff' + csv); // Add BOM for Excel UTF-8 support
  } catch (error) {
    console.error('Error exporting inquiries:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to export inquiries' 
    });
  }
});

module.exports = router;
