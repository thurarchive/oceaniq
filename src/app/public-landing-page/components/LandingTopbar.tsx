'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AppLogo from '@/components/ui/AppLogo';
import { Map, BarChart3, Menu, X, Waves, BookOpen, Loader2, Home, LogOut, LayoutDashboard } from 'lucide-react';
import { toast } from 'sonner';
import { User as SupabaseUser } from '@supabase/supabase-js';

const navLinks = [
  { label: 'Home', href: '/', icon: <Home size={15} /> },
  { label: 'About', href: '/about', icon: <BookOpen size={15} /> },
  { label: 'Map', href: '/interactive-map', icon: <Map size={15} /> },
  { label: 'Analytics', href: '/analytics-dashboard', icon: <BarChart3 size={15} /> },
];

const authNavLinks = [
  { label: 'Dashboard', href: '/user-dashboard', icon: <LayoutDashboard size={15} /> },
];

function getRoleLabel(role?: string): string {
  switch (role) {
    case 'admin':
      return 'Administrator';
    case 'analyst':
      return 'Verified Analyst';
    default:
      return 'Contributor';
  }
}

export default function LandingTopbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
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
          {[...navLinks, ...(user ? authNavLinks : [])]?.map((link) => (
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
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-9 h-9 rounded-full bg-gradient-to-r from-sky-500/20 to-cyan-500/20 border border-primary/30 flex items-center justify-center text-sm font-semibold text-primary hover:border-primary/60 transition-all duration-200 cursor-pointer"
                  aria-label="User Profile"
                >
                  {user.user_metadata?.full_name
                    ? user.user_metadata.full_name.charAt(0).toUpperCase()
                    : user.email?.charAt(0).toUpperCase() ?? 'U'}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-11 w-56 glass-card-elevated border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-border bg-card/50 text-left">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Signed in as {getRoleLabel(user.user_metadata?.role)}
                      </p>
                      <p className="text-sm font-semibold text-foreground truncate mt-0.5">
                        {user.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <div className="p-1 bg-card/30">
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          handleSignOut();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/10 hover:text-danger rounded-lg transition-colors cursor-pointer text-left font-medium"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <Link href="/contribute" className="btn-primary flex items-center gap-2 text-sm">
                <Waves size={14} />
                Contribute
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className="text-sm px-4 py-2 rounded-lg border border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-all duration-200"
              >
                Sign In
              </Link>
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
            {[...navLinks, ...(user ? authNavLinks : [])]?.map((link) => (
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
            <div className="flex flex-col gap-2 mt-2">
              {loading ? (
                <div className="flex justify-center py-3">
                  <Loader2 size={16} className="animate-spin text-muted-foreground" />
                </div>
              ) : user ? (
                <div className="border-t border-border mt-3 pt-3 flex flex-col gap-2">
                  <div className="px-4 py-2 bg-muted/20 rounded-lg text-left">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Signed in as {getRoleLabel(user.user_metadata?.role)}
                    </p>
                    <p className="text-sm font-semibold text-foreground truncate mt-0.5">
                      {user.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleSignOut();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-danger hover:bg-danger/10 border border-danger/20 rounded-lg transition-colors cursor-pointer font-medium"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                  <Link
                    href="/contribute"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary flex items-center justify-center gap-2 text-sm mt-2 py-2.5"
                  >
                    <Waves size={15} />
                    Contribute a Report
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <Link
                    href="/auth"
                    onClick={() => setMobileOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-sm border border-primary/20 hover:bg-primary/5 rounded-lg transition-colors text-center font-medium text-muted-foreground hover:text-foreground"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/contribute"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary flex items-center justify-center gap-2 text-sm py-2.5"
                  >
                    <Waves size={15} />
                    Contribute a Report
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}