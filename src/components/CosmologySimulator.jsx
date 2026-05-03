import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Components
import MathSidebar from './MathSidebar';
import { InlineMath } from 'react-katex';

const moduleInfo = {
  title: "Modèle Cosmologique",
  equations: [
    "H^2 = \\left(\\frac{\\dot{a}}{a}\\right)^2 = \\frac{8\\pi G}{3}\\rho - \\frac{kc^2}{a^2} + \\frac{\\Lambda c^2}{3}",
    "\\frac{\\ddot{a}}{a} = -\\frac{4\\pi G}{3}(\\rho + \\frac{3p}{c^2}) + \\frac{\\Lambda c^2}{3}"
  ],
  concept: "L'univers n'est pas statique. La métrique FLRW décrit un univers en expansion (ou contraction) selon son contenu en énergie et matière.",
  derivation: [
    { label: "Facteur d'Échelle", text: "Représente l'expansion relative de l'univers.", math: "a(t)" },
    { label: "Loi de Hubble", text: "La vitesse de récession des galaxies.", math: "v = H_0 d" },
    { label: "Énergie Sombre", text: "La force qui accélère l'expansion.", math: "\\Lambda" }
  ]
};

function UniverseGalaxies({ expansionFactor, setTime }) {
  const groupRef = useRef();
  const galaxies = useMemo(() => {
    return Array.from({ length: 200 }).map(() => ({
      position: [
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40
      ],
      size: Math.random() * 0.2 + 0.1,
      color: new THREE.Color().setHSL(Math.random() * 0.1 + 0.6, 0.8, 0.8)
    }));
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.scale.setScalar(expansionFactor);
    }
    setTime(clock.getElapsedTime());
  });

  return (
    <group ref={groupRef}>
      {galaxies.map((g, i) => (
        <mesh key={i} position={g.position}>
          <sphereGeometry args={[g.size, 8, 8]} />
          <meshBasicMaterial color={g.color} />
        </mesh>
      ))}
      <Sparkles count={500} scale={30} size={1} speed={0.1} color="#ffffff" />
    </group>
  );
}

export default function CosmologySimulator() {
  const [lambda, setLambda] = useState(0.5);
  const [time, setTime] = useState(0);

  // Simplified Friedmann expansion
  const expansionFactor = useMemo(() => {
    const t = (time % 100) / 10;
    return 1 + t * lambda;
  }, [time, lambda]);

  return (
    <div className="h-full w-full relative bg-space-950">
      <MathSidebar 
        title={moduleInfo.title}
        equations={moduleInfo.equations}
        concept={moduleInfo.concept}
        derivation={moduleInfo.derivation}
      />

      <div className="absolute top-6 right-6 z-20 w-80 glass-panel p-6 space-y-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Expansion de l'Espace</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
            <span className="text-slate-500">Énergie Sombre (<InlineMath math="\Lambda" />)</span>
            <span className="text-rose-400">{lambda.toFixed(2)}</span>
          </div>
          <input 
            type="range" min="0" max="2" step="0.05" value={lambda} 
            onChange={(e) => setLambda(parseFloat(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
        </div>

        <div className="math-card py-2 text-center text-xs opacity-60">
          Facteur <InlineMath math={"a(t) \\approx " + expansionFactor.toFixed(2)} />
        </div>
      </div>

      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 30], fov: 45 }}>
          <color attach="background" args={['#020205']} />
          <ambientLight intensity={0.5} />
          
          <UniverseGalaxies expansionFactor={expansionFactor} setTime={setTime} />
          
          <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.1} />
        </Canvas>
      </div>

      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <h2 className="text-4xl font-bold text-white/20 tracking-[0.4em] uppercase">
          Expansion Cosmique
        </h2>
      </div>
    </div>
  );
}
