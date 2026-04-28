'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Mail, Phone, Globe, ArrowRight, Loader2, MapPin, MessageSquare, Clock, Zap } from 'lucide-react';
import Link from 'next/link';

/* ─── Particle canvas ──────────────────────────────────────── */
const ParticleCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    let id: number; let frame = 0;
    const COLORS: [number,number,number][] = [[37,99,235],[124,58,237],[6,182,212],[168,85,247]];
    const lerp = (t: number): [number,number,number] => {
      const s=((t%1)+1)%1,n=COLORS.length,idx=s*n,i=Math.floor(idx)%n,j=(i+1)%n,f=idx-Math.floor(idx);
      return [Math.round(COLORS[i][0]*(1-f)+COLORS[j][0]*f),Math.round(COLORS[i][1]*(1-f)+COLORS[j][1]*f),Math.round(COLORS[i][2]*(1-f)+COLORS[j][2]*f)];
    };
    interface P{x:number;y:number;vx:number;vy:number;s:number;a:number;h:number}
    let pts:P[]=[];
    const resize=()=>{c.width=c.offsetWidth;c.height=c.offsetHeight;pts=[];const n=Math.min(60,Math.floor(c.width*c.height/20000));for(let i=0;i<n;i++)pts.push({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,s:Math.random()*2+.4,a:Math.random()*.45+.15,h:Math.random()});};
    const draw=()=>{frame++;ctx.clearRect(0,0,c.width,c.height);const gt=frame/600;
      pts.forEach((p,i)=>{if(p.x<0||p.x>c.width)p.vx*=-1;if(p.y<0||p.y>c.height)p.vy*=-1;p.x+=p.vx;p.y+=p.vy;const[r,g,b]=lerp(gt+p.h);ctx.beginPath();ctx.arc(p.x,p.y,p.s,0,Math.PI*2);ctx.fillStyle=`rgba(${r},${g},${b},${p.a})`;ctx.fill();
        for(let j=i+1;j<pts.length;j++){const dx=pts[j].x-p.x,dy=pts[j].y-p.y,d=Math.hypot(dx,dy);if(d<130){const[r2,g2,b2]=lerp(gt+pts[j].h);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(${Math.round((r+r2)/2)},${Math.round((g+g2)/2)},${Math.round((b+b2)/2)},${.45*(1-d/130)})`;ctx.lineWidth=1.2;ctx.stroke();}}});
      id=requestAnimationFrame(draw);};
    resize();window.addEventListener('resize',resize);draw();
    return()=>{cancelAnimationFrame(id);window.removeEventListener('resize',resize);};
  },[]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none"/>;
};

const inputCls = "w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/60 focus:bg-white/[0.06] transition-all text-sm font-medium";

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', business:'', message:'' });
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [errMsg, setErrMsg] = useState('');
  const set = (k:string) => (e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => setForm(p=>({...p,[k]:e.target.value}));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name||!form.email||!form.message){ setErrMsg('Please fill in Name, Email and Message.'); setStatus('error'); return; }
    setStatus('loading');
    try {
      const res = await fetch('/api/send-email',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
      if (!res.ok) throw new Error((await res.json()).error||'Failed');
      setStatus('success'); setForm({ name:'',email:'',phone:'',business:'',message:'' });
    } catch(err:unknown){ setErrMsg(err instanceof Error?err.message:'Something went wrong.'); setStatus('error'); }
  };

  const info = [
    { icon:<Mail className="w-5 h-5"/>, label:'Email', val:'info@vcvservices.com', href:'mailto:info@vcvservices.com', color:'#3b82f6' },
    { icon:<Phone className="w-5 h-5"/>, label:'Phone', val:'+1 (580) 919-1386', href:'tel:+15809191386', color:'#8b5cf6' },
    { icon:<Clock className="w-5 h-5"/>, label:'Response Time', val:'Within 24 hours', href:null, color:'#06b6d4' },
    { icon:<Globe className="w-5 h-5"/>, label:'Service Area', val:'Nationwide (Remote)', href:null, color:'#10b981' },
  ];

  return (
    <div className="bg-[#030712] min-h-screen">

      {/* ── Hero ── */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <ParticleCanvas />
        <div className="absolute top-[-5%] right-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none animate-orb" />
        <div className="absolute bottom-[-10%] left-[5%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-orb-delay" />
        <div className="absolute inset-0 bg-grid opacity-[0.30] pointer-events-none" />
        <div className="absolute inset-0 bg-dot opacity-[0.12] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ duration:.7 }}>
            <p className="neon-badge mb-5 mx-auto w-fit">Let's Talk</p>
            <h1 className="font-display leading-none text-white mb-5"
              style={{ fontSize:'clamp(3.5rem,9vw,7rem)',
                textShadow:'0 0 60px rgba(37,99,235,0.5), 0 0 120px rgba(124,58,237,0.25)' }}>
              GET IN<br /><span className="gradient-text">TOUCH</span>
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
              Ready to turn your website into a lead machine? Send us a message and we'll get back to you within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Main content ── */}
      <section className="pb-24 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Left: info + CTA */}
            <div className="lg:col-span-2 space-y-5">
              {/* Contact info cards */}
              {info.map((item,i) => (
                <motion.div key={i} initial={{ opacity:0,x:-20 }} whileInView={{ opacity:1,x:0 }}
                  transition={{ delay:i*.08 }} viewport={{ once:true }}
                  className="glass-card p-5 flex items-center gap-4"
                  style={{ borderColor:`${item.color}20` }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background:`${item.color}18`, color:item.color, border:`1px solid ${item.color}35` }}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-0.5">{item.label}</p>
                    {item.href
                      ? <a href={item.href} className="text-white font-bold text-sm hover:text-blue-400 transition-colors">{item.val}</a>
                      : <p className="text-white font-bold text-sm">{item.val}</p>}
                  </div>
                </motion.div>
              ))}

              {/* Free demo CTA card */}
              <motion.div initial={{ opacity:0,x:-20 }} whileInView={{ opacity:1,x:0 }}
                transition={{ delay:.35 }} viewport={{ once:true }}
                className="neon-card p-6 text-center"
                style={{ borderColor:'rgba(37,99,235,0.4)', boxShadow:'0 0 40px rgba(37,99,235,0.12)' }}>
                <div className="w-12 h-12 btn-neon rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Want to See Results First?</h4>
                <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                  Get a free custom demo website built for your business — no payment required.
                </p>
                <Link href="/free-demo"
                  className="btn-neon btn-glow block w-full text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 group">
                  Build My Free Demo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            {/* Right: form */}
            <motion.div className="lg:col-span-3" initial={{ opacity:0,x:30 }} animate={{ opacity:1,x:0 }} transition={{ delay:.2, duration:.7 }}>
              <div className="glass-card p-8 md:p-10"
                style={{ borderColor:'rgba(37,99,235,0.2)', boxShadow:'0 0 60px rgba(37,99,235,0.08)' }}>

                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 btn-neon rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl">Send Us a Message</h3>
                    <p className="text-gray-500 text-sm">We reply within 24 hours</p>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {status === 'success' ? (
                    <motion.div key="success" initial={{ opacity:0,scale:.9 }} animate={{ opacity:1,scale:1 }}
                      className="text-center py-10">
                      <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                        style={{ background:'rgba(74,222,128,0.15)', border:'2px solid rgba(74,222,128,0.4)' }}>
                        <CheckCircle2 className="w-10 h-10 text-green-400" />
                      </div>
                      <h3 className="font-display text-4xl text-white mb-3">MESSAGE SENT!</h3>
                      <p className="text-gray-400 mb-6">We'll be in touch within 24 hours.</p>
                      <button onClick={() => setStatus('idle')}
                        className="text-blue-400 text-sm underline underline-offset-2 hover:text-blue-300 transition-colors">
                        Send another message
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form key="form" onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Name *</label>
                          <input type="text" placeholder="Your full name" value={form.name} onChange={set('name')} required className={inputCls} />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Email *</label>
                          <input type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} required className={inputCls} />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Phone</label>
                          <input type="tel" placeholder="(555) 000-0000" value={form.phone} onChange={set('phone')} className={inputCls} />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Business Name</label>
                          <input type="text" placeholder="Your company" value={form.business} onChange={set('business')} className={inputCls} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Message *</label>
                        <textarea rows={5} placeholder="Tell us about your business and what you need..." value={form.message} onChange={set('message')} required className={`${inputCls} resize-none`} />
                      </div>

                      {status === 'error' && (
                        <p className="text-red-400 text-sm flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" /> {errMsg}
                        </p>
                      )}

                      <motion.button type="submit" disabled={status==='loading'}
                        whileHover={{ scale:1.02 }} whileTap={{ scale:.98 }}
                        className="w-full btn-neon btn-glow text-white py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed">
                        {status==='loading'
                          ? <><Loader2 className="w-5 h-5 animate-spin"/>Sending...</>
                          : <>Send Message <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/></>}
                      </motion.button>
                      <p className="text-center text-gray-600 text-xs">Emails sent to info@vcvservices.com · No spam ever</p>
                    </motion.form>
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
