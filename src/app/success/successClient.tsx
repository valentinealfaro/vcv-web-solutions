'use client';
import dynamic from 'next/dynamic';

/* Server-renders the Success view so users see content immediately
   instead of a blank dark rectangle while the JS chunk loads. */
const View = dynamic(() => import('@/views/Success'));

export default function SuccessClient() { return <View />; }
