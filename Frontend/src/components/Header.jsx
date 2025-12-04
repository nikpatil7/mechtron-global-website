import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaShieldAlt } from 'react-icons/fa';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
  ];
  const showAdminLink = true;

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100">
      <nav className="container-custom py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="/images/kataverse-logo.jpg" 
              alt="KataVerse BIM Services" 
              className="w-11 h-11 rounded-xl shadow-lg group-hover:scale-110 transition-transform object-cover"
            />
            <span className="text-xl font-bold text-secondary hidden sm:block group-hover:text-primary transition-colors">
              KataVerse BIM Services
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold transition-all duration-300 hover:text-primary relative group ${
                  isActive(link.path)
                    ? 'text-primary'
                    : 'text-gray-600'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                  isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            ))}
            {showAdminLink && (
              <div className="relative group">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary transition-colors"
                >
                  <FaShieldAlt className="opacity-70" />
                  Admin
                </Link>
                <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 text-white text-xs px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Admin Dashboard
                </div>
              </div>
            )}
            <Link
              to="/contact"
              className="bg-gradient-to-r from-accent to-accent/90 text-white px-7 py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/30 hover:scale-105 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl text-secondary hover:text-primary transition-colors"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block py-2 text-base font-medium transition-colors ${
                  isActive(link.path) ? 'text-primary' : 'text-gray-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {showAdminLink && (
              <div className="relative group">
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-base font-medium text-gray-600 hover:text-primary transition-colors"
                >
                  <span className="inline-flex items-center gap-2"><FaShieldAlt className="opacity-70" /> Admin</span>
                </Link>
                <div className="pointer-events-none absolute -bottom-8 left-0 whitespace-nowrap rounded-md bg-black/80 text-white text-xs px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Admin Dashboard
                </div>
              </div>
            )}
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="block mt-4 bg-primary text-white px-6 py-2 rounded-lg font-semibold text-center hover:bg-[#246273]"
            >
              Contact Us
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
