"use client"

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import MapCanvas from './components/MapCanvas';
import LayerPanel from './components/LayerPanel';
import MapFilterSidebar from './components/MapFilterSidebar';
import MapHeader from './components/MapHeader';
import MapCanvasMapbox, { BasemapType } from "./components/MapCanvasMapbox";

export default function InteractiveMapPage() {

  const [activeBasemap, setActiveBasemap] = useState<BasemapType>("ocean-dark");
  const [selectedZone, setSelectedZone] = useState<string>("All Zones");

  // Lifted Map Filter states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d");
  const [selectedArea, setSelectedArea] = useState("all");
  const [confidenceMin, setConfidenceMin] = useState(60);

  const handleRefresh = () => {
    setSelectedZone("All Zones");
    setSidebarOpen(false);
    setSelectedCategory("all");
    setSelectedTimeRange("30d");
    setSelectedArea("all");
    setConfidenceMin(60);
  };

  return (
    <AppLayout currentPath="/interactive-map">
      <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
        <MapHeader 
          selectedZone={selectedZone} 
          onZoneChange={setSelectedZone} 
          onRefresh={handleRefresh}
        />
        <div className="flex flex-1 overflow-hidden relative">
          <LayerPanel activeBasemap={activeBasemap}
            onBasemapChange={setActiveBasemap}
          />
          <MapCanvasMapbox activeBasemap={activeBasemap} selectedZone={selectedZone} />
          <MapFilterSidebar 
            open={sidebarOpen}
            setOpen={setSidebarOpen}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedTimeRange={selectedTimeRange}
            setSelectedTimeRange={setSelectedTimeRange}
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
            confidenceMin={confidenceMin}
            setConfidenceMin={setConfidenceMin}
          />
        </div>
      </div>
    </AppLayout>
  );
}