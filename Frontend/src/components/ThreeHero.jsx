import { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Center, Html } from '@react-three/drei';

function SpinningPart() {
  return (
    <mesh rotation={[0.3, 0.6, 0]}>
      <torusKnotGeometry args={[0.8, 0.25, 128, 32]} />
      <meshStandardMaterial color="#14B8A6" metalness={0.4} roughness={0.3} />
    </mesh>
  );
}

function GLTFModel({ url }) {
  const { scene } = useGLTF(url);
  
  // Apply BIM-style materials
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // Enhance metallic BIM look
        if (child.material) {
          child.material.metalness = Math.min(child.material.metalness + 0.2, 0.6);
          child.material.roughness = Math.max(child.material.roughness - 0.1, 0.2);
        }
      }
    });
  }, [scene]);
  
  return (
    <Center>
      <primitive object={scene} scale={2.5} />
    </Center>
  );
}

export default function ThreeHero({ modelUrl }) {
  const [reduceMotion, setReduceMotion] = useState(false);

  // Configure GLTF decoders (Draco + Meshopt) once
  useEffect(() => {
    try {
      // Use Google's hosted Draco decoders (no local files needed)
      useGLTF.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
      // Optionally enable Meshopt if model is meshopt-compressed
      import('three/addons/libs/meshopt_decoder.module.js')
        .then((mod) => {
          if (mod?.MeshoptDecoder) {
            useGLTF.setMeshoptDecoder(mod.MeshoptDecoder);
          }
        })
        .catch(() => {});
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      const update = () => setReduceMotion(!!mq.matches);
      update();
      mq.addEventListener?.('change', update);
      return () => mq.removeEventListener?.('change', update);
    } catch {}
  }, []);

  // Preload model if provided
  useEffect(() => {
    if (modelUrl) {
      try {
        useGLTF.preload(modelUrl);
      } catch {}
    }
  }, [modelUrl]);
  return (
    <div className="w-full h-80 md:h-96 rounded-2xl overflow-hidden border border-white/20 bg-gradient-to-br from-secondary/90 to-primary/90 backdrop-blur-sm shadow-2xl">
      <Canvas 
        camera={{ position: [3, 2, 5], fov: 60 }} 
        dpr={[1, 1.5]}
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        {/* BIM-style Professional Lighting */}
        <ambientLight intensity={0.4} color="#5a5a5a" />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={0.7} 
          castShadow
          shadow-mapSize={[768, 768]}
        />
        <pointLight position={[-5, 5, 5]} intensity={0.6} color="#14B8A6" distance={20} />
        <spotLight position={[0, 10, 0]} angle={0.5} intensity={0.3} color="#0E3A5B" />
        
        <Suspense fallback={
          <Html center>
            <div className="px-4 py-2 text-sm rounded-lg bg-white/90 text-secondary border border-accent/30 shadow-lg font-medium">
              🏗️ Loading BIM Model...
            </div>
          </Html>
        }>
          {modelUrl ? <GLTFModel url={modelUrl} /> : <SpinningPart />}
          <Environment preset="city" />
        </Suspense>
        
        <OrbitControls 
          enableZoom={true}
          minDistance={2}
          maxDistance={12}
          enablePan={false}
          autoRotate={!reduceMotion} 
          autoRotateSpeed={0.3}
          dampingFactor={0.08}
          enableDamping
        />
      </Canvas>
    </div>
  );
}
