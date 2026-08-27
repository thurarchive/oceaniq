'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function NotFound() {
  const router = useRouter();
  const { language, t } = useLanguage();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background ocean-gradient p-4 text-foreground">
      <div className="text-center max-w-md glass-card-elevated p-8 rounded-2xl border border-border shadow-xl">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <h1 className="text-8xl font-black text-primary/30 tracking-widest font-mono">404</h1>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">{t.notFound.title}</h2>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          {t.notFound.desc}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleGoBack}
            className="btn-ghost inline-flex items-center justify-center gap-2 text-xs font-semibold py-2.5 px-5 cursor-pointer"
          >
            <ArrowLeft size={14} />
            {language === 'id' ? 'Kembali' : 'Go Back'}
          </button>

          <button
            onClick={handleGoHome}
            className="btn-primary inline-flex items-center justify-center gap-2 text-xs font-semibold py-2.5 px-5 cursor-pointer"
          >
            <Home size={14} />
            {t.notFound.backHome}
          </button>
        </div>
      </div>
    </div>
  );
}