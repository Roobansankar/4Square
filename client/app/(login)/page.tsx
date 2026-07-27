'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Eye, EyeOff, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@4square.com');
  const [password, setPassword] = useState('password123');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    if (email === 'admin@4square.com' && password === 'password123') {
      localStorage.setItem('auth', 'true');
      router.push('/dashboard');
    } else {
      setError('Invalid email or password.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#000435] flex items-center justify-center p-4">

      <div className="w-full max-w-md relative">
        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Building2 size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">4 Square Architects</h1>
            <p className="text-orange-100 text-sm mt-1">Construction & Architecture ERP</p>
          </div>

          {/* Form */}
          <div className="px-8 py-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">Sign in to your account</h2>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide mb-1.5 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="admin@4square.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded accent-orange-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">Remember me</span>
                </label>
                <button type="button" className="text-sm text-orange-500 hover:text-orange-600 font-medium">
                  Forgot password?
                </button>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
                ) : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800/50">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Demo Credentials</p>
              <p className="text-xs text-slate-600 dark:text-slate-300">Email: admin@4square.com</p>
              <p className="text-xs text-slate-600 dark:text-slate-300">Password: password123</p>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-4">
          © 2024 4 Square Architects. All rights reserved.
        </p>
      </div>
    </div>
  );
}
