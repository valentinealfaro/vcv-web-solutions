'use client';
import dynamic from 'next/dynamic';
const View = dynamic(() => import('@/views/Landing'), { ssr: false });
export default function Page() { return <View />; }
