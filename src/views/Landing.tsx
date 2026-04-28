'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useForm } from 'react-hook-form';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import {
  CheckCircle2, Rocket, ShieldCheck, Zap, ArrowRight, Loader2,
  Star, Clock, TrendingUp, Phone, Eye, Award,
} from 'lucide-react';
import { cn } from '../lib/utils';
import {
  ParticleCanvas, StaticElectricity, MarqueeBand,
  SectionOrbs, GridOverlay,
} from '@/components/PageEffects';

const inputCls = (err: boolean) => cn(
  'w-full bg-white/[0.04] border rounded-xl px-4 py-3.5 text-white text-sm',
  'focus:outline-none focus:border-blue-500/60 focus:bg-white/[0.06] transition-all',
  'placeholder:text-gray-600 font-medium',
  err ? 'border-red-500/60' : 'border-white/[0.08] hover:border-white/15',
);

const BENEFITS = [
  { icon: <Eye className="w-5 h-5" />,         color: '#3b82f6', title: 'See It Before You Pay',       body: 'We build a fully custom preview of your site — you approve it, then we launch it.' },
  { icon: <Clock className="w-5 h-5" />,        color: '#8b5cf6', title: 'Preview Ready in 48 Hours',   body: 'Fast turnaround so you can make a decision quickly and get live even faster.' },
  { icon: <TrendingUp className="w-5 h-5" />,   color: '#06b6d4', title: 'Built to Generate Leads',     body: 'Every page is engineered for calls, form fills, and local search visibility.' },
  { icon: <Award className="w-5 h-5" />,        color: '#22c55e', title: '30-Day Results Guarantee',    body: 'If your site is not generating leads in 30 days, we optimize it at no extra cost.' },
  { icon: <ShieldCheck className="w-5 h-5" />,  color: '#ec4899', title: 'You Own Everything',          body: 'Your domain, code, and content — no lock-in, no hostage sites.' },
];

const STEPS = [
  { n: '01', label: 'Fill out the form below',       sub: 'Takes under 2 minutes'         },
  { n: '02', label: 'We build your custom preview',  sub: 'Ready within 48 hours'         },
  { n: '03', label: 'You review and approve it',     sub: 'Request unlimited changes'     },
  { n: '04', label: 'Choose your plan and go live',  sub: 'From $147/mo — cancel anytime' },
];

export default function Landing() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess,    setIsSuccess]    = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'leads'), {
        ...data, createdAt: serverTimestamp(), status: 'new',
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
    <div className="min-h-screen bg-[#030712]">

      {/* ── Hero ── */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <ParticleCanvas />
        <SectionOrbs variant="mixed" />
        <GridOverlay gridOp={0.35} dotOp={0.15} />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:.7 }}>

            {/* Badge */}
            <motion.div
              animate={{ scale:[1,1.04,1] }}
              transition={{ duration:2.2, repeat:Infinity, ease:'easeInOut' }}
              className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/35 rounded-full px-5 py-2 mb-6">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse inline-block" />
              <span className="text-yellow-300 font-bold text-sm tracking-wide">NOW TAKING NEW CLIENTS — LIMITED SPOTS THIS MONTH</span>
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse inline-block" />
            </motion.div>

            <h1 className="font-display leading-none text-white mb-2"
              style={{ fontSize:'clamp(3.5rem,9vw,7rem)', textShadow:'0 0 60px rgba(37,99,235,0.5), 0 0 120px rgba(124,58,237,0.25)' }}>
              GET YOUR CUSTOM
            </h1>
            <h1 className="font-display leading-none gradient-text mb-6"
              style={{ fontSize:'clamp(3.5rem,9vw,7rem)' }}>
              DESIGN PREVIEW
            </h1>

            <p className="text-gray-300 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              We build a fully custom website preview for your business — tailored to your market and designed to generate real leads.{' '}
              <span className="text-white font-bold">See exactly what you are getting before you choose a plan.</span>
            </p>

            {/* 3 quick stat pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {[
                { icon:<Clock className="w-4 h-4"/>, text:'Preview ready in 48 hrs', color:'#3b82f6' },
                { icon:<TrendingUp className="w-4 h-4"/>, text:'From $147/mo after approval', color:'#8b5cf6' },
                { icon:<Award className="w-4 h-4"/>, text:'30-day results guarantee', color:'#22c55e' },
              ].map((p,i) => (
                <motion.div key={i}
                  initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay:0.4 + i*0.1 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
                  style={{ background:`${p.color}15`, border:`1px solid ${p.color}45`, color:p.color }}>
                  {p.icon} {p.text}
                </motion.div>
              ))}
            </div>

            {/* CTA arrow down */}
            <motion.div
              animate={{ y:[0,8,0] }} transition={{ duration:1.8, repeat:Infinity, ease:'easeInOut' }}
              className="text-blue-400 opacity-60 text-2xl">↓</motion.div>

          </motion.div>
        </div>
      </section>

      <MarqueeBand />

      {/* ── Form + Benefits ── */}
      <section className="py-16 relative overflow-hidden bg-[#030712]">
        <StaticElectricity />
        <SectionOrbs variant="blue" />
        <GridOverlay gridOp={0.22} dotOp={0.1} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Left: benefits + process */}
            <motion.div initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }} transition={{ duration:.7 }}>

              <h2 className="font-display text-4xl text-white mb-2">WHAT HAPPENS NEXT?</h2>
              <p className="text-gray-400 mb-8">Here is exactly what you get when you submit the form.</p>

              {/* 4-step process */}
              <div className="space-y-4 mb-10">
                {STEPS.map((s, i) => (
                  <motion.div key={i}
                    initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
                    transition={{ delay:0.2 + i*0.1 }}
                    className="flex items-start gap-4 glass-card p-4">
                    <span className="font-display text-2xl text-blue-400 flex-shrink-0" style={{ textShadow:'0 0 15px rgba(59,130,246,0.6)' }}>{s.n}</span>
                    <div>
                      <p className="text-white font-bold text-sm">{s.label}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{s.sub}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Benefits */}
              <h3 className="font-display text-2xl text-white mb-4">WHAT IS INCLUDED</h3>
              <div className="space-y-3 mb-8">
                {BENEFITS.map((b, i) => (
                  <motion.div key={i}
                    initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
                    transition={{ delay:0.5 + i*0.08 }}
                    className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background:`${b.color}18`, color:b.color, border:`1px solid ${b.color}35` }}>
                      {b.icon}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{b.title}</p>
                      <p className="text-gray-500 text-xs">{b.body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social proof */}
              <div className="glass-card p-5 flex items-center gap-4">
                <div className="flex -space-x-2 flex-shrink-0">
                  {['JR','MT','DK','SR','AL'].map((l, i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-[#030712] flex items-center justify-center text-white text-xs font-bold"
                      style={{ background:`linear-gradient(135deg,${['#3b82f6','#8b5cf6','#06b6d4','#22c55e','#ec4899'][i]},${['#8b5cf6','#06b6d4','#22c55e','#ec4899','#3b82f6'][i]})` }}>
                      {l}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5 mb-1">
                    {[...Array(5)].map((_,i) => <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400"/>)}
                  </div>
                  <p className="text-white text-sm font-semibold">50+ local businesses launched</p>
                  <p className="text-gray-500 text-xs">Contractors, roofers, HVAC, restaurants, and more</p>
                </div>
              </div>

              {/* Phone CTA */}
              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 btn-neon rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-white"/>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Prefer to talk first?</p>
                  <a href="tel:+15809191386" className="text-blue-400 text-sm font-semibold hover:text-blue-300 transition-colors">(580) 919-1386 — call or text</a>
                </div>
              </div>
            </motion.div>

            {/* Right: Form */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
              <div className="neon-card p-8 md:p-10" style={{ borderColor:'rgba(37,99,235,0.3)', boxShadow:'0 0 60px rgba(37,99,235,0.1)' }}>

                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.div key="success"
                      initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }}
                      className="text-center py-12">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                        style={{ background:'rgba(74,222,128,0.15)', border:'2px solid rgba(74,222,128,0.4)' }}>
                        <CheckCircle2 className="w-10 h-10 text-green-400"/>
                      </div>
                      <h3 className="font-display text-5xl text-white mb-3">YOU ARE IN!</h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-2 max-w-xs mx-auto">
                        We are already building your custom design preview. Expect to hear from us within 24 hours.
                      </p>
                      <p className="text-blue-400 text-sm font-semibold mb-8">Check your email — we may have questions about your business.</p>
                      <button onClick={() => setIsSuccess(false)}
                        className="btn-neon text-white px-8 py-3 rounded-xl font-bold text-sm">
                        Submit Another Request
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div key="form">
                      <div className="mb-7">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 btn-neon rounded-xl flex items-center justify-center flex-shrink-0">
                            <Rocket className="w-5 h-5 text-white"/>
                          </div>
                          <div>
                            <h3 className="font-display text-3xl text-white leading-none">REQUEST YOUR PREVIEW</h3>
                            <p className="text-gray-500 text-xs mt-1">We start building within 24 hours of receiving this</p>
                          </div>
                        </div>
                        <div className="h-px bg-gradient-to-r from-blue-600/40 via-purple-600/20 to-transparent" />
                      </div>

                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Full Name *</label>
                            <input {...register('name',{required:true})} placeholder="John Smith" className={inputCls(!!errors.name)}/>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Business Name *</label>
                            <input {...register('businessName',{required:true})} placeholder="Acme Roofing" className={inputCls(!!errors.businessName)}/>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email Address *</label>
                          <input {...register('email',{required:true,pattern:/^\S+@\S+$/i})} type="email" placeholder="john@example.com" className={inputCls(!!errors.email)}/>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Phone Number *</label>
                            <input {...register('phone',{required:true})} type="tel" placeholder="(555) 000-0000" className={inputCls(!!errors.phone)}/>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Business Type *</label>
                            <select {...register('businessType',{required:true})} className={cn(inputCls(!!errors.businessType),'cursor-pointer')}>
                              <option value="" className="bg-gray-900">Select type...</option>
                              <option value="contractor"   className="bg-gray-900">Contractor / Home Services</option>
                              <option value="roofing"      className="bg-gray-900">Roofing</option>
                              <option value="hvac"         className="bg-gray-900">HVAC / Plumbing / Electric</option>
                              <option value="restaurant"   className="bg-gray-900">Restaurant / Food</option>
                              <option value="professional" className="bg-gray-900">Professional Services</option>
                              <option value="retail"       className="bg-gray-900">Retail / E-commerce</option>
                              <option value="other"        className="bg-gray-900">Other</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Current Website (if any)</label>
                          <input {...register('currentSite')} placeholder="https://yoursite.com or none" className={inputCls(false)}/>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">What is your main goal? *</label>
                          <select {...register('goal',{required:true})} className={cn(inputCls(!!errors.goal),'cursor-pointer')}>
                            <option value="" className="bg-gray-900">Select goal...</option>
                            <option value="more-leads"    className="bg-gray-900">Get more leads and phone calls</option>
                            <option value="new-site"      className="bg-gray-900">Replace an outdated website</option>
                            <option value="launch"        className="bg-gray-900">Launch a brand new business online</option>
                            <option value="seo"           className="bg-gray-900">Rank higher on Google</option>
                            <option value="ads"           className="bg-gray-900">Run Google or Facebook Ads</option>
                          </select>
                        </div>

                        {/* Rainbow submit button */}
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-4 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                          animate={{
                            backgroundImage:[
                              'linear-gradient(135deg,#ef4444,#f97316)',
                              'linear-gradient(135deg,#f97316,#eab308)',
                              'linear-gradient(135deg,#eab308,#22c55e)',
                              'linear-gradient(135deg,#22c55e,#06b6d4)',
                              'linear-gradient(135deg,#06b6d4,#3b82f6)',
                              'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                              'linear-gradient(135deg,#8b5cf6,#ec4899)',
                              'linear-gradient(135deg,#ec4899,#ef4444)',
                            ],
                            boxShadow:[
                              '0 0 22px rgba(239,68,68,0.65)',
                              '0 0 22px rgba(249,115,22,0.65)',
                              '0 0 22px rgba(234,179,8,0.65)',
                              '0 0 22px rgba(34,197,94,0.65)',
                              '0 0 22px rgba(6,182,212,0.65)',
                              '0 0 22px rgba(59,130,246,0.65)',
                              '0 0 22px rgba(139,92,246,0.65)',
                              '0 0 22px rgba(236,72,153,0.65)',
                            ],
                          }}
                          transition={{ duration:4, repeat:Infinity, ease:'linear' }}
                          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                          whileTap={{ scale:0.97 }}>
                          {isSubmitting
                            ? <><Loader2 className="w-5 h-5 animate-spin"/> Building your preview...</>
                            : <>Request My Design Preview <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/></>}
                        </motion.button>

                        <p className="text-center text-xs text-gray-600 leading-relaxed">
                          By submitting you agree to our{' '}
                          <a href="/terms" className="text-blue-500 hover:text-blue-400 underline underline-offset-2">Terms of Service</a>
                          {' '}and{' '}
                          <a href="/terms#privacy" className="text-blue-500 hover:text-blue-400 underline underline-offset-2">Privacy Policy</a>.
                          {' '}We will never spam you or share your info.
                        </p>

                        {/* Pricing reminder */}
                        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 pt-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0"/>
                          Preview is complimentary — plans start at $147/mo after you approve the design
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
