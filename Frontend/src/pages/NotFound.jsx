import { Link } from 'react-router-dom';
import { FaHome, FaProjectDiagram, FaEnvelope, FaExclamationTriangle } from 'react-icons/fa';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-primary to-[#0a2f47] text-white flex items-center justify-center px-4">
      <SEO
        title="404 - Page Not Found — Mechtron Global"
        description="The page you're looking for doesn't exist."
      />
      
      <div className="text-center max-w-2xl">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="inline-flex items-center justify-center w-32 h-32 bg-accent/20 rounded-full mb-8"
        >
          <FaExclamationTriangle className="text-accent text-6xl" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-8xl md:text-9xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-300"
        >
          404
        </motion.h1>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold mb-6"
        >
          Page Not Found
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-gray-300 mb-12"
        >
          Oops! The page you're looking for seems to have wandered off into the BIM cloud. 
          Let's get you back on track.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-all shadow-lg hover:shadow-xl"
          >
            <FaHome />
            Go Home
          </Link>
          
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
          >
            <FaProjectDiagram />
            View Projects
          </Link>
          
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
          >
            <FaEnvelope />
            Contact Us
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 pt-12 border-t border-white/10"
        >
          <p className="text-sm text-gray-400 mb-4">Popular Pages:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/about" className="text-sm text-accent hover:underline">About Us</Link>
            <span className="text-gray-600">•</span>
            <Link to="/services" className="text-sm text-accent hover:underline">Services</Link>
            <span className="text-gray-600">•</span>
            <Link to="/projects" className="text-sm text-accent hover:underline">Portfolio</Link>
            <span className="text-gray-600">•</span>
            <Link to="/contact" className="text-sm text-accent hover:underline">Get in Touch</Link>
          </div>
        </motion.div>
      </div>

      {/* Floating Shapes Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-72 h-72 bg-accent opacity-10 rounded-full mix-blend-multiply filter blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-primary opacity-10 rounded-full mix-blend-multiply filter blur-3xl"
        />
      </div>
    </div>
  );
}
