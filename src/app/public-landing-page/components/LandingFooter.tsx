'use client';
import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import AppImage from '@/components/ui/AppImage';
import { Mail } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function LandingFooter() {
  const { language, t } = useLanguage();

  const footerLinks = {
    [t.landing.footer.navigation]: [
      { label: t.nav.map, href: '/interactive-map' },
      { label: t.nav.analytics, href: '/analytics-dashboard' },
      { label: t.nav.leaderboard, href: '/leaderboard' },
      { label: t.nav.contribute, href: '/contribute' },
    ],
    [t.landing.footer.resources]: [
      { label: t.landing.footer.methodology, href: '/about' },
      { label: language === 'id' ? 'Sumber Data' : 'Data Sources', href: '/about#data' },
      { label: language === 'id' ? 'Versi Model AI' : 'Model Versions', href: '/about#models' },
      { label: language === 'id' ? 'Akses API' : 'API Access', href: '/about#api' },
      { label: language === 'id' ? 'FAQ' : 'FAQ', href: '/faq' },
      { label: language === 'id' ? 'Laporkan Masalah' : 'Report a Problem', href: '/report-a-problem' },
    ],
    [t.landing.footer.legal]: [
      { label: t.landing.footer.privacyPolicy, href: '/privacy' },
      { label: t.landing.footer.terms, href: '/terms' },
      { label: t.landing.footer.dataLicense, href: '/open-data-license' },
    ],
  };

  return (
    <footer className="border-t border-border px-6 lg:px-10 py-12 mt-4 bg-background/50">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-8 mb-10">
          {/* Brand */}
          <div className="xl:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <AppLogo size={32} />
              <span className="font-bold text-base tracking-tight text-gradient-ocean">Oceaniq</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-xs">
              {t.landing.footer.tagline}
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/"
                className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-primary transition-colors border border-border"
                aria-label="Github"
              >
                <AppImage
                  src="/assets/images/github.svg"
                  alt="GitHub"
                  width={18}
                  height={18}
                  className="h-4 w-4"
                  unoptimized
                />
              </a>
              <a
                href="mailto:contact@oceaniq.id"
                className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-primary transition-colors border border-border"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={`footer-${category}`}>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-widest mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={`footer-link-${link.href}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 Oceaniq. {language === 'id' ? 'Data dilisensikan di bawah' : 'Data provided under'}{' '}
            <Link href="/open-data-license" className="text-primary hover:underline">CC BY 4.0</Link>.{' '}
            {language === 'id' ? 'Kemitraan data lingkungan oleh' : 'Dataset and Environmental data credited to'} <strong>OceanKita</strong>.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Model: XGBoost (Tuned Tabular)</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-positive rounded-full animate-pulse"></span>
              {language === 'id' ? 'Semua sistem normal' : 'All systems operational'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}