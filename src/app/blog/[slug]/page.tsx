'use client';
import { useParams } from 'next/navigation';
import BlogPost from '@/views/BlogPost';

export default function BlogPostPage() {
  // BlogPost reads params internally via useParams from next/navigation
  return <BlogPost />;
}
