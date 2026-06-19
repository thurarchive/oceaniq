"use client"

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import MapCanvas from './components/MapCanvas';
import LayerPanel from './components/LayerPanel';
import MapFilterSidebar from './components/MapFilterSidebar';
import MapHeader from './components/MapHeader';
import MapCanvasMapLibre, { BasemapType } from "./components/MapCanvasMapLibre";

export default function InteractiveMapPage() {

  const [activeBasemap, setActiveBasemap] = useState<BasemapType>("ocean-dark");

  return (
    <AppLayout currentPath="/interactive-map">
      <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
        <MapHeader />
        <div className="flex flex-1 overflow-hidden relative">
          <LayerPanel activeBasemap={activeBasemap} 
          onBasemapChange={setActiveBasemap} 
          />
          <MapCanvasMapLibre activeBasemap={activeBasemap} />
          <MapFilterSidebar />
        </div>
      </div>
    </AppLayout>
  );
}