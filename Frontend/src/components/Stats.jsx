import { FaCheckCircle, FaUsers, FaAward, FaHandshake } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import StaggerContainer, { StaggerItem } from './animations/StaggerContainer';

const stats = [
  { icon: <FaCheckCircle />, number: 150, suffix: '+', label: 'Projects Completed' },
  { icon: <FaAward />, number: 8, suffix: '+', label: 'Years Experience' },
  { icon: <FaUsers />, number: 25, suffix: '+', label: 'Team Members' },
  { icon: <FaHandshake />, number: 98, suffix: '%', label: 'Client Satisfaction' }
];

// Animated Counter Component
function AnimatedCounter({ value, suffix }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
  });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(Math.floor(latest));
    });
    return unsubscribe;
  }, [springValue]);

  return (
    <span ref={ref}>
      {displayValue}{suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="section-padding bg-gradient-to-br from-primary via-[#0a2f47] to-secondary text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          className="absolute top-0 left-1/4 w-64 h-64 bg-accent rounded-full filter blur-3xl"
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full filter blur-3xl"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container-custom relative z-10">
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <StaggerItem key={index}>
              <motion.div 
                className="text-center group cursor-default"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Icon with animated background */}
                <motion.div 
                  className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-white/10 backdrop-blur-sm rounded-2xl text-accent text-3xl border border-white/20"
                  whileHover={{ 
                    backgroundColor: "rgba(255,255,255,0.2)",
                    rotate: [0, -10, 10, -10, 0],
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {stat.icon}
                </motion.div>
                
                {/* Animated Number */}
                <div className="text-4xl md:text-5xl font-bold mb-2 text-white">
                  <AnimatedCounter value={stat.number} suffix={stat.suffix} />
                </div>
                
                {/* Label */}
                <div className="text-sm md:text-base text-gray-200 font-medium">
                  {stat.label}
                </div>
                
                {/* Decorative underline */}
                <motion.div 
                  className="h-1 bg-accent rounded-full mx-auto mt-3"
                  initial={{ width: "3rem" }}
                  whileHover={{ width: "4rem" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
