'use client';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { db, auth } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { Search, Calendar, User, ArrowRight, Loader2, Plus, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { BlogPost } from '../types';
import ReactMarkdown from 'react-markdown';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'blogPosts'), orderBy('publishedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
      setPosts(postsData);
      setLoading(false);
    });

    const checkAdmin = () => {
      const user = auth.currentUser;
      if (user && user.email === 'info@vcvservices.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };
    
    const authUnsubscribe = auth.onAuthStateChanged(checkAdmin);

    return () => {
      unsubscribe();
      authUnsubscribe();
    };
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const seedBlog = async () => {
    const samplePosts = [
      {
        title: "How to Get More Customers Online",
        slug: "how-to-get-more-customers-online",
        excerpt: "Discover the proven strategies to attract and convert more customers through your digital presence.",
        content: "# How to Get More Customers Online\n\nIn today's digital age, your website is your most powerful sales tool. But just having a website isn't enough. You need a strategy that actively brings in customers.\n\n## 1. Focus on Conversions\nYour website should be designed with a clear goal in mind. Whether it's a lead form or a purchase, every element should guide the user toward that action.\n\n## 2. Optimize for SEO\nIf people can't find you, they can't buy from you. Global SEO strategies ensure your business appears when potential customers search for your services.\n\n## 3. Use Paid Ads Strategically\nAds can provide an immediate boost in traffic. When combined with a high-converting landing page, they offer a powerful growth engine.",
        author: "VCV Team",
        tags: ["Growth", "SEO", "Strategy"],
        publishedAt: new Date().toISOString(),
        featuredImage: "https://picsum.photos/seed/customers/1200/800"
      },
      {
        title: "Why Your Website is Not Converting",
        slug: "why-your-website-is-not-converting",
        excerpt: "Is your traffic high but your sales low? Here are the top reasons why your website might be failing to convert.",
        content: "# Why Your Website is Not Converting\n\nIt's frustrating to see traffic coming to your site without any leads or sales. Here's why it might be happening:\n\n## 1. Slow Loading Speeds\nUsers expect instant results. If your site takes more than 3 seconds to load, you're losing potential customers.\n\n## 2. Poor Mobile Experience\nMost users browse on their phones. If your site isn't mobile-first, you're alienating a huge portion of your audience.\n\n## 3. Lack of Clear CTAs\nIf users don't know what to do next, they'll leave. Your Call to Action (CTA) should be clear, bold, and frequent.",
        author: "VCV Team",
        tags: ["UX", "Design", "Conversion"],
        publishedAt: new Date().toISOString(),
        featuredImage: "https://picsum.photos/seed/conversion/1200/800"
      },
      {
        title: "SEO Tips for Small Businesses",
        slug: "seo-tips-for-small-businesses",
        excerpt: "You don't need a massive budget to rank on Google. Follow these simple SEO tips to boost your visibility.",
        content: "# SEO Tips for Small Businesses\n\nSEO can seem daunting, but small businesses can compete by focusing on the right strategies.\n\n## 1. Target Long-Tail Keywords\nInstead of competing for broad terms, target specific phrases that your customers are actually searching for.\n\n## 2. Create High-Quality Content\nGoogle rewards sites that provide value. Regularly publishing helpful blog posts is one of the best ways to improve your rankings.\n\n## 3. Build Internal Links\nLink your blog posts to your service pages. This helps search engines understand your site structure and boosts your authority.",
        author: "VCV Team",
        tags: ["SEO", "Small Business", "Tips"],
        publishedAt: new Date().toISOString(),
        featuredImage: "https://picsum.photos/seed/seo/1200/800"
      }
    ];

    try {
      for (const post of samplePosts) {
        await addDoc(collection(db, 'blogPosts'), post);
      }
      alert('Blog seeded successfully!');
    } catch (err) {
      console.error(err);
      alert('Error seeding blog');
    }
  };

  return (
    <div className="bg-black pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6"
          >
            Our <span className="text-blue-500">Blog</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Insights, strategies, and tips to help you dominate your market online.
          </motion.p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
          {isAdmin && (
            <div className="flex space-x-4">
              <button
                onClick={seedBlog}
                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-bold transition-all"
              >
                <span>Seed Blog</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Add New Post</span>
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-gray-900 border border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all flex flex-col"
              >
                <Link href={`/blog/${post.slug}`} className="aspect-video relative overflow-hidden block">
                  <img
                    src={post.featuredImage || `https://picsum.photos/seed/${post.slug}/800/600`}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{post.author || 'VCV Team'}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-500 transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-blue-500 font-bold text-sm flex items-center space-x-2 group/link"
                    >
                      <span>Read More</span>
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                    <div className="flex space-x-2">
                      {post.tags?.slice(0, 2).map((tag, i) => (
                        <span key={i} className="text-[10px] font-bold bg-white/5 text-gray-500 px-2 py-0.5 rounded-full uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-gray-500 text-lg">No articles found matching your search.</p>
          </div>
        )}
      </div>

      {/* Add Post Modal (Simplified) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-gray-900 border border-white/10 p-8 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-white">Add New Blog Post</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newPost = {
                title: formData.get('title'),
                slug: formData.get('slug'),
                excerpt: formData.get('excerpt'),
                content: formData.get('content'),
                author: formData.get('author'),
                tags: (formData.get('tags') as string).split(',').map(t => t.trim()),
                publishedAt: new Date().toISOString(),
                featuredImage: formData.get('featuredImage') || ''
              };
              try {
                await addDoc(collection(db, 'blogPosts'), newPost);
                setShowAddModal(false);
              } catch (err) {
                console.error(err);
                alert('Error adding post');
              }
            }} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Title</label>
                <input name="title" required className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Slug</label>
                <input name="slug" required className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Excerpt</label>
                <textarea name="excerpt" rows={2} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Content (Markdown)</label>
                <textarea name="content" rows={10} required className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 font-mono text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Author</label>
                  <input name="author" defaultValue="VCV Team" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Tags (comma separated)</label>
                  <input name="tags" placeholder="SEO, Design, Growth" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all">
                Publish Post
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
