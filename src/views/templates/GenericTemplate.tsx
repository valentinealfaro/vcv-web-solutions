'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Phone, Mail, MapPin, Clock, CheckCircle2, Star, ShieldCheck, Calendar,
  ArrowRight, MessageCircle, Sparkles, Award,
} from 'lucide-react';
import { INDUSTRIES, type IndustryData } from '@/data/industries';

/* Pick 3 other industries to surface as "Related templates". Stable per slug:
   uses a deterministic offset from the current industry's position in the
   INDUSTRIES array so it doesn't shuffle on rerender. */
function relatedIndustries(currentSlug: string): IndustryData[] {
  const idx = INDUSTRIES.findIndex(i => i.slug === currentSlug);
  if (idx < 0) return INDUSTRIES.slice(0, 3);
  const out: IndustryData[] = [];
  for (let n = 1; out.length < 3 && n < INDUSTRIES.length; n++) {
    const cand = INDUSTRIES[(idx + n) % INDUSTRIES.length];
    if (cand.slug !== currentSlug) out.push(cand);
  }
  return out;
}

export default function GenericTemplate({ industry }: { industry: IndustryData }) {
  const c = industry.color;
  const bizName = `${industry.name.replace(/s$/, '')} Pros`;
  const related = relatedIndustries(industry.slug);

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a', color: '#fff' }}>

      {/* ── Template preview banner — gives visitors a way back to the
             gallery and a CTA to commit ── */}
      <div className="sticky top-0 z-[100] w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3 flex-wrap">
          <span className="flex items-center gap-2">
            <Link href="/templates" className="opacity-80 hover:opacity-100 underline-offset-2 hover:underline">← All templates</Link>
            <span className="opacity-40">·</span>
            <Sparkles className="w-4 h-4 flex-shrink-0"/>
            <span className="font-semibold">Template Preview</span>
            <span className="hidden md:inline opacity-90">— We customize colors, logo &amp; content to match your brand · From $97/mo</span>
          </span>
          <Link href="/free-demo"
            className="bg-white text-blue-700 font-bold px-3 py-1 rounded-full text-xs hover:scale-105 transition-transform flex items-center gap-1">
            Make This Mine <ArrowRight className="w-3 h-3"/>
          </Link>
        </div>
      </div>

      {/* ── Local nav (template chrome) — sticks below the preview banner ── */}
      <nav className="relative z-50 backdrop-blur-xl"
        style={{ background:'rgba(10,10,10,0.85)', borderBottom:`1px solid ${c}25` }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: c, color:'#0a0a0a' }}>{industry.emoji}</div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">{bizName}</p>
              <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: c }}>
                {industry.pluralLabel}
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
            <a href="#services" className="hover:text-white">Services</a>
            <a href="#reviews"  className="hover:text-white">Reviews</a>
            <a href="#contact"  className="hover:text-white">Contact</a>
          </div>
          <a href="#contact"
            className="px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider"
            style={{ background: c, color:'#0a0a0a' }}>
            Get Quote
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-16 pb-20 px-5 lg:px-8 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background:`${c}20`, filter:'blur(120px)' }}/>
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.22em] mb-5"
              style={{ color: c }}>
              {industry.heroEyebrow}
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] mb-6 tracking-tight">
              {industry.heroHeadline.split('\n').map((line, i) => (
                <span key={i} className="block" style={i === 1 ? { color: c } : undefined}>{line}</span>
              ))}
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-xl">
              {industry.heroSubhead}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#contact"
                className="px-7 py-4 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
                style={{ background: c, color:'#0a0a0a', boxShadow:`0 12px 32px ${c}40` }}>
                Get a free quote <ArrowRight className="w-4 h-4"/>
              </a>
              <a href="tel:+15805550234"
                className="px-7 py-4 rounded-full font-bold text-base flex items-center justify-center gap-2 border border-white/15 hover:border-white/40 hover:bg-white/5 transition-colors">
                <Phone className="w-4 h-4"/> (580) 555-0234
              </a>
            </div>
            <div className="flex items-center gap-4 mt-6 text-sm text-gray-400">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" style={{ color: c }}/> Licensed &amp; insured</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" style={{ color: c }}/> Free estimates</span>
            </div>
          </motion.div>

          {/* Hero image card */}
          <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.6, delay:0.2 }}>
            <div className="rounded-3xl p-8 relative overflow-hidden"
              style={{ background:`linear-gradient(135deg, ${c}25, ${c}05)`, border:`1px solid ${c}40` }}>
              <div className="text-8xl text-center mb-6">{industry.emoji}</div>
              <div className="grid grid-cols-3 gap-3">
                {industry.stats.map((s, i) => (
                  <div key={i} className="text-center p-3 rounded-xl"
                    style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${c}30` }}>
                    <div className="text-xl font-extrabold mb-1" style={{ color: c }}>{s.value}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider leading-tight">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Services / what we handle ── */}
      <section id="services" className="py-20 px-5 lg:px-8" style={{ background:'#0f0f0f' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: c }}>
              Our Services
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-3 mb-3 tracking-tight">
              Everything {industry.pluralLabel} need.
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              From the routine to the emergency — we&apos;ve got it covered.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {industry.leadTypes.map((service, i) => (
              <motion.div key={i}
                initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay:i*0.04 }}
                className="p-6 rounded-2xl"
                style={{ background:'#161616', border:`1px solid ${c}25` }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background:`${c}20`, border:`1px solid ${c}45` }}>
                  <CheckCircle2 className="w-5 h-5" style={{ color: c }}/>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{service}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Fast response, transparent pricing, professional work — every job.
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why choose us / outcomes ── */}
      <section className="py-20 px-5 lg:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: c }}>
              Why us
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-3 mb-5 tracking-tight">
              The difference is<br/><span style={{ color: c }}>how we work.</span>
            </h2>
            <p className="text-gray-400 mb-7 leading-relaxed">
              {industry.painSnapshot}
            </p>
            <div className="space-y-4">
              {industry.outcomes.map((o, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background:`${c}25`, border:`1px solid ${c}50` }}>
                    <CheckCircle2 className="w-4 h-4" style={{ color: c }}/>
                  </div>
                  <p className="text-gray-200 leading-relaxed">{o}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl p-8 lg:p-10" style={{ background:`linear-gradient(135deg, ${c}18, ${c}05)`, border:`1px solid ${c}35` }}>
            <Award className="w-12 h-12 mb-5" style={{ color: c }}/>
            <p className="text-2xl text-white font-bold leading-tight mb-3">
              5-star rated by {industry.pluralLabel.replace(/s$/, "")} customers across the region.
            </p>
            <div className="flex items-center gap-2 mb-5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" style={{ color: c }}/>
              ))}
              <span className="text-gray-300 ml-2 text-sm">4.9 · 600+ reviews</span>
            </div>
            <ul className="space-y-2.5 text-gray-300 text-sm">
              <li className="flex items-center gap-2.5"><ShieldCheck className="w-4 h-4" style={{ color: c }}/> Licensed, bonded &amp; insured</li>
              <li className="flex items-center gap-2.5"><Clock className="w-4 h-4" style={{ color: c }}/> Same-day response guaranteed</li>
              <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4" style={{ color: c }}/> Upfront pricing — no surprises</li>
              <li className="flex items-center gap-2.5"><Sparkles className="w-4 h-4" style={{ color: c }}/> 100% satisfaction guarantee</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="py-20 px-5 lg:px-8" style={{ background:'#0f0f0f' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: c }}>How it works</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-3 tracking-tight">Simple. Fast. Done right.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { n:'01', t:'Reach out',      d:'Call, text, or fill the form. Tell us what you need.' },
              { n:'02', t:'Free quote',     d:'We assess your situation and give honest pricing upfront.' },
              { n:'03', t:'We do the work', d:'Licensed pros show up on time and do the job right.' },
              { n:'04', t:'You\'re happy',   d:'Backed by our 100% satisfaction guarantee.' },
            ].map((s, i) => (
              <div key={i} className="p-6 rounded-2xl" style={{ background:'#161616', border:'1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-3xl font-extrabold mb-3" style={{ color: c }}>{s.n}</div>
                <h3 className="text-white font-bold text-lg mb-2">{s.t}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section id="reviews" className="py-20 px-5 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-current" style={{ color: c }}/>
            ))}
          </div>
          <blockquote className="text-2xl md:text-3xl text-white font-medium leading-snug mb-6">
            &ldquo;{industry.quote}&rdquo;
          </blockquote>
          <p className="text-gray-400">
            <span className="text-white font-bold">{industry.quoter}</span> · {industry.quoteRole}
          </p>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="py-20 px-5 lg:px-8" style={{ background:'#0f0f0f' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: c }}>FAQs</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-3 tracking-tight">Common questions</h2>
          </div>
          <div className="space-y-3">
            {industry.faqs.map((f, i) => (
              <FAQItem key={i} q={f.q} a={f.a} accent={c}/>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact / CTA ── */}
      <section id="contact" className="py-20 px-5 lg:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: c }}>Contact</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-3 mb-5 tracking-tight">
              {industry.ctaHeadline}
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Call, text, or fill out the form. We&apos;ll get back to you within an hour during business hours.
            </p>
            <div className="space-y-4">
              <a href="tel:+15805550234" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background:`${c}20`, border:`1px solid ${c}45` }}>
                  <Phone className="w-5 h-5" style={{ color: c }}/>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">Phone</p>
                  <p className="text-white font-bold group-hover:text-blue-300 transition-colors">(580) 555-0234</p>
                </div>
              </a>
              <a href="mailto:hello@example.com" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background:`${c}20`, border:`1px solid ${c}45` }}>
                  <Mail className="w-5 h-5" style={{ color: c }}/>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">Email</p>
                  <p className="text-white font-bold group-hover:text-blue-300 transition-colors">hello@{industry.slug}pros.com</p>
                </div>
              </a>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background:`${c}20`, border:`1px solid ${c}45` }}>
                  <MapPin className="w-5 h-5" style={{ color: c }}/>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">Service area</p>
                  <p className="text-white font-bold">Lawton, OK + surrounding cities</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background:`${c}20`, border:`1px solid ${c}45` }}>
                  <Clock className="w-5 h-5" style={{ color: c }}/>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">Hours</p>
                  <p className="text-white font-bold">Mon–Sat · 7am–8pm · Emergencies 24/7</p>
                </div>
              </div>
            </div>
          </div>

          <ContactForm accent={c} industrySlug={industry.slug}/>
        </div>
      </section>

      {/* ── Related Templates — internal linking + cross-discovery ── */}
      <section className="py-16 px-5 lg:px-8" style={{ background: '#0f0f0f', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] mb-2" style={{ color: c }}>More like this</p>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                Other industries we build for
              </h2>
            </div>
            <Link href="/templates"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-white/70 hover:text-white transition-colors">
              View all 34 templates <ArrowRight className="w-4 h-4"/>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link key={r.slug} href={`/templates/${r.slug}`}
                className="group block p-5 rounded-2xl transition-all hover:-translate-y-1"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: `1px solid ${r.color}30`,
                }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: `${r.color}18`, border: `1px solid ${r.color}40` }}>
                    {r.emoji}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-bold text-base truncate">{r.name}</p>
                    <p className="text-xs uppercase tracking-wider font-bold truncate" style={{ color: r.color }}>
                      {r.heroEyebrow}
                    </p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-snug line-clamp-2 mb-4">
                  {r.heroSubhead.split('.').slice(0, 1).join('.') + '.'}
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold group-hover:gap-2 transition-all"
                  style={{ color: r.color }}>
                  View live demo <ArrowRight className="w-3.5 h-3.5"/>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-5 lg:px-8 text-center text-gray-500 text-sm" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <p className="mb-2">© {new Date().getFullYear()} {bizName} · Licensed &amp; insured</p>
        <p className="text-xs">
          Demo site built by{' '}
          <Link href="/" className="text-blue-400 hover:text-blue-300">VCV Web Solutions</Link>
        </p>
      </footer>
    </div>
  );
}

/* ── FAQ accordion item ── */
function FAQItem({ q, a, accent }: { q: string; a: string; accent: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background:'#161616', border:`1px solid ${accent}25` }}>
      <button onClick={() => setOpen(!open)} className="w-full px-6 py-5 flex items-center justify-between text-left">
        <span className="text-white font-bold pr-4">{q}</span>
        <span className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-transform ${open ? 'rotate-45' : ''}`}
          style={{ background:`${accent}25`, color: accent }}>+</span>
      </button>
      {open && <p className="px-6 pb-5 text-gray-300 leading-relaxed">{a}</p>}
    </div>
  );
}

/* ── Contact form (writes to Firestore + Resend) ── */
function ContactForm({ accent, industrySlug }: { accent: string; industrySlug: string }) {
  const [form, setForm] = useState({ name:'', email:'', phone:'', message:'' });
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [err, setErr] = useState('');

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setErr('Please fill in Name, Email, and Message.'); setStatus('error'); return;
    }
    setStatus('loading'); setErr('');
    try {
      const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
      const { db } = await import('@/firebase');
      const { getAttribution } = await import('@/lib/attribution');
      const attribution = getAttribution();
      await addDoc(collection(db, 'leads'), {
        ...form, ...attribution, createdAt: serverTimestamp(), status:'new', source: `Template · ${industrySlug}`,
      });
      const res = await fetch('/api/send-email', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ ...form, ...attribution, source: `Template · ${industrySlug}` }),
      });
      if (!res.ok) throw new Error('failed');
      const { trackLead } = await import('@/components/Analytics');
      trackLead(`Template · ${industrySlug}`);
      setStatus('success'); setForm({ name:'', email:'', phone:'', message:'' });
    } catch { setErr('Something went wrong. Please try again.'); setStatus('error'); }
  };

  const input = 'w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:bg-white/[0.08] transition-colors';

  if (status === 'success') {
    return (
      <div className="rounded-3xl p-10 flex flex-col items-center justify-center text-center"
        style={{ background:`${accent}10`, border:`1px solid ${accent}40` }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
          style={{ background:`${accent}25`, border:`2px solid ${accent}` }}>
          <CheckCircle2 className="w-8 h-8" style={{ color: accent }}/>
        </div>
        <h3 className="text-white text-2xl font-bold mb-2">Thanks!</h3>
        <p className="text-gray-400 text-center">We&apos;ll be in touch within an hour during business hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-3xl p-7 lg:p-8 space-y-4"
      style={{ background:'#161616', border:`1px solid ${accent}30` }}>
      <h3 className="text-white text-xl font-bold mb-2 flex items-center gap-2">
        <MessageCircle className="w-5 h-5" style={{ color: accent }}/>
        Send us a message
      </h3>
      <input type="text"  required placeholder="Your name"        className={input} value={form.name}    onChange={set('name')}/>
      <input type="email" required placeholder="you@example.com"  className={input} value={form.email}   onChange={set('email')}/>
      <input type="tel"            placeholder="Phone (optional)" className={input} value={form.phone}   onChange={set('phone')}/>
      <textarea required rows={4} placeholder="Tell us what you need..." className={input + ' resize-none'} value={form.message} onChange={set('message')}/>
      {err && <p className="text-red-400 text-sm">{err}</p>}
      <button type="submit" disabled={status==='loading'}
        className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-60 transition-transform hover:scale-[1.02]"
        style={{ background: accent, color:'#0a0a0a', boxShadow:`0 12px 32px ${accent}40` }}>
        {status==='loading' ? 'Sending…' : <>Get my free quote <Calendar className="w-4 h-4"/></>}
      </button>
      <p className="text-center text-xs text-gray-500">No spam · We respond within 1 hour</p>
    </form>
  );
}
