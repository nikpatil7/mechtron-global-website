import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaCheck, FaTimes } from 'react-icons/fa';
import { getServices } from '../../utils/api';
import api from '../../utils/api';
import { useToast } from '../../components/ui/ToastProvider';
import { useConfirm } from '../../components/ui/ConfirmDialog';
import DataTable from '../../components/ui/DataTable';

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const toast = useToast();
  const { ask, Dialog } = useConfirm();

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter === 'active') params.isActive = true;
      if (filter === 'inactive') params.isActive = false;
      if (filter === 'featured') params.featured = true;
      
      const response = await getServices(filter === 'all' ? {} : params);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      alert('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleDelete = async (service) => {
    const confirmed = await ask({
      title: 'Delete Service',
      message: `Are you sure you want to delete "${service.title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });
    if (!confirmed) return;

    try {
      await api.delete(`/api/services/${service._id}`);
      toast.success('Service deleted successfully');
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error(error.response?.data?.error || 'Failed to delete service');
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (service) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{service.title}</div>
          <div className="text-sm text-gray-500">{service.slug}</div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (service) => (
        <span className="text-sm text-gray-500">{service.category}</span>
      ),
    },
    {
      key: 'order',
      label: 'Order',
      width: '100px',
      render: (service) => (
        <span className="text-sm text-gray-900">{service.order}</span>
      ),
    },
    {
      key: 'isActive',
      label: 'Active',
      width: '100px',
      render: (service) =>
        service.isActive ? (
          <FaCheck className="text-green-600" />
        ) : (
          <FaTimes className="text-red-600" />
        ),
    },
    {
      key: 'featured',
      label: 'Featured',
      width: '100px',
      render: (service) =>
        service.featured ? (
          <FaCheck className="text-accent" />
        ) : (
          <FaTimes className="text-gray-400" />
        ),
    },
  ];

  const actions = [
    {
      label: 'Edit',
      variant: 'edit',
      to: (service) => `/admin/services/edit/${service._id}`,
    },
    {
      label: 'Delete',
      variant: 'delete',
      onClick: handleDelete,
    },
  ];

  const filterOptions = {
    options: [
      { label: 'All', value: 'all' },
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Featured', value: 'featured' },
    ],
    value: filter,
    onChange: setFilter,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-primary-dark text-xl">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary-dark">Services Management</h1>
            <p className="text-gray-600 mt-1">Manage your service offerings</p>
          </div>
          <button
            onClick={() => navigate('/admin/services/new')}
            className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition"
          >
            <FaPlus />
            Add Service
          </button>
        </div>

        {/* DataTable */}
        <DataTable
          data={services}
          columns={columns}
          actions={actions}
          filters={filterOptions}
          loading={false}
          emptyMessage="No services found"
        />
      </div>
      {Dialog}
    </div>
  );
};

export default ServicesList;
