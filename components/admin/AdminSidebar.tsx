'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, FileText, FolderOpen, Tag, Users,
  MessageSquare, Megaphone, Settings, Globe, ChevronRight, Cpu
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Articles', href: '/admin/articles', icon: FileText },
  { label: 'Blog Factory', href: '/admin/ai', icon: Cpu },
  { label: 'Categories', href: '/admin/categories', icon: FolderOpen },
  { label: 'Tags', href: '/admin/tags', icon: Tag },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Comments', href: '/admin/comments', icon: MessageSquare },
  { label: 'Advertisements', href: '/admin/advertisements', icon: Megaphone },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 dark:bg-gray-950 border-r border-gray-800 z-40 flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-black text-white">News<span className="text-red-500">Sphere</span></span>
            <span className="block text-xs text-gray-500">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                  isActive
                    ? 'bg-red-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-3 h-3" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}
