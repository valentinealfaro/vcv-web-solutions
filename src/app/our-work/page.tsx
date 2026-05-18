import { redirect } from 'next/navigation';

/* /our-work was the original portfolio page, but the content was identical
   to /templates. Merged into one page at /templates (better URL for SEO).
   This route stays alive as a 308 permanent redirect for legacy bookmarks. */
export default function Page() {
  redirect('/templates');
}
