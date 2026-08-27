'use client';
import React from 'react';
import Link from 'next/link';
import { Target, Award, Trophy, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ContributorBenefits() {
  const { language, t } = useLanguage();

  const benefits = [
    {
      id: 'benefit-1',
      icon: <Target className="w-6 h-6 text-sky-400" />,
      title: language === 'id' ? 'Aksi Nyata Pembersihan Pesisir' : 'Direct Environmental Impact',
      subtitle: language === 'id' ? 'Aktifkan Intervensi Bersih Pantai' : 'Activate Coastal Cleanup Interventions',
      description: language === 'id'
        ? 'Laporan ber-GPS Anda langsung memperkuat model prediksi sampah kami, memberi koordinat presisi bagi armada pembersihan dan komunitas relawan lokal.'
        : 'Your geo-tagged reports feed directly into our ML density forecasting engine, giving local authorities and cleanup teams accurate coordinates to intercept debris.',
      tag: language === 'id' ? 'Aksi Nyata' : 'Real-World Action',
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10',
      borderColor: 'border-sky-500/20',
    },
    {
      id: 'benefit-2',
      icon: <Award className="w-6 h-6 text-emerald-400" />,
      title: language === 'id' ? 'Kontribusi Data Terbuka' : 'Open Data Contribution',
      subtitle: language === 'id' ? 'Mendukung Riset Kelautan Nasional' : 'Build Evidence for Marine Conservation',
      description: language === 'id'
        ? 'Data terverifikasi menjadi bahan rujukan saintifik berharga bagi peneliti, LSM lingkungan, dan penyusun kebijakan konservasi maritim Indonesia.'
        : 'Verified reports help build Oceaniq’s research-ready marine dataset, revealing coastal waste patterns and providing citation-ready evidence for conservation.',
      tag: language === 'id' ? 'Dampak Saintifik' : 'Scientific Impact',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
    {
      id: 'benefit-3',
      icon: <Trophy className="w-6 h-6 text-amber-400" />,
      title: language === 'id' ? 'Lencana & Peringkat Komunitas' : 'Gamified Badges & Rank',
      subtitle: language === 'id' ? 'Raih Apresiasi Penjaga Laut' : 'Climb Community Leaderboards',
      description: language === 'id'
        ? 'Buka pencapaian dari Pengamat Pantai hingga Penjaga Laut Utama. Tampilkan lencana di profil publik Anda dan pimpin klasemen bulanan.'
        : 'Unlock achievements from Coast Scout to Ocean Guardian. Showcase your verified badges on your public profile and climb monthly contributor rankings.',
      tag: language === 'id' ? 'Penghargaan & Reputasi' : 'Rewards & Badges',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
    },
    {
      id: 'benefit-4',
      icon: <ShieldCheck className="w-6 h-6 text-cyan-400" />,
      title: language === 'id' ? 'Validasi Transparan & Akuntabel' : 'Expert Validation Pipeline',
      subtitle: language === 'id' ? 'Standar Mutu Ilmiah' : 'Transparent & Auditable Workflow',
      description: language === 'id'
        ? 'Setiap data melalui verifikasi ketat oleh tim analis kelautan dan algoritma validasi cerdas untuk menjamin integritas data tingkat tinggi.'
        : 'Every submission undergoes rigorous review by marine experts and anomaly verification, ensuring your effort directly contributes to high-integrity data.',
      tag: language === 'id' ? 'Kualitas Terjamin' : 'Quality Assured',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
    },
  ];

  return (
    <section className="px-6 lg:px-10 py-20 relative overflow-hidden">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles size={13} />
              {t.landing.benefits.tag}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              {t.landing.benefits.title}
            </h2>
            <p className="text-muted-foreground text-sm md:text-base mt-2 max-w-xl">
              {t.landing.benefits.subtitle}
            </p>
          </div>
          <Link
            href="/contribute"
            className="btn-primary self-start md:self-auto flex items-center gap-2 text-sm"
          >
            {t.landing.heroSubtitle ? (language === 'id' ? 'Mulai Kontribusi' : 'Start Contributing') : 'Start Contributing'}
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((item) => (
            <div
              key={item.id}
              className={`p-6 rounded-2xl glass-card-elevated border ${item.borderColor} relative group hover:border-opacity-80 transition-all duration-300 shadow-sm hover:shadow-md`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${item.bgColor} border ${item.borderColor} shrink-0`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {item.tag}
                    </span>
                    <span className={`text-xs font-semibold ${item.color} hidden sm:inline`}>
                      {item.subtitle}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
