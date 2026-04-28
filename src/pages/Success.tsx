'use client';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Success() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center bg-gray-900 border border-white/10 p-12 rounded-3xl max-w-lg w-full"
      >
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="text-green-500 w-10 h-10" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Payment Successful!</h1>
        <p className="text-gray-400 mb-8">
          Thank you for your purchase. Let's get your website started.
        </p>
        <Link
          href="/website-onboarding"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
        >
          Start Onboarding
        </Link>
      </motion.div>
    </div>
  );
}
