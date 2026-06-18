import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { Mail } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'Interactive Map', href: '/interactive-map' },
    { label: 'Analytics Dashboard', href: '/analytics-dashboard' },
    { label: 'ML Estimation', href: '/estimate' },
    { label: 'Contribute Report', href: '/contribute' },
  ],
  About: [
    { label: 'Methodology', href: '/about' },
    { label: 'Data Sources', href: '/about#data' },
    { label: 'Model Versions', href: '/about#models' },
    { label: 'API Access', href: '/about#api' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Use', href: '/terms' },
    { label: 'Data Attribution', href: '/attribution' },
  ],
};

export default function LandingFooter() {
  return (
    <footer className="border-t border-border px-6 lg:px-10 py-12 mt-4">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-8 mb-10">
          {/* Brand */}
          <div className="xl:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <AppLogo size={28} />
              <span className="font-bold text-base tracking-tight text-gradient-ocean">Oceaniq</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-xs">
              Marine waste monitoring platform for Indonesian coastal zones. Combining
              field data, citizen science, and ML-powered prediction for environmental action.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/oceaniq"
                className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#171515"
                    d="M24 9.593c3.54 0 6.714 1.225 8.593 3.104L29 4l6 6z"
                  />
                  <path
                    fill="#405D40"
                    d="M14 12.592l6-6 6 6z"
                  />
                  <path
                    fill="none"
                    d="M0 0h48v48H0z"
                  />
                </svg>
              </a>
              <a
                href="mailto:john.doe@example.com"
                className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail size={15} />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks)?.map(([category, links]) => (
            <div key={`footer-${category}`}>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-widest mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links?.map((link) => (
                  <li key={`footer-link-${link?.href}`}>
                    <Link
                      href={link?.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                    >
                      {link?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 Oceaniq. Data provided under{' '}
            <a href="/attribution" className="text-primary hover:underline">CC BY 4.0</a>.
            ML outputs are estimates — not measured data.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Model: waste-estimator-v1.3.0</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-positive rounded-full animate-pulse"></span>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}