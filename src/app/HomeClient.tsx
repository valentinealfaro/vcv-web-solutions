'use client';
import dynamic from 'next/dynamic';

/* Server-renders the Home view so users see content immediately
   instead of a blank dark rectangle while the JS chunk loads. */
const View = dynamic(() => import('@/views/Home'));

export default function HomeClient() {
  return <View />;
}
