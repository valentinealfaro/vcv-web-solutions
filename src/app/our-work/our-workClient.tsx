'use client';
import dynamic from 'next/dynamic';

const View = dynamic(() => import('@/views/Portfolio'), {
  ssr: false,
  loading: () => <div style={{ minHeight: '100vh', background: '#030712' }} />,
});

export default function PortfolioClient() { return <View />; }
