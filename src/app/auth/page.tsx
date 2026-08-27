"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from 'next/link';
import { Waves, Mail, Lock, User, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';

type AuthMode = 'login' | 'signup' | 'forgot';

interface WaveButtonProps {
    children: React.ReactNode;
    type?: 'submit' | 'button';
    onClick?: () => void;
    variant?: 'primary' | 'tab-active' | 'tab-inactive';
    className?: string;
    disabled?: boolean;
}

function WaveButton({ children, type = 'button', onClick, variant = 'primary', className = '', disabled }: WaveButtonProps) {
    const [waves, setWaves] = useState<{ id: number; x: number; y: number }[]>([]);
    const btnRef = useRef<HTMLButtonElement>(null);
    const counterRef = useRef(0);

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return;
        const rect = btnRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = counterRef.current++;
        setWaves((prev) => [...prev, { id, x, y }]);
        setTimeout(() => setWaves((prev) => prev.filter((w) => w.id !== id)), 700);
    };

    if (variant === 'primary') {
        return (
            <button
                ref={btnRef}
                type={type}
                onClick={onClick}
                onMouseEnter={handleMouseEnter}
                disabled={disabled}
                className={`relative overflow-hidden w-full btn-primary flex items-center justify-center gap-2 py-3 text-base font-semibold transition-all ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {waves.map((w) => (
                    <span
                        key={w.id}
                        className="wave-ripple"
                        style={{ left: w.x, top: w.y }}
                    />
                ))}
                {children}
            </button>
        );
    }

    return (
        <button
            ref={btnRef}
            type={type}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            disabled={disabled}
            className={`relative overflow-hidden flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
                variant === 'tab-active' ? 'bg-primary/20 text-primary border border-primary/40' : 'text-muted-foreground hover:text-foreground border border-transparent'
            } ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {waves.map((w) => (
                <span
                    key={w.id}
                    className="wave-ripple-subtle"
                    style={{ left: w.x, top: w.y }}
                />
            ))}
            {children}
        </button>
    );
}

export default function AuthPage() {
    const router = useRouter();
    const { language, t } = useLanguage();
    const [mode, setMode] = useState<AuthMode>('login');
    const [loading, setLoading] = useState(false);

    // Auto-redirect if already logged in
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.replace('/interactive-map');
            }
        };
        checkUser();
    }, [router]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const modeParam = urlParams.get('mode');
        if (modeParam === 'signup') {
            setMode('signup');
        } else if (modeParam === 'forgot') {
            setMode('forgot');
        }
    }, []);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === 'login') {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                toast.success(language === 'id' ? 'Berhasil masuk!' : 'Signed in successfully!');
                router.push('/interactive-map');
            } else if (mode === 'forgot') {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/auth/reset-password`,
                });
                if (error) throw error;
                toast.success(language === 'id' ? 'Tautan reset sandi terkirim! Silakan cek kotak masuk email Anda.' : 'Password reset link sent! Please check your email inbox.');
                setMode('login');
            } else {
                if (password !== confirmPassword) {
                    toast.error(language === 'id' ? 'Kata sandi tidak cocok' : 'Passwords do not match');
                    setLoading(false);
                    return;
                }
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name,
                        },
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;

                if (data.session) {
                    toast.success(language === 'id' ? 'Akun berhasil dibuat dan Anda telah masuk!' : 'Account created and signed in successfully!');
                    router.push('/interactive-map');
                } else {
                    toast.success(language === 'id' ? 'Akun dibuat! Silakan periksa email Anda untuk konfirmasi pendaftaran.' : 'Account created! Please check your email to confirm registration.');
                }
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'An error occurred during authentication');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to initialize Google sign in');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen ocean-gradient flex flex-col items-center justify-center px-4 relative overflow-hidden py-12">
            {/* Background decorative layers */}
            <div className="absolute inset-0 hero-glow pointer-events-none" />

            {/* Back to home */}
            <div className="absolute top-6 left-6 z-20">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 group"
                >
                    <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
                    {language === 'id' ? 'Kembali ke Beranda' : 'Back to Oceaniq'}
                </Link>
            </div>

            {/* Auth card */}
            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <div className="flex flex-col items-center mb-6">
                    <div className="flex items-center gap-3 mb-3">
                        <AppLogo size={40} />
                        <span className="font-bold text-2xl tracking-tight text-gradient-ocean">Oceaniq</span>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                        {t.landing.badge}
                    </p>
                </div>

                {/* Glass card */}
                <div className="glass-card-elevated p-8 auth-card-glow border border-border shadow-xl rounded-2xl">
                    {/* Tab toggle */}
                    <div className="flex gap-1 p-1 rounded-xl mb-8 bg-muted/40 border border-border">
                        <WaveButton
                            variant={mode === 'login' ? 'tab-active' : 'tab-inactive'}
                            onClick={() => setMode('login')}
                            disabled={loading}
                        >
                            {t.auth.loginBtn}
                        </WaveButton>
                        <WaveButton
                            variant={mode === 'signup' ? 'tab-active' : 'tab-inactive'}
                            onClick={() => setMode('signup')}
                            disabled={loading}
                        >
                            {language === 'id' ? 'Daftar Akun' : 'Create Account'}
                        </WaveButton>
                    </div>

                    {/* Heading */}
                    <div className="mb-6">
                        <h1 className="text-xl font-bold text-foreground mb-1">
                            {mode === 'login' ? t.auth.loginTitle : mode === 'signup' ? t.auth.signupTitle : t.auth.forgotTitle}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {mode === 'login'
                                ? (language === 'id' ? 'Masuk untuk mengakses dasbor pemantauan sampah laut' : 'Sign in to access your monitoring dashboard')
                                : mode === 'signup'
                                    ? (language === 'id' ? 'Bergabunglah dengan komunitas pemantau pesisir Nusantara' : 'Create an account to start monitoring marine waste')
                                    : (language === 'id' ? 'Masukkan email terdaftar untuk menerima tautan atur ulang sandi' : 'Enter your registered email address to receive a password reset link')}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {mode === 'signup' && (
                            <div className="auth-input-group">
                                <label className="auth-label">{t.auth.fullNameLabel}</label>
                                <div className="auth-input-wrapper">
                                    <User size={15} className="auth-input-icon" />
                                    <input
                                        type="text"
                                        placeholder={language === 'id' ? 'Nama lengkap Anda' : 'Your full name'}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="auth-input text-foreground"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="auth-input-group">
                            <label className="auth-label">{t.auth.emailLabel}</label>
                            <div className="auth-input-wrapper">
                                <Mail size={15} className="auth-input-icon" />
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="auth-input text-foreground"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {mode !== 'forgot' && (
                            <div className="auth-input-group">
                                <div className="flex items-center justify-between mb-1">
                                    <label className="auth-label mb-0">{t.auth.passwordLabel}</label>
                                    {mode === 'login' && (
                                        <button
                                            type="button"
                                            onClick={() => setMode('forgot')}
                                            className="text-xs text-primary hover:underline"
                                        >
                                            {t.auth.forgotPasswordLink}
                                        </button>
                                    )}
                                </div>
                                <div className="auth-input-wrapper">
                                    <Lock size={15} className="auth-input-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="auth-input text-foreground pr-10"
                                        required
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>
                        )}

                        {mode === 'signup' && (
                            <div className="auth-input-group">
                                <label className="auth-label">{language === 'id' ? 'Konfirmasi Kata Sandi' : 'Confirm Password'}</label>
                                <div className="auth-input-wrapper">
                                    <Lock size={15} className="auth-input-icon" />
                                    <input
                                        type={showConfirm ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="auth-input text-foreground pr-10"
                                        required
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3 text-muted-foreground hover:text-foreground"
                                    >
                                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>
                        )}

                        <WaveButton type="submit" disabled={loading} className="mt-2">
                            {loading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : mode === 'login' ? (
                                t.auth.loginBtn
                            ) : mode === 'signup' ? (
                                t.auth.signupBtn
                            ) : (
                                t.auth.forgotBtn
                            )}
                        </WaveButton>
                    </form>

                    {mode === 'forgot' && (
                        <div className="mt-4 text-center">
                            <button
                                onClick={() => setMode('login')}
                                className="text-xs text-muted-foreground hover:text-foreground"
                            >
                                {t.auth.backToLogin}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
