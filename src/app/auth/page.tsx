"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from 'next/link';
import { Waves, Mail, Lock, User, Eye, EyeOff, ArrowLeft, Fish } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';

type AuthMode = 'login' | 'signup';

interface WaveButtonProps {
    children: React.ReactNode;
    type?: 'submit' | 'button';
    onClick?: () => void;
    variant?: 'primary' | 'tab-active' | 'tab-inactive';
    className?: string;
}

function WaveButton({ children, type = 'button', onClick, variant = 'primary', className = '' }: WaveButtonProps) {
    const [waves, setWaves] = useState<{ id: number; x: number; y: number }[]>([]);
    const btnRef = useRef<HTMLButtonElement>(null);
    const counterRef = useRef(0);

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
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
                className={`relative overflow-hidden w-full btn-primary flex items-center justify-center gap-2 py-3 text-base font-semibold ${className}`}
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
            className={`relative overflow-hidden flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${variant === 'tab-active' ? 'bg-gradient-to-r from-sky-500/20 to-cyan-500/20 text-primary border border-primary/40' : 'text-muted-foreground hover:text-foreground border border-transparent'
                } ${className}`}
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
    const [mode, setMode] = useState<AuthMode>('login');
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const modeParam = urlParams.get('mode');
        if (modeParam === 'signup') {
            setMode('signup');
        }
    }, [])
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Auth logic placeholder
    };

    return (
        <div className="min-h-screen ocean-gradient flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Background decorative layers */}
            <div className="absolute inset-0 hero-glow pointer-events-none" />

            {/* Animated floating particles */}
            {[...Array(6)].map((_, i) => (
                <div
                    key={`particle-${i}`}
                    className="absolute rounded-full opacity-10 blur-xl pointer-events-none"
                    style={{
                        width: `${60 + i * 30}px`,
                        height: `${60 + i * 30}px`,
                        left: `${10 + i * 15}%`,
                        top: `${15 + (i % 3) * 25}%`,
                        background: i % 2 === 0 ? 'radial-gradient(circle, #0ea5e9, transparent)' : 'radial-gradient(circle, #06b6d4, transparent)',
                        animation: `float ${4 + i * 0.7}s ease-in-out infinite`,
                        animationDelay: `${i * 0.5}s`,
                    }}
                />
            ))}

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
                    <path
                        d="M0,140 Q240,110 480,140 Q720,170 960,140 Q1200,110 1440,140 L1440,180 L0,180 Z"
                        fill="rgba(3,105,161,0.07)"
                        style={{ animation: 'wave-drift 14s ease-in-out infinite' }}
                    />
                </svg>
            </div>

            {/* Back to home */}
            <div className="absolute top-6 left-6">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 group"
                >
                    <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
                    Back to Oceaniq
                </Link>
            </div>

            {/* Auth card */}
            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <div className="flex flex-col items-center mb-6">
                    <div className="flex items-center gap-3 mb-3">
                        <AppLogo size={40} />
                        <span className="font-bold text-2xl tracking-tight text-gradient-ocean">OceanKita</span>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                        Marine Waste Monitoring Platform
                    </p>
                </div>

                {/* Glass card */}
                <div className="glass-card-elevated p-8 auth-card-glow">
                    {/* Tab toggle */}
                    <div className="flex gap-1 p-1 rounded-xl mb-8" style={{ background: 'rgba(7,24,40,0.6)', border: '1px solid rgba(14,165,233,0.1)' }}>
                        <WaveButton
                            variant={mode === 'login' ? 'tab-active' : 'tab-inactive'}
                            onClick={() => setMode('login')}
                        >
                            Sign In
                        </WaveButton>
                        <WaveButton
                            variant={mode === 'signup' ? 'tab-active' : 'tab-inactive'}
                            onClick={() => setMode('signup')}
                        >
                            Create Account
                        </WaveButton>
                    </div>

                    {/* Heading */}
                    <div className="mb-6">
                        <h1 className="text-xl font-bold text-foreground mb-1">
                            {mode === 'login' ? 'Welcome back' : 'Join OceanKita'}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {mode === 'login' ? 'Sign in to access your monitoring dashboard' : 'Create an account to start monitoring marine waste'}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {mode === 'signup' && (
                            <div className="auth-input-group">
                                <label className="auth-label">Full Name</label>
                                <div className="auth-input-wrapper">
                                    <User size={15} className="auth-input-icon" />
                                    <input
                                        type="text"
                                        placeholder="Your full name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="auth-input"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="auth-input-group">
                            <label className="auth-label">Email Address</label>
                            <div className="auth-input-wrapper">
                                <Mail size={15} className="auth-input-icon" />
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="auth-input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="auth-input-group">
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="auth-label" style={{ marginBottom: 0 }}>Password</label>
                                {mode === 'login' && (
                                    <button type="button" className="text-xs text-primary hover:text-sky-300 transition-colors">
                                        Forgot password?
                                    </button>
                                )}
                            </div>
                            <div className="auth-input-wrapper">
                                <Lock size={15} className="auth-input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder={mode === 'login' ? 'Your password' : 'Create a password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="auth-input pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        {mode === 'signup' && (
                            <div className="auth-input-group">
                                <label className="auth-label">Confirm Password</label>
                                <div className="auth-input-wrapper">
                                    <Lock size={15} className="auth-input-icon" />
                                    <input
                                        type={showConfirm ? 'text' : 'password'}
                                        placeholder="Repeat your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="auth-input pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="mt-2">
                            <WaveButton type="submit" variant="primary">
                                <Waves size={16} />
                                {mode === 'login' ? 'Sign In' : 'Create Account'}
                            </WaveButton>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px" style={{ background: 'rgba(14,165,233,0.12)' }} />
                        <span className="text-xs text-muted-foreground">or continue with</span>
                        <div className="flex-1 h-px" style={{ background: 'rgba(14,165,233,0.12)' }} />
                    </div>

                    {/* Social placeholder */}
                    <div className="grid grid-cols-2 gap-3">
                        {['Google', 'GitHub'].map((provider) => (
                            <button
                                key={provider}
                                type="button"
                                className="btn-ghost text-sm flex items-center justify-center gap-2 py-2.5"
                            >
                                <Fish size={14} className="text-primary" />
                                {provider}
                            </button>
                        ))}
                    </div>

                    {/* Switch mode */}
                    <p className="text-center text-sm text-muted-foreground mt-6">
                        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                        <button
                            type="button"
                            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                            className="text-primary font-semibold hover:text-sky-300 transition-colors"
                        >
                            {mode === 'login' ? 'Create one' : 'Sign in'}
                        </button>
                    </p>
                </div>

                {/* Footer note */}
                <p className="text-center text-xs text-muted-foreground mt-6 opacity-60">
                    By continuing, you agree to OceanKita's Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}
