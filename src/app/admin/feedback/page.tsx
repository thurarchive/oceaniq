'use client';
import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { supabase } from '@/lib/supabase';
import { Loader2, Search, Filter, MessageSquareWarning, Archive, Activity, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface IssueReport {
  id: string;
  public_reference_code: string;
  title: string;
  issue_type: string;
  priority: string;
  status: string;
  affected_area: string | null;
  created_at: string;
  updated_at: string;
}

function getPriorityBadge(priority: string) {
  switch (priority) {
    case 'Critical': return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-danger/10 text-danger border border-danger/20">Critical</span>;
    case 'High': return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20">High</span>;
    case 'Low': return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted/40 text-muted-foreground border border-border">Low</span>;
    default: return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">Medium</span>;
  }
}

function getStatusBadge(status: string) {
  if (['Resolved', 'Closed'].includes(status)) {
    return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-positive/10 text-positive border border-positive/20">{status}</span>;
  }
  if (['Blocked', 'Needs information'].includes(status)) {
    return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20">{status}</span>;
  }
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">{status}</span>;
}

export default function AdminFeedbackPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<IssueReport[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

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

      // Load reports
      const { data, error } = await supabase
        .from('issue_reports')
        .select('id, public_reference_code, title, issue_type, priority, status, affected_area, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to load reports');
        console.error(error);
      } else {
        setReports(data || []);
      }
      setLoading(false);
    }
    init();
  }, [router]);

  if (!isAdmin && !loading) return null;

  const filtered = reports.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.public_reference_code.toLowerCase().includes(search.toLowerCase()) || r.issue_type.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? r.status === statusFilter : true;
    const matchPriority = priorityFilter ? r.priority === priorityFilter : true;
    return matchSearch && matchStatus && matchPriority;
  });

  const stats = {
    new: reports.filter(r => r.status === 'New').length,
    highCritical: reports.filter(r => r.priority === 'High' || r.priority === 'Critical').length,
    resolved: reports.filter(r => r.status === 'Resolved' || r.status === 'Closed').length,
  };

  return (
    <AppLayout currentPath="/admin/feedback">
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-8 wave-bg min-h-screen">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-danger/10 border border-danger/20 flex items-center justify-center text-danger">
              <MessageSquareWarning size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Feedback & Issues</h1>
              <p className="text-xs text-muted-foreground">Manage public issue reports and tickets</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/admin" className="btn-outline text-xs">Back to Admin</Link>
            <Link href="/admin/feedback/sprints" className="btn-outline text-xs">Manage Sprints</Link>
            <Link href="/admin/feedback/faq" className="btn-outline text-xs">Manage FAQs</Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="glass-card-elevated border border-border/40 rounded-xl px-5 py-4 flex items-center gap-4">
            <div className="p-3 bg-accent/10 text-accent rounded-lg"><Activity size={20} /></div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">New / Untriaged</p>
              <p className="text-2xl font-bold font-mono text-foreground">{stats.new}</p>
            </div>
          </div>
          <div className="glass-card-elevated border border-border/40 rounded-xl px-5 py-4 flex items-center gap-4">
            <div className="p-3 bg-danger/10 text-danger rounded-lg"><MessageSquareWarning size={20} /></div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">High & Critical</p>
              <p className="text-2xl font-bold font-mono text-danger">{stats.highCritical}</p>
            </div>
          </div>
          <div className="glass-card-elevated border border-border/40 rounded-xl px-5 py-4 flex items-center gap-4">
            <div className="p-3 bg-positive/10 text-positive rounded-lg"><CheckCircle2 size={20} /></div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Resolved / Closed</p>
              <p className="text-2xl font-bold font-mono text-positive">{stats.resolved}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search ref code, title, or type..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-background/50 border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-1 focus:ring-primary/30 focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/30 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Triaged">Triaged</option>
            <option value="Planned">Planned</option>
            <option value="In progress">In progress</option>
            <option value="Blocked">Blocked</option>
            <option value="Needs information">Needs information</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/30 focus:outline-none"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        {/* Table */}
        <div className="glass-card-elevated border border-border/40 rounded-2xl overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Loading tickets...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <Archive size={24} className="text-muted-foreground" />
              <p className="text-sm font-semibold text-foreground">No tickets found</p>
              <p className="text-xs text-muted-foreground">Adjust your search or filters</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-card/20 border-b border-border/50">
                <tr>
                  <th className="px-4 py-3 font-semibold">Ref Code</th>
                  <th className="px-4 py-3 font-semibold">Title & Type</th>
                  <th className="px-4 py-3 font-semibold">Priority</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filtered.map(report => (
                  <tr key={report.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3 font-mono font-medium text-xs whitespace-nowrap">{report.public_reference_code}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-foreground truncate max-w-xs">{report.title}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-xs">{report.issue_type}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{getPriorityBadge(report.priority)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{getStatusBadge(report.status)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                      {new Date(report.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Link href={`/admin/feedback/${report.id}`} className="text-primary hover:underline text-xs font-medium">
                        View / Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
