'use client';
import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
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
} from 'lucide-react';
import { toast } from 'sonner';
import { insertCitizenReport, uploadCitizenPhoto, updateCitizenReport } from '@/lib/citizen-reports';
import {
  VolumeEstimate,
  WeatherCondition,
  TideCondition,
  DistributionType,
  MobilityType,
  WeightRange,
} from '@/types/citizen-reports';

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
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

// Weight reference anchors — visual aids for estimation
const WEIGHT_REFS: { range: WeightRange; icon: string; label: string; example: string; kg: string }[] = [
  {
    range: '< 5 kg',
    icon: '🛍️',
    label: 'Light',
    example: '1–2 shopping bags of cans',
    kg: '< 5 kg',
  },
  {
    range: '5–20 kg',
    icon: '🎒',
    label: 'Moderate',
    example: 'A fully loaded backpack',
    kg: '5–20 kg',
  },
  {
    range: '20–100 kg',
    icon: '📦',
    label: 'Heavy',
    example: 'A large sack of rice or car tyre',
    kg: '20–100 kg',
  },
  {
    range: '> 100 kg',
    icon: '🚛',
    label: 'Major',
    example: 'Requires a vehicle to remove',
    kg: '> 100 kg',
  },
];

const COMPOSITION_FIELDS: { key: keyof CompositionFlags; label: string; icon: string }[] = [
  { key: 'has_plastic', label: 'Plastic (bottles, bags, packaging)', icon: '🔵' },
  { key: 'has_organic', label: 'Organic / Wood debris', icon: '🟤' },
  { key: 'has_fishing_gear', label: 'Fishing gear (nets, rope, buoys)', icon: '🪢' },
  { key: 'has_styrofoam', label: 'Styrofoam / foam pieces', icon: '⬜' },
  { key: 'has_glass_metal', label: 'Glass / Metal', icon: '⚙️' },
];

// ─────────────────────────────────────────────
// Step indicator
// ─────────────────────────────────────────────
const STEP_TITLES = ['Location & Context', 'Debris Assessment', 'Weight & Evidence'];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        {STEP_TITLES.map((title, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <React.Fragment key={i}>
              <div className="flex items-center gap-1.5 shrink-0">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${done
                    ? 'bg-positive text-white'
                    : active
                      ? 'bg-primary text-white ring-2 ring-primary/30'
                      : 'bg-muted/50 text-muted-foreground'
                    }`}
                >
                  {done ? <Check size={12} /> : i + 1}
                </div>
                {active && (
                  <span className="text-xs font-semibold text-primary hidden sm:block">
                    {title}
                  </span>
                )}
              </div>
              {i < STEP_TITLES.length - 1 && (
                <div
                  className={`flex-1 h-0.5 rounded-full transition-all duration-500 ${done ? 'bg-positive' : 'bg-border'
                    }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface CompositionFlags {
  has_plastic: boolean;
  has_organic: boolean;
  has_fishing_gear: boolean;
  has_styrofoam: boolean;
  has_glass_metal: boolean;
}

interface CitizenFormState {
  // Step 1
  lat: string;
  lng: string;
  site_name: string;
  observation_time: string;
  weather: WeatherCondition | '';
  tides: TideCondition | '';
  // Step 2
  volume_estimate: VolumeEstimate | '';
  composition: CompositionFlags;
  distribution: DistributionType | '';
  mobility: MobilityType | '';
  area_estimate_m2: string;
  // Step 3
  weight_range: WeightRange | '';
  weight_estimate_kg: string;
  photo: File | null;
  photoPreview: string | null;
  notes: string;
}

function nowLocalISO(): string {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export interface FormRef {
  isDirty: () => boolean;
  saveDraft: () => Promise<void>;
}

interface CitizenReportFormProps {
  userId: string;
  user?: any;
  draft?: any;
  onSuccess: () => void;
  onCancel: () => void;
  readOnly?: boolean;
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────
const CitizenReportForm = forwardRef<FormRef, CitizenReportFormProps>(
  ({ userId, user, draft, onSuccess, onCancel, readOnly = false }, ref) => {
    const [step, setStep] = useState(0);
    const [detecting, setDetecting] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [weightGuideOpen, setWeightGuideOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState<CitizenFormState>({
      lat: draft ? String(draft.lat ?? '') : '',
      lng: draft ? String(draft.lng ?? '') : '',
      site_name: draft ? (draft.site_name ?? '') : '',
      observation_time: draft ? new Date(draft.observation_time).toISOString().slice(0, 16) : nowLocalISO(),
      weather: draft ? (draft.weather ?? '') : '',
      tides: draft ? (draft.tides ?? '') : '',
      volume_estimate: draft ? (draft.volume_estimate ?? '') : '',
      composition: {
        has_plastic: draft ? draft.has_plastic : false,
        has_organic: draft ? draft.has_organic : false,
        has_fishing_gear: draft ? draft.has_fishing_gear : false,
        has_styrofoam: draft ? draft.has_styrofoam : false,
        has_glass_metal: draft ? draft.has_glass_metal : false,
      },
      distribution: draft ? (draft.distribution ?? '') : '',
      mobility: draft ? (draft.mobility ?? '') : '',
      area_estimate_m2: draft ? String(draft.area_estimate_m2 ?? '') : '',
      weight_range: draft ? (draft.weight_range ?? '') : '',
      weight_estimate_kg: draft ? String(draft.weight_estimate_kg ?? '') : '',
      photo: null,
      photoPreview: draft ? (draft.photo_url ?? null) : null,
      notes: draft ? (draft.notes ?? '') : '',
    });

    const initialFormRef = useRef<CitizenFormState | null>(null);

    useEffect(() => {
      if (!initialFormRef.current) {
        initialFormRef.current = form;
      }
    }, [form]);

    const isDirty = () => {
      if (readOnly) return false;
      if (!initialFormRef.current) return false;

      const baseChanged =
        form.site_name !== initialFormRef.current.site_name ||
        form.lat !== initialFormRef.current.lat ||
        form.lng !== initialFormRef.current.lng ||
        form.weather !== initialFormRef.current.weather ||
        form.tides !== initialFormRef.current.tides ||
        form.volume_estimate !== initialFormRef.current.volume_estimate ||
        form.distribution !== initialFormRef.current.distribution ||
        form.mobility !== initialFormRef.current.mobility ||
        form.area_estimate_m2 !== initialFormRef.current.area_estimate_m2 ||
        form.weight_range !== initialFormRef.current.weight_range ||
        form.weight_estimate_kg !== initialFormRef.current.weight_estimate_kg ||
        form.notes !== initialFormRef.current.notes ||
        form.photo !== initialFormRef.current.photo;

      const compChanged = Object.keys(form.composition).some(
        (key) =>
          form.composition[key as keyof CompositionFlags] !==
          initialFormRef.current!.composition[key as keyof CompositionFlags]
      );

      return baseChanged || compChanged;
    };

    const saveDraft = async () => {
      setSubmitting(true);
      try {
        let photo_url = form.photoPreview || '';
        if (form.photo) {
          photo_url = await uploadCitizenPhoto(userId, form.photo);
        }
        const weight_kg = form.weight_estimate_kg ? parseFloat(form.weight_estimate_kg) : null;
        const contributor_name = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Citizen Contributor';

        const payload = {
          user_id: userId,
          status: 'draft' as const,
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
          contributor_name,
        };

        if (draft?.id) {
          await updateCitizenReport(draft.id, payload);
        } else {
          await insertCitizenReport(payload);
        }

        toast.success('Report saved as draft.');
      } catch (err: any) {
        console.error(err);
        toast.error(err?.message || 'Failed to save draft. Please try again.');
        throw err;
      } finally {
        setSubmitting(false);
      }
    };

    useImperativeHandle(ref, () => ({
      isDirty,
      saveDraft,
    }));

    // ── GPS detect ──
    const handleDetectGPS = () => {
      if (!navigator.geolocation) {
        toast.error('Geolocation not supported on this device.');
        return;
      }
      setDetecting(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm((f) => ({
            ...f,
            lat: pos.coords.latitude.toFixed(6),
            lng: pos.coords.longitude.toFixed(6),
          }));
          setDetecting(false);
          toast.success('Location detected!');
          setErrors((e) => ({ ...e, location: '' }));
        },
        () => {
          setDetecting(false);
          toast.error('Could not get location — enter coordinates manually.');
        },
        { timeout: 10000 }
      );
    };

    // ── Photo ──
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate MIME types and file extensions
      const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
      const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'];
      const fileExt = file.name.split('.').pop()?.toLowerCase() || '';

      const isAllowedMime = ALLOWED_MIME_TYPES.includes(file.type) || file.type === '';
      const isAllowedExt = ALLOWED_EXTENSIONS.includes(fileExt);

      if (!isAllowedMime && !isAllowedExt) {
        toast.error('Only JPG, PNG, WEBP, and HEIC photos are accepted.');
        return;
      }

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

    // ── Weight range quick-pick ──
    const handleWeightRangePick = (range: WeightRange) => {
      // Auto-fill a midpoint estimate when range is picked
      const midpoints: Record<WeightRange, number> = {
        '< 5 kg': 2.5,
        '5–20 kg': 12,
        '20–100 kg': 50,
        '> 100 kg': 150,
      };
      setForm((f) => ({
        ...f,
        weight_range: range,
        weight_estimate_kg: f.weight_estimate_kg || String(midpoints[range]),
      }));
      setErrors((e) => ({ ...e, weight: '' }));
    };

    // ── Validation ──
    const validateStep = (): boolean => {
      const newErrors: Record<string, string> = {};
      if (step === 0) {
        if (!form.lat || !form.lng) newErrors.location = 'Location is required. Use GPS or enter coordinates.';
        if (!form.weather) newErrors.weather = 'Select the weather condition.';
      }
      if (step === 1) {
        if (!form.volume_estimate) newErrors.volume = 'Select a volume estimate.';
        const anyComposition = Object.values(form.composition).some(Boolean);
        if (!anyComposition) newErrors.composition = 'Select at least one composition type.';
        if (!form.distribution) newErrors.distribution = 'Select debris distribution.';
        if (!form.mobility) newErrors.mobility = 'Select debris mobility.';
      }
      if (step === 2) {
        if (!form.photo && !form.photoPreview) newErrors.photo = 'A photo is required to submit this report.';
        if (!form.weight_range && !form.weight_estimate_kg)
          newErrors.weight = 'Please provide a weight estimate.';
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
      if (validateStep()) setStep((s) => s + 1);
    };

    // ── Submit ──
    const handleSubmit = async () => {
      if (!validateStep()) return;
      setSubmitting(true);
      try {
        let photo_url = form.photoPreview || '';
        if (form.photo) {
          photo_url = await uploadCitizenPhoto(userId, form.photo);
        }
        const weight_kg = form.weight_estimate_kg ? parseFloat(form.weight_estimate_kg) : null;
        const contributor_name = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Citizen Contributor';

        const payload = {
          user_id: userId,
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
          contributor_name,
        };

        if (draft?.id) {
          await updateCitizenReport(draft.id, payload);
        } else {
          await insertCitizenReport(payload);
        }

        toast.success('Report submitted — thank you for contributing!');
        onSuccess();
      } catch (err: any) {
        console.error(err);
        toast.error(err?.message || 'Failed to submit report. Please try again.');
      } finally {
        setSubmitting(false);
      }
    };

    // ─────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────
    return (
      <div className="flex flex-col h-full">
        <StepIndicator current={step} />

        <div className="flex-1 flex flex-col" style={readOnly ? { pointerEvents: 'none' } : undefined}>
          {/* ════════════════════════════════════════
            STEP 1 — Location & Context
          ════════════════════════════════════════ */}
          {step === 0 && (
            <div className="flex flex-col gap-5 flex-1">
              <div>
                <h3 className="text-base font-semibold text-foreground">Location &amp; Context</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Where and when did you observe this waste?
                </p>
              </div>

              {/* Site name (optional) */}
              <div className="auth-input-group">
              <label className="auth-label" htmlFor="field-site-name">
                Site / Beach Name{' '}
                <span className="normal-case font-normal text-muted-foreground">(optional)</span>
              </label>
              <input
                id="field-site-name"
                type="text"
                placeholder="e.g., Ancol Beach, Muara Angke"
                value={form.site_name}
                onChange={(e) => setForm((f) => ({ ...f, site_name: e.target.value }))}
                className="auth-input"
                style={{ paddingLeft: '0.75rem' }}
              />
            </div>

            {/* GPS / Coordinates */}
            <div>
              <label className="auth-label">GPS Coordinates</label>
              {errors.location && <p className="text-xs text-danger mb-1">{errors.location}</p>}
              <div className="flex gap-2 mb-2">
                <input
                  id="field-lat"
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  value={form.lat}
                  onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
                  className="auth-input flex-1"
                  aria-label="Latitude"
                />
                <input
                  id="field-lng"
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  value={form.lng}
                  onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
                  className="auth-input flex-1"
                  aria-label="Longitude"
                />
              </div>
              <button
                id="btn-detect-gps"
                type="button"
                onClick={handleDetectGPS}
                disabled={detecting}
                className="btn-ghost flex items-center gap-2 text-xs w-full justify-center py-2.5"
              >
                {detecting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Navigation size={14} />
                )}
                {detecting ? 'Detecting location…' : '📍 Auto-detect my GPS location'}
              </button>
            </div>

            {/* Date / Time */}
            <div className="auth-input-group">
              <label className="auth-label" htmlFor="field-obs-time">
                Observation Date &amp; Time
              </label>
              <input
                id="field-obs-time"
                type="datetime-local"
                value={form.observation_time}
                onChange={(e) => setForm((f) => ({ ...f, observation_time: e.target.value }))}
                className="auth-input"
                style={{ paddingLeft: '0.75rem', colorScheme: 'dark' }}
              />
            </div>

            {/* Weather */}
            <div>
              <label className="auth-label">Weather Condition</label>
              {errors.weather && <p className="text-xs text-danger mb-1">{errors.weather}</p>}
              <div className="grid grid-cols-4 gap-2">
                {WEATHER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    id={`weather-${opt.value}`}
                    onClick={() => {
                      setForm((f) => ({ ...f, weather: opt.value }));
                      setErrors((e) => ({ ...e, weather: '' }));
                    }}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-all duration-150 ${form.weather === opt.value
                      ? 'bg-primary/15 border-primary/50 text-primary'
                      : 'border-border/50 text-muted-foreground hover:text-foreground bg-card/20 hover:border-border'
                      }`}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tide */}
            <div>
              <label className="auth-label">Tide Condition</label>
              {errors.tides && <p className="text-xs text-danger mb-1">{errors.tides}</p>}
              <div className="grid grid-cols-4 gap-2">
                {TIDE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    id={`tide-${opt.value}`}
                    onClick={() => {
                      setForm((f) => ({ ...f, tides: opt.value }));
                      setErrors((e) => ({ ...e, tides: '' }));
                    }}
                    className={`py-2.5 rounded-xl border text-sm font-medium transition-all duration-150 ${form.tides === opt.value
                      ? 'bg-accent/15 border-accent/50 text-accent'
                      : 'border-border/50 text-muted-foreground hover:text-foreground bg-card/20 hover:border-border'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
          STEP 2 — Debris Assessment
      ════════════════════════════════════════ */}
        {step === 1 && (
          <div className="flex flex-col gap-5 flex-1">
            <div>
              <h3 className="text-base font-semibold text-foreground">Debris Assessment</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Describe what you see — check everything that applies.
              </p>
            </div>

            {/* Volume estimate */}
            <div>
              <label className="auth-label">Approximate Volume</label>
              {errors.volume && <p className="text-xs text-danger mb-1">{errors.volume}</p>}
              <div className="grid grid-cols-2 gap-2">
                {VOLUME_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    id={`vol-${opt.value.replace(/[^a-z0-9]/gi, '-')}`}
                    onClick={() => {
                      setForm((f) => ({ ...f, volume_estimate: opt.value }));
                      setErrors((e) => ({ ...e, volume: '' }));
                    }}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl border text-sm transition-all duration-150 text-left ${form.volume_estimate === opt.value
                      ? 'bg-primary/15 border-primary/50 text-primary'
                      : 'border-border/50 text-muted-foreground hover:text-foreground bg-card/20 hover:border-border'
                      }`}
                  >
                    <span className="text-xl leading-none">{opt.icon}</span>
                    <div>
                      <p className="font-semibold text-xs leading-tight">{opt.value}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Composition */}
            <div>
              <label className="auth-label">Composition — What do you see?</label>
              {errors.composition && (
                <p className="text-xs text-danger mb-1">{errors.composition}</p>
              )}
              <div className="flex flex-col gap-2">
                {COMPOSITION_FIELDS.map((field) => {
                  const checked = form.composition[field.key];
                  return (
                    <button
                      key={field.key}
                      type="button"
                      id={`comp-${field.key}`}
                      onClick={() => {
                        setForm((f) => ({
                          ...f,
                          composition: { ...f.composition, [field.key]: !checked },
                        }));
                        setErrors((e) => ({ ...e, composition: '' }));
                      }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm transition-all duration-150 ${checked
                        ? 'bg-primary/10 border-primary/40 text-primary'
                        : 'border-border/40 text-muted-foreground hover:text-foreground bg-card/20 hover:border-border'
                        }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${checked ? 'bg-primary border-primary' : 'border-muted-foreground/50'
                          }`}
                      >
                        {checked && <Check size={10} className="text-white" />}
                      </div>
                      <span className="text-base leading-none">{field.icon}</span>
                      <span>{field.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Distribution */}
            <div>
              <label className="auth-label">Debris Distribution</label>
              {errors.distribution && (
                <p className="text-xs text-danger mb-1">{errors.distribution}</p>
              )}
              <div className="grid grid-cols-3 gap-2">
                {DISTRIBUTION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    id={`dist-${opt.value}`}
                    onClick={() => {
                      setForm((f) => ({ ...f, distribution: opt.value }));
                      setErrors((e) => ({ ...e, distribution: '' }));
                    }}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs transition-all duration-150 ${form.distribution === opt.value
                      ? 'bg-primary/15 border-primary/50 text-primary'
                      : 'border-border/50 text-muted-foreground hover:text-foreground bg-card/20'
                      }`}
                  >
                    <span className="font-mono text-sm tracking-widest">{opt.icon}</span>
                    <span className="font-semibold">{opt.value}</span>
                    <span className="text-[10px] text-center leading-tight text-muted-foreground">
                      {opt.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobility */}
            <div>
              <label className="auth-label">Debris Mobility</label>
              {errors.mobility && (
                <p className="text-xs text-danger mb-1">{errors.mobility}</p>
              )}
              <div className="grid grid-cols-3 gap-2">
                {MOBILITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    id={`mob-${opt.value.replace(/[^a-z0-9]/gi, '-')}`}
                    onClick={() => {
                      setForm((f) => ({ ...f, mobility: opt.value }));
                      setErrors((e) => ({ ...e, mobility: '' }));
                    }}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-all duration-150 ${form.mobility === opt.value
                      ? 'bg-accent/15 border-accent/50 text-accent'
                      : 'border-border/50 text-muted-foreground hover:text-foreground bg-card/20'
                      }`}
                  >
                    {opt.icon}
                    <span>{opt.value}</span>
                    <span className="text-[10px] text-center leading-tight text-muted-foreground font-normal">
                      {opt.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Area estimate (optional) */}
            <div className="auth-input-group">
              <label className="auth-label" htmlFor="field-area">
                Estimated Area{' '}
                <span className="normal-case font-normal text-muted-foreground">
                  (m², optional — pace it out)
                </span>
              </label>
              <div className="relative">
                <input
                  id="field-area"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="e.g., 20"
                  value={form.area_estimate_m2}
                  onChange={(e) => setForm((f) => ({ ...f, area_estimate_m2: e.target.value }))}
                  className="auth-input pr-10"
                  style={{ paddingLeft: '0.75rem' }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">
                  m²
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
          STEP 3 — Weight & Evidence
      ════════════════════════════════════════ */}
        {step === 2 && (
          <div className="flex flex-col gap-5 flex-1">
            <div>
              <h3 className="text-base font-semibold text-foreground">Weight &amp; Evidence</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Upload a photo, then estimate the total weight of debris.
              </p>
            </div>

            {/* Photo upload — prominent & required */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="auth-label mb-0">Site Photo</label>
                <span className="text-[10px] font-bold text-danger uppercase tracking-wide">
                  Required
                </span>
              </div>
              {errors.photo && <p className="text-xs text-danger mb-1">{errors.photo}</p>}

              {form.photoPreview ? (
                <div className="relative rounded-xl overflow-hidden border border-border/50 aspect-video bg-muted/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.photoPreview}
                    alt="Report preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-danger/80 transition-colors"
                    aria-label="Remove photo"
                  >
                    <X size={14} />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full font-medium">
                    📸 Photo attached
                  </div>
                </div>
              ) : (
                <button
                  id="btn-upload-photo"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 transition-all duration-200 bg-muted/10 hover:bg-primary/5 ${errors.photo
                    ? 'border-danger/50 text-danger hover:border-danger'
                    : 'border-border hover:border-primary/50 text-muted-foreground hover:text-primary'
                    }`}
                >
                  <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center">
                    <Camera size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold">Tap to upload a photo</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG · PNG · WEBP · HEIC · max 10 MB
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1 opacity-70">
                      Your photo helps verify and estimate waste tonnage
                    </p>
                  </div>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                className="hidden"
                onChange={handlePhotoChange}
                aria-label="Upload site photo"
              />
            </div>

            {/* Weight estimation */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="auth-label mb-0">
                  <Scale size={13} className="inline mr-1 -mt-0.5" />
                  Estimated Total Weight
                </label>
                <button
                  type="button"
                  onClick={() => setWeightGuideOpen((o) => !o)}
                  className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 transition-colors ml-auto"
                >
                  <Info size={11} />
                  Weight guide
                  <ChevronDown
                    size={11}
                    className={`transition-transform ${weightGuideOpen ? 'rotate-180' : ''}`}
                  />
                </button>
              </div>

              {/* Collapsible weight guide */}
              {weightGuideOpen && (
                <div className="mb-3 p-3 rounded-xl bg-muted/20 border border-border/40 text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground mb-2 text-[11px] uppercase tracking-wider">
                    Visual Weight References
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {WEIGHT_REFS.map((r) => (
                      <div key={r.range} className="flex items-start gap-2">
                        <span className="text-base leading-none">{r.icon}</span>
                        <div>
                          <p className="font-semibold text-foreground">{r.kg}</p>
                          <p className="leading-snug">{r.example}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {errors.weight && <p className="text-xs text-danger mb-1">{errors.weight}</p>}

              {/* Quick-pick range buttons */}
              <div className="grid grid-cols-4 gap-1.5 mb-3">
                {WEIGHT_REFS.map((ref) => (
                  <button
                    key={ref.range}
                    type="button"
                    id={`weight-range-${ref.range.replace(/[^a-z0-9]/gi, '-')}`}
                    onClick={() => handleWeightRangePick(ref.range)}
                    className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-medium transition-all duration-150 ${form.weight_range === ref.range
                      ? 'bg-positive/15 border-positive/50 text-positive'
                      : 'border-border/50 text-muted-foreground hover:text-foreground bg-card/20 hover:border-border'
                      }`}
                  >
                    <span className="text-lg leading-none">{ref.icon}</span>
                    <span className="font-semibold">{ref.label}</span>
                    <span className="text-[10px] opacity-70">{ref.kg}</span>
                  </button>
                ))}
              </div>

              {/* Precise kg input */}
              <div className="auth-input-group">
                <label className="auth-label text-[10px]" htmlFor="field-weight-kg">
                  Precise estimate (kg)
                  <span className="normal-case font-normal text-muted-foreground">
                    {' '}— refine after picking a range above
                  </span>
                </label>
                <div className="relative">
                  <input
                    id="field-weight-kg"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="e.g., 12.5"
                    value={form.weight_estimate_kg}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, weight_estimate_kg: e.target.value }));
                      setErrors((er) => ({ ...er, weight: '' }));
                    }}
                    className="auth-input pr-10"
                    style={{ paddingLeft: '0.75rem' }}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">
                    kg
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="auth-input-group">
              <label className="auth-label" htmlFor="field-notes">
                Additional Notes{' '}
                <span className="normal-case font-normal text-muted-foreground">(optional)</span>
              </label>
              <textarea
                id="field-notes"
                rows={3}
                placeholder="e.g., Heavy rain last night washed debris ashore. Strong smell of oil."
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="auth-input resize-none w-full"
                style={{ paddingLeft: '0.75rem' }}
              />
            </div>

            {/* Pre-submit summary */}
            {form.photo && (
              <div className="glass-card-elevated border border-positive/20 rounded-xl p-3 bg-positive/5">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-positive mb-2">
                  Ready to submit
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  {form.site_name && <span>📍 {form.site_name}</span>}
                  {form.volume_estimate && <span>📦 {form.volume_estimate}</span>}
                  {form.weight_estimate_kg && (
                    <span>⚖️ ~{form.weight_estimate_kg} kg estimated</span>
                  )}
                  {form.weather && <span>🌤 {form.weather}</span>}
                  {form.tides && <span>🌊 Tide: {form.tides}</span>}
                </div>
              </div>
            )}
          </div>
        )}
        </div>

        {/* ── Navigation ── */}
        <div className="flex items-center justify-between pt-5 mt-auto border-t border-border/40">
          <button
            type="button"
            onClick={step === 0 ? onCancel : () => setStep((s) => s - 1)}
            className="btn-ghost flex items-center gap-2 text-sm"
          >
            <ChevronLeft size={15} />
            {step === 0 ? (readOnly ? 'Close' : 'Cancel') : 'Back'}
          </button>

          {step < 2 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              Next
              <ChevronRight size={15} />
            </button>
          ) : readOnly ? (
            <button
              type="button"
              onClick={onCancel}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              Close
            </button>
          ) : (
            <button
              id="btn-submit-citizen"
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              {submitting ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Check size={15} />
              )}
              {submitting ? 'Submitting…' : 'Submit Report'}
            </button>
          )}
        </div>
      </div>
    );
  });

CitizenReportForm.displayName = 'CitizenReportForm';
export default CitizenReportForm;
