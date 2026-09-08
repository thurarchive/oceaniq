'use client';

import React from 'react';
import Link from 'next/link';
import { Map, FileText } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface DashboardActionsProps {
  onSubmit: () => void;
}

export default function DashboardActions({ onSubmit }: DashboardActionsProps) {
  const { language } = useLanguage();
  const isId = language === 'id';

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-3" aria-label={isId ? 'Aksi utama' : 'Primary actions'}>
      <button type="button" onClick={onSubmit} className="btn-primary flex items-center justify-center gap-2 text-sm py-3">
        {isId ? 'Kirim Observasi' : 'Submit Observation'}
      </button>
      <Link
        href="/interactive-map"
        className="inline-flex items-center justify-center gap-2 text-sm py-3 px-4 rounded-lg border border-border bg-card hover:border-primary/40 transition-colors"
      >
        <Map size={16} aria-hidden />
        {isId ? 'Jelajahi Peta' : 'Explore Map'}
      </Link>
      <Link
        href="/my-reports"
        className="inline-flex items-center justify-center gap-2 text-sm py-3 px-4 rounded-lg border border-border bg-card hover:border-primary/40 transition-colors"
      >
        <FileText size={16} aria-hidden />
        {isId ? 'Laporan Saya' : 'My Reports'}
      </Link>
    </section>
  );
}
