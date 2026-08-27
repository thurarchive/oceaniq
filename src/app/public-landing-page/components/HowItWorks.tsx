'use client';
import React from 'react';
import { Camera, ShieldCheck, BarChart3, Trophy } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function HowItWorks() {
  const { language, t } = useLanguage();

  const steps = [
    {
      id: 'step-1',
      number: '01',
      icon: Camera,
      title: t.landing.howItWorks.step1Title,
      description: t.landing.howItWorks.step1Desc,
      detail: language === 'id' ? 'Foto & Pin Koordinat GPS' : 'Field Photo & GPS Capture',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
    },
    {
      id: 'step-2',
      number: '02',
      icon: ShieldCheck,
      title: t.landing.howItWorks.step2Title,
      description: t.landing.howItWorks.step2Desc,
      detail: language === 'id' ? 'Audit Akurasi & Model ML' : 'Quality & Authenticity Audit',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20',
    },
    {
      id: 'step-3',
      number: '03',
      icon: BarChart3,
      title: t.landing.howItWorks.step3Title,
      description: t.landing.howItWorks.step3Desc,
      detail: language === 'id' ? 'Aksi Pembersihan Nyata' : 'Real-World Cleanups Triggered',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
    },
    {
      id: 'step-4',
      number: '04',
      icon: Trophy,
      title: language === 'id' ? '4. Raih Lencana & Dampak' : '4. Unlock Badges & Rank',
      description: language === 'id'
        ? 'Setiap laporan tervalidasi menghasilkan poin kontribusi, membuka lencana kehormatan, dan menaikkan peringkat Anda di komunitas.'
        : 'Every verified submission earns contribution points, unlocks achievement badges, and elevates your standing on the leaderboards.',
      detail: language === 'id' ? 'Lencana, Poin & Reputasi' : 'Badges, Tiers & Citation',
      color: 'text-positive',
      bgColor: 'bg-positive/10',
      borderColor: 'border-positive/20',
    },
  ];

  return (
    <section className="px-6 lg:px-10 py-16 relative">
      <div className="max-w-screen-2xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-accent tracking-widest uppercase mb-3 block">
            {t.landing.howItWorks.tag}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.landing.howItWorks.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t.landing.howItWorks.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 relative">
          {/* Connector line on xl */}
          <div className="hidden xl:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-linear-to-r from-primary/20 via-accent/20 to-positive/20" />

          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div key={step.id} className="relative">
                <div className={`glass-card-elevated border ${step.borderColor} p-6 rounded-xl h-full shadow-sm hover:shadow-md transition-all`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`${step.bgColor} ${step.color} w-10 h-10 rounded-xl flex items-center justify-center shrink-0 relative z-10`}>
                      <IconComponent size={22} />
                    </div>
                    <span className="font-mono text-2xl font-bold text-border">{step.number}</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{step.description}</p>
                  <div
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold ${step.color} ${step.bgColor} px-2.5 py-1 rounded-full border ${step.borderColor}`}
                  >
                    {step.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}