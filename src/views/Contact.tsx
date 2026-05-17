'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import {
  CheckCircle2, Mail, Phone, Globe, ArrowRight, Loader2,
  Clock, Zap, MessageSquare, Sparkles, Shield, Star,
} from 'lucide-react';
import { FreeDemoButton } from '@/components/FreeDemoButton';
import { MarqueeBand } from '@/components/PageEffects';

/* ─── Helpers ─────────────────────────────────────────────── */
const fade   = (d = 0) => ({ initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { delay: d, duration: 0.6 }, viewport: { once: true } });
const slideL = (d = 0) => ({ initial: { opacity: 0, x: -30 }, whileInView: { opacity: 1, x: 0 }, transition: { delay: d, duration: 0.6 }, viewport: { once: true } });
const slideR = (d = 0) => ({ initial: { opacity: 0, x: 30  }, whileInView: { opacity: 1, x: 0 }, transition: { delay: d, duration: 0.6 }, viewport: { once: true } });

/* ─── Glowing field wrapper ─────────────────────────────── */
const GlowInput = ({ label, children, icon }: { label: string; children: React.ReactNode; icon?: React.ReactNode }) => (
  <div className="relative group">
    <label className="flex items-center gap-1.5 text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
      {icon && <span className="text-blue-400 opacity-70">{icon}</span>}
      {label}
    </label>
    <div className="relative">
      {/* animated glow ring on focus-within */}
      <div className="absolute -inset-px rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: 'linear-gradient(135deg,#2563eb44,#7c3aed44,#06b6d444)', borderRadius: 13 }} />
      {children}
    </div>
  </div>
);

const inputCls = "w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all text-sm font-medium relative z-10";

/* ─── HLS Hero Video ─────────────────────────────────────── */
const HeroVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const HLS_SRC = 'https://customer-cbeadsgr09pnsezs.cloudflarestream.com/697945ca6b876878dba3b23fbd2f1561/manifest/video.m3u8';
    const MP4_SRC = '/_videos/v1/f0c78f536d5f21a047fb7792723a36f9d647daa1';

    let hlsInstance: import('hls.js').default | null = null;

    const startNative = () => {
      video.src = HLS_SRC;
      video.onerror = () => { video.src = MP4_SRC; };
      video.play().catch(() => {});
    };

    import('hls.js').then(({ default: Hls }) => {
      if (Hls.isSupported()) {
        hlsInstance = new Hls({ lowLatencyMode: true, startLevel: -1 });
        hlsInstance.loadSource(HLS_SRC);
        hlsInstance.attachMedia(video);
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
        hlsInstance.on(Hls.Events.ERROR, (_e, data) => {
          if (data.fatal) { hlsInstance?.destroy(); video.src = MP4_SRC; video.play().catch(() => {}); }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        startNative();
      } else {
        video.src = MP4_SRC;
        video.play().catch(() => {});
      }
    }).catch(() => startNative());

    return () => { hlsInstance?.destroy(); };
  }, []);

  return (
    <div className="relative w-full pointer-events-none select-none overflow-hidden" style={{ marginTop: -120 }}>
      {/* fade edges */}
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #030712 0%, transparent 18%, transparent 82%, #030712 100%)' }} />
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #030712 0%, transparent 30%, transparent 60%, #030712 100%)' }} />
      <video
        ref={videoRef}
        muted autoPlay loop playsInline
        className="w-full"
        style={{ mixBlendMode: 'screen', display: 'block', opacity: 0.65 }}
      />
    </div>
  );
};

/* ─── Infinite Logo Slider ───────────────────────────────── */
const LOGOS = [
  { src: 'https://html.tailus.io/blocks/customers/openai.svg',  alt: 'OpenAI'  },
  { src: 'https://html.tailus.io/blocks/customers/nvidia.svg',  alt: 'Nvidia'  },
  { src: 'https://html.tailus.io/blocks/customers/github.svg',  alt: 'GitHub'  },
  { src: 'https://html.tailus.io/blocks/customers/google.svg',  alt: 'Google'  },
  { src: 'https://html.tailus.io/blocks/customers/microsoft.svg', alt: 'Microsoft' },
  { src: 'https://html.tailus.io/blocks/customers/netflix.svg', alt: 'Netflix' },
  { src: 'https://html.tailus.io/blocks/customers/spotify.svg', alt: 'Spotify' },
  { src: 'https://html.tailus.io/blocks/customers/airbnb.svg',  alt: 'Airbnb'  },
];

const InfiniteSlider = () => {
  const doubled = [...LOGOS, ...LOGOS];
  return (
    <div className="overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right,#030712,transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left,#030712,transparent)' }} />
      <motion.div
        className="flex items-center gap-10"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
        style={{ width: 'max-content' }}>
        {doubled.map((logo, i) => (
          <div key={i} className="flex items-center justify-center flex-shrink-0 w-24 h-8 opacity-30 hover:opacity-60 transition-opacity">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo.src} alt={logo.alt} className="h-6 w-auto object-contain brightness-0 invert" loading="lazy" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

/* ─── Floating particles canvas ────────────────────────── */
const ContactParticles = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let raf: number;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    interface P { x:number; y:number; vx:number; vy:number; r:number; alpha:number; hue:number; life:number; maxLife:number }
    const particles: P[] = [];
    const HUES = [220, 260, 190, 280];
    const spawn = () => {
      const W = canvas.width, H = canvas.height;
      particles.push({
        x: Math.random() * W, y: H + 10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(0.4 + Math.random() * 0.8),
        r: 1.5 + Math.random() * 3,
        alpha: 0, hue: HUES[Math.floor(Math.random() * HUES.length)],
        life: 0, maxLife: 120 + Math.random() * 180,
      });
    };
    let tick = 0;
    const draw = () => {
      canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      tick++;
      if (tick % 3 === 0 && particles.length < 80) spawn();
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.life++;
        const t = p.life / p.maxLife;
        p.alpha = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1;
        if (p.life >= p.maxLife || p.y < -20) { particles.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},80%,70%,${p.alpha * 0.55})`;
        ctx.fill();
        if (p.r > 2) {
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue},80%,70%,${p.alpha * 0.08})`; ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    resize(); window.addEventListener('resize', resize);
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />;
};

/* ─── Animated mesh / aurora behind the form ─────────────── */
const ContactAurora = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
    {/* large slow orbs */}
    {[
      { left: '5%',  top: '10%', size: 500, hue: 220, dur: 14 },
      { left: '55%', top: '60%', size: 420, hue: 270, dur: 18 },
      { left: '75%', top: '5%',  size: 350, hue: 190, dur: 12 },
      { left: '30%', top: '80%', size: 300, hue: 300, dur: 16 },
    ].map((o, i) => (
      <motion.div key={i}
        style={{
          position: 'absolute', left: o.left, top: o.top,
          width: o.size, height: o.size, borderRadius: '50%',
          background: `radial-gradient(circle, hsla(${o.hue},80%,55%,0.12) 0%, transparent 70%)`,
          filter: 'blur(48px)',
        }}
        animate={{ scale: [1, 1.18, 1], x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: o.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 1.2 }}
      />
    ))}
    {/* subtle scan line */}
    <motion.div
      className="absolute left-0 right-0 h-px"
      style={{ background: 'linear-gradient(to right,transparent,rgba(99,102,241,0.3),transparent)' }}
      animate={{ top: ['0%', '100%'] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
    />
  </div>
);

/* ─── Animated border ring on form card ─────────────────── */
const AnimBorder = () => (
  <div className="absolute inset-0 rounded-[22px] overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
    <motion.div
      className="absolute"
      style={{
        width: 200, height: 200, borderRadius: '50%',
        background: 'conic-gradient(from 0deg,#2563eb,#7c3aed,#06b6d4,#2563eb)',
        filter: 'blur(2px)',
        top: '50%', left: '50%',
        transform: 'translate(-50%,-50%) scale(4)',
        opacity: 0.18,
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
    />
  </div>
);

/* ─── Info row ───────────────────────────────────────────── */
const INFO = [
  { icon: <Mail  className="w-5 h-5" />, label: 'Email',         val: 'info@vcvservices.com', href: 'mailto:info@vcvservices.com', color: '#3b82f6' },
  { icon: <Phone className="w-5 h-5" />, label: 'Phone',         val: '+1 (580) 919-1386',     href: 'tel:+15809191386',           color: '#8b5cf6' },
  { icon: <Clock className="w-5 h-5" />, label: 'Response Time', val: 'Within 24 hours',       href: null,                         color: '#06b6d4' },
  { icon: <Globe className="w-5 h-5" />, label: 'Service Area',  val: 'Nationwide (Remote)',   href: null,                         color: '#10b981' },
];

/* ─── Trust badges ───────────────────────────────────────── */
const TRUST = [
  { icon: <Shield  className="w-4 h-4" />, label: '30-Day Guarantee' },
  { icon: <Zap     className="w-4 h-4" />, label: '48-hr Turnaround'  },
  { icon: <Star    className="w-4 h-4" />, label: '5-Star Rated'      },
  { icon: <Sparkles className="w-4 h-4" />, label: 'No Upfront Cost'  },
];

/* ─── Cursor glow (desktop only) ────────────────────────── */
const CursorGlow = ({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) => {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 80, damping: 20 });
  const sy = useSpring(y, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const el = sectionRef.current; if (!el) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      x.set(e.clientX - r.left);
      y.set(e.clientY - r.top);
    };
    el.addEventListener('mousemove', move);
    return () => el.removeEventListener('mousemove', move);
  }, [sectionRef, x, y]);

  return (
    <motion.div
      className="absolute pointer-events-none hidden md:block"
      style={{
        left: sx, top: sy,
        width: 400, height: 400,
        x: '-50%', y: '-50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 65%)',
        borderRadius: '50%',
        zIndex: 1,
      }}
    />
  );
};

/* ══════════════════════════════════════════════════════════ */
export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', business: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');
  const sectionRef = useRef<HTMLElement>(null);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setErrMsg('Please fill in Name, Email, and Message.'); setStatus('error'); return;
    }
    setStatus('loading');
    try {
      // Save to Firestore so the lead shows up in /admin/leads
      const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
      const { db } = await import('../firebase');
      await addDoc(collection(db, 'leads'), {
        ...form, createdAt: serverTimestamp(), status: 'new', source: 'Contact',
      });
      // Email info@vcvservices.com via Resend
      const res = await fetch('/api/send-email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'Contact Form' }),
      });
      if (!res.ok) throw new Error('Failed to send');
      const { trackLead } = await import('@/components/Analytics');
      trackLead('Contact Form');
      setStatus('success'); setForm({ name: '', email: '', phone: '', business: '', message: '' });
    } catch { setErrMsg('Something went wrong. Please try again.'); setStatus('error'); }
  };

  return (
    <div className="bg-[#030712] min-h-screen">

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="relative pt-28 pb-0 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-grid opacity-[0.06] pointer-events-none" />

        {/* Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute" style={{ left:'10%', top:'20%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(37,99,235,0.15) 0%,transparent 70%)', filter:'blur(60px)' }}/>
          <div className="absolute" style={{ right:'5%', top:'10%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(124,58,237,0.12) 0%,transparent 70%)', filter:'blur(60px)' }}/>
        </div>

        {/* Announcement pill */}
        <motion.div className="flex justify-center mb-6"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-semibold text-gray-300"
            style={{ background: 'rgba(28,27,36,0.6)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
            <motion.span
              animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.6, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-green-400 inline-block" />
            We reply within 24 hours
            <motion.span
              animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.5 }}>
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
            </motion.span>
          </div>
        </motion.div>

        {/* H1 */}
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
            <p className="neon-badge mb-5 mx-auto w-fit">Let's Talk</p>
            <h1 className="font-display leading-none text-white mb-5"
              style={{ fontSize: 'clamp(3.5rem,9vw,7rem)', textShadow: '0 0 60px rgba(37,99,235,0.5), 0 0 120px rgba(124,58,237,0.25)' }}>
              GET IN<br/>
              <span className="gradient-text">TOUCH</span>
            </h1>
          </motion.div>

          <motion.p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed mb-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
            Ready to turn your website into a lead machine?<br className="hidden sm:block" />
            Send us a message and we get back to you within 24 hours.
          </motion.p>

          {/* Trust badges row */}
          <motion.div className="flex flex-wrap justify-center gap-3 mb-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            {TRUST.map((t, i) => (
              <motion.div key={i}
                whileHover={{ scale: 1.06, y: -2 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-gray-300"
                style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)' }}>
                <span className="text-blue-400">{t.icon}</span>
                {t.label}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* HLS video — bleeds edge-to-edge below the text */}
        <div className="relative z-10">
          <HeroVideo />
        </div>
      </section>

      <MarqueeBand />

      {/* ══ LOGO TRUST BAR ════════════════════════════════════ */}
      <motion.section className="py-8 border-y"
        style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255,255,255,0.05)' }}
        {...fade(0.1)}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <p className="flex-shrink-0 text-gray-500 text-xs font-bold uppercase tracking-widest text-center md:text-left whitespace-nowrap">
              Trusted by businesses<br className="hidden md:block" /> across every industry
            </p>
            <div className="hidden md:block w-px h-8 bg-white/10 flex-shrink-0" />
            <div className="flex-1 w-full min-w-0">
              <InfiniteSlider />
            </div>
          </div>
        </div>
      </motion.section>

      {/* ══ FORM + INFO ═══════════════════════════════════════ */}
      <section ref={sectionRef} className="py-20 relative overflow-hidden bg-[#030712]">
        <ContactAurora />
        <ContactParticles />
        <CursorGlow sectionRef={sectionRef} />

        {/* grid overlay */}
        <div className="absolute inset-0 bg-grid opacity-[0.05] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

            {/* ── Info column ── */}
            <div className="lg:col-span-2 space-y-4">

              {/* Section heading */}
              <motion.div {...slideL(0)} className="mb-6">
                <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">Contact Info</p>
                <h2 className="font-display text-4xl text-white leading-none" style={{ textShadow: '0 0 30px rgba(37,99,235,0.4)' }}>
                  REACH US<br/>
                  <span className="gradient-text">ANYTIME</span>
                </h2>
              </motion.div>

              {INFO.map((item, i) => (
                <motion.div key={i} {...slideL(i * 0.08)}
                  whileHover={{ x: 4, scale: 1.01 }}
                  className="glass-card p-5 flex items-center gap-4 group"
                  style={{ borderColor: `${item.color}20` }}>
                  <motion.div
                    animate={{ boxShadow: [`0 0 8px ${item.color}40`, `0 0 18px ${item.color}70`, `0 0 8px ${item.color}40`] }}
                    transition={{ duration: 2.5 + i * 0.4, repeat: Infinity }}
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${item.color}18`, color: item.color, border: `1px solid ${item.color}35` }}>
                    {item.icon}
                  </motion.div>
                  <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-0.5">{item.label}</p>
                    {item.href
                      ? <a href={item.href} className="text-white font-bold text-sm hover:text-blue-400 transition-colors">{item.val}</a>
                      : <p className="text-white font-bold text-sm">{item.val}</p>}
                  </div>
                </motion.div>
              ))}

              {/* Demo CTA card */}
              <motion.div {...slideL(0.35)}
                className="neon-card p-6 text-center relative overflow-hidden"
                style={{ borderColor: 'rgba(37,99,235,0.4)', boxShadow: '0 0 40px rgba(37,99,235,0.12)' }}
                whileHover={{ boxShadow: '0 0 60px rgba(37,99,235,0.22)' }}>
                {/* spinning ring decoration */}
                <motion.div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20"
                  style={{ border: '2px solid #3b82f6', borderTopColor: 'transparent' }}
                  animate={{ rotate: 360 }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }} />
                <div className="w-12 h-12 btn-neon rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                  <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2.8, repeat: Infinity }}>
                    <Zap className="w-5 h-5 text-white" />
                  </motion.div>
                </div>
                <h4 className="text-white font-bold text-lg mb-2 relative z-10">Want to See Results First?</h4>
                <p className="text-gray-400 text-sm mb-5 leading-relaxed relative z-10">
                  See your custom website design before you subscribe. Approve it, then we launch fast.
                </p>
                <FreeDemoButton size="sm" label="Build My Free Demo" fullWidth rounded="xl" />
              </motion.div>
            </div>

            {/* ── Form column ── */}
            <motion.div className="lg:col-span-3" {...slideR(0.12)}>
              {/* Outer glow wrapper */}
              <div className="relative p-px rounded-[22px]"
                style={{ background: 'linear-gradient(135deg,rgba(37,99,235,0.3),rgba(124,58,237,0.2),rgba(6,182,212,0.15))', boxShadow: '0 0 80px rgba(37,99,235,0.1), 0 0 160px rgba(124,58,237,0.06)' }}>

                <div className="relative rounded-[21px] overflow-hidden"
                  style={{ background: 'rgba(5,8,20,0.92)', backdropFilter: 'blur(32px)' }}>
                  <AnimBorder />

                  <div className="relative z-10 p-8 md:p-10">

                    {/* Form header */}
                    <motion.div className="flex items-center gap-3 mb-8"
                      initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                      <motion.div className="w-10 h-10 btn-neon rounded-xl flex items-center justify-center"
                        animate={{ boxShadow: ['0 0 10px rgba(37,99,235,0.4)', '0 0 25px rgba(124,58,237,0.6)', '0 0 10px rgba(37,99,235,0.4)'] }}
                        transition={{ duration: 3, repeat: Infinity }}>
                        <MessageSquare className="w-5 h-5 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-white font-bold text-xl">Send Us a Message</h3>
                        <p className="text-gray-500 text-sm">We reply within 24 hours</p>
                      </div>
                      {/* live indicator */}
                      <div className="ml-auto flex items-center gap-1.5">
                        <motion.span className="w-2 h-2 rounded-full bg-green-400 inline-block"
                          animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
                        <span className="text-green-400 text-xs font-semibold">Online</span>
                      </div>
                    </motion.div>

                    <AnimatePresence mode="wait">
                      {status === 'success' ? (
                        <motion.div key="success"
                          initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.85 }}
                          className="text-center py-12">
                          {/* success ring burst */}
                          {[0, 1, 2].map(ring => (
                            <motion.div key={ring}
                              className="absolute inset-0 rounded-full border border-green-400/30 pointer-events-none"
                              style={{ margin: 'auto', width: 90, height: 90 }}
                              initial={{ scale: 0.8, opacity: 0.8 }}
                              animate={{ scale: 2 + ring * 0.7, opacity: 0 }}
                              transition={{ duration: 1.2, delay: ring * 0.2, ease: 'easeOut' }} />
                          ))}
                          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center relative"
                            style={{ background: 'rgba(74,222,128,0.15)', border: '2px solid rgba(74,222,128,0.4)' }}>
                            <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.15 }}>
                              <CheckCircle2 className="w-10 h-10 text-green-400" />
                            </motion.div>
                          </div>
                          <h3 className="font-display text-4xl text-white mb-3">MESSAGE SENT!</h3>
                          <p className="text-gray-400 mb-6">We will be in touch within 24 hours.</p>
                          <button onClick={() => setStatus('idle')}
                            className="text-blue-400 text-sm underline underline-offset-2 hover:text-blue-300 transition-colors">
                            Send another message
                          </button>
                        </motion.div>
                      ) : (
                        <motion.form key="form" onSubmit={handleSubmit} className="space-y-5"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <GlowInput label="Name *" icon={<span className="text-[10px]">✦</span>}>
                              <input type="text" placeholder="Your full name" value={form.name}
                                onChange={set('name')} required className={inputCls} />
                            </GlowInput>
                            <GlowInput label="Business Name">
                              <input type="text" placeholder="Company (optional)" value={form.business}
                                onChange={set('business')} className={inputCls} />
                            </GlowInput>
                            <GlowInput label="Email *" icon={<Mail className="w-3 h-3" />}>
                              <input type="email" placeholder="your@email.com" value={form.email}
                                onChange={set('email')} required className={inputCls} />
                            </GlowInput>
                            <GlowInput label="Phone Number">
                              <input type="tel" placeholder="(555) 000-0000" value={form.phone}
                                onChange={set('phone')} className={inputCls} />
                            </GlowInput>
                          </div>

                          <GlowInput label="Message *" icon={<MessageSquare className="w-3 h-3" />}>
                            <textarea rows={5}
                              placeholder="Tell us about your business and what you're looking for..."
                              value={form.message} onChange={set('message')} required
                              className={`${inputCls} resize-none`} />
                          </GlowInput>

                          {status === 'error' && (
                            <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                              className="text-red-400 text-sm flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                              {errMsg}
                            </motion.p>
                          )}

                          {/* CTA button — rainbow cycling like the rest of the site */}
                          <motion.button type="submit" disabled={status === 'loading'}
                            whileHover={{ scale: status === 'loading' ? 1 : 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full py-4 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
                            animate={{
                              backgroundImage: [
                                'linear-gradient(135deg,#ef4444,#f97316)',
                                'linear-gradient(135deg,#f97316,#eab308)',
                                'linear-gradient(135deg,#eab308,#22c55e)',
                                'linear-gradient(135deg,#22c55e,#06b6d4)',
                                'linear-gradient(135deg,#06b6d4,#3b82f6)',
                                'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                                'linear-gradient(135deg,#8b5cf6,#ec4899)',
                                'linear-gradient(135deg,#ec4899,#ef4444)',
                              ],
                              boxShadow: [
                                '0 0 22px rgba(239,68,68,0.5)',
                                '0 0 22px rgba(249,115,22,0.5)',
                                '0 0 22px rgba(234,179,8,0.5)',
                                '0 0 22px rgba(34,197,94,0.5)',
                                '0 0 22px rgba(6,182,212,0.5)',
                                '0 0 22px rgba(59,130,246,0.5)',
                                '0 0 22px rgba(139,92,246,0.5)',
                                '0 0 22px rgba(236,72,153,0.5)',
                              ],
                            }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}>
                            {status === 'loading'
                              ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                              : <>Send Message — 100% Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                            }
                          </motion.button>

                          <p className="text-center text-gray-600 text-xs">
                            No credit card · We reply within 24 hours · info@vcvservices.com
                          </p>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════════ */}
      <section className="py-24 bg-[#030712] relative overflow-hidden">
        {/* static electricity */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div key={i}
              className="absolute w-px"
              style={{ left: `${15 + i * 14}%`, top: 0, height: '100%',
                background: `linear-gradient(to bottom,transparent,rgba(${i%2?'99,102,241':'37,99,235'},0.4),transparent)` }}
              animate={{ opacity: [0, 0.7, 0], scaleY: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5 + i * 0.3, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }} />
          ))}
        </div>
        <div className="absolute inset-0 bg-grid opacity-[0.06] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div {...fade()}>
            <p className="neon-badge mb-5 mx-auto w-fit">Prefer a Call?</p>
            <h2 className="font-display text-6xl md:text-7xl text-white mb-5 leading-none">
              CALL OR TEXT<br/>
              <span className="gradient-text">(580) 919-1386</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8">Available Mon–Sat. We respond to texts within minutes.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a href="tel:+15809191386"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="btn-neon btn-glow text-white px-10 py-4 rounded-full font-bold text-base inline-flex items-center gap-2">
                <Phone className="w-5 h-5" /> Call Now
              </motion.a>
              <motion.a href="sms:+15809191386"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="glass-card text-white px-10 py-4 rounded-full font-semibold text-base inline-flex items-center gap-2 hover:border-green-500/40 transition-all">
                <MessageSquare className="w-4 h-4 text-green-400" /> Text Us
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
