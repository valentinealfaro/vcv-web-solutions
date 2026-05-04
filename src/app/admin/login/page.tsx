'use client';
import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/admin/lead-finder';

  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setErr('');
    try {
      const res = await fetch('/api/admin-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace(next);
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setErr(data.error || 'Login failed');
    } catch (e: any) {
      setErr(e?.message || 'Network error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm">
        <form onSubmit={submit} className="neon-card p-8 text-center">
          <div className="w-14 h-14 btn-neon rounded-full flex items-center justify-center mx-auto mb-5">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h2 className="font-display text-3xl text-white mb-1">ADMIN ACCESS</h2>
          <p className="text-gray-500 text-sm mb-6">Enter password to continue</p>

          <div className="relative mb-3">
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Admin password"
              autoFocus
              autoComplete="current-password"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-all pr-10"
            />
            <button type="button" onClick={() => setShowPass(s => !s)}
              className="absolute right-3 top-3.5 text-gray-500 hover:text-white">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {err && <p className="text-red-400 text-xs mb-3">{err}</p>}

          <button type="submit" disabled={busy || !password}
            className="w-full btn-neon btn-glow text-white py-3 rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : 'Enter'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
