'use client';
import Link from 'next/link';
import { Inbox, Target } from 'lucide-react';

type Tab = 'leads' | 'lead-finder';

const TABS: { id: Tab; href: string; label: string; Icon: typeof Inbox }[] = [
  { id: 'leads',       href: '/admin/leads',       label: 'Inbound Leads', Icon: Inbox },
  { id: 'lead-finder', href: '/admin/lead-finder', label: 'Lead Finder',   Icon: Target },
];

export default function AdminTabs({ active }: { active: Tab }) {
  return (
    <div className="flex items-center gap-1 mb-6 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit">
      {TABS.map(({ id, href, label, Icon }) => (
        <Link
          key={id}
          href={href}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
            active === id
              ? 'bg-white/[0.08] text-white shadow-lg shadow-blue-900/20'
              : 'text-gray-500 hover:text-white'
          }`}>
          <Icon className="w-4 h-4"/> {label}
        </Link>
      ))}
    </div>
  );
}
