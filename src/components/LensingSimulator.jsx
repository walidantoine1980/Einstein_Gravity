import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera, Float } from '@react-three/drei';
import * as THREE from 'three';

// Components
import MathSidebar from './MathSidebar';
import ConstantsControl from './ConstantsControl';

const moduleInfo = {
  title: "Lentilles Gravitationnelles",
  equations: [
    "\\alpha = \\frac{4GM}{c^2 b}",
    "\\theta_E = \\sqrt{\\frac{4GM}{c^2} \\frac{d_{LS}}{d_L d_S}}"
  ],
  concept: "La lumière ne voyage pas en ligne droite dans un espace courbé. Une masse importante peut agir comme une loupe cosmique.",
  derivation: [
    { label: "Angle de Déflexion", text: "Dépend de la masse M et du paramètre d'impact b.", math: "\\alpha" },
    { label: "Anneau d'Einstein", text: "Un alignement parfait crée un cercle lumineux.", math: "\\theta_E" },
    { label: "Mirages Cosmiques", text: "Peut créer des images multiples (Croix d'Einstein)." }
  ]
};

function DistantGalaxy({ position, color = "#60a5fa" }) {
  return (
    <Float speed={1} rotationIntensity={2} floatIntensity={1}>
      <mesh position={position}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color={color} />
        <pointLight intensity={2} color={color} />
      </mesh>
    </Float>
  );
}

function LensingEffect({ mass }) {
  const meshRef = useRef();
  const radius = mass * 0.15;

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group>
      {/* The Lens (Mass) */}
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial color="#11111a" metalness={1} roughness={0} />
      </mesh>

      {/* Einstein Ring visualization */}
      <mesh rotation={[0, Math.PI/2, 0]}>
        <ringGeometry args={[radius * 2, radius * 2.1, 128]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Distorted Light Rays */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return <LightRay key={i} angle={angle} mass={mass} />;
      })}
    </group>
  );
}

function LightRay({ angle, mass }) {
  const points = useMemo(() => {
    const p = [];
    const steps = 60;
    const startZ = -15;
    const b = 2; // Impact parameter
    
    let currX = Math.cos(angle) * b;
    let currY = Math.sin(angle) * b;
    let currZ = startZ;
    
    for (let i = 0; i < steps; i++) {
      p.push(new THREE.Vector3(currX, currY, currZ));
      
      const r = Math.sqrt(currX*currX + currY*currY + currZ*currZ);
      const deflection = (mass * 0.5) / (r * r + 1);
      
      currX -= Math.cos(angle) * deflection;
      currY -= Math.sin(angle) * deflection;
      currZ += 0.5;
    }
    return p;
  }, [angle, mass]);

  return (
    <line>
      <bufferGeometry attach="geometry" setFromPoints={points} />
      <lineBasicMaterial attach="material" color="#818cf8" transparent opacity={0.2} />
    </line>
  );
}

export default function LensingSimulator() {
  const [mass, setMass] = useState(5.0);
  const [radius, setRadius] = useState(1.0);

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
        title="Puissance de la Lentille"
      />

      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 20], fov: 35 }}>
          <color attach="background" args={['#020205']} />
          <ambientLight intensity={0.2} />
          
          <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={1} />
          
          <DistantGalaxy position={[0, 0, -20]} color="#f472b6" />
          <LensingEffect mass={mass} />
          
          <OrbitControls enablePan={false} />
        </Canvas>
      </div>

      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <h2 className="text-4xl font-bold text-white/20 tracking-[0.4em] uppercase">
          Lentille de Gravité
        </h2>
      </div>
    </div>
  );
}
