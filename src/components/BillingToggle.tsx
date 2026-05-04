'use client';
import { motion } from 'motion/react';

export type Billing = 'monthly' | 'annual';

interface Props {
  value: Billing;
  onChange: (b: Billing) => void;
  className?: string;
}

export const BillingToggle = ({ value, onChange, className = '' }: Props) => (
  <div className={`flex flex-col items-center gap-2 ${className}`}>
    <div
      className="inline-flex p-1 rounded-full relative"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(8px)',
      }}>

      {(['monthly', 'annual'] as const).map(b => (
        <button
          key={b}
          onClick={() => onChange(b)}
          className="relative z-10 px-5 md:px-7 py-2 text-sm font-bold rounded-full transition-colors"
          style={{ color: value === b ? '#0a0f1e' : 'rgba(229,231,235,0.85)' }}>
          {value === b && (
            <motion.span
              layoutId="billing-pill"
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(135deg,#22c55e,#06b6d4)',
                boxShadow: '0 4px 18px rgba(34,197,94,0.45)',
              }}
            />
          )}
          <span className="relative z-10">
            {b === 'monthly' ? 'Monthly' : 'Annual'}
          </span>
        </button>
      ))}
    </div>

    {value === 'annual' && (
      <motion.span
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-1.5 text-green-400 text-xs font-bold">
        🎉 Save up to <span className="text-white">$994/yr</span> · 2 months free
      </motion.span>
    )}
    {value === 'monthly' && (
      <span className="text-gray-500 text-xs">
        Switch to <button
          onClick={() => onChange('annual')}
          className="text-green-400 font-bold hover:text-green-300 underline underline-offset-2">
          Annual
        </button> for 2 months free
      </span>
    )}
  </div>
);
