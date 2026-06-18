import React from 'react';
import Link from 'next/link';
import { Map, Users, ChevronRight, Waves } from 'lucide-react';

export default function LandingCTA() {
  return (
    <section className="px-6 lg:px-10 py-16">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Explore CTA */}
          <div className="glass-card-elevated border border-primary/25 rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(14,165,233,0.06) 0%, transparent 70%)' }}
            />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-5">
                <Map size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Explore the Monitoring Map</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Browse waste observations, citizen reports, and ML-estimated density layers
                across Indonesian coastal zones. Filter by area, category, and time range.
              </p>
              <Link href="/interactive-map" className="btn-primary inline-flex items-center gap-2 text-sm">
                Open Map
                <ChevronRight size={15} />
              </Link>
            </div>
          </div>

          {/* Contribute CTA */}
          <div className="glass-card-elevated border border-positive/25 rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(16,185,129,0.06) 0%, transparent 70%)' }}
            />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-positive/15 flex items-center justify-center mb-5">
                <Users size={24} className="text-positive" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Become a Citizen Scientist</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Spotted marine waste? Submit a geo-tagged field report with photos and
                category details. Approved reports directly enrich the monitoring dataset.
              </p>
              <Link
                href="/contribute"
                className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg bg-positive/15 text-positive border border-positive/30 hover:bg-positive/25 transition-all duration-200"
              >
                <Waves size={15} />
                Submit a Report
                <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}