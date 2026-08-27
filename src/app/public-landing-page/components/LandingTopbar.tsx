'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AppLogo from '@/components/ui/AppLogo';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { Map, BarChart3, Menu, X, Waves, BookOpen, Loader2, Home, LogOut, LayoutDashboard, Trophy, Sun, Moon } from 'lucide-react';
import { toast } from 'sonner';
import { User as SupabaseUser } from '@supabase/supabase-js';

export default function LandingTopbar() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const navLinks = [
    { label: t.nav.home, href: '/', icon: <Home size={15} /> },
    { label: t.nav.about, href: '/about', icon: <BookOpen size={15} /> },
    { label: t.nav.map, href: '/interactive-map', icon: <Map size={15} /> },
    { label: t.nav.analytics, href: '/analytics-dashboard', icon: <BarChart3 size={15} /> },
    { label: t.nav.leaderboard, href: '/leaderboard', icon: <Trophy size={15} /> },
  ];

  const authNavLinks = [
    { label: t.nav.dashboard, href: '/user-dashboard', icon: <LayoutDashboard size={15} /> },
  ];

  function getRoleLabel(role?: string): string {
    switch (role) {
      case 'admin':
        return t.roles.administrator;
      case 'analyst':
        return t.roles.analyst;
      default:
        return t.roles.contributor;
    }
  }

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
      toast.success(language === 'id' ? 'Berhasil keluar' : 'Signed out successfully');
      router.push('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error signing out');
    }
  };

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === '/') {
      if (typeof window !== 'undefined' && window.location.pathname === '/') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${scrolled ? 'glass-card-elevated border-b border-border' : 'bg-transparent'
        }`}
    >
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 h-full flex items-center justify-between">
        <Link
          href="/"
          onClick={(e) => handleHomeClick(e, '/')}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <AppLogo size={32} />
          <span className="font-bold text-lg tracking-tight text-gradient-ocean">Oceaniq</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {[...navLinks, ...(user ? authNavLinks : [])]?.map((link) => (
            <Link
              key={`landing-nav-${link?.href}`}
              href={link?.href}
              onClick={(e) => handleHomeClick(e, link?.href)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all duration-200"
            >
              {link?.icon}
              {link?.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {/* ID / EN Language Toggle */}
          <div className="flex items-center text-xs font-semibold tracking-wider px-1.5 py-1 rounded-lg border border-border/80 bg-muted/40 text-muted-foreground shadow-xs">
            <button
              onClick={() => setLanguage('id')}
              className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${language === 'id'
                  ? 'text-primary font-bold bg-primary/15'
                  : 'text-muted-foreground/70 hover:text-foreground'
                }`}
              title="Bahasa Indonesia"
              aria-label="Switch to Indonesian"
            >
              ID
            </button>
            <span className="text-muted-foreground/40 mx-0.5 select-none">/</span>
            <button
              onClick={() => setLanguage('en')}
              className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${language === 'en'
                  ? 'text-primary font-bold bg-primary/15'
                  : 'text-muted-foreground/70 hover:text-foreground'
                }`}
              title="English"
              aria-label="Switch to English"
            >
              EN
            </button>
          </div>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg border border-border/80 bg-muted/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/70 hover:border-primary/40 transition-all duration-200 cursor-pointer shadow-xs"
            title={theme === 'dark' ? t.nav.themeLight : t.nav.themeDark}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun size={17} className="text-amber-400 hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon size={17} className="text-sky-600 hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>

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
                        {t.nav.signedInAs} {getRoleLabel(user.app_metadata?.role || user.user_metadata?.role)}
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
                        {t.nav.signOut}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <Link href="/contribute" className="btn-primary flex items-center gap-2 text-sm">
                <Waves size={14} />
                {t.nav.contribute}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className="text-sm px-4 py-2 rounded-lg border border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-all duration-200"
              >
                {t.nav.signIn}
              </Link>
              <Link href="/contribute" className="btn-primary flex items-center gap-2 text-sm">
                <Waves size={14} />
                {t.nav.contribute}
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
                onClick={(e) => {
                  setMobileOpen(false);
                  handleHomeClick(e, link?.href);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
              >
                {link?.icon}
                {link?.label}
              </Link>
            ))}
            {/* Mobile Language and Theme Row */}
            <div className="flex items-center justify-between gap-2 p-3 mt-2 rounded-lg bg-muted/40 border border-border/70">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">Bahasa:</span>
                <div className="flex items-center text-xs font-semibold px-2 py-1 rounded-md border border-border bg-card">
                  <button
                    onClick={() => setLanguage('id')}
                    className={`px-2 py-0.5 rounded ${language === 'id' ? 'text-primary font-bold bg-primary/15' : 'text-muted-foreground'}`}
                  >
                    ID
                  </button>
                  <span className="text-muted-foreground/40 mx-0.5">/</span>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-2 py-0.5 rounded ${language === 'en' ? 'text-primary font-bold bg-primary/15' : 'text-muted-foreground'}`}
                  >
                    EN
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">Tema:</span>
                <button
                  onClick={toggleTheme}
                  className="px-2.5 py-1 rounded-md border border-border bg-card flex items-center gap-1.5 text-xs text-foreground font-medium"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun size={14} className="text-amber-400" />
                      <span>{t.nav.themeDark}</span>
                    </>
                  ) : (
                    <>
                      <Moon size={14} className="text-sky-600" />
                      <span>{t.nav.themeLight}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              {loading ? (
                <div className="flex justify-center py-3">
                  <Loader2 size={16} className="animate-spin text-muted-foreground" />
                </div>
              ) : user ? (
                <div className="border-t border-border mt-3 pt-3 flex flex-col gap-2">
                  <div className="px-4 py-2 bg-muted/20 rounded-lg text-left">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {t.nav.signedInAs} {getRoleLabel(user.app_metadata?.role || user.user_metadata?.role)}
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
                    {t.nav.signOut}
                  </button>
                  <Link
                    href="/contribute"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary flex items-center justify-center gap-2 text-sm mt-2 py-2.5"
                  >
                    <Waves size={15} />
                    {t.nav.contribute}
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <Link
                    href="/auth"
                    onClick={() => setMobileOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-sm border border-primary/20 hover:bg-primary/5 rounded-lg transition-colors text-center font-medium text-muted-foreground hover:text-foreground"
                  >
                    {t.nav.signIn}
                  </Link>
                  <Link
                    href="/contribute"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary flex items-center justify-center gap-2 text-sm py-2.5"
                  >
                    <Waves size={15} />
                    {t.nav.contribute}
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