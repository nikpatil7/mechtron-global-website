import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaStar } from 'react-icons/fa';
import { getTestimonials } from '../../utils/api';
import { useToast } from '../../components/ui/ToastProvider';
import { useConfirm } from '../../components/ui/ConfirmDialog';
import DataTable from '../../components/ui/DataTable';

export default function TestimonialsList() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { ask, Dialog } = useConfirm();

  useEffect(() => {
    loadTestimonials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const res = await getTestimonials();
      setTestimonials(res.data || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (testimonial) => {
    const confirmed = await ask({
      title: 'Delete Testimonial',
      message: `Are you sure you want to delete the testimonial from "${testimonial.author}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });
    if (!confirmed) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/testimonials/${testimonial._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setTestimonials(testimonials.filter((t) => t._id !== testimonial._id));
        toast.success('Testimonial deleted successfully');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete testimonial');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete testimonial');
    }
  };

  const columns = [
    {
      key: 'author',
      label: 'Author',
      render: (testimonial) => (
        <div>
          <div className="font-medium text-secondary">{testimonial.author}</div>
          <div className="text-sm text-gray-500">{testimonial.role}</div>
        </div>
      ),
    },
    {
      key: 'company',
      label: 'Company',
      render: (testimonial) => (
        <span className="text-gray-700">{testimonial.company}</span>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      width: '120px',
      render: (testimonial) => (
        <div className="flex items-center gap-1 text-accent">
          {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
            <FaStar key={i} size={14} />
          ))}
        </div>
      ),
    },
    {
      key: 'featured',
      label: 'Featured',
      width: '120px',
      render: (testimonial) =>
        testimonial.featured ? (
          <span className="text-accent font-semibold">⭐ Featured</span>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      width: '140px',
      render: (testimonial) => (
        <span className="text-sm text-gray-600">
          {new Date(testimonial.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: 'Edit',
      variant: 'edit',
      to: (testimonial) => `/admin/testimonials/edit/${testimonial._id}`,
    },
    {
      label: 'Delete',
      variant: 'delete',
      onClick: handleDelete,
    },
  ];

  return (
    <div className="min-h-screen bg-light py-8">
      <div className="container-custom max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-secondary">Testimonials</h1>
          <Link
            to="/admin/testimonials/new"
            className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition"
          >
            <FaPlus /> New Testimonial
          </Link>
        </div>

        <DataTable
          data={testimonials}
          columns={columns}
          actions={actions}
          loading={loading}
          emptyMessage="No testimonials found"
        />

        <div className="mt-6">
          <Link to="/admin" className="text-primary hover:underline">
            ← Back to Admin Dashboard
          </Link>
        </div>
      </div>
      {Dialog}
    </div>
  );
}
