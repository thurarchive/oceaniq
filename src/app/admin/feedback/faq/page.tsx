'use client';
import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { supabase } from '@/lib/supabase';
import { Loader2, HelpCircle, Edit, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  is_published: boolean;
}

export default function AdminFAQPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [form, setForm] = useState({
    id: '',
    question: '',
    answer: '',
    category: 'Getting started',
    display_order: 0,
    is_published: false,
  });

  const categories = [
    'Getting started', 'Accounts and access', 'Submitting observations', 
    'Marine-debris data', 'Maps and locations', 'Dashboard and analytics', 
    'Open data and licensing', 'Privacy and security', 'Troubleshooting', 'Other'
  ];

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
      fetchFaqs();
    }
    init();
  }, [router]);

  const fetchFaqs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load FAQs');
    } else {
      setFaqs(data || []);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      question: form.question,
      answer: form.answer,
      category: form.category,
      display_order: form.display_order,
      is_published: form.is_published,
    };

    let error;
    if (form.id) {
      const res = await supabase.from('faqs').update(payload).eq('id', form.id);
      error = res.error;
    } else {
      const res = await supabase.from('faqs').insert([payload]);
      error = res.error;
    }

    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('FAQ saved');
      setIsModalOpen(false);
      fetchFaqs();
    }
  };

  const openEdit = (faq: FAQ) => {
    setForm(faq);
    setIsModalOpen(true);
  };

  const openNew = () => {
    setForm({ id: '', question: '', answer: '', category: 'Getting started', display_order: 0, is_published: false });
    setIsModalOpen(true);
  };

  const togglePublish = async (id: string, current: boolean) => {
    const { error } = await supabase.from('faqs').update({ is_published: !current }).eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success(current ? 'Unpublished' : 'Published');
      fetchFaqs();
    }
  };

  if (!isAdmin && !loading) return null;

  return (
    <AppLayout currentPath="/admin/feedback/faq">
      <div className="max-w-screen-lg mx-auto px-4 lg:px-8 py-8 wave-bg min-h-screen">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <HelpCircle size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">FAQ Management</h1>
              <p className="text-xs text-muted-foreground">Manage public FAQs</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/feedback" className="btn-outline text-xs">Back to Feedback</Link>
            <button onClick={openNew} className="btn-primary text-xs">New FAQ</button>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
            <div className="glass-card-elevated border border-border/50 rounded-2xl p-6 w-full max-w-lg shadow-2xl my-8">
              <h2 className="text-lg font-bold mb-4">{form.id ? 'Edit FAQ' : 'Create New FAQ'}</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Question <span className="text-danger">*</span></label>
                  <input required type="text" value={form.question} onChange={e => setForm({...form, question: e.target.value})} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Answer <span className="text-danger">*</span></label>
                  <textarea required rows={4} value={form.answer} onChange={e => setForm({...form, answer: e.target.value})} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none resize-y" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Category</label>
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none">
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Display Order</label>
                    <input type="number" value={form.display_order} onChange={e => setForm({...form, display_order: parseInt(e.target.value) || 0})} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none" />
                  </div>
                </div>
                <div className="mt-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={form.is_published} onChange={e => setForm({...form, is_published: e.target.checked})} className="rounded text-primary focus:ring-primary border-border bg-background" />
                    Publish immediately
                  </label>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-border/40 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-outline text-sm">Cancel</button>
                  <button type="submit" disabled={loading} className="btn-primary text-sm">Save FAQ</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* List */}
        <div className="glass-card-elevated border border-border/40 rounded-2xl overflow-x-auto">
          {loading && !faqs.length ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>
          ) : !faqs.length ? (
            <div className="text-center py-12 text-muted-foreground">No FAQs found.</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-card/20 border-b border-border/50">
                <tr>
                  <th className="px-4 py-3 font-semibold w-12">Order</th>
                  <th className="px-4 py-3 font-semibold">Question & Category</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {faqs.map(faq => (
                  <tr key={faq.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3 font-mono text-center">{faq.display_order}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-foreground">{faq.question}</p>
                      <p className="text-xs text-muted-foreground">{faq.category}</p>
                    </td>
                    <td className="px-4 py-3">
                      {faq.is_published ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-positive/10 text-positive border border-positive/20 flex w-fit items-center gap-1"><Eye size={10}/> Published</span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted/40 text-muted-foreground border border-border flex w-fit items-center gap-1"><EyeOff size={10}/> Hidden</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => togglePublish(faq.id, faq.is_published)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/20" title="Toggle visibility">
                          {faq.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button onClick={() => openEdit(faq)} className="p-1.5 text-primary hover:text-primary-focus transition-colors rounded-lg hover:bg-primary/10" title="Edit">
                          <Edit size={16} />
                        </button>
                      </div>
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
