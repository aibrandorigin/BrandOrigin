import React, { useState, useEffect } from 'react';
import { BrandOriginLogo } from './BrandOriginLogo';
import { ArrowRight, ArrowUpRight, X, Menu } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { isMobileViewport } from '../utils/viewport';

interface NavigationProps {
  onOpenProjectModal: () => void;
  activePage?: 'home' | 'careers' | 'blog';
  onNavigatePage?: (page: 'home' | 'careers' | 'blog', sectionId?: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  onOpenProjectModal,
  activePage = 'home',
  onNavigatePage,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { content } = useCms();
  const headerConfig = content.header || {
    originLabsLabel: 'Origin Labs',
    originLabsUrl: 'https://originlabs.brandorigin.in',
    startProjectLabel: 'Start a Project',
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    const handleResize = () => {
      if (!isMobileViewport()) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Lock vertical body scroll when mobile menu is open without disturbing overflow-x containment
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = '';
    }
    return () => {
      document.body.style.overflowY = '';
    };
  }, [mobileMenuOpen]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (activePage !== 'home' && onNavigatePage) {
      onNavigatePage('home', id);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const offset = isMobileViewport() ? 102 : 70;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const navigateToCareers = () => {
    setMobileMenuOpen(false);
    if (onNavigatePage) {
      onNavigatePage('careers');
    }
  };

  const navigateToBlog = () => {
    setMobileMenuOpen(false);
    if (onNavigatePage) {
      onNavigatePage('blog');
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 w-full ${
        scrolled || mobileMenuOpen || activePage === 'careers' || activePage === 'blog'
          ? 'bg-[#050505]/95 backdrop-blur-md border-b border-white/[0.1] shadow-lg'
          : 'bg-[#050505]/90 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-b border-white/[0.08] md:border-b-0'
      }`}
    >
      {/* Primary Header Row */}
      <div
        className={`max-w-7xl mx-auto px-3.5 min-[375px]:px-4 sm:px-6 md:px-10 flex items-center justify-between gap-2 ${
          scrolled || mobileMenuOpen || activePage === 'careers' || activePage === 'blog'
            ? 'py-2.5 sm:py-3.5'
            : 'py-2.5 sm:py-4 md:py-6'
        }`}
      >
        {/* Zone 1: Single element brand wordmark with enhanced official emblem */}
        <button
          onClick={() => {
            setMobileMenuOpen(false);
            if (activePage !== 'home' && onNavigatePage) {
              onNavigatePage('home');
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="group flex items-center text-left focus:outline-none min-w-0 shrink-0 cursor-pointer"
          aria-label="Brand Origin Home"
        >
          <BrandOriginLogo
            variant="horizontal"
            showTagline={false}
            isHeader={true}
            className="transition-transform group-hover:scale-102"
          />
        </button>

        {/* Zone 2: Desktop & Tablet Navigation Bar (>= 768px) */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-5 lg:gap-7 text-xs uppercase tracking-widest text-[#A0A0A0]"
        >
          <button
            onClick={() => scrollToSection('services')}
            className="hover:text-white transition-colors duration-150 focus:outline-none cursor-pointer whitespace-nowrap shrink-0"
          >
            Services
          </button>
          <button
            onClick={() => scrollToSection('work')}
            className="hover:text-white transition-colors duration-150 focus:outline-none cursor-pointer whitespace-nowrap shrink-0"
          >
            Projects
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="hover:text-white transition-colors duration-150 focus:outline-none cursor-pointer whitespace-nowrap shrink-0"
          >
            About
          </button>
          <button
            onClick={navigateToCareers}
            className={`transition-colors duration-150 focus:outline-none cursor-pointer whitespace-nowrap shrink-0 ${
              activePage === 'careers'
                ? 'text-white font-semibold underline decoration-[#E31B23] decoration-2 underline-offset-8'
                : 'hover:text-white'
            }`}
          >
            Careers
          </button>
          <button
            onClick={navigateToBlog}
            className={`transition-colors duration-150 focus:outline-none cursor-pointer whitespace-nowrap shrink-0 ${
              activePage === 'blog'
                ? 'text-white font-semibold underline decoration-[#E31B23] decoration-2 underline-offset-8'
                : 'hover:text-white'
            }`}
          >
            Owner&apos;s Blog
          </button>
        </nav>

        {/* Zone 3: Action Buttons + Mobile Drawer Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Origin Labs Redirect Button (visible on desktop >= 1024px) */}
          <a
            href={headerConfig.originLabsUrl || 'https://originlabs.brandorigin.in'}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex relative px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#121212] hover:bg-[#1c1c1c] border border-white/[0.12] hover:border-[#E31B23]/70 rounded-sm transition-all duration-200 items-center gap-1.5 group whitespace-nowrap shadow-sm"
            title="Explore Origin Labs"
            data-interactive="true"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23] animate-pulse" />
            <span>{headerConfig.originLabsLabel || 'Origin Labs'}</span>
            <ArrowUpRight className="w-3 h-3 text-[#AAA] group-hover:text-white transition-colors" />
          </a>

          {/* Primary Action Button (visible across mobile & desktop) */}
          <button
            onClick={onOpenProjectModal}
            className="inline-flex relative px-2.5 py-1.5 min-[375px]:px-3 sm:px-3.5 sm:py-2 md:px-4 md:py-2 text-[10px] min-[375px]:text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-xs sm:rounded-sm transition-all duration-200 shadow-[0_0_18px_rgba(227,27,35,0.4)] whitespace-nowrap active:scale-95 shrink-0 cursor-pointer items-center justify-center"
          >
            {headerConfig.startProjectLabel || 'Start a Project'}
          </button>

          {/* Mobile Hamburger Menu Trigger (< 768px) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white hover:text-[#E31B23] p-2 rounded-xs bg-[#141418] border border-white/[0.16] focus:outline-none flex items-center justify-center w-9 h-9 min-[375px]:w-10 min-[375px]:h-10 shrink-0 cursor-pointer"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Always-Visible Mobile Header Navigation Bar (< 768px) */}
      <nav
        aria-label="Mobile Header Navigation"
        className="md:hidden w-full border-t border-white/[0.08] bg-[#08080B]/95 px-3 min-[375px]:px-4 overflow-x-auto scrollbar-none"
      >
        <div className="flex items-center justify-between min-w-max gap-1 min-[375px]:gap-2 py-2">
          <button
            type="button"
            onClick={() => scrollToSection('services')}
            className="px-2 py-1 text-[10px] min-[375px]:text-[11px] font-mono uppercase tracking-wider text-[#CCCCCC] hover:text-white active:text-[#E31B23] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Services
          </button>

          <span className="text-white/15 text-[10px] select-none" aria-hidden="true">
            ·
          </span>

          <button
            type="button"
            onClick={() => scrollToSection('work')}
            className="px-2 py-1 text-[10px] min-[375px]:text-[11px] font-mono uppercase tracking-wider text-[#CCCCCC] hover:text-white active:text-[#E31B23] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Projects
          </button>

          <span className="text-white/15 text-[10px] select-none" aria-hidden="true">
            ·
          </span>

          <button
            type="button"
            onClick={() => scrollToSection('about')}
            className="px-2 py-1 text-[10px] min-[375px]:text-[11px] font-mono uppercase tracking-wider text-[#CCCCCC] hover:text-white active:text-[#E31B23] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            About
          </button>

          <span className="text-white/15 text-[10px] select-none" aria-hidden="true">
            ·
          </span>

          <button
            type="button"
            onClick={navigateToCareers}
            className={`px-2 py-1 text-[10px] min-[375px]:text-[11px] font-mono uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activePage === 'careers'
                ? 'text-[#E31B23] font-bold underline decoration-[#E31B23] underline-offset-4'
                : 'text-[#CCCCCC] hover:text-white'
            }`}
          >
            Careers
          </button>

          <span className="text-white/15 text-[10px] select-none" aria-hidden="true">
            ·
          </span>

          <button
            type="button"
            onClick={navigateToBlog}
            className={`px-2 py-1 text-[10px] min-[375px]:text-[11px] font-mono uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activePage === 'blog'
                ? 'text-[#E31B23] font-bold underline decoration-[#E31B23] underline-offset-4'
                : 'text-[#CCCCCC] hover:text-white'
            }`}
          >
            Owner&apos;s Blog
          </button>

          <span className="text-white/15 text-[10px] select-none" aria-hidden="true">
            ·
          </span>

          <a
            href={headerConfig.originLabsUrl || 'https://originlabs.brandorigin.in'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-1 text-[10px] min-[375px]:text-[11px] font-mono uppercase tracking-wider text-[#E31B23] hover:text-white transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1"
          >
            <span>{headerConfig.originLabsLabel || 'Origin Labs'}</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </nav>

      {/* Expandable Full-Screen Mobile Drawer (< 768px) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[88px] bottom-0 z-50 bg-[#070707]/98 backdrop-blur-2xl border-t border-white/[0.08] px-4 min-[375px]:px-5 sm:px-6 py-6 flex flex-col justify-between overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200 pb-10">
          <div className="space-y-3">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#E31B23] mb-1">
              NAVIGATION DIRECTORY
            </div>
            {[
              { id: 'services', label: '01 · Services', sub: '6 Celestial Capability Worlds' },
              { id: 'work', label: '02 · Projects', sub: 'Proven Commercial Archives' },
              { id: 'about', label: '03 · About Origin', sub: 'Philosophy & Architectural Tenets' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="w-full text-left p-3.5 rounded-xs border border-white/[0.06] bg-[#111111]/90 hover:bg-[#161112] hover:border-[#E31B23]/40 transition-colors flex items-center justify-between min-h-[52px]"
              >
                <div>
                  <div className="font-['Syne'] text-base font-bold text-white">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-[#888] font-mono">{item.sub}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#E31B23] shrink-0" />
              </button>
            ))}

            {/* Dedicated Careers Page Link (Same Tab) */}
            <button
              onClick={navigateToCareers}
              className={`w-full text-left p-3.5 rounded-xs border transition-colors flex items-center justify-between min-h-[52px] ${
                activePage === 'careers'
                  ? 'border-[#E31B23] bg-[#181011]'
                  : 'border-white/[0.06] bg-[#111111]/90 hover:bg-[#161112] hover:border-[#E31B23]/40'
              }`}
            >
              <div>
                <div className="font-['Syne'] text-base font-bold text-white">
                  04 · Careers
                </div>
                <div className="text-[11px] text-[#888] font-mono">
                  Open Positions &amp; Talent Architecture
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#E31B23] shrink-0" />
            </button>

            {/* Dedicated Owner's Blog Page Link (Same Tab) */}
            <button
              onClick={navigateToBlog}
              className={`w-full text-left p-3.5 rounded-xs border transition-colors flex items-center justify-between min-h-[52px] ${
                activePage === 'blog'
                  ? 'border-[#E31B23] bg-[#181011]'
                  : 'border-white/[0.06] bg-[#111111]/90 hover:bg-[#161112] hover:border-[#E31B23]/40'
              }`}
            >
              <div>
                <div className="font-['Syne'] text-base font-bold text-white">
                  05 · Owner&apos;s Blog
                </div>
                <div className="text-[11px] text-[#888] font-mono">
                  About Our Owner &amp; Leadership Vision
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#E31B23] shrink-0" />
            </button>

            {/* Mobile Origin Labs Link */}
            <a
              href={headerConfig.originLabsUrl || 'https://originlabs.brandorigin.in'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-left p-3.5 rounded-xs border border-[#E31B23]/40 bg-[#161112] text-white flex items-center justify-between min-h-[52px]"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#E31B23] animate-pulse shrink-0" />
                <div>
                  <div className="font-['Syne'] text-base font-bold text-white">
                    {headerConfig.originLabsLabel || 'Origin Labs'}
                  </div>
                  <div className="text-[11px] text-[#AAA] font-mono">Experimental Innovation Wing</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#E31B23] shrink-0" />
            </a>
          </div>

          <div className="pt-6 mt-6 border-t border-white/[0.08] space-y-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenProjectModal();
              }}
              className="w-full py-4 text-xs font-semibold uppercase tracking-widest text-white bg-[#E31B23] rounded-xs shadow-[0_0_20px_rgba(227,27,35,0.5)] flex items-center justify-center gap-2"
            >
              <span>{headerConfig.startProjectLabel || 'Initiate Your Brief'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center text-[10px] font-mono text-[#666]">
              BUILD . INNOVATE . GROW // BRAND ORIGIN
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
