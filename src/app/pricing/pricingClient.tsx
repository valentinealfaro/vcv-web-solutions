'use client';
import dynamic from 'next/dynamic';

const View = dynamic(() => import('@/views/Pricing'), {
  ssr: false,
  loading: () => <div style={{ minHeight: '100vh', background: '#030712' }} />,
});

export default function PricingClient() { return <View />; }
