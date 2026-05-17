import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

/* ─────────────────────────────────────────────────────────────────
   Dynamic Open Graph image generator.

   Usage:
     /api/og?title=Roofers%20Website%20Template
            &subtitle=Live%20demo%20%C2%B7%20From%20%2497%2Fmo
            &accent=%23ef4444
            &emoji=🏠

   Returns a 1200x630 PNG branded with VCV's logo + dark background
   + your title/subtitle. Used by template / state / guide pages so
   every share on social media gets a unique, on-brand preview card.

   Edge runtime keeps generation fast (sub-100ms per image after
   first warm-up). Output is cached by Vercel's CDN per unique URL.
   ───────────────────────────────────────────────────────────────── */

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const title    = (searchParams.get('title')    ?? 'VCV Web Solutions').slice(0, 90);
  const subtitle = (searchParams.get('subtitle') ?? 'Websites that generate leads — from $97/mo').slice(0, 120);
  const accent   = searchParams.get('accent')    ?? '#3b82f6';
  const emoji    = searchParams.get('emoji')     ?? '';
  const eyebrow  = (searchParams.get('eyebrow')  ?? 'VCV WEB SOLUTIONS').slice(0, 40);

  return new ImageResponse(
    (
      <div style={{
        width:  '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 72px',
        background: '#0b0b0c',
        fontFamily: '"Inter", "Helvetica Neue", system-ui, sans-serif',
        color: '#ffffff',
        position: 'relative',
      }}>
        {/* Top accent rule */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 8,
          background: `linear-gradient(90deg, ${accent} 0%, #8b5cf6 100%)`,
          display: 'flex',
        }} />

        {/* Soft ambient gradient blobs in the bg */}
        <div style={{
          position: 'absolute', top: -150, left: -100,
          width: 600, height: 600,
          background: `${accent}26`,
          filter: 'blur(160px)',
          borderRadius: 9999,
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', bottom: -200, right: -150,
          width: 700, height: 700,
          background: 'rgba(124,58,237,0.18)',
          filter: 'blur(160px)',
          borderRadius: 9999,
          display: 'flex',
        }} />

        {/* Top: eyebrow + emoji */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 9999,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.7)',
            textTransform: 'uppercase',
          }}>
            <div style={{
              width: 10, height: 10, borderRadius: 9999,
              background: accent,
              display: 'flex',
            }}/>
            {eyebrow}
          </div>
          {emoji && (
            <div style={{ fontSize: 120, lineHeight: 1, display: 'flex' }}>{emoji}</div>
          )}
        </div>

        {/* Middle: title + subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, position: 'relative', zIndex: 1, maxWidth: '92%' }}>
          <div style={{
            fontSize: title.length > 60 ? 64 : 80,
            fontWeight: 800,
            letterSpacing: '-0.035em',
            lineHeight: 1.02,
            color: '#ffffff',
            display: 'flex',
          }}>
            {title}
          </div>
          <div style={{
            fontSize: 30,
            fontWeight: 400,
            lineHeight: 1.35,
            color: 'rgba(255,255,255,0.62)',
            display: 'flex',
          }}>
            {subtitle}
          </div>
        </div>

        {/* Bottom: brand strip */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.08)',
          position: 'relative', zIndex: 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: `linear-gradient(135deg, ${accent}, #8b5cf6)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 900, letterSpacing: '0.04em',
              color: '#0b0b0c',
            }}>VCV</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', display: 'flex' }}>vcvwebsolutions.com</div>
              <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, display: 'flex' }}>
                Built in 3–7 days · From $97/mo
              </div>
            </div>
          </div>
          <div style={{
            padding: '12px 22px',
            background: accent,
            color: '#0b0b0c',
            borderRadius: 9999,
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: '-0.01em',
            display: 'flex',
          }}>
            Get a free demo →
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=2592000, s-maxage=2592000, immutable',
      },
    },
  );
}
