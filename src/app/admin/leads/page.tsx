'use client';
import dynamic from 'next/dynamic';
const View = dynamic(() => import('@/views/admin/AdminLeads'), { ssr: false });
export default function Page() { return <View />; }
