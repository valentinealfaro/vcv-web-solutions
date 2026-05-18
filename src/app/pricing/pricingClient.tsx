'use client';
import dynamic from 'next/dynamic';

/* Server-renders the Pricing view so users see content immediately
   instead of a blank dark rectangle while the JS chunk loads. */
const View = dynamic(() => import('@/views/Pricing'));

export default function PricingClient() { return <View />; }
