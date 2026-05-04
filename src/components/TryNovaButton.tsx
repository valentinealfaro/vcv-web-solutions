'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Loader2, PhoneOff, AlertCircle } from 'lucide-react';

/* ─────────── Setup ──────────────────────────────────────────────
   Set NEXT_PUBLIC_VAPI_PUBLIC_KEY in your Vercel env vars.
   Public Key (NOT private) from https://dashboard.vapi.ai/org/api-keys
─────────────────────────────────────────────────────────────────── */
const PUBLIC_KEY    = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '';
const ASSISTANT_ID  = 'aade4d49-225f-47b5-9b5a-4927e3f2b166'; // Nova - VCV Demo

type CallState = 'idle' | 'connecting' | 'active' | 'error';

/* eslint-disable @typescript-eslint/no-explicit-any */

export const TryNovaButton = () => {
  const [state,  setState]  = useState<CallState>('idle');
  const [errMsg, setErrMsg] = useState('');
  const [elapsed,setElapsed]= useState(0);
  const vapiRef             = useRef<any>(null);
  const tickRef             = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Lazy-load Vapi SDK on mount (client only) ── */
  useEffect(() => {
    if (!PUBLIC_KEY) return;        // graceful no-op if key missing
    let mounted = true;
    import('@vapi-ai/web').then(mod => {
      if (!mounted) return;
      const Vapi = mod.default;
      const v = new Vapi(PUBLIC_KEY);

      v.on('call-start', () => { setState('active'); setElapsed(0); });
      v.on('call-end',   () => { setState('idle'); setElapsed(0); });
      v.on('error',      (e: any) => {
        console.error('Vapi error:', e);
        setState('error');
        setErrMsg('Connection issue — please try again');
      });

      vapiRef.current = v;
    }).catch(e => {
      console.error('Vapi SDK load failed:', e);
      setState('error'); setErrMsg('Voice demo unavailable — please call instead');
    });
    return () => { mounted = false; };
  }, []);

  /* ── Call timer ── */
  useEffect(() => {
    if (state === 'active') {
      tickRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [state]);

  const handleClick = async () => {
    if (state === 'active') { vapiRef.current?.stop(); return; }
    if (!PUBLIC_KEY) {
      setState('error'); setErrMsg('Voice demo not configured — please call the number'); return;
    }
    if (!vapiRef.current) {
      setState('error'); setErrMsg('SDK still loading — wait a moment'); return;
    }
    setState('connecting'); setErrMsg('');
    try {
      await vapiRef.current.start(ASSISTANT_ID);
    } catch (err) {
      console.error(err);
      setState('error');
      setErrMsg('Microphone blocked — please allow mic access and try again');
    }
  };

  const fmtTime = (s: number) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

  return (
    <div className="relative">
      {/* Outer glow ring */}
      <motion.div
        animate={
          state === 'active'
            ? { scale:[1,1.1,1], opacity:[0.5,0.8,0.5] }
            : state === 'connecting'
              ? { scale:[1,1.05,1], opacity:[0.4,0.6,0.4] }
              : { scale:1, opacity:0.45 }
        }
        transition={{ duration: state === 'active' ? 1.2 : 2, repeat: Infinity, ease:'easeInOut' }}
        className="absolute -inset-3 rounded-[28px] pointer-events-none"
        style={{
          background:
            state === 'active'
              ? 'linear-gradient(135deg,rgba(239,68,68,0.5),rgba(220,38,38,0.4))'
              : 'linear-gradient(135deg,rgba(34,197,94,0.5),rgba(6,182,212,0.4),rgba(59,130,246,0.3))',
          filter:'blur(28px)',
        }}
      />

      <motion.button
        onClick={handleClick}
        disabled={state === 'connecting'}
        whileHover={{ scale: state === 'connecting' ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative w-full p-6 md:p-8 rounded-[22px] text-center cursor-pointer disabled:cursor-wait"
        style={{
          background: 'rgba(5,15,25,0.95)',
          border: state === 'active'
            ? '2px solid rgba(239,68,68,0.65)'
            : '2px solid rgba(34,197,94,0.5)',
          boxShadow: state === 'active'
            ? '0 0 50px rgba(239,68,68,0.3), inset 0 1px 0 rgba(255,255,255,0.06)'
            : '0 0 50px rgba(34,197,94,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
          backdropFilter: 'blur(24px)',
        }}>

        {/* Mic icon with pulsing ring */}
        <div className="relative w-20 h-20 mx-auto mb-4">
          {state === 'active' && [0,1,2].map(i => (
            <motion.div key={i}
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ border:'2px solid rgba(239,68,68,0.5)' }}
              initial={{ scale:1, opacity:0.7 }}
              animate={{ scale:2.2, opacity:0 }}
              transition={{ duration:1.6, delay: i * 0.4, repeat: Infinity, ease:'easeOut' }}
            />
          ))}
          <motion.div
            animate={
              state === 'active'
                ? { scale:[1,1.08,1], boxShadow:[
                    '0 0 30px rgba(239,68,68,0.5)',
                    '0 0 50px rgba(239,68,68,0.8)',
                    '0 0 30px rgba(239,68,68,0.5)',
                  ]}
                : state === 'connecting'
                  ? { scale:[0.95,1.05,0.95] }
                  : { scale:[1,1.06,1], boxShadow:[
                      '0 0 25px rgba(34,197,94,0.5)',
                      '0 0 40px rgba(34,197,94,0.7)',
                      '0 0 25px rgba(34,197,94,0.5)',
                    ]}
            }
            transition={{ duration: state === 'active' ? 1 : 2, repeat: Infinity, ease:'easeInOut' }}
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: state === 'active'
                ? 'linear-gradient(135deg,#ef4444,#b91c1c)'
                : 'linear-gradient(135deg,#22c55e,#06b6d4)',
            }}>
            <AnimatePresence mode="wait">
              {state === 'connecting'
                ? <motion.div key="load" initial={{ rotate:0 }} animate={{ rotate:360 }}
                    transition={{ duration:1, repeat:Infinity, ease:'linear' }}>
                    <Loader2 className="w-9 h-9 text-white"/>
                  </motion.div>
                : state === 'active'
                  ? <motion.div key="end" initial={{ scale:0 }} animate={{ scale:1 }}>
                      <PhoneOff className="w-9 h-9 text-white"/>
                    </motion.div>
                  : <motion.div key="mic" initial={{ scale:0 }} animate={{ scale:1 }}>
                      <Mic className="w-9 h-9 text-white"/>
                    </motion.div>
              }
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Label */}
        <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">
          {state === 'active'    ? '🔴 Call in progress'
          : state === 'connecting'? 'Connecting to Nova...'
          : state === 'error'    ? '⚠️ Try again'
          :                        '🎙️ Talk in Your Browser'}
        </p>

        <p className="font-display text-2xl md:text-3xl text-white mb-2">
          {state === 'active'     ? `End Call · ${fmtTime(elapsed)}`
          : state === 'connecting' ? 'One sec...'
          :                          'Tap to Talk to Nova'}
        </p>

        {/* Audio bars when active */}
        {state === 'active' && (
          <div className="flex items-center justify-center gap-1 h-6 mb-2">
            {[0,1,2,3,4,5,6].map(i => (
              <motion.div key={i}
                animate={{ height:[4, 4 + Math.random()*16, 4] }}
                transition={{ duration: 0.6 + Math.random()*0.4, repeat:Infinity, ease:'easeInOut', delay: i * 0.05 }}
                className="w-1 rounded-full bg-red-400"
              />
            ))}
          </div>
        )}

        <p className="text-gray-500 text-xs">
          {state === 'active'
            ? 'Click to hang up'
            : state === 'connecting'
              ? 'Asking for mic access...'
              : 'No phone call · No signup · Mic permission required'}
        </p>

        {/* Error banner */}
        <AnimatePresence>
          {state === 'error' && errMsg && (
            <motion.div
              initial={{ opacity:0, y:-6 }}
              animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-6 }}
              className="mt-4 inline-flex items-center gap-2 text-red-400 text-xs font-semibold bg-red-500/10 border border-red-500/30 rounded-full px-3 py-1.5">
              <AlertCircle className="w-3.5 h-3.5"/>
              {errMsg}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
