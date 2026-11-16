import React from 'react';
import { ArrowRight } from 'lucide-react';
import { BrandOriginLogo } from './BrandOriginLogo';

interface TransformationSectionProps {
  onStartOrigin: () => void;
  onExploreServices: () => void;
}

export const TransformationSection: React.FC<TransformationSectionProps> = ({
  onStartOrigin,
  onExploreServices,
}) => {
  return (
    <section className="relative min-h-[90svh] sm:min-h-screen w-full py-20 sm:py-28 px-4 sm:px-6 md:px-12 border-t border-white/[0.06] overflow-hidden flex flex-col justify-center items-center text-center bg-[#030303]">
      {/* Rich pure crimson radial backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(227,27,35,0.2)_0%,rgba(140,10,15,0.08)_40%,transparent_70%)] blur-2xl" />

      <div className="max-w-5xl mx-auto w-full relative z-10 flex flex-col items-center">
        {/* The Return of the Origin Dot, expanding into the Official 3D Master Emblem */}
        <div className="relative mb-6 sm:mb-8 flex flex-col items-center justify-center w-full">
          <div className="p-4 sm:p-6 md:p-8 rounded-xl bg-[radial-gradient(circle_at_center,#8f0c12_0%,#54060a_60%,#1a0203_100%)] border border-red-500/30 shadow-[0_0_50px_rgba(227,27,35,0.35)] scale-90 sm:scale-100 max-w-full">
            <BrandOriginLogo
              variant="full"
              size={110}
              color="silver"
              showTagline={true}
              glow={true}
            />
          </div>
        </div>

        {/* Primary Monolithic Headline */}
        <h2 className="font-['Syne'] text-[clamp(1.85rem,7vw,3.35rem)] md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tight text-white leading-[1.05] md:leading-[0.94] text-balance">
          YOUR BRAND. <br />
          <span className="text-[#E31B23]">ORIGINATED WITH PURPOSE.</span>
        </h2>

        {/* Manifesto Triad */}
        <div className="mt-6 sm:mt-8 space-y-1.5 sm:space-y-2">
          <div className="font-['Syne'] text-base min-[375px]:text-lg sm:text-2xl md:text-3xl font-bold uppercase tracking-wider text-white">
            BUILT TO BE SEEN.
          </div>
          <div className="font-['Syne'] text-base min-[375px]:text-lg sm:text-2xl md:text-3xl font-bold uppercase tracking-wider text-[#A0A0A0]">
            BUILT TO BE REMEMBERED.
          </div>
          <div className="font-['Syne'] text-base min-[375px]:text-lg sm:text-2xl md:text-3xl font-bold uppercase tracking-wider text-[#E31B23]">
            BUILT TO GROW.
          </div>
        </div>

        {/* Secondary supportive narrative */}
        <p className="mt-5 sm:mt-8 text-sm sm:text-base md:text-lg text-[#A0A0A0] max-w-md sm:max-w-xl font-light leading-relaxed text-balance px-1 sm:px-2">
          Every touchpoint in your company is an opportunity to prove category leadership. Let us build the origin foundation that turns your ambition into reality.
        </p>

        {/* Action Button Pair: Unified Mobile Stack (< 768px), Side-by-Side Row on Tablet & Desktop (>= 768px) */}
        <div className="mt-8 sm:mt-10 flex flex-col md:flex-row items-stretch md:items-center justify-center gap-3 sm:gap-4 md:gap-6 w-full max-w-sm md:max-w-none mx-auto px-1 sm:px-0">
          <button
            onClick={onStartOrigin}
            className="w-full md:w-auto px-8 py-3.5 sm:py-4 text-xs md:text-sm font-semibold uppercase tracking-widest text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-sm transition-all duration-200 shadow-[0_0_30px_rgba(227,27,35,0.45)] hover:shadow-[0_0_45px_rgba(227,27,35,0.7)] hover:-translate-y-0.5 active:translate-y-0 min-h-[48px] flex items-center justify-center cursor-pointer"
          >
            Build Your Brand With Us
          </button>
          <button
            onClick={onExploreServices}
            className="w-full md:w-auto px-8 py-3.5 sm:py-4 text-xs md:text-sm font-semibold uppercase tracking-widest text-[#F5F5F5] bg-[#111111]/80 hover:bg-[#1a1a1a] border border-white/[0.12] hover:border-white/[0.25] rounded-sm transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 group min-h-[48px] cursor-pointer"
          >
            <span>View Full Capabilities</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E31B23] transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
