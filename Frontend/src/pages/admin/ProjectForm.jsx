import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getProjectById, createProject } from '../../utils/api';
import { useToast } from '../../components/ui/ToastProvider';

const CATEGORIES = ['Commercial', 'Residential', 'High-Rise', 'Kitchen', 'Industrial', 'Educational'];

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Commercial',
    description: '',
    tags: '',
    metrics: '',
    clientName: '',
    clientTestimonial: '',
    clientRating: 5,
    featured: false,
    images: [],
    caseStudyUrl: '',
  });

  useEffect(() => {
    if (isEdit) {
      loadProject();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const res = await getProjectById(id);
      const proj = res.data;
      setFormData({
        title: proj.title || '',
        category: proj.category || 'Commercial',
        description: proj.description || '',
        tags: proj.tags ? proj.tags.join(', ') : '',
        metrics: proj.metrics ? JSON.stringify(proj.metrics, null, 2) : '',
        clientName: proj.client?.name || '',
        clientTestimonial: proj.client?.testimonial || '',
        clientRating: proj.client?.rating || 5,
        featured: proj.featured || false,
        images: proj.images || [],
        caseStudyUrl: proj.caseStudyUrl || '',
      });
    } catch (err) {
      toast.error(err.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async (files) => {
    const form = new FormData();
    for (const f of files) form.append('files', f);
    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
    const res = await fetch(`${apiBase}/api/upload/multiple`, {
      method: 'POST',
      body: form,
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(errorData.error || errorData.message || `Upload failed: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Upload failed');
    return data.urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let metricsObj = undefined;
      if (formData.metrics.trim()) {
        try {
          metricsObj = JSON.parse(formData.metrics);
        } catch {
          throw new Error('Metrics must be valid JSON');
        }
      }

      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        metrics: metricsObj,
        images: formData.images,
        client: {
          name: formData.clientName.trim() || undefined,
          testimonial: formData.clientTestimonial.trim() || undefined,
          rating: Number(formData.clientRating),
        },
        featured: formData.featured,
        caseStudyUrl: formData.caseStudyUrl.trim() || undefined,
      };

      if (isEdit) {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/projects/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Update failed');
        toast.success('Project updated successfully');
        setTimeout(() => navigate('/admin/projects'), 1500);
      } else {
        const res = await createProject(payload);
        if (!res.success) throw new Error(res.error || 'Create failed');
        toast.success('Project created successfully');
        setTimeout(() => navigate('/admin/projects'), 1500);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    try {
      setUploading(true);
      const urls = await uploadImages(files);
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
      toast.success(`Uploaded ${urls.length} image(s)`);
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-light py-8">
      <div className="container-custom max-w-4xl">
        <h1 className="text-3xl font-bold text-secondary mb-6">
          {isEdit ? 'Edit Project' : 'Create New Project'}
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="BIM, MEP, Coordination"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Metrics */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Metrics (JSON)</label>
            <textarea
              value={formData.metrics}
              onChange={(e) => setFormData({ ...formData, metrics: e.target.value })}
              rows={4}
              placeholder='{"floors": "45", "timeline": "18 months"}'
              className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {uploading && <p className="text-sm text-gray-600 mt-2">Uploading...</p>}
            {formData.images.length > 0 && (
              <div className="flex gap-3 flex-wrap mt-4">
                {formData.images.map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} alt={`Upload ${i + 1}`} className="w-24 h-24 object-cover rounded-lg border" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Case Study URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Case Study / PDF URL
            </label>
            <input
              type="url"
              value={formData.caseStudyUrl}
              onChange={(e) => setFormData({ ...formData, caseStudyUrl: e.target.value })}
              placeholder="https://example.com/case-study.pdf"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional link to a downloadable PDF or detailed case study.
            </p>
          </div>

          {/* Client Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Client Name</label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Client Rating (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={formData.clientRating}
                onChange={(e) => setFormData({ ...formData, clientRating: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Client Testimonial */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Client Testimonial</label>
            <textarea
              value={formData.clientTestimonial}
              onChange={(e) => setFormData({ ...formData, clientTestimonial: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
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
              Featured Project
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || uploading}
              className="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent/90 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}
            </button>
            <Link
              to="/admin/projects"
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
