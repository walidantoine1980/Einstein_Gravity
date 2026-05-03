import React, { useState } from 'react';
import { ArrowRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { InlineMath } from 'react-katex';

const terms = [
  {
    id: 'G_mu_nu',
    math: 'G_{\\mu\\nu}',
    name: 'Tenseur d\'Einstein',
    desc: 'Décrit la courbure de l\'espace-temps. C\'est la façon dont l\'espace se déforme.',
    color: 'text-blue-400',
    hex: '#60a5fa',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/30'
  },
  {
    id: 'plus',
    math: '+',
    name: '',
    desc: '',
    color: 'text-slate-400'
  },
  {
    id: 'Lambda',
    math: '\\Lambda',
    name: 'Constante Cosmologique',
    desc: 'L\'énergie sombre de l\'univers. Responsable de l\'accélération de l\'expansion.',
    color: 'text-purple-400',
    hex: '#c084fc',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/30'
  },
  {
    id: 'g_mu_nu',
    math: 'g_{\\mu\\nu}',
    name: 'Métrique',
    desc: 'L\'outil mathématique pour mesurer les distances et les angles dans l\'espace-temps courbé.',
    color: 'text-teal-400',
    hex: '#2dd4bf',
    bg: 'bg-teal-400/10',
    border: 'border-teal-400/30'
  },
  {
    id: 'equals',
    math: '=',
    name: '',
    desc: '',
    color: 'text-slate-400'
  },
  {
    id: 'constants',
    math: '\\frac{8\\pi G}{c^4}',
    name: 'Constante de Couplage',
    desc: 'Relie la géométrie (gauche) à l\'énergie (droite). Très petite valeur, montrant que la gravité est faible.',
    color: 'text-amber-400',
    hex: '#fbbf24',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/30'
  },
  {
    id: 'T_mu_nu',
    math: 'T_{\\mu\\nu}',
    name: 'Tenseur Énergie-Impulsion',
    desc: 'Décrit le contenu de l\'univers : masse, énergie, pression et contraintes.',
    color: 'text-rose-400',
    hex: '#fb7185',
    bg: 'bg-rose-400/10',
    border: 'border-rose-400/30'
  }
];

export default function EquationIntro() {
  const [activeTerm, setActiveTerm] = useState(null);

  return (
    <div className="min-h-full p-6 lg:p-12 max-w-5xl mx-auto flex flex-col justify-center">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent-light text-sm font-medium border border-accent/30 mb-4">
            <Info size={16} /> Concept Fondamental
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 pb-2">
            L'Équation d'Einstein
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            "La matière dicte à l'espace-temps comment se courber, et l'espace-temps dicte à la matière comment se mouvoir." — John Archibald Wheeler
          </p>
        </div>

        {/* Interactive Equation Card */}
        <div className="glass-panel p-8 md:p-12 relative overflow-hidden mt-12">
          {/* Background glow based on active term */}
          <div 
            className="absolute inset-0 opacity-20 transition-colors duration-500 blur-3xl pointer-events-none"
            style={{ 
              backgroundColor: activeTerm ? terms.find(t => t.id === activeTerm)?.hex : 'transparent' 
            }}
          />

          <div className="relative flex flex-wrap justify-center items-center gap-2 md:gap-4 text-3xl md:text-5xl font-mono tracking-wider">
            {terms.map((term, i) => (
              <span
                key={i}
                onMouseEnter={() => term.name && setActiveTerm(term.id)}
                onMouseLeave={() => setActiveTerm(null)}
                className={`
                  transition-all duration-300 px-2 py-1 rounded-lg
                  ${term.name ? 'cursor-pointer hover:scale-110' : ''}
                  ${activeTerm === term.id ? term.color + ' ' + term.bg + ' ring-1 ' + term.border : 'text-white'}
                  ${activeTerm && activeTerm !== term.id && term.name ? 'opacity-30' : ''}
                `}
              >
                <InlineMath math={term.math} />
              </span>
            ))}
          </div>

          {/* Explanation Area */}
          <div className="mt-12 min-h-[120px] flex items-center justify-center text-center">
            {activeTerm ? (
              <div className="animate-in fade-in zoom-in-95 duration-200">
                <h3 className={`text-2xl font-bold mb-2 ${terms.find(t => t.id === activeTerm).color}`}>
                  {terms.find(t => t.id === activeTerm).name}
                </h3>
                <p className="text-slate-300 max-w-lg mx-auto text-lg">
                  {terms.find(t => t.id === activeTerm).desc}
                </p>
              </div>
            ) : (
              <p className="text-slate-500 italic animate-in fade-in duration-500">
                Survolez les termes de l'équation pour comprendre leur signification.
              </p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <div className="glass-panel p-6 border-l-4 border-l-blue-500">
            <h3 className="text-xl font-bold mb-2">Géométrie de l'Espace (Gauche)</h3>
            <p className="text-slate-400">
              Le côté gauche de l'équation décrit comment l'espace-temps est structuré et courbé. C'est la "scène" sur laquelle se déroule l'univers.
            </p>
          </div>
          <div className="glass-panel p-6 border-l-4 border-l-rose-500">
            <h3 className="text-xl font-bold mb-2">Contenu de l'Univers (Droite)</h3>
            <p className="text-slate-400">
              Le côté droit représente tout ce qui existe : étoiles, planètes, rayonnement et énergie. C'est le "scénario" qui modifie la scène.
            </p>
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <Link 
            to="/simulator"
            className="group flex items-center gap-2 bg-white text-space-900 px-8 py-4 rounded-full font-bold hover:bg-accent hover:text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
          >
            Lancer le Simulateur 3D
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
