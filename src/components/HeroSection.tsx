import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, Sparkles, Play, Pause, RotateCw, Film } from 'lucide-react';
import { BrandOriginLogo } from './BrandOriginLogo';
import { useCms } from '../context/CmsContext';

interface HeroSectionProps {
  onStartOrigin: () => void;
  onExploreProcess: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartOrigin,
  onExploreProcess,
}) => {
  const { content } = useCms();
  const heroContent = content.hero;

  const [expansionStep, setExpansionStep] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement | null>(null);

  // Auto-play through the 5 genesis stages by default
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setExpansionStep((prev) => (prev + 1) % 5);
    }, 2400);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x: x * 20, y: y * 20 });
  };

  const stepsMeta = [
    { step: 0, label: '0. Origin Point', title: 'THE ORIGIN POINT' },
    { step: 1, label: '1. Vector Axis', title: 'THE VECTOR AXIS' },
    { step: 2, label: '2. 45° Aperture', title: '45° APERTURE & GEOMETRY' },
    { step: 3, label: '3. Wireframe', title: 'MONOGRAM SCHEMATIC' },
    { step: 4, label: '4. Master Emblem', title: 'BRAND ORIGIN MASTER EMBLEM' },
  ];

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[100svh] w-full flex flex-col justify-between pt-28 sm:pt-32 md:pt-28 pb-10 sm:pb-12 px-4 sm:px-6 md:px-12 overflow-hidden origin-grid"
    >
      {/* Rich Brand Origin Crimson Red Ambient Lighting */}
      <div
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[min(340px,90vw)] sm:w-[min(650px,90vw)] md:w-[min(750px,90vw)] h-[280px] sm:h-[460px] bg-[radial-gradient(ellipse_at_center,rgba(227,27,35,0.22)_0%,rgba(160,10,15,0.08)_45%,transparent_70%)] blur-3xl transition-transform duration-700 ease-out"
        style={{
          transform: `translate(calc(-50% + ${mouseOffset.x}px), ${mouseOffset.y}px)`,
        }}
      />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[min(280px,80vw)] sm:w-[min(500px,80vw)] h-[260px] sm:h-[380px] bg-[radial-gradient(circle_at_bottom_right,rgba(227,27,35,0.06)_0%,transparent_60%)] blur-2xl" />

      {/* Top narrative line */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-[10px] sm:text-xs text-[#888] font-mono tracking-wider border-b border-white/[0.06] pb-3 sm:pb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23] animate-pulse shadow-[0_0_8px_#E31B23] shrink-0" />
            <span className="truncate">{heroContent.bannerBadge || 'GENESIS PROTOCOL · ACTIVE'}</span>
          </div>
        </div>

        {/* Top slogan hidden as requested */}
      </div>

      {/* Centerpiece: The Living Origin Point & Expanding Official Emblem */}
      <div className="relative max-w-5xl mx-auto w-full my-auto py-5 sm:py-8 flex flex-col items-center text-center">
        {/* The Central Origin Morphing Visual */}
        <div
          onClick={() => setExpansionStep((prev) => (prev + 1) % 5)}
          className="relative w-[clamp(136px,36vw,176px)] h-[clamp(136px,36vw,176px)] md:w-52 md:h-52 lg:w-56 lg:h-56 mb-7 sm:mb-8 flex items-center justify-center cursor-pointer group"
          title="Click to cycle genesis step"
          data-interactive="true"
        >
          {/* Radar ripple rings */}
          <div
            className={`absolute inset-0 rounded-full border border-[#E31B23]/25 transition-all duration-700 ${
              expansionStep >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-20'
            }`}
          />
          <div
            className={`absolute -inset-3 sm:-inset-5 rounded-full border border-dashed border-[#E31B23]/30 transition-all duration-700 ${
              expansionStep >= 2 ? 'scale-100 opacity-100 rotate-45' : 'scale-50 opacity-0'
            }`}
          />

          {/* Morphing Stages into the Official Uploaded Emblem */}
          {expansionStep === 0 && (
            /* Step 0: The Origin Point */
            <div className="relative flex items-center justify-center animate-in zoom-in-50 duration-500">
              <div className="w-6 h-6 rounded-full bg-[#E31B23] shadow-[0_0_35px_#E31B23] animate-pulse" />
              <div className="absolute w-16 h-16 rounded-full border border-[#E31B23]/50 animate-ping" />
            </div>
          )}

          {expansionStep === 1 && (
            /* Step 1: The Vector Axis expanding from center */
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full relative z-10 filter drop-shadow-[0_0_20px_rgba(227,27,35,0.6)] animate-in fade-in duration-500"
            >
              <line x1="10" y1="50" x2="90" y2="50" stroke="#F5F5F5" strokeWidth="2.5" />
              <line x1="50" y1="10" x2="50" y2="90" stroke="#F5F5F5" strokeWidth="2.5" strokeDasharray="3 3" />
              <circle cx="50" cy="50" r="5" fill="#E31B23" />
              <circle cx="20" cy="50" r="2" fill="#E31B23" />
              <circle cx="80" cy="50" r="2" fill="#E31B23" />
            </svg>
          )}

          {expansionStep === 2 && (
            /* Step 2: 45° Aperture & Circular Geometry */
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full relative z-10 filter drop-shadow-[0_0_20px_rgba(227,27,35,0.6)] animate-in fade-in duration-500"
            >
              <circle cx="55" cy="55" r="32" fill="none" stroke="#E31B23" strokeWidth="2" />
              <circle cx="55" cy="55" r="18" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              <line x1="55" y1="55" x2="84" y2="84" stroke="#E31B23" strokeWidth="2.5" strokeDasharray="3 2" />
              <rect x="23" y="16" width="16" height="42" fill="none" stroke="#F5F5F5" strokeWidth="2" />
              <circle cx="55" cy="55" r="6" fill="#E31B23" />
            </svg>
          )}

          {expansionStep === 3 && (
            /* Step 3: Wireframe Monogram Schematic */
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full relative z-10 filter drop-shadow-[0_0_20px_rgba(227,27,35,0.6)] animate-in fade-in duration-500"
            >
              <path
                d="M 23 15 L 39 15 L 39 52 A 26 26 0 0 1 82 58 A 26 26 0 1 1 23 58 Z"
                fill="none"
                stroke="#F5F5F5"
                strokeWidth="2.5"
              />
              <circle cx="55" cy="58" r="10" fill="#E31B23" />
              <line x1="55" y1="58" x2="80" y2="83" stroke="#E31B23" strokeWidth="2" />
            </svg>
          )}

          {expansionStep === 4 && (
            /* Step 4: Enhanced Brand Origin 3D Master Emblem */
            <div className="relative z-10 animate-in fade-in zoom-in-95 duration-500">
              <BrandOriginLogo
                variant="mark"
                size={110}
                glow
                color="silver"
                className="scale-85 min-[375px]:scale-95 md:scale-100"
              />
            </div>
          )}

          {/* Morph state label */}
          <div className="absolute -bottom-6 flex items-center gap-1.5 text-[9.5px] sm:text-[10px] font-mono tracking-widest text-[#888] whitespace-nowrap">
            <span className="text-[#E31B23] font-bold">0{expansionStep}</span>
            <span>/</span>
            <span>{stepsMeta[expansionStep].title}</span>
          </div>
        </div>

        {/* The 5 Genesis Transformation Steps: Symmetrical Grid on Mobile (2x3 / 3x2), Inline Bar on Tablet/Desktop */}
        <div className="w-full max-w-md md:max-w-fit grid grid-cols-2 min-[375px]:grid-cols-3 md:flex md:flex-wrap lg:flex-nowrap items-center justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8 bg-[#0c0c0c]/90 border border-white/[0.08] p-1.5 sm:p-2 rounded-xs sm:rounded-sm shadow-lg">
          {stepsMeta.map((item) => (
            <button
              key={item.step}
              onClick={() => {
                setExpansionStep(item.step);
                setIsAutoPlaying(false);
              }}
              className={`px-2 min-[375px]:px-2.5 md:px-3 py-2 md:py-1.5 text-[10px] sm:text-[11px] font-mono transition-all rounded-xs whitespace-nowrap cursor-pointer text-center truncate ${
                expansionStep === item.step
                  ? 'bg-[#E31B23] text-white shadow-[0_0_12px_rgba(227,27,35,0.5)] font-bold'
                  : 'text-[#888] hover:text-white hover:bg-white/[0.04]'
              }`}
              data-interactive="true"
            >
              {item.label}
            </button>
          ))}

          {/* Auto-Cycle Play / Pause Button */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`px-2 min-[375px]:px-2.5 md:px-3 py-2 md:py-1.5 text-[10px] sm:text-[11px] font-mono rounded-xs border transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
              isAutoPlaying
                ? 'bg-[#E31B23]/15 border-[#E31B23] text-white shadow-[0_0_10px_rgba(227,27,35,0.35)]'
                : 'bg-[#161616] border-white/10 text-[#888] hover:text-white'
            }`}
            title={isAutoPlaying ? 'Pause automatic transformation' : 'Auto-play 5-step genesis'}
            data-interactive="true"
          >
            {isAutoPlaying ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23] animate-ping shrink-0" />
                <Pause className="w-3 h-3 text-[#E31B23] shrink-0" />
                <span className="inline font-semibold">Auto: ON</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-[#888] shrink-0" />
                <span className="inline">Auto: OFF</span>
              </>
            )}
          </button>
        </div>

        {/* Main Monolithic Headline: Consistent Mobile Scaling (320px-600px), Tablet (768px), and Desktop (1024px+) */}
        <h1 className="mt-2 sm:mt-4 font-['Syne'] text-[clamp(1.85rem,7.2vw,3.35rem)] md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight uppercase leading-[1.05] md:leading-[0.94] text-white text-balance max-w-5xl">
          {heroContent.headlineLine1} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-[#F5F5F5] to-[#888]">
            {heroContent.headlineLine2}
          </span>
        </h1>

        {/* Subheadline & manifesto */}
        <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg lg:text-xl font-normal text-[#A0A0A0] max-w-md sm:max-w-xl md:max-w-2xl leading-relaxed text-balance px-1 sm:px-2">
          {heroContent.subheadline}
        </p>

        {/* Dual CTA Block: Unified Mobile Stack (< 768px), Side-by-Side Row on Tablet & Desktop (>= 768px) */}
        <div className="mt-7 sm:mt-9 flex flex-col md:flex-row items-stretch md:items-center justify-center gap-3 sm:gap-4 md:gap-5 w-full max-w-sm md:max-w-none mx-auto px-1 sm:px-0">
          <button
            onClick={onStartOrigin}
            className="w-full md:w-auto px-7 py-3.5 sm:px-8 sm:py-4 text-xs md:text-sm font-semibold uppercase tracking-widest text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-xs sm:rounded-sm transition-all duration-200 shadow-[0_0_28px_rgba(227,27,35,0.45)] active:scale-98 text-center min-h-[48px] flex items-center justify-center cursor-pointer"
          >
            {heroContent.ctaPrimary || 'Start Your Origin'}
          </button>
          <button
            onClick={onExploreProcess}
            className="w-full md:w-auto px-7 py-3.5 sm:px-8 sm:py-4 text-xs md:text-sm font-semibold uppercase tracking-widest text-[#F5F5F5] bg-[#111111]/80 hover:bg-[#1a1a1a] border border-white/[0.12] hover:border-white/[0.25] rounded-xs sm:rounded-sm transition-all duration-200 flex items-center justify-center gap-2 group text-center min-h-[48px] cursor-pointer"
          >
            <span>{heroContent.ctaSecondary || 'Explore Services'}</span>
            <ArrowDown className="w-3.5 h-3.5 text-[#E31B23] transition-transform group-hover:translate-y-0.5" />
          </button>
        </div>
      </div>

      {/* Bottom Scroll Prompt (hidden as requested) */}
    </section>
  );
};
