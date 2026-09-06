import React, { useState, useEffect } from 'react';
import { useLayDown } from './components/Sheet';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { FarmProvider } from './context/FarmContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DemoModal from './components/DemoModal';

import LandingPage from './pages/LandingPage';
import CropRecommendationPage from './pages/CropRecommendationPage';
import CropHealthPage from './pages/CropHealthPage';
import ProductionPage from './pages/ProductionPage';
import YieldPage from './pages/YieldPage';
import AdvisorPage from './pages/AdvisorPage';
import FarmAnalysisPage from './pages/FarmAnalysisPage';
import DashboardPage from './pages/DashboardPage';
import AIModelsPage from './pages/AIModelsPage';
import DataSourcesPage from './pages/DataSourcesPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  // Read initial route from URL hash if present
  const getInitialRoute = () => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    return hash || 'home';
  };

  const [activeRoute, setActiveRoute] = useState(getInitialRoute);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  // The lay-down: settle each sheet's blocks onto the board as they scroll in.
  useLayDown([activeRoute]);

  // Sync route changes with URL hash
  const navigate = (route) => {
    setActiveRoute(route);
    window.location.hash = `#/${route}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash && hash !== activeRoute) {
        setActiveRoute(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeRoute]);

  const handleSelectDemo = (route) => {
    navigate(route);
  };

  const renderCurrentPage = () => {
    switch (activeRoute) {
      case 'home':
        return <LandingPage onNavigate={navigate} onOpenDemo={() => setDemoModalOpen(true)} />;
      case 'crop-recommendation':
        return <CropRecommendationPage onNavigate={navigate} />;
      case 'crop-health':
        return <CropHealthPage onNavigate={navigate} />;
      case 'production':
        return <ProductionPage onNavigate={navigate} />;
      case 'yield':
        return <YieldPage onNavigate={navigate} />;
      case 'advisor':
        return <AdvisorPage onNavigate={navigate} />;
      case 'farm-analysis':
        return <FarmAnalysisPage onNavigate={navigate} />;
      case 'dashboard':
        return <DashboardPage onNavigate={navigate} />;
      case 'ai-models':
        return <AIModelsPage onNavigate={navigate} />;
      case 'data-sources':
        return <DataSourcesPage onNavigate={navigate} />;
      case 'about':
        return <AboutPage onNavigate={navigate} />;
      default:
        return <LandingPage onNavigate={navigate} onOpenDemo={() => setDemoModalOpen(true)} />;
    }
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <FarmProvider>
          <div className="flex min-h-screen flex-col">

            {/* The cabinet rail — the register index */}
            <Navbar
              activeRoute={activeRoute}
              onNavigate={navigate}
              onOpenDemo={() => setDemoModalOpen(true)}
            />

            {/* The sheet itself */}
            <main className="w-full flex-1">
              {renderCurrentPage()}
            </main>

            {/* The sheet's colophon */}
            <Footer onNavigate={navigate} />

            {/* Demo scenarios — the prepared specimens */}
            <DemoModal
              isOpen={demoModalOpen}
              onClose={() => setDemoModalOpen(false)}
              onSelectDemo={handleSelectDemo}
            />

          </div>
        </FarmProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
