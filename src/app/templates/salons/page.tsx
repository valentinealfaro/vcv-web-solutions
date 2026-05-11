'use client';
import dynamic from 'next/dynamic';
const View = dynamic(() => import('@/views/templates/Salons'), { ssr: false });
export default function Page() { return <View />; }
