import { Link } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaFacebook, FaEnvelope, FaPhone, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa';
import siteConfig from '../config/siteConfig';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-secondary via-[#1a1c1c] to-secondary text-white relative overflow-hidden">
      {/* Decorative Top Border */}
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
      
      <div className="container-custom py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="/images/kataverse-logo.jpg" 
                alt="KataVerse BIM Services" 
                className="w-12 h-12 rounded-xl shadow-lg object-cover"
              />
              <span className="text-xl font-bold">{siteConfig.siteName}</span>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Your dedicated partner for advanced BIM solutions, specializing in MEPF disciplines. We empower engineers, contractors, and subcontractors to achieve superior project delivery.
            </p>
            <div className="flex gap-4">
              <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" 
                 className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary transition-all hover:scale-110">
                <FaLinkedin size={20} />
              </a>
              <a href={siteConfig.social.twitter} target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary transition-all hover:scale-110">
                <FaTwitter size={20} />
              </a>
              <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary transition-all hover:scale-110">
                <FaFacebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-accent">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white hover:pl-2 transition-all inline-block">
                  → Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white hover:pl-2 transition-all inline-block">
                  → About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-white hover:pl-2 transition-all inline-block">
                  → Services
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-400 hover:text-white hover:pl-2 transition-all inline-block">
                  → Projects
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white hover:pl-2 transition-all inline-block">
                  → Contact
                </Link>
              </li>
              <li className="relative group">
                <Link to="/admin" className="text-gray-400 hover:text-white hover:pl-2 transition-all inline-flex items-center gap-2">
                  → Admin <FaShieldAlt className="opacity-70" />
                </Link>
                <div className="pointer-events-none absolute -top-8 left-0 whitespace-nowrap rounded-md bg-black/80 text-white text-xs px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Admin Dashboard
                </div>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-accent">Our Services</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="hover:text-white transition-colors cursor-default">• MEPF Services</li>
              <li className="hover:text-white transition-colors cursor-default">• MEP Coordination</li>
              <li className="hover:text-white transition-colors cursor-default">• MEP Modeling</li>
              <li className="hover:text-white transition-colors cursor-default">• MEP Shop Drawings</li>
              <li className="hover:text-white transition-colors cursor-default">• Clash Detection</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-accent">Contact Us</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start gap-3 group hover:text-white transition-colors">
                <FaEnvelope className="mt-1 flex-shrink-0 text-accent" />
                <span>{siteConfig.contact.email}</span>
              </li>
              <li className="flex items-start gap-3 group hover:text-white transition-colors">
                <FaPhone className="mt-1 flex-shrink-0 text-accent" />
                <span>{siteConfig.contact.phone}</span>
              </li>
              <li className="flex items-start gap-3 group hover:text-white transition-colors">
                <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-accent" />
                <span>{siteConfig.contact.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} {siteConfig.siteName}. All rights reserved. | Built with precision and passion.</p>
        </div>
      </div>
      
      {/* Background Decoration */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl -z-0"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full filter blur-3xl -z-0"></div>
    </footer>
  );
}
