'use client';
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';
import { Loader2, ArrowLeft, Send, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const ISSUE_TYPES = [
  'Bug or technical error',
  'Data or map accuracy issue',
  'Marine-debris observation issue',
  'Photo or upload issue',
  'Account, sign-in, or access issue',
  'Dashboard, analytics, or reporting issue',
  'User interface or accessibility issue',
  'Performance issue',
  'Privacy or security concern',
  'Documentation or FAQ issue',
  'Open-data license or attribution question',
  'Feature request',
  'Other',
];

const ISSUE_HELPERS: Record<string, string> = {
  'Bug or technical error': 'Tell us what you were doing, what you expected to happen, and what happened instead.',
  'Data or map accuracy issue': 'Include the relevant location, observation reference, date, and why the information may be inaccurate.',
  'Marine-debris observation issue': 'Include the observation reference if available and explain what needs to be corrected.',
  'Photo or upload issue': 'Describe the upload problem. Do not include private or identifying information that is not necessary.',
  'Account, sign-in, or access issue': 'Do not include your password, verification code, recovery code, access token, or other login secrets.',
  'Dashboard, analytics, or reporting issue': 'Tell us which dashboard, chart, filter, metric, or report is affected.',
  'User interface or accessibility issue': 'Describe the page, device, browser, keyboard, screen-reader, contrast, layout, or interaction problem.',
  'Performance issue': 'Tell us which page is slow or unresponsive, what device/browser you used, and when it happened.',
  'Privacy or security concern': 'Do not include passwords, API keys, authentication tokens, financial information, government IDs, or unnecessary sensitive personal data. For urgent security concerns, contact the project owner directly.',
  'Documentation or FAQ issue': 'Tell us which guide, FAQ, or instruction is inaccurate, unclear, or missing.',
  'Open-data license or attribution question': 'Tell us which dataset, reuse situation, attribution, or licensing detail you need help with.',
  'Feature request': 'Describe the problem you are trying to solve and how the requested feature would help.',
  'Other': 'Provide enough detail for the Oceaniq team to understand and categorize the issue.',
};

const AFFECTED_AREAS = [
  'Authentication and accounts',
  'User roles and permissions',
  'Observation submission',
  'Marine-debris data',
  'Interactive map and geospatial data',
  'Dashboard and analytics',
  'Dataset downloads or open data',
  'File uploads and media',
  'Leaderboards, badges, or contributor features',
  'Documentation or FAQ',
  'Performance or infrastructure',
  'Other',
];

export default function ReportProblemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    issue_type: '',
    description: '',
    affected_area: '',
    related_url: '',
    observation_id: '',
    map_location_description: '',
    steps_to_reproduce: '',
    expected_behavior: '',
    actual_behavior: '',
    contact_name: '',
    contact_email: '',
    contact_permission: false,
    captchaResponse: '', // TODO: implement real CAPTCHA
  });

  const [checklist, setChecklist] = useState({
    steps: false,
    expected: false,
    observation: false,
    map: false,
    screenshot: false,
    url: false,
    contact: false,
    safety: false,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserId(session.user.id);
      }
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleChecklistChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setChecklist((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checklist.safety) {
      toast.error('Confirm that you have removed passwords, access tokens, and unnecessary sensitive information before submitting.');
      return;
    }

    if ((form.contact_email || form.contact_name) && !form.contact_permission) {
      toast.error('You must agree to allow us to contact you if you provide contact details.');
      return;
    }

    // TODO: Verify captchaResponse here before inserting to avoid spam.

    setLoading(true);
    try {
      const refCode = 'OCN-' + new Date().getFullYear() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();

      const payload = {
        public_reference_code: refCode,
        title: form.title,
        issue_type: form.issue_type,
        description: form.description,
        affected_area: form.affected_area || null,
        related_url: form.related_url || null,
        observation_id: form.observation_id || null,
        map_location_description: form.map_location_description || null,
        steps_to_reproduce: form.steps_to_reproduce || null,
        expected_behavior: form.expected_behavior || null,
        actual_behavior: form.actual_behavior || null,
        reporter_user_id: userId,
        contact_name: form.contact_name || null,
        contact_email: form.contact_email || null,
        contact_permission: form.contact_permission,
        information_checklist: checklist,
      };

      const { error } = await supabase.from('issue_reports').insert(payload);
      if (error) throw error;

      setSubmittedCode(refCode);
      toast.success('Report submitted successfully.');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to submit report.');
    } finally {
      setLoading(false);
    }
  };

  const getMailtoHref = () => {
    const subject = `Oceaniq: ${form.issue_type || 'Feedback'}`;
    const body = `Hello Oceaniq Team,

Issue type: ${form.issue_type || 'Feedback'}
Title: ${form.title}
Description: ${form.description}
Related page/URL: ${form.related_url}
Observation reference: ${form.observation_id}
Location/map area: ${form.map_location_description}
Steps to reproduce: ${form.steps_to_reproduce}
Expected behavior: ${form.expected_behavior}
Actual behavior: ${form.actual_behavior}
Contact name: ${form.contact_name}
Contact email: ${form.contact_email}

Please do not include passwords, API keys, authentication tokens, financial information, identity documents, or unnecessary sensitive personal information.`;
    return `mailto:frstudyacc@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <AppLayout currentPath="/report-a-problem">
      <div className="min-h-screen wave-bg py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Link>
          </div>

          <div className="glass-card-elevated border border-border/40 rounded-2xl p-6 sm:p-8">
            {submittedCode ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-positive/10 border border-positive/20 text-positive rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={24} />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-3">Thank you for your report</h1>
                <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                  Your report has been received. Reference: <strong>{submittedCode}</strong>. The Oceaniq team will review it. Please keep this reference if you contact us about the report.
                </p>
                {(form.contact_email || form.contact_name) && (
                  <p className="text-xs text-muted-foreground mb-6">
                    If follow-up is needed, the team may use the contact details you provided.
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={() => setSubmittedCode(null)} className="btn-outline text-sm">
                    Submit Another
                  </button>
                  {userId && (
                    <Link href="/my-reports" className="btn-primary text-sm">
                      View My Reports
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">Report a Problem</h1>
                <p className="text-sm text-muted-foreground mb-6">
                  Help improve Oceaniq by reporting incorrect information, broken features, accessibility barriers, or other issues. Your report will be reviewed by the Oceaniq team.
                </p>

                <div className="bg-danger/10 border border-danger/20 rounded-lg p-4 mb-6">
                  <p className="text-xs text-danger font-medium m-0">
                    <strong>Privacy Notice:</strong> Please do not include passwords, API keys, access tokens, government identification numbers, financial information, or unnecessary personal information. For safety and privacy concerns, share only the information needed to explain the problem.
                    <br /><br />
                    This form is not monitored for emergencies and should not be used for urgent safety, navigation, enforcement, or emergency-response matters.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Required fields */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-semibold text-foreground mb-1">Short title <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        minLength={5}
                        maxLength={100}
                        placeholder="For example: Map marker is in the wrong location"
                        className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="issue_type" className="block text-sm font-semibold text-foreground mb-1">Issue type <span className="text-danger">*</span></label>
                      <select
                        id="issue_type"
                        name="issue_type"
                        value={form.issue_type}
                        onChange={handleChange}
                        required
                        className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none"
                      >
                        <option value="" disabled>Select an issue type</option>
                        {ISSUE_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {form.issue_type && ISSUE_HELPERS[form.issue_type] && (
                        <p className="mt-1 text-xs text-primary">{ISSUE_HELPERS[form.issue_type]}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-semibold text-foreground mb-1">Describe the problem <span className="text-danger">*</span></label>
                      <textarea
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                        rows={4}
                        placeholder="Describe what happened, where it happened, and relevant context..."
                        className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none resize-y"
                      ></textarea>
                    </div>
                  </div>

                  <hr className="border-border/40" />

                  {/* Optional details */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-foreground">Optional details</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="affected_area" className="block text-xs font-medium text-muted-foreground mb-1">Affected area</label>
                        <select
                          id="affected_area"
                          name="affected_area"
                          value={form.affected_area}
                          onChange={handleChange}
                          className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none"
                        >
                          <option value="">Select affected area (optional)</option>
                          {AFFECTED_AREAS.map(area => (
                            <option key={area} value={area}>{area}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="related_url" className="block text-xs font-medium text-muted-foreground mb-1">Related page or URL</label>
                        <input
                          type="url"
                          id="related_url"
                          name="related_url"
                          value={form.related_url}
                          onChange={handleChange}
                          placeholder="For example: the page where the issue occurred."
                          className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="observation_id" className="block text-xs font-medium text-muted-foreground mb-1">Observation reference</label>
                        <input
                          type="text"
                          id="observation_id"
                          name="observation_id"
                          value={form.observation_id}
                          onChange={handleChange}
                          placeholder="ID or reference if available"
                          className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label htmlFor="map_location_description" className="block text-xs font-medium text-muted-foreground mb-1">Location or map area</label>
                        <input
                          type="text"
                          id="map_location_description"
                          name="map_location_description"
                          value={form.map_location_description}
                          onChange={handleChange}
                          placeholder="Avoid sharing sensitive locations unless necessary"
                          className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none"
                        />
                      </div>
                    </div>

                    {form.issue_type && [
                      'Bug or technical error',
                      'Performance issue',
                      'User interface or accessibility issue',
                      'Data or map accuracy issue'
                    ].includes(form.issue_type) && (
                        <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border/40">
                          <p className="text-xs font-semibold text-foreground">Reproduction details (Optional)</p>
                          <div>
                            <label htmlFor="steps_to_reproduce" className="block text-xs font-medium text-muted-foreground mb-1">Steps to reproduce</label>
                            <textarea
                              id="steps_to_reproduce"
                              name="steps_to_reproduce"
                              value={form.steps_to_reproduce}
                              onChange={handleChange}
                              rows={2}
                              className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none resize-y"
                            ></textarea>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="expected_behavior" className="block text-xs font-medium text-muted-foreground mb-1">Expected behavior</label>
                              <input
                                type="text"
                                id="expected_behavior"
                                name="expected_behavior"
                                value={form.expected_behavior}
                                onChange={handleChange}
                                className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label htmlFor="actual_behavior" className="block text-xs font-medium text-muted-foreground mb-1">Actual behavior</label>
                              <input
                                type="text"
                                id="actual_behavior"
                                name="actual_behavior"
                                value={form.actual_behavior}
                                onChange={handleChange}
                                className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                  </div>

                  <hr className="border-border/40" />

                  {/* Checklist */}
                  <fieldset className="space-y-3">
                    <legend className="text-sm font-semibold text-foreground mb-2">Information included in this report</legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                        <input type="checkbox" name="steps" checked={checklist.steps} onChange={handleChecklistChange} className="rounded border-border bg-background text-primary focus:ring-primary" /> Steps to reproduce
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                        <input type="checkbox" name="expected" checked={checklist.expected} onChange={handleChecklistChange} className="rounded border-border bg-background text-primary focus:ring-primary" /> Expected and actual behavior
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                        <input type="checkbox" name="observation" checked={checklist.observation} onChange={handleChecklistChange} className="rounded border-border bg-background text-primary focus:ring-primary" /> Relevant observation reference
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                        <input type="checkbox" name="map" checked={checklist.map} onChange={handleChecklistChange} className="rounded border-border bg-background text-primary focus:ring-primary" /> Map location or coordinates
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                        <input type="checkbox" name="screenshot" checked={checklist.screenshot} onChange={handleChecklistChange} className="rounded border-border bg-background text-primary focus:ring-primary" /> Screenshot or evidence link
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                        <input type="checkbox" name="url" checked={checklist.url} onChange={handleChecklistChange} className="rounded border-border bg-background text-primary focus:ring-primary" /> Related page or URL
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                        <input type="checkbox" name="contact" checked={checklist.contact} onChange={handleChecklistChange} className="rounded border-border bg-background text-primary focus:ring-primary" /> Contact details
                      </label>
                    </div>

                    <div className="mt-4 p-3 bg-danger/5 border border-danger/20 rounded-lg">
                      <label className="flex items-start gap-2 cursor-pointer text-danger font-medium text-sm">
                        <input type="checkbox" name="safety" required checked={checklist.safety} onChange={handleChecklistChange} className="mt-1 rounded border-danger bg-background text-danger focus:ring-danger" />
                        <span>I have removed passwords, API keys, access tokens, and unnecessary sensitive personal data. <span className="text-danger">*</span></span>
                      </label>
                    </div>
                  </fieldset>

                  <hr className="border-border/40" />

                  {/* Contact details */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-foreground">Contact details (optional)</h3>
                    <p className="text-xs text-muted-foreground">Leave contact details only if you would like the Oceaniq team to contact you about this report.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact_name" className="block text-xs font-medium text-muted-foreground mb-1">Name</label>
                        <input
                          type="text"
                          id="contact_name"
                          name="contact_name"
                          value={form.contact_name}
                          onChange={handleChange}
                          className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact_email" className="block text-xs font-medium text-muted-foreground mb-1">Email address</label>
                        <input
                          type="email"
                          id="contact_email"
                          name="contact_email"
                          value={form.contact_email}
                          onChange={handleChange}
                          className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none"
                        />
                      </div>
                    </div>
                    {(form.contact_email || form.contact_name) && (
                      <label className="flex items-start gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors text-sm">
                        <input type="checkbox" name="contact_permission" checked={form.contact_permission} onChange={handleChange} required className="mt-1 rounded border-border bg-background text-primary focus:ring-primary" />
                        <span>I agree that Oceaniq may use these details to follow up about this report.</span>
                      </label>
                    )}
                  </div>

                  {!userId && (
                    <div className="mt-4 p-4 border border-border/50 bg-background/30 rounded-lg">
                      <label htmlFor="captchaResponse" className="block text-xs font-medium text-foreground mb-2">Are you human? (Enter "1234" to pass anti-spam) <span className="text-danger">*</span></label>
                      <input type="text" id="captchaResponse" name="captchaResponse" required={!userId} value={form.captchaResponse} onChange={handleChange} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none max-w-xs" />
                      {/* TODO: In production, integrate real CAPTCHA here. */}
                    </div>
                  )}

                  <div className="pt-4 flex justify-end">
                    <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
                      {loading ? <Loader2 size={16} className="animate-spin mr-2 inline" /> : null}
                      {loading ? 'Sending...' : 'Send report'}
                    </button>
                  </div>
                </form>

                <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground flex items-center gap-2"><Mail size={16} className="text-muted-foreground" /> Prefer email?</h4>
                    <p className="text-xs text-muted-foreground mt-1">If you cannot use this form or would rather contact the project owner directly, you can email Oceaniq.</p>
                  </div>
                  <a href={getMailtoHref()} className="btn-outline text-xs whitespace-nowrap">
                    Email frstudyacc@gmail.com
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
