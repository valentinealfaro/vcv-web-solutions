'use client';
import dynamic from 'next/dynamic';
const View = dynamic(() => import('@/views/AIReceptionist'), { ssr: false });
export default function Page() { return <View />; }
