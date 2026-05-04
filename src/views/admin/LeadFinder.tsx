'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import {
  Search, Zap, CheckCircle2, AlertCircle, Globe, Phone, Mail,
  Star, TrendingUp, Send, Loader2, RefreshCw, Filter,
  BarChart3, Target, ExternalLink, X, LogOut,
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';

/* ── Types ── */
interface Lead {
  id: string; name: string; phone: string; email: string;
  website: string; address: string; city: string; state: string;
  rating: number; reviews: number; category: string;
  ownerName: string; heat: 'hot' | 'warm' | 'review';
  siteReason: string;
}

const HEAT_CONFIG = {
  hot:    { label:'🔴 Hot — No Website',        bg:'rgba(239,68,68,0.12)',   border:'rgba(239,68,68,0.4)',   text:'#ef4444' },
  warm:   { label:'🟡 Warm — Bad Website',       bg:'rgba(234,179,8,0.12)',   border:'rgba(234,179,8,0.4)',   text:'#eab308' },
  review: { label:'⚪ Review — Has Website',    bg:'rgba(255,255,255,0.04)', border:'rgba(255,255,255,0.1)', text:'#9ca3af' },
};

const NICHES = [
  'Roofers','HVAC contractors','Plumbers','Electricians','Landscapers',
  'Tree services','Pest control','Auto detailing','Towing services',
  'Window cleaning','Pressure washing','Painters','Concrete contractors',
  'Fence companies','Pool services','Restaurants','Food trucks',
  'Chiropractors','Dentists','Med spas','Auto repair','Locksmiths',
];

export default function LeadFinder() {
  const router = useRouter();

  const [niche,      setNiche]      = useState('Roofers');
  const [city,       setCity]       = useState('Lawton, OK');
  const [limit,      setLimit]      = useState(40);
  const [loading,    setLoading]    = useState(false);
  const [leads,      setLeads]      = useState<Lead[]>([]);
  const [selected,   setSelected]   = useState<Set<string>>(new Set());
  const [pushing,    setPushing]    = useState(false);
  const [pushResult, setPushResult] = useState<{ ok: number; err: number } | null>(null);
  const [sentIds,    setSentIds]    = useState<Set<string>>(new Set());
  const [filterHeat, setFilterHeat] = useState<'all'|'hot'|'warm'|'review'>('all');
  const [stats,      setStats]      = useState({ total:0, today:0, hot:0 });

  /* load already-sent IDs from Firebase */
  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, 'sent_leads'));
      setSentIds(new Set(snap.docs.map(d => d.id)));

      const today = new Date(); today.setHours(0,0,0,0);
      const q = query(collection(db, 'sent_leads'), where('sentAt', '>=', today));
      const todaySnap = await getDocs(q);
      setStats(s => ({ ...s, total: snap.size, today: todaySnap.size }));
    })();
  }, []);

  const handleLogout = async () => {
    try { await fetch('/api/admin-auth/logout', { method: 'POST' }); } catch {}
    router.replace('/admin/login');
    router.refresh();
  };

  const search = async () => {
    setLoading(true); setLeads([]); setSelected(new Set()); setPushResult(null);
    try {
      const res = await fetch('/api/outscraper', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ query:`${niche} in ${city}`, limit }),
      });
      const d = await res.json();
      if (d.error) { alert(d.error); return; }
      const fresh = d.leads.filter((l: Lead) => !sentIds.has(l.id));
      setLeads(fresh);
      const hot = fresh.filter((l: Lead) => l.heat === 'hot').length;
      setStats(s => ({ ...s, hot }));
    } catch (e: any) { alert(e.message); }
    finally { setLoading(false); }
  };

  const autoSelectHot = () => {
    setSelected(new Set(leads.filter(l => l.heat === 'hot').map(l => l.id)));
  };

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const pushToHL = async () => {
    if (!selected.size) return;
    setPushing(true); setPushResult(null);
    const toSend = leads.filter(l => selected.has(l.id));
    try {
      const res = await fetch('/api/highlevel', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ leads: toSend }),
      });
      const d = await res.json();
      if (d.ok === 0 && d.err > 0) {
        alert(`HighLevel error: ${d.firstError || 'Check API key and Location ID in Vercel env vars'}`);
      }
      setPushResult({ ok: d.ok, err: d.err });

      /* Save sent IDs to Firebase — non-blocking, ignore permission errors */
      try {
        await Promise.all(toSend.map(l =>
          addDoc(collection(db, 'sent_leads'), {
            leadId: l.id, name: l.name, phone: l.phone,
            city: l.city, heat: l.heat, sentAt: serverTimestamp(),
          })
        ));
      } catch { /* Firebase rules may not allow — HL push already succeeded */ }

      setSentIds(prev => new Set([...prev, ...toSend.map(l => l.id)]));
      setLeads(prev => prev.filter(l => !selected.has(l.id)));
      setSelected(new Set());
      setStats(s => ({ ...s, today: s.today + d.ok, total: s.total + d.ok }));
    } catch (e: any) { alert(e.message); }
    finally { setPushing(false); }
  };

  const visible = filterHeat === 'all' ? leads : leads.filter(l => l.heat === filterHeat);

  /* ── Main UI ── */
  return (
    <div className="min-h-screen bg-[#030712] pb-16">
      <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none"/>

      {/* ── Hero header ── */}
      <div className="relative overflow-hidden bg-[#030712] pt-24 pb-8 mb-6">
        {/* Glow orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[200px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"/>
        <div className="absolute top-0 right-1/4 w-[400px] h-[200px] bg-purple-600/8 blur-[80px] rounded-full pointer-events-none"/>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"/>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Title row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl btn-neon flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-white"/>
                </div>
                <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">Admin — VCV Web Solutions</p>
              </div>
              <h1 className="font-display text-6xl md:text-7xl text-white leading-none"
                style={{ textShadow:'0 0 40px rgba(59,130,246,0.5)' }}>
                LEAD<br/><span className="gradient-text">FINDER</span>
              </h1>
              <div className="flex items-center gap-2 mt-3">
                {['Outscraper','→','Filter','→','HighLevel','→','Close'].map((s,i) => (
                  <span key={i} className={s==='→' ? 'text-gray-700 text-sm' : 'text-xs font-bold px-2.5 py-1 rounded-full'}
                    style={s!=='→' ? { background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'#9ca3af' } : {}}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-3">
              {/* Revenue potential callout */}
              <div className="glass-card px-6 py-4 text-right"
                style={{ borderColor:'rgba(34,197,94,0.25)', background:'rgba(34,197,94,0.05)' }}>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Est. Revenue Potential</p>
                <p className="font-display text-3xl text-green-400"
                  style={{ textShadow:'0 0 20px rgba(34,197,94,0.5)' }}>
                  ${(Math.floor(stats.total * 0.05) * 1497).toLocaleString()}
                </p>
                <p className="text-gray-600 text-xs mt-0.5">{Math.floor(stats.total*0.05)} est. closes × $1,497</p>
              </div>
              <button onClick={handleLogout}
                title="Sign out"
                className="h-[88px] px-3 rounded-xl border border-white/10 bg-white/[0.03] text-gray-400 hover:text-white hover:border-white/20 transition-all flex items-center justify-center">
                <LogOut className="w-4 h-4"/>
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon:<Target className="w-5 h-5"/>,    val:stats.hot,                      label:'Hot Leads Today',  sub:'No website',          color:'#ef4444' },
              { icon:<Send className="w-5 h-5"/>,       val:stats.today,                    label:'Pushed to HL',     sub:'Today',               color:'#22c55e' },
              { icon:<BarChart3 className="w-5 h-5"/>,  val:stats.total,                    label:'Total Sent',       sub:'All time',            color:'#3b82f6' },
              { icon:<TrendingUp className="w-5 h-5"/>, val:Math.floor(stats.total*0.05),   label:'Est. Closes',      sub:'At 5% conversion',    color:'#8b5cf6' },
            ].map((s,i) => (
              <motion.div key={i}
                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                transition={{ delay: i*0.08 }}
                className="rounded-2xl p-5 flex items-center gap-4"
                style={{ background:`${s.color}10`, border:`1px solid ${s.color}30` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background:`${s.color}20`, color:s.color }}>
                  {s.icon}
                </div>
                <div>
                  <p className="font-display text-3xl text-white leading-none"
                    style={{ textShadow:`0 0 15px ${s.color}60` }}>{s.val.toLocaleString()}</p>
                  <p className="text-white text-xs font-semibold mt-0.5">{s.label}</p>
                  <p className="text-gray-600 text-[10px]">{s.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Search form */}
        <div className="neon-card p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Business Type</label>
              <select value={niche} onChange={e=>setNiche(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all">
                {NICHES.map(n => <option key={n} className="bg-gray-900">{n}</option>)}
                <option className="bg-gray-900" value="custom">Custom...</option>
              </select>
              {niche === 'custom' && (
                <input value={niche} onChange={e=>setNiche(e.target.value)} placeholder="e.g. auto detailing"
                  className="w-full mt-2 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50"/>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">City / Location</label>
              <input value={city} onChange={e=>setCity(e.target.value)} placeholder="Lawton, OK"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Results (costs credits)</label>
              <select value={limit} onChange={e=>setLimit(Number(e.target.value))}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all">
                {[20,40,60,100].map(n=><option key={n} className="bg-gray-900">{n} results</option>)}
              </select>
            </div>
          </div>
          <button onClick={search} disabled={loading}
            className="btn-neon btn-glow text-white px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 disabled:opacity-50">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin"/> Searching...</> : <><Search className="w-4 h-4"/> Find Leads</>}
          </button>
        </div>

        {/* Push result banner */}
        <AnimatePresence>
          {pushResult && (
            <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
              className="flex items-center justify-between mb-4 p-4 rounded-xl"
              style={{ background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)' }}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400"/>
                <span className="text-green-300 font-bold text-sm">
                  {pushResult.ok} contacts added to HighLevel
                  {pushResult.err > 0 && <span className="text-red-400 ml-2">({pushResult.err} errors)</span>}
                </span>
              </div>
              <button onClick={() => setPushResult(null)}><X className="w-4 h-4 text-gray-400"/></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {leads.length > 0 && (
          <>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-gray-400 text-sm">{leads.length} leads found</span>
              <div className="flex gap-2">
                {(['all','hot','warm','review'] as const).map(h => (
                  <button key={h} onClick={() => setFilterHeat(h)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterHeat===h ? 'bg-blue-600/30 border border-blue-500/50 text-white' : 'text-gray-500 hover:text-white border border-white/[0.06]'}`}>
                    {h==='all' ? `All (${leads.length})` :
                     h==='hot' ? `🔴 Hot (${leads.filter(l=>l.heat==='hot').length})` :
                     h==='warm'? `🟡 Warm (${leads.filter(l=>l.heat==='warm').length})` :
                     `⚪ Review (${leads.filter(l=>l.heat==='review').length})`}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 ml-auto">
                <button onClick={autoSelectHot}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-all">
                  <Zap className="w-3.5 h-3.5"/> Auto-select Hot
                </button>
                <button onClick={() => setSelected(new Set(visible.map(l=>l.id)))}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold border border-white/10 text-gray-300 hover:text-white transition-all">
                  Select All
                </button>
                <button onClick={() => setSelected(new Set())}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold border border-white/10 text-gray-500 hover:text-white transition-all">
                  Clear
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="neon-card overflow-hidden mb-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="px-4 py-3 text-left w-10">
                        <input type="checkbox" className="w-4 h-4 accent-blue-500 cursor-pointer"
                          checked={visible.length > 0 && visible.every(l => selected.has(l.id))}
                          onChange={() => {
                            const allSel = visible.every(l => selected.has(l.id));
                            if (allSel) setSelected(prev => { const n=new Set(prev); visible.forEach(l=>n.delete(l.id)); return n; });
                            else setSelected(prev => new Set([...prev, ...visible.map(l=>l.id)]));
                          }}/>
                      </th>
                      {['Status','Business','Phone','Website','Rating','Location','Category'].map(h=>(
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((lead, i) => {
                      const h = HEAT_CONFIG[lead.heat];
                      const isSel = selected.has(lead.id);
                      return (
                        <motion.tr key={lead.id}
                          initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                          transition={{ delay: i * 0.02 }}
                          onClick={() => toggle(lead.id)}
                          className={`border-b border-white/[0.04] cursor-pointer transition-all hover:bg-white/[0.03] ${isSel ? 'bg-blue-600/5' : ''}`}>
                          <td className="px-4 py-3">
                            <input type="checkbox" checked={isSel} readOnly
                              className="w-4 h-4 accent-blue-500 cursor-pointer" onClick={e=>e.stopPropagation()}/>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap"
                              style={{ background:h.bg, border:`1px solid ${h.border}`, color:h.text }}>
                              {lead.heat === 'hot' ? '🔴 HOT' : lead.heat === 'warm' ? '🟡 WARM' : '⚪ REVIEW'}
                            </span>
                            <p className="text-gray-500 text-[10px] mt-0.5">{lead.siteReason}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-white font-semibold text-sm">{lead.name}</p>
                            {lead.ownerName && <p className="text-gray-500 text-xs">{lead.ownerName}</p>}
                          </td>
                          <td className="px-4 py-3">
                            {lead.phone ? (
                              <a href={`tel:${lead.phone}`} onClick={e=>e.stopPropagation()}
                                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-xs">
                                <Phone className="w-3 h-3"/>{lead.phone}
                              </a>
                            ) : <span className="text-gray-600 text-xs">No phone</span>}
                            {lead.email && <p className="text-gray-500 text-[10px] mt-0.5">{lead.email}</p>}
                          </td>
                          <td className="px-4 py-3 max-w-[160px]">
                            {lead.website ? (
                              <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                                target="_blank" rel="noopener noreferrer"
                                onClick={e=>e.stopPropagation()}
                                className="text-gray-400 hover:text-white flex items-center gap-1 text-xs truncate">
                                <ExternalLink className="w-3 h-3 flex-shrink-0"/>
                                <span className="truncate">{lead.website.replace(/^https?:\/\//,'').slice(0,25)}</span>
                              </a>
                            ) : (
                              <span className="text-red-400 text-xs font-semibold">None</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400"/>
                              <span className="text-white text-xs font-semibold">{lead.rating || '—'}</span>
                              {lead.reviews > 0 && <span className="text-gray-600 text-[10px]">({lead.reviews})</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-gray-400 text-xs">{lead.city}{lead.state ? `, ${lead.state}` : ''}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-gray-500 text-xs">{lead.category?.slice(0,22)}</span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Push bar */}
            <div className="sticky bottom-4 z-20">
              <AnimatePresence>
                {selected.size > 0 && (
                  <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:20}}
                    className="flex items-center justify-between p-4 rounded-2xl"
                    style={{ background:'rgba(3,7,18,0.95)', border:'1.5px solid rgba(37,99,235,0.5)', backdropFilter:'blur(20px)', boxShadow:'0 0 40px rgba(37,99,235,0.2)' }}>
                    <div>
                      <p className="text-white font-bold">{selected.size} leads selected</p>
                      <p className="text-gray-400 text-xs">
                        {leads.filter(l=>selected.has(l.id)&&l.heat==='hot').length} hot ·{' '}
                        {leads.filter(l=>selected.has(l.id)&&l.heat==='warm').length} warm ·{' '}
                        Est. {Math.ceil(selected.size * 0.05)} closes at 5% conversion
                      </p>
                    </div>
                    <button onClick={pushToHL} disabled={pushing}
                      className="flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-white text-sm disabled:opacity-50"
                      style={{ background:'linear-gradient(135deg,#3b82f6,#8b5cf6)', boxShadow:'0 0 24px rgba(59,130,246,0.5)' }}>
                      {pushing
                        ? <><Loader2 className="w-4 h-4 animate-spin"/> Pushing to HighLevel...</>
                        : <><Send className="w-4 h-4"/> Push {selected.size} to HighLevel</>}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}

        {/* Empty state */}
        {!loading && leads.length === 0 && (
          <div className="text-center py-20 text-gray-600">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30"/>
            <p className="text-lg font-semibold">Search for leads above</p>
            <p className="text-sm mt-1">Select a niche + city and click Find Leads</p>
          </div>
        )}

        {/* Setup reminder */}
        <div className="mt-8 glass-card p-5"
          style={{ borderColor:'rgba(234,179,8,0.2)', background:'rgba(234,179,8,0.04)' }}>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5"/>
            <div className="text-xs text-gray-400 space-y-1">
              <p className="font-bold text-yellow-300 text-sm">Required Vercel Environment Variables</p>
              <p><code className="text-blue-300">OUTSCRAPER_API_KEY</code> — from app.outscraper.com → Settings → API Key</p>
              <p><code className="text-blue-300">HIGHLEVEL_API_KEY</code> — from HighLevel → Settings → Integrations → API Keys</p>
              <p><code className="text-blue-300">HIGHLEVEL_LOCATION_ID</code> — same page, copy Location ID</p>
              <p><code className="text-blue-300">NEXT_PUBLIC_ADMIN_PASS</code> — password to access this page (default: vcv2025)</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
