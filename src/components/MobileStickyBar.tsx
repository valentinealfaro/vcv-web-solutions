'use client';
import { motion } from 'motion/react';
import { Phone, MessageCircle } from 'lucide-react';

// 8-step palette — Button B is shifted 4 steps so they are always different
const A = ['#ef4444','#f97316','#22c55e','#06b6d4','#3b82f6','#8b5cf6','#ec4899','#ef4444'];
const B = ['#3b82f6','#8b5cf6','#ec4899','#ef4444','#f97316','#22c55e','#06b6d4','#3b82f6'];

const SHADOW_A = [
  '0 -2px 18px rgba(239,68,68,0.7)',
  '0 -2px 18px rgba(249,115,22,0.7)',
  '0 -2px 18px rgba(34,197,94,0.7)',
  '0 -2px 18px rgba(6,182,212,0.7)',
  '0 -2px 18px rgba(59,130,246,0.7)',
  '0 -2px 18px rgba(139,92,246,0.7)',
  '0 -2px 18px rgba(236,72,153,0.7)',
  '0 -2px 18px rgba(239,68,68,0.7)',
];
const SHADOW_B = [
  '0 -2px 18px rgba(59,130,246,0.7)',
  '0 -2px 18px rgba(139,92,246,0.7)',
  '0 -2px 18px rgba(236,72,153,0.7)',
  '0 -2px 18px rgba(239,68,68,0.7)',
  '0 -2px 18px rgba(249,115,22,0.7)',
  '0 -2px 18px rgba(34,197,94,0.7)',
  '0 -2px 18px rgba(6,182,212,0.7)',
  '0 -2px 18px rgba(59,130,246,0.7)',
];

const DUR = 3.2;

export function MobileStickyBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden">
      <motion.a
        href="tel:+15809191386"
        className="flex-1 py-4 text-center font-bold text-sm flex items-center justify-center gap-2 text-white"
        style={{ textShadow:'0 1px 4px rgba(0,0,0,0.7)' }}
        animate={{ backgroundColor: A, boxShadow: SHADOW_A }}
        transition={{ duration: DUR, repeat: Infinity, ease: 'linear' }}>
        <Phone className="w-4 h-4" /> Call Now
      </motion.a>
      <motion.a
        href="sms:+15809191386"
        className="flex-1 py-4 text-center font-bold text-sm flex items-center justify-center gap-2 text-white"
        style={{ textShadow:'0 1px 4px rgba(0,0,0,0.7)' }}
        animate={{ backgroundColor: B, boxShadow: SHADOW_B }}
        transition={{ duration: DUR, repeat: Infinity, ease: 'linear' }}>
        <MessageCircle className="w-4 h-4" /> Text Us
      </motion.a>
    </div>
  );
}
