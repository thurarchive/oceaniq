'use client';
import React, { useEffect, useState, use } from 'react';
import AppLayout from '@/components/AppLayout';
import { supabase } from '@/lib/supabase';
import { Loader2, ArrowLeft, Save, User, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface IssueReport {
  id: string;
  public_reference_code: string;
  title: string;
  issue_type: string;
  description: string;
  affected_area: string | null;
  related_url: string | null;
  observation_id: string | null;
  map_location_description: string | null;
  steps_to_reproduce: string | null;
  expected_behavior: string | null;
  actual_behavior: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_permission: boolean;
  priority: string;
  status: string;
  sprint_id: string | null;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
  triaged_at: string | null;
  resolved_at: string | null;
  closed_at: string | null;
  archived_at: string | null;
}

interface Sprint {
  id: string;
  name: string;
}

export default function AdminTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [report, setReport] = useState<IssueReport | null>(null);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const unwrappedParams = use(params);
  const ticketId = unwrappedParams.id;

  const [form, setForm] = useState({
    issue_type: '',
    priority: '',
    status: '',
    affected_area: '',
    sprint_id: '',
    internal_notes: '',
  });

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/auth');
        return;
      }
      const role = session.user.app_metadata?.role || session.user.user_metadata?.role;
      if (role !== 'admin') {
        router.replace('/');
        return;
      }
      setIsAdmin(true);

      // Load report
      const { data, error } = await supabase
        .from('issue_reports')
        .select('*')
        .eq('id', ticketId)
        .single();

      if (error || !data) {
        toast.error('Ticket not found');
        router.replace('/admin/feedback');
        return;
      }

      setReport(data);
      setForm({
        issue_type: data.issue_type,
        priority: data.priority,
        status: data.status,
        affected_area: data.affected_area || '',
        sprint_id: data.sprint_id || '',
        internal_notes: data.internal_notes || '',
      });

      // Load sprints
      const { data: sprintsData } = await supabase
        .from('sprints')
        .select('id, name')
        .order('created_at', { ascending: false });

      if (sprintsData) setSprints(sprintsData);

      setLoading(false);
    }
    init();
  }, [ticketId, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload: any = {
      issue_type: form.issue_type,
      priority: form.priority,
      status: form.status,
      affected_area: form.affected_area || null,
      sprint_id: form.sprint_id || null,
      internal_notes: form.internal_notes || null,
      updated_at: new Date().toISOString(),
    };

    // Auto-set timestamps based on status
    if (form.status === 'Resolved' && report?.status !== 'Resolved') payload.resolved_at = new Date().toISOString();
    if (form.status === 'Closed' && report?.status !== 'Closed') payload.closed_at = new Date().toISOString();
    if (form.status === 'Triaged' && report?.status === 'New') payload.triaged_at = new Date().toISOString();

    const { error } = await supabase
      .from('issue_reports')
      .update(payload)
      .eq('id', ticketId);

    setSaving(false);
    if (error) {
      toast.error('Failed to update ticket');
    } else {
      toast.success('Ticket updated');
      setReport({ ...report!, ...payload });
    }
  };

  if (!isAdmin && !loading) return null;

  return (
    <AppLayout currentPath={`/admin/feedback/${ticketId}`}>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-8 wave-bg min-h-screen">

        {/* Header */}
        <div className="mb-6">
          <Link href="/admin/feedback" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
            <ArrowLeft size={16} className="mr-2" /> Back to Queue
          </Link>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>
          ) : report ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Left Column - Details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-card border border-border/50 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-sm font-bold text-muted-foreground">{report.public_reference_code}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">{report.issue_type}</span>
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-4">{report.title}</h1>

                  <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground mb-6">
                    <p className="whitespace-pre-wrap">{report.description}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm border-t border-border/40 pt-4 mt-4">
                    {report.related_url && (
                      <div>
                        <span className="block text-xs font-semibold text-foreground mb-1">Related URL</span>
                        <a href={report.related_url} target="_blank" rel="noreferrer" className="text-primary hover:underline break-all">{report.related_url}</a>
                      </div>
                    )}
                    {report.observation_id && (
                      <div>
                        <span className="block text-xs font-semibold text-foreground mb-1">Observation Reference</span>
                        <span className="text-muted-foreground font-mono">{report.observation_id}</span>
                      </div>
                    )}
                    {report.map_location_description && (
                      <div className="col-span-full">
                        <span className="block text-xs font-semibold text-foreground mb-1">Location</span>
                        <span className="text-muted-foreground">{report.map_location_description}</span>
                      </div>
                    )}
                  </div>

                  {(report.steps_to_reproduce || report.expected_behavior || report.actual_behavior) && (
                    <div className="bg-muted/10 border border-border/40 rounded-lg p-4 mt-6 text-sm">
                      <h3 className="font-semibold text-foreground mb-2">Reproduction Details</h3>
                      {report.steps_to_reproduce && <div className="mb-2"><span className="font-medium text-xs text-muted-foreground block">Steps:</span> <span className="whitespace-pre-wrap">{report.steps_to_reproduce}</span></div>}
                      {report.expected_behavior && <div className="mb-2"><span className="font-medium text-xs text-muted-foreground block">Expected:</span> <span>{report.expected_behavior}</span></div>}
                      {report.actual_behavior && <div><span className="font-medium text-xs text-muted-foreground block">Actual:</span> <span>{report.actual_behavior}</span></div>}
                    </div>
                  )}
                </div>

                <div className="glass-card border border-border/50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><User size={18} /> Reporter Info</h3>
                  {report.contact_permission && (report.contact_email || report.contact_name) ? (
                    <div className="space-y-2 text-sm">
                      {report.contact_name && <p><span className="font-semibold text-muted-foreground w-20 inline-block">Name:</span> {report.contact_name}</p>}
                      {report.contact_email && <p><span className="font-semibold text-muted-foreground w-20 inline-block">Email:</span> <a href={`mailto:${report.contact_email}`} className="text-primary hover:underline">{report.contact_email}</a></p>}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No contact details provided or permission denied.</p>
                  )}
                </div>
              </div>

              {/* Right Column - Admin Controls */}
              <div className="space-y-6">
                <form onSubmit={handleSave} className="glass-card border border-primary/20 bg-primary/5 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-primary mb-4">Admin Controls</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Status</label>
                      <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none font-medium">
                        <option value="New">New</option>
                        <option value="Triaged">Triaged</option>
                        <option value="Planned">Planned</option>
                        <option value="In progress">In progress</option>
                        <option value="Blocked">Blocked</option>
                        <option value="Needs information">Needs information</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Duplicate">Duplicate</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1">Priority</label>
                      <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none font-medium">
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1">Issue Type</label>
                      <select value={form.issue_type} onChange={e => setForm({ ...form, issue_type: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none font-medium">
                        <option value="Bug or technical error">Bug or technical error</option>
                        <option value="Data or map accuracy issue">Data or map accuracy issue</option>
                        <option value="Marine-debris observation issue">Marine-debris observation issue</option>
                        <option value="Photo or upload issue">Photo or upload issue</option>
                        <option value="Feature request">Feature request</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1">Sprint Assignment</label>
                      <select value={form.sprint_id} onChange={e => setForm({ ...form, sprint_id: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none font-medium">
                        <option value="">No sprint assigned</option>
                        {sprints.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1">Internal Notes (Admin Only)</label>
                      <textarea rows={4} value={form.internal_notes} onChange={e => setForm({ ...form, internal_notes: e.target.value })} placeholder="Add private notes here..." className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none resize-y"></textarea>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-primary/10">
                    <button type="submit" disabled={saving} className="btn-primary w-full">
                      {saving ? <Loader2 size={16} className="animate-spin mr-2 inline" /> : <Save size={16} className="mr-2 inline" />}
                      Save Changes
                    </button>
                  </div>
                </form>

                <div className="glass-card border border-border/50 rounded-2xl p-6 text-xs text-muted-foreground space-y-2">
                  <p className="flex items-center gap-2"><Clock size={14} /> <strong>Created:</strong> {new Date(report.created_at).toLocaleString()}</p>
                  <p className="flex items-center gap-2"><Clock size={14} /> <strong>Updated:</strong> {new Date(report.updated_at).toLocaleString()}</p>
                  {report.triaged_at && <p className="flex items-center gap-2"><CheckCircle2 size={14} className="text-accent" /> <strong>Triaged:</strong> {new Date(report.triaged_at).toLocaleString()}</p>}
                  {report.resolved_at && <p className="flex items-center gap-2"><CheckCircle2 size={14} className="text-positive" /> <strong>Resolved:</strong> {new Date(report.resolved_at).toLocaleString()}</p>}
                </div>
              </div>

            </div>
          ) : null}
        </div>
      </div>
    </AppLayout>
  );
}
