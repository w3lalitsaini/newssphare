'use client';

import { useState } from 'react';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubscribed(true);
        toast.success(data.message);
        setEmail('');
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 bg-green-900/20 text-green-400 rounded-lg border border-green-900/30">
        <CheckCircle2 className="w-5 h-5" />
        <span className="text-sm font-medium">Successfully subscribed!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="flex-1 md:w-64 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
      />
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Mail className="w-4 h-4" />
        )}
        Subscribe
      </button>
    </form>
  );
}
