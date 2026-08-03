import React from 'react';
import Link from 'next/link';
import { Map, BarChart3, Brain, Users, ArrowRight, LucideIcon } from 'lucide-react';

interface Feature {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  cta: string;
  accent: string;
  accentBg: string;
  borderColor: string;
  tags: string[];
}

const features: Feature[] = [
  {
    id: 'feature-map',
    icon: Map,
    title: 'Interactive Monitoring Map',
    description:
      'Explore marine waste distribution across Indonesian coastal zones with layered data visualization — verified observations, citizen reports, and ML-estimated density overlays on a single geospatial canvas.',
    href: '/interactive-map',
    cta: 'Open Map',
    accent: 'text-primary',
    accentBg: 'bg-primary/10',
    borderColor: 'border-primary/20 hover:border-primary/40',
    tags: ['Heatmap', 'Clustering', 'Layer Toggles'],
  },
  {
    id: 'feature-analytics',
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description:
      'Track waste density trends over time, understand composition breakdowns by category, and correlate environmental factors like rainfall and tidal levels with observed waste patterns.',
    href: '/analytics-dashboard',
    cta: 'View Analytics',
    accent: 'text-accent',
    accentBg: 'bg-accent/10',
    borderColor: 'border-accent/20 hover:border-accent/40',
    tags: ['Time-Series', 'Composition', 'Correlation'],
  },
  {
    id: 'feature-ml',
    icon: Brain,
    title: 'ML Waste Estimation',
    description:
      'Run interpretable predictions for any monitored zone using environmental inputs — rainfall, wind, tidal levels, wave height. Every estimate includes confidence scores and top contributing features.',
    href: '/estimate',
    cta: 'Run Estimate',
    accent: 'text-warning',
    accentBg: 'bg-warning/10',
    borderColor: 'border-warning/20 hover:border-warning/40',
    tags: ['Confidence Bands', 'SHAP Features', 'Model v1.3'],
  },
  {
    id: 'feature-citizen',
    icon: Users,
    title: 'Citizen Science',
    description:
      'Join thousands of coastal observers. Submit geo-tagged field reports with photos, waste category, and quantity estimates. Approved reports enrich the monitoring dataset after expert moderation.',
    href: '/contribute',
    cta: 'Contribute Now',
    accent: 'text-positive',
    accentBg: 'bg-positive/10',
    borderColor: 'border-positive/20 hover:border-positive/40',
    tags: ['Geo-Tagged', 'Photo Upload', 'Moderated'],
  },
];

export default function FeatureHighlights() {
  return (
    <section className="px-6 lg:px-10 py-16">
      <div className="max-w-screen-2xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-primary tracking-widest uppercase mb-3 block">
            Platform Capabilities
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Monitor Marine Waste
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Four integrated modules covering spatial exploration, temporal analytics,
            predictive modeling, and community-powered data collection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {features?.map((feature) => {
            const IconComponent = feature?.icon;
            return (
              <div
                key={feature?.id}
                className={`glass-card-elevated border ${feature?.borderColor} p-6 rounded-xl transition-all duration-300 group flex flex-col`}
              >
                <div className={`${feature?.accentBg} ${feature?.accent} w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}>
                  {IconComponent && <IconComponent size={28} />}
                </div>
                <h3 className="text-base font-700 text-foreground mb-2 font-semibold">{feature?.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{feature?.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {feature?.tags?.map((tag) => (
                    <span
                      key={`${feature?.id}-tag-${tag}`}
                      suppressHydrationWarning
                      className="text-xs px-2 py-0.5 rounded-full glass-card border border-border text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  href={feature?.href}
                  className={`flex items-center gap-1.5 text-sm font-semibold ${feature?.accent} group-hover:gap-2.5 transition-all duration-200`}
                >
                  {feature?.cta}
                  <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}