import React from 'react';
import Link from 'next/link';
import { Target, Award, Trophy, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface BenefitItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const BENEFITS: BenefitItem[] = [
  {
    id: 'benefit-1',
    icon: <Target className="w-6 h-6 text-sky-400" />,
    title: 'Direct Environmental Impact',
    subtitle: 'Activate Coastal Cleanup Interventions',
    description:
      'Your geo-tagged reports feed directly into our ML density forecasting engine, giving local authorities and volunteer cleanup teams accurate coordinates to intercept debris.',
    tag: 'Real-World Action',
    color: 'text-sky-400',
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-500/20',
  },
  {
    id: 'benefit-2',
    icon: <Award className="w-6 h-6 text-emerald-400" />,
    title: 'Open Data Contribution',
    subtitle: 'Build Evidence for Marine Conservation',
    description:
      'Verified reports help build Oceaniq’s research-ready marine-observation dataset, revealing coastal waste patterns across Indonesia. Earn a traceable contribution record, optional public recognition, and credit for every verified observation.',
    tag: 'Scientific Impact',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
  },
  {
    id: 'benefit-3',
    icon: <Trophy className="w-6 h-6 text-amber-400" />,
    title: 'Gamified Badges & Rank',
    subtitle: 'Climb Community Leaderboards',
    description:
      'Unlock achievements from Coast Scout to Ocean Guardian. Showcase your verified badges on your public profile and climb monthly contributor rankings.',
    tag: 'Rewards & Badges',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
  },
  {
    id: 'benefit-4',
    icon: <ShieldCheck className="w-6 h-6 text-cyan-400" />,
    title: 'Expert Validation Pipeline',
    subtitle: 'Transparent & Auditable Workflow',
    description:
      'Every submission undergoes rigorous review by marine experts and XGBoost anomaly verification, ensuring your effort directly contributes to high-integrity data.',
    tag: 'Quality Assured',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20',
  },
];

export default function ContributorBenefits() {
  return (
    <section className="px-6 lg:px-10 py-20 relative overflow-hidden bg-background">
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(14,165,233,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-screen-2xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles size={14} />
            Why Join as a Contributor?
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-5">
            Turn Your Field Observations Into <span className="text-gradient-sky">Actionable Marine Protection</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Oceaniq empowers citizen scientists, coastal communities, and researchers with an end-to-end framework
            that rewards your dedication while driving real-world ocean conservation.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {BENEFITS.map((b) => (
            <div
              key={b.id}
              className={`glass-card-elevated border ${b.borderColor} p-7 rounded-2xl flex flex-col justify-between hover:translate-y-[-4px] transition-all duration-300 group`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`${b.bgColor} p-3 rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    {b.icon}
                  </div>
                  <span className={`text-[11px] font-mono font-semibold ${b.color} ${b.bgColor} px-2.5 py-0.5 rounded-full border ${b.borderColor}`}>
                    {b.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {b.title}
                </h3>
                <p className="text-xs font-semibold text-accent mb-3">{b.subtitle}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call-to-action banner */}
        <div className="glass-card-elevated border border-primary/30 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-primary/10 via-background to-accent/10">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-xl font-bold text-foreground">Ready to make your coastline count?</h4>
            <p className="text-sm text-muted-foreground">
              Submit your first report today to unlock your 🛡️ <strong>Coast Scout</strong> badge!
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/contribute"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
            >
              Submit Field Report
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-muted/40 hover:bg-muted text-foreground border border-border transition-colors"
            >
              <Trophy size={16} className="text-amber-400" />
              View Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
