import { useEffect, useRef, useState } from 'react';

export default function VantaBackground({ 
  effect = 'NET',
  children,
  className = '',
  options = {}
}) {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    if (!vantaEffect) {
      const initVanta = async () => {
        try {
          // Dynamically import THREE and Vanta
          const THREE = await import('three');
          let VantaEffect;

          // Import the requested effect
          switch (effect.toUpperCase()) {
            case 'NET':
              VantaEffect = (await import('vanta/dist/vanta.net.min')).default;
              break;
            case 'WAVES':
              VantaEffect = (await import('vanta/dist/vanta.waves.min')).default;
              break;
            case 'CLOUDS':
              VantaEffect = (await import('vanta/dist/vanta.clouds.min')).default;
              break;
            case 'BIRDS':
              VantaEffect = (await import('vanta/dist/vanta.birds.min')).default;
              break;
            case 'FOG':
              VantaEffect = (await import('vanta/dist/vanta.fog.min')).default;
              break;
            default:
              VantaEffect = (await import('vanta/dist/vanta.net.min')).default;
          }

          // Default options optimized for performance
          const defaultOptions = {
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x14b8a6, // accent color
            backgroundColor: 0x0b1f2a, // secondary color
            points: 8.00,
            maxDistance: 20.00,
            spacing: 16.00,
          };

          setVantaEffect(
            VantaEffect({
              ...defaultOptions,
              ...options,
            })
          );
        } catch (error) {
          console.warn('Vanta effect failed to load:', error);
        }
      };

      initVanta();
    }

    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [effect, options, vantaEffect]);

  return (
    <div ref={vantaRef} className={`relative ${className}`}>
      {children}
    </div>
  );
}
