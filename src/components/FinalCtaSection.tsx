import React, { useState } from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { BrandOriginLogo } from './BrandOriginLogo';
import { useCms } from '../context/CmsContext';

interface FinalCtaSectionProps {
  onStartOrigin: () => void;
  onOpenCareers?: () => void;
  onOpenBlog?: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onStartOrigin, onOpenCareers, onOpenBlog }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLanded, setIsLanded] = useState(false);
  const { openCms, content } = useCms();
  const ctaContent = content.finalCta;

  // Listen for spacecraft touchdown confirmation in the footer
  React.useEffect(() => {
    const handleLanded = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsLanded(Boolean(customEvent.detail?.isLanded));
    };
    window.addEventListener('brandorigin:spacecraft-landed', handleLanded);
    return () => {
      window.removeEventListener('brandorigin:spacecraft-landed', handleLanded);
    };
  }, []);

  return (
    <section className="relative min-h-[100svh] w-full py-20 sm:py-28 lg:py-32 px-4 sm:px-6 md:px-12 bg-[#020202] text-center flex flex-col justify-between items-center overflow-hidden border-t border-white/[0.08]">
      {/* Expanding Pure Crimson Ripple Glow on Hover */}
      <div
        className={`pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-700 ease-out ${
          isHovered
            ? 'w-[min(320px,85vw)] sm:w-[min(600px,85vw)] lg:w-[800px] h-[min(320px,85vw)] sm:h-[min(600px,85vw)] lg:h-[800px] bg-[radial-gradient(circle,rgba(227,27,35,0.25)_0%,rgba(140,10,15,0.1)_45%,transparent_70%)]'
            : 'w-[min(240px,75vw)] sm:w-[320px] h-[min(240px,75vw)] sm:h-[320px] bg-[radial-gradient(circle,rgba(227,27,35,0.1)_0%,transparent_70%)]'
        }`}
      />

      <div className="w-full" />

      {/* Centerpiece: The Official Emblem & Dramatic Call to Action */}
      <div className="max-w-4xl mx-auto w-full relative z-10 flex flex-col items-center my-auto py-6">
        {/* Official 3D Master Emblem with Crimson Red Halo */}
        <div className="relative mb-6 sm:mb-8 flex flex-col items-center justify-center">
          <BrandOriginLogo
            variant="mark"
            size={80}
            color="silver"
            glow={true}
          />
        </div>

        {/* Monolithic Headline */}
        <h2 className="font-['Syne'] text-[clamp(1.9rem,7.5vw,3.75rem)] md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-[1.05] md:leading-[0.94] text-balance">
          {ctaContent.headlineLine1} <br />
          <span className="text-[#888]">{ctaContent.headlineLine2}</span>
        </h2>

        <div className="font-['Syne'] text-[clamp(1.5rem,6vw,3rem)] md:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-[#E31B23] mt-3 sm:mt-4">
          {ctaContent.startHere}
        </div>

        {/* Tagline */}
        <div className="mt-3 sm:mt-4 text-[10px] min-[375px]:text-xs sm:text-sm font-sans tracking-[0.18em] sm:tracking-[0.3em] text-[#CCC] uppercase font-medium flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <span>Build</span>
          <span className="text-[#E31B23] font-bold">.</span>
          <span>Innovate</span>
          <span className="text-[#E31B23] font-bold">.</span>
          <span>Grow</span>
        </div>

        <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-[#999] max-w-md sm:max-w-lg font-light leading-relaxed text-balance px-1 sm:px-2">
          {ctaContent.subtext}
        </p>

        {/* The Magnetic Interactive Button with Ripple Effect */}
        <div className="mt-8 sm:mt-10 relative group w-full max-w-sm md:w-auto md:max-w-none px-1 sm:px-0">
          <div
            className={`absolute -inset-2 rounded-sm bg-[#E31B23]/25 blur-md transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <div className="flex flex-col md:flex-row items-center justify-center gap-3">
            <button
              onClick={onStartOrigin}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="w-full md:w-auto md:min-w-[260px] relative px-8 sm:px-10 py-4 sm:py-5 text-xs sm:text-sm md:text-base font-['Syne'] font-bold uppercase tracking-widest text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-sm transition-all duration-300 shadow-[0_0_40px_rgba(227,27,35,0.5)] hover:shadow-[0_0_60px_rgba(227,27,35,0.8)] hover:scale-105 active:scale-98 flex items-center justify-center gap-3 min-h-[48px] cursor-pointer"
              data-interactive="true"
            >
              <span>{ctaContent.buttonText || 'Create Your Origin'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Universal Footer with Dedicated Spaceship Landing Bay */}
      <footer className="w-full max-w-7xl mx-auto pt-10 sm:pt-16 pb-8 border-t border-white/[0.06] flex flex-col items-center gap-6 sm:gap-8 text-[11px] sm:text-xs text-[#666] font-mono">
        {/* Dedicated Spaceship Landing Bay Inside Footer Section */}
        <div
          id="footer-spacecraft-dock"
          className={`w-full max-w-md mx-auto p-3.5 min-[375px]:p-4 sm:p-5 rounded-lg border transition-all duration-700 relative overflow-hidden flex flex-col items-center justify-center ${
            isLanded
              ? 'border-emerald-500/40 bg-[#060c08]/90 shadow-[0_0_35px_rgba(16,185,129,0.18)]'
              : 'border-white/[0.08] bg-[#050608]/80 shadow-[0_0_20px_rgba(0,0,0,0.5)]'
          }`}
        >
          {/* Header Telemetry Bar */}
          <div className="w-full flex flex-wrap items-center justify-between gap-1 text-[9px] min-[375px]:text-[10px] uppercase tracking-wider mb-2.5">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isLanded ? 'bg-emerald-400 animate-pulse' : 'bg-[#E31B23]'}`} />
              <span>RECOVERY BERTH 01</span>
            </span>
            <span className={`font-medium tracking-widest transition-colors duration-500 ${isLanded ? 'text-emerald-400' : 'text-zinc-500'}`}>
              {isLanded ? '● TOUCHDOWN CONFIRMED' : '○ APPROACH GUIDANCE ACTIVE'}
            </span>
          </div>

          {/* Precision Landing Deck & Touchdown Target Pad */}
          <div
            id="footer-touchdown-pad"
            className="w-full h-20 sm:h-22 rounded border border-dashed border-white/[0.12] bg-white/[0.02] relative flex items-center justify-center overflow-hidden"
          >
            {/* Runway centerline dashed markings */}
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none opacity-40">
              <div className="w-2 h-0.5 bg-[#E31B23]" />
              <div className="w-2 h-0.5 bg-white/40" />
              <div className="w-2 h-0.5 bg-white/40" />
              <div className="w-2 h-0.5 bg-[#E31B23]" />
            </div>

            {/* Target Crosshair & Cradle Reticle */}
            <div className="relative w-14 h-14 rounded-full border border-white/[0.15] flex items-center justify-center">
              <div className="absolute w-full h-[1px] bg-white/[0.1]" />
              <div className="absolute h-full w-[1px] bg-white/[0.1]" />
              <div className={`w-8 h-8 rounded-full border transition-colors duration-500 ${isLanded ? 'border-emerald-400/50 shadow-[0_0_12px_rgba(52,211,153,0.3)]' : 'border-[#E31B23]/40'}`} />
            </div>

            {/* Alignment Stencil */}
            <span className="absolute bottom-1.5 text-[7.5px] min-[375px]:text-[8px] font-mono tracking-widest uppercase text-zinc-600 px-2 truncate max-w-full">
              {isLanded ? 'MASTER ORIGIN CRAFT DOCKED' : 'ALIGNMENT CRADLE // TOUCHDOWN PAD'}
            </span>
          </div>
        </div>

        {/* Universal Footer Links & Copyright */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 pt-2">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23] shrink-0" />
            {/* Clicking Brand Origin opens the Admin CMS */}
            <button
              onClick={openCms}
              className="text-white hover:text-[#E31B23] font-['Syne'] font-bold tracking-tight transition-colors flex items-center gap-1.5 group cursor-pointer focus:outline-none"
              title="Click to access Brand Origin Admin CMS Portal"
              data-interactive="true"
            >
              <span>BRAND ORIGIN</span>
              <Lock className="w-3 h-3 text-[#E31B23] opacity-60 group-hover:opacity-100 transition-opacity" />
              <span className="text-[9px] font-mono px-1 py-0.2 bg-[#E31B23]/15 text-[#E31B23] rounded-xs border border-[#E31B23]/30">
                CMS
              </span>
            </button>
            <span>© 2026. ALL RIGHTS RESERVED.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a href="#services" className="hover:text-white transition-colors">SERVICES</a>
            <a href="#work" className="hover:text-white transition-colors">PROJECTS</a>
            <a href="#about" className="hover:text-white transition-colors">ABOUT</a>
            {onOpenCareers && (
              <button
                onClick={onOpenCareers}
                className="hover:text-white transition-colors cursor-pointer uppercase"
              >
                CAREERS
              </button>
            )}
            {onOpenBlog && (
              <button
                onClick={onOpenBlog}
                className="hover:text-white transition-colors cursor-pointer uppercase"
              >
                OWNER&apos;S BLOG
              </button>
            )}
            <button onClick={onStartOrigin} className="text-[#E31B23] hover:underline cursor-pointer">
              INITIATE BRIEF
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#555]">
              BUILD · INNOVATE · GROW
            </span>
          </div>
        </div>
      </footer>
    </section>
  );
};
