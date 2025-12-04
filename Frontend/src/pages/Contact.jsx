import { useEffect, useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import { submitContactForm } from '../utils/api';
import SEO from '../components/SEO';
import siteConfig from '../config/siteConfig';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: 'BIM Modeling',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ type: '', message: '', visible: false });

  useEffect(() => {
    let timer;
    if (toast.visible) {
      timer = setTimeout(() => setToast({ type: '', message: '', visible: false }), 4000);
    }
    return () => clearTimeout(timer);
  }, [toast.visible]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic client-side validation
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!formData.name || formData.name.trim().length < 2) {
      setLoading(false);
      setError('Please enter your full name.');
      setToast({ type: 'error', message: 'Please enter your full name.', visible: true });
      return;
    }
    if (!emailRe.test(formData.email)) {
      setLoading(false);
      setError('Please enter a valid email address.');
      setToast({ type: 'error', message: 'Please enter a valid email address.', visible: true });
      return;
    }
    if (!formData.message || formData.message.trim().length < 10) {
      setLoading(false);
      setError('Please provide project details (at least 10 characters).');
      setToast({ type: 'error', message: 'Please provide more project details.', visible: true });
      return;
    }

    // TODO: re-enable reCAPTCHA when production keys are ready
    const recaptchaToken = null;

    try {
      const response = await submitContactForm({ ...formData, recaptchaToken });
      
      if (response.success) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          service: 'BIM Modeling',
          message: ''
        });

        setToast({ type: 'success', message: 'Message sent successfully! We will reply within 24 hours.', visible: true });

        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit form. Please try again.');
      setToast({ type: 'error', message: 'Failed to submit. Please try again.', visible: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SEO
        title={`Contact \u2014 ${siteConfig.siteName}`}
        description={`Contact ${siteConfig.siteName} for BIM services, quotes, and consultations. We typically respond within 24 hours.`}
        url={siteConfig.getFullUrl('/contact')}
      />
      {/* Toast */}
      {toast.visible && (
        <div className={`fixed bottom-6 right-6 z-50 rounded-lg shadow-lg px-4 py-3 text-sm md:text-base border ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {toast.message}
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary to-[#0a2f47] text-white">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-white text-opacity-90 max-w-3xl mx-auto">
            Let's discuss how we can help optimize your next BIM project
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-light">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-secondary">
                Get In Touch
              </h2>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Have a question about our BIM services? Need a quote for your project? 
                Our team is here to help. Fill out the form or reach us directly using 
                the contact information below.
              </p>

              {/* Contact Details */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <FaEnvelope size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary mb-1">Email</h3>
                    <p className="text-gray-600">{siteConfig.contact.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <FaPhone size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary mb-1">Phone</h3>
                    <p className="text-gray-600">{siteConfig.contact.phone}</p>
                    {siteConfig.contact.phoneSecondary && (
                      <p className="text-gray-600">{siteConfig.contact.phoneSecondary}</p>
                    )}
                    <p className="text-gray-600 text-sm mt-1">Available Mon-Sat 9AM-6PM IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <FaMapMarkerAlt size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary mb-1">Office</h3>
                    <p className="text-gray-600">{siteConfig.contact.address}</p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
                <h3 className="font-semibold text-secondary mb-4">Business Hours</h3>
                <div className="space-y-2 text-gray-600">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 2:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>

              {/* Lead Magnet */}
              <div className="mt-8 p-6 bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-xl shadow-inner">
                <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
                  Free resource
                </p>
                <h3 className="text-2xl font-bold text-secondary mb-3">
                  BIM Coordination Checklist
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  Download our step-by-step checklist to prepare drawings and models before engaging our coordination team. Share it with your architects, MEP consultants, or PMs to streamline onboarding.
                </p>
                <a
                  href="/docs/bim-coordination-checklist.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
                >
                  Download PDF
                </a>
                <p className="text-xs text-gray-500 mt-2">
                  No email required — just a free resource for your team.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-secondary">
                Send Us a Message
              </h2>

              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-green-800 font-semibold">Message sent successfully!</p>
                    <p className="text-green-700 text-sm">We'll get back to you within 24 hours.</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Your Company Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Service Interest *
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option>BIM Modeling</option>
                    <option>MEP Coordination</option>
                    <option>Clash Detection</option>
                    <option>3D Visualization</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Project Details *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Tell us about your project requirements..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-[#d4613a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Inquiry'}
                </button>
                <p className="mt-2 text-xs text-gray-500 text-center">
                  We typically respond within 24 hours on business days.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-white">
        <div className="container-custom py-12">
          <h2 className="text-3xl font-bold mb-6 text-secondary text-center">
            Visit Our Office
          </h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Located in Pune, Maharashtra, we're easily accessible and ready to meet in person for consultations.
          </p>
          
          {/* Interactive Map */}
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.0334795744434!2d73.80842047465545!3d18.662493564824725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b9b394eba699%3A0x6a80b11d4bd28080!2sVivesta%20Purnanagar!5e0!3m2!1sen!2sin!4v1764705953361!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="KataVerse BIM Services Office Location"
              className="w-full"
            ></iframe>
          </div>



          {/* Location Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-xl text-center">
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                🚗
              </div>
              <h3 className="font-bold text-secondary mb-2">Parking Available</h3>
              <p className="text-gray-600 text-sm">Free visitor parking on-site</p>
            </div>

            <div className="bg-gradient-to-br from-accent/5 to-accent/10 p-6 rounded-xl text-center">
              <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                🚇
              </div>
              <h3 className="font-bold text-secondary mb-2">Public Transit</h3>
              <p className="text-gray-600 text-sm">5 min walk from Main Station</p>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-xl text-center">
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                ☕
              </div>
              <h3 className="font-bold text-secondary mb-2">Meeting Space</h3>
              <p className="text-gray-600 text-sm">Conference rooms available</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
