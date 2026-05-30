import { motion, useReducedMotion } from 'framer-motion';

export type CompanionState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface CompanionProps {
  state: CompanionState;
}

const palettes = {
  idle:      { color: '#5EEAD4', soft: '#A5F3FC' },
  listening: { color: '#34D399', soft: '#6EE7B7' },
  thinking:  { color: '#A78BFA', soft: '#C4B5FD' },
  speaking:  { color: '#60A5FA', soft: '#93C5FD' },
};

const intensities = {
  idle:      { size: 200, breath: 4.5, intensity: 0.55 },
  listening: { size: 260, breath: 1.6, intensity: 0.85 },
  thinking:  { size: 220, breath: 2.5, intensity: 0.65 },
  speaking:  { size: 290, breath: 1.1, intensity: 0.95 },
};

export default function Companion({ state }: CompanionProps) {
  const prefersReducedMotion = useReducedMotion();
  const palette = palettes[state];
  const { size, breath, intensity } = intensities[state];

  const spring = { type: 'spring' as const, stiffness: 50, damping: 20, mass: 1.5 };

  return (
    <div className="relative w-[400px] h-[400px] flex items-center justify-center">
      {/* Halo très lointain — base de diffusion ambiante */}
      <motion.div
        className="absolute rounded-full blur-3xl"
        animate={{
          width: size * 1.8,
          height: size * 1.8,
          backgroundColor: palette.color,
          opacity: intensity * 0.25,
        }}
        transition={spring}
      />

      {/* Halo lointain — pulse lente */}
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{ backgroundColor: palette.color }}
        animate={{
          width: size * 1.4,
          height: size * 1.4,
          opacity: intensity * 0.4,
          ...(prefersReducedMotion ? {} : {
            scale: [1, 1.08, 0.95, 1.06, 1],
          }),
        }}
        transition={{
          width: spring,
          height: spring,
          opacity: spring,
          scale: { duration: breath * 1.4, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      {/* Halo moyen — pulse principale */}
      <motion.div
        className="absolute rounded-full blur-2xl"
        style={{ backgroundColor: palette.color }}
        animate={{
          width: size,
          height: size,
          opacity: intensity * 0.6,
          ...(prefersReducedMotion ? {} : {
            scale: [1, 1.05, 0.97, 1.04, 1],
          }),
        }}
        transition={{
          width: spring,
          height: spring,
          opacity: spring,
          scale: { duration: breath, repeat: Infinity, ease: 'easeInOut', delay: 0.2 },
        }}
      />

      {/* Halo proche — couche douce qui donne le ton */}
      <motion.div
        className="absolute rounded-full blur-xl"
        style={{ backgroundColor: palette.soft }}
        animate={{
          width: size * 0.65,
          height: size * 0.65,
          opacity: intensity * 0.7,
          ...(prefersReducedMotion ? {} : {
            scale: state === 'speaking'
              ? [1, 1.1, 1.02, 1.13, 1, 1.08, 1]
              : [1, 1.04, 0.98, 1.03, 1],
          }),
        }}
        transition={{
          width: spring,
          height: spring,
          opacity: spring,
          scale: { duration: breath * 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.1 },
        }}
      />

      {/* Cœur lumineux — diffus, pas solide */}
      <motion.div
        className="absolute rounded-full blur-md"
        style={{ backgroundColor: palette.soft }}
        animate={{
          width: size * 0.3,
          height: size * 0.3,
          opacity: intensity * 0.95,
          ...(prefersReducedMotion ? {} : {
            scale: [1, 1.06, 0.99, 1.04, 1],
          }),
        }}
        transition={{
          width: spring,
          height: spring,
          opacity: spring,
          scale: { duration: breath * 0.7, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      {/* Particules orbitales — thinking uniquement, plus subtiles */}
      {state === 'thinking' && !prefersReducedMotion && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ width: size, height: size }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 5 + i * 2,
                repeat: Infinity,
                ease: 'linear',
              }}
              initial={{ rotate: i * 120 }}
            >
              <div
                className="absolute top-1/2 -translate-y-1/2 rounded-full blur-md"
                style={{
                  left: 0,
                  width: 12,
                  height: 12,
                  backgroundColor: palette.soft,
                  opacity: 0.7,
                }}
              />
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
}
