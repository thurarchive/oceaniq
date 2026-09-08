'use client';

import React from 'react';
import Link from 'next/link';
import { Waves } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useLanguage } from '@/context/LanguageContext';

interface DashboardHeaderProps {
  user: SupabaseUser;
}

function getRoleContext(role: string | undefined, isId: boolean): string {
  switch (role) {
    case 'admin':
      return isId
        ? 'Pantau aktivitas platform dan kelola alur operasional.'
        : 'Monitor platform activity and manage operational workflows.';
    case 'analyst':
      return isId
        ? 'Tinjau aktivitas pemantauan dan kirim data lapangan yang tervalidasi.'
        : 'Review monitoring activity and contribute validated field data.';
    default:
      return isId
        ? 'Lacak laporan Anda dan kirim observasi baru.'
        : 'Track your reports and contribute new observations.';
  }
}

function getRoleLabel(role: string | undefined, isId: boolean): string {
  switch (role) {
    case 'admin':
      return isId ? 'Administrator' : 'Administrator';
    case 'analyst':
      return isId ? 'Analis terverifikasi' : 'Verified analyst';
    default:
      return isId ? 'Kontributor publik' : 'Public contributor';
  }
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const { language } = useLanguage();
  const isId = language === 'id';
  const name = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? (isId ? 'Kontributor' : 'Contributor');
  const firstName = name.split(' ')[0];
  const role = (user.app_metadata?.role || user.user_metadata?.role) as string | undefined;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-2">
            <Waves size={14} aria-hidden />
            {getRoleLabel(role, isId)}
          </span>
          <h1 className="text-2xl font-bold text-foreground">
            {isId ? 'Selamat datang kembali,' : 'Welcome back,'}{' '}
            <span className="text-gradient-ocean">{firstName}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{getRoleContext(role, isId)}</p>
        </div>
      </div>
    </div>
  );
}
