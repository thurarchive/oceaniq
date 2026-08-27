'use client';
import React from 'react';
import Link from 'next/link';
import { FlaskConical, Info, ExternalLink, AlertCircle, Waves } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function MethodologyNote() {
  const { language, t } = useLanguage();

  return (
    <section className="px-6 lg:px-10 py-12">
      <div className="max-w-screen-2xl mx-auto space-y-4">
        {/* Main Transparency Card */}
        <div className="glass-card border border-primary/20 rounded-2xl p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <FlaskConical size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2 flex-wrap">
                {t.landing.methodology.title}
                <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-medium">
                  {language === 'id' ? 'Standar Saintifik' : 'Scientific Standards'}
                </span>
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {t.landing.methodology.desc}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                {[
                  {
                    id: 'method-obs',
                    icon: <Info size={14} />,
                    title: language === 'id' ? 'Observasi Terverifikasi' : 'Verified Observations',
                    desc: language === 'id'
                      ? 'Survei lapangan ber-GPS oleh pemantau lingkungan terlatih dengan reliabilitas data tertinggi.'
                      : 'GPS-tagged field surveys by trained environmental monitors. Highest data reliability.',
                    color: 'text-positive',
                    bg: 'bg-positive/10',
                  },
                  {
                    id: 'method-citizen',
                    icon: <Info size={14} />,
                    title: language === 'id' ? 'Laporan Sains Warga' : 'Citizen Reports',
                    desc: language === 'id'
                      ? 'Laporan masyarakat pesisir yang ditinjau oleh analis ahli sebelum diterbitkan ke publik.'
                      : 'Community-submitted reports reviewed by expert moderators before publication.',
                    color: 'text-accent',
                    bg: 'bg-accent/10',
                  },
                  {
                    id: 'method-ml',
                    icon: <AlertCircle size={14} />,
                    title: language === 'id' ? 'Estimasi Model AI' : 'ML Estimates',
                    desc: language === 'id'
                      ? 'Proyeksi densitas berbasis model XGBoost dengan rentang ketidakpastian terukur.'
                      : 'Model-derived predictions with uncertainty bounds. Labeled as estimates, not measurements.',
                    color: 'text-warning',
                    bg: 'bg-warning/10',
                  },
                ].map((item) => (
                  <div key={item.id} className={`${item.bg} rounded-xl p-4 border border-border/70`}>
                    <div className={`flex items-center gap-1.5 ${item.color} mb-1.5`}>
                      {item.icon}
                      <span className="text-xs font-bold">{item.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* OceanKita Data Source Partnership Credit */}
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Waves size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      {language === 'id' ? 'Kemitraan Data Lingkungan — OceanKita' : 'Environmental Data Partnership — OceanKita'}
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      {language === 'id'
                        ? 'Kumpulan data historis yang memperkuat model estimasi densitas sampah diapresiasikan kepada OceanKita sebagai mitra data utama kami.'
                        : 'Historical environmental datasets supporting our ML density forecasting engine are credited to OceanKita as our primary data partner.'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold text-cyan-500 bg-cyan-500/20 px-2.5 py-1 rounded-md shrink-0">
                  Data Partner
                </span>
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-sm text-primary font-semibold hover:text-accent transition-colors"
              >
                {t.landing.methodology.readMore}
                <ExternalLink size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}