import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Line, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Components
import MathSidebar from './MathSidebar';
import ConstantsControl from './ConstantsControl';

const moduleInfo = {
  title: "Orbites & Précession",
  equations: [
    "\\Delta \\phi \\approx \\frac{6\\pi GM}{c^2 a(1-e^2)}",
    "\\frac{d^2u}{d\\phi^2} + u = \\frac{GM}{h^2} + 3\\frac{GM}{c^2}u^2"
  ],
  concept: "Contrairement à Newton, Einstein prédit que les orbites elliptiques tournent lentement (précession) à cause de la courbure intense près de la masse.",
  derivation: [
    { label: "Potentiel Effectif", text: "Ajoute un terme correctif en 1/r^3.", math: "-GM/r + L^2/2r^2 - GML^2/c^2r^3" },
    { label: "Cas de Mercure", text: "43 secondes d'arc par siècle expliquées par la RG.", math: "43\" / \\text{siècle}" }
  ]
};

function NewtonianOrbit({ mass, color = "#64748b" }) {
  const points = useMemo(() => {
    const p = [];
    const a = 6;
    const e = 0.6;
    for (let i = 0; i <= 100; i++) {
      const theta = (i / 100) * Math.PI * 2;
      const r = (a * (1 - e * e)) / (1 + e * Math.cos(theta));
      p.push(new THREE.Vector3(r * Math.cos(theta), 0, r * Math.sin(theta)));
    }
    return p;
  }, []);

  return <Line points={points} color={color} lineWidth={1} dashed opacity={0.3} transparent />;
}

function RelativisticOrbit({ mass }) {
  const lineRef = useRef();
  const planetRef = useRef();
  const [points, setPoints] = useState([]);
  
  const a = 6;
  const e = 0.6;
  const precessionRate = mass * 0.005;

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * 2;
    const theta = time % (Math.PI * 2);
    const rotation = Math.floor(time / (Math.PI * 2)) * precessionRate;
    
    const r = (a * (1 - e * e)) / (1 + e * Math.cos(theta));
    const x = r * Math.cos(theta + rotation);
    const z = r * Math.sin(theta + rotation);
    
    if (planetRef.current) {
      planetRef.current.position.set(x, 0, z);
    }

    // Accumulate path (tail)
    if (clock.getElapsedTime() % 0.1 < 0.02) {
      setPoints(prev => [...prev.slice(-200), new THREE.Vector3(x, 0, z)]);
    }
  });

  return (
    <group>
      {points.length > 2 && <Line points={points} color="#f59e0b" lineWidth={2} />}
      <mesh ref={planetRef}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

export default function OrbitSimulator() {
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
        title="Paramètres de Gravité"
      />

      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 15, 0], fov: 40 }}>
          <color attach="background" args={['#020205']} />
          <ambientLight intensity={0.2} />
          <pointLight position={[0, 0, 0]} intensity={3} color="#fde047" />
          
          <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={1} />
          
          {/* Central Sun */}
          <Sphere args={[1, 32, 32]}>
            <meshStandardMaterial color="#facc15" emissive="#ca8a04" emissiveIntensity={2} />
          </Sphere>
          
          <NewtonianOrbit mass={mass} />
          <RelativisticOrbit mass={mass} />
          
          <OrbitControls enablePan={false} />
        </Canvas>
      </div>

      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <h2 className="text-4xl font-bold text-white/20 tracking-[0.4em] uppercase">
          Précession du Périhélie
        </h2>
      </div>
    </div>
  );
}
