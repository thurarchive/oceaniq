'use client';
import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { supabase } from '@/lib/supabase';
import { Loader2, Calendar, Target, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Sprint {
  id: string;
  name: string;
  goal: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
}

export default function AdminSprintsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    goal: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'Planned',
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

      const { data, error } = await supabase
        .from('sprints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to load sprints');
      } else {
        setSprints(data || []);
      }
      setLoading(false);
    }
    init();
  }, [router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.start_date && form.end_date && new Date(form.end_date) < new Date(form.start_date)) {
      toast.error('End date cannot precede start date');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('sprints')
      .insert([{
        name: form.name,
        goal: form.goal,
        description: form.description || null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        status: form.status,
      }])
      .select()
      .single();

    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else if (data) {
      toast.success('Sprint created');
      setSprints([data, ...sprints]);
      setIsModalOpen(false);
      setForm({ name: '', goal: '', description: '', start_date: '', end_date: '', status: 'Planned' });
    }
  };

  if (!isAdmin && !loading) return null;

  return (
    <AppLayout currentPath="/admin/feedback/sprints">
      <div className="max-w-screen-lg mx-auto px-4 lg:px-8 py-8 wave-bg min-h-screen">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Calendar size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Sprints</h1>
              <p className="text-xs text-muted-foreground">Manage feedback resolution sprints</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/feedback" className="btn-outline text-xs">Back to Feedback</Link>
            <button onClick={() => setIsModalOpen(true)} className="btn-primary text-xs">New Sprint</button>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="glass-card-elevated border border-border/50 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h2 className="text-lg font-bold mb-4">Create New Sprint</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Name <span className="text-danger">*</span></label>
                  <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Goal <span className="text-danger">*</span></label>
                  <input required type="text" value={form.goal} onChange={e => setForm({...form, goal: e.target.value})} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Start Date</label>
                    <input type="date" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">End Date</label>
                    <input type="date" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none">
                    <option value="Planned">Planned</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-outline text-sm">Cancel</button>
                  <button type="submit" disabled={loading} className="btn-primary text-sm">Save Sprint</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading && !sprints.length ? (
            <div className="col-span-full flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>
          ) : !sprints.length ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">No sprints found.</div>
          ) : (
            sprints.map(sprint => (
              <div key={sprint.id} className="glass-card border border-border/50 rounded-xl p-5 hover:border-border transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-foreground text-lg">{sprint.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${sprint.status === 'Active' ? 'bg-positive/10 text-positive border border-positive/20' : 'bg-muted/40 text-muted-foreground border border-border'}`}>
                    {sprint.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <Target size={12} className="text-accent" />
                  <span className="truncate">{sprint.goal}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4 pt-4 border-t border-border/30">
                  <span className="flex items-center gap-1"><Calendar size={12}/> {sprint.start_date || 'TBD'} - {sprint.end_date || 'TBD'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
