import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Cpu, ChevronRight } from 'lucide-react';

const MathSidebar = ({ title, equations, concept, derivation }) => {
  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="absolute top-6 left-6 z-20 w-80 md:w-96 glass-panel p-6 space-y-6 max-h-[90vh] overflow-y-auto"
    >
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Cpu className="text-accent" size={20} />
          {title}
        </h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1">
            <Info size={12} /> Équations Maîtresses
          </label>
          <div className="math-card overflow-x-auto">
            {equations.map((eq, idx) => (
              <div key={idx} className="mb-2 last:mb-0">
                <BlockMath math={eq} />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Le Concept Physique</label>
          <p className="text-sm leading-relaxed text-slate-400 italic">
            "{concept}"
          </p>
        </div>

        {derivation && (
          <div className="space-y-3 pt-4 border-t border-white/5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Détails Mathématiques</label>
            <div className="space-y-4">
              {derivation.map((step, idx) => (
                <div key={idx} className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1">
                    <ChevronRight size={12} className="text-accent" /> {step.label}
                  </h4>
                  <div className="text-[13px] text-slate-500 pl-4 border-l border-white/5">
                    {step.text}
                    {step.math && (
                      <div className="mt-2 py-1 bg-white/5 rounded px-2 text-accent-light">
                        <InlineMath math={step.math} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MathSidebar;
