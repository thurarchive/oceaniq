'use client';

import React from 'react';
import Link from 'next/link';
import { Map } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function MapContextCard() {
  const { language } = useLanguage();
  const isId = language === 'id';

  return (
    <section className="glass-card-elevated border border-border/40 rounded-2xl p-5 sm:p-6 space-y-3" aria-labelledby="map-context-heading">
      <h2 id="map-context-heading" className="text-sm font-semibold text-foreground uppercase tracking-wider">
        {isId ? 'Konteks pemantauan' : 'Monitoring context'}
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {isId
          ? 'Buka peta untuk melihat observasi yang telah ditinjau beserta lapisan estimasi model. Estimasi model dilabeli sebagai perkiraan, bukan pengukuran langsung.'
          : 'Open the map to explore reviewed observations and model estimate layers. Model outputs are labeled as estimates, not direct measurements.'}
      </p>
      <Link href="/interactive-map" className="btn-primary inline-flex items-center gap-2 text-sm">
        <Map size={16} aria-hidden />
        {isId ? 'Buka Peta Pemantauan' : 'Open Monitoring Map'}
      </Link>
    </section>
  );
}
