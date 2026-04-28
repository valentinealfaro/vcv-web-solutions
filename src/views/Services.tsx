'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Layout, Search, BarChart3, Users, CheckCircle2, ArrowRight, X, Rocket, Zap, Shield, Clock, Star } from 'lucide-react';
import Link from 'next/link';

/* ─── Reusable animated particle canvas ─────────────────────── */
const ParticleCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    let id: number; let frame = 0;
    const COLORS: [number,number,number][] = [[37,99,235],[6,182,212],[124,58,237],[34,197,94],[236,72,153]];
    const lerp = (t: number): [number,number,number] => {
      const s = ((t%1)+1)%1, n=COLORS.length, idx=s*n, i=Math.floor(idx)%n, j=(i+1)%n, f=idx-Math.floor(idx);
      return [Math.round(COLORS[i][0]*(1-f)+COLORS[j][0]*f),Math.round(COLORS[i][1]*(1-f)+COLORS[j][1]*f),Math.round(COLORS[i][2]*(1-f)+COLORS[j][2]*f)];
    };
    interface P { x:number;y:number;vx:number;vy:number;s:number;a:number;h:number }
    let pts: P[] = [];
    const resize = () => { c.width=c.offsetWidth; c.height=c.offsetHeight; pts=[]; const n=Math.min(70,Math.floor(c.width*c.height/18000)); for(let i=0;i<n;i++) pts.push({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,s:Math.random()*2+.5,a:Math.random()*.5+.2,h:Math.random()}); };
    const draw = () => {
      frame++; ctx.clearRect(0,0,c.width,c.height);
      const gt = frame/600;
      pts.forEach((p,i) => {
        if(p.x<0||p.x>c.width) p.vx*=-1; if(p.y<0||p.y>c.height) p.vy*=-1;
        p.x+=p.vx; p.y+=p.vy;
        const [r,g,b]=lerp(gt+p.h);
        ctx.beginPath(); ctx.arc(p.x,p.y,p.s,0,Math.PI*2); ctx.fillStyle=`rgba(${r},${g},${b},${p.a})`; ctx.fill();
        for(let j=i+1;j<pts.length;j++){
          const dx=pts[j].x-p.x,dy=pts[j].y-p.y,d=Math.hypot(dx,dy);
          if(d<140){ const [r2,g2,b2]=lerp(gt+pts[j].h); ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(pts[j].x,pts[j].y); ctx.strokeStyle=`rgba(${Math.round((r+r2)/2)},${Math.round((g+g2)/2)},${Math.round((b+b2)/2)},${.5*(1-d/140)})`; ctx.lineWidth=1.2; ctx.stroke(); }
        }
      });
      id=requestAnimationFrame(draw);
    };
    resize(); window.addEventListener('resize',resize); draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize',resize); };
  },[]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

const ServiceCard = ({ icon, title, benefit, features, color }: any) => (
  <motion.div
    initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
    whileHover={{ y:-4 }} transition={{ duration:.3 }}
    className="neon-card noise-texture p-8 flex flex-col h-full group"
    style={{ borderColor:`${color}30` }}>
    <div className="mb-5 w-14 h-14 rounded-2xl flex items-center justify-center"
      style={{ background:`${color}15`, border:`1px solid ${color}35`, boxShadow:`0 0 20px ${color}20` }}>
      <div style={{ color }}>{icon}</div>
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="font-semibold text-sm mb-5" style={{ color }}>{benefit}</p>
    <ul className="space-y-3 mb-7 flex-grow">
      {features.map((f: string, i: number) => (
        <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color }} />
          {f}
        </li>
      ))}
    </ul>
    <Link href="/free-demo"
      className="flex items-center gap-2 text-sm font-bold transition-all group-hover:gap-3"
      style={{ color }}>
      Get Demo <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
    </Link>
  </motion.div>
);

export default function Services() {
  const services = [
    { icon:<Layout className="w-6 h-6"/>, title:'High-Converting Website Design', benefit:'Turn visitors into calls and paying customers.', color:'#3b82f6',
      features:['Mobile optimized','Built for conversions','Fast load speeds','Clean modern design'] },
    { icon:<Rocket className="w-6 h-6"/>, title:'Fast-Launch Landing Pages', benefit:'Go live and start generating leads in days.', color:'#8b5cf6',
      features:['3–7 day turnaround','Focused lead capture','Professional branding','Ready to launch'] },
    { icon:<Search className="w-6 h-6"/>, title:'SEO & Local Visibility', benefit:'Rank on Google and get found by local customers.', color:'#06b6d4',
      features:['On-page SEO','Local search ranking','Keyword research','Technical SEO'] },
    { icon:<BarChart3 className="w-6 h-6"/>, title:'Paid Ads Management', benefit:'Scale fast with targeted campaigns that convert.', color:'#10b981',
      features:['Google Ads','Facebook/Instagram','Conversion tracking','Funnel strategy'] },
  ];

  const stats = [
    { icon:<Zap className="w-6 h-6"/>, val:'3–7', unit:'Days', label:'Average Launch Time', color:'#3b82f6' },
    { icon:<Star className="w-6 h-6"/>, val:'98%', unit:'', label:'Client Satisfaction Rate', color:'#8b5cf6' },
    { icon:<Shield className="w-6 h-6"/>, val:'$0', unit:'', label:'Upfront to Get Started', color:'#06b6d4' },
    { icon:<Users className="w-6 h-6"/>, val:'50+', unit:'', label:'Local Businesses Launched', color:'#10b981' },
  ];

  return (
    <div className="bg-[#030712]">

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden">
        <ParticleCanvas />
        <div className="absolute top-[-5%] left-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none animate-orb" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[550px] h-[550px] bg-purple-600/8 rounded-full blur-[140px] pointer-events-none animate-orb-delay" />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none animate-orb-slow" />
        <div className="absolute inset-0 bg-grid opacity-[0.35] pointer-events-none" />
        <div className="absolute inset-0 bg-dot  opacity-[0.15] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }} transition={{ duration:.8 }}
            className="max-w-3xl">
            <p className="neon-badge mb-6 w-fit">Our Services</p>
            <h1 className="font-display leading-none text-white mb-6"
              style={{ fontSize:'clamp(3.5rem,8vw,7rem)',
                textShadow:'0 0 50px rgba(37,99,235,0.5), 0 0 100px rgba(124,58,237,0.2)' }}>
              WE BUILD<br />
              <span className="gradient-text">GROWTH ENGINES</span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-xl">
              Not just pretty websites — high-performance lead machines built specifically for local businesses that want more calls, more leads, and more revenue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/free-demo"
                className="btn-glow btn-neon text-white px-8 py-4 rounded-full font-bold text-base flex items-center justify-center gap-2 group">
                Get My Free Demo <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/pricing"
                className="glass-card text-white px-8 py-4 rounded-full font-semibold text-base flex items-center justify-center gap-2 hover:border-blue-500/40 transition-all">
                View Pricing <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div className="marquee-band">
        <div className="marquee-inner">
          {['No Upfront Cost','Built in 3–7 Days','SEO Optimized','Mobile Friendly','Lead Generation Focused','Call & Text Integration','Google Ads Ready','You Own Your Site',
            'No Upfront Cost','Built in 3–7 Days','SEO Optimized','Mobile Friendly','Lead Generation Focused','Call & Text Integration','Google Ads Ready','You Own Your Site']
            .map((t,i) => <span key={i} className="marquee-item">{t}</span>)}
        </div>
      </div>

      {/* ── Stats ── */}
      <section className="py-20 relative overflow-hidden bg-[#030712]">
        <div className="absolute inset-0 bg-dot opacity-20 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s,i) => (
              <motion.div key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                transition={{ delay:i*.1 }} viewport={{ once:true }}
                className="glass-card p-6 text-center"
                style={{ borderColor:`${s.color}25`, boxShadow:`0 0 30px ${s.color}10` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background:`${s.color}15`, color:s.color }}>
                  {s.icon}
                </div>
                <div className="font-display text-4xl text-white mb-1" style={{ textShadow:`0 0 20px ${s.color}60` }}>
                  {s.val}<span className="text-2xl">{s.unit}</span>
                </div>
                <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="py-24 relative overflow-hidden bg-[#030712]">
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-[120px] pointer-events-none animate-orb-delay" />
        <div className="absolute bottom-[10%] left-[-5%] w-[350px] h-[350px] bg-blue-600/8 rounded-full blur-[110px] pointer-events-none animate-orb-slow" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div className="text-center mb-16" initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}>
            <p className="neon-badge mb-4 mx-auto w-fit">What We Build</p>
            <h2 className="font-display text-6xl md:text-7xl text-white mb-4">CORE SERVICES</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Everything you need to dominate your local market — built and managed for you.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((s,i) => <ServiceCard key={i} {...s} />)}
          </div>
        </div>
      </section>

      {/* ── Comparison ── */}
      <section className="py-24 relative overflow-hidden" style={{ background:'linear-gradient(180deg,#030712 0%,#040a16 50%,#030712 100%)' }}>
        <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div className="text-center mb-14" initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}>
            <p className="neon-badge mb-4 mx-auto w-fit">The Difference</p>
            <h2 className="font-display text-6xl md:text-7xl text-white">WHY VCV?</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity:0,x:-30 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }}
              className="glass-card p-8" style={{ borderColor:'rgba(239,68,68,0.2)' }}>
              <h3 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/15 flex items-center justify-center">
                  <X className="w-4 h-4 text-red-400" />
                </div>
                Typical Agency
              </h3>
              <ul className="space-y-4">
                {['Looks nice, but doesn\'t convert','No call tracking or analytics','No SEO structure from day one','Takes months to deliver','Expensive retainers with no results'].map((t,i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-500 text-sm">
                    <X className="w-4 h-4 text-red-500/60 flex-shrink-0 mt-0.5" /> {t}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial={{ opacity:0,x:30 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }}
              className="neon-card p-8" style={{ borderColor:'rgba(37,99,235,0.4)', boxShadow:'0 0 40px rgba(37,99,235,0.1)' }}>
              <h3 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/15 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                </div>
                VCV Web Solutions
              </h3>
              <ul className="space-y-4">
                {['Built specifically to generate calls & leads','Full SEO structure from day one','3–7 day launch, not months','You see the site before you pay','No lock-in — you own everything'].map((t,i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-200 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" /> {t}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="py-24 bg-[#030712] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div className="text-center mb-16" initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}>
            <p className="neon-badge mb-4 mx-auto w-fit">How It Works</p>
            <h2 className="font-display text-6xl md:text-7xl text-white">THE PROCESS</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            {[
              { n:'01', t:'Request Demo',  d:'Tell us about your business and goals.', color:'#3b82f6' },
              { n:'02', t:'We Build It',   d:'Custom site designed for your niche.',   color:'#8b5cf6' },
              { n:'03', t:'You Approve',   d:'Review, revise — unlimited changes.',     color:'#06b6d4' },
              { n:'04', t:'We Launch',     d:'Go live in 3–7 days, fully set up.',      color:'#a855f7' },
              { n:'05', t:'Leads Come In', d:'Your site works 24/7 generating calls.',  color:'#10b981' },
            ].map((s,i) => (
              <motion.div key={i} initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }}
                transition={{ delay:i*.1 }} viewport={{ once:true }}
                className="neon-card p-6 relative"
                style={{ borderColor:`${s.color}25` }}>
                <div className="font-display text-5xl mb-3" style={{ color:`${s.color}30` }}>{s.n}</div>
                <h3 className="font-bold text-white mb-2 text-base">{s.t}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.d}</p>
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full animate-pulse" style={{ background:s.color }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 relative overflow-hidden bg-[#030712]">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none animate-orb" style={{ background:'rgba(37,99,235,0.12)' }} />
        <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none animate-orb-delay" style={{ background:'rgba(124,58,237,0.10)' }} />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity:0,y:30 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}>
            <p className="neon-badge mb-6 mx-auto w-fit">Limited Spots Available</p>
            <h2 className="font-display text-6xl md:text-8xl text-white mb-6 leading-none">
              GET YOUR<br />
              <span className="gradient-text">FREE DEMO</span><br />
              TODAY
            </h2>
            <p className="text-gray-400 text-xl mb-10 max-w-xl mx-auto">
              We build your site before you pay anything. No risk. No commitment. Just results.
            </p>
            <Link href="/free-demo"
              className="btn-glow btn-neon text-white px-12 py-5 rounded-full font-bold text-xl inline-flex items-center gap-3 group">
              Build My Free Demo <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-gray-600 text-sm mt-6">No credit card · Ready in 48 hours · 100% free</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
