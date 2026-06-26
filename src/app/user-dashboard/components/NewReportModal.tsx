'use client';
import React, { useEffect, useState, useRef } from 'react';
import { X, FlaskConical, Users, Loader2 } from 'lucide-react';
import CitizenReportForm, { FormRef } from './CitizenReportForm';
import ExpertScientificForm from './ExpertScientificForm';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface NewReportModalProps {
  user: SupabaseUser;
  draft?: any;
  onClose: () => void;
  onSuccess: () => void;
}

function isExpertRole(role?: string): boolean {
  return role === 'analyst' || role === 'admin';
}

export default function NewReportModal({ user, draft, onClose, onSuccess }: NewReportModalProps) {
  const role = user.user_metadata?.role as string | undefined;
  const isReadOnly = draft && draft.status !== 'draft';
  const isCitizenDraft = draft && ('volume_estimate' in draft || 'has_plastic' in draft);
  const isExpert = isCitizenDraft ? false : isExpertRole(role);

  const formRef = useRef<FormRef>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [draftSaving, setDraftSaving] = useState(false);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleCloseAttempt = () => {
    if (formRef.current?.isDirty()) {
      setShowConfirm(true);
    } else {
      onClose();
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!showConfirm) {
          handleCloseAttempt();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, showConfirm]);

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  const handleSaveDraft = async () => {
    if (!formRef.current) return;
    setDraftSaving(true);
    try {
      await formRef.current.saveDraft();
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setDraftSaving(false);
      setShowConfirm(false);
    }
  };

  const handleDiscard = () => {
    setShowConfirm(false);
    onClose();
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="New Report"
    >
      {/* Blur overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleCloseAttempt}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="relative w-full sm:max-w-lg glass-card-elevated border border-border rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[85vh] z-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border/50 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${isExpert
                  ? 'bg-accent/15 text-accent border border-accent/30'
                  : 'bg-primary/15 text-primary border border-primary/30'
                }`}
            >
              {isExpert ? <FlaskConical size={18} /> : <Users size={18} />}
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {isExpert ? 'Expert / Scientific' : 'Citizen Report'}
              </p>
              <h2 className="text-base font-bold text-foreground leading-tight">
                {isReadOnly 
                  ? (isExpert ? 'Scientific Observation Details' : 'Citizen Report Details') 
                  : (isExpert ? 'New Scientific Observation' : 'Report a Waste Site')}
              </h2>
            </div>
          </div>
          <button
            id="btn-close-modal"
            onClick={handleCloseAttempt}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form body — scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-ocean px-5 py-5">
          {isExpert ? (
            <ExpertScientificForm
              ref={formRef}
              userId={user.id}
              draft={draft}
              readOnly={isReadOnly}
              onSuccess={handleSuccess}
              onCancel={handleCloseAttempt}
            />
          ) : (
            <CitizenReportForm
              ref={formRef}
              userId={user.id}
              draft={draft}
              readOnly={isReadOnly}
              onSuccess={handleSuccess}
              onCancel={handleCloseAttempt}
            />
          )}
        </div>
      </div>

      {/* Confirmation Dialog Overlay */}
      {showConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm glass-card-elevated border border-border/80 rounded-2xl p-6 shadow-2xl animate-in scale-in duration-200 flex flex-col text-center">
            <h3 className="text-lg font-bold text-foreground mb-2">Unsaved Changes</h3>
            <p className="text-sm text-muted-foreground mb-6">
              You have unsaved changes in your report. Would you like to save this as a draft or discard it?
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={draftSaving}
                className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2"
              >
                {draftSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                Save as Draft
              </button>
              <button
                type="button"
                onClick={handleDiscard}
                disabled={draftSaving}
                className="w-full py-2.5 text-sm font-medium border border-danger/20 hover:border-danger/40 hover:bg-danger/5 text-danger rounded-lg transition-all"
              >
                Discard &amp; Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={draftSaving}
                className="w-full py-2.5 text-sm font-medium hover:bg-muted/40 rounded-lg text-muted-foreground hover:text-foreground transition-all"
              >
                Keep Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
