'use client';
import dynamic from 'next/dynamic';

/* Server-renders the Services view so users see content immediately
   instead of a blank dark rectangle while the JS chunk loads. */
const View = dynamic(() => import('@/views/Services'));

export default function ServicesClient() { return <View />; }
