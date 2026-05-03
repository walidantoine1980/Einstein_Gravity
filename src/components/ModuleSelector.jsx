import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Zap, Eye, Disc, Wind, ChevronRight, Lightbulb, Book } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const modules = [
  { id: 'geometry', path: '/simulator', name: 'Géométrie', icon: Layers, color: 'text-blue-400' },
  { id: 'schwarzschild', path: '/schwarzschild', name: 'Schwarzschild', icon: Zap, color: 'text-purple-400' },
  { id: 'lensing', path: '/lensing', name: 'Lentilles', icon: Eye, color: 'text-teal-400' },
  { id: 'orbits', path: '/orbits', name: 'Orbits', icon: Disc, color: 'text-amber-400' },
  { id: 'cosmology', path: '/cosmology', name: 'Cosmologie', icon: Wind, color: 'text-rose-400' },
  { id: 'gedanken', path: '/gedanken', name: 'Expériences', icon: Lightbulb, color: 'text-yellow-400' },
  { id: 'resources', path: '/resources', name: 'Ressources', icon: Book, color: 'text-green-400' },
];

const ModuleSelector = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel p-2 flex gap-1 pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        {modules.map((mod) => {
          const Icon = mod.icon;
          const isActive = location.pathname === mod.path;
          
          return (
            <button
              key={mod.id}
              onClick={() => navigate(mod.path)}
              className={`
                group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                ${isActive ? 'bg-accent/20 border border-accent/30' : 'hover:bg-white/5 border border-transparent'}
              `}
            >
              <Icon size={18} className={isActive ? mod.color : 'text-slate-500'} />
              <span className={`text-sm font-bold whitespace-nowrap ${isActive ? 'text-white' : 'hidden md:block text-slate-400'}`}>
                {mod.name}
              </span>
              
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute -top-12 left-1/2 -translate-x-1/2 bg-accent text-white text-[10px] uppercase tracking-tighter px-2 py-1 rounded-full font-bold whitespace-nowrap pointer-events-none"
                >
                  Module Actif
                </motion.div>
              )}
            </button>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ModuleSelector;
