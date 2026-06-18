import React from 'react';
import Link from 'next/link';
import { Map, BarChart3, ChevronRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 px-6 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 hero-glow pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl"
        style={{ background: 'radial-gradient(circle, #0ea5e9, transparent)' }}
      />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full opacity-5 blur-3xl"
        style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }}
      />
      {/* Animated wave rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[1, 2, 3]?.map((i) => (
          <div
            key={`wave-ring-${i}`}
            className="absolute rounded-full border border-primary/5"
            style={{
              width: `${i * 280}px`,
              height: `${i * 280}px`,
              animation: `pulse-ring ${2 + i * 0.8}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 glass-card border border-primary/20 px-4 py-1.5 rounded-full mb-8">
          <span className="w-2 h-2 bg-positive rounded-full animate-pulse"></span>
          <span className="text-xs font-semibold text-primary tracking-wider uppercase">
            Live Monitoring — 847 active zones
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
          <span className="text-foreground">Monitoring Indonesia's</span>
          <br />
          <span className="text-gradient-ocean">Marine Waste</span>
          <br />
          <span className="text-foreground">in Real Time</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Oceaniq combines field observations, citizen science reports, and
          machine learning predictions to give you a complete picture of waste
          distribution across Indonesian coastal and ocean zones.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/interactive-map"
            className="btn-primary flex items-center gap-2.5 text-base px-8 py-3.5 teal-glow"
          >
            <Map size={18} />
            Explore the Map
            <ChevronRight size={16} />
          </Link>
          <Link
            href="/analytics-dashboard"
            className="btn-ghost flex items-center gap-2.5 text-base px-8 py-3.5"
          >
            <BarChart3 size={18} />
            View Analytics
          </Link>
        </div>

        {/* Hero visual — stylized map preview */}
        <div className="glass-card-elevated border border-primary/20 rounded-2xl overflow-hidden relative float-animation">
          <div className="bg-linear-to-b from-primary/5 to-transparent px-4 py-2 border-b border-border flex items-center gap-2">
            <div className="flex gap-1.5">
              {['bg-danger/60', 'bg-warning/60', 'bg-positive/60']?.map((c, i) => (
                <div key={`dot-${i}`} className={`w-2.5 h-2.5 rounded-full ${c}`} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground font-mono ml-2">oceaniq.id/map — Live View</span>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-positive rounded-full animate-pulse"></span>
              <span className="text-xs text-positive font-medium">Live</span>
            </div>
          </div>
          <div className="relative h-64 md:h-80 overflow-hidden">
            {/* Simulated ocean map */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #041a2e 0%, #062440 50%, #041a2e 100%)' }}>
              {/* Grid lines */}
              {[...Array(8)]?.map((_, i) => (
                <div
                  key={`hgrid-${i}`}
                  className="absolute w-full border-t border-primary/5"
                  style={{ top: `${(i + 1) * 12.5}%` }}
                />
              ))}
              {[...Array(12)]?.map((_, i) => (
                <div
                  key={`vgrid-${i}`}
                  className="absolute h-full border-l border-primary/5"
                  style={{ left: `${(i + 1) * 8.33}%` }}
                />
              ))}

              {/* Simulated coastline */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 320" preserveAspectRatio="none">
                <path
                  d="M0,200 Q100,160 200,180 Q300,200 400,150 Q500,100 600,140 Q700,180 800,160 L800,320 L0,320 Z"
                  fill="rgba(14,165,233,0.08)"
                  stroke="rgba(14,165,233,0.2)"
                  strokeWidth="1"
                />
                <path
                  d="M0,240 Q150,220 300,230 Q450,240 600,210 Q700,195 800,220 L800,320 L0,320 Z"
                  fill="rgba(6,182,212,0.06)"
                  stroke="rgba(6,182,212,0.15)"
                  strokeWidth="0.5"
                />
              </svg>

              {/* Waste hotspot markers */}
              {[
                { x: '22%', y: '45%', size: 32, intensity: 'high', label: 'Jakarta Bay' },
                { x: '45%', y: '38%', size: 24, intensity: 'medium', label: 'Bekasi Coast' },
                { x: '65%', y: '52%', size: 20, intensity: 'medium', label: 'Karawang' },
                { x: '78%', y: '35%', size: 14, intensity: 'low', label: 'Subang' },
                { x: '33%', y: '60%', size: 18, intensity: 'low', label: 'Tangerang' },
              ]?.map((marker) => (
                <div
                  key={`hero-marker-${marker?.label}`}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  style={{ left: marker?.x, top: marker?.y }}
                >
                  <div
                    className={`rounded-full flex items-center justify-center ${
                      marker?.intensity === 'high' ?'bg-danger/70 border border-danger/80'
                        : marker?.intensity === 'medium' ?'bg-warning/70 border border-warning/80' :'bg-positive/70 border border-positive/80'
                    }`}
                    style={{ width: marker?.size, height: marker?.size }}
                  >
                    <div
                      className="rounded-full bg-white/30"
                      style={{ width: marker?.size * 0.4, height: marker?.size * 0.4 }}
                    />
                  </div>
                  {marker?.intensity === 'high' && (
                    <span className="mt-1 text-xs text-danger font-semibold whitespace-nowrap bg-background/80 px-1.5 py-0.5 rounded">
                      {marker?.label}
                    </span>
                  )}
                </div>
              ))}

              {/* Heatmap overlay blobs */}
              <div className="absolute rounded-full blur-2xl"
                style={{ left: '18%', top: '35%', width: 80, height: 60, background: 'rgba(239,68,68,0.25)' }}
              />
              <div className="absolute rounded-full blur-2xl"
                style={{ left: '40%', top: '30%', width: 60, height: 45, background: 'rgba(245,158,11,0.2)' }}
              />
              <div className="absolute rounded-full blur-xl"
                style={{ left: '60%', top: '42%', width: 50, height: 38, background: 'rgba(245,158,11,0.15)' }}
              />

              {/* Legend */}
              <div className="absolute bottom-3 left-3 glass-card px-3 py-2 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1.5 font-semibold uppercase tracking-wider">Waste Density</p>
                <div className="flex items-center gap-2">
                  {[
                    { color: 'bg-danger/80', label: 'High' },
                    { color: 'bg-warning/80', label: 'Med' },
                    { color: 'bg-positive/80', label: 'Low' },
                  ]?.map((item) => (
                    <div key={`legend-${item?.label}`} className="flex items-center gap-1">
                      <div className={`w-2.5 h-2.5 rounded-full ${item?.color}`} />
                      <span className="text-xs text-muted-foreground">{item?.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data count overlay */}
              <div className="absolute bottom-3 right-3 glass-card px-3 py-2 rounded-lg">
                <p className="text-xs text-muted-foreground">Showing</p>
                <p className="text-sm font-bold text-primary font-mono">2,847 points</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}