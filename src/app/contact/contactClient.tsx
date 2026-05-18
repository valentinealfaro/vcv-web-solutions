'use client';
import dynamic from 'next/dynamic';

/* Server-renders the Contact view so users see content immediately
   instead of a blank dark rectangle while the JS chunk loads. */
const View = dynamic(() => import('@/views/Contact'));

export default function ContactClient() { return <View />; }
