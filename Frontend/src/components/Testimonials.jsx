import { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { getTestimonials } from '../utils/api';
import { AnimatePresence, motion } from 'framer-motion';
import FadeIn from './animations/FadeIn';
import { TestimonialSkeleton } from './ui/Skeleton';

export default function Testimonials() {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await getTestimonials();
        setItems(res.data || []);
        setCurrentIndex(0);
      } catch (e) {
        setError(e.response?.data?.error || 'Failed to load testimonials');
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // Auto-rotation timer (5 seconds)
  useEffect(() => {
    if (!items.length || isPaused) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [items.length, isPaused]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % (items.length || 1));
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000); // Resume after 10s
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + (items.length || 1)) % (items.length || 1));
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000); // Resume after 10s
  };

  const current = items[currentIndex];

  return (
    <section className="section-padding bg-gradient-to-b from-light to-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <FadeIn className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-semibold mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Trusted by leading construction firms and architects worldwide
          </p>
        </FadeIn>

        {/* Status Messages */}
        {error && (
          <div className="max-w-3xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
            {error}
          </div>
        )}
        {loading && (
          <div className="max-w-5xl mx-auto">
            <TestimonialSkeleton />
          </div>
        )}

        {/* Testimonial Card with AnimatePresence */}
        <div 
          className="max-w-5xl mx-auto min-h-[400px] relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            {current && (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -100, scale: 0.95 }}
                transition={{ 
                  duration: 0.5,
                  ease: [0.4, 0.0, 0.2, 1]
                }}
                className="bg-gradient-to-br from-white to-gray-50 p-10 md:p-14 rounded-2xl shadow-2xl border border-gray-200 relative overflow-hidden"
              >
                {/* Decorative Quote Mark */}
                <motion.div 
                  className="absolute top-6 left-6 text-8xl text-accent/10 font-serif leading-none"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  "
                </motion.div>
                
                {/* Rating */}
                <motion.div 
                  className="flex justify-center gap-1.5 mb-8 relative z-10"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {Array.from({ length: current.rating || 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        delay: 0.4 + i * 0.1,
                        type: "spring",
                        stiffness: 300
                      }}
                    >
                      <FaStar className="text-accent text-xl" />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Quote */}
                <motion.p 
                  className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-10 text-center relative z-10 font-medium"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  "{current.comment || current.quote}"
                </motion.p>

                {/* Author Info with Enhanced Layout */}
                <motion.div 
                  className="flex flex-col md:flex-row items-center justify-center gap-6 relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {/* Author Photo Placeholder */}
                  <motion.div 
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {(current.author || current.name)?.charAt(0)}
                  </motion.div>
                  
                  {/* Author Details */}
                  <div className="text-center md:text-left">
                    <p className="font-bold text-xl text-secondary mb-1">
                      {current.name || current.author}
                    </p>
                    <p className="text-gray-600 text-sm mb-2">
                      {current.role}
                    </p>
                    {current.company && (
                      <p className="text-primary text-sm font-semibold">
                        {current.company}
                      </p>
                    )}
                  </div>
                  
                  {/* Company Logo Placeholder */}
                  {current.company && (
                    <div className="hidden md:block ml-auto px-6 py-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Client</p>
                      <p className="text-sm font-bold text-secondary">{current.company}</p>
                    </div>
                  )}
                </motion.div>
                
                {/* Decorative Bottom Element */}
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-accent/5 to-transparent rounded-tl-full"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <motion.div 
          className="flex justify-center items-center gap-6 mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            onClick={prevTestimonial}
            className="w-12 h-12 rounded-full bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-md font-bold text-lg"
            aria-label="Previous testimonial"
            whileHover={{ scale: 1.1, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            ←
          </motion.button>

          {/* Dots */}
          <div className="flex gap-2.5">
            {items.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsPaused(true);
                  setTimeout(() => setIsPaused(false), 10000);
                }}
                className={`h-2.5 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-10 bg-gradient-to-r from-primary to-accent'
                    : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          <motion.button
            onClick={nextTestimonial}
            className="w-12 h-12 rounded-full bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-md font-bold text-lg"
            aria-label="Next testimonial"
            whileHover={{ scale: 1.1, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
