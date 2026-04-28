import Link from 'next/link';
import { Mail, Phone, Globe } from 'lucide-react';

export const Footer = () => (
  <footer className="relative bg-[#030712] border-t border-white/[0.06] pt-20 pb-10 overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-blue-600/30 to-transparent" />
    <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-blue-900/5 blur-[80px] rounded-full" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-5">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0881087059.firebasestorage.app/o/VCV%20Web%20Solutions%2FVCV%20Websolutions%20Logo.png?alt=media&token=aed21397-69ca-4846-a45d-267482b81acf"
              alt="VCV Web Solutions"
              className="w-8 h-8 object-contain"
              referrerPolicy="no-referrer"
            />
            <span className="font-bold text-white">VCV Web Solutions</span>
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            High-converting websites, SEO, and ad systems designed to grow your business — fast.
          </p>
          <div className="neon-badge w-fit">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block" />
            Available Now
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Services</h4>
          <ul className="space-y-3 text-sm text-gray-500">
            {['Website Design', 'SEO Optimization', 'Paid Ads Setup', 'Social Media Growth'].map(s => (
              <li key={s}><Link href="/services" className="hover:text-blue-400 transition-colors">{s}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Company</h4>
          <ul className="space-y-3 text-sm text-gray-500">
            {[
              { label: 'About', path: '/' },
              { label: 'Portfolio', path: '/portfolio' },
              { label: 'Pricing', path: '/pricing' },
              { label: 'Blog', path: '/blog' },
            ].map(item => (
              <li key={item.label}><Link href={item.path} className="hover:text-blue-400 transition-colors">{item.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Contact</h4>
          <ul className="space-y-3 text-sm text-gray-500">
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span>info@vcvservices.com</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <a href="tel:+15809191386" className="hover:text-blue-400 transition-colors">+1 (580) 919-1386</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span>Global Services</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
        <p>© {new Date().getFullYear()} VCV Web Solutions. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);
