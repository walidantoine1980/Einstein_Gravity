import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Stars, Line, Html } from '@react-three/drei';
import { HelpCircle, ArrowUp, Lightbulb } from 'lucide-react';
import { InlineMath } from 'react-katex';

// Components
import MathSidebar from './MathSidebar';

import * as THREE from 'three';

const experiments = [
  {
    id: 'elevator',
    title: "L'Ascenseur d'Einstein",
    concept: "Le Principe d'Équivalence",
    desc: "Einstein a réalisé qu'un homme dans un ascenseur en chute libre ne ressentirait plus son propre poids. La gravité est équivalente à une accélération.",
    math: "a = g",
    derivation: [
      { label: "Masse Grave vs Inerte", text: "Pourquoi tous les objets tombent à la même vitesse.", math: "m_i a = m_g g" },
      { label: "Conséquence", text: "La lumière doit être courbée par la gravité comme elle l'est par l'accélération." }
    ]
  },
  {
    id: 'train',
    title: "Le Train et la Foudre",
    concept: "Relativité de la Simultanéité",
    desc: "Deux événements simultanés pour un observateur sur le quai ne le sont pas pour un observateur dans un train en mouvement.",
    math: "\Delta t' = \gamma (\Delta t - \frac{v \Delta x}{c^2})"
  }
];

function ElevatorSim({ accelerating }) {
  const ballRef = useRef();
  const beamRef = useRef();
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (accelerating) {
      // Simulate light beam curving down due to upward acceleration
      if (beamRef.current) {
        const points = [];
        for (let x = -1.5; x <= 1.5; x += 0.1) {
          const y = -0.1 * (x + 1.5) * (x + 1.5);
          points.push(new THREE.Vector3(x, y + 0.5, 0));
        }
        beamRef.current.geometry.setFromPoints(points);
      }
      // Ball stays still while elevator "moves up" (visualized by floor coming up)
    } else {
      // Free fall: Ball and elevator move together
      if (ballRef.current) {
        ballRef.current.position.y = 0;
      }
      if (beamRef.current) {
        const points = [new THREE.Vector3(-1.5, 0.5, 0), new THREE.Vector3(1.5, 0.5, 0)];
        beamRef.current.geometry.setFromPoints(points);
      }
    }
  });

  return (
    <group>
      {/* The Elevator Car */}
      <Box args={[4, 5, 4]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1e293b" wireframe transparent opacity={0.3} />
      </Box>
      <Box args={[4, 0.1, 4]} position={[0, -2.5, 0]}>
        <meshStandardMaterial color="#334155" />
      </Box>

      {/* Internal Observer items */}
      <mesh ref={ballRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1} />
      </mesh>

      {/* Light Beam */}
      <line ref={beamRef}>
        <bufferGeometry attach="geometry" />
        <lineBasicMaterial attach="material" color="#2dd4bf" linewidth={2} />
      </line>

      {/* Floating labels */}
      <Html position={[0, 3, 0]} center>
        <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded border border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {accelerating ? "Accélération vers le haut (1g)" : "Chute Libre (0g)"}
        </div>
      </Html>
    </group>
  );
}

function TrainSim({ moving }) {
  const trainRef = useRef();
  const lightLRef = useRef();
  const lightRRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (trainRef.current) {
      trainRef.current.position.x = moving ? Math.sin(t * 0.5) * 5 : 0;
    }
    
    // Simulate lightning pulses
    const pulse = (Math.sin(t * 2) + 1) / 2;
    if (lightLRef.current) lightLRef.current.intensity = pulse > 0.8 ? 5 : 0;
    if (lightRRef.current) lightRRef.current.intensity = pulse > 0.8 ? 5 : 0;
  });

  return (
    <group>
      {/* Platform */}
      <Box args={[20, 0.2, 5]} position={[0, -1, 0]}>
        <meshStandardMaterial color="#334155" />
      </Box>
      
      {/* Train */}
      <group ref={trainRef}>
        <Box args={[6, 2, 2]} position={[0, 0.2, 0]}>
          <meshStandardMaterial color="#1e293b" transparent opacity={0.6} />
        </Box>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" />
        </mesh>
      </group>

      {/* Lightning points */}
      <pointLight ref={lightLRef} position={[-8, 2, 0]} color="#60a5fa" />
      <pointLight ref={lightRRef} position={[8, 2, 0]} color="#60a5fa" />
      
      <mesh position={[-8, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2]} />
        <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" />
      </mesh>
      <mesh position={[8, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2]} />
        <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" />
      </mesh>
    </group>
  );
}

export default function ThoughtExperiments() {
  const [activeExp, setActiveExp] = useState(experiments[0]);
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="h-full w-full relative bg-space-950">
      <MathSidebar 
        title={activeExp.title}
        equations={[activeExp.math]}
        concept={activeExp.desc}
        derivation={activeExp.derivation}
      />

      <div className="absolute top-6 right-6 z-20 w-80 glass-panel p-6 space-y-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Lightbulb size={16} className="text-accent" />
          Expérience de Pensée
        </h3>

        <div className="space-y-2">
          {experiments.map(exp => (
            <button
              key={exp.id}
              onClick={() => { setActiveExp(exp); setIsActive(false); }}
              className={`w-full text-left p-3 rounded-xl transition-all ${activeExp.id === exp.id ? 'bg-accent/20 border border-accent/30' : 'bg-white/5 border border-transparent hover:bg-white/10'}`}
            >
              <h4 className="text-xs font-bold text-white">{exp.title}</h4>
              <p className="text-[10px] text-slate-500 uppercase tracking-tight">{exp.concept}</p>
            </button>
          ))}
        </div>

        <div className="pt-4 border-t border-white/5 space-y-4">
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`w-full scientific-button justify-center ${isActive ? 'bg-accent text-white' : 'bg-white/5 text-slate-400'}`}
          >
            {isActive ? (activeExp.id === 'elevator' ? "Stopper l'Accélération" : "Arrêter le Train") : (activeExp.id === 'elevator' ? "Démarrer l'Accélération" : "Lancer le Train")}
          </button>
          <p className="text-[11px] text-slate-500 leading-relaxed italic">
            {activeExp.id === 'elevator' 
              ? "\"Je fus assis sur ma chaise au bureau des brevets à Berne quand soudain une idée me vint : si une personne tombe librement, elle ne sentira pas son propre poids.\" — Einstein"
              : "\"Le temps n'est pas absolu. Il dépend de l'état de mouvement de l'observateur.\""}
          </p>
        </div>
      </div>

      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [10, 8, 15], fov: 35 }}>
          <color attach="background" args={['#020205']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          {activeExp.id === 'elevator' ? (
            <ElevatorSim accelerating={isActive} />
          ) : (
            <TrainSim moving={isActive} />
          )}
          
          <OrbitControls enablePan={false} />
        </Canvas>
      </div>

      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <h2 className="text-4xl font-bold text-white/20 tracking-[0.4em] uppercase">
          Gedankenexperiments
        </h2>
      </div>
    </div>
  );
}
