import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { getProjects } from '../../utils/api';
import { useToast } from '../../components/ui/ToastProvider';
import { useConfirm } from '../../components/ui/ConfirmDialog';
import DataTable from '../../components/ui/DataTable';

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const toast = useToast();
  const { ask, Dialog } = useConfirm();

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await getProjects(filter === 'All' ? null : filter);
      setProjects(res.data || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (project) => {
    const confirmed = await ask({
      title: 'Delete Project',
      message: `Are you sure you want to delete "${project.title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });
    if (!confirmed) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/projects/${project._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProjects(projects.filter((p) => p._id !== project._id));
        toast.success('Project deleted successfully');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete project');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete project');
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (project) => (
        <div>
          <div className="font-medium text-secondary">{project.title}</div>
          <div className="text-sm text-gray-500">{project.slug}</div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      width: '150px',
      render: (project) => (
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {project.category}
        </span>
      ),
    },
    {
      key: 'featured',
      label: 'Featured',
      width: '120px',
      render: (project) =>
        project.featured ? (
          <span className="text-accent font-semibold">⭐ Featured</span>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      width: '140px',
      render: (project) => (
        <span className="text-sm text-gray-600">
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: 'View',
      variant: 'view',
      to: (project) => `/projects/${project.slug || project._id}`,
    },
    {
      label: 'Edit',
      variant: 'edit',
      to: (project) => `/admin/projects/edit/${project._id}`,
    },
    {
      label: 'Delete',
      variant: 'delete',
      onClick: handleDelete,
    },
  ];

  const filterOptions = {
    options: [
      { label: 'All', value: 'All' },
      { label: 'Commercial', value: 'Commercial' },
      { label: 'Residential', value: 'Residential' },
      { label: 'High-Rise', value: 'High-Rise' },
      { label: 'Kitchen', value: 'Kitchen' },
      { label: 'Industrial', value: 'Industrial' },
      { label: 'Educational', value: 'Educational' },
    ],
    value: filter,
    onChange: setFilter,
  };

  return (
    <div className="min-h-screen bg-light py-8">
      <div className="container-custom max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-secondary">Projects</h1>
          <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition"
          >
            <FaPlus /> New Project
          </Link>
        </div>

        <DataTable
          data={projects}
          columns={columns}
          actions={actions}
          filters={filterOptions}
          loading={loading}
          emptyMessage="No projects found"
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
