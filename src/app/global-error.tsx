'use client';

/* Last-resort error boundary. Only renders when the root layout itself
   throws — at which point we can't depend on globals.css, ThemeProvider,
   or any of the other layout primitives. So we inline the styles. */

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[global-error]', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{
        margin: 0,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#030712',
        color: '#f1f5f9',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        padding: '2rem',
      }}>
        <div style={{ maxWidth: 480, textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64,
            background: 'rgba(239,68,68,0.12)',
            border: '1px solid rgba(239,68,68,0.45)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: 28,
          }}>!</div>
          <p style={{ color: '#f87171', fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 12 }}>
            Critical error
          </p>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
            Something broke at the root level.
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.6, margin: '0 0 8px' }}>
            We&apos;ve logged it. Try reloading — if that fails, call us directly.
          </p>
          {error?.digest && (
            <p style={{ color: '#475569', fontSize: 12, fontFamily: 'ui-monospace, monospace', marginTop: 8 }}>
              Error reference: {error.digest}
            </p>
          )}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 28 }}>
            <button onClick={reset}
              style={{
                background: '#2563eb', color: '#fff', border: 'none',
                padding: '12px 28px', borderRadius: 9999, fontWeight: 700, fontSize: 14,
                cursor: 'pointer',
              }}>
              Reload
            </button>
            <a href="tel:+15809191386"
              style={{
                color: '#fff', textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.18)',
                padding: '12px 28px', borderRadius: 9999, fontWeight: 700, fontSize: 14,
              }}>
              Call (580) 919-1386
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
