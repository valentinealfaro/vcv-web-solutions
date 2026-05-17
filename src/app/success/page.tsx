import type { Metadata } from 'next';
import SuccessClient from './successClient';

/* /success is hit post-Stripe checkout. We don't want it indexed (it's
   transactional, not content), and we want the page title to reflect the
   moment instead of a generic site name. */
export const metadata: Metadata = {
  title: 'Order Confirmed · VCV Web Solutions',
  description: 'Your payment cleared. Your project is in our queue. Here\'s what happens next.',
  robots: { index: false, follow: false, nocache: true, noarchive: true },
};

export default function Page() { return <SuccessClient />; }
