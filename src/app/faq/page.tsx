'use client';
import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { supabase } from '@/lib/supabase';
import { Loader2, ChevronDown, ChevronUp, Mail, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [loading, setLoading] = useState(true);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadFaqs() {
      const { data } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_published', true)
        .order('category', { ascending: true })
        .order('display_order', { ascending: true });
      
      setFaqs(data || []);
      setLoading(false);
    }
    loadFaqs();
  }, []);

  const toggle = (id: string) => {
    setOpenIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Group by category
  const grouped = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) acc[faq.category] = [];
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  return (
    <AppLayout currentPath="/faq">
      <div className="max-w-screen-md mx-auto px-4 lg:px-8 py-12 wave-bg min-h-screen">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Find answers to common questions about Oceaniq, submitting observations, and using our data.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-border/50 rounded-2xl glass-card">
            No FAQs are available right now.
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="mb-8">
                <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border/40 pb-2">{category}</h2>
                <div className="space-y-3">
                  {items.map((faq) => {
                    const isOpen = openIds.has(faq.id);
                    return (
                      <div key={faq.id} className="glass-card-elevated border border-border/40 rounded-xl overflow-hidden transition-all duration-200">
                        <button
                          onClick={() => toggle(faq.id)}
                          aria-expanded={isOpen}
                          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-muted/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-inset"
                        >
                          <span className="font-semibold text-sm text-foreground">{faq.question}</span>
                          {isOpen ? <ChevronUp size={18} className="text-primary shrink-0 ml-4" /> : <ChevronDown size={18} className="text-muted-foreground shrink-0 ml-4" />}
                        </button>
                        
                        <div 
                          className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] py-4 border-t border-border/20 opacity-100' : 'max-h-0 py-0 opacity-0'}`}
                        >
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-border/50 text-center flex flex-col items-center">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
            <HelpCircle size={24} />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">Still need help?</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            If you couldn't find the answer to your question, our team is ready to help you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="mailto:frstudyacc@gmail.com?subject=Oceaniq%3A%20Feedback" className="btn-outline inline-flex items-center gap-2 text-sm justify-center">
              <Mail size={16} /> Contact Support
            </a>
            <Link href="/report-a-problem" className="btn-primary inline-flex items-center text-sm justify-center">
              Report a Problem
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
