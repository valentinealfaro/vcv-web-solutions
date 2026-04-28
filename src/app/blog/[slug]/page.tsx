'use client';
import { useParams } from 'next/navigation';
import BlogPost from '@/pages/BlogPost';

export default function BlogPostPage() {
  // BlogPost reads params internally via useParams from next/navigation
  return <BlogPost />;
}
