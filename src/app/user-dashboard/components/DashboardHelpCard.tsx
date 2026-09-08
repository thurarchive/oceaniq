'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function DashboardHelpCard() {
  const { language } = useLanguage();
  const isId = language === 'id';

  const links = [
    { href: '/faq', label: 'FAQ' },
    { href: '/report-a-problem', label: isId ? 'Laporkan masalah' : 'Report a Problem' },
    { href: '/about#methodology', label: isId ? 'Data dan metodologi' : 'Data and methodology' },
    { href: '/privacy', label: isId ? 'Privasi' : 'Privacy' },
  ];

  return (
    <section className="rounded-xl border border-border/50 p-5 bg-card/30" aria-labelledby="dashboard-help-heading">
      <h2 id="dashboard-help-heading" className="text-sm font-semibold text-foreground mb-2">
        {isId ? 'Butuh bantuan?' : 'Need help?'}
      </h2>
      <nav aria-label={isId ? 'Tautan bantuan dasbor' : 'Dashboard help links'} className="flex flex-wrap gap-x-4 gap-y-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="text-sm text-primary hover:underline">
            {link.label}
          </Link>
        ))}
      </nav>
    </section>
  );
}
