'use client';
import React, { useState, useEffect } from 'react';
import { X, MapPin, Clock, User, Gauge, Tag, Layers, CheckCircle, AlertCircle, Brain, Camera } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { supabase } from '@/lib/supabase';
import { MapPoint } from './mockPoints';
import { useLanguage } from '@/context/LanguageContext';

interface MapPointDetailProps {
  point: MapPoint;
  onClose: () => void;
}

export default function MapPointDetail({ point, onClose }: MapPointDetailProps) {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'simulation'>('overview');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const [simWeather, setSimWeather] = useState<string>('Clear');
  const [simTides, setSimTides] = useState<string>('High');
  const [simMsl, setSimMsl] = useState<number>(1.0);
  const [simTidesInNumber, setSimTidesInNumber] = useState<number>(1.0);

  const [simResult, setSimResult] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simError, setSimError] = useState<string | null>(null);

  const typeLabel: Record<string, string> = {
    observation: language === 'id' ? 'Observasi Terverifikasi' : 'Verified Observation',
    citizen: language === 'id' ? 'Laporan Sains Warga' : 'Citizen Report',
    ml: language === 'id' ? 'Estimasi Model AI' : 'ML Estimate',
  };

  const intensityConfig: Record<string, { label: string; color: string; bg: string; border: string; gradient: string }> = {
    critical: {
      label: language === 'id' ? 'Kritis' : 'Critical',
      color: 'text-danger',
      bg: 'bg-danger/10',
      border: 'border-danger/30',
      gradient: 'from-danger/20 to-danger/2'
    },
    high: {
      label: language === 'id' ? 'Tinggi' : 'High',
      color: 'text-warning',
      bg: 'bg-warning/10',
      border: 'border-warning/30',
      gradient: 'from-warning/20 to-warning/2'
    },
    medium: {
      label: language === 'id' ? 'Sedang' : 'Medium',
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/30',
      gradient: 'from-primary/20 to-primary/2'
    },
    low: {
      label: language === 'id' ? 'Rendah' : 'Low',
      color: 'text-positive',
      bg: 'bg-positive/10',
      border: 'border-positive/30',
      gradient: 'from-positive/20 to-positive/2'
    },
  };

  useEffect(() => {
    if (activeTab !== 'simulation' || point.type !== 'ml') return;

    let isCancelled = false;

    async function runSim() {
      setIsSimulating(true);
      setSimError(null);
      try {
        const response = await fetch('/api/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lat: point.lat,
            lng: point.lng,
            weather: simWeather,
            tides: simTides,
            msl: simMsl,
            tides_in_number: simTidesInNumber,
            day_of_year: 178,
            day_of_week: 2,
            month: 6,
          }),
        });

        const result = await response.json();
        if (isCancelled) return;

        if (result.error) {
          setSimError(result.error);
        } else {
          setSimResult(result.predicted_density);
        }
      } catch (err: any) {
        if (!isCancelled) {
          setSimError(err.message || 'Failed to connect to ML subprocess');
        }
      } finally {
        if (!isCancelled) {
          setIsSimulating(false);
        }
      }
    }

    const timer = setTimeout(runSim, 200);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [activeTab, point.lat, point.lng, point.type, simWeather, simTides, simMsl, simTidesInNumber]);

  const getSimulatedIntensityCfg = (val: number) => {
    if (val > 1000) return intensityConfig.critical;
    if (val > 500) return intensityConfig.high;
    if (val > 200) return intensityConfig.medium;
    return intensityConfig.low;
  };
  const simIntensity = simResult !== null ? getSimulatedIntensityCfg(simResult) : null;

  const intensityCfg = intensityConfig[point.intensity] || intensityConfig.low;
  const formattedDate = point.timestamp.split('T')[0];
  const formattedTime = point.timestamp.split('T')[1]?.replace('Z', ' WIB') ?? '';

  const [contributor, setContributor] = useState<string | null>(point.contributorName || null);
  const [reviewer, setReviewer] = useState<string | null>(point.reviewerName || null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(point.photoUrl || null);

  useEffect(() => {
    setContributor(point.contributorName || null);
    setReviewer(point.reviewerName || null);
    setPhotoUrl(point.photoUrl || null);

    if (point.type === 'citizen') {
      supabase
        .from('citizen_reports')
        .select('contributor_name, reviewer_name, photo_url')
        .eq('id', point.id)
        .single()
        .then(({ data }) => {
          if (data) {
            if (data.contributor_name) setContributor(data.contributor_name);
            if (data.reviewer_name) setReviewer(data.reviewer_name);
            if (data.photo_url) setPhotoUrl(data.photo_url);
          }
        });
    }
  }, [point.id, point.type, point.contributorName, point.reviewerName, point.photoUrl]);

  return (
    <>
      <div className="absolute top-4 left-4 w-80 glass-card-elevated border border-border rounded-xl overflow-hidden z-30 shadow-2xl animate-in fade-in slide-in-from-left-4 duration-300 flex flex-col max-h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="flex items-start justify-between px-4 py-3.5 border-b border-border bg-card/40">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              {point.type === 'ml' ? (
                <Brain size={13} className="text-warning shrink-0" />
              ) : point.type === 'citizen' ? (
                <User size={13} className="text-accent shrink-0" />
              ) : (
                <CheckCircle size={13} className="text-positive shrink-0" />
              )}
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                {typeLabel[point.type]}
              </span>
            </div>
            <h3 className="text-sm font-bold text-foreground break-words">{point.zone}</h3>

            {point.type === 'citizen' && contributor && (
              <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-full w-fit border border-border/40">
                <div className="w-3.5 h-3.5 rounded-full bg-accent/20 flex items-center justify-center text-accent text-[8px] font-bold">
                  {contributor.charAt(0).toUpperCase()}
                </div>
                <span>{language === 'id' ? 'Oleh' : 'By'} <span className="font-semibold text-foreground">{contributor}</span></span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all ml-2 shrink-0 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-border bg-muted/10 px-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${activeTab === 'overview'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            {language === 'id' ? 'Ringkasan' : 'Overview'}
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${activeTab === 'details'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            {t.common.details}
          </button>
          {point.type === 'ml' && (
            <button
              onClick={() => setActiveTab('simulation')}
              className={`flex-1 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${activeTab === 'simulation'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
            >
              {language === 'id' ? 'Simulasi' : 'Simulation'}
            </button>
          )}
        </div>

        {/* Tab content wrapper */}
        <div className="flex-1 overflow-y-auto scrollbar-ocean">
          {activeTab === 'overview' && (
            /* OVERVIEW TAB */
            <div className="space-y-4">
              {/* Waste Density Hero Widget */}
              <div className={`p-4 bg-gradient-to-br ${intensityCfg.gradient} border-b border-border`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">
                      {language === 'id' ? 'Kuantitas Sampah' : 'Debris Quantity'}
                    </span>
                    <h2 className="text-3xl font-bold font-mono tracking-tight text-foreground mt-0.5 break-words">
                      {point.wasteDensity.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-xs font-normal text-muted-foreground font-sans">item</span>
                    </h2>
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded border ${intensityCfg.bg} ${intensityCfg.color} ${intensityCfg.border}`}>
                    {intensityCfg.label}
                  </span>
                </div>
              </div>

              {/* Core Info */}
              <div className="px-4 pb-4 space-y-4">
                {/* Category info */}
                <div>
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider block">
                    {language === 'id' ? 'Kategori Sampah' : 'Waste Category'}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1 bg-muted/20 border border-border/50 rounded-lg px-3 py-2">
                    <Tag size={13} className="text-primary shrink-0" />
                    <span className="text-xs font-medium text-foreground">{point.wasteCategory}</span>
                  </div>
                </div>

                {/* Description */}
                {point.description && (
                  <div className="bg-muted/10 border border-border/40 rounded-lg p-3">
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider block mb-1">
                      {language === 'id' ? 'Catatan Observasi' : 'Observation Notes'}
                    </span>
                    <p className="text-xs text-foreground/90 leading-relaxed italic break-words">
                      "{point.description}"
                    </p>
                  </div>
                )}

                {/* Photo Thumbnail if available */}
                {photoUrl && (
                  <div>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                      <Camera size={12} className="text-primary" />
                      {language === 'id' ? 'Foto Bukti Lapangan' : 'Field Photo Evidence'}
                    </span>
                    <div
                      onClick={() => setIsLightboxOpen(true)}
                      className="relative rounded-lg overflow-hidden border border-border group cursor-pointer aspect-video bg-muted/30 flex items-center justify-center hover:border-primary/50 transition-all"
                    >
                      <img
                        src={photoUrl}
                        alt="Marine Waste Observation"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[11px] text-white font-medium bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-xs">
                          {language === 'id' ? 'Klik untuk Memperbesar' : 'Click to View Full'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timestamp & Location snippet */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-card/40 border border-border/60 p-2.5 rounded-lg">
                    <div className="flex items-center gap-1 text-muted-foreground text-[10px] mb-1">
                      <Clock size={11} />
                      <span>{t.common.date}</span>
                    </div>
                    <p className="font-medium text-foreground text-xs">{formattedDate}</p>
                    <p className="text-[10px] text-muted-foreground">{formattedTime}</p>
                  </div>

                  <div className="bg-card/40 border border-border/60 p-2.5 rounded-lg">
                    <div className="flex items-center gap-1 text-muted-foreground text-[10px] mb-1">
                      <MapPin size={11} />
                      <span>{t.map.coordinates}</span>
                    </div>
                    <p className="font-mono text-xs text-foreground font-medium">{point.lat.toFixed(4)},</p>
                    <p className="font-mono text-xs text-foreground font-medium">{point.lng.toFixed(4)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            /* DETAILS TAB */
            <div className="p-4 space-y-4 text-xs">
              <div className="space-y-2">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">
                  {language === 'id' ? 'Metadata Observasi' : 'Observation Metadata'}
                </span>
                <div className="bg-muted/10 border border-border/60 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground">{language === 'id' ? 'ID Titik' : 'Point ID'}</span>
                    <span className="font-mono text-foreground text-right break-all">{point.id}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground shrink-0">{language === 'id' ? 'Sumber Data' : 'Data Source'}</span>
                    <span className="font-medium text-foreground text-right ml-2 break-words">{point.source}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground">{t.common.status}</span>
                    <StatusBadge variant={(point.moderationStatus?.toLowerCase() as any) || 'verified'} label={point.moderationStatus} />
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground">{language === 'id' ? 'Skor Keyakinan' : 'Confidence Score'}</span>
                    <span className="font-mono text-foreground font-semibold">{(point.confidence * 100).toFixed(0)}%</span>
                  </div>
                  {reviewer && (
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">{language === 'id' ? 'Diverifikasi Oleh' : 'Verified By'}</span>
                      <span className="font-medium text-foreground">{reviewer}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'simulation' && point.type === 'ml' && (
            /* SIMULATION TAB */
            <div className="p-4 space-y-4 text-xs">
              <div className="p-3 bg-muted/20 border border-border/60 rounded-lg">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-2">
                  {language === 'id' ? 'Parameter Prediksi Cepat' : 'Predictive Simulation Controls'}
                </span>
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-1">{language === 'id' ? 'Cuaca Maritim' : 'Marine Weather'}</label>
                    <select
                      value={simWeather}
                      onChange={(e) => setSimWeather(e.target.value)}
                      className="w-full bg-card border border-border rounded p-1.5 text-xs text-foreground focus:outline-none"
                    >
                      <option value="Clear">{language === 'id' ? 'Cerah (Clear)' : 'Clear'}</option>
                      <option value="Cloudy">{language === 'id' ? 'Berawan (Cloudy)' : 'Cloudy'}</option>
                      <option value="Rain">{language === 'id' ? 'Hujan (Rain)' : 'Rain'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-1">{language === 'id' ? 'Pasang Surut' : 'Tidal State'}</label>
                    <select
                      value={simTides}
                      onChange={(e) => setSimTides(e.target.value)}
                      className="w-full bg-card border border-border rounded p-1.5 text-xs text-foreground focus:outline-none"
                    >
                      <option value="High">{language === 'id' ? 'Pasang Tinggi (High)' : 'High'}</option>
                      <option value="Low">{language === 'id' ? 'Surut Rendah (Low)' : 'Low'}</option>
                    </select>
                  </div>
                </div>

                {isSimulating ? (
                  <p className="mt-3 text-muted-foreground animate-pulse text-center">{t.common.loading}</p>
                ) : simResult !== null ? (
                  <div className="mt-3 p-2.5 rounded bg-primary/10 border border-primary/20 text-center">
                    <span className="text-[10px] text-muted-foreground uppercase block">{language === 'id' ? 'Hasil Estimasi Model' : 'Simulated Density'}</span>
                    <span className="text-xl font-bold font-mono text-primary">{simResult.toFixed(1)} <span className="text-xs font-sans">item</span></span>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox photo viewer */}
      {isLightboxOpen && photoUrl && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-xl bg-card border border-border shadow-2xl">
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
            <img src={photoUrl} alt="Evidence" className="max-w-full max-h-[85vh] object-contain" />
          </div>
        </div>
      )}
    </>
  );
}