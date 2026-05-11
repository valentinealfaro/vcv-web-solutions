'use client';
import { motion, LayoutGroup, AnimatePresence } from 'motion/react';
import { CheckCircle2, ArrowRight, HelpCircle, TrendingUp, ShieldCheck, Loader2, Phone, Zap, Bot } from 'lucide-react';
import Link from 'next/link';
import { cn } from '../lib/utils';
import { useState, useEffect, useRef } from 'react';
import { ParticleCanvas, StaticElectricity, MarqueeBand, SectionOrbs, GridOverlay, PricingBgCanvas, RainbowWavesCanvas } from '@/components/PageEffects';
import { FreeDemoButton } from '@/components/FreeDemoButton';
import { DottedSurface } from '@/components/ui/dotted-surface';
import { CheckoutUpsellModal, CheckoutPayload } from '@/components/CheckoutUpsellModal';
import { NOVA_TIERS, type NovaTier } from '@/data/novaTiers';
import { BillingToggle, type Billing } from '@/components/BillingToggle';

const RISK_ITEMS = [
  { id:'ri-a', icon:'🎯', title:'See It Before You Commit',  body:'We build a custom design preview of your site. You approve it, then we launch it.',     color:'#3b82f6', bg:'rgba(59,130,246,0.09)'  },
  { id:'ri-b', icon:'📈', title:'30-Day Lead Guarantee',     body:'If your site is not generating leads in 30 days, we optimize it at no extra charge.',    color:'#8b5cf6', bg:'rgba(139,92,246,0.09)'  },
  { id:'ri-c', icon:'🔒', title:'You Own Everything',        body:'Your domain, your code, your content. No platform lock-in, ever.',                        color:'#06b6d4', bg:'rgba(6,182,212,0.09)'   },
  { id:'ri-d', icon:'⚡', title:'Live in 3-7 Days',          body:'From first conversation to a live site generating real leads — in under a week.',          color:'#ec4899', bg:'rgba(236,72,153,0.09)'  },
];

const RiskParticlesCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let animId: number; let frame = 0;
    const COLS = ['#3b82f6','#8b5cf6','#06b6d4','#22c55e','#ec4899','#eab308','#ef4444'];
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    interface P { x:number; y:number; vx:number; vy:number; r:number; al:number; col:string; pulse:number }
    let pts: P[] = [];
    const spawn = () => {
      pts = [];
      const n = Math.min(110, Math.floor(canvas.width * canvas.height / 5500));
      for (let i = 0; i < n; i++) pts.push({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        vx: (Math.random() - .5) * 1.6,
        vy: (Math.random() - .5) * 1.6,
        r:  Math.random() * 3.5 + 1.2,
        al: Math.random() * .6 + .35,
        col: COLS[Math.floor(Math.random() * COLS.length)],
        pulse: Math.random() * Math.PI * 2,
      });
    };
    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p, i) => {
        // bounce + accelerate slightly toward center to keep things active
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        p.x += p.vx; p.y += p.vy;

        // pulsing radius
        const pr = p.r + Math.sin(frame * 0.05 + p.pulse) * 1.2;
        ctx.globalAlpha = p.al + Math.sin(frame * 0.04 + p.pulse) * 0.15;
        ctx.fillStyle = p.col;
        // glow halo
        ctx.shadowColor = p.col; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(p.x, p.y, pr, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;

        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[j].x - p.x, dy = pts[j].y - p.y, d = Math.hypot(dx, dy);
          if (d < 140) {
            const alpha = .55 * (1 - d / 140);
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = p.col;
            // thick outer glow line
            ctx.lineWidth = 2.8;
            ctx.shadowColor = p.col; ctx.shadowBlur = 8;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
            // bright thin core on top
            ctx.lineWidth = 1.2;
            ctx.globalAlpha = alpha * 1.5;
            ctx.shadowBlur = 3;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };
    const onResize = () => { resize(); spawn(); };
    resize(); spawn(); draw();
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-80" />;
};

const FAQ_DATA = [
  { q:'What do I pay to get started?',  a:'Monthly plan is $97/mo + $247 one-time setup. Annual plan is $997 for the full year with the setup fee waived (saves you the full $247). Lifetime is $1,497 one-time, no recurring fees, ever. Either way, you see your custom design preview and approve it before your first payment is due.', color:'#3b82f6' },
  { q:'Why is there a 50% discount?',       a:'We are in a growth phase and taking on select new clients at half price in exchange for a testimonial. Once we reach capacity the discount ends — no fake countdown, just limited spots.', color:'#8b5cf6' },
  { q:'What if my project is more complex?', a:'Standard local business sites fit the prices above. If you need e-commerce, booking systems, or custom integrations we will quote you separately — usually $1,500 to $5,000+ one-time depending on scope.', color:'#06b6d4' },
  { q:'Do you handle everything?',          a:'Yes — design, development, copywriting guidance, SEO setup, hosting, and ongoing support. You focus on running your business, we handle your online presence.', color:'#22c55e' },
];

const FAQItem = ({ question, answer, color, isOpen, onToggle }: {
  question: string; answer: string; color: string; isOpen: boolean; onToggle: () => void;
}) => (
  <motion.div
    className="rounded-2xl overflow-hidden flex"
    animate={{
      boxShadow: isOpen
        ? `0 0 32px ${color}30, 0 4px 24px rgba(0,0,0,0.5)`
        : '0 2px 12px rgba(0,0,0,0.4)',
    }}
    style={{
      background: 'rgba(8,12,28,0.92)',
      border: `1.5px solid ${isOpen ? color + '70' : 'rgba(255,255,255,0.1)'}`,
      transition: 'border-color 0.3s',
    }}
    transition={{ duration: 0.3 }}>
    {/* Colored left accent bar */}
    <div className="w-1 flex-shrink-0 rounded-l-2xl transition-all duration-300"
      style={{ background: isOpen ? `linear-gradient(180deg,${color},${color}88)` : 'rgba(255,255,255,0.08)' }} />
    <div className="flex-1 min-w-0">
      <button onClick={onToggle} className="w-full px-5 py-5 flex justify-between items-center text-left gap-4">
        <span className="font-bold text-base transition-colors duration-300"
          style={{ color: isOpen ? color : '#f1f5f9' }}>
          {question}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="flex-shrink-0">
          <HelpCircle className="w-5 h-5" style={{ color: isOpen ? color : '#94a3b8' }} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden">
            <div className="h-px mx-5" style={{ background: `${color}35` }} />
            <p className="px-5 py-4 text-gray-200 leading-relaxed text-sm">{answer}</p>
        </motion.div>
      )}
    </AnimatePresence>
    </div>{/* end content wrapper */}
  </motion.div>
);

const packages = [
  { name:"Monthly", price:"$97", origPrice:"$197", period:"/mo", amountCents:9700, setupFeeCents:24700, setup:"No long-term commitment", isPopular:false,
    features:["Custom website design","Mobile-responsive layout","Basic SEO setup","Contact & lead forms","Hosting & maintenance","Monthly updates","Email support"] },
  { name:"Annual",  price:"$997", origPrice:"$1,970", period:"/yr", amountCents:99700, setupFeeCents:0, setup:"Best value — save $973", isPopular:true,
    features:["Everything in Monthly","Advanced SEO optimization","Google Ads landing page ready","Blog & content system","Analytics dashboard","Priority 24hr support","Quarterly strategy calls","Google My Business setup","Setup fee waived ($247 value)"] },
];

export default function Pricing() {
  const [loadingIdx, setLoadingIdx] = useState<number|null>(null);
  const [riskOrder, setRiskOrder]   = useState([0,1,2,3]);
  const [riskShapes, setRiskShapes] = useState([false,false,false,false]);
  const [openFaq, setOpenFaq]       = useState(0);

  useEffect(() => {
    const shuffleId = setInterval(() => {
      setRiskOrder(prev => {
        const next = [...prev];
        const i = Math.floor(Math.random() * 4);
        let j = Math.floor(Math.random() * 3);
        if (j >= i) j++;
        [next[i], next[j]] = [next[j], next[i]];
        return next;
      });
    }, 2500);
    const shapeId = setInterval(() => {
      setRiskShapes(RISK_ITEMS.map(() => Math.random() < 0.45));
    }, 3200);
    const faqId = setInterval(() => {
      setOpenFaq(prev => (prev + 1) % FAQ_DATA.length);
    }, 4000);
    return () => { clearInterval(shuffleId); clearInterval(shapeId); clearInterval(faqId); };
  }, []);

  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const [novaModalTier, setNovaModalTier] = useState<NovaTier | null>(null);
  const [novaBilling, setNovaBilling] = useState<Billing>('monthly');
  const [bundleModalOpen, setBundleModalOpen] = useState(false);

  const handleBuy = (_pkg: typeof packages[0], idx: number) => {
    setModalIdx(idx);                  // open upsell modal first
  };

  const submitToStripe = async (payload: CheckoutPayload, idx: number) => {
    setLoadingIdx(idx);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Failed');
      window.location.href = data.url;
    } catch { setLoadingIdx(null); }
  };

  // 30-day FREE trial — Monthly plan only — pay only the $247 setup fee
  const handleTrial = async (pkg: typeof packages[0], idx: number) => {
    setLoadingIdx(100 + idx);   // offset so trial spinner is distinct from buy spinner
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: `${pkg.name} Plan — 30 Day FREE Trial (first month free, ${pkg.price}/mo after)`,
          amount:       pkg.setupFeeCents,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Failed');
      window.location.href = data.url;
    } catch { setLoadingIdx(null); }
  };

  return (
    <div className="bg-[#030712] min-h-screen">

      {/* ── Animated hero ── */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <ParticleCanvas />
        <SectionOrbs variant="mixed" />
        <GridOverlay gridOp={0.35} dotOp={0.15} />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ duration:.7 }}>
            <p className="neon-badge mb-5 mx-auto w-fit">Simple Pricing</p>
            <h1 className="font-display leading-none text-white mb-5"
              style={{ fontSize:'clamp(3.5rem,9vw,7rem)',
                textShadow:'0 0 60px rgba(37,99,235,0.5), 0 0 120px rgba(124,58,237,0.25)' }}>
              PRICING THAT<br /><span className="gradient-text">PAYS FOR ITSELF</span>
            </h1>
            <p className="text-gray-400 text-xl mb-6 max-w-2xl mx-auto">
              Professional lead-generating websites starting at $97/mo — backed by our 30-day results guarantee.
            </p>

            {/* Limited-time banner */}
            <motion.div
              animate={{ scale:[1,1.03,1] }} transition={{ duration:2.2,repeat:Infinity,ease:'easeInOut' }}
              className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-5 py-2 mb-8">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse inline-block" />
              <span className="text-red-400 font-bold text-sm tracking-wide">LIMITED TIME — 50% OFF ALL PLANS</span>
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse inline-block" />
            </motion.div>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
              <FreeDemoButton size="md" label="Get My Free Demo" />
            </div>
            <motion.div
              className="inline-flex flex-wrap justify-center gap-6 text-sm px-8 py-3 rounded-full"
              style={{ border: '1.5px solid #3b82f6' }}
              animate={{
                borderColor: ['#3b82f6','#8b5cf6','#06b6d4','#22c55e','#ec4899','#3b82f6'],
                boxShadow: [
                  '0 0 14px rgba(59,130,246,0.55),  inset 0 0 14px rgba(59,130,246,0.08)',
                  '0 0 14px rgba(139,92,246,0.55),  inset 0 0 14px rgba(139,92,246,0.08)',
                  '0 0 14px rgba(6,182,212,0.55),   inset 0 0 14px rgba(6,182,212,0.08)',
                  '0 0 14px rgba(34,197,94,0.55),   inset 0 0 14px rgba(34,197,94,0.08)',
                  '0 0 14px rgba(236,72,153,0.55),  inset 0 0 14px rgba(236,72,153,0.08)',
                  '0 0 14px rgba(59,130,246,0.55),  inset 0 0 14px rgba(59,130,246,0.08)',
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
              <span className="flex items-center gap-2 text-gray-200"><CheckCircle2 className="w-4 h-4 text-blue-400" /> From $97/mo</span>
              <span className="flex items-center gap-2 text-gray-200"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Built in 3-7 days</span>
              <span className="flex items-center gap-2 text-gray-200"><CheckCircle2 className="w-4 h-4 text-blue-400" /> 30-day results guarantee</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <MarqueeBand />

      {/* ══════════ MEGA BUNDLE — NOVA + WEBSITE (the headline deal) ══════════ */}
      <section className="py-20 relative overflow-hidden"
        style={{ background:'linear-gradient(180deg,#030712 0%,#0a0f1e 50%,#030712 100%)' }}>
        <SectionOrbs variant="green"/>
        <GridOverlay gridOp={0.18} dotOp={0.08}/>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <motion.div
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="text-center mb-10">
            <motion.div
              animate={{ scale:[1, 1.04, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5"
              style={{ background:'rgba(255,193,7,0.12)', border:'1px solid rgba(255,193,7,0.5)' }}>
              <span className="text-yellow-300 font-bold text-xs tracking-widest">🎁 BEST VALUE BUNDLE</span>
            </motion.div>
            <h2 className="font-display text-5xl md:text-7xl text-white mb-4 leading-none"
              style={{ textShadow:'0 0 40px rgba(34,197,94,0.4), 0 0 80px rgba(6,182,212,0.25)' }}>
              NOVA + <span className="gradient-text">LEAD WEBSITE</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Pair Nova with a high-converting website that captures leads even when she&apos;s not on a call.
              <span className="block mt-2 text-gray-400 text-base">Two products, one bundled price, one setup fee.</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ delay: 0.1 }}
            className="relative max-w-3xl mx-auto">
            <div className="absolute -inset-4 rounded-[28px] pointer-events-none"
              style={{ background:'linear-gradient(135deg,rgba(34,197,94,0.45),rgba(6,182,212,0.35),rgba(59,130,246,0.3))', filter:'blur(48px)', opacity:0.55 }}/>
            <div className="relative p-px rounded-[24px]"
              style={{ background:'linear-gradient(135deg,rgba(34,197,94,0.6),rgba(6,182,212,0.5),rgba(139,92,246,0.4))' }}>
              <div className="rounded-[23px] p-7 md:p-9"
                style={{ background:'rgba(5,12,22,0.97)', backdropFilter:'blur(24px)' }}>

                {/* Two-column comparison */}
                <div className="grid md:grid-cols-2 gap-5 mb-7">
                  <div className="rounded-2xl p-5"
                    style={{ background:'rgba(34,197,94,0.06)', border:'1px solid rgba(34,197,94,0.3)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ background:'rgba(34,197,94,0.18)', border:'1px solid rgba(34,197,94,0.4)' }}>
                        <Bot className="w-5 h-5 text-green-400"/>
                      </div>
                      <p className="text-white font-bold">Nova Growth</p>
                    </div>
                    <p className="text-green-400 text-2xl font-display mb-1">$147<span className="text-sm text-gray-400">/mo</span></p>
                    <ul className="space-y-1.5 text-xs text-gray-300">
                      <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-green-400"/> Answers every call 24/7</li>
                      <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-green-400"/> Books appointments + SMS</li>
                      <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-green-400"/> Live transfer when you&apos;re free</li>
                    </ul>
                  </div>

                  <div className="rounded-2xl p-5"
                    style={{ background:'rgba(139,92,246,0.06)', border:'1px solid rgba(139,92,246,0.3)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ background:'rgba(139,92,246,0.18)', border:'1px solid rgba(139,92,246,0.4)' }}>
                        <TrendingUp className="w-5 h-5 text-purple-400"/>
                      </div>
                      <p className="text-white font-bold">Lead Website</p>
                    </div>
                    <p className="text-purple-400 text-2xl font-display mb-1">$97<span className="text-sm text-gray-400">/mo</span></p>
                    <ul className="space-y-1.5 text-xs text-gray-300">
                      <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-purple-400"/> Custom-built lead-gen site</li>
                      <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-purple-400"/> SEO + mobile optimized</li>
                      <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-purple-400"/> Lead form connected to Nova</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 mb-5 text-gray-500 text-sm flex-wrap">
                  <span className="line-through">Separately: <span className="text-white font-bold">$244/mo</span></span>
                  <span>·</span>
                  <span className="text-green-400 font-bold">Bundle saves $47/mo</span>
                </div>

                <div className="text-center mb-6">
                  <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">Bundle Price</p>
                  <div className="flex items-end justify-center gap-2 mb-2">
                    <span className="font-display text-7xl md:text-8xl text-white"
                      style={{ textShadow:'0 0 40px rgba(34,197,94,0.5)' }}>
                      $197
                    </span>
                    <span className="text-gray-400 text-2xl mb-3">/mo</span>
                  </div>
                  <p className="text-blue-400 text-sm font-semibold">+ $197 one-time setup (saves $197 vs. paying both setups)</p>
                </div>

                <motion.button
                  onClick={() => setBundleModalOpen(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-4 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2"
                  animate={{
                    backgroundImage:[
                      'linear-gradient(135deg,#22c55e,#06b6d4)',
                      'linear-gradient(135deg,#06b6d4,#3b82f6)',
                      'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                      'linear-gradient(135deg,#8b5cf6,#22c55e)',
                    ],
                    boxShadow:[
                      '0 0 24px rgba(34,197,94,0.55)',
                      '0 0 24px rgba(6,182,212,0.55)',
                      '0 0 24px rgba(59,130,246,0.55)',
                      '0 0 24px rgba(139,92,246,0.55)',
                    ],
                  }}
                  transition={{ duration: 4.2, repeat: Infinity, ease:'linear' }}>
                  Get the Full Bundle — Save $761 Year 1 <ArrowRight className="w-5 h-5"/>
                </motion.button>

                <div className="grid grid-cols-3 gap-2 mt-5">
                  <div className="text-center text-xs text-gray-400 py-2 rounded-lg" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                    <span className="block text-green-400 font-bold mb-0.5">Save $197</span>
                    setup fees
                  </div>
                  <div className="text-center text-xs text-gray-400 py-2 rounded-lg" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                    <span className="block text-green-400 font-bold mb-0.5">Save $47</span>
                    /month
                  </div>
                  <div className="text-center text-xs text-gray-400 py-2 rounded-lg" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                    <span className="block text-green-400 font-bold mb-0.5">$761</span>
                    saved Year 1
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <p className="text-center text-gray-500 text-xs mt-6">
            Or scroll down for individual website / Nova plans
          </p>
        </div>
      </section>

      {/* Pricing Cards — 2 columns with static electricity bg */}
      <div className="relative py-16 overflow-hidden bg-[#030712]">
        <PricingBgCanvas />
        <SectionOrbs variant="blue" />
        <GridOverlay gridOp={0.25} dotOp={0.1} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch relative z-10">
        {packages.map((pkg, idx) => (
          <div key={idx} className={cn(
            "p-8 flex flex-col relative transition-all duration-300 h-full rounded-[20px]",
          )} style={{
            background: pkg.isPopular
              ? 'linear-gradient(145deg,rgba(10,20,60,0.97),rgba(22,10,48,0.97))'
              : 'rgba(6,10,22,0.96)',
            border: pkg.isPopular
              ? '1.5px solid rgba(37,99,235,0.65)'
              : '1px solid rgba(255,255,255,0.14)',
            boxShadow: pkg.isPopular
              ? '0 0 80px rgba(37,99,235,0.25),inset 0 1px 0 rgba(255,255,255,0.08)'
              : '0 0 40px rgba(0,0,0,0.8),inset 0 1px 0 rgba(255,255,255,0.05)',
            backdropFilter: 'blur(32px)',
          }}>
            {pkg.isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap shadow-lg">
                Best Value - Save $333
              </div>
            )}
            {/* 50% off badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1 bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-black px-2.5 py-1 rounded-full">
              50% OFF
            </div>

            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3">{pkg.name}</p>

            {/* Strikethrough original */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-600 text-lg font-bold line-through">{pkg.origPrice}</span>
              <span className="text-gray-600 text-sm line-through">{pkg.period}</span>
              <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">was full price</span>
            </div>

            {/* Sale price */}
            <div className="flex items-end gap-1 mb-2">
              <span className="text-6xl font-black text-white">{pkg.price}</span>
              <span className="text-gray-400 text-lg mb-2">{pkg.period}</span>
            </div>
            <p className="text-blue-400 font-semibold text-sm mb-2">{pkg.setup}</p>

            {/* Savings + setup-fee pills */}
            <div className="flex flex-wrap gap-2 mb-5">
              <div className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/25 rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block" />
                <span className="text-green-400 text-xs font-bold">
                  You save {pkg.isPopular ? '$973/yr' : '$100/mo'}
                </span>
              </div>
              {pkg.setupFeeCents > 0 ? (
                <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
                  style={{ background:'rgba(255,193,7,0.10)', border:'1px solid rgba(255,193,7,0.35)' }}>
                  <span className="text-yellow-300 text-xs font-bold">+ $247 setup · auto-added</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
                  style={{ background:'rgba(34,197,94,0.10)', border:'1px solid rgba(34,197,94,0.35)' }}>
                  <span className="text-green-400 text-xs font-bold">✓ Setup fee waived</span>
                </div>
              )}
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">{pkg.name === 'Monthly' ? 'Perfect for getting started with no long-term commitment.' : 'The complete package. Everything you need to dominate your market.'}</p>

            <ul className="space-y-3 mb-8 flex-grow">
              {pkg.features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle2 className={cn("w-4 h-4 flex-shrink-0", pkg.isPopular ? "text-blue-400" : "text-gray-500")} />
                  {f}
                </li>
              ))}
            </ul>

            <motion.button
              onClick={() => handleBuy(pkg, idx)}
              disabled={loadingIdx === idx}
              className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed mt-auto"
              style={{ backgroundSize:'300% 100%' }}
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
                  '0 0 20px rgba(239,68,68,0.6)',
                  '0 0 20px rgba(249,115,22,0.6)',
                  '0 0 20px rgba(234,179,8,0.6)',
                  '0 0 20px rgba(34,197,94,0.6)',
                  '0 0 20px rgba(6,182,212,0.6)',
                  '0 0 20px rgba(59,130,246,0.6)',
                  '0 0 20px rgba(139,92,246,0.6)',
                  '0 0 20px rgba(236,72,153,0.6)',
                ],
              }}
              transition={{ duration: idx === 0 ? 3 : 4, repeat: Infinity, ease:'linear' }}
              whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}>
              {loadingIdx === idx
                ? <><Loader2 className="w-4 h-4 animate-spin"/> Redirecting...</>
                : <>Buy Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/></>}
            </motion.button>

            {/* 30-day FREE trial — Monthly only */}
            {pkg.setupFeeCents > 0 && (
              <>
                <div className="flex items-center gap-2 my-3">
                  <div className="flex-1 h-px bg-white/10"/>
                  <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-white/10"/>
                </div>
                <motion.button
                  onClick={() => handleTrial(pkg, idx)}
                  disabled={loadingIdx !== null}
                  whileHover={{ scale: loadingIdx !== null ? 1 : 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{
                    background: 'rgba(255,193,7,0.12)',
                    border: '1.5px solid rgba(255,193,7,0.5)',
                    color: '#fde68a',
                    boxShadow: '0 0 14px rgba(255,193,7,0.18)',
                  }}>
                  {loadingIdx === 100 + idx
                    ? <><Loader2 className="w-4 h-4 animate-spin"/> Redirecting...</>
                    : <>🎁 Try Free 30 Days — Only $247 Setup</>}
                </motion.button>
                <p className="text-center text-gray-500 text-[11px] mt-2 leading-relaxed">
                  First month FREE · No charge for 30 days · Cancel before day 30 = pay nothing further
                </p>
              </>
            )}

            <p className="text-center text-gray-600 text-xs mt-3">Secure checkout · Powered by Stripe</p>
          </div>
        ))}
      </div>

      {/* Upsell modal — opens before Stripe redirect */}
      {modalIdx !== null && (() => {
        const pkg = packages[modalIdx];
        return (
          <CheckoutUpsellModal
            open={modalIdx !== null}
            onClose={() => setModalIdx(null)}
            context="website"
            planName={`${pkg.name} Plan`}
            planAmount={pkg.amountCents}
            planPriceLabel={`${pkg.price}${pkg.period}`}
            setupFeeCents={pkg.setupFeeCents}
            setupFeeName="One-Time Website Setup Fee ($247)"
            productName={`VCV Web Solutions — ${pkg.name} Plan`}
            loading={loadingIdx === modalIdx}
            onConfirm={(payload) => submitToStripe(payload, modalIdx!)}
          />
        );
      })()}

      {/* Complexity disclaimer */}
      <div className="max-w-2xl mx-auto px-4 pb-10 text-center relative z-10">
        <p className="text-gray-500 text-xs leading-relaxed">
          <span className="text-gray-400 font-semibold">* Pricing note:</span> Prices shown are for standard local business websites. Projects requiring custom features, e-commerce, booking systems, or advanced integrations may be quoted differently.{' '}
          <a href="/contact" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">Contact us for a custom quote.</a>
        </p>
      </div>
      </div>{/* end static electricity wrapper */}

      {/* ══════════ NOVA — AI RECEPTIONIST TIERS ══════════ */}
      <section className="py-24 relative overflow-hidden"
        style={{ background:'linear-gradient(180deg,#030712 0%,#0a1622 50%,#030712 100%)' }}>
        <SectionOrbs variant="green" />
        <GridOverlay gridOp={0.2} dotOp={0.08} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <motion.div
            initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5"
              style={{ background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.5)' }}>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
              <span className="text-green-400 font-bold text-xs tracking-widest">AI RECEPTIONIST · NOVA</span>
            </div>
            <h2 className="font-display text-5xl md:text-7xl text-white mb-4 leading-none"
              style={{ textShadow:'0 0 40px rgba(34,197,94,0.4), 0 0 80px rgba(6,182,212,0.25)' }}>
              NEVER MISS<br/><span className="gradient-text">ANOTHER CALL</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
              Add Nova — our AI receptionist that answers every call 24/7, books jobs, and texts you the lead instantly.
              <span className="block mt-2 text-gray-400 text-base">Each plan also unlocks the upgrade modal at checkout.</span>
            </p>
          </motion.div>

          {/* Monthly / Annual toggle */}
          <BillingToggle value={novaBilling} onChange={setNovaBilling} className="mb-8"/>

          {/* 3 Nova tier cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {NOVA_TIERS.map((tier, i) => (
              <motion.div key={tier.id}
                initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y:-5 }}
                className="relative p-px rounded-[22px]"
                style={{
                  background: tier.popular
                    ? `linear-gradient(135deg,${tier.color}cc,${tier.color}66,#06b6d488)`
                    : `linear-gradient(135deg,${tier.color}55,rgba(255,255,255,0.06))`,
                  boxShadow: tier.popular
                    ? `0 0 60px ${tier.color}40, 0 0 100px ${tier.color}20`
                    : '0 0 30px rgba(0,0,0,0.4)',
                  transform: tier.popular ? 'scale(1.04)' : 'scale(1)',
                }}>

                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="text-white text-xs font-black px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 whitespace-nowrap"
                      style={{ background:`linear-gradient(135deg,${tier.color},#06b6d4)`, boxShadow:`0 0 18px ${tier.color}99` }}>
                      <Zap className="w-3 h-3"/> MOST POPULAR
                    </div>
                  </div>
                )}

                <div className="rounded-[21px] p-7 h-full flex flex-col"
                  style={{ background:'rgba(5,12,22,0.97)', backdropFilter:'blur(24px)' }}>

                  <p className="text-gray-300 text-xs font-bold uppercase tracking-widest mb-1">{tier.name}</p>
                  <p className="text-gray-300 text-xs mb-3 min-h-[32px] leading-snug">{tier.positioning}</p>

                  <div className="flex items-end gap-1 mb-1">
                    <span className="font-display text-5xl text-white" style={{ textShadow:`0 0 25px ${tier.color}55` }}>
                      ${novaBilling === 'annual' ? tier.priceAnnual.toLocaleString() : tier.price}
                    </span>
                    <span className="text-gray-300 text-sm mb-2 ml-1">
                      {novaBilling === 'annual' ? '/yr' : '/mo'}
                    </span>
                  </div>
                  {novaBilling === 'annual' && (
                    <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 mb-1.5"
                      style={{ background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.35)' }}>
                      <span className="text-green-400 text-xs font-bold">Save ${tier.annualSavings} · 2 months free</span>
                    </div>
                  )}
                  <p className="text-blue-400 text-sm font-semibold mb-5">{tier.callsLabel}</p>

                  <ul className="space-y-2.5 mb-6 flex-1">
                    {tier.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: tier.color }}/>
                        <span className="text-gray-300">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="text-yellow-300 text-xs font-bold text-center mb-3">
                    + $147 setup · auto-added at checkout
                  </div>

                  <motion.button
                    onClick={() => setNovaModalTier(tier)}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2"
                    style={tier.popular
                      ? { backgroundImage:'linear-gradient(135deg,#22c55e,#06b6d4)', boxShadow:'0 0 22px rgba(34,197,94,0.55)' }
                      : { backgroundImage:`linear-gradient(135deg,${tier.color},${tier.color}cc)`, boxShadow:`0 0 18px ${tier.color}55` }}>
                    Buy Now <ArrowRight className="w-4 h-4"/>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sub-CTAs */}
          <motion.div
            initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-2xl mx-auto">
            <Link href="/ai-receptionist"
              className="flex-1 px-5 py-3 rounded-xl font-semibold text-sm text-center text-gray-300 hover:text-white transition-colors"
              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)' }}>
              See full Nova details →
            </Link>
            <a href="tel:+15806569429"
              className="flex-1 px-5 py-3 rounded-xl font-semibold text-sm text-center text-white inline-flex items-center justify-center gap-2"
              style={{ background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.4)' }}>
              <Phone className="w-4 h-4 text-green-400"/> Test Nova: (580) 656-9429
            </a>
          </motion.div>
        </div>
      </section>

      {/* Mega Bundle modal */}
      <CheckoutUpsellModal
        open={bundleModalOpen}
        onClose={() => setBundleModalOpen(false)}
        context="bundle"
        planName="Nova + Lead Website Bundle"
        planAmount={19700}
        planPriceLabel="$197/mo"
        setupFeeCents={19700}
        setupFeeName="One-Time Setup ($197) — phone, Nova training, website launch"
        productName="Nova + Lead Website Bundle"
        loading={loadingIdx === 999}
        onConfirm={(payload) => submitToStripe(payload, 999)}
      />

      {/* Nova upsell modal */}
      {novaModalTier && (
        <CheckoutUpsellModal
          open={novaModalTier !== null}
          onClose={() => setNovaModalTier(null)}
          context="nova"
          planName={`${novaModalTier.name} Plan${novaBilling === 'annual' ? ' · Annual' : ''}`}
          planAmount={novaBilling === 'annual' ? novaModalTier.priceCentsAnnual : novaModalTier.priceCents}
          planPriceLabel={novaBilling === 'annual' ? `$${novaModalTier.priceAnnual.toLocaleString()}/yr` : `$${novaModalTier.price}/mo`}
          setupFeeCents={14700}
          setupFeeName="One-Time Setup Fee ($147)"
          productName={`Never Miss a Call — ${novaModalTier.name} Plan${novaBilling === 'annual' ? ' · Annual (saves $' + novaModalTier.annualSavings + ')' : ''}`}
          loading={loadingIdx === 200 + NOVA_TIERS.findIndex(t => t.id === novaModalTier.id)}
          onConfirm={(payload) => submitToStripe(payload, 200 + NOVA_TIERS.findIndex(t => t.id === novaModalTier.id))}
        />
      )}

      {/* ROI Section */}
      <section className="py-20 relative overflow-hidden bg-[#040a16]">
        <SectionOrbs variant="cyan" />
        <GridOverlay gridOp={0.2} dotOp={0.1} />

        {/* Freely roaming money emojis — each travels a unique multi-point path */}
        {[
          { e:'💰', x:'5%',  y:'15%', dur:7,  delay:0,   size:34, rx:[0, 80,-50,120,-30, 0], ry:[0,-40, 70,-20, 50, 0] },
          { e:'💵', x:'18%', y:'58%', dur:10, delay:1.5, size:28, rx:[0,-70, 50,-90, 40, 0], ry:[0, 50,-60, 30,-70, 0] },
          { e:'💸', x:'32%', y:'22%', dur:8,  delay:0.8, size:32, rx:[0, 60,-80, 40,-60, 0], ry:[0,-60, 40,-80, 60, 0] },
          { e:'🤑', x:'47%', y:'74%', dur:11, delay:2.2, size:30, rx:[0,-90, 60,-40, 80, 0], ry:[0, 40,-70, 50,-40, 0] },
          { e:'💳', x:'62%', y:'18%', dur:9,  delay:0.5, size:26, rx:[0, 70,-50, 90,-60, 0], ry:[0,-50, 80,-30, 60, 0] },
          { e:'💎', x:'75%', y:'64%', dur:12, delay:1.8, size:30, rx:[0,-60, 80,-70, 50, 0], ry:[0, 60,-40, 70,-50, 0] },
          { e:'📈', x:'88%', y:'32%', dur:8,  delay:1.2, size:28, rx:[0,-80, 50,-60, 70, 0], ry:[0,-40, 60,-70, 40, 0] },
          { e:'🏦', x:'10%', y:'80%', dur:14, delay:0.3, size:28, rx:[0, 90,-60, 70,-80, 0], ry:[0,-70, 50,-60, 80, 0] },
          { e:'💲', x:'40%', y:'85%', dur:9,  delay:2.8, size:24, rx:[0,-50, 80,-40, 60, 0], ry:[0, 60,-50, 70,-40, 0] },
          { e:'💵', x:'55%', y:'6%',  dur:11, delay:1,   size:26, rx:[0, 60,-70, 50,-60, 0], ry:[0, 50,-60, 40,-50, 0] },
          { e:'💰', x:'70%', y:'82%', dur:7,  delay:3,   size:32, rx:[0,-70, 60,-50, 80, 0], ry:[0,-50, 70,-60, 50, 0] },
          { e:'💸', x:'22%', y:'44%', dur:10, delay:0.7, size:28, rx:[0, 80,-60, 70,-50, 0], ry:[0, 40,-70, 50,-60, 0] },
          { e:'🤑', x:'83%', y:'52%', dur:13, delay:2,   size:30, rx:[0,-60, 80,-50, 60, 0], ry:[0,-60, 50,-70, 60, 0] },
          { e:'💎', x:'94%', y:'20%', dur:8,  delay:1.3, size:26, rx:[0,-80, 50,-70, 60, 0], ry:[0, 50,-60, 70,-50, 0] },
          { e:'💵', x:'50%', y:'40%', dur:15, delay:0.6, size:22, rx:[0, 70,-60, 80,-50, 0], ry:[0,-60, 80,-50, 60, 0] },
          { e:'📈', x:'3%',  y:'48%', dur:9,  delay:2.4, size:26, rx:[0, 90,-70, 60,-80, 0], ry:[0, 50,-80, 40,-60, 0] },
        ].map((m, i) => (
          <motion.div key={i}
            style={{ position:'absolute', left:m.x, top:m.y, fontSize:m.size, pointerEvents:'none', zIndex:1 }}
            animate={{
              x:       m.rx,
              y:       m.ry,
              rotate:  [0, 18, -14, 24, -8, 0],
              scale:   [1, 1.22, 0.88, 1.18, 0.94, 1],
              opacity: [0.55, 0.88, 0.62, 0.92, 0.58, 0.55],
            }}
            transition={{ duration:m.dur, delay:m.delay, repeat:Infinity, ease:'easeInOut', times:[0,.2,.4,.6,.8,1] }}>
            {m.e}
          </motion.div>
        ))}

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
            <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-6" />
            <h2 className="font-display text-5xl text-white mb-4">NOT A COST - AN INVESTMENT</h2>
            <p className="text-gray-400 text-lg">
              If your website brings even 2 to 3 extra jobs per month, it pays for itself.
            </p>
          </motion.div>
        </div>
      </section>

      {/* No Risk — enhanced with particle bg + shuffling cards */}
      <section className="py-20 relative overflow-hidden bg-[#030712]">
        <RiskParticlesCanvas />
        <GridOverlay gridOp={0.18} dotOp={0.08} />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="neon-card p-10 md:p-12 text-center relative overflow-hidden">

            {/* Inner ambient orbs */}
            <div className="absolute top-0 left-1/4 w-60 h-60 bg-blue-600/8 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-purple-600/8 rounded-full blur-[80px] pointer-events-none" />

            <div className="w-14 h-14 btn-neon rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>

            {/* Rainbow glow heading — particle text effect */}
            <motion.h2
              className="font-display text-5xl md:text-6xl text-white mb-3 relative z-10"
              animate={{ textShadow:[
                '0 0 28px rgba(59,130,246,0.95),  0 0 65px rgba(59,130,246,0.4)',
                '0 0 28px rgba(139,92,246,0.95),  0 0 65px rgba(139,92,246,0.4)',
                '0 0 28px rgba(6,182,212,0.95),   0 0 65px rgba(6,182,212,0.4)',
                '0 0 28px rgba(34,197,94,0.95),   0 0 65px rgba(34,197,94,0.4)',
                '0 0 28px rgba(236,72,153,0.95),  0 0 65px rgba(236,72,153,0.4)',
                '0 0 28px rgba(234,179,8,0.95),   0 0 65px rgba(234,179,8,0.4)',
                '0 0 28px rgba(239,68,68,0.95),   0 0 65px rgba(239,68,68,0.4)',
              ]}}
              transition={{ duration:4.5, repeat:Infinity, ease:'linear' }}>
              OUR RESULTS GUARANTEE
            </motion.h2>

            <p className="text-gray-400 text-base mb-10 relative z-10">
              We put our reputation behind every site we build. Here is exactly what you get.
            </p>

            {/* Shuffling + shape-morphing guarantee cards */}
            <LayoutGroup id="risk-cards">
              <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto relative z-10">
                {riskOrder.map((itemIdx, pos) => {
                  const item = RISK_ITEMS[itemIdx];
                  const tall = riskShapes[pos];
                  return (
                    <motion.div
                      key={item.id}
                      layoutId={item.id}
                      layout
                      className="rounded-2xl text-left cursor-default"
                      style={{ background: item.bg, border: `1.5px solid ${item.color}35` }}
                      animate={{
                        paddingTop:    tall ? '2rem'   : '1.25rem',
                        paddingBottom: tall ? '2rem'   : '1.25rem',
                        paddingLeft:   '1.25rem',
                        paddingRight:  '1.25rem',
                      }}
                      transition={{
                        layout:        { type:'spring', stiffness:280, damping:28 },
                        paddingTop:    { duration:0.55, ease:'easeInOut' },
                        paddingBottom: { duration:0.55, ease:'easeInOut' },
                        default:       { duration:0.3 },
                      }}
                      whileHover={{ scale:1.04, boxShadow:`0 0 40px ${item.color}35` }}>
                      <div className="text-3xl mb-3">{item.icon}</div>
                      <h4 className="text-white font-bold text-sm md:text-base mb-1.5">{item.title}</h4>
                      <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{item.body}</p>
                    </motion.div>
                  );
                })}
              </div>
            </LayoutGroup>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[#040a16] relative overflow-hidden">
        <DottedSurface colorful className="opacity-45" />
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <h2 className="font-display text-5xl text-white mb-10 text-center">FAQ</h2>
          <div className="space-y-3">
          {FAQ_DATA.map((item, i) => (
            <FAQItem
              key={i}
              question={item.q}
              answer={item.a}
              color={item.color}
              isOpen={openFaq === i}
              onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
            />
          ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-[#030712] relative overflow-hidden">
        <RainbowWavesCanvas />
        {/* dark overlay so text stays readable over the waves */}
        <div className="absolute inset-0 bg-[#030712]/55 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity:0,y:30 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}>
            <p className="neon-badge mb-5 mx-auto w-fit">Ready to Start?</p>
            <h2 className="font-display text-6xl md:text-8xl text-white mb-6 leading-none">
              GET YOUR<br /><span className="gradient-text">FREE DEMO</span>
            </h2>
            <p className="text-gray-400 text-xl mb-10">See your custom design first. If you love it, we launch it — fast.</p>
            <FreeDemoButton size="xl" label="Build My Free Demo" />
            <motion.p
              className="mt-6 px-8 py-3.5 rounded-full inline-block font-semibold text-base tracking-wide"
              style={{
                border: '2px solid #3b82f6',
                background: 'rgba(10,15,35,0.85)',
                color: '#ffffff',
                textShadow: '0 0 12px rgba(255,255,255,0.4)',
              }}
              animate={{
                borderColor: ['#3b82f6','#8b5cf6','#06b6d4','#22c55e','#ec4899','#3b82f6'],
                boxShadow: [
                  '0 0 22px rgba(59,130,246,0.75),  inset 0 0 20px rgba(59,130,246,0.12)',
                  '0 0 22px rgba(139,92,246,0.75),  inset 0 0 20px rgba(139,92,246,0.12)',
                  '0 0 22px rgba(6,182,212,0.75),   inset 0 0 20px rgba(6,182,212,0.12)',
                  '0 0 22px rgba(34,197,94,0.75),   inset 0 0 20px rgba(34,197,94,0.12)',
                  '0 0 22px rgba(236,72,153,0.75),  inset 0 0 20px rgba(236,72,153,0.12)',
                  '0 0 22px rgba(59,130,246,0.75),  inset 0 0 20px rgba(59,130,246,0.12)',
                ],
                color: ['#ffffff','#e0d4ff','#ccf5ff','#d4ffe8','#ffd4f0','#ffffff'],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
              From $97/mo &nbsp;·&nbsp; 30-day results guarantee &nbsp;·&nbsp; Cancel anytime
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
