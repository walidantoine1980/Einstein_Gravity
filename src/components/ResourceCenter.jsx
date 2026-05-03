import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Book, Bookmark, ExternalLink, Hash } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';

const terms = [
  {
    term: "Métrique de Schwarzschild",
    category: "Solutions",
    desc: "La première solution exacte des équations d'Einstein. Elle décrit le champ gravitationnel à l'extérieur d'une masse sphérique, prédisant les trous noirs.",
    math: "R_s = \\frac{2GM}{c^2}"
  },
  {
    term: "Géodésique",
    category: "Géométrie",
    desc: "La généralisation d'une ligne droite dans un espace courbé. C'est le chemin suivi par un objet soumis uniquement à la gravité.",
    math: "\\frac{d^2 x^\\mu}{d\\tau^2} + \\Gamma^\\mu_{\\alpha\\beta} \\frac{dx^\\alpha}{d\\tau} \\frac{dx^\\beta}{d\\tau} = 0"
  },
  {
    term: "Symboles de Christoffel",
    category: "Mathématiques",
    desc: "Des outils mathématiques qui décrivent comment la métrique change d'un point à l'autre. Ils représentent la 'force' de gravité dans le formalisme de la RG.",
    math: "\\Gamma^k_{ij} = \\frac{1}{2} g^{kl} (\\partial_j g_{li} + \\partial_i g_{lj} - \\partial_l g_{ij})"
  },
  {
    term: "Tenseur Énergie-Impulsion",
    category: "Physique",
    desc: "Le terme source des équations d'Einstein. Il contient la densité d'énergie, la pression et les flux de quantité de mouvement.",
    math: "T_{\\mu\\nu}"
  },
  {
    term: "Horizon des Événements",
    category: "Astrophysique",
    desc: "La frontière d'un trou noir d'où rien, pas même la lumière, ne peut s'échapper.",
    math: "r = R_s"
  },
  {
    term: "Ondes Gravitationnelles",
    category: "Phénomènes",
    desc: "Des ondulations de la courbure de l'espace-temps qui se propagent à la vitesse de la lumière, générées par des masses accélérées.",
    math: "h_{\\mu\\nu}"
  }
];

export default function ResourceCenter() {
  const [search, setSearch] = useState("");
  
  const filteredTerms = terms.filter(t => 
    t.term.toLowerCase().includes(search.toLowerCase()) || 
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full w-full bg-space-950 overflow-y-auto p-6 md:p-12 pb-32">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
            Centre de Ressources
          </h1>
          <p className="text-slate-500">Glossaire interactif et fondements mathématiques de la Relativité Générale.</p>
        </div>

        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher un concept, une équation..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-accent/50 transition-all shadow-2xl"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredTerms.map((t, i) => (
              <motion.div
                key={t.term}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-panel p-6 hover:border-accent/30 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-accent uppercase tracking-widest px-2 py-0.5 bg-accent/10 rounded-full">
                      {t.category}
                    </span>
                    <h3 className="text-xl font-bold mt-2 text-white group-hover:text-accent-light transition-colors">
                      {t.term}
                    </h3>
                  </div>
                  <Bookmark className="text-slate-700" size={18} />
                </div>
                
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  {t.desc}
                </p>

                <div className="math-card py-4 flex flex-col items-center justify-center min-h-[80px]">
                  <BlockMath math={t.math} />
                </div>

                <button className="mt-6 w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors border-t border-white/5 pt-4">
                  <ExternalLink size={14} /> Lire la dérivation complète
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredTerms.length === 0 && (
          <div className="text-center py-20 text-slate-600">
            Aucun résultat trouvé pour "{search}"
          </div>
        )}
      </div>
    </div>
  );
}
