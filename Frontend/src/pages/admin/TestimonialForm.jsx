import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createTestimonial } from '../../utils/api';
import { useToast } from '../../components/ui/ToastProvider';

export default function TestimonialForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    quote: '',
    author: '',
    role: '',
    company: '',
    rating: 5,
    featured: false,
    photo: '',
  });

  useEffect(() => {
    if (isEdit) {
      loadTestimonial();
    }
  }, [id]);

  const loadTestimonial = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/testimonials/${id}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      const t = data.data;
      setFormData({
        quote: t.quote || '',
        author: t.author || '',
        role: t.role || '',
        company: t.company || '',
        rating: t.rating || 5,
        featured: t.featured || false,
        photo: t.photo || '',
      });
    } catch (err) {
      toast.error(err.message || 'Failed to load testimonial');
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (file) => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/upload/single`, {
      method: 'POST',
      body: form,
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Upload failed');
    return data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        quote: formData.quote.trim(),
        author: formData.author.trim(),
        role: formData.role.trim(),
        company: formData.company.trim(),
        rating: Number(formData.rating),
        featured: formData.featured,
        photo: formData.photo || undefined,
      };

      if (isEdit) {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/testimonials/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Update failed');
        toast.success('Testimonial updated successfully');
        setTimeout(() => navigate('/admin/testimonials'), 1500);
      } else {
        const res = await createTestimonial(payload);
        if (!res.success) throw new Error(res.error || 'Create failed');
        toast.success('Testimonial created successfully');
        setTimeout(() => navigate('/admin/testimonials'), 1500);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save testimonial');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadPhoto(file);
      setFormData((prev) => ({ ...prev, photo: url }));
      toast.success('Photo uploaded');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light py-8">
      <div className="container-custom max-w-4xl">
        <h1 className="text-3xl font-bold text-secondary mb-6">
          {isEdit ? 'Edit Testimonial' : 'Create New Testimonial'}
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8 space-y-6">
          {/* Quote */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quote <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Author */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Author <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Rating (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Photo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={uploading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {uploading && <p className="text-sm text-gray-600 mt-2">Uploading...</p>}
            {formData.photo && (
              <div className="mt-4">
                <img src={formData.photo} alt="Testimonial" className="w-24 h-24 object-cover rounded-full border" />
              </div>
            )}
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3">
            <input
              id="featured"
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-5 h-5 text-primary"
            />
            <label htmlFor="featured" className="text-sm font-semibold text-gray-700">
              Featured Testimonial
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || uploading}
              className="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent/90 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Testimonial' : 'Create Testimonial'}
            </button>
            <Link
              to="/admin/testimonials"
              className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
