import React from 'react';
import LandingTopbar from './public-landing-page/components/LandingTopbar';
import HeroSection from './public-landing-page/components/HeroSection';
import LiveStatsBar from './public-landing-page/components/LiveStatsBar';
import FeatureHighlights from './public-landing-page/components/FeatureHighlights';
import HowItWorks from './public-landing-page/components/HowItWorks';
import ContributorBenefits from './public-landing-page/components/ContributorBenefits';
import LeaderboardPreview from './public-landing-page/components/LeaderboardPreview';
import HotspotBanner from './public-landing-page/components/HotspotBanner';
import MethodologyNote from './public-landing-page/components/MethodologyNote';
import LandingCTA from './public-landing-page/components/LandingCTA';
import LandingFooter from './public-landing-page/components/LandingFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen ocean-gradient wave-bg overflow-x-hidden">
      <LandingTopbar />
      <HeroSection />
      <LiveStatsBar />
      <FeatureHighlights />
      <HowItWorks />
      <ContributorBenefits />
      <LeaderboardPreview />
      <HotspotBanner />
      <MethodologyNote />
      <LandingCTA />
      <LandingFooter />
    </div>
  );
}