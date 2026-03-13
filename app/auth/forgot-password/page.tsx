'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Globe, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubmitted(true);
        toast.success('Reset link sent to your email');
      } else {
        const data = await res.json();
        toast.error(data.message || 'Something went wrong');
      }
    } catch (err) {
      toast.error('Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black">
              News<span className="text-red-600">Sphere</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black">Reset password</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {submitted ? 'Check your inbox' : 'Enter your email to get a reset link'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">
          {submitted ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                We&apos;ve sent a password reset link to <strong>{email}</strong>. Please check your email and follow the instructions.
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-red-600 font-bold hover:underline"
              >
                <ArrowLeft className="w-4 h-4" /> Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send reset link'}
              </button>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
