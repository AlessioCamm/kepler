import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Companion, {type CompanionState } from './Companion';

export default function App() {
  const [state, setState] = useState<CompanionState>('idle');

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center overflow-hidden">
      <Companion state={state} />

      {/* Label d'état avec transition douce */}
      <div className="mt-16 h-6 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={state}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="text-zinc-500 text-sm tracking-[0.3em] uppercase absolute left-1/2 -translate-x-1/2"
          >
            {state}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sélecteur d'état */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-2 bg-zinc-900/50 backdrop-blur-sm rounded-full p-1.5">
        {(['idle', 'listening', 'thinking', 'speaking'] as CompanionState[]).map((s) => (
          <button
            key={s}
            onClick={() => setState(s)}
            className={`px-4 py-1.5 rounded-full text-xs tracking-wider uppercase transition-all ${
              state === s
                ? 'bg-zinc-100 text-zinc-900 shadow-lg'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
