'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Theme {
  id:     string;
  label:  string;
  emoji:  string;
  filter: string;
  /* preview swatch colours shown in the switcher */
  swatch: [string, string];
}

export const THEMES: Theme[] = [
  {
    id: 'default',
    label: 'Dark Galaxy',
    emoji: '🌌',
    filter: '',
    swatch: ['#2563eb', '#7c3aed'],
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk',
    emoji: '⚡',
    filter: 'hue-rotate(155deg) saturate(1.7) brightness(1.05)',
    swatch: ['#ff00c8', '#00eaff'],
  },
  {
    id: 'inferno',
    label: 'Inferno',
    emoji: '🔥',
    filter: 'hue-rotate(200deg) saturate(1.6) brightness(0.97)',
    swatch: ['#ff4400', '#ffaa00'],
  },
  {
    id: 'matrix',
    label: 'Matrix',
    emoji: '💚',
    filter: 'hue-rotate(110deg) saturate(2.1) brightness(0.92)',
    swatch: ['#00ff41', '#00aa2a'],
  },
  {
    id: 'synthwave',
    label: 'Synthwave',
    emoji: '🌆',
    filter: 'hue-rotate(265deg) saturate(1.5) brightness(1.05)',
    swatch: ['#bf00ff', '#ff2d78'],
  },
  {
    id: 'gold',
    label: 'Gold Rush',
    emoji: '✨',
    filter: 'hue-rotate(38deg) saturate(1.9) brightness(1.02)',
    swatch: ['#ffcc00', '#ff7700'],
  },
  {
    id: 'toxic',
    label: 'Toxic Waste',
    emoji: '☢️',
    filter: 'hue-rotate(78deg) saturate(2.3) brightness(0.94)',
    swatch: ['#aaff00', '#00ff88'],
  },
  {
    id: 'bloodmoon',
    label: 'Blood Moon',
    emoji: '🩸',
    filter: 'hue-rotate(320deg) saturate(1.8) brightness(0.94)',
    swatch: ['#ff0044', '#cc00ff'],
  },
  {
    id: 'light',
    label: 'Light Mode',
    emoji: '☀️',
    /* invert + hue-rotate(180) flips dark→light while keeping colour hues */
    filter: 'invert(1) hue-rotate(180deg)',
    swatch: ['#ffffff', '#e5e7eb'],
  },
];

interface ThemeCtx {
  themeIdx: number;
  theme:    Theme;
  setThemeIdx: (i: number) => void;
}

const Ctx = createContext<ThemeCtx>({
  themeIdx: 0,
  theme: THEMES[0],
  setThemeIdx: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeIdx, setThemeIdx] = useState(0);

  // Restore saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('vcv-theme-idx');
    if (saved !== null) {
      const idx = Number(saved);
      if (idx >= 0 && idx < THEMES.length) setThemeIdx(idx);
    }
  }, []);

  // Apply filter to <html> — doesn't break position:fixed children
  useEffect(() => {
    const html = document.documentElement;
    html.style.filter = THEMES[themeIdx].filter;
    html.setAttribute('data-theme', THEMES[themeIdx].id);
    localStorage.setItem('vcv-theme-idx', String(themeIdx));
    return () => { html.style.filter = ''; html.removeAttribute('data-theme'); };
  }, [themeIdx]);

  return (
    <Ctx.Provider value={{ themeIdx, theme: THEMES[themeIdx], setThemeIdx }}>
      {children}
    </Ctx.Provider>
  );
};

export const useTheme = () => useContext(Ctx);
