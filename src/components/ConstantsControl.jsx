import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Globe, Sun, Zap } from 'lucide-react';
import { InlineMath } from 'react-katex';

const presets = [
  { name: 'Terre', mass: 1, radius: 1, icon: Globe },
  { name: 'Soleil', mass: 5, radius: 2, icon: Sun },
  { name: 'Sag A*', mass: 10, radius: 0.8, icon: Zap },
];

const ConstantsControl = ({ mass, setMass, radius, setRadius, title = "Constantes de Champ" }) => {
  return (
    <div className="absolute top-6 right-6 z-20 w-80 glass-panel p-6 space-y-6">
      <h3 className="text-sm font-bold flex items-center gap-2 text-slate-400 uppercase tracking-widest">
        <Settings size={16} className="text-accent" />
        {title}
      </h3>

      <div className="flex gap-2 pb-2">
        {presets.map((p) => {
          const Icon = p.icon;
          return (
            <button
              key={p.name}
              onClick={() => { setMass(p.mass); setRadius(p.radius); }}
              className="flex-1 p-2 rounded-lg bg-white/5 border border-white/5 hover:border-accent/30 transition-all text-[10px] font-bold text-slate-500 hover:text-white uppercase flex flex-col items-center gap-1"
            >
              <Icon size={14} />
              {p.name}
            </button>
          );
        })}
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
            <span className="text-slate-500">Masse (M)</span>
            <span className="text-accent">{mass.toFixed(2)} M☉</span>
          </div>
          <input 
            type="range" min="0" max="10" step="0.1" value={mass} 
            onChange={(e) => setMass(parseFloat(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
            <span className="text-slate-500">Rayon (R)</span>
            <span className="text-teal-400">{radius.toFixed(2)} R☉</span>
          </div>
          <input 
            type="range" min="0.5" max="3" step="0.1" value={radius} 
            onChange={(e) => setRadius(parseFloat(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-400"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-white/5">
        <div className="math-card py-2 text-center text-xs opacity-60">
          Densité <InlineMath math="\rho \approx \frac{3M}{4\pi R^3}" />
        </div>
      </div>
    </div>
  );
};

export default ConstantsControl;
