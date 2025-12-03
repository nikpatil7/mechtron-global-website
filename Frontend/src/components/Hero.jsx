import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { motion as Motion } from 'framer-motion';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';

// Lazy-load heavy 3D component to keep initial bundle small
const ThreeHero = lazy(() => import('./ThreeHero'));

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050b16] text-white">
      {/* BIM imagery overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="w-full h-full opacity-20 md:opacity-30 mix-blend-screen"
          style={{
            backgroundImage: "url('/images/hero-bim.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050b16]/80 via-[#050b16]/90 to-[#050b16]" />
      </div>
      {/* Blueprint-style grid background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,#1f2937_1px,transparent_0)] bg-[length:32px_32px]" />
      </div>

      {/* Animated blueprint blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <Motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 -left-20 w-96 h-96 bg-cyan-500 opacity-10 rounded-full mix-blend-screen filter blur-3xl"
        />
        <Motion.div 
          animate={{ 
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 -right-20 w-96 h-96 bg-primary opacity-10 rounded-full mix-blend-screen filter blur-3xl"
        />
        <Motion.div 
          animate={{ 
            x: [0, -50, 0],
            y: [0, -100, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 left-1/3 w-96 h-96 bg-cyan-400 opacity-10 rounded-full mix-blend-screen filter blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="container-custom relative z-20 px-4 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-8 md:gap-12 items-center">
          {/* Left column: copy + CTAs + trust */}
          <div className="group mt-2 md:mt-4 text-center lg:text-left">
            {/* Badge */}
            <Motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-cyan-500/40 rounded-full px-4 py-2 mb-6 text-xs font-mono tracking-[0.3em] uppercase text-cyan-300"
            >
              <Motion.span 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-cyan-400 rounded-full"
              />
              <span>BIM / MEPF COORDINATION</span>
            </Motion.div>

            {/* Main Headline */}
            <Motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 leading-tight drop-shadow-[0_0_18px_rgba(0,0,0,0.9)] text-center lg:text-left text-slate-50 transition-transform duration-300 group-hover:translate-y-0.5"
            >
              <span className="inline-block">
                Advanced BIM Solutions
              </span>
              <br />
              <Motion.span 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-cyan-200"
              >
                for Modern Construction
              </Motion.span>
            </Motion.h1>

            {/* Underline accent */}
            <div className="h-1 w-16 bg-cyan-500 rounded-full mb-5 transition-all duration-300 group-hover:w-28 group-hover:bg-accent" />

            {/* Subheading */}
            <Motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm sm:text-base md:text-lg mb-8 text-gray-200 max-w-xl leading-relaxed mx-auto lg:mx-0"
            >
              Precision BIM Modeling • MEP Coordination • Clash Detection • 3D Visualization — helping contractors,
              architects, and MEP consultants prevent clashes and costly rework before construction begins.
            </Motion.p>

            {/* CTA Buttons */}
            <Motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 items-center lg:items-start justify-center lg:justify-start mb-8"
            >
              <Motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/contact"
                  className="px-8 py-3 bg-cyan-500 text-slate-950 font-semibold rounded-md border border-cyan-300/60 shadow-[0_0_0_1px_rgba(34,211,238,0.3)] hover:bg-cyan-400 transition-all inline-flex items-center justify-center gap-2 group"
                >
                  Get Free Consultation
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform text-slate-900" />
                </Link>
              </Motion.div>
              <Motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/projects"
                  className="px-8 py-3 border border-cyan-500/60 backdrop-blur-sm text-cyan-200 font-semibold rounded-md hover:bg-cyan-500/10 transition-all inline-flex items-center justify-center gap-2"
                >
                  View Portfolio
                </Link>
              </Motion.div>
            </Motion.div>

            {/* Trust Badges - Enhanced */}
            <Motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="pt-4 border-t border-cyan-500/30 max-w-md mx-auto lg:mx-0"
            >
              <p className="text-[11px] text-gray-400 mb-3 font-mono">
                ▲ 150+ projects coordinated · ▲ 8+ years BIM experience · ▲ 98% client satisfaction
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: '150+', label: 'Projects Completed' },
                  { value: '$20M+', label: 'Cost Savings' },
                  { value: '98%', label: 'Client Satisfaction' },
                  { value: '8+', label: 'Years Experience' }
                ].map((stat, index) => (
                  <Motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                    whileHover={{ y: -4, scale: 1.05, boxShadow: '0 10px 30px rgba(34,211,238,0.25)' }}
                    className="flex flex-col items-start gap-1 p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 cursor-pointer transition-colors duration-200 hover:bg-white/10"
                  >
                    <span className="text-[10px] uppercase tracking-wide text-cyan-300 mb-0.5">
                      {stat.label}
                    </span>
                    <span className="text-xl font-bold text-accent leading-none mb-1">
                      {stat.value}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Hover to explore related details below
                    </span>
                  </Motion.div>
                ))}
              </div>
            </Motion.div>
          </div>

          {/* Right column: BIM viewport with 3D preview */}
          <Motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="w-full max-w-sm sm:max-w-md lg:max-w-lg mt-10 lg:mt-0 mx-auto lg:mx-0 lg:justify-self-end transition-transform duration-300"
          >
            <div className="relative rounded-xl border border-cyan-500/40 bg-slate-900/60 p-4 shadow-[0_0_30px_rgba(8,47,73,0.6)]">
              <div className="flex items-center justify-between mb-3 text-[11px] text-gray-300 font-mono">
                <span>MEP COORDINATION VIEW</span>
                <span>Scale 1:50</span>
              </div>

              <LazyThreeContainer />

              <div className="grid grid-cols-3 gap-3 text-[11px] text-gray-300 font-mono">
                <div>
                  <p className="text-cyan-300 mb-0.5">Clash Reduction</p>
                  <p>87%</p>
                </div>
                <div>
                  <p className="text-cyan-300 mb-0.5">MEPF Systems</p>
                  <p>HVAC · Elec · Fire</p>
                </div>
                <div>
                  <p className="text-cyan-300 mb-0.5">Sectors</p>
                  <p>High-Rise · Industrial</p>
                </div>
              </div>
            </div>
          </Motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <Motion.a
        href="#services"
        aria-label="Scroll to services"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ 
          opacity: { delay: 1.5, duration: 0.5 },
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 group"
      >
        <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center items-start backdrop-blur-sm group-hover:border-white transition-colors">
          <Motion.div 
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-3 bg-white/80 rounded-full mt-2 group-hover:bg-white transition-colors"
          />
        </div>
      </Motion.a>
    </section>
  );
}

// IntersectionObserver-based lazy mount of 3D canvas
function LazyThreeContainer() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        });
      },
      { root: null, threshold: 0.15 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative rounded-lg overflow-hidden bg-slate-800 h-56 sm:h-64 md:h-80 mb-3">
      {visible ? (
        <Suspense
          fallback={
            <div className="absolute inset-0 flex items-center justify-center text-xs text-cyan-200/80">
              Loading 3D preview…
            </div>
          }
        >
          <ThreeHero modelUrl="https://github.com/nikpatil7/mechtron-global-website/releases/download/v1.0.0/spie_ibexhouse_chiller_plantroom.glb" />
        </Suspense>
      ) : (
        <img
          src="/images/hero-bim.jpg"
          alt="BIM preview placeholder"
          className="w-full h-full object-cover opacity-40"
          loading="lazy"
        />
      )}
    </div>
  );
}
