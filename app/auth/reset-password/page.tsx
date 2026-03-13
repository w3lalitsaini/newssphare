'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Globe, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!email || !token) {
      toast.error('Invalid reset link');
      router.push('/auth/login');
    }
  }, [email, token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setCompleted(true);
        toast.success(data.message);
        setTimeout(() => router.push('/auth/login'), 3000);
      } else {
        toast.error(data.message || 'Reset failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (completed) {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold mb-2">Password Updated!</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Your password has been reset successfully. Redirecting you to login...
        </p>
        <Link
          href="/auth/login"
          className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-700 transition-colors"
        >
          Login Now
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-1.5">New Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showPass ? 'text' : 'password'}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500 transition-all"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500 transition-all"
            placeholder="••••••••"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
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
          <h1 className="text-2xl font-black">Create new password</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Please enter your new password below</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">
          <Suspense fallback={<div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </motion.div>
    </div>
  );
}
