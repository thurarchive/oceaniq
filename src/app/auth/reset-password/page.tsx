'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Waves, Lock, Eye, EyeOff, ArrowLeft, Loader2, KeyRound, CheckCircle2 } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Wave ripple button effect
  const [waves, setWaves] = useState<{ id: number; x: number; y: number }[]>([]);
  const btnRef = useRef<HTMLButtonElement>(null);
  const counterRef = useRef(0);

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading) return;
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = counterRef.current++;
    setWaves((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setWaves((prev) => prev.filter((w) => w.id !== id)), 700);
  };

  useEffect(() => {
    // Check session or listen for PASSWORD_RECOVERY event
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setHasRecoverySession(true);
      }
      setCheckingAuth(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        setHasRecoverySession(true);
        setCheckingAuth(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      toast.success('Password updated successfully!');
      setResetSuccess(true);

      setTimeout(() => {
        router.push('/interactive-map');
      }, 2000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen ocean-gradient flex flex-col items-center justify-center text-foreground px-4 text-center">
        <div className="glass-card-elevated p-8 max-w-sm w-full flex flex-col items-center gap-4 border border-primary/20">
          <Loader2 className="animate-spin text-primary" size={32} />
          <div>
            <h2 className="text-lg font-bold text-foreground">Verifying Reset Link</h2>
            <p className="text-sm text-muted-foreground mt-1">Checking authorization state, please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ocean-gradient flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorative layers */}
      <div className="absolute inset-0 hero-glow pointer-events-none" />

      {/* Animated SVG waves at bottom */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden" style={{ height: '180px' }}>
        <svg viewBox="0 0 1440 180" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
          <path
            d="M0,80 Q180,20 360,80 Q540,140 720,80 Q900,20 1080,80 Q1260,140 1440,80 L1440,180 L0,180 Z"
            fill="rgba(14,165,233,0.06)"
            style={{ animation: 'wave-drift 8s ease-in-out infinite' }}
          />
          <path
            d="M0,110 Q200,60 400,110 Q600,160 800,110 Q1000,60 1200,110 Q1320,140 1440,110 L1440,180 L0,180 Z"
            fill="rgba(6,182,212,0.05)"
            style={{ animation: 'wave-drift 11s ease-in-out infinite reverse' }}
          />
        </svg>
      </div>

      {/* Back to auth */}
      <div className="absolute top-6 left-6">
        <Link
          href="/auth"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
          Back to Sign In
        </Link>
      </div>

      {/* Card Container */}
      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-3 mb-3">
            <AppLogo size={40} />
            <span className="font-bold text-2xl tracking-tight text-gradient-ocean">Oceaniq</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Marine Waste Monitoring Platform
          </p>
        </div>

        <div className="glass-card-elevated p-8 auth-card-glow border border-primary/10">
          {resetSuccess ? (
            <div className="flex flex-col items-center text-center py-6">
              <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent mb-4">
                <CheckCircle2 size={28} />
              </div>
              <h1 className="text-xl font-bold text-foreground mb-2">Password Updated!</h1>
              <p className="text-sm text-muted-foreground mb-6">
                Your password has been successfully updated. Redirecting you to your dashboard...
              </p>
              <Loader2 className="animate-spin text-primary" size={24} />
            </div>
          ) : !hasRecoverySession ? (
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-12 h-12 rounded-full bg-danger/20 border border-danger/40 flex items-center justify-center text-danger mb-4">
                <KeyRound size={24} />
              </div>
              <h1 className="text-xl font-bold text-foreground mb-2">Link Expired or Invalid</h1>
              <p className="text-sm text-muted-foreground mb-6">
                This password reset link is invalid or has expired. Please request a new password reset link.
              </p>
              <Link href="/auth?mode=forgot" className="w-full btn-primary flex items-center justify-center gap-2 py-3 font-semibold text-sm">
                Request New Link
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <KeyRound size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground mb-0.5">Set New Password</h1>
                  <p className="text-xs text-muted-foreground">Enter a new secure password for your account</p>
                </div>
              </div>

              <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                <div className="auth-input-group">
                  <label className="auth-label">New Password</label>
                  <div className="auth-input-wrapper">
                    <Lock size={15} className="auth-input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="auth-input pr-10 text-foreground"
                      required
                      minLength={6}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="auth-input-group">
                  <label className="auth-label">Confirm New Password</label>
                  <div className="auth-input-wrapper">
                    <Lock size={15} className="auth-input-icon" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="auth-input pr-10 text-foreground"
                      required
                      minLength={6}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                    >
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="mt-2">
                  <button
                    ref={btnRef}
                    type="submit"
                    onMouseEnter={handleMouseEnter}
                    disabled={loading}
                    className={`relative overflow-hidden w-full btn-primary flex items-center justify-center gap-2 py-3 text-base font-semibold transition-all ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {waves.map((w) => (
                      <span key={w.id} className="wave-ripple" style={{ left: w.x, top: w.y }} />
                    ))}
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Updating Password...
                      </>
                    ) : (
                      <>
                        <Waves size={16} />
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
