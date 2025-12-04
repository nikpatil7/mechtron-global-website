import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = 'unset';
    }, 2000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900"
          style={{ willChange: 'opacity' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-teal-900/20" />

          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-32 h-32 md:w-40 md:h-40">
                <img 
                  src="/images/kataverse-logo.jpg" 
                  alt="KataVerse BIM Services" 
                  className="w-full h-full object-contain rounded-2xl shadow-2xl" 
                />
              </div>
            </motion.div>

            {/* Company name */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="text-center"
            >
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                KataVerse BIM Services
              </h1>
              <p className="text-gray-400 text-sm md:text-base">
                Building Virtually and Visually
              </p>
            </motion.div>

            {/* Modern dot wave loader */}
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4].map((index) => (
                <motion.div
                  key={index}
                  className="w-3 h-3 bg-blue-500 rounded-full"
                  animate={{
                    y: [0, -20, 0],
                    backgroundColor: ['#3b82f6', '#14b8a6', '#3b82f6'],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: index * 0.1,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
