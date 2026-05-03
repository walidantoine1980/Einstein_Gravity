import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// Components
import MathSidebar from './MathSidebar';
import ConstantsControl from './ConstantsControl';

// Physics Metadata for Module 1
const moduleInfo = {
  title: "Géométrie de l'Espace-Temps",
  equations: [
    "G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}",
    "R_{\\mu\\nu} - \\frac{1}{2}R g_{\\mu\\nu} = G_{\\mu\\nu}"
  ],
  concept: "La matière dicte à l'espace comment se courber. Cette courbure n'est pas une force, mais la géométrie même de l'univers.",
  derivation: [
    { label: "Tenseur Métrique", text: "Définit les distances infinitésimales.", math: "ds^2 = g_{\\mu\\nu} dx^\\mu dx^\\nu" },
    { label: "Courbure de Ricci", text: "Représente la modification du volume dans l'espace courbé.", math: "R_{\\mu\\nu}" },
    { label: "Tenseur Énergie", text: "Source de la gravitation.", math: "T_{\\mu\\nu}" }
  ]
};

function SpacetimeGrid({ mass, radius }) {
  const meshRef = useRef();
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(30, 30, 80, 80);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const positions = meshRef.current.geometry.attributes.position;
    const time = clock.getElapsedTime();
    const hasMass = mass > 0;
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      const d = Math.sqrt(x*x + z*z);
      
      const r = Math.max(d, radius);
      const wave = hasMass ? Math.sin(d * 1.5 - time * 2) * 0.03 : 0;
      
      // The gravity well (Visual approximation of G_00)
      let y = hasMass ? - (mass * 2.5) / (r + 0.8) + wave : 0;
      positions.setY(i, y);
    }
    positions.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial 
        color="#4f46e5" 
        wireframe={true} 
        transparent={true} 
        opacity={0.2}
        emissive="#818cf8"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

function CentralBody({ mass, radius }) {
  const meshRef = useRef();
  const isBlackHole = mass > 8;
  const scale = radius * 0.8;

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  if (mass === 0) return null;

  return (
    <group position={[0, -mass * 1.2 / (radius + 0.8), 0]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[scale, 64, 64]} />
          <meshStandardMaterial 
            color={isBlackHole ? "#000000" : (mass > 5 ? "#fde047" : "#60a5fa")}
            emissive={isBlackHole ? "#000000" : (mass > 5 ? "#ca8a04" : "#2563eb")}
            emissiveIntensity={isBlackHole ? 0 : 1.2}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
      </Float>
      
      {isBlackHole && (
        <group rotation={[Math.PI/2.2, 0, 0]}>
          <mesh>
            <ringGeometry args={[scale * 1.8, scale * 4, 64]} />
            <meshStandardMaterial 
              color="#ea580c" 
              emissive="#f97316" 
              emissiveIntensity={2} 
              transparent 
              opacity={0.4} 
              side={THREE.DoubleSide} 
            />
          </mesh>
          <mesh rotation={[0.2, 0, 0]}>
            <ringGeometry args={[scale * 1.9, scale * 3.5, 64]} />
            <meshStandardMaterial 
              color="#fbbf24" 
              emissive="#fbbf24" 
              emissiveIntensity={1.5} 
              transparent 
              opacity={0.2} 
              side={THREE.DoubleSide} 
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

function OrbitingParticle({ centralMass }) {
  const meshRef = useRef();
  const orbitRadius = 7;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const speed = 1.2 * Math.sqrt(Math.max(0.1, centralMass) / 3);
    const time = clock.getElapsedTime() * speed;
    
    const x = Math.cos(time) * orbitRadius;
    const z = Math.sin(time) * orbitRadius;
    const y = centralMass > 0 ? - (centralMass * 2.5) / (orbitRadius + 0.8) : 0;
    
    meshRef.current.position.set(x, y + 0.3, z);
    meshRef.current.rotation.y += 0.05;
  });

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[0.2]} />
      <meshStandardMaterial color="#2dd4bf" emissive="#2dd4bf" emissiveIntensity={2} />
    </mesh>
  );
}

export default function Simulator3D() {
  const [mass, setMass] = useState(3.5);
  const [radius, setRadius] = useState(1.2);

  return (
    <div className="h-full w-full relative bg-space-950">
      <MathSidebar 
        title={moduleInfo.title}
        equations={moduleInfo.equations}
        concept={moduleInfo.concept}
        derivation={moduleInfo.derivation}
      />

      <ConstantsControl 
        mass={mass} setMass={setMass}
        radius={radius} setRadius={setRadius}
      />

      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [15, 12, 15], fov: 40 }}>
          <color attach="background" args={['#020205']} />
          <fog attach="fog" args={['#020205', 10, 50]} />
          
          <ambientLight intensity={0.1} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#818cf8" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />
          
          <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={1} />
          <Environment preset="night" />
          
          <SpacetimeGrid mass={mass} radius={radius} />
          <CentralBody mass={mass} radius={radius} />
          <OrbitingParticle centralMass={mass} />
          
          <OrbitControls 
            enablePan={false} 
            minDistance={8} 
            maxDistance={40}
            maxPolarAngle={Math.PI / 1.9}
            autoRotate={mass === 0}
            autoRotateSpeed={0.2}
          />
        </Canvas>
      </div>

      {/* Module Title Overlay */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <h2 className="text-4xl font-bold text-white/20 tracking-[0.4em] uppercase">
          Métrique d'Espace-Temps
        </h2>
      </div>
    </div>
  );
}
