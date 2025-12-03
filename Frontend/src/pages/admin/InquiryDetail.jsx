import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEnvelope, FaPhone, FaBuilding, FaClock } from 'react-icons/fa';
import api from '../../utils/api';

const InquiryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInquiry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchInquiry = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/contact/${id}`);
      const data = res.data.data;
      setInquiry(data);
      setStatus(data.status);
      setPriority(data.priority);
      setResponse(data.response || '');
    } catch (error) {
      console.error('Error fetching inquiry:', error);
      alert('Failed to fetch inquiry details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setSubmitting(true);
      await api.put(`/api/contact/${id}`, {
        status,
        priority,
        response: response || undefined
      });
      alert('Inquiry updated successfully');
      fetchInquiry(); // Refresh data
    } catch (error) {
      console.error('Error updating inquiry:', error);
      alert('Failed to update inquiry');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-primary-dark text-xl">Loading inquiry details...</div>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-xl">Inquiry not found</div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusColors = {
      new: 'bg-blue-100 text-blue-800',
      responded: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityBadge = (priority) => {
    const priorityColors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return priorityColors[priority] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/inquiries')}
            className="flex items-center gap-2 text-primary-dark hover:text-accent mb-4"
          >
            <FaArrowLeft />
            Back to Inquiries
          </button>
          <h1 className="text-3xl font-bold text-primary-dark">Inquiry Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-primary-dark mb-4">Customer Information</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary-dark/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-dark font-bold">
                      {inquiry.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{inquiry.name}</p>
                    {inquiry.company && (
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FaBuilding className="text-xs" />
                        {inquiry.company}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <FaEnvelope className="text-gray-400" />
                  <a href={`mailto:${inquiry.email}`} className="hover:text-accent">
                    {inquiry.email}
                  </a>
                </div>
                {inquiry.phone && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaPhone className="text-gray-400" />
                    <a href={`tel:${inquiry.phone}`} className="hover:text-accent">
                      {inquiry.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Message */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-primary-dark mb-4">Message</h2>
              <div className="mb-4">
                <span className="text-sm text-gray-500">Service Interest:</span>
                <span className="ml-2 font-medium text-gray-900">{inquiry.service}</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{inquiry.message}</p>
              </div>
            </div>

            {/* Response Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-primary-dark mb-4">Your Response</h2>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Type your response here..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
              />
              {inquiry.respondedAt && (
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                  <FaClock />
                  <span>
                    Last responded on {new Date(inquiry.respondedAt).toLocaleString()}
                    {inquiry.respondedBy && ` by ${inquiry.respondedBy.username}`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Priority */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-primary-dark mb-4">Status & Priority</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="new">New</option>
                    <option value="responded">Responded</option>
                    <option value="archived">Archived</option>
                  </select>
                  <div className="mt-2">
                    <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusBadge(status)}`}>
                      {status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  <div className="mt-2">
                    <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getPriorityBadge(priority)}`}>
                      {priority}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-primary-dark mb-4">Metadata</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Created:</span>
                  <p className="font-medium text-gray-900">
                    {new Date(inquiry.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Last Updated:</span>
                  <p className="font-medium text-gray-900">
                    {new Date(inquiry.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Update Button */}
            <button
              onClick={handleUpdate}
              disabled={submitting}
              className="w-full bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {submitting ? 'Updating...' : 'Update Inquiry'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryDetail;
