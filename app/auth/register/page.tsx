'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User as UserIcon, LogIn, Globe, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Info, 2: OTP
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setStep(2);
      } else {
        setError(data.message || 'Registration failed');
        toast.error(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, code: otp }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Account verified successfully!');
        router.push('/auth/login?verified=true');
      } else {
        setError(data.message || 'Verification failed');
        toast.error(data.message || 'Verification failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    toast.promise(
      fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      }),
      {
        loading: 'Sending code...',
        success: 'New code sent to your email!',
        error: 'Failed to send code.',
      }
    );
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
          <h1 className="text-2xl font-black">
            {step === 1 ? 'Create account' : 'Verify email'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {step === 1 ? 'Join our community of readers' : `We've sent a code to ${formData.email}`}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleRegister}
                className="space-y-4"
              >
                {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-800">{error}</div>}
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500 transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Globe className="w-4 h-4" /> Create Account</>}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyOtp}
                className="space-y-6"
              >
                {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-800">{error}</div>}
                <div>
                  <label className="block text-center text-sm font-semibold mb-4">Enter 6-digit verification code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-3xl font-black tracking-[1em] py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="000000"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ShieldCheck className="w-5 h-5" /> Verify & Continue</>}
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={resendOtp}
                    className="text-sm text-red-600 font-bold hover:underline"
                  >
                    Resend code
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-red-600 font-bold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
