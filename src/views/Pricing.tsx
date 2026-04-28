'use client';
import { motion, LayoutGroup, AnimatePresence } from 'motion/react';
import { CheckCircle2, ArrowRight, HelpCircle, TrendingUp, ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '../lib/utils';
import { useState, useEffect, useRef } from 'react';
import { ParticleCanvas, StaticElectricity, MarqueeBand, SectionOrbs, GridOverlay, RainbowWavesCanvas } from '@/components/PageEffects';
import { DottedSurface } from '@/components/ui/dotted-surface';

const RISK_ITEMS = [
  { id:'ri-a', icon:'🚀', title:'Free Demo First',  body:'We build your site before you pay a single dollar.',  color:'#3b82f6', bg:'rgba(59,130,246,0.09)'  },
  { id:'ri-b', icon:'🔓', title:'No Contracts',     body:'Month-to-month. Cancel anytime. Zero lock-in.',       color:'#8b5cf6', bg:'rgba(139,92,246,0.09)'  },
  { id:'ri-c', icon:'💸', title:'No Upfront Cost',  body:'Flexible payment options with zero down payment.',    color:'#06b6d4', bg:'rgba(6,182,212,0.09)'   },
  { id:'ri-d', icon:'💯', title:'Love It or Leave', body:'Move forward only when you are 100% satisfied.',      color:'#ec4899', bg:'rgba(236,72,153,0.09)'  },
];

const RiskParticlesCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let animId: number;
    const COLS = ['#3b82f6','#8b5cf6','#06b6d4','#22c55e','#ec4899','#eab308','#ef4444'];
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    interface P { x:number; y:number; vx:number; vy:number; r:number; al:number; col:string }
    let pts: P[] = [];
    const spawn = () => {
      pts = [];
      const n = Math.min(80, Math.floor(canvas.width * canvas.height / 8000));
      for (let i = 0; i < n; i++) pts.push({
        x: Math.random() * canvas.width,  y: Math.random() * canvas.height,
        vx:(Math.random() - .5) * .42,    vy:(Math.random() - .5) * .42,
        r: Math.random() * 2.5 + .7,      al: Math.random() * .55 + .18,
        col: COLS[Math.floor(Math.random() * COLS.length)],
      });
    };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p, i) => {
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        p.x += p.vx; p.y += p.vy;
        ctx.globalAlpha = p.al; ctx.fillStyle = p.col;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[j].x - p.x, dy = pts[j].y - p.y, d = Math.hypot(dx, dy);
          if (d < 95) {
            ctx.globalAlpha = .22 * (1 - d / 95);
            ctx.strokeStyle = p.col; ctx.lineWidth = .75;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
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
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-55" />;
};

const FAQ_DATA = [
  { q:'Do I have to pay upfront?',   a:'No. We build your website demo first so you can see exactly what you are getting before you pay anything.' },
  { q:'How long does it take?',      a:'Most websites are built and launched in 3 to 7 days.' },
  { q:'Can I cancel?',               a:'Yes, we offer flexible options with no long-term contracts.' },
  { q:'Do you handle everything?',   a:'Yes, we handle design, development, hosting, and ongoing support.' },
];

const FAQItem = ({ question, answer, isOpen, onToggle }: {
  question: string; answer: string; isOpen: boolean; onToggle: () => void;
}) => (
  <motion.div
    className="rounded-2xl overflow-hidden"
    animate={{
      background:  isOpen ? 'rgba(37,99,235,0.07)'    : 'rgba(255,255,255,0.03)',
      borderColor: isOpen ? 'rgba(37,99,235,0.4)'     : 'rgba(255,255,255,0.08)',
      boxShadow:   isOpen ? '0 0 28px rgba(37,99,235,0.12)' : '0 0 0px rgba(0,0,0,0)',
    }}
    style={{ border: '1.5px solid rgba(255,255,255,0.08)' }}
    transition={{ duration: 0.3 }}>
    <button onClick={onToggle} className="w-full px-6 py-5 flex justify-between items-center text-left gap-4">
      <span className={cn('font-bold transition-colors text-base', isOpen ? 'text-blue-400' : 'text-white')}>
        {question}
      </span>
      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="flex-shrink-0">
        <HelpCircle className={cn('w-5 h-5 transition-colors', isOpen ? 'text-blue-400' : 'text-gray-500')} />
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
          <div className="h-px mx-6 bg-blue-500/20" />
          <p className="px-6 py-5 text-gray-400 leading-relaxed text-sm">{answer}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const packages = [
  { name:"Monthly", price:"$97", origPrice:"$194", period:"/mo", amountCents:9700,  setup:"No upfront cost options", isPopular:false,
    features:["Custom website design","Mobile-responsive layout","Basic SEO setup","Contact & lead forms","Hosting & maintenance","Monthly updates"] },
  { name:"Annual",  price:"$497",origPrice:"$994", period:"/yr", amountCents:49700, setup:"Best value — save $667",   isPopular:true,
    features:["Everything in Monthly","Advanced SEO optimization","Google Ads integration ready","Blog & content system","Analytics dashboard","Priority support","Quarterly strategy calls","Free demo included"] },
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

  const handleBuy = async (pkg: typeof packages[0], idx: number) => {
    setLoadingIdx(idx);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName: `VCV Web Solutions — ${pkg.name} Plan`, amount: pkg.amountCents }),
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
              We build your website before you pay anything. No risk. No surprises.
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
              <Link href="/free-demo" className="btn-neon btn-glow text-white px-8 py-4 rounded-full font-bold text-base flex items-center justify-center gap-2 group">
                Get My Free Demo <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
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
              <span className="flex items-center gap-2 text-gray-200"><CheckCircle2 className="w-4 h-4 text-blue-400" /> No upfront cost</span>
              <span className="flex items-center gap-2 text-gray-200"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Built in 3-7 days</span>
              <span className="flex items-center gap-2 text-gray-200"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Designed for leads</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <MarqueeBand />

      {/* Pricing Cards — 2 columns with static electricity bg */}
      <div className="relative py-16 overflow-hidden bg-[#030712]">
        <StaticElectricity />
        <SectionOrbs variant="blue" />
        <GridOverlay gridOp={0.25} dotOp={0.1} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch relative z-10">
        {packages.map((pkg, idx) => (
          <div key={idx} className={cn(
            "premium-card p-8 flex flex-col relative transition-all duration-300 h-full",
            pkg.isPopular ? "border-2 border-blue-500 shadow-2xl shadow-blue-500/10" : "border border-white/10"
          )}>
            {pkg.isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap shadow-lg">
                Best Value - Save $667
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

            {/* Savings pill */}
            <div className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/25 rounded-full px-3 py-1 mb-5 w-fit">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block" />
              <span className="text-green-400 text-xs font-bold">
                You save {pkg.isPopular ? '$497/yr' : '$97/mo'}
              </span>
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
            <p className="text-center text-gray-600 text-xs mt-3">Secure checkout · Powered by Stripe</p>
          </div>
        ))}
      </div>
      </div>{/* end static electricity wrapper */}

      {/* ROI Section */}
      <section className="py-20 relative overflow-hidden bg-[#040a16]">
        <SectionOrbs variant="cyan" />
        <GridOverlay gridOp={0.2} dotOp={0.1} />

        {/* Floating money emojis */}
        {[
          { e:'💰', x:'5%',  dur:6,  delay:0,   size:36 },
          { e:'💵', x:'15%', dur:8,  delay:1.2, size:30 },
          { e:'💸', x:'28%', dur:7,  delay:0.5, size:34 },
          { e:'🤑', x:'42%', dur:9,  delay:2,   size:32 },
          { e:'💳', x:'58%', dur:6.5,delay:0.8, size:28 },
          { e:'💎', x:'70%', dur:8.5,delay:1.5, size:32 },
          { e:'💵', x:'80%', dur:7.5,delay:0.3, size:30 },
          { e:'💰', x:'91%', dur:6,  delay:1.8, size:36 },
          { e:'📈', x:'35%', dur:9,  delay:0.6, size:30 },
          { e:'💸', x:'52%', dur:7,  delay:2.2, size:28 },
          { e:'🏦', x:'64%', dur:8,  delay:1,   size:30 },
          { e:'💲', x:'88%', dur:6.5,delay:0.4, size:26 },
        ].map((m, i) => (
          <div key={i} style={{
            position:'absolute', left:m.x, bottom:'-10%',
            fontSize: m.size, pointerEvents:'none', zIndex:1, opacity:0.55,
            animation:`floatMoney ${m.dur}s ease-in-out infinite`,
            animationDelay:`${m.delay}s`,
          }}>
            {m.e}
          </div>
        ))}

        <style>{`
          @keyframes floatMoney {
            0%   { transform: translateY(0px)   rotate(-8deg)  scale(1);    opacity: 0.45; }
            25%  { transform: translateY(-40px) rotate(5deg)   scale(1.12); opacity: 0.65; }
            50%  { transform: translateY(-80px) rotate(-4deg)  scale(1);    opacity: 0.55; }
            75%  { transform: translateY(-50px) rotate(8deg)   scale(1.08); opacity: 0.6;  }
            100% { transform: translateY(-120px)rotate(-6deg)  scale(0.9);  opacity: 0;    }
          }
        `}</style>

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
              TRY IT RISK-FREE
            </motion.h2>

            <p className="text-gray-400 text-base mb-10 relative z-10">
              Everything you need to feel 100% confident before spending a dime.
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
            <p className="text-gray-400 text-xl mb-10">We build your site before you pay anything.</p>
            <Link href="/free-demo"
              className="btn-glow btn-neon text-white px-12 py-5 rounded-full font-bold text-xl inline-flex items-center gap-3 group">
              Build My Free Demo <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <motion.p
              className="text-gray-200 text-sm mt-6 px-8 py-3 rounded-full inline-block"
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
              No credit card · Ready in 48 hours · 100% free
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
