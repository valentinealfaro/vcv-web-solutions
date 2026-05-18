'use client';
import dynamic from 'next/dynamic';

/* Server-renders the AIReceptionist view so users see content immediately
   instead of a blank dark rectangle while the JS chunk loads. */
const View = dynamic(() => import('@/views/AIReceptionist'));

export default function AIReceptionistClient() { return <View />; }
