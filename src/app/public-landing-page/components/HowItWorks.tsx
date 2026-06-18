import React from 'react';
import { Camera, FlaskConical, ShieldCheck, BarChart3 } from 'lucide-react';

const steps = [
  {
    id: 'step-1',
    number: '01',
    icon: <Camera size={22} />,
    title: 'Field Observation',
    description:
      'Trained monitors and citizen scientists conduct field surveys at coastal zones, river mouths, and ocean areas. Observations are recorded with GPS coordinates, waste categories, and photographic evidence.',
    detail: 'Manual + citizen-submitted data',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/20',
  },
  {
    id: 'step-2',
    number: '02',
    icon: <ShieldCheck size={22} />,
    title: 'Moderation & Validation',
    description:
      'All citizen-submitted reports enter a structured moderation queue. Expert reviewers verify location accuracy, waste categorization, and photo authenticity before approving data for public display.',
    detail: 'Expert-reviewed workflow',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    borderColor: 'border-accent/20',
  },
  {
    id: 'step-3',
    number: '03',
    icon: <FlaskConical size={22} />,
    title: 'ML Estimation',
    description:
      'Environmental inputs (rainfall, tidal levels, wind, wave height) are fed into tabular ML models trained on historical observation data to estimate waste quantity and composition for unmonitored zones.',
    detail: 'XGBoost / LightGBM models',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/20',
  },
  {
    id: 'step-4',
    number: '04',
    icon: <BarChart3 size={22} />,
    title: 'Analytics & Insights',
    description:
      'Unified data from verified observations, approved citizen reports, and ML estimates flows into the analytics dashboard, enabling temporal trend analysis, spatial hotspot identification, and policy reporting.',
    detail: 'Integrated analytics platform',
    color: 'text-positive',
    bgColor: 'bg-positive/10',
    borderColor: 'border-positive/20',
  },
];

export default function HowItWorks() {
  return (
    <section className="px-6 lg:px-10 py-16 relative">
      <div className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(14,165,233,0.06) 0%, transparent 70%)' }}
      />
      <div className="max-w-screen-2xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-accent tracking-widest uppercase mb-3 block">
            Data Pipeline
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How Oceaniq Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From field observation to actionable insights — a transparent, auditable
            pipeline designed for scientific integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 relative">
          {/* Connector line on xl */}
          <div className="hidden xl:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-primary/20 via-accent/20 to-positive/20" />

          {steps?.map((step, index) => (
            <div key={step?.id} className="relative">
              <div className={`glass-card-elevated border ${step?.borderColor} p-6 rounded-xl h-full`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`${step?.bgColor} ${step?.color} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10`}>
                    {step?.icon}
                  </div>
                  <span className="font-mono text-2xl font-bold text-border">{step?.number}</span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{step?.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{step?.description}</p>
                <div className={`inline-flex items-center gap-1.5 text-xs font-semibold ${step?.color} ${step?.bgColor} px-2.5 py-1 rounded-full border ${step?.borderColor}`}>
                  {step?.detail}
                </div>
              </div>
              {index < steps?.length - 1 && (
                <div className="hidden md:xl:hidden xl:hidden md:flex xl:flex items-center justify-center my-2 xl:my-0">
                  <div className="w-px h-6 bg-border md:w-6 md:h-px" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}