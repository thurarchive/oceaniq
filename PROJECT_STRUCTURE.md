# Oceaniq Project Structure

```
oceaniq/
├── .env.local
├── .git/
├── .gitignore
├── .next/
├── .prettierignore
├── .prettierrrc
├── node_modules/
│
├── public/
│   └── assets/
│       └── images/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   ├── page.tsx
│   │   ├── analytics-dashboard/
│   │   │   ├── page.tsx
│   │   │   └── components/
│   │   │       ├── AnalyticsHeader.tsx
│   │   │       ├── DataSourceChart.tsx
│   │   │       ├── KPIBentoGrid.tsx
│   │   │       ├── RainfallCorrelationChart.tsx
│   │   │       ├── RecentActivityFeed.tsx
│   │   │       ├── WasteCompositionChart.tsx
│   │   │       └── WasteTrendChart.tsx
│   │   ├── interactive-map/
│   │   │   ├── page.tsx
│   │   │   └── components/
│   │   │       ├── LayerPanel.tsx
│   │   │       ├── MapCanvas.tsx
│   │   │       ├── MapCanvasMapLibre.tsx
│   │   │       ├── MapFilterSidebar.tsx
│   │   │       ├── MapHeader.tsx
│   │   │       ├── MapLegend.tsx
│   │   │       └── MapPointDetail.tsx
│   │   └── public-landing-page/
│   │       └── components/
│   │           ├── FeatureHighlights.tsx
│   │           ├── HeroSection.tsx
│   │           ├── HotspotBanner.tsx
│   │           ├── HowItWorks.tsx
│   │           ├── LandingCTA.tsx
│   │           ├── LandingFooter.tsx
│   │           ├── LandingTopbar.tsx
│   │           ├── LiveStatsBar.tsx
│   │           └── MethodologyNote.tsx
│   ├── components/
│   │   ├── AppLayout.tsx
│   │   ├── Topbar.tsx
│   │   └── ui/
│   │       ├── AppIcon.tsx
│   │       ├── AppImage.tsx
│   │       ├── AppLogo.tsx
│   │       └── StatusBadge.tsx
│   └── styles/
│       ├── index.css
│       └── tailwind.css
│
├── AGENTS.md
├── CLAUDE.md
├── eslint.config.mjs
├── image-hosts.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.js
└── tsconfig.json
```

## Tech Stack
- **Framework**: Next.js 15 (with breaking changes)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + PostCSS
- **UI Icons**: Lucide React
- **Linting**: ESLint

## Key Features
- **Analytics Dashboard**: KPIs, data source charts, rainfall correlation, waste composition
- **Interactive Map**: Layer management, map visualization, filtering, point details
- **Public Landing Page**: Hero section, features, how it works, CTA, stats bar
- **Custom Components**: App layout, topbar, UI components (icon, image, logo, badge)
