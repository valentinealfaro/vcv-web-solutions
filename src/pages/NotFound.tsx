import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Home, Search } from 'lucide-react';

const GLITCH_CHARS = '!@#$%^&*ABCDEFxyz0123456789';

const GlitchChar = ({ char, delay }: { char: string; delay: number }) => {
  const [display, setDisplay] = useState(char);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.08) {
        setDisplay(GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]);
        setTimeout(() => setDisplay(char), 120);
      }
    }, 100 + delay * 20);
    return () => clearInterval(interval);
  }, [char, delay]);

  return <span>{display}</span>;
};

export default function NotFound() {
  const [clickCount, setClickCount] = useState(0);
  const errorText = '404';

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 scanlines" />

      {/* Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-600/10 rounded-full blur-[80px] animate-orb" />
      <div className="absolute bottom-20 right-20 w-56 h-56 bg-purple-600/12 rounded-full blur-[70px] animate-orb-delay" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center relative z-10 max-w-2xl">

        {/* Big 404 */}
        <div
          className="font-display text-[12rem] md:text-[18rem] leading-none select-none cursor-pointer mb-0"
          onClick={() => setClickCount(c => c + 1)}
          title="Click me...">
          <span className="gradient-text glitch" data-text="404">
            {errorText.split('').map((c, i) => (
              <GlitchChar key={i} char={c} delay={i * 5} />
            ))}
          </span>
        </div>

        {/* Easter egg */}
        {clickCount >= 5 && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-purple-400 text-sm font-mono mb-4 -mt-4">
            {clickCount >= 10
              ? '🎮 Achievement unlocked: "Truly Lost" — You clicked {clickCount} times. Respect.'
              : `You've clicked ${clickCount} times. Keep going...`}
          </motion.p>
        )}

        <div className="glass-card inline-block px-4 py-1.5 mb-6 mx-auto">
          <code className="text-blue-400 text-xs font-mono">ERROR_PAGE_NOT_FOUND</code>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          This page got lost in the{' '}
          <span className="gradient-text">digital void</span>
        </h1>

        <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          Looks like this URL doesn't exist — but your future high-converting website does. Let's build it.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/"
            className="btn-neon btn-glow text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 group">
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <Link to="/free-demo"
            className="glass-card text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 group hover:border-blue-500/40 transition-all">
            Get Free Demo
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Retro terminal-style box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 glass-card p-6 text-left font-mono text-xs max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="text-gray-600 ml-2">terminal</span>
          </div>
          <div className="space-y-1">
            <p><span className="text-green-400">vcv@websolutions</span><span className="text-gray-500">:~$</span> <span className="text-white">find {window.location.pathname}</span></p>
            <p className="text-red-400">find: page not found</p>
            <p><span className="text-green-400">vcv@websolutions</span><span className="text-gray-500">:~$</span> <span className="text-white">cd /home</span></p>
            <p className="text-blue-400">Redirecting to safety...</p>
            <p className="text-gray-500">
              <span className="inline-block w-2 h-4 bg-blue-400 align-middle animate-pulse" />
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
