import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaCogs, FaList, FaQuoteRight, FaFolderOpen, FaInbox, FaSignOutAlt, FaHome } from 'react-icons/fa';

const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg transition ${
      isActive ? 'bg-primary-dark text-white' : 'text-gray-700 hover:bg-gray-100'
    }`;

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaHome className="text-primary-dark" />
            <span className="font-bold text-primary-dark">Admin Dashboard</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-800"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-3">
          <nav className="bg-white rounded-lg shadow-sm p-4 space-y-1">
            <NavLink to="/admin" className={navLinkClass} end>
              <FaHome /> Overview
            </NavLink>
            <NavLink to="/admin/projects" className={navLinkClass}>
              <FaFolderOpen /> Projects
            </NavLink>
            <NavLink to="/admin/testimonials" className={navLinkClass}>
              <FaQuoteRight /> Testimonials
            </NavLink>
            <NavLink to="/admin/inquiries" className={navLinkClass}>
              <FaInbox /> Inquiries
            </NavLink>
            <NavLink to="/admin/services" className={navLinkClass}>
              <FaList /> Services
            </NavLink>
            <NavLink to="/admin/settings" className={navLinkClass}>
              <FaCogs /> Settings
            </NavLink>
          </nav>
        </aside>

        <main className="lg:col-span-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
