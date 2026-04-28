'use client';
import React from 'react';
import Link from 'next/link';

interface State { hasError: boolean }

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('[ErrorBoundary]', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ textAlign: 'center', maxWidth: 480 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>⚡</div>
            <h1 style={{ color: '#f1f5f9', fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
              Something went wrong
            </h1>
            <p style={{ color: '#64748b', fontSize: 15, marginBottom: 28, lineHeight: 1.6 }}>
              We hit an unexpected error. Try refreshing the page — it usually fixes it.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
                style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', color: 'white', border: 'none',
                  padding: '12px 24px', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                Refresh Page
              </button>
              <Link href="/"
                style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)',
                  padding: '12px 24px', borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
