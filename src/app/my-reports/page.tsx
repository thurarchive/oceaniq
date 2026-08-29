'use client';
import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { supabase } from '@/lib/supabase';
import { Loader2, Inbox, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface IssueReport {
  id: string;
  public_reference_code: string;
  title: string;
  issue_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

function getStatusBadge(status: string) {
  // Map internal states safely to user-safe progress labels
  let safeStatus = 'Received';
  let colorClass = 'bg-muted/40 text-muted-foreground border-border';

  switch (status) {
    case 'New':
    case 'Triaged':
    case 'Planned':
    case 'In progress':
    case 'Blocked':
      safeStatus = 'Under review';
      colorClass = 'bg-accent/10 text-accent border-accent/20';
      break;
    case 'Needs information':
      safeStatus = 'Need more information';
      colorClass = 'bg-warning/10 text-warning border-warning/20';
      break;
    case 'Resolved':
      safeStatus = 'Resolved';
      colorClass = 'bg-positive/10 text-positive border-positive/20';
      break;
    case 'Closed':
    case 'Rejected':
    case 'Duplicate':
      safeStatus = 'Closed';
      colorClass = 'bg-muted/40 text-muted-foreground border-border';
      break;
    default:
      safeStatus = 'Received';
      break;
  }

  // Handle 'New' specifically if we want to show 'Received' before review
  if (status === 'New') {
    safeStatus = 'Received';
    colorClass = 'bg-primary/10 text-primary border-primary/20';
  }

  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${colorClass}`}>
      {safeStatus}
    </span>
  );
}

export default function MyReportsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<IssueReport[]>([]);

  useEffect(() => {
    async function loadReports() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('issue_reports')
        .select('id, public_reference_code, title, issue_type, status, created_at, updated_at')
        .eq('reporter_user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to load your reports');
        console.error(error);
      } else {
        setReports(data || []);
      }
      setLoading(false);
    }

    loadReports();
  }, [router]);

  return (
    <AppLayout currentPath="/my-reports">
      <div className="max-w-screen-lg mx-auto px-4 lg:px-8 py-8 wave-bg min-h-[80vh]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">My Reports</h1>
            <p className="text-sm text-muted-foreground">View the status of problems and feedback you have reported.</p>
          </div>
          <Link href="/report-a-problem" className="btn-primary text-sm shrink-0">
            Report a Problem
          </Link>
        </div>

        <div className="glass-card-elevated border border-border/40 rounded-2xl overflow-hidden min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 size={32} className="animate-spin text-primary" />
            </div>
          ) : reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              <div className="w-16 h-16 bg-muted/20 border border-border/50 text-muted-foreground rounded-full flex items-center justify-center mb-4">
                <Inbox size={24} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">No reports found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">You haven't submitted any issue reports or feedback yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {reports.map((report) => (
                <div key={report.id} className="p-5 hover:bg-muted/10 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-mono font-medium text-muted-foreground">{report.public_reference_code}</span>
                      {getStatusBadge(report.status)}
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">{report.title}</h3>
                    <p className="text-xs text-muted-foreground">{report.issue_type}</p>
                  </div>
                  
                  <div className="flex flex-col sm:items-end gap-1 shrink-0 text-left sm:text-right">
                    <p className="text-xs text-muted-foreground">
                      Reported: {new Date(report.created_at).toLocaleDateString()}
                    </p>
                    {report.updated_at !== report.created_at && (
                      <p className="text-xs text-muted-foreground opacity-75">
                        Updated: {new Date(report.updated_at).toLocaleDateString()}
                      </p>
                    )}
                    <a
                      href={`mailto:frstudyacc@gmail.com?subject=${encodeURIComponent(`Oceaniq: Follow-up on ${report.public_reference_code}`)}`}
                      className="text-xs text-primary hover:underline mt-2 inline-flex items-center gap-1"
                    >
                      Contact us about this <ArrowRight size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
