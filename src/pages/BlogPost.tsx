import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { Calendar, User, ArrowLeft, Loader2, Share2, Facebook, Twitter, Linkedin, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { BlogPost as BlogPostType } from '../types';

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      const q = query(collection(db, 'blogPosts'), where('slug', '==', slug), limit(1));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        navigate('/blog');
        return;
      }
      const postData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as BlogPostType;
      setPost(postData);
      setLoading(false);
    };
    fetchPost();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="bg-black pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/blog"
          className="inline-flex items-center space-x-2 text-gray-500 hover:text-white mb-12 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Back to Blog</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-6 font-bold uppercase tracking-widest">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-500" />
              <span>{post.author || 'VCV Team'}</span>
            </div>
            <div className="flex space-x-2">
              {post.tags?.map((tag, i) => (
                <span key={i} className="bg-blue-600/10 text-blue-500 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-12 leading-tight">
            {post.title}
          </h1>

          <div className="aspect-video rounded-3xl overflow-hidden mb-12 border border-white/10 shadow-2xl">
            <img
              src={post.featuredImage || `https://picsum.photos/seed/${post.slug}/1200/800`}
              alt={post.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-invert prose-blue max-w-none mb-16">
            <div className="text-gray-300 text-lg leading-relaxed space-y-6">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </div>

          <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                V
              </div>
              <div>
                <p className="text-white font-bold">{post.author || 'VCV Team'}</p>
                <p className="text-gray-500 text-sm">Digital Growth Experts at VCV Web Solutions</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Share</span>
              <div className="flex space-x-3">
                <button className="p-2 bg-gray-900 border border-white/5 rounded-lg hover:border-blue-500/30 transition-all text-gray-400 hover:text-white">
                  <Facebook className="w-5 h-5" />
                </button>
                <button className="p-2 bg-gray-900 border border-white/5 rounded-lg hover:border-blue-500/30 transition-all text-gray-400 hover:text-white">
                  <Twitter className="w-5 h-5" />
                </button>
                <button className="p-2 bg-gray-900 border border-white/5 rounded-lg hover:border-blue-500/30 transition-all text-gray-400 hover:text-white">
                  <Linkedin className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-24 p-12 bg-gray-950 border border-white/5 rounded-3xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Want results like these?</h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto">
            We've helped hundreds of businesses scale their online presence. Let's see what we can do for you.
          </p>
          <Link
            to="/free-demo"
            className="inline-flex items-center space-x-3 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-2xl"
          >
            <span>Request Your Free Demo</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
