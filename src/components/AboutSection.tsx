import React from 'react';
import { useCms } from '../context/CmsContext';

export const AboutSection: React.FC = () => {
  const { content } = useCms();
  const about = content.about;
  const tenets = about.tenets || [];

  return (
    <section
      id="about"
      className="relative min-h-[90svh] sm:min-h-screen w-full py-20 sm:py-28 lg:py-36 px-4 sm:px-6 md:px-12 border-t border-white/[0.06] overflow-hidden flex flex-col justify-center"
    >
      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Stage Meta Kicker */}
        <div className="flex items-center gap-3 text-xs font-mono text-[#E31B23] tracking-widest uppercase mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]" />
          <span>ABOUT BRAND ORIGIN</span>
        </div>

        {/* Monolithic Headline */}
        <h2 className="font-['Syne'] text-[clamp(1.85rem,6.8vw,3.5rem)] md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight uppercase leading-[1.04] md:leading-[0.94] text-white max-w-5xl text-balance">
          {about.headline}
        </h2>

        {/* Short Statement Copy */}
        <p className="mt-5 sm:mt-8 text-base sm:text-xl md:text-2xl lg:text-3xl text-[#E0E0E0] max-w-4xl font-light leading-relaxed">
          &ldquo;{about.quote}&rdquo;
        </p>

        {/* 4 Core Architectural Tenets: 1-Col on All Mobile (<768px), 2-Col on Tablet (768px+), 4-Col on Desktop (1024px+) */}
        <div className="mt-10 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {tenets.map((t) => (
            <div
              key={t.num}
              className="p-5 sm:p-6 bg-[#0a0a0a] border border-white/[0.06] rounded-sm hover:border-[#E31B23]/40 transition-colors"
            >
              <div className="font-mono text-xs text-[#E31B23] font-semibold">
                TENET // {t.num}
              </div>
              <h3 className="font-['Syne'] text-lg sm:text-xl font-bold text-white mt-2 sm:mt-3">
                {t.title}
              </h3>
              <p className="text-xs sm:text-[13px] text-[#999] mt-2 sm:mt-3 leading-relaxed font-light">
                {t.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Minimal Signature Footer */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between text-[11px] sm:text-xs font-mono text-[#666] gap-3 text-center md:text-left">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E31B23] shrink-0" />
            <span>HQ · GLOBAL REMOTE ARCHITECTURE</span>
          </div>
          <div>CREATIVE TECHNOLOGY &amp; DIGITAL GROWTH COLLECTIVE</div>
        </div>
      </div>
    </section>
  );
};
