'use client';
import { useState } from 'react';
import { MarkerHighlight } from '@/components/ui/marker-highlight';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { CheckCircle2, Rocket, ShieldCheck, Zap, ArrowRight, Loader2, Star, Clock, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';

const benefits = [
  { icon: <Zap className="w-5 h-5" />, text: 'Custom layout built for your business' },
  { icon: <Clock className="w-5 h-5" />, text: 'Ready to review in 48 hours' },
  { icon: <TrendingUp className="w-5 h-5" />, text: 'Designed to convert visitors to leads' },
  { icon: <ShieldCheck className="w-5 h-5" />, text: 'No credit card — 100% risk-free' },
  { icon: <Star className="w-5 h-5" />, text: 'Expert feedback & strategy included' },
];

export default function Landing() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'leads'), {
        ...data,
        createdAt: serverTimestamp(),
        status: 'new',
      });
      setIsSuccess(true);
      reset();
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] pt-28 pb-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full animate-orb pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-[300px] h-[300px] bg-purple-600/8 blur-[80px] rounded-full animate-orb-delay pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: Sales copy */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div className="neon-badge mb-6">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full inline-block animate-pulse" />
              Limited Free Spots Available
            </div>

            <h1 className="font-display text-[4.5rem] md:text-[6rem] leading-none text-white mb-4">
              GET YOUR
            </h1>
            <h1 className="font-display text-[4.5rem] md:text-[6rem] leading-none gradient-text mb-6 glitch" data-text="FREE DEMO">
              FREE DEMO
            </h1>

            <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-lg">
              Stop guessing what your website could look like. We'll build a real custom preview for your business at{' '}
              <MarkerHighlight
                highlight="zero cost"
                markerColor="rgba(37, 99, 235, 0.9)"
                delay={0.6}
                className="text-white font-bold"
              />{' '}
              — so you see the results before you invest a single dollar.
            </p>

            <div className="space-y-4 mb-10">
              {benefits.map((b, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/15 flex items-center justify-center text-blue-400 flex-shrink-0">
                    {b.icon}
                  </div>
                  <span className="text-white font-medium text-sm">{b.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Trust block */}
            <div className="glass-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 btn-neon rounded-full flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="text-white w-6 h-6" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">100% Free, No Obligations</p>
                <p className="text-gray-500 text-xs">No credit card. No hidden fees. No pressure. Just value.</p>
              </div>
            </div>

            {/* Social proof */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex -space-x-2">
                {['J', 'M', 'D', 'R'].map((l, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 border-2 border-[#030712] flex items-center justify-center text-white text-xs font-bold">
                    {l}
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-xs">
                <span className="text-white font-semibold">50+ businesses</span> already got their free demo
              </p>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="neon-card p-8 md:p-10">

            {isSuccess ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                <div className="w-20 h-20 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="text-green-400 w-10 h-10" />
                </div>
                <h3 className="font-display text-5xl text-white mb-3">SUBMITTED!</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                  Our team is already reviewing your business. We'll be in touch within 24 hours with your custom demo.
                </p>
                <button onClick={() => setIsSuccess(false)}
                  className="btn-neon text-white px-8 py-3.5 rounded-xl font-bold text-sm">
                  Submit Another
                </button>
              </motion.div>
            ) : (
              <>
                <div className="mb-7">
                  <h3 className="font-display text-4xl text-white mb-1">BUILD MY FREE DEMO</h3>
                  <p className="text-gray-500 text-sm">Fill out below — we'll start immediately.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
                      <input
                        {...register('name', { required: true })}
                        placeholder="John Smith"
                        className={cn(
                          'w-full bg-[#030712] border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/60 transition-all placeholder:text-gray-600',
                          errors.name ? 'border-red-500/60' : 'border-white/[0.08] hover:border-white/15'
                        )}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Business Name</label>
                      <input
                        {...register('businessName', { required: true })}
                        placeholder="Acme Roofing"
                        className={cn(
                          'w-full bg-[#030712] border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/60 transition-all placeholder:text-gray-600',
                          errors.businessName ? 'border-red-500/60' : 'border-white/[0.08] hover:border-white/15'
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email Address</label>
                    <input
                      {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                      placeholder="john@example.com"
                      className={cn(
                        'w-full bg-[#030712] border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/60 transition-all placeholder:text-gray-600',
                        errors.email ? 'border-red-500/60' : 'border-white/[0.08] hover:border-white/15'
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                      <input
                        {...register('phone', { required: true })}
                        placeholder="+1 (555) 000-0000"
                        className={cn(
                          'w-full bg-[#030712] border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/60 transition-all placeholder:text-gray-600',
                          errors.phone ? 'border-red-500/60' : 'border-white/[0.08] hover:border-white/15'
                        )}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Business Type</label>
                      <select
                        {...register('businessType', { required: true })}
                        className={cn(
                          'w-full bg-[#030712] border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/60 transition-all',
                          errors.businessType ? 'border-red-500/60' : 'border-white/[0.08] hover:border-white/15'
                        )}
                      >
                        <option value="" className="bg-gray-900">Select type...</option>
                        <option value="contractor" className="bg-gray-900">Contractor / Home Services</option>
                        <option value="restaurant" className="bg-gray-900">Restaurant / Food</option>
                        <option value="professional" className="bg-gray-900">Professional Services</option>
                        <option value="ecommerce" className="bg-gray-900">E-commerce / Retail</option>
                        <option value="other" className="bg-gray-900">Other</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-neon btn-glow text-white py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 disabled:opacity-50 group mt-2">
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Build My Free Demo
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-gray-600 leading-relaxed">
                    By submitting, you agree to our terms & privacy policy. We'll never spam you.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
