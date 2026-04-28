'use client';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const BG = [
  'linear-gradient(135deg,#ef4444,#f97316)',
  'linear-gradient(135deg,#f97316,#eab308)',
  'linear-gradient(135deg,#eab308,#22c55e)',
  'linear-gradient(135deg,#22c55e,#06b6d4)',
  'linear-gradient(135deg,#06b6d4,#3b82f6)',
  'linear-gradient(135deg,#3b82f6,#8b5cf6)',
  'linear-gradient(135deg,#8b5cf6,#ec4899)',
  'linear-gradient(135deg,#ec4899,#ef4444)',
];
const GLOW = [
  '0 0 22px rgba(239,68,68,0.65)',
  '0 0 22px rgba(249,115,22,0.65)',
  '0 0 22px rgba(234,179,8,0.65)',
  '0 0 22px rgba(34,197,94,0.65)',
  '0 0 22px rgba(6,182,212,0.65)',
  '0 0 22px rgba(59,130,246,0.65)',
  '0 0 22px rgba(139,92,246,0.65)',
  '0 0 22px rgba(236,72,153,0.65)',
];

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE: Record<Size, string> = {
  xs: 'px-4  py-2    text-xs  gap-1.5 rounded-full',
  sm: 'px-5  py-2.5  text-sm  gap-1.5 rounded-full',
  md: 'px-8  py-4    text-base gap-2  rounded-full',
  lg: 'px-10 py-4    text-lg  gap-2   rounded-full',
  xl: 'px-12 py-5    text-xl  gap-3   rounded-full',
};

const ICON: Record<Size, string> = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-5 h-5',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6',
};

interface FreeDemoButtonProps {
  size?:      Size;
  label?:     string;
  className?: string;
  fullWidth?: boolean;
  rounded?:   'full' | 'xl' | '2xl';
  duration?:  number;
  onClick?:   () => void;
  showZap?:   boolean;
}

export function FreeDemoButton({
  size      = 'md',
  label     = 'Get My Free Demo',
  className,
  fullWidth = false,
  rounded   = 'full',
  duration  = 4,
  onClick,
  showZap   = false,
}: FreeDemoButtonProps) {
  const rClass = rounded === 'full' ? 'rounded-full' : rounded === 'xl' ? 'rounded-xl' : 'rounded-2xl';

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={cn(fullWidth ? 'w-full' : 'inline-flex')}>
      <Link
        href="/free-demo"
        onClick={onClick}
        className={cn(
          'relative overflow-hidden font-bold text-white flex items-center justify-center group',
          SIZE[size].replace('rounded-full', rClass),
          fullWidth && 'w-full',
          className,
        )}>
        {/* Rainbow animated background */}
        <motion.span
          className={cn('absolute inset-0', rClass)}
          animate={{ backgroundImage: BG, boxShadow: GLOW }}
          transition={{ duration, repeat: Infinity, ease: 'linear' }}
        />
        {showZap && <Zap className={cn(ICON[size], 'relative z-10 flex-shrink-0')} />}
        <span className="relative z-10">{label}</span>
        <ArrowRight className={cn(ICON[size], 'relative z-10 flex-shrink-0 group-hover:translate-x-1 transition-transform')} />
      </Link>
    </motion.div>
  );
}
