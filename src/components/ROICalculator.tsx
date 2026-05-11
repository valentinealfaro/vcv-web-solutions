'use client';
import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calculator, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';

const Slider = ({
  label, value, onChange, min, max, step = 1, suffix = '', color,
}: {
  label: string; value: number; onChange: (n: number) => void;
  min: number; max: number; step?: number; suffix?: string; color: string;
}) => (
  <div>
    <div className="flex items-baseline justify-between mb-2">
      <label className="text-gray-300 text-sm font-semibold">{label}</label>
      <span className="font-display text-2xl text-white" style={{ textShadow: `0 0 18px ${color}80` }}>
        {value.toLocaleString()}{suffix}
      </span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="w-full h-2 rounded-full appearance-none cursor-pointer outline-none"
      style={{
        background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.08) ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.08) 100%)`,
        accentColor: color,
      }}
    />
  </div>
);

export const ROICalculator = () => {
  const [callsPerMo, setCallsPerMo]   = useState(80);    // calls received / month
  const [missPct,    setMissPct]      = useState(30);    // % currently going to voicemail
  const [closeRate,  setCloseRate]    = useState(20);    // % of answered calls that close
  const [jobValue,   setJobValue]     = useState(1500);  // avg job value $

  const math = useMemo(() => {
    const missedCalls    = Math.round(callsPerMo * (missPct / 100));
    const recoveredCalls = Math.round(missedCalls * 0.85); // Nova captures ~85% of missed
    const newJobs        = Math.round(recoveredCalls * (closeRate / 100));
    const newRevenue     = newJobs * jobValue;
    const novaCost       = 147;            // Growth tier
    const netProfit      = newRevenue - novaCost;
    const roi            = newRevenue > 0 ? Math.round((netProfit / novaCost) * 100) : 0;
    return { missedCalls, recoveredCalls, newJobs, newRevenue, netProfit, roi };
  }, [callsPerMo, missPct, closeRate, jobValue]);

  const fmt = (n: number) => `$${n.toLocaleString()}`;

  return (
    <div className="relative max-w-5xl mx-auto">
      <div className="absolute -inset-4 rounded-[28px] pointer-events-none"
        style={{ background:'linear-gradient(135deg,rgba(34,197,94,0.4),rgba(6,182,212,0.3))', filter:'blur(48px)', opacity:0.4 }}/>

      <div className="relative rounded-3xl p-px"
        style={{ background:'linear-gradient(135deg,rgba(34,197,94,0.5),rgba(6,182,212,0.4),rgba(59,130,246,0.3))' }}>
        <div className="rounded-[23px] p-6 md:p-9"
          style={{ background:'rgba(5,12,22,0.97)', backdropFilter:'blur(24px)' }}>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background:'rgba(34,197,94,0.15)', border:'1px solid rgba(34,197,94,0.4)' }}>
              <Calculator className="w-5 h-5 text-green-400"/>
            </div>
            <div>
              <p className="text-green-400 text-xs font-bold uppercase tracking-widest">ROI Calculator</p>
              <h3 className="text-white font-bold text-xl">See exactly what Nova will make you</h3>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Sliders */}
            <div className="space-y-5">
              <Slider label="Calls you get per month"   value={callsPerMo} onChange={setCallsPerMo} min={20}  max={500} color="#3b82f6"/>
              <Slider label="% of calls you currently miss" value={missPct} onChange={setMissPct} min={5} max={70}  suffix="%" color="#ef4444"/>
              <Slider label="% of answered calls that close" value={closeRate} onChange={setCloseRate} min={5}  max={60}  suffix="%" color="#22c55e"/>
              <Slider label="Average job value"          value={jobValue}   onChange={setJobValue}   min={100} max={20000} step={50} color="#fbbf24"/>
            </div>

            {/* Result */}
            <div className="space-y-3">
              <div className="rounded-xl p-4"
                style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.3)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-red-400"/>
                  <p className="text-red-400 text-xs font-bold uppercase tracking-widest">You&apos;re losing</p>
                </div>
                <p className="font-display text-3xl text-white" style={{ textShadow:'0 0 20px rgba(239,68,68,0.5)' }}>
                  {math.missedCalls} calls/mo
                </p>
                <p className="text-gray-400 text-xs">going straight to voicemail</p>
              </div>

              <div className="rounded-xl p-4"
                style={{ background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.4)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-400"/>
                  <p className="text-green-400 text-xs font-bold uppercase tracking-widest">Nova recovers</p>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div>
                    <p className="font-display text-2xl text-white">{math.recoveredCalls}</p>
                    <p className="text-gray-400 text-xs">leads / mo</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl text-white">{math.newJobs}</p>
                    <p className="text-gray-400 text-xs">new jobs / mo</p>
                  </div>
                </div>
              </div>

              <motion.div
                animate={{ boxShadow:[
                  '0 0 30px rgba(34,197,94,0.3)',
                  '0 0 50px rgba(34,197,94,0.55)',
                  '0 0 30px rgba(34,197,94,0.3)',
                ]}}
                transition={{ duration: 2.4, repeat: Infinity, ease:'easeInOut' }}
                className="rounded-xl p-5 text-center"
                style={{ background:'linear-gradient(135deg,rgba(34,197,94,0.18),rgba(6,182,212,0.12))', border:'1.5px solid rgba(34,197,94,0.6)' }}>
                <p className="text-gray-300 text-xs uppercase tracking-widest font-bold mb-1">Extra revenue / month</p>
                <p className="font-display text-5xl md:text-6xl text-white"
                  style={{ textShadow:'0 0 30px rgba(34,197,94,0.7)' }}>
                  {fmt(math.newRevenue)}
                </p>
                <p className="text-green-400 text-sm font-bold mt-1">
                  {math.roi}× ROI on Nova Growth ($147/mo)
                </p>
              </motion.div>

              <a href="#bundle"
                className="block w-full text-center py-3.5 rounded-xl font-bold text-white text-sm"
                style={{
                  background:'linear-gradient(135deg,#22c55e,#06b6d4)',
                  boxShadow:'0 0 22px rgba(34,197,94,0.5)',
                }}>
                Activate Nova → Capture {fmt(math.newRevenue)}/mo
                <ArrowRight className="w-4 h-4 inline-block ml-1"/>
              </a>
            </div>
          </div>

          <p className="text-gray-500 text-xs text-center mt-6 leading-relaxed">
            Calculator assumes Nova captures ~85% of currently-missed calls (industry avg).
            Your results will vary based on your actual call mix and close rate.
          </p>
        </div>
      </div>
    </div>
  );
};
