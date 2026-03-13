'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Sun, Moon, Menu, X, LogIn, User, LogOut,
  ChevronDown, Bell, Globe
} from 'lucide-react';
import { NAV_LINKS } from '@/lib/utils';

export default function Navbar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      {/* Top ticker bar */}
      <div className="bg-red-600 dark:bg-red-700 text-white text-xs py-1.5 overflow-hidden">
        <div className="flex items-center gap-2 px-4">
          <span className="font-bold uppercase tracking-wider bg-white text-red-600 px-2 py-0.5 rounded text-xs shrink-0">
            BREAKING
          </span>
          <div className="overflow-hidden whitespace-nowrap">
            <span className="animate-marquee inline-block">
              Global markets respond to latest economic data &nbsp;•&nbsp;
              Tech giants report record earnings this quarter &nbsp;•&nbsp;
              Climate summit reaches historic agreement &nbsp;•&nbsp;
              Sports: Championship finals set for this weekend &nbsp;•&nbsp;
            </span>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-lg'
            : 'bg-white dark:bg-gray-950'
        } border-b border-gray-200 dark:border-gray-800`}
      >
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center shadow-md">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
                  News<span className="text-red-600">Sphere</span>
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 top-12 w-72 bg-white dark:bg-gray-900 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 p-3 z-50"
                    >
                      <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                          autoFocus
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search articles..."
                          className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg outline-none text-gray-900 dark:text-white"
                        />
                        <button
                          type="submit"
                          className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                        >
                          Go
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-700" />
                  )}
                </button>
              )}

              {/* Auth */}
              {session ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || ''}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-bold">
                        {session.user?.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-900 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                      >
                        <div className="p-3 border-b border-gray-100 dark:border-gray-800">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{session.user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                        </div>
                        <Link href="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <User className="w-4 h-4" /> Profile
                        </Link>
                        {(session.user as any)?.role === 'admin' && (
                          <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-800">
                            <Bell className="w-4 h-4" /> Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={() => signOut()}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <LogOut className="w-4 h-4" /> Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  >
                    {link.label}
                  </Link>
                ))}
                {!session && (
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-2 mt-2 px-3 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg"
                    onClick={() => setMobileOpen(false)}
                  >
                    <LogIn className="w-4 h-4" /> Login
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
