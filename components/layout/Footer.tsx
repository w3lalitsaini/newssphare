import Link from 'next/link';
import { Globe, Twitter, Facebook, Instagram, Youtube, Mail } from 'lucide-react';
import AdSlot from '@/components/ads/AdSlot';
import NewsletterForm from './NewsletterForm';

const footerLinks = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Careers', href: '/careers' },
    { label: 'Advertise', href: '/advertise' },
  ],
  categories: [
    { label: 'Technology', href: '/category/technology' },
    { label: 'Business', href: '/category/business' },
    { label: 'Entertainment', href: '/category/entertainment' },
    { label: 'Sports', href: '/category/sports' },
    { label: 'Health', href: '/category/health' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'DMCA', href: '/dmca' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 mt-16">
      {/* Footer Ad */}
      <div className="border-b border-gray-800">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <AdSlot placement="footer" className="flex justify-center" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white">
                News<span className="text-red-500">Sphere</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed max-w-xs">
              Your premier source for breaking news, in-depth analysis, and global insights.
              Stay informed with NewsSphere.
            </p>
            <div className="flex gap-3">
              {[Twitter, Facebook, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([key, links]) => (
            <div key={key}>
              <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-4">
                {key}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 mt-10 pt-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h4 className="text-white font-bold mb-1">Newsletter</h4>
              <p className="text-sm text-gray-400">Get the latest news delivered to your inbox.</p>
            </div>
            <NewsletterForm />
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} NewsSphere. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Built with Next.js · MongoDB · Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
