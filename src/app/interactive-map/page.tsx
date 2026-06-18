import React from 'react';
import AppLayout from '@/components/AppLayout';
import MapCanvas from './components/MapCanvas';
import LayerPanel from './components/LayerPanel';
import MapFilterSidebar from './components/MapFilterSidebar';
import MapHeader from './components/MapHeader';

export default function InteractiveMapPage() {
  return (
    <AppLayout currentPath="/interactive-map">
      <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
        <MapHeader />
        <div className="flex flex-1 overflow-hidden relative">
          <LayerPanel />
          <MapCanvas />
          <MapFilterSidebar />
        </div>
      </div>
    </AppLayout>
  );
}