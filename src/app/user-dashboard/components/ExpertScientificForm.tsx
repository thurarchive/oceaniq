'use client';
import React, { useState, useImperativeHandle, forwardRef, useRef, useEffect } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Check,
  Loader2,
  Plus,
  Minus,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import { insertObservation, updateObservation } from '@/lib/waste-observations';
import { DetailedCompositionItem, WeatherCondition, TideCondition } from '@/types/waste-observations';
import LocationPickerMap from '@/app/contribute/components/LocationPickerMap';
import LocationSearchInput from '@/app/contribute/components/LocationSearchInput';
import SiteNameInput from '@/app/contribute/components/SiteNameInput';
import { FormRef } from './CitizenReportForm';

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const WEATHER_OPTIONS: WeatherCondition[] = ['Clear', 'Rain', 'Overcast'];
const TIDE_OPTIONS: TideCondition[] = ['High', 'Low', 'Ebb', 'Flood'];

const ACCORDION_SECTIONS: { category: string; items: string[] }[] = [
  {
    category: 'Plastics',
    items: ['Cigarette Butts', 'Food Wrappers', 'Plastic Bottles', 'Takeout Containers'],
  },
  {
    category: 'Fishing Gear',
    items: ['Nets', 'Buoys/Traps', 'Rope (m)'],
  },
  {
    category: 'Micro/Tiny',
    items: ['Foam Pieces < 2.5cm', 'Plastic Pieces < 2.5cm'],
  },
];

// ─────────────────────────────────────────────
// Step indicator (shared)
// ─────────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: total }).map((_, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={i}>
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${done
                ? 'bg-positive text-white'
                : active
                  ? 'bg-primary text-white ring-2 ring-primary/30'
                  : 'bg-muted/50 text-muted-foreground'
                }`}
            >
              {done ? <Check size={13} /> : i + 1}
            </div>
            {i < total - 1 && (
              <div
                className={`flex-1 h-0.5 rounded-full transition-all duration-500 ${done ? 'bg-positive' : 'bg-border'}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// Dynamic Accordion item counter
// ─────────────────────────────────────────────
function ItemCounter({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 px-1">
      <span className="text-sm text-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-6 h-6 rounded-md bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label={`Decrease ${label}`}
        >
          <Minus size={12} />
        </button>
        <span className="w-10 text-center text-sm font-mono-data font-semibold text-foreground">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="w-6 h-6 rounded-md bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label={`Increase ${label}`}
        >
          <Plus size={12} />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Accordion section
// ─────────────────────────────────────────────
function AccordionSection({
  category,
  items,
  counts,
  onCountChange,
}: {
  category: string;
  items: string[];
  counts: Record<string, number>;
  onCountChange: (item: string, count: number) => void;
}) {
  const [open, setOpen] = useState(true);
  const total = items.reduce((sum, it) => sum + (counts[it] ?? 0), 0);

  return (
    <div className="border border-border/40 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-card/40 hover:bg-card/70 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{category}</span>
          {total > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">
              {total} items
            </span>
          )}
        </div>
        <ChevronDown
          size={15}
          className={`text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="divide-y divide-border/30 px-4">
          {items.map((item) => (
            <ItemCounter
              key={item}
              label={item}
              value={counts[item] ?? 0}
              onChange={(n) => onCountChange(item, n)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Form state
// ─────────────────────────────────────────────
interface ExpertFormState {
  // Step 1
  site_name: string;
  lat: string;
  lng: string;
  weather: WeatherCondition | '';
  tide: TideCondition | '';
  // Step 2
  transect_length_m: string;
  transect_area_m2: string;
  // Step 3
  total_weight_kg: string;
  total_items: string;
  composition_counts: Record<string, number>;
}

interface ExpertScientificFormProps {
  userId: string;
  draft?: any;
  onSuccess: () => void;
  onCancel: () => void;
  readOnly?: boolean;
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────
const ExpertScientificForm = forwardRef<FormRef, ExpertScientificFormProps>(
  ({ userId, draft, onSuccess, onCancel, readOnly = false }, ref) => {
    const [step, setStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Build initial composition counts from accordion sections
    const initialCounts: Record<string, number> = {};
    ACCORDION_SECTIONS.forEach((sec) =>
      sec.items.forEach((item) => {
        initialCounts[item] = 0;
      })
    );

    const [form, setForm] = useState<ExpertFormState>({
      site_name: draft ? (draft.site_name ?? '') : '',
      lat: draft ? String(draft.location_lat ?? '') : '',
      lng: draft ? String(draft.location_lng ?? '') : '',
      weather: draft ? (draft.weather_condition ?? '') : '',
      tide: draft ? (draft.tide_condition ?? '') : '',
      transect_length_m: draft ? String(draft.transect_length_m ?? '') : '',
      transect_area_m2: draft ? String(draft.transect_area_m2 ?? '') : '',
      total_weight_kg: draft ? String(draft.total_weight_kg ?? '') : '',
      total_items: draft ? String(draft.total_items ?? '') : '',
      composition_counts: draft?.detailed_composition
        ? (() => {
          const counts = { ...initialCounts };
          (draft.detailed_composition as DetailedCompositionItem[]).forEach((c) => {
            counts[c.item] = c.count;
          });
          return counts;
        })()
        : initialCounts,
    });

    const initialFormRef = useRef<ExpertFormState | null>(null);

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
        form.tide !== initialFormRef.current.tide ||
        form.transect_length_m !== initialFormRef.current.transect_length_m ||
        form.transect_area_m2 !== initialFormRef.current.transect_area_m2 ||
        form.total_weight_kg !== initialFormRef.current.total_weight_kg ||
        form.total_items !== initialFormRef.current.total_items;

      const compChanged = Object.keys(form.composition_counts).some(
        (key) =>
          form.composition_counts[key] !==
          initialFormRef.current!.composition_counts[key]
      );

      return baseChanged || compChanged;
    };

    const saveDraft = async () => {
      setSubmitting(true);
      try {
        const payload = {
          user_id: userId,
          status: 'draft' as const,
          submission_type: 'expert' as const,
          location_lat: form.lat ? parseFloat(form.lat) : null,
          location_lng: form.lng ? parseFloat(form.lng) : null,
          site_name: form.site_name || null,
          weather_condition: form.weather || null,
          tide_condition: form.tide || null,
          transect_length_m: form.transect_length_m ? parseFloat(form.transect_length_m) : null,
          transect_area_m2: form.transect_area_m2 ? parseFloat(form.transect_area_m2) : null,
          total_weight_kg: form.total_weight_kg ? parseFloat(form.total_weight_kg) : null,
          total_items: form.total_items ? parseInt(form.total_items, 10) : null,
          detailed_composition: buildComposition(),
          // Citizen-only fields
          volume_estimate: null,
          primary_composition: null,
          notes: null,
          photo_url: null,
        };

        if (draft?.id) {
          await updateObservation(draft.id, payload);
        } else {
          await insertObservation(payload);
        }

        toast.success('Scientific observation saved as draft.');
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

    const handleCountChange = (item: string, count: number) => {
      setForm((f) => ({
        ...f,
        composition_counts: { ...f.composition_counts, [item]: count },
      }));
    };

    const handleLocationSelect = (latNum: number, lngNum: number) => {
      setForm((f) => ({ ...f, lat: String(latNum), lng: String(lngNum) }));
      setErrors((e) => ({ ...e, coords: '' }));
    };

    const handleSearchLocationSelect = ({ lat, lng, placeName }: { lat: number; lng: number; placeName: string }) => {
      setForm((f) => ({
        ...f,
        lat: String(lat),
        lng: String(lng),
        site_name: f.site_name ? f.site_name : placeName,
      }));
      setErrors((e) => ({ ...e, coords: '', site_name: '' }));
    };

    const [attemptedNext, setAttemptedNext] = useState(false);

    // Dynamic missing fields calculator for current step
    const getMissingFields = () => {
      const missing: { key: string; label: string; desc: string }[] = [];
      if (step === 0) {
        if (!form.lat || !form.lng) {
          missing.push({ key: 'coords', label: 'Interactive Location Pin', desc: 'Tap on map or use GPS search' });
        }
        if (!form.weather) {
          missing.push({ key: 'weather', label: 'Weather Condition', desc: 'Select weather condition' });
        }
      } else if (step === 1) {
        if (!form.transect_length_m) {
          missing.push({ key: 'transect_length', label: 'Distance Surveyed (meters)', desc: 'Enter survey distance in meters' });
        }
        if (!form.transect_area_m2) {
          missing.push({ key: 'transect_area', label: 'Total Area Coverage (m²)', desc: 'Enter survey area in m²' });
        }
      } else if (step === 2) {
        if (!form.total_weight_kg) {
          missing.push({ key: 'weight', label: 'Total Weight (kg)', desc: 'Enter total weight in kg' });
        }
        if (!form.total_items) {
          missing.push({ key: 'items', label: 'Total Items Count', desc: 'Enter total items count' });
        }
      }
      return missing;
    };

    const missingFields = getMissingFields();

    // ── Validation ──
    const validateStep = (): boolean => {
      setAttemptedNext(true);
      const activeMissing = getMissingFields();
      const newErrors: Record<string, string> = {};
      activeMissing.forEach((m) => {
        newErrors[m.key] = m.desc;
      });
      setErrors(newErrors);

      if (activeMissing.length > 0) {
        toast.error('Required fields missing. Please complete all highlighted fields on this step.');
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

    // ── Build detailed_composition array from counts ──
    const buildComposition = (): DetailedCompositionItem[] => {
      const result: DetailedCompositionItem[] = [];
      ACCORDION_SECTIONS.forEach((sec) => {
        sec.items.forEach((item) => {
          const count = form.composition_counts[item] ?? 0;
          if (count > 0) {
            result.push({ category: sec.category, item, count });
          }
        });
      });
      return result;
    };

    // ── Submit ──
    const handleSubmit = async () => {
      if (!validateStep()) return;
      setSubmitting(true);
      try {
        const payload = {
          user_id: userId,
          status: 'published' as const,
          submission_type: 'expert' as const,
          location_lat: form.lat ? parseFloat(form.lat) : null,
          location_lng: form.lng ? parseFloat(form.lng) : null,
          site_name: form.site_name || null,
          weather_condition: form.weather || null,
          tide_condition: form.tide || null,
          transect_length_m: form.transect_length_m ? parseFloat(form.transect_length_m) : null,
          transect_area_m2: form.transect_area_m2 ? parseFloat(form.transect_area_m2) : null,
          total_weight_kg: form.total_weight_kg ? parseFloat(form.total_weight_kg) : null,
          total_items: form.total_items ? parseInt(form.total_items, 10) : null,
          detailed_composition: buildComposition(),
          // Citizen-only fields
          volume_estimate: null,
          primary_composition: null,
          notes: null,
          photo_url: null,
        };

        if (draft?.id) {
          await updateObservation(draft.id, payload);
        } else {
          await insertObservation(payload);
        }

        toast.success('Scientific observation published successfully.');
        onSuccess();
      } catch (err: any) {
        console.error(err);
        toast.error(err?.message || 'Failed to publish observation. Please try again.');
      } finally {
        setSubmitting(false);
      }
    };

    // ─────────────────────────────────────────────
    return (
      <div className="flex flex-col h-full">
        <StepIndicator current={step} total={3} />

        <div className="flex-1 flex flex-col" style={readOnly ? { pointerEvents: 'none' } : undefined}>
          {/* ── Step 1: Environmental Metadata ── */}
          {step === 0 && (
            <div className="flex flex-col gap-4 flex-1">
              <div>
                <h3 className="text-base font-semibold text-foreground mb-0.5">
                  Environmental Metadata &amp; Location
                </h3>
                <p className="text-xs text-muted-foreground">
                  Search an area or drop a pin on the map to record survey site conditions.
                </p>
              </div>

              {/* Location Search Bar */}
              <div>
                <label className="auth-label mb-1.5 flex items-center justify-between">
                  <span>Search Location / Area</span>
                  <span className="text-[11px] text-muted-foreground font-normal">Geocoded search &amp; map sync</span>
                </label>
                <LocationSearchInput
                  onSelectLocation={handleSearchLocationSelect}
                  placeholder="Search location, city, island, or beach name…"
                />
              </div>

              {/* Interactive Location Map Pin */}
              <div>
                <label className="auth-label mb-1.5 flex items-center justify-between">
                  <span>
                    Interactive Location Pin <span className="text-danger font-bold">*</span>
                  </span>
                  {errors.coords && <span className="text-xs text-danger font-semibold">{errors.coords}</span>}
                </label>
                <LocationPickerMap
                  lat={form.lat ? parseFloat(form.lat) : null}
                  lng={form.lng ? parseFloat(form.lng) : null}
                  onLocationSelect={handleLocationSelect}
                />
              </div>

              {/* Site name */}
              <div className="auth-input-group">
                <label className="auth-label" htmlFor="field-site-name">
                  Site Name <span className="normal-case font-normal text-muted-foreground">(optional)</span>
                </label>
                <SiteNameInput
                  value={form.site_name}
                  onChange={(val) => setForm((f) => ({ ...f, site_name: val }))}
                  placeholder="e.g., Ancol Beach North Transect A"
                />
              </div>

              {/* Coordinates */}
              <div>
                <label className="auth-label mb-1.5 block">Coordinates (Decimal Degrees)</label>
                <div className="flex gap-2">
                  <input
                    id="field-exp-lat"
                    type="number"
                    step="any"
                    placeholder="Latitude"
                    value={form.lat}
                    onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
                    className="auth-input flex-1 text-xs"
                    aria-label="Latitude"
                  />
                  <input
                    id="field-exp-lng"
                    type="number"
                    step="any"
                    placeholder="Longitude"
                    value={form.lng}
                    onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
                    className="auth-input flex-1 text-xs"
                    aria-label="Longitude"
                  />
                </div>
              </div>

              {/* Weather */}
              <div>
                <label className="auth-label">Weather Condition</label>
                {errors.weather && (
                  <p className="text-xs text-danger mb-1">{errors.weather}</p>
                )}
                <div className="flex gap-2">
                  {WEATHER_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      id={`weather-${opt}`}
                      onClick={() => setForm((f) => ({ ...f, weather: opt }))}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all duration-150 ${form.weather === opt
                        ? 'bg-primary/15 border-primary/50 text-primary'
                        : 'border-border/50 text-muted-foreground hover:text-foreground bg-card/20'
                        }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tide */}
              <div>
                <label className="auth-label">Tide Condition</label>
                {errors.tide && (
                  <p className="text-xs text-danger mb-1">{errors.tide}</p>
                )}
                <div className="grid grid-cols-4 gap-2">
                  {TIDE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      id={`tide-${opt}`}
                      onClick={() => setForm((f) => ({ ...f, tide: opt }))}
                      className={`py-2 rounded-xl text-sm font-medium border transition-all duration-150 ${form.tide === opt
                        ? 'bg-accent/15 border-accent/50 text-accent'
                        : 'border-border/50 text-muted-foreground hover:text-foreground bg-card/20'
                        }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

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
            </div>
          )}

          {/* ── Step 2: Methodology (Transect) ── */}
          {step === 1 && (
            <div className="flex flex-col gap-5 flex-1">
              <div>
                <h3 className="text-base font-semibold text-foreground mb-0.5">
                  Methodology — Transect
                </h3>
                <p className="text-xs text-muted-foreground">
                  Enter the survey dimensions used during this observation.
                </p>
              </div>

              {/* Visual info card */}
              <div className="glass-card-elevated border border-accent/20 rounded-xl p-4 bg-accent/5">
                <p className="text-xs text-accent font-semibold uppercase tracking-wider mb-1">
                  UoP Standard
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Follow the University of Portsmouth transect protocol. Standard transects are
                  100m × 5m (500m²) for beach surveys. Adjust based on site conditions.
                </p>
              </div>

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
            </div>
          )}

          {/* ── Step 3: Granular Composition ── */}
          {step === 2 && (
            <div className="flex flex-col gap-4 flex-1 overflow-y-auto scrollbar-ocean">
              <div>
                <h3 className="text-base font-semibold text-foreground mb-0.5">
                  Granular Composition — UoP Standard
                </h3>
                <p className="text-xs text-muted-foreground">
                  Record item counts per category, plus total weight and item count.
                </p>
              </div>

              {/* Dynamic Accordion sections */}
              <div className="flex flex-col gap-3">
                {ACCORDION_SECTIONS.map((sec) => (
                  <AccordionSection
                    key={sec.category}
                    category={sec.category}
                    items={sec.items}
                    counts={form.composition_counts}
                    onCountChange={handleCountChange}
                  />
                ))}
              </div>

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
            </div>
          )}
        </div>

        {/* ── Nav buttons ── */}
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
              id="btn-submit-expert"
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
              {submitting ? 'Publishing…' : 'Publish Observation'}
            </button>
          )}
        </div>
      </div>
    );
  });

ExpertScientificForm.displayName = 'ExpertScientificForm';
export default ExpertScientificForm;
