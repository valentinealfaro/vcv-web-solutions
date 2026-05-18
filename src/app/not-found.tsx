import dynamic from 'next/dynamic';

/* Server-renders the 404 view so users see content immediately instead
   of a blank dark rectangle while the JS chunk loads. */
const View = dynamic(() => import('@/views/NotFound'));

export default function NotFound() { return <View />; }
