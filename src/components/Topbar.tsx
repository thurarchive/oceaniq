'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AppLogo from '@/components/ui/AppLogo';
import { Map, BarChart3, Home, Menu, X, Bell, Waves, LogOut, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/', icon: <Home size={16} /> },
  { label: 'Map', href: '/interactive-map', icon: <Map size={16} /> },
  { label: 'Analytics', href: '/analytics-dashboard', icon: <BarChart3 size={16} /> },
];

interface TopbarProps {
  currentPath?: string;
}

export default function Topbar({ currentPath = '/' }: TopbarProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const notifications = [
    { id: 'notif-1', type: 'alert', text: 'Hotspot detected: North Jakarta Bay', time: '5m ago' },
    { id: 'notif-2', type: 'report', text: 'New citizen report pending moderation', time: '12m ago' },
    { id: 'notif-3', type: 'model', text: 'ML model v1.3.0 prediction complete', time: '1h ago' },
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
      toast.success('Signed out successfully');
      router.push('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error signing out');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card-elevated border-b border-border h-16">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <AppLogo size={34} />
          <span className="font-bold text-lg tracking-tight text-gradient-ocean hidden sm:block">
            Oceaniq
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link
                key={`nav-${item.href}`}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                  ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
              >
                {item.icon}
                {item.label}
                {item.badge && (
                  <span className="bg-danger text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full"></span>
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-11 w-80 glass-card-elevated border border-border rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Notifications</span>
                  <span className="hotspot-badge">3 new</span>
                </div>
                {notifications.map((n) => (
                  <div key={n.id} className="px-4 py-3 hover:bg-muted/40 cursor-pointer transition-colors border-b border-border/50 last:border-0">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${n.type === 'alert' ? 'bg-danger' : n.type === 'report' ? 'bg-warning' : 'bg-primary'
                        }`}></div>
                      <div>
                        <p className="text-sm text-foreground">{n.text}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contribute CTA */}
          <Link
            href="/contribute"
            className="hidden sm:flex btn-primary items-center gap-2 text-sm"
          >
            <Waves size={15} />
            Contribute
          </Link>

          {/* User Profile / Auth State */}
          {loading ? (
            <div className="w-9 h-9 flex items-center justify-center">
              <Loader2 size={16} className="animate-spin text-muted-foreground" />
            </div>
          ) : user ? (
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
                  <div className="px-4 py-3 border-b border-border bg-card/50">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Signed in as</p>
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
          ) : (
            <Link
              href="/auth"
              className="text-sm px-4 py-2 rounded-lg border border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-all duration-200"
            >
              Sign In
            </Link>
          )}

          {/* Mobile menu */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden glass-card-elevated border-t border-border px-4 py-4">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <Link
                  key={`mobile-nav-${item.href}`}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                    ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/contribute"
              onClick={() => setMobileOpen(false)}
              className="btn-primary flex items-center justify-center gap-2 text-sm mt-2 py-2.5"
            >
              <Waves size={15} />
              Contribute a Report
            </Link>

            {/* Mobile Auth Drawer Controls */}
            {loading ? (
              <div className="flex justify-center py-3">
                <Loader2 size={16} className="animate-spin text-muted-foreground" />
              </div>
            ) : user ? (
              <div className="border-t border-border mt-3 pt-3 flex flex-col gap-2">
                <div className="px-4 py-2 bg-muted/20 rounded-lg">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Signed in as</p>
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
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer font-medium"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm border border-primary/20 hover:bg-primary/5 rounded-lg transition-colors text-center mt-2 font-medium text-muted-foreground hover:text-foreground"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}