'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AppLogo from '@/components/ui/AppLogo';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Map,
  BarChart3,
  Home,
  Menu,
  X,
  Bell,
  Waves,
  LogOut,
  Loader2,
  BookOpen,
  LayoutDashboard,
  ShieldCheck,
  Trophy,
  Sun,
  Moon,
} from 'lucide-react';
import { toast } from 'sonner';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface TopbarProps {
  currentPath?: string;
}

export default function Topbar({ currentPath = '/' }: TopbarProps) {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const navItems = [
    { label: t.nav.home, href: '/', icon: <Home size={16} /> },
    { label: t.nav.about, href: '/about', icon: <BookOpen size={16} /> },
    { label: t.nav.map, href: '/interactive-map', icon: <Map size={16} /> },
    { label: t.nav.analytics, href: '/analytics-dashboard', icon: <BarChart3 size={16} /> },
    { label: t.nav.leaderboard, href: '/leaderboard', icon: <Trophy size={16} /> },
  ];

  const authNavItems = [
    { label: t.nav.dashboard, href: '/user-dashboard', icon: <LayoutDashboard size={16} /> },
  ];

  const adminNavItem = {
    label: t.nav.admin,
    href: '/admin',
    icon: <ShieldCheck size={16} />,
  };

  const getRoleLabel = (role?: string): string => {
    switch (role) {
      case 'admin':
        return t.roles.administrator;
      case 'analyst':
        return t.roles.analyst;
      default:
        return t.roles.contributor;
    }
  };

  const notifications = [
    {
      id: 'notif-1',
      type: 'alert',
      text: language === 'id' ? 'Titik rawan terdeteksi: Teluk Jakarta Utara' : 'Hotspot detected: North Jakarta Bay',
      time: language === 'id' ? '5m lalu' : '5m ago',
    },
    {
      id: 'notif-2',
      type: 'report',
      text: language === 'id' ? 'Laporan sains warga baru perlu moderasi' : 'New citizen report pending moderation',
      time: language === 'id' ? '12m lalu' : '12m ago',
    },
    {
      id: 'notif-3',
      type: 'model',
      text: language === 'id' ? 'Model ML v1.3.0 selesai memprediksi tren' : 'ML model v1.3.0 prediction complete',
      time: language === 'id' ? '1j lalu' : '1h ago',
    },
  ];

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
    <header className="fixed top-0 left-0 right-0 z-50 glass-card-elevated border-b border-border h-16 transition-colors duration-200">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          onClick={(e) => handleHomeClick(e, '/')}
          className="flex items-center gap-2.5 group cursor-pointer shrink-0"
        >
          <AppLogo size={34} />
          <span className="font-bold text-lg tracking-tight text-gradient-ocean hidden sm:block">
            Oceaniq
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {(() => {
            const role = user?.app_metadata?.role || user?.user_metadata?.role;
            const items = [...navItems, ...(user ? authNavItems : []), ...(role === 'admin' ? [adminNavItem] : [])];
            return items;
          })().map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link
                key={`nav-${item.href}`}
                href={item.href}
                onClick={(e) => handleHomeClick(e, item.href)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Mandum Rimba Reference: ID / EN Language Toggle */}
          <div className="flex items-center text-xs font-semibold tracking-wider px-1.5 py-1 rounded-lg border border-border/80 bg-muted/40 text-muted-foreground shadow-xs">
            <button
              onClick={() => setLanguage('id')}
              className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                language === 'id'
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
              className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                language === 'en'
                  ? 'text-primary font-bold bg-primary/15'
                  : 'text-muted-foreground/70 hover:text-foreground'
              }`}
              title="English"
              aria-label="Switch to English"
            >
              EN
            </button>
          </div>

          {/* Mandum Rimba Reference: Sun/Moon Light-Dark Mode Toggle */}
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

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative w-9 h-9 rounded-lg border border-border/80 bg-muted/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/70 hover:border-primary/40 transition-all duration-200 cursor-pointer"
              aria-label={t.nav.notifications}
            >
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-background"></span>
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-11 w-80 glass-card-elevated border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-card/60">
                  <span className="text-sm font-semibold text-foreground">{t.nav.notifications}</span>
                  <span className="hotspot-badge">3 {t.nav.newNotifications}</span>
                </div>
                {notifications.map((n) => (
                  <div key={n.id} className="px-4 py-3 hover:bg-muted/40 cursor-pointer transition-colors border-b border-border/50 last:border-0">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${n.type === 'alert' ? 'bg-danger' : n.type === 'report' ? 'bg-warning' : 'bg-primary'
                        }`}></div>
                      <div>
                        <p className="text-xs font-medium text-foreground">{n.text}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Profile / Auth State */}
          {loading ? (
            <div className="w-9 h-9 flex items-center justify-center">
              <Loader2 size={16} className="animate-spin text-muted-foreground" />
            </div>
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-9 h-9 rounded-full bg-gradient-to-r from-sky-500/20 to-cyan-500/20 border border-primary/40 flex items-center justify-center text-sm font-semibold text-primary hover:border-primary/80 transition-all duration-200 cursor-pointer"
                aria-label="User Profile"
              >
                {user.user_metadata?.full_name
                  ? user.user_metadata.full_name.charAt(0).toUpperCase()
                  : user.email?.charAt(0).toUpperCase() ?? 'U'}
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-11 w-56 glass-card-elevated border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-border bg-card/70">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {t.nav.signedInAs} {getRoleLabel(user.app_metadata?.role || user.user_metadata?.role)}
                    </p>
                    <p className="text-sm font-semibold text-foreground truncate mt-0.5">
                      {user.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <div className="p-1 bg-card/40">
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
          ) : (
            <Link
              href="/auth"
              className="text-sm px-3.5 py-1.5 rounded-lg border border-primary/25 hover:border-primary/50 hover:bg-primary/10 text-foreground font-medium transition-all duration-200"
            >
              {t.nav.signIn}
            </Link>
          )}

          {/* Contribute CTA */}
          <Link
            href="/contribute"
            className="hidden sm:flex btn-primary items-center gap-2 text-sm px-3.5 py-1.5"
          >
            <Waves size={15} />
            {t.nav.contribute}
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-9 h-9 rounded-lg border border-border/80 bg-muted/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden glass-card-elevated border-t border-border px-4 py-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="flex flex-col gap-1">
            {/* Mobile Nav Links */}
            {(() => {
              const role = user?.app_metadata?.role || user?.user_metadata?.role;
              return [...navItems, ...(user ? authNavItems : []), ...(role === 'admin' ? [adminNavItem] : [])];
            })().map((item) => {
              const isActive = currentPath === item.href;
              return (
                <Link
                  key={`mobile-nav-${item.href}`}
                  href={item.href}
                  onClick={(e) => {
                    setMobileOpen(false);
                    handleHomeClick(e, item.href);
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}

            {/* Mobile Language and Theme Row */}
            <div className="flex items-center justify-between gap-2 p-3 mt-2 rounded-lg bg-muted/40 border border-border/70">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">Language:</span>
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
                <span className="text-xs text-muted-foreground font-medium">Theme:</span>
                <button
                  onClick={toggleTheme}
                  className="px-2.5 py-1 rounded-md border border-border bg-card flex items-center gap-1.5 text-xs text-foreground font-medium"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun size={14} className="text-amber-400" />
                      <span>Dark</span>
                    </>
                  ) : (
                    <>
                      <Moon size={14} className="text-sky-600" />
                      <span>Light</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Auth Drawer Controls */}
            {loading ? (
              <div className="flex justify-center py-3">
                <Loader2 size={16} className="animate-spin text-muted-foreground" />
              </div>
            ) : user ? (
              <div className="border-t border-border mt-3 pt-3 flex flex-col gap-2">
                <div className="px-4 py-2 bg-muted/30 rounded-lg">
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
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm border border-primary/20 hover:bg-primary/5 rounded-lg transition-colors text-center font-medium text-foreground"
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
          </nav>
        </div>
      )}
    </header>
  );
}