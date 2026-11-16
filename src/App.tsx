import React, { useState, useEffect } from 'react';
import { Cursor } from './components/Cursor';
import { CanvasBackground } from './components/CanvasBackground';
import { Navigation } from './components/Navigation';
import { StageIndicator } from './components/StageIndicator';
import { HeroSection } from './components/HeroSection';
import { TransformationSection } from './components/TransformationSection';
import { PlanetaryServicesCosmos } from './components/PlanetaryServicesCosmos';
import { CreativeProjectShowcase } from './components/CreativeProjectShowcase';
import { AboutSection } from './components/AboutSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { ProjectModal } from './components/ProjectModal';
import { CmsProvider } from './context/CmsContext';
import { CmsDashboardModal } from './components/CmsDashboardModal';
import { OriginSpacecraft } from './components/OriginSpacecraft';
import { CareersPage } from './components/CareersPage';
import { OwnersBlogPage } from './components/OwnersBlogPage';

function getInitialPage(): 'home' | 'careers' | 'blog' {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  if (path === '/careers' || path.startsWith('/careers/') || hash === '#careers' || hash === '#/careers') {
    return 'careers';
  }
  if (path === '/blog' || path.startsWith('/blog/') || hash === '#blog' || hash === '#/blog') {
    return 'blog';
  }
  return 'home';
}

function AppContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);
  const [activePage, setActivePage] = useState<'home' | 'careers' | 'blog'>(getInitialPage);

  useEffect(() => {
    const handlePopState = () => {
      setActivePage(getInitialPage());
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenModal = (serviceName?: string) => {
    setSelectedService(serviceName);
    setIsModalOpen(true);
  };

  const handleNavigatePage = (page: 'home' | 'careers' | 'blog', sectionId?: string) => {
    setActivePage(page);
    if (typeof window !== 'undefined') {
      const targetUrl =
        page === 'careers'
          ? '/careers'
          : page === 'blog'
          ? '/blog'
          : sectionId
          ? `/#${sectionId}`
          : '/';
      if (window.location.pathname + window.location.hash !== targetUrl) {
        try {
          window.history.pushState({ page }, '', targetUrl);
        } catch {
          // Ignore pushState restrictions in sandboxed environments
        }
      }
    }

    if (page === 'careers' || page === 'blog') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          const offset = 70;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = el.getBoundingClientRect().top;
          const offsetPosition = elementRect - bodyRect - offset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const el = document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-hidden overflow-x-clip bg-[#050505] text-[#F5F5F5] selection:bg-[#E31B23] selection:text-white">
      {/* Interactive Custom Cursor */}
      <Cursor />

      {/* WebGL / Canvas Particle & Node System */}
      <CanvasBackground />

      {/* Signature Interactive Brand Character & Timeline only on Home Page */}
      {activePage === 'home' && <OriginSpacecraft />}
      {activePage === 'home' && <StageIndicator />}

      {/* Minimal Top Navigation (Includes Same-Tab Careers & Owner's Blog Links) */}
      <Navigation
        onOpenProjectModal={() => handleOpenModal()}
        activePage={activePage}
        onNavigatePage={handleNavigatePage}
      />

      {activePage === 'careers' ? (
        <main className="relative z-10 w-full max-w-full overflow-x-hidden overflow-x-clip">
          <CareersPage
            onBackToHome={(sectionId) => handleNavigatePage('home', sectionId)}
            onStartProject={() => handleOpenModal()}
          />
        </main>
      ) : activePage === 'blog' ? (
        <main className="relative z-10 w-full max-w-full overflow-x-hidden overflow-x-clip">
          <OwnersBlogPage
            onBackToHome={(sectionId) => handleNavigatePage('home', sectionId)}
            onOpenCareers={() => handleNavigatePage('careers')}
            onStartProject={() => handleOpenModal()}
          />
        </main>
      ) : (
        <main className="relative z-10 w-full max-w-full overflow-x-hidden overflow-x-clip">
          {/* Section 1: Hero — Where Brands Begin */}
          <HeroSection
            onStartOrigin={() => handleOpenModal()}
            onExploreProcess={scrollToServices}
          />

          {/* Section 2: Services As Planets (Spaceship travels in space and encounters each service planet) */}
          <PlanetaryServicesCosmos
            onSelectService={(srv) => handleOpenModal(srv)}
          />

          {/* Section 3: The Final Transformation Manifesto */}
          <TransformationSection
            onStartOrigin={() => handleOpenModal()}
            onExploreServices={scrollToServices}
          />

          {/* Section 4: Mission Flight Logs (Creative Case Study Archive) */}
          <CreativeProjectShowcase
            onStartOrigin={() => handleOpenModal()}
          />

          {/* Section 5: About Brand Origin */}
          <AboutSection />

          {/* Section 6: Dramatic Full-Screen Final CTA with Footer Spacecraft Landing Bay */}
          <FinalCtaSection
            onStartOrigin={() => handleOpenModal()}
            onOpenCareers={() => handleNavigatePage('careers')}
            onOpenBlog={() => handleNavigatePage('blog')}
          />
        </main>
      )}

      {/* Interactive Brief Initiator Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        preselectedService={selectedService}
      />

      {/* Brand Origin Executive Admin CMS Portal */}
      <CmsDashboardModal />
    </div>
  );
}

export default function App() {
  return (
    <CmsProvider>
      <AppContent />
    </CmsProvider>
  );
}
