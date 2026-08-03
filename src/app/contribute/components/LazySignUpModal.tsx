'use client';

import React, { useState } from 'react';
import { Waves, Mail, Lock, User as UserIcon, Eye, EyeOff, X, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import AppLogo from '@/components/ui/AppLogo';

interface LazySignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (userId: string, fullName: string) => Promise<void>;
}

export default function LazySignUpModal({ isOpen, onClose, onAuthSuccess }: LazySignUpModalProps) {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Lock body scroll while modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name || email.split('@')[0],
            },
          },
        });

        if (error) throw error;

        const user = data.user;
        if (user) {
          toast.success('Account created successfully! Submitting your report...');
          await onAuthSuccess(user.id, name || email.split('@')[0]);
        } else {
          toast.success('Registration initiated. Submitting report...');
          await onAuthSuccess('guest', name || email.split('@')[0]);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          toast.success('Signed in! Submitting your report...');
          const userFullName = data.user.user_metadata?.full_name || email.split('@')[0];
          await onAuthSuccess(data.user.id, userFullName);
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      toast.error(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('oceaniq_pending_report_submit', 'true');
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/contribute`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      console.error('Google OAuth error:', err);
      toast.error(err?.message || 'Google sign-in failed');
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200 pt-16 sm:pt-6"
      role="dialog"
      aria-modal="true"
      aria-label="Sign Up to Save Report"
    >
      {/* Background Overlay */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Container */}
      <div className="relative z-20 w-full max-w-md my-auto glass-card-elevated border border-primary/30 rounded-3xl p-5 sm:p-8 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[85dvh] flex flex-col">
        {/* Glow Header Accent */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header Bar with Close Button */}
        <div className="flex items-center justify-between pb-3 border-b border-border/40 shrink-0 mb-4">
          <div className="flex items-center gap-2">
            <AppLogo size={22} />
            <span className="font-bold text-sm text-gradient-ocean">Oceaniq Auth</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-8 h-8 rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-all disabled:opacity-50 cursor-pointer"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto scrollbar-ocean pr-1">
          {/* Header Icon & Title */}
          <div className="flex flex-col items-center text-center mb-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-cyan-400/20 border border-primary/40 flex items-center justify-center text-primary mb-2.5 shadow-lg shadow-primary/10">
              <Sparkles size={24} className="animate-pulse" />
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              Your Report is Almost Ready!
            </h2>

            <div className="mt-2.5 p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-foreground/90 leading-relaxed text-left sm:text-center">
              <p className="font-medium text-sky-300">
                Sign up won't take long — just enter your email &amp; password or use Google auth for a faster method to save this report to your profile and earn your Citizen Scientist badge.
              </p>
            </div>
          </div>

          {/* Auth Toggle Tabs */}
          <div className="flex gap-1 p-1 bg-muted/40 rounded-xl mb-4 border border-border/50">
            <button
              type="button"
              onClick={() => setMode('signup')}
              disabled={loading}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => setMode('login')}
              disabled={loading}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {mode === 'signup' && (
              <div className="auth-input-group">
                <label className="auth-label text-xs">Full Name</label>
                <div className="auth-input-wrapper">
                  <UserIcon size={14} className="auth-input-icon" />
                  <input
                    type="text"
                    placeholder="e.g. Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="auth-input text-base sm:text-xs py-2.5"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            <div className="auth-input-group">
              <label className="auth-label text-xs">Email Address</label>
              <div className="auth-input-wrapper">
                <Mail size={14} className="auth-input-icon" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input text-base sm:text-xs py-2.5"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-label text-xs">Password</label>
              <div className="auth-input-wrapper">
                <Lock size={14} className="auth-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={mode === 'signup' ? 'Create a secure password' : 'Your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input pr-10 text-base sm:text-xs py-2.5"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 mt-1 cursor-pointer min-h-[44px]"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <Waves size={16} />
                  {mode === 'signup' ? 'Create Profile & Submit Report' : 'Sign In & Submit Report'}
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border/60" />
            <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
              or faster method
            </span>
            <div className="flex-1 h-px bg-border/60" />
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full btn-ghost text-xs font-semibold flex items-center justify-center gap-2 py-2.5 border border-border hover:border-primary/40 rounded-xl transition-all cursor-pointer min-h-[44px]"
          >
            {loading ? (
              <Loader2 className="animate-spin text-primary" size={15} />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            Continue with Google
          </button>

          {/* Security / Privacy badge */}
          <div className="flex items-center justify-center gap-1.5 my-4 text-[10px] text-muted-foreground opacity-70">
            <ShieldCheck size={12} className="text-positive" />
            <span>Your data is encrypted &amp; verified. No spam ever.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
