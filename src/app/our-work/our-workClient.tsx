'use client';
import dynamic from 'next/dynamic';

/* Server-renders the Portfolio view so users see content immediately
   instead of a blank dark rectangle while the JS chunk loads. */
const View = dynamic(() => import('@/views/Portfolio'));

export default function PortfolioClient() { return <View />; }
