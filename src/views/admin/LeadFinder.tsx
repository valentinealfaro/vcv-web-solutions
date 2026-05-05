'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import {
  Search, Zap, CheckCircle2, AlertCircle, Globe, Phone, Mail,
  Star, TrendingUp, Send, Loader2, RefreshCw, Filter,
  BarChart3, Target, ExternalLink, X, LogOut,
  Activity, MapPin, Briefcase, Clock, Flame, ArrowUp, ArrowDown,
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import AdminTabs from '../../components/admin/AdminTabs';

/* ── Types ── */
interface Lead {
  id: string; name: string; phone: string; email: string;
  website: string; address: string; city: string; state: string;
  rating: number; reviews: number; category: string;
  ownerName: string; heat: 'hot' | 'warm' | 'review';
  siteReason: string;
}

interface SentLead {
  id: string;          // Firestore doc id
  leadId: string;      // Outscraper place_id (real dedup key)
  name: string;
  phone: string;
  city: string;
  heat: 'hot' | 'warm' | 'review';
  category?: string;
  niche?: string;
  sentAt: any;         // Firestore Timestamp
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
  const [allSent,    setAllSent]    = useState<SentLead[]>([]);

  /* Load full sent_leads collection — drives both the dedup set and the analytics dashboard */
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'sent_leads'));
        const docs: SentLead[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<SentLead, 'id'>) }));
        setAllSent(docs);
        // Dedup uses the Outscraper place_id stored as `leadId`, not the random Firestore doc id
        setSentIds(new Set(docs.map(d => d.leadId).filter(Boolean)));

        const today = new Date(); today.setHours(0,0,0,0);
        const todayCount = docs.filter(d => {
          const t = d.sentAt?.toDate?.();
          return t && t >= today;
        }).length;
        setStats(s => ({ ...s, total: docs.length, today: todayCount }));
      } catch {
        /* Firestore rules may block reads — analytics will simply be empty */
      }
    })();
  }, []);

  const handleLogout = async () => {
    try { await fetch('/api/admin-auth/logout', { method: 'POST' }); } catch {}
    router.replace('/admin/login');
    router.refresh();
  };

  /* ── Analytics derived from all-time sent_leads ── */
  const analytics = useMemo(() => {
    const now = Date.now();
    const dayMs = 86_400_000;
    const today = new Date(); today.setHours(0,0,0,0);

    const tsOf = (l: SentLead) => l.sentAt?.toDate?.()?.getTime() ?? 0;

    /* 7-day daily timeline (oldest → newest) */
    const timeline: { label: string; count: number; date: Date }[] = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(today.getTime() - i * dayMs);
      const dayEnd = dayStart.getTime() + dayMs;
      const count = allSent.filter(l => {
        const t = tsOf(l);
        return t >= dayStart.getTime() && t < dayEnd;
      }).length;
      timeline.push({
        label: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
        count,
        date: dayStart,
      });
    }
    const peakDay = Math.max(1, ...timeline.map(t => t.count));

    /* This week vs last week */
    const last7Cutoff  = today.getTime() - 6 * dayMs;
    const prev7Start   = today.getTime() - 13 * dayMs;
    const prev7End     = today.getTime() - 6 * dayMs;
    const thisWeek = allSent.filter(l => tsOf(l) >= last7Cutoff).length;
    const prevWeek = allSent.filter(l => { const t = tsOf(l); return t >= prev7Start && t < prev7End; }).length;
    const weekDelta = prevWeek === 0
      ? (thisWeek > 0 ? null : 0)
      : Math.round(((thisWeek - prevWeek) / prevWeek) * 100);

    /* Heat distribution all-time */
    const heatCounts = {
      hot:    allSent.filter(l => l.heat === 'hot').length,
      warm:   allSent.filter(l => l.heat === 'warm').length,
      review: allSent.filter(l => l.heat === 'review').length,
    };
    const heatTotal = heatCounts.hot + heatCounts.warm + heatCounts.review || 1;

    /* Top cities by volume */
    const cityMap = new Map<string, number>();
    allSent.forEach(l => {
      if (!l.city) return;
      cityMap.set(l.city, (cityMap.get(l.city) || 0) + 1);
    });
    const topCities = [...cityMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([city, count]) => ({ city, count }));
    const peakCity = Math.max(1, ...topCities.map(c => c.count));

    /* Top niches (preferring stored `niche`, falling back to Google Maps `category`) */
    const nicheMap = new Map<string, number>();
    allSent.forEach(l => {
      const n = (l.niche || l.category || '').trim();
      if (!n) return;
      nicheMap.set(n, (nicheMap.get(n) || 0) + 1);
    });
    const topNiches = [...nicheMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([n, count]) => ({ niche: n, count }));
    const peakNiche = Math.max(1, ...topNiches.map(n => n.count));

    /* Recent activity (last 12 leads) */
    const recent = [...allSent]
      .sort((a, b) => tsOf(b) - tsOf(a))
      .slice(0, 12);

    /* Days since last push */
    const lastPush = allSent.length ? Math.max(...allSent.map(tsOf)) : 0;
    const daysSinceLast = lastPush ? Math.floor((now - lastPush) / dayMs) : null;

    return {
      timeline, peakDay,
      thisWeek, prevWeek, weekDelta,
      heatCounts, heatTotal,
      topCities, peakCity,
      topNiches, peakNiche,
      recent, daysSinceLast,
    };
  }, [allSent]);

  const fmtRelTime = (ts: number) => {
    const diff = Date.now() - ts;
    const m = Math.floor(diff / 60_000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
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
        const refs = await Promise.all(toSend.map(l =>
          addDoc(collection(db, 'sent_leads'), {
            leadId:   l.id,
            name:     l.name,
            phone:    l.phone,
            city:     l.city,
            heat:     l.heat,
            category: l.category || '',
            niche:    niche,
            sentAt:   serverTimestamp(),
          })
        ));
        // Optimistically update analytics state with the just-pushed leads
        const newDocs: SentLead[] = toSend.map((l, i) => ({
          id:       refs[i].id,
          leadId:   l.id,
          name:     l.name,
          phone:    l.phone,
          city:     l.city,
          heat:     l.heat,
          category: l.category || '',
          niche:    niche,
          sentAt:   { toDate: () => new Date() },
        }));
        setAllSent(prev => [...prev, ...newDocs]);
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
          <AdminTabs active="lead-finder"/>

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

        {/* ─── ANALYTICS DASHBOARD ─── */}
        {allSent.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"/>
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Insights & Analytics</p>
            </div>

            {/* Pulse banner: this week vs last week + days since last push */}
            <div className="neon-card p-5 mb-4 grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background:'rgba(59,130,246,0.15)', color:'#3b82f6' }}>
                  <Activity className="w-5 h-5"/>
                </div>
                <div>
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">This Week</p>
                  <p className="font-display text-3xl text-white leading-none mt-0.5">{analytics.thisWeek}</p>
                  {analytics.weekDelta !== null && analytics.prevWeek > 0 && (
                    <p className={`text-xs mt-1 flex items-center gap-1 ${analytics.weekDelta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {analytics.weekDelta >= 0 ? <ArrowUp className="w-3 h-3"/> : <ArrowDown className="w-3 h-3"/>}
                      {Math.abs(analytics.weekDelta)}% vs last week ({analytics.prevWeek})
                    </p>
                  )}
                  {analytics.prevWeek === 0 && analytics.thisWeek > 0 && (
                    <p className="text-xs mt-1 text-gray-500">First week of activity</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background:'rgba(168,85,247,0.15)', color:'#a855f7' }}>
                  <Clock className="w-5 h-5"/>
                </div>
                <div>
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Last Push</p>
                  <p className="font-display text-3xl text-white leading-none mt-0.5">
                    {analytics.daysSinceLast === null ? '—' :
                     analytics.daysSinceLast === 0 ? 'Today' :
                     analytics.daysSinceLast === 1 ? 'Yesterday' :
                     `${analytics.daysSinceLast}d ago`}
                  </p>
                  <p className="text-xs mt-1 text-gray-500">
                    {analytics.daysSinceLast === null ? 'No leads pushed yet' :
                     analytics.daysSinceLast > 7 ? 'Inactive — time to scrape more' :
                     analytics.daysSinceLast > 2 ? 'Pipeline cooling off' :
                     'Active outreach'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background:'rgba(239,68,68,0.15)', color:'#ef4444' }}>
                  <Flame className="w-5 h-5"/>
                </div>
                <div>
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Hot %</p>
                  <p className="font-display text-3xl text-white leading-none mt-0.5">
                    {Math.round((analytics.heatCounts.hot / analytics.heatTotal) * 100)}%
                  </p>
                  <p className="text-xs mt-1 text-gray-500">
                    {analytics.heatCounts.hot} of {analytics.heatTotal} have no website
                  </p>
                </div>
              </div>
            </div>

            {/* 7-day activity sparkline */}
            <div className="neon-card p-5 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-400"/>
                  <p className="text-white font-bold text-sm">Daily Push Activity</p>
                  <span className="text-gray-600 text-xs">— last 7 days</span>
                </div>
                <p className="text-gray-500 text-xs">{analytics.timeline.reduce((s,d)=>s+d.count,0)} total</p>
              </div>
              <div className="flex items-end gap-2 h-32">
                {analytics.timeline.map((d, i) => {
                  const height = d.count === 0 ? 4 : Math.max(8, (d.count / analytics.peakDay) * 100);
                  const isToday = i === analytics.timeline.length - 1;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                      <div className="w-full flex items-end justify-center" style={{ height: '100%' }}>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: i * 0.05, type: 'spring', stiffness: 80 }}
                          className="w-full rounded-t-lg relative"
                          style={{
                            background: isToday
                              ? 'linear-gradient(180deg,#3b82f6,#8b5cf6)'
                              : d.count === 0
                                ? 'rgba(255,255,255,0.04)'
                                : 'linear-gradient(180deg,rgba(59,130,246,0.5),rgba(139,92,246,0.3))',
                            boxShadow: isToday ? '0 0 16px rgba(59,130,246,0.4)' : 'none',
                          }}
                        >
                          <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {d.count}
                          </span>
                        </motion.div>
                      </div>
                      <p className={`text-[10px] font-bold ${isToday ? 'text-blue-400' : 'text-gray-600'}`}>
                        {d.label}
                      </p>
                      <p className={`text-[9px] tabular-nums ${isToday ? 'text-white' : 'text-gray-700'}`}>
                        {d.count}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Two-column row: Heat breakdown + Top cities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Heat distribution */}
              <div className="neon-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-4 h-4 text-red-400"/>
                  <p className="text-white font-bold text-sm">Pipeline Heat — All Time</p>
                </div>
                {/* Stacked bar */}
                <div className="flex h-3 rounded-full overflow-hidden mb-4 bg-white/[0.04]">
                  <motion.div initial={{width:0}} animate={{width:`${(analytics.heatCounts.hot/analytics.heatTotal)*100}%`}}
                    transition={{ duration: 0.6 }}
                    style={{ background:'linear-gradient(90deg,#ef4444,#f97316)' }}/>
                  <motion.div initial={{width:0}} animate={{width:`${(analytics.heatCounts.warm/analytics.heatTotal)*100}%`}}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    style={{ background:'linear-gradient(90deg,#eab308,#facc15)' }}/>
                  <motion.div initial={{width:0}} animate={{width:`${(analytics.heatCounts.review/analytics.heatTotal)*100}%`}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{ background:'rgba(255,255,255,0.15)' }}/>
                </div>
                {/* Legend */}
                <div className="space-y-2">
                  {[
                    { key:'hot' as const,    label:'No Website',    sub:'Easiest to close', color:'#ef4444' },
                    { key:'warm' as const,   label:'Bad Website',   sub:'Cheap site builder', color:'#eab308' },
                    { key:'review' as const, label:'Has Website',   sub:'Lower priority', color:'#9ca3af' },
                  ].map(row => {
                    const c = analytics.heatCounts[row.key];
                    const pct = Math.round((c / analytics.heatTotal) * 100);
                    return (
                      <div key={row.key} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ background: row.color }}/>
                          <span className="text-white text-xs font-semibold">{row.label}</span>
                          <span className="text-gray-600 text-[10px]">— {row.sub}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-display text-lg text-white tabular-nums">{c}</span>
                          <span className="text-gray-500 text-xs ml-2 tabular-nums">{pct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top cities */}
              <div className="neon-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-blue-400"/>
                  <p className="text-white font-bold text-sm">Top Cities Targeted</p>
                </div>
                {analytics.topCities.length === 0 ? (
                  <p className="text-gray-600 text-xs py-6 text-center">No data yet — push some leads to see top cities</p>
                ) : (
                  <div className="space-y-3">
                    {analytics.topCities.map((c, i) => (
                      <div key={c.city} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-white text-xs font-semibold truncate">
                            <span className="text-gray-600 text-[10px] mr-2">#{i+1}</span>
                            {c.city}
                          </span>
                          <span className="font-display text-sm text-white tabular-nums">{c.count}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(c.count / analytics.peakCity) * 100}%` }}
                            transition={{ delay: i * 0.05 }}
                            className="h-full rounded-full"
                            style={{ background:'linear-gradient(90deg,#3b82f6,#8b5cf6)' }}/>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Two-column row: Top niches + Recent activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Top niches */}
              <div className="neon-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-4 h-4 text-purple-400"/>
                  <p className="text-white font-bold text-sm">Top Niches Scraped</p>
                </div>
                {analytics.topNiches.length === 0 ? (
                  <p className="text-gray-600 text-xs py-6 text-center">
                    No niche data on existing leads. New pushes will populate this panel.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {analytics.topNiches.map((n, i) => (
                      <div key={n.niche} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-white text-xs font-semibold truncate">
                            <span className="text-gray-600 text-[10px] mr-2">#{i+1}</span>
                            {n.niche}
                          </span>
                          <span className="font-display text-sm text-white tabular-nums">{n.count}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(n.count / analytics.peakNiche) * 100}%` }}
                            transition={{ delay: i * 0.05 }}
                            className="h-full rounded-full"
                            style={{ background:'linear-gradient(90deg,#a855f7,#ec4899)' }}/>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent activity feed */}
              <div className="neon-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-green-400"/>
                    <p className="text-white font-bold text-sm">Recent Pushes</p>
                  </div>
                  <span className="text-gray-600 text-[10px]">last 12</span>
                </div>
                {analytics.recent.length === 0 ? (
                  <p className="text-gray-600 text-xs py-6 text-center">No activity yet</p>
                ) : (
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {analytics.recent.map((l, i) => {
                      const t = l.sentAt?.toDate?.()?.getTime() ?? 0;
                      const heatColor = l.heat === 'hot' ? '#ef4444' : l.heat === 'warm' ? '#eab308' : '#9ca3af';
                      return (
                        <motion.div key={l.id}
                          initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
                          transition={{ delay: i * 0.02 }}
                          className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/[0.03] transition-colors">
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: heatColor }}/>
                          <div className="min-w-0 flex-1">
                            <p className="text-white text-xs font-semibold truncate">{l.name || 'Unknown'}</p>
                            <p className="text-gray-600 text-[10px]">
                              {l.city || '—'}{l.niche ? ` · ${l.niche}` : ''}
                            </p>
                          </div>
                          <span className="text-gray-700 text-[10px] flex-shrink-0 tabular-nums">
                            {t ? fmtRelTime(t) : '—'}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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
              <p><code className="text-blue-300">ADMIN_PASSWORD</code> — server-only password gating this admin page</p>
              <p><code className="text-blue-300">ADMIN_SESSION_SECRET</code> — 32+ random chars, signs the session cookie</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
