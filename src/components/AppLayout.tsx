import React from 'react';
import Topbar from './Topbar';

interface AppLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
}

export default function AppLayout({ children, currentPath }: AppLayoutProps) {
  return (
    <div className="min-h-screen ocean-gradient">
      <Topbar currentPath={currentPath} />
      <main className="pt-16 min-h-screen">
        {children}
      </main>
    </div>
  );
}