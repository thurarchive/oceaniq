'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Check if we already have a session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/interactive-map');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        router.replace('/auth/reset-password');
      } else if (session) {
        router.replace('/interactive-map');
      } else {
        // Give client a small window to resolve auth state, otherwise go to auth page
        const timeout = setTimeout(() => {
          router.replace('/auth');
        }, 2000);
        return () => clearTimeout(timeout);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="min-h-screen ocean-gradient flex flex-col items-center justify-center text-foreground px-4 text-center">
      <div className="glass-card-elevated p-8 max-w-sm w-full flex flex-col items-center gap-4 border border-primary/20">
        <Loader2 className="animate-spin text-primary" size={32} />
        <div>
          <h2 className="text-lg font-bold text-foreground">Setting up your session</h2>
          <p className="text-sm text-muted-foreground mt-1">Completing sign in, please wait...</p>
        </div>
      </div>
    </div>
  );
}
