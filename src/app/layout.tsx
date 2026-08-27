import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, IBM_Plex_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import '../styles/tailwind.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Oceaniq — Marine Waste Monitoring Platform',
  description:
    'Oceaniq combines field observations, citizen science, and ML-powered estimation to monitor marine waste across Indonesian coastal zones.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={`${plusJakarta.variable} ${ibmPlexMono.variable} dark`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <body className={plusJakarta.className}>
        <ThemeProvider>
          <LanguageProvider>
            {children}

            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                },
              }}
            />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}