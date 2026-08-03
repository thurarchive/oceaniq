'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Navigation,
  Camera,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  X,
  Wind,
  Sun,
  CloudRain,
  Cloud,
  Waves,
  Anchor,
  Activity,
  Scale,
  Info,
  ChevronDown,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { insertCitizenReport, uploadCitizenPhoto } from '@/lib/citizen-reports';
import {
  VolumeEstimate,
  WeatherCondition,
  TideCondition,
  DistributionType,
  MobilityType,
  WeightRange,
} from '@/types/citizen-reports';
import LocationPickerMap from './LocationPickerMap';
import LazySignUpModal from './LazySignUpModal';
import { User as SupabaseUser } from '@supabase/supabase-js';

const VOLUME_OPTIONS: { value: VolumeEstimate; icon: string; desc: string }[] = [
  { value: '< 1 Trash Bag', icon: '🛍️', desc: 'A small scattered amount' },
  { value: '1–5 Bags', icon: '🗑️', desc: 'Localised pile or spread' },
  { value: 'Small Truck Load', icon: '🚐', desc: 'Sizeable accumulation' },
  { value: 'Large Accumulation', icon: '🚛', desc: 'Massive deposit' },
];

const WEATHER_OPTIONS: { value: WeatherCondition; icon: React.ReactNode; label: string }[] = [
  { value: 'Clear', icon: <Sun size={16} />, label: 'Clear' },
  { value: 'Overcast', icon: <Cloud size={16} />, label: 'Overcast' },
  { value: 'Rain', icon: <CloudRain size={16} />, label: 'Rain' },
  { value: 'Windy', icon: <Wind size={16} />, label: 'Windy' },
];

const TIDE_OPTIONS: { value: TideCondition; label: string }[] = [
  { value: 'High', label: 'High' },
  { value: 'Low', label: 'Low' },
  { value: 'Ebb', label: 'Ebb' },
  { value: 'Flood', label: 'Flood' },
];

const DISTRIBUTION_OPTIONS: { value: DistributionType; icon: string; desc: string }[] = [
  { value: 'Concentrated', icon: '●', desc: 'Tight pile or cluster' },
  { value: 'Scattered', icon: '·  ·  ·', desc: 'Spread across the area' },
  { value: 'Mixed', icon: '● · ·', desc: 'Some piles, some scattered' },
];

const MOBILITY_OPTIONS: { value: MobilityType; icon: React.ReactNode; desc: string }[] = [
  { value: 'Floating/Moving', icon: <Waves size={15} />, desc: 'Moving with water' },
  { value: 'Stranded', icon: <Anchor size={15} />, desc: 'Stuck on shore/seabed' },
  { value: 'Mixed', icon: <Activity size={15} />, desc: 'Both floating & stranded' },
];

const WEIGHT_REFS: { range: WeightRange; icon: string; label: string; example: string; kg: string }[] = [
  { range: '< 5 kg', icon: '🛍️', label: 'Light', example: '1–2 shopping bags of cans', kg: '< 5 kg' },
  { range: '5–20 kg', icon: '🎒', label: 'Moderate', example: 'A fully loaded backpack', kg: '5–20 kg' },
  { range: '20–100 kg', icon: '📦', label: 'Heavy', example: 'A large sack of rice or car tyre', kg: '20–100 kg' },
  { range: '> 100 kg', icon: '🚛', label: 'Major', example: 'Requires a vehicle to remove', kg: '> 100 kg' },
];

const COMPOSITION_FIELDS: { key: keyof CompositionFlags; label: string; icon: string }[] = [
  { key: 'has_plastic', label: 'Plastic (bottles, bags, packaging)', icon: '🔵' },
  { key: 'has_organic', label: 'Organic / Wood debris', icon: '🟤' },
  { key: 'has_fishing_gear', label: 'Fishing gear (nets, rope, buoys)', icon: '🪢' },
  { key: 'has_styrofoam', label: 'Styrofoam / foam pieces', icon: '⬜' },
  { key: 'has_glass_metal', label: 'Glass / Metal', icon: '⚙️' },
];

const STEP_TITLES = ['Location & Context', 'Debris Assessment', 'Weight & Evidence'];

function nowLocalISO(): string {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

interface CompositionFlags {
  has_plastic: boolean;
  has_organic: boolean;
  has_fishing_gear: boolean;
  has_styrofoam: boolean;
  has_glass_metal: boolean;
}

export default function ContributeForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showLazyModal, setShowLazyModal] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [weightGuideOpen, setWeightGuideOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [form, setForm] = useState({
    lat: '',
    lng: '',
    site_name: '',
    observation_time: nowLocalISO(),
    weather: '' as WeatherCondition | '',
    tides: '' as TideCondition | '',
    volume_estimate: '' as VolumeEstimate | '',
    composition: {
      has_plastic: true,
      has_organic: false,
      has_fishing_gear: false,
      has_styrofoam: false,
      has_glass_metal: false,
    } as CompositionFlags,
    distribution: '' as DistributionType | '',
    mobility: '' as MobilityType | '',
    area_estimate_m2: '',
    weight_range: '' as WeightRange | '',
    weight_estimate_kg: '',
    photo: null as File | null,
    photoPreview: null as string | null,
    notes: '',
  });

  // Fetch initial session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoadingUser(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoadingUser(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Location selector handler
  const handleLocationSelect = (latNum: number, lngNum: number) => {
    setForm((f) => ({ ...f, lat: String(latNum), lng: String(lngNum) }));
    setErrors((e) => ({ ...e, location: '' }));
  };

  // Photo change handler
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Photo must be under 10 MB');
      return;
    }

    if (form.photoPreview) URL.revokeObjectURL(form.photoPreview);
    const preview = URL.createObjectURL(file);
    setForm((f) => ({ ...f, photo: file, photoPreview: preview }));
    setErrors((e) => ({ ...e, photo: '' }));
  };

  const removePhoto = () => {
    if (form.photoPreview) URL.revokeObjectURL(form.photoPreview);
    setForm((f) => ({ ...f, photo: null, photoPreview: null }));
  };

  const handleWeightRangePick = (range: WeightRange) => {
    const midpoints: Record<WeightRange, number> = {
      '< 5 kg': 2.5,
      '5–20 kg': 12,
      '20–100 kg': 50,
      '> 100 kg': 150,
    };
    setForm((f) => ({
      ...f,
      weight_range: range,
      weight_estimate_kg: String(midpoints[range]),
    }));
    setErrors((e) => ({ ...e, weight: '' }));
  };

  const [attemptedNext, setAttemptedNext] = useState(false);

  // Dynamic missing fields calculator for current step
  const getMissingFields = () => {
    const missing: { key: string; label: string; desc: string }[] = [];
    if (step === 0) {
      if (!form.lat || !form.lng) {
        missing.push({ key: 'location', label: 'Interactive Location Pin', desc: 'Tap on map or use GPS' });
      }
      if (!form.weather) {
        missing.push({ key: 'weather', label: 'Weather Condition', desc: 'Select weather condition' });
      }
    } else if (step === 1) {
      if (!form.volume_estimate) {
        missing.push({ key: 'volume', label: 'Approximate Volume', desc: 'Select volume estimate' });
      }
      const anyComposition = Object.values(form.composition).some(Boolean);
      if (!anyComposition) {
        missing.push({ key: 'composition', label: 'Debris Composition', desc: 'Select at least one debris type' });
      }
      if (!form.distribution) {
        missing.push({ key: 'distribution', label: 'Debris Distribution', desc: 'Select debris distribution' });
      }
      if (!form.mobility) {
        missing.push({ key: 'mobility', label: 'Debris Mobility', desc: 'Select debris mobility' });
      }
    } else if (step === 2) {
      if (!form.photo && !form.photoPreview) {
        missing.push({ key: 'photo', label: 'Site Photo Evidence', desc: 'Upload photo evidence' });
      }
      if (!form.weight_range && !form.weight_estimate_kg) {
        missing.push({ key: 'weight', label: 'Estimated Weight', desc: 'Pick a weight range or enter kg' });
      }
    }
    return missing;
  };

  const missingFields = getMissingFields();
  const isFieldMissing = (key: string) => attemptedNext && missingFields.some((f) => f.key === key);

  const validateStep = (): boolean => {
    setAttemptedNext(true);
    const activeMissing = getMissingFields();
    if (activeMissing.length > 0) {
      toast.error(`Please fill out all required fields on this step.`);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setAttemptedNext(false);
      setStep((s) => s + 1);
    }
  };

  // Perform Final Database Submission
  const doSubmitReport = async (targetUserId: string, targetName: string) => {
    setSubmitting(true);
    try {
      let photo_url = form.photoPreview || '';
      if (form.photo) {
        photo_url = await uploadCitizenPhoto(targetUserId, form.photo);
      }

      const weight_kg = form.weight_estimate_kg ? parseFloat(form.weight_estimate_kg) : null;

      const payload = {
        user_id: targetUserId,
        status: 'pending_moderation' as const,
        site_name: form.site_name || null,
        lat: form.lat ? parseFloat(form.lat) : null,
        lng: form.lng ? parseFloat(form.lng) : null,
        observation_time: new Date(form.observation_time).toISOString(),
        weather: form.weather || null,
        tides: form.tides || null,
        volume_estimate: form.volume_estimate || null,
        distribution: form.distribution || null,
        mobility: form.mobility || null,
        area_estimate_m2: form.area_estimate_m2 ? parseFloat(form.area_estimate_m2) : null,
        ...form.composition,
        weight_estimate_kg: weight_kg,
        weight_range: form.weight_range || null,
        photo_url,
        notes: form.notes || null,
        contributor_name: targetName || 'Citizen Scientist',
      };

      await insertCitizenReport(payload);

      toast.success('Report submitted successfully! Thank you for your contribution.');
      router.push('/user-dashboard');
    } catch (err: any) {
      console.error('Submission error:', err);
      toast.error(err?.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Click Submit Handler
  const handleSubmitClick = () => {
    if (!validateStep()) return;

    if (user) {
      // User is authenticated -> submit directly
      const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Contributor';
      doSubmitReport(user.id, fullName);
    } else {
      // User is guest -> show Lazy Sign-Up Modal
      setShowLazyModal(true);
    }
  };

  // Lazy Modal Auth Callback
  const handleAuthSuccess = async (newUserId: string, newFullName: string) => {
    setShowLazyModal(false);
    await doSubmitReport(newUserId, newFullName);
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass-card-elevated border border-primary/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Step Indicator Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          {STEP_TITLES.map((title, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <React.Fragment key={i}>
                <div className="flex items-center gap-2 shrink-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${done
                      ? 'bg-positive text-white'
                      : active
                        ? 'bg-primary text-white ring-4 ring-primary/20 scale-105'
                        : 'bg-muted/60 text-muted-foreground'
                      }`}
                  >
                    {done ? <Check size={14} /> : i + 1}
                  </div>
                  <span
                    className={`text-xs font-semibold ${active ? 'text-primary' : 'text-muted-foreground hidden sm:inline'
                      }`}
                  >
                    {title}
                  </span>
                </div>
                {i < STEP_TITLES.length - 1 && (
                  <div
                    className={`flex-1 h-1 rounded-full transition-all duration-500 ${done ? 'bg-positive' : 'bg-border/60'
                      }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Location & Context */}
      {step === 0 && (
        <div className="flex flex-col gap-5 animate-in fade-in duration-300">
          <div>
            <h2 className="text-lg font-bold text-foreground">Location &amp; Context</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Drop a pin on the map where you observed the waste debris.
            </p>
          </div>

          {/* Location Picker Map */}
          <div>
            <label className="auth-label mb-1.5 flex items-center justify-between">
              <span>
                Interactive Location Pin <span className="text-danger font-bold">*</span>
              </span>
              {isFieldMissing('location') && (
                <span className="text-xs text-danger font-semibold animate-pulse">Location required</span>
              )}
            </label>
            <LocationPickerMap
              lat={form.lat ? parseFloat(form.lat) : null}
              lng={form.lng ? parseFloat(form.lng) : null}
              onLocationSelect={handleLocationSelect}
            />
          </div>

          {/* Coordinates & Site Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="auth-input-group">
              <label className="auth-label" htmlFor="field-site-name">
                Site / Beach Name <span className="normal-case text-muted-foreground">(optional)</span>
              </label>
              <input
                id="field-site-name"
                type="text"
                placeholder="e.g., Ancol Beach, North Coast"
                value={form.site_name}
                onChange={(e) => setForm((f) => ({ ...f, site_name: e.target.value }))}
                className="auth-input text-xs"
              />
            </div>
            <div className="auth-input-group">
              <label className="auth-label" htmlFor="field-obs-time">
                Observation Date &amp; Time <span className="text-danger font-bold">*</span>
              </label>
              <input
                id="field-obs-time"
                type="datetime-local"
                value={form.observation_time}
                onChange={(e) => setForm((f) => ({ ...f, observation_time: e.target.value }))}
                className="auth-input text-xs"
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </div>

          {/* Weather & Tide Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="auth-label">
                Weather Condition <span className="text-danger font-bold">*</span>
              </label>
              {isFieldMissing('weather') && <p className="text-xs text-danger mb-1 font-semibold">Select a weather condition</p>}
              <div className="grid grid-cols-2 gap-2">
                {WEATHER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setForm((f) => ({ ...f, weather: opt.value }));
                      setErrors((e) => ({ ...e, weather: '' }));
                    }}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${form.weather === opt.value
                      ? 'bg-primary/20 border-primary text-primary font-bold'
                      : 'border-border/60 text-muted-foreground hover:bg-muted/40'
                      }`}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="auth-label">
                Tide State <span className="normal-case text-muted-foreground">(optional)</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TIDE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, tides: opt.value }))}
                    className={`py-2.5 rounded-xl border text-xs font-medium transition-all ${form.tides === opt.value
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 font-bold'
                      : 'border-border/60 text-muted-foreground hover:bg-muted/40'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Debris Assessment */}
      {step === 1 && (
        <div className="flex flex-col gap-5 animate-in fade-in duration-300">
          <div>
            <h2 className="text-lg font-bold text-foreground">Debris Assessment</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Describe what kind of waste debris is present.
            </p>
          </div>

          {/* Volume estimate */}
          <div>
            <label className="auth-label">
              Approximate Volume <span className="text-danger font-bold">*</span>
            </label>
            {isFieldMissing('volume') && <p className="text-xs text-danger mb-1 font-semibold">Select a volume estimate</p>}
            <div className="grid grid-cols-2 gap-2.5">
              {VOLUME_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setForm((f) => ({ ...f, volume_estimate: opt.value }));
                    setErrors((e) => ({ ...e, volume: '' }));
                  }}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl border text-xs text-left transition-all ${form.volume_estimate === opt.value
                    ? 'bg-primary/20 border-primary text-primary font-semibold shadow-md'
                    : 'border-border/60 text-muted-foreground hover:bg-muted/30'
                    }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <div>
                    <p className="font-bold text-foreground">{opt.value}</p>
                    <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Composition */}
          <div>
            <label className="auth-label">
              Debris Composition <span className="text-danger font-bold">*</span> (Select all that apply)
            </label>
            {isFieldMissing('composition') && <p className="text-xs text-danger mb-1 font-semibold font-semibold">Select at least one debris type</p>}
            <div className="flex flex-col gap-2">
              {COMPOSITION_FIELDS.map((field) => {
                const checked = form.composition[field.key];
                return (
                  <button
                    key={field.key}
                    type="button"
                    onClick={() => {
                      setForm((f) => ({
                        ...f,
                        composition: { ...f.composition, [field.key]: !checked },
                      }));
                      setErrors((e) => ({ ...e, composition: '' }));
                    }}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all ${checked
                      ? 'bg-primary/15 border-primary text-primary'
                      : 'border-border/60 text-muted-foreground hover:bg-muted/30'
                      }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${checked ? 'bg-primary border-primary' : 'border-muted-foreground/50'
                        }`}
                    >
                      {checked && <Check size={11} className="text-white" />}
                    </div>
                    <span className="text-base">{field.icon}</span>
                    <span>{field.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Distribution & Mobility */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="auth-label">
                Distribution <span className="text-danger font-bold">*</span>
              </label>
              {isFieldMissing('distribution') && <p className="text-xs text-danger mb-1 font-semibold">Select debris distribution</p>}
              <div className="grid grid-cols-3 gap-1.5">
                {DISTRIBUTION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setForm((f) => ({ ...f, distribution: opt.value }));
                      setErrors((e) => ({ ...e, distribution: '' }));
                    }}
                    className={`py-2 px-1 rounded-xl border text-[11px] font-medium text-center transition-all ${form.distribution === opt.value
                      ? 'bg-primary/20 border-primary text-primary font-bold'
                      : 'border-border/60 text-muted-foreground hover:bg-muted/30'
                      }`}
                  >
                    {opt.value}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="auth-label">
                Debris Mobility <span className="text-danger font-bold">*</span>
              </label>
              {isFieldMissing('mobility') && <p className="text-xs text-danger mb-1 font-semibold">Select debris mobility</p>}
              <div className="grid grid-cols-3 gap-1.5">
                {MOBILITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setForm((f) => ({ ...f, mobility: opt.value }));
                      setErrors((e) => ({ ...e, mobility: '' }));
                    }}
                    className={`py-2 px-1 rounded-xl border text-[11px] font-medium text-center transition-all ${form.mobility === opt.value
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 font-bold'
                      : 'border-border/60 text-muted-foreground hover:bg-muted/30'
                      }`}
                  >
                    {opt.value}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Weight & Evidence */}
      {step === 2 && (
        <div className="flex flex-col gap-5 animate-in fade-in duration-300">
          <div>
            <h2 className="text-lg font-bold text-foreground">Weight &amp; Evidence</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Upload a clear site photo and estimate the total weight.
            </p>
          </div>

          {/* Photo Upload */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="auth-label mb-0">
                Site Photo Evidence <span className="text-danger font-bold">*</span>
              </label>
              <span className="text-[10px] font-bold text-danger uppercase tracking-wider">Required</span>
            </div>
            {isFieldMissing('photo') && <p className="text-xs text-danger mb-1 font-semibold">Photo evidence is required</p>}

            {form.photoPreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-border aspect-video bg-muted/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.photoPreview} alt="Report preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 flex items-center justify-center text-white hover:bg-danger transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2.5 transition-all bg-muted/10 hover:bg-primary/5 cursor-pointer ${isFieldMissing('photo') ? 'border-danger/70 text-danger' : 'border-border hover:border-primary/60'
                  }`}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Camera size={22} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-foreground">Click to upload photo evidence</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">JPG, PNG, WEBP up to 10MB</p>
                </div>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

          {/* Weight Estimation */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="auth-label mb-0">
                Estimated Weight <span className="text-danger font-bold">*</span>
              </label>
              <button
                type="button"
                onClick={() => setWeightGuideOpen(!weightGuideOpen)}
                className="text-[10px] text-primary flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Info size={11} />
                Weight guide
                <ChevronDown size={11} className={weightGuideOpen ? 'rotate-180' : ''} />
              </button>
            </div>

            {weightGuideOpen && (
              <div className="mb-3 p-3 rounded-xl bg-muted/30 border border-border text-xs text-muted-foreground">
                <p className="font-semibold text-foreground mb-2">Weight References:</p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {WEIGHT_REFS.map((r) => (
                    <div key={r.range} className="flex items-center gap-1.5">
                      <span>{r.icon}</span>
                      <span>
                        <strong>{r.kg}:</strong> {r.example}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isFieldMissing('weight') && <p className="text-xs text-danger mb-1 font-semibold">Weight estimate is required</p>}

            <div className="grid grid-cols-4 gap-2 mb-3">
              {WEIGHT_REFS.map((r) => (
                <button
                  key={r.range}
                  type="button"
                  onClick={() => handleWeightRangePick(r.range)}
                  className={`flex flex-col items-center py-2.5 rounded-xl border text-xs transition-all ${form.weight_range === r.range
                    ? 'bg-positive/20 border-positive text-positive font-bold'
                    : 'border-border/60 text-muted-foreground hover:bg-muted/30'
                    }`}
                >
                  <span className="text-lg leading-none">{r.icon}</span>
                  <span className="font-semibold mt-1">{r.label}</span>
                  <span className="text-[10px] opacity-70 mt-0.5">{r.kg}</span>
                </button>
              ))}
            </div>

            <div className="auth-input-group">
              <label className="auth-label text-[11px]">Refine precise weight (kg)</label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 15.5"
                value={form.weight_estimate_kg}
                onChange={(e) => {
                  setForm((f) => ({ ...f, weight_estimate_kg: e.target.value }));
                  setErrors((er) => ({ ...er, weight: '' }));
                }}
                className="auth-input text-xs"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div className="auth-input-group">
            <label className="auth-label" htmlFor="field-notes">
              Additional Notes <span className="normal-case text-muted-foreground">(optional)</span>
            </label>
            <textarea
              id="field-notes"
              rows={2}
              placeholder="e.g. High concentration near water edge."
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              className="auth-input text-xs resize-none"
            />
          </div>
        </div>
      )}

      {/* Validation Alert Warning Box if attemptedNext and missing fields exist */}
      {attemptedNext && missingFields.length > 0 && (
        <div className="mt-4 p-3.5 rounded-2xl bg-danger/10 border border-danger/30 text-danger text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
          <Info size={16} className="shrink-0 mt-0.5 text-danger" />
          <div>
            <p className="font-bold">Submission Warning — Required Fields Missing</p>
            <p className="text-[11px] text-danger/90 mt-0.5 leading-snug">
              Please complete all required fields on this step before proceeding:
            </p>
            <ul className="list-disc list-inside text-[11px] mt-1.5 space-y-1 opacity-90">
              {missingFields.map((item) => (
                <li key={item.key}>
                  <strong className="font-semibold text-danger">{item.label}</strong> — {item.desc}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Navigation & Submit Buttons */}
      <div className="flex items-center justify-between pt-6 mt-6 border-t border-border/60">
        <button
          type="button"
          onClick={() => {
            setAttemptedNext(false);
            step === 0 ? router.push('/') : setStep((s) => s - 1);
          }}
          className="btn-ghost flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <ChevronLeft size={16} />
          {step === 0 ? 'Cancel' : 'Back'}
        </button>

        {step < 2 ? (
          <button
            type="button"
            onClick={handleNext}
            className="btn-primary flex items-center gap-1.5 text-xs font-semibold px-5 py-2.5 cursor-pointer"
          >
            Next Step
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmitClick}
            disabled={submitting}
            className="btn-primary flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-6 py-3 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Submit Report
              </>
            )}
          </button>
        )}
      </div>

      {/* Lazy Sign Up Auth Modal */}
      <LazySignUpModal
        isOpen={showLazyModal}
        onClose={() => setShowLazyModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
