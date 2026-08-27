'use client';

import React, { useState } from 'react';
import {
  Layers,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  Brain,
  Hexagon,
  CloudRain,
} from 'lucide-react';
import { BasemapType } from './MapCanvasMapbox';
import { useLanguage } from '@/context/LanguageContext';

export interface MapLayer {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  count: number;
  active: boolean;
  type: 'point' | 'polygon' | 'heatmap' | 'overlay';
}

export const initialLayers: MapLayer[] = [
  {
    id: 'layer-observations',
    label: 'Verified Observations',
    description: 'Official field survey data from trained monitors',
    icon: <MapPin size={15} />,
    color: 'bg-positive',
    count: 12847,
    active: true,
    type: 'point',
  },
  {
    id: 'layer-citizen',
    label: 'Citizen Reports',
    description: 'Approved community-submitted field reports',
    icon: <Users size={15} />,
    color: 'bg-accent',
    count: 4206,
    active: true,
    type: 'point',
  },
  {
    id: 'layer-ml',
    label: 'ML Estimates',
    description: 'Model-predicted waste density (heatmap)',
    icon: <Brain size={15} />,
    color: 'bg-warning',
    count: 847,
    active: true,
    type: 'heatmap',
  },
  {
    id: 'layer-zones',
    label: 'Monitoring Zones',
    description: 'Official monitoring zone boundaries',
    icon: <Hexagon size={15} />,
    color: 'bg-primary',
    count: 5,
    active: true,
    type: 'polygon',
  },
  {
    id: 'layer-rainfall',
    label: 'Rainfall Overlay',
    description: 'Recent 7-day precipitation intensity',
    icon: <CloudRain size={15} />,
    color: 'bg-secondary-foreground',
    count: 0,
    active: false,
    type: 'overlay',
  },
];

type LayerPanelProps = {
  activeBasemap: BasemapType;
  onBasemapChange: React.Dispatch<React.SetStateAction<BasemapType>>;
  layers: MapLayer[];
  onLayerToggle: (id: string) => void;
};

export default function LayerPanel({
  activeBasemap,
  onBasemapChange,
  layers,
  onLayerToggle,
}: LayerPanelProps) {
  const { language, t } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);

  const basemapOptions: { value: BasemapType; label: string }[] = [
    { value: 'ocean-dark', label: language === 'id' ? 'Peta Gelap Laut' : 'Ocean Dark' },
    { value: 'satellite', label: language === 'id' ? 'Satelit' : 'Satellite' },
    { value: 'topographic', label: language === 'id' ? 'Topografi' : 'Topographic' },
  ];

  const getTranslatedLayerLabel = (id: string, defaultLabel: string) => {
    if (id === 'layer-observations') return language === 'id' ? 'Observasi Terverifikasi' : 'Verified Observations';
    if (id === 'layer-citizen') return language === 'id' ? 'Laporan Warga' : 'Citizen Reports';
    if (id === 'layer-ml') return language === 'id' ? 'Estimasi Model AI' : 'ML Estimates';
    if (id === 'layer-zones') return language === 'id' ? 'Zona Pemantauan' : 'Monitoring Zones';
    if (id === 'layer-rainfall') return language === 'id' ? 'Curah Hujan' : 'Rainfall Overlay';
    return defaultLabel;
  };

  const getTranslatedLayerDesc = (id: string, defaultDesc: string) => {
    if (id === 'layer-observations') return language === 'id' ? 'Data survei lapangan resmi oleh analis terlatih' : 'Official field survey data from trained monitors';
    if (id === 'layer-citizen') return language === 'id' ? 'Laporan lapangan tervalidasi dari masyarakat' : 'Approved community-submitted field reports';
    if (id === 'layer-ml') return language === 'id' ? 'Prediksi kepadatan sampah oleh model XGBoost' : 'Model-predicted waste density (heatmap)';
    if (id === 'layer-zones') return language === 'id' ? 'Batas administratif zona observasi maritim' : 'Official monitoring zone boundaries';
    if (id === 'layer-rainfall') return language === 'id' ? 'Intensitas curah hujan maritim 7 hari terakhir' : 'Recent 7-day precipitation intensity';
    return defaultDesc;
  };

  return (
    <div
      className={`glass-card-elevated border-r border-border shrink-0 flex flex-col z-10 transition-all duration-300 ${collapsed ? 'w-12' : 'w-64'
        }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-primary" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              {t.map.layers}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
            title={collapsed ? 'Expand layer panel' : 'Collapse layer panel'}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
      </div>

      {/* Layers list */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto scrollbar-ocean p-2 space-y-1">
          {layers.map((layer) => (
            <div
              key={layer.id}
              className={`rounded-lg border p-3 cursor-pointer transition-all duration-200 ${layer.active
                  ? 'layer-toggle-active border-primary/30'
                  : 'border-border hover:border-border/80 hover:bg-muted/30'
                }`}
              onClick={() => onLayerToggle(layer.id)}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${layer.color} ${!layer.active ? 'opacity-30' : ''}`} />
                  <span className={`text-xs font-semibold ${layer.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {getTranslatedLayerLabel(layer.id, layer.label)}
                  </span>
                </div>
                <button
                  className={`transition-colors ${layer.active ? 'text-primary' : 'text-muted-foreground/40'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerToggle(layer.id);
                  }}
                  title={layer.active ? `Hide ${layer.label}` : `Show ${layer.label}`}
                >
                  {layer.active ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground leading-tight mb-1.5">{getTranslatedLayerDesc(layer.id, layer.description)}</p>
              {layer.count > 0 && (
                <span className="font-mono text-xs text-muted-foreground/70">
                  {layer.count.toLocaleString('id-ID')} {layer.type === 'heatmap' ? (language === 'id' ? 'zona' : 'zones') : (language === 'id' ? 'titik' : 'points')}
                </span>
              )}
            </div>
          ))}

          {/* Basemap selector */}
          <div className="pt-3 border-t border-border mt-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              {language === 'id' ? 'Tipe Peta' : 'Basemap'}
            </p>
            {basemapOptions.map((basemap) => (
              <button
                key={basemap.value}
                type="button"
                onClick={() => onBasemapChange(basemap.value)}
                className={`w-full text-left text-xs px-2 py-1.5 rounded transition-all cursor-pointer ${activeBasemap === basemap.value
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                  }`}
              >
                {basemap.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Collapsed icon-only */}
      {collapsed && (
        <div className="flex-1 flex flex-col items-center py-3 gap-3">
          {layers.map((layer) => (
            <button
              key={`collapsed-${layer.id}`}
              onClick={() => onLayerToggle(layer.id)}
              title={`${layer.active ? 'Hide' : 'Show'} ${getTranslatedLayerLabel(layer.id, layer.label)}`}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${layer.active
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground/40 hover:text-muted-foreground'
                }`}
            >
              {layer.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}