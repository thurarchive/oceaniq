'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AppLogo from '@/components/ui/AppLogo';
import { Map, BarChart3, Menu, X, Waves, BookOpen, Loader2, Home } from 'lucide-react';
import { toast } from 'sonner';
import { User as SupabaseUser } from '@supabase/supabase-js';

const navLinks = [
  { label: 'Home', href: '/', icon: <Home size={15} /> },
  { label: 'About', href: '/about', icon: <BookOpen size={15} /> },
  { label: 'Map', href: '/interactive-map', icon: <Map size={15} /> },
  { label: 'Analytics', href: '/analytics-dashboard', icon: <BarChart3 size={15} /> },
];

export default function LandingTopbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully');
      router.push('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error signing out');
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${scrolled ? 'glass-card-elevated border-b border-border' : 'bg-transparent'
        }`}
    >
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <AppLogo size={32} />
          <span className="font-bold text-lg tracking-tight text-gradient-ocean">Oceaniq</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks?.map((link) => (
            <Link
              key={`landing-nav-${link?.href}`}
              href={link?.href}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all duration-200"
            >
              {link?.icon}
              {link?.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="w-9 h-9 flex items-center justify-center">
              <Loader2 size={16} className="animate-spin text-muted-foreground" />
            </div>
          ) : user ? (
            <>
              <Link href="/interactive-map" className="btn-ghost text-sm">Dashboard</Link>
              <button
                onClick={handleSignOut}
                className="text-sm px-3.5 py-1.5 rounded-lg border border-danger/20 hover:border-danger/40 hover:bg-danger/5 text-danger transition-all duration-200 cursor-pointer font-medium"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth" className="btn-ghost text-sm">Sign In</Link>
              <Link href="/contribute" className="btn-primary flex items-center gap-2 text-sm">
                <Waves size={14} />
                Contribute
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden glass-card-elevated border-t border-border px-6 py-4">
          <nav className="flex flex-col gap-1">
            {navLinks?.map((link) => (
              <Link
                key={`mobile-landing-nav-${link?.href}`}
                href={link?.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
              >
                {link?.icon}
                {link?.label}
              </Link>
            ))}
            <div className="flex gap-2 mt-2">
              {loading ? (
                <div className="flex-1 flex justify-center py-2">
                  <Loader2 size={16} className="animate-spin text-muted-foreground" />
                </div>
              ) : user ? (
                <>
                  <Link
                    href="/interactive-map"
                    onClick={() => setMobileOpen(false)}
                    className="btn-ghost text-sm flex-1 text-center py-2.5"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleSignOut();
                    }}
                    className="text-sm flex-1 text-center py-2.5 rounded-lg border border-danger/20 hover:border-danger/40 hover:bg-danger/5 text-danger transition-all cursor-pointer font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth"
                    onClick={() => setMobileOpen(false)}
                    className="btn-ghost text-sm flex-1 text-center py-2.5"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/contribute"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary text-sm flex-1 text-center flex items-center justify-center gap-1.5 py-2.5"
                  >
                    <Waves size={13} />
                    Contribute
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}