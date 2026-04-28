'use client';
import dynamic from 'next/dynamic';
const View = dynamic(() => import('@/views/admin/LeadFinder'), { ssr: false });
export default function Page() { return <View />; }
