'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { Map, BarChart3, Home, Menu, X, Bell, Waves,  } from 'lucide-react';

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    { id: 'notif-1', type: 'alert', text: 'Hotspot detected: North Jakarta Bay', time: '5m ago' },
    { id: 'notif-2', type: 'report', text: 'New citizen report pending moderation', time: '12m ago' },
    { id: 'notif-3', type: 'model', text: 'ML model v1.3.0 prediction complete', time: '1h ago' },
  ];

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
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20' :'text-muted-foreground hover:text-foreground hover:bg-muted/60'
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
                  <span className="text-sm font-600 text-foreground">Notifications</span>
                  <span className="hotspot-badge">3 new</span>
                </div>
                {notifications.map((n) => (
                  <div key={n.id} className="px-4 py-3 hover:bg-muted/40 cursor-pointer transition-colors border-b border-border/50 last:border-0">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                        n.type === 'alert' ? 'bg-danger' : n.type === 'report' ? 'bg-warning' : 'bg-primary'
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
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20' :'text-muted-foreground hover:text-foreground hover:bg-muted/60'
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
              className="btn-primary flex items-center justify-center gap-2 text-sm mt-2"
            >
              <Waves size={15} />
              Contribute a Report
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}