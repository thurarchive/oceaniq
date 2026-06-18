import React from 'react';
import AppLayout from '@/components/AppLayout';
import AnalyticsHeader from './components/AnalyticsHeader';
import KPIBentoGrid from './components/KPIBentoGrid';
import WasteTrendChart from './components/WasteTrendChart';
import WasteCompositionChart from './components/WasteCompositionChart';
import RainfallCorrelationChart from './components/RainfallCorrelationChart';
import DataSourceChart from './components/DataSourceChart';
import RecentActivityFeed from './components/RecentActivityFeed';

export default function AnalyticsDashboardPage() {
  return (
    <AppLayout currentPath="/analytics-dashboard">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 2xl:px-12 py-6">
        <AnalyticsHeader />
        <KPIBentoGrid />

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-5">
          <div className="xl:col-span-2">
            <WasteTrendChart />
          </div>
          <div>
            <DataSourceChart />
          </div>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-5">
          <WasteCompositionChart />
          <RainfallCorrelationChart />
        </div>

        {/* Activity feed */}
        <div className="mt-5">
          <RecentActivityFeed />
        </div>
      </div>
    </AppLayout>
  );
}