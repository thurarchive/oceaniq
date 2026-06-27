'use client';
import React, { useState, useEffect } from 'react';
import { X, MapPin, Clock, User, Gauge, Tag, Layers, CheckCircle, AlertCircle, Brain, Camera } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { supabase } from '@/lib/supabase';
import { MapPoint } from './mockPoints';

interface MapPointDetailProps {
  point: MapPoint;
  onClose: () => void;
}

const typeLabel: Record<string, string> = {
  observation: 'Verified Observation',
  citizen: 'Citizen Report',
  ml: 'ML Estimate',
};

const intensityConfig: Record<string, { label: string; color: string; bg: string; border: string; gradient: string }> = {
  critical: {
    label: 'Critical',
    color: 'text-danger',
    bg: 'bg-danger/10',
    border: 'border-danger/30',
    gradient: 'from-danger/20 to-danger/2'
  },
  high: {
    label: 'High',
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/30',
    gradient: 'from-warning/20 to-warning/2'
  },
  medium: {
    label: 'Medium',
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/30',
    gradient: 'from-primary/20 to-primary/2'
  },
  low: {
    label: 'Low',
    color: 'text-positive',
    bg: 'bg-positive/10',
    border: 'border-positive/30',
    gradient: 'from-positive/20 to-positive/2'
  },
};

export default function MapPointDetail({ point, onClose }: MapPointDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const intensityCfg = intensityConfig[point.intensity] || intensityConfig.low;
  const formattedDate = point.timestamp.split('T')[0];
  const formattedTime = point.timestamp.split('T')[1]?.replace('Z', ' UTC') ?? '';

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
            <h3 className="text-sm font-bold text-foreground truncate">{point.zone}</h3>

            {point.type === 'citizen' && contributor && (
              <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-full w-fit border border-border/40">
                <div className="w-3.5 h-3.5 rounded-full bg-accent/20 flex items-center justify-center text-accent text-[8px] font-bold">
                  {contributor.charAt(0).toUpperCase()}
                </div>
                <span>By <span className="font-semibold text-foreground">{contributor}</span></span>
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
            Overview
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${activeTab === 'details'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            Details
          </button>
        </div>

        {/* Tab content wrapper */}
        <div className="flex-1 overflow-y-auto scrollbar-ocean">
          {activeTab === 'overview' ? (
            /* OVERVIEW TAB */
            <div className="space-y-4">
              {/* Waste Density Hero Widget */}
              <div className={`p-4 bg-gradient-to-br ${intensityCfg.gradient} border-b border-border`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">Waste Density</span>
                    <h2 className="text-3xl font-bold font-mono tracking-tight text-foreground mt-0.5">
                      {point.wasteDensity} <span className="text-xs font-normal text-muted-foreground font-sans">kg/m²</span>
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
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider block">Waste Category</span>
                  <div className="flex items-center gap-1.5 mt-1 bg-muted/20 border border-border/50 rounded-lg px-3 py-2">
                    <Tag size={13} className="text-primary shrink-0" />
                    <span className="text-xs font-medium text-foreground">{point.wasteCategory}</span>
                  </div>
                </div>

                {/* Description */}
                {point.description && (
                  <div className="bg-muted/10 border border-border/40 rounded-lg p-3">
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider block mb-1">Observation Notes</span>
                    <p className="text-xs text-foreground/90 leading-relaxed italic">
                      "{point.description}"
                    </p>
                  </div>
                )}

                {/* Photo preview attachment */}
                {photoUrl && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider block">Photo Overview Attachment</span>
                    <button
                      onClick={() => setIsLightboxOpen(true)}
                      className="group relative w-full h-32 rounded-lg overflow-hidden border border-border bg-muted/40 flex items-center justify-center cursor-pointer transition-all hover:border-primary/50 shadow-md"
                    >
                      <img
                        src={photoUrl}
                        alt="Citizen Submission Attachment"
                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold backdrop-blur-[1px]">
                        <Camera size={14} className="animate-pulse" />
                        <span>Click to see full picture</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* DETAILS TAB */
            <div className="p-4 space-y-4">
              {/* Telemetry Stat Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/20 border border-border/50 rounded-lg p-2.5 space-y-1">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase font-semibold">
                    <MapPin size={11} className="text-accent shrink-0" /> Coordinates
                  </div>
                  <p className="font-mono text-xs text-foreground leading-tight">
                    {point.lat.toFixed(6)}°S<br />
                    {point.lng.toFixed(6)}°E
                  </p>
                </div>

                <div className="bg-muted/20 border border-border/50 rounded-lg p-2.5 space-y-1">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase font-semibold">
                    <Clock size={11} className="text-accent shrink-0" /> Recorded Time
                  </div>
                  <p className="font-mono text-[10px] text-foreground leading-tight">
                    {formattedDate}<br />
                    {formattedTime}
                  </p>
                </div>

                <div className="bg-muted/20 border border-border/50 rounded-lg p-2.5 space-y-1 col-span-2">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase font-semibold">
                    <Layers size={11} className="text-accent shrink-0" /> Data Source
                  </div>
                  <p className="text-xs text-foreground font-medium truncate">
                    {point.source}
                  </p>
                </div>
              </div>

              {/* Confidence Meter */}
              <div className="bg-muted/20 border border-border/50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center text-[10px] text-muted-foreground uppercase font-semibold">
                  <span className="flex items-center gap-1">
                    <Gauge size={12} className="text-primary shrink-0" />
                    {point.type === 'ml' ? 'Model Confidence' : 'Data Reliability'}
                  </span>
                  <span className="font-mono text-xs text-foreground font-bold">{point.confidence}%</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted/60 rounded-full overflow-hidden border border-border/30">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${point.confidence >= 90
                        ? 'bg-gradient-to-r from-positive/80 to-positive shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                        : point.confidence >= 70
                          ? 'bg-gradient-to-r from-primary/80 to-primary shadow-[0_0_8px_rgba(14,165,233,0.4)]'
                          : 'bg-gradient-to-r from-warning/80 to-warning shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                        }`}
                      style={{ width: `${point.confidence}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Moderation Status */}
              <div className="flex items-center justify-between pt-2.5 border-t border-border">
                <span className="text-xs text-muted-foreground">Status</span>
                <div className="flex items-center gap-1.5">
                  {point.type === 'ml' ? (
                    <StatusBadge variant="estimated" />
                  ) : point.moderationStatus === 'Verified' ? (
                    <StatusBadge variant="verified" />
                  ) : (
                    <>
                      <StatusBadge variant="approved" />
                      {point.type === 'citizen' && (
                        <span className="text-xs text-muted-foreground font-medium">
                          by {reviewer || 'Admin'}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ML Estimates warning footer (rendered on both tabs if ML estimate) */}
        {point.type === 'ml' && (
          <div className="p-3 border-t border-border bg-warning/5 m-3 rounded-lg border border-warning/20">
            <div className="flex gap-2 items-start">
              <AlertCircle size={13} className="text-warning shrink-0 mt-0.5" />
              <p className="text-[10px] text-warning/90 leading-relaxed font-medium">
                This is a model estimate, not a measured observation. See methodology for details.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Full-screen photo lightbox overlay */}
      {isLightboxOpen && photoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setIsLightboxOpen(false)} />
          <div className="relative max-w-4xl max-h-[85vh] w-full flex flex-col items-center justify-center z-10">
            {/* Lightbox Header */}
            <div className="absolute -top-12 left-0 right-0 flex items-center justify-between text-white px-2">
              <div className="min-w-0 flex-1 pr-4">
                <h4 className="text-sm font-bold truncate text-foreground">{point.zone}</h4>
                <p className="text-xs text-white/70 truncate">
                  {point.type === 'citizen' && contributor ? `Submitted by ${contributor}` : 'Photo Attachment'}
                </p>
              </div>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Image container */}
            <div className="relative w-full h-full flex justify-center items-center overflow-hidden rounded-lg shadow-2xl border border-white/10 bg-black/30">
              <img
                src={photoUrl}
                alt={point.zone}
                className="max-w-full max-h-[75vh] object-contain select-none rounded"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}