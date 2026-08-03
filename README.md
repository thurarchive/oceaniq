<h1 align="center">🌊 Oceaniq</h1>

<p align="center">
  <strong>Citizen Science Platform for Coastal Environmental Monitoring in Indonesia</strong><br>
  <em>#Data-Driven Marine Conservation</em>
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"></a>
  <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-Database-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase"></a>
  <a href="https://www.mapbox.com"><img src="https://img.shields.io/badge/Mapbox-GL_JS-000000?style=for-the-badge&logo=mapbox&logoColor=white" alt="Mapbox"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License: MIT"></a>
</p>

---

## 📌 What Is Oceaniq?

**Oceaniq** is an end-to-end marine waste monitoring platform designed for environmental researchers, government authorities, and public citizen scientists. By combining interactive geospatial mapping with analytics, Oceaniq allows users to track waste accumulation hotspots, correlate waste density with weather patterns (e.g., rainfall events), and support community cleanup interventions.

> **Why Oceaniq?**  
> Marine debris moves rapidly across coastal systems. Without centralized, spatial data, clean-up efforts remain reactive. Oceaniq bridges the gap between field collection data and decision-makers through an intuitive, data-dense interface.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **📊 Analytics Dashboard** | Real-time KPI Bento Grid, waste material breakdown charts, rainfall-waste correlation analysis, and live activity streams. |
| **🗺️ Interactive Map** | High-performance Mapbox GL canvas with multi-layer filtering (PMTiles / vector layers), hotspot visualization, and point details. |
| **📝 Citizen Reporting Flow** | Interactive location picker map and multi-step contribution form for logging waste reports in the field. |
| **⚡ Supabase Backend** | Row Level Security (RLS), custom RPC database functions, and automated migration pipeline for data safety. |
| **🎯 Public Landing Page** | Public-facing landing showcase featuring live stats counters, methodology note, and project roadmap. |

---

## 🛠️ Tech Stack

- **Frontend Core**: [Next.js 16 (App Router)](https://nextjs.org), [React 19](https://react.dev), [TypeScript 5](https://www.typescriptlang.org)
- **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com), [Lucide React Icons](https://lucide.dev)
- **Geospatial & Mapping**: `mapbox-gl`, `react-map-gl`, `maplibre-gl`, `pmtiles`
- **Data Visualization**: `recharts`
- **Database & Auth**: [Supabase PostgreSQL](https://supabase.com)
- **Notifications & UX**: `sonner`, `topbar`

---

## 📁 Project Structure

```
oceaniq/
├── src/
│   ├── app/
│   │   ├── analytics-dashboard/     # Analytics components, Bento grid & Recharts
│   │   ├── interactive-map/         # Mapbox canvas, layer sidebar & filter controls
│   │   ├── contribute/              # Citizen reporting form & map location picker
│   │   └── public-landing-page/     # Hero section, feature highlights & live stats
│   ├── components/                  # Shared UI components (Topbar, AppLayout, Badges)
│   └── styles/                      # Tailwind & global CSS configurations
├── supabase/
│   └── migrations/                  # Database schema migrations & RPC functions
├── public/                          # Static assets and public images
├── PROJECT_STRUCTURE.md             # Detailed directory architecture documentation
├── oceaniq_summary.json             # Project summary and metadata specification
└── LICENSE                          # MIT License declaration
```

---

## 🚀 Getting Started

### 1. Prerequisites

Make sure you have installed:
- **Node.js**: v18.0.0 or higher
- **npm** / **pnpm** / **yarn**

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/oceaniq.git
cd oceaniq
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory and set the required API keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_access_token
```

### 4. Run Development Server

Launch the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🛡️ Database & Migrations

Oceaniq uses Supabase for database management and authentication. To deploy database migrations:

```bash
# Push migrations to remote Supabase instance
npx supabase db push
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ for cleaner oceans and healthier marine ecosystems.
</p>
