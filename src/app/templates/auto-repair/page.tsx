'use client';
import dynamic from 'next/dynamic';
const View = dynamic(() => import('@/views/templates/AutoRepair'), { ssr: false });
export default function Page() { return <View />; }
