"use client"

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import LayerPanel, { MapLayer, initialLayers } from './components/LayerPanel';
import MapFilterSidebar from './components/MapFilterSidebar';
import MapHeader from './components/MapHeader';
import MapCanvasMapbox, { BasemapType } from "./components/MapCanvasMapbox";

export default function InteractiveMapPage() {

  const [activeBasemap, setActiveBasemap] = useState<BasemapType>("ocean-dark");
  const [selectedZone, setSelectedZone] = useState<string>("All Zones");

  // Lifted Map Filter states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTimeRanges, setSelectedTimeRanges] = useState<string[]>(["all"]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [confidenceMin, setConfidenceMin] = useState(60);

  // Lifted Map Layer states
  const [layers, setLayers] = useState<MapLayer[]>(initialLayers);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [isExperimental, setIsExperimental] = useState<boolean>(false);

  const handleToggleExperimental = () => {
    setIsExperimental((prev) => {
      const next = !prev;
      if (next) {
        // Automatically enable ML Estimates layer
        setLayers((currentLayers) =>
          currentLayers.map((l) => (l.id === 'layer-ml' ? { ...l, active: true } : l))
        );
      }
      return next;
    });
  };

  const toggleLayer = (id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, active: !l.active } : l))
    );
  };

  const handleRefresh = () => {
    setSelectedZone("All Zones");
    setSidebarOpen(false);
    setSelectedCategories([]);
    setSelectedTimeRanges(["all"]);
    setSelectedAreas([]);
    setConfidenceMin(60);
    setLayers(initialLayers);
    setIsExperimental(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <AppLayout currentPath="/interactive-map">
      <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
        <MapHeader
          selectedZone={selectedZone}
          onZoneChange={setSelectedZone}
          onRefresh={handleRefresh}
          isExperimental={isExperimental}
          onToggleExperimental={handleToggleExperimental}
        />
        <div className="flex flex-1 overflow-hidden relative">
          <LayerPanel
            activeBasemap={activeBasemap}
            onBasemapChange={setActiveBasemap}
            layers={layers}
            onLayerToggle={toggleLayer}
          />
          <div className="flex-1 h-full relative">
            <MapCanvasMapbox
              activeBasemap={activeBasemap}
              selectedZone={selectedZone}
              layers={layers}
              selectedCategories={selectedCategories}
              selectedTimeRanges={selectedTimeRanges}
              selectedAreas={selectedAreas}
              confidenceMin={confidenceMin}
              refreshTrigger={refreshTrigger}
              isExperimental={isExperimental}
            />
          </div>
          <MapFilterSidebar
            open={sidebarOpen}
            setOpen={setSidebarOpen}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedTimeRanges={selectedTimeRanges}
            setSelectedTimeRanges={setSelectedTimeRanges}
            selectedAreas={selectedAreas}
            setSelectedAreas={setSelectedAreas}
            confidenceMin={confidenceMin}
            setConfidenceMin={setConfidenceMin}
          />
        </div>
      </div>
    </AppLayout>
  );
}
