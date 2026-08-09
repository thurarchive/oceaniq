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
│   │   ├── api/
│   │   │   └── predict/
│   │   │       └── route.ts              # POST /api/predict — waste density forecast
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
│   │   │       ├── MapCanvasMapbox.tsx
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
│   ├── data/
│   │   ├── site_lags.json               # Pre-computed lag features per monitoring station
│   │   └── xgboost_tuned_model.json     # Trained XGBoost model (200 trees, native JSON)
│   ├── lib/
│   │   └── xgboost-inference.ts         # Pure-TS XGBoost tree walker (zero dependencies)
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
├── dataset/
│   ├── README.md                        # Dataset scope, versioning, CC BY 4.0 license, exclusions
│   ├── Data.csv
│   └── mock_waste_observations.csv
├── docs/
│   └── README.md                        # Documentation hub & CC BY 4.0 documentation licensing
├── DATA_LICENSE.md                      # CC BY 4.0 (verified Oceaniq datasets)
├── LICENSE                              # MIT License (source code)
├── PROJECT_STRUCTURE.md
├── README.md
├── tailwind.config.js
└── tsconfig.json
```

## Licensing Architecture
- **Software & Source Code**: MIT License (`LICENSE`)
- **Verified Datasets & Data Documentation**: Creative Commons Attribution 4.0 International (`DATA_LICENSE.md`, `CC BY 4.0`)
- **Documentation Guides**: Creative Commons Attribution 4.0 International (`docs/README.md`)

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + PostCSS
- **UI Icons**: Lucide React
- **Linting**: ESLint

## Key Features
- **Analytics Dashboard**: KPIs, data source charts, rainfall correlation, waste composition
- **Interactive Map**: Layer management, map visualization, filtering, point details
- **Public Landing Page**: Hero section, features, how it works, CTA, stats bar
- **Contributor Gamification & Leaderboard**: Tiers, badges, public leaderboard, CC BY 4.0 data attribution
- **Custom Components**: App layout, topbar, UI components (icon, image, logo, badge)

