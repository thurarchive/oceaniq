'use client';

import React from 'react';
import Topbar from '@/components/Topbar';
import ContributeForm from './components/ContributeForm';
import AppLogo from '@/components/ui/AppLogo';
import { useLanguage } from '@/context/LanguageContext';

export default function ContributePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen ocean-gradient text-foreground flex flex-col relative overflow-hidden">
      {/* Navigation Bar */}
      <Topbar currentPath="/contribute" />

      {/* Decorative Glow Elements */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10 flex flex-col items-center">
        {/* Page Hero Header */}
        <div className="text-center max-w-2xl mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-3 shadow-xs">
            <AppLogo size={18} />
            <span>{t.contribute.badge}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gradient-ocean mb-2">
            {t.contribute.title}
          </h1>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {t.contribute.subtitle}
          </p>
        </div>

        {/* Contribute Form Container */}
        <div className="w-full flex justify-center">
          <ContributeForm />
        </div>
      </main>
    </div>
  );
}
