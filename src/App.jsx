import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Info } from 'lucide-react';

// Components
import EquationIntro from './components/EquationIntro';
import Simulator3D from './components/Simulator3D';
import SchwarzschildSimulator from './components/SchwarzschildSimulator';
import LensingSimulator from './components/LensingSimulator';
import OrbitSimulator from './components/OrbitSimulator';
import CosmologySimulator from './components/CosmologySimulator';
import ThoughtExperiments from './components/ThoughtExperiments';
import ResourceCenter from './components/ResourceCenter';
import ModuleSelector from './components/ModuleSelector';

function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-space-950 overflow-hidden text-slate-300 font-serif">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full animate-pulse-slow" />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="p-4 px-8 flex items-center justify-between border-b border-white/5 bg-space-950/50 backdrop-blur-md z-40">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-bold text-white tracking-widest flex items-center gap-2">
              <span className="text-accent">EINSTEIN</span> PLATFORM
            </Link>
            <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold hidden md:block">
              General Relativity Pedagogical System v2.0
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-500 hover:text-white transition-colors">
              <Info size={18} />
            </button>
          </div>
        </header>
        
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="h-full w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Global Navigation */}
        <ModuleSelector />
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<EquationIntro />} />
          <Route path="/simulator" element={<Simulator3D />} />
          <Route path="/schwarzschild" element={<SchwarzschildSimulator />} />
          <Route path="/lensing" element={<LensingSimulator />} />
          <Route path="/orbits" element={<OrbitSimulator />} />
          <Route path="/cosmology" element={<CosmologySimulator />} />
          <Route path="/gedanken" element={<ThoughtExperiments />} />
          <Route path="/resources" element={<ResourceCenter />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

