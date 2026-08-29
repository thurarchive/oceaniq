import React, { ReactNode } from 'react';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  effectiveDate: string;
  children: ReactNode;
}

export default function LegalPageLayout({
  title,
  lastUpdated,
  effectiveDate,
  children,
}: LegalPageLayoutProps) {
  return (
    <AppLayout currentPath="/legal">
      <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold tracking-tight mb-4">{title}</h1>
            <div className="text-sm text-muted-foreground flex flex-col sm:flex-row gap-2 sm:gap-6">
              <span><strong>Effective Date:</strong> {effectiveDate}</span>
              <span><strong>Last Updated:</strong> {lastUpdated}</span>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-muted/40 border border-border text-sm text-muted-foreground">
              <strong>Note:</strong> Not legal advice—template for review. This is an academic/capstone platform based in Indonesia. This document is provided as a starter template for review by qualified legal counsel.
            </div>
          </div>

          <article className="prose prose-sm sm:prose-base dark:prose-invert prose-primary max-w-none">
            {children}
          </article>
        </div>
      </div>
    </AppLayout>
  );
}
