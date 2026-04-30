'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette } from 'lucide-react';
import { THEMES, useTheme } from '@/contexts/ThemeContext';

export const ThemeSwitcher = () => {
  const { themeIdx, setThemeIdx } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed left-4 bottom-24 z-[9999] flex flex-col items-center gap-2">

      {/* Theme cards — expand upward */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="flex flex-col gap-2 mb-1">
            {THEMES.map((t, i) => (
              <motion.button
                key={t.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 24 }}
                onClick={() => { setThemeIdx(i); setOpen(false); }}
                title={t.label}
                className="flex items-center gap-2.5 group"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>

                {/* Label */}
                <motion.span
                  className="text-xs font-bold whitespace-nowrap px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 pointer-events-none"
                  style={{
                    background: 'rgba(0,0,0,0.85)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(8px)',
                  }}
                  animate={{ opacity: i === themeIdx ? 1 : undefined }}>
                  {t.emoji} {t.label}
                </motion.span>

                {/* Swatch circle */}
                <motion.div
                  whileHover={{ scale: 1.25 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative flex-shrink-0"
                  style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${t.swatch[0]}, ${t.swatch[1]})`,
                    border: i === themeIdx
                      ? '2.5px solid white'
                      : '2px solid rgba(255,255,255,0.25)',
                    boxShadow: i === themeIdx
                      ? `0 0 14px ${t.swatch[0]}, 0 0 28px ${t.swatch[1]}55`
                      : `0 0 8px ${t.swatch[0]}66`,
                  }}>
                  {i === themeIdx && (
                    <motion.div
                      layoutId="active-ring"
                      className="absolute inset-[-4px] rounded-full"
                      style={{ border: `2px solid ${t.swatch[0]}`, opacity: 0.7 }}
                    />
                  )}
                </motion.div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        animate={{
          backgroundImage: [
            `linear-gradient(135deg, ${THEMES[themeIdx].swatch[0]}, ${THEMES[themeIdx].swatch[1]})`,
          ],
          boxShadow: [
            `0 0 18px ${THEMES[themeIdx].swatch[0]}88`,
            `0 0 32px ${THEMES[themeIdx].swatch[1]}88`,
            `0 0 18px ${THEMES[themeIdx].swatch[0]}88`,
          ],
        }}
        transition={{ boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
        title="Switch theme"
        style={{
          width: 44, height: 44, borderRadius: '50%',
          background: `linear-gradient(135deg, ${THEMES[themeIdx].swatch[0]}, ${THEMES[themeIdx].swatch[1]})`,
          border: '2px solid rgba(255,255,255,0.3)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)',
        }}>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
          <Palette className="w-5 h-5 text-white" />
        </motion.div>
      </motion.button>

      {/* Label below button */}
      <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider leading-none">
        Theme
      </span>
    </div>
  );
};
