'use client';
import dynamic from 'next/dynamic';
const View = dynamic(() => import('@/views/NotFound'), { ssr: false });
export default function NotFound() { return <View />; }
