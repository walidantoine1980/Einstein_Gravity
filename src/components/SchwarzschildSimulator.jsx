import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Environment, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// Components
import MathSidebar from './MathSidebar';
import ConstantsControl from './ConstantsControl';

const moduleInfo = {
  title: "Métrique de Schwarzschild",
  equations: [
    "ds^2 = -\\left(1-\\frac{R_s}{r}\\right)c^2dt^2 + \\left(1-\\frac{R_s}{r}\\right)^{-1}dr^2 + r^2d\\Omega^2",
    "R_s = \\frac{2GM}{c^2}"
  ],
  concept: "La solution de Schwarzschild décrit l'espace-temps à l'extérieur d'une masse sphérique. Elle prédit l'existence d'un horizon des événements.",
  derivation: [
    { label: "Rayon de Schwarzschild", text: "La limite où la vitesse de libération est égale à c.", math: "R_s = 2GM/c^2" },
    { label: "Sphère de Photons", text: "L'orbite instable où la lumière tourne en boucle.", math: "r = 1.5 R_s" },
    { label: "Dilatation Temporelle", text: "Le temps s'arrête pour un observateur à l'horizon.", math: "t' = t\\sqrt{1-R_s/r}" }
  ]
};

function EventHorizon({ mass }) {
  const rs = mass * 0.5; // Scaled Rs
  return (
    <mesh>
      <sphereGeometry args={[rs, 64, 64]} />
      <meshBasicMaterial color="#000000" />
    </mesh>
  );
}

function PhotonSphere({ mass }) {
  const rs = mass * 0.5;
  const ps = rs * 1.5;
  return (
    <mesh>
      <sphereGeometry args={[ps, 64, 64]} />
      <meshStandardMaterial 
        color="#fbbf24" 
        transparent 
        opacity={0.15} 
        wireframe
        emissive="#fbbf24"
        emissiveIntensity={1}
      />
    </mesh>
  );
}

function AccretionDisk({ mass }) {
  const meshRef = useRef();
  const rs = mass * 0.5;

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <group rotation={[Math.PI / 2.1, 0.2, 0]}>
      <mesh ref={meshRef}>
        <ringGeometry args={[rs * 2, rs * 6, 128]} />
        <meshStandardMaterial 
          color="#ea580c" 
          emissive="#f97316" 
          emissiveIntensity={5} 
          transparent 
          opacity={0.6} 
          side={THREE.DoubleSide} 
        />
      </mesh>
      <Sparkles count={100} scale={rs * 10} size={2} speed={0.5} color="#fbbf24" />
    </group>
  );
}

function LightGeodesic({ mass, angle }) {
  const lineRef = useRef();
  const rs = mass * 0.5;

  const points = useMemo(() => {
    const p = [];
    const steps = 100;
    const startX = -15;
    const startY = angle;
    
    let currX = startX;
    let currY = startY;
    let currZ = 2;
    
    for (let i = 0; i < steps; i++) {
      const r = Math.sqrt(currX*currX + currY*currY);
      const deflection = (2 * rs) / r; // Simple deflection approx
      
      p.push(new THREE.Vector3(currX, currY, currZ));
      
      currX += 0.3;
      if (r > rs) {
        currY -= deflection * 0.1;
      }
    }
    return p;
  }, [mass, angle, rs]);

  return (
    <line>
      <bufferGeometry attach="geometry" setFromPoints={points} />
      <lineBasicMaterial attach="material" color="#2dd4bf" opacity={0.4} transparent />
    </line>
  );
}

export default function SchwarzschildSimulator() {
  const [mass, setMass] = useState(8.0);
  const [radius, setRadius] = useState(1.0); // Not used much here, focus on Rs

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
        title="Paramètres de Singularité"
      />

      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [10, 8, 20], fov: 40 }}>
          <color attach="background" args={['#020205']} />
          <ambientLight intensity={0.1} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#fb923c" />
          
          <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={1} />
          
          <EventHorizon mass={mass} />
          <PhotonSphere mass={mass} />
          <AccretionDisk mass={mass} />
          
          {/* Light ray samples */}
          {[-2, -1, 0, 1, 2].map(a => (
            <LightGeodesic key={a} mass={mass} angle={a * 1.5} />
          ))}
          
          <OrbitControls 
            enablePan={false} 
            minDistance={5} 
            maxDistance={50}
          />
        </Canvas>
      </div>

      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <h2 className="text-4xl font-bold text-white/20 tracking-[0.4em] uppercase">
          Trou Noir & Horizon
        </h2>
      </div>
    </div>
  );
}
