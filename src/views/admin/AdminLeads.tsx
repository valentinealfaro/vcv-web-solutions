'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import {
  Mail, Phone, ExternalLink, Search, ChevronDown, ChevronUp,
  Inbox, Clock, Trash2, LogOut,
  Activity, Users, TrendingUp, AlertCircle, Calendar,
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import AdminTabs from '../../components/admin/AdminTabs';

type LeadStatus = 'new' | 'contacted' | 'qualified' | 'won' | 'lost';

interface InboundLead {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  businessName?: string;
  business?: string;
  businessType?: string;
  currentSite?: string;
  goal?: string;
  message?: string;
  source?: string;
  status?: LeadStatus;
  createdAt?: any;
  [key: string]: any;
}

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; bg: string; border: string }> = {
  new:       { label: '🆕 New',       color:'#3b82f6', bg:'rgba(59,130,246,0.12)',  border:'rgba(59,130,246,0.4)' },
  contacted: { label: '📞 Contacted', color:'#a855f7', bg:'rgba(168,85,247,0.12)',  border:'rgba(168,85,247,0.4)' },
  qualified: { label: '✅ Qualified', color:'#eab308', bg:'rgba(234,179,8,0.12)',   border:'rgba(234,179,8,0.4)' },
  won:       { label: '💰 Won',       color:'#22c55e', bg:'rgba(34,197,94,0.12)',   border:'rgba(34,197,94,0.4)' },
  lost:      { label: '❌ Lost',      color:'#71717a', bg:'rgba(113,113,122,0.12)', border:'rgba(113,113,122,0.4)' },
};

const STATUS_ORDER: LeadStatus[] = ['new', 'contacted', 'qualified', 'won', 'lost'];

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

const fmtFullDate = (ts: number) => {
  return new Date(ts).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
};

export default function AdminLeads() {
  const router = useRouter();
  const [leads, setLeads]               = useState<InboundLead[]>([]);
  const [loading, setLoading]           = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('all');
  const [searchQ, setSearchQ]           = useState('');
  const [expanded, setExpanded]         = useState<string | null>(null);
  const [updating, setUpdating]         = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() })) as InboundLead[];
      setLeads(docs);
    } catch (e) {
      console.error('[admin-leads] load failed', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleLogout = async () => {
    try { await fetch('/api/admin-auth/logout', { method: 'POST' }); } catch {}
    router.replace('/admin/login');
    router.refresh();
  };

  const updateStatus = async (id: string, status: LeadStatus) => {
    setUpdating(id);
    try {
      await updateDoc(doc(db, 'leads', id), { status });
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    } catch (e) {
      alert('Failed to update status — check Firestore rules');
      console.error(e);
    } finally {
      setUpdating(null);
    }
  };

  const removeLead = async (id: string) => {
    if (!confirm('Delete this lead permanently? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'leads', id));
      setLeads(prev => prev.filter(l => l.id !== id));
    } catch (e) {
      alert('Failed to delete — check Firestore rules');
      console.error(e);
    }
  };

  const filtered = useMemo(() => {
    return leads.filter(l => {
      if (statusFilter !== 'all' && (l.status || 'new') !== statusFilter) return false;
      if (!searchQ) return true;
      const q = searchQ.toLowerCase();
      return (
        (l.name || '').toLowerCase().includes(q) ||
        (l.email || '').toLowerCase().includes(q) ||
        (l.phone || '').toLowerCase().includes(q) ||
        (l.businessName || l.business || '').toLowerCase().includes(q)
      );
    });
  }, [leads, statusFilter, searchQ]);

  const stats = useMemo(() => {
    const today = new Date(); today.setHours(0,0,0,0);
    const thisWeek = new Date(today.getTime() - 6 * 86_400_000);
    const tsOf = (l: InboundLead) => l.createdAt?.toDate?.()?.getTime() ?? 0;

    return {
      total:     leads.length,
      new:       leads.filter(l => (l.status || 'new') === 'new').length,
      thisWeek:  leads.filter(l => tsOf(l) >= thisWeek.getTime()).length,
      won:       leads.filter(l => l.status === 'won').length,
      todayCount: leads.filter(l => tsOf(l) >= today.getTime()).length,
    };
  }, [leads]);

  const statusCounts = useMemo(() => {
    const counts: Record<LeadStatus | 'all', number> = {
      all: leads.length, new: 0, contacted: 0, qualified: 0, won: 0, lost: 0,
    };
    leads.forEach(l => { counts[(l.status || 'new') as LeadStatus]++; });
    return counts;
  }, [leads]);

  return (
    <div className="min-h-screen bg-[#030712] pb-16">
      <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none"/>

      {/* Hero */}
      <div className="relative overflow-hidden bg-[#030712] pt-24 pb-8 mb-6">
        <div className="absolute top-0 left-1/4 w-[500px] h-[200px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"/>
        <div className="absolute top-0 right-1/4 w-[400px] h-[200px] bg-purple-600/8 blur-[80px] rounded-full pointer-events-none"/>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"/>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <AdminTabs active="leads"/>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl btn-neon flex items-center justify-center flex-shrink-0">
                  <Inbox className="w-5 h-5 text-white"/>
                </div>
                <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">Admin — VCV Web Solutions</p>
              </div>
              <h1 className="font-display text-6xl md:text-7xl text-white leading-none"
                style={{ textShadow:'0 0 40px rgba(59,130,246,0.5)' }}>
                INBOUND<br/><span className="gradient-text">LEADS</span>
              </h1>
              <p className="text-gray-500 text-sm mt-3">Form submissions from /free-demo and /contact pages</p>
            </div>

            <button onClick={handleLogout}
              title="Sign out"
              className="h-12 px-4 rounded-xl border border-white/10 bg-white/[0.03] text-gray-400 hover:text-white hover:border-white/20 transition-all flex items-center gap-2 text-sm">
              <LogOut className="w-4 h-4"/> Sign out
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { icon:<Users className="w-5 h-5"/>,        val:stats.total,      label:'Total Leads', color:'#3b82f6' },
              { icon:<Activity className="w-5 h-5"/>,     val:stats.thisWeek,   label:'This Week',   color:'#a855f7' },
              { icon:<Calendar className="w-5 h-5"/>,     val:stats.todayCount, label:'Today',       color:'#06b6d4' },
              { icon:<AlertCircle className="w-5 h-5"/>,  val:stats.new,        label:'Awaiting Reply', color:'#eab308' },
              { icon:<TrendingUp className="w-5 h-5"/>,   val:stats.won,        label:'Won',         color:'#22c55e' },
            ].map((s,i) => (
              <motion.div key={i}
                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                transition={{ delay: i*0.06 }}
                className="rounded-2xl p-4 flex items-center gap-3"
                style={{ background:`${s.color}10`, border:`1px solid ${s.color}30` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background:`${s.color}20`, color:s.color }}>
                  {s.icon}
                </div>
                <div className="min-w-0">
                  <p className="font-display text-2xl text-white leading-none"
                    style={{ textShadow:`0 0 15px ${s.color}60` }}>{s.val.toLocaleString()}</p>
                  <p className="text-white text-xs font-semibold mt-0.5 truncate">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Filters bar */}
        <div className="neon-card p-4 mb-4">
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"/>
              <input
                type="text"
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="Search name, email, phone, business..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50"/>
            </div>
            {/* Status filter pills */}
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter==='all' ? 'bg-blue-600/30 border border-blue-500/50 text-white' : 'text-gray-500 hover:text-white border border-white/[0.06]'}`}>
                All ({statusCounts.all})
              </button>
              {STATUS_ORDER.map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter===s ? 'bg-blue-600/30 border border-blue-500/50 text-white' : 'text-gray-500 hover:text-white border border-white/[0.06]'}`}>
                  {STATUS_CONFIG[s].label} ({statusCounts[s]})
                </button>
              ))}
            </div>
            <button onClick={load}
              className="px-3 py-1.5 rounded-lg text-xs font-bold border border-white/10 text-gray-400 hover:text-white transition-all">
              Refresh
            </button>
          </div>
        </div>

        {/* Lead list */}
        {loading ? (
          <div className="text-center py-20 text-gray-600">
            <Clock className="w-8 h-8 mx-auto mb-3 animate-pulse"/>
            <p>Loading leads...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <Inbox className="w-12 h-12 mx-auto mb-4 opacity-30"/>
            <p className="text-lg font-semibold">{leads.length === 0 ? 'No leads yet' : 'No leads match your filters'}</p>
            <p className="text-sm mt-1">
              {leads.length === 0
                ? 'Form submissions from /free-demo and /contact will appear here'
                : 'Try adjusting your search or status filter'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((l, i) => {
              const status = (l.status || 'new') as LeadStatus;
              const cfg = STATUS_CONFIG[status];
              const isExp = expanded === l.id;
              const ts = l.createdAt?.toDate?.()?.getTime();
              const businessName = l.businessName || l.business || '';

              return (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.5) }}
                  className="neon-card overflow-hidden">
                  {/* Compact row */}
                  <div className="p-4 flex items-center gap-4">
                    {/* Status pill */}
                    <div className="flex-shrink-0">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap"
                        style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}>
                        {cfg.label}
                      </span>
                    </div>

                    {/* Identity */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <p className="text-white font-bold text-sm truncate">{l.name || 'Unknown'}</p>
                        {businessName && (
                          <p className="text-gray-400 text-xs truncate">— {businessName}</p>
                        )}
                        {l.source && (
                          <span className="text-gray-600 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/[0.04]">
                            {l.source}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-500 flex-wrap">
                        {l.email && (
                          <a href={`mailto:${l.email}`} onClick={e=>e.stopPropagation()}
                            className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                            <Mail className="w-3 h-3"/> {l.email}
                          </a>
                        )}
                        {l.phone && (
                          <a href={`tel:${l.phone}`} onClick={e=>e.stopPropagation()}
                            className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                            <Phone className="w-3 h-3"/> {l.phone}
                          </a>
                        )}
                        {ts && <span title={fmtFullDate(ts)}>{fmtRelTime(ts)}</span>}
                      </div>
                    </div>

                    {/* Status select */}
                    <select
                      value={status}
                      onChange={e => updateStatus(l.id, e.target.value as LeadStatus)}
                      disabled={updating === l.id}
                      onClick={e => e.stopPropagation()}
                      className="bg-white/[0.04] border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs cursor-pointer focus:outline-none focus:border-blue-500/50">
                      {STATUS_ORDER.map(s => (
                        <option key={s} value={s} className="bg-gray-900">
                          {STATUS_CONFIG[s].label.replace(/^[^\s]+\s/, '')}
                        </option>
                      ))}
                    </select>

                    {/* Expand toggle */}
                    <button
                      onClick={() => setExpanded(isExp ? null : l.id)}
                      className="text-gray-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/[0.04]">
                      {isExp ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                    </button>
                  </div>

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {isExp && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-white/[0.06]">
                        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/[0.01]">
                          {[
                            { k: 'Business Type', v: l.businessType },
                            { k: 'Main Goal',     v: l.goal },
                            { k: 'Current Site',  v: l.currentSite, link: l.currentSite },
                            { k: 'Submitted',     v: ts ? fmtFullDate(ts) : '—' },
                            { k: 'Source',        v: l.source || '—' },
                            { k: 'Lead ID',       v: l.id },
                          ].map(({ k, v, link }) => (
                            <div key={k}>
                              <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-1">{k}</p>
                              {link && /^https?:\/\//i.test(link) ? (
                                <a href={link} target="_blank" rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 break-all">
                                  <ExternalLink className="w-3 h-3 flex-shrink-0"/>
                                  <span className="truncate">{link}</span>
                                </a>
                              ) : (
                                <p className="text-white text-sm break-words">{v || '—'}</p>
                              )}
                            </div>
                          ))}
                          {l.message && (
                            <div className="sm:col-span-2">
                              <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-1">Message</p>
                              <p className="text-white text-sm whitespace-pre-wrap leading-relaxed">{l.message}</p>
                            </div>
                          )}

                          {/* Action buttons */}
                          <div className="sm:col-span-2 flex flex-wrap gap-2 pt-2 border-t border-white/[0.04] mt-2">
                            {l.email && (
                              <a href={`mailto:${l.email}?subject=Re: Your VCV Web Solutions inquiry`}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600/20 border border-blue-500/40 text-blue-300 hover:bg-blue-600/30 transition-all">
                                <Mail className="w-3.5 h-3.5"/> Reply via Email
                              </a>
                            )}
                            {l.phone && (
                              <a href={`tel:${l.phone}`}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-green-600/20 border border-green-500/40 text-green-300 hover:bg-green-600/30 transition-all">
                                <Phone className="w-3.5 h-3.5"/> Call
                              </a>
                            )}
                            <button
                              onClick={() => removeLead(l.id)}
                              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all">
                              <Trash2 className="w-3.5 h-3.5"/> Delete
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
