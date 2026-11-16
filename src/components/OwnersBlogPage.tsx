import React, { useMemo } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  Lock,
  Quote,
} from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { OwnerBlogPost, OwnerProfile } from '../types';

interface OwnersBlogPageProps {
  onBackToHome: (sectionId?: string) => void;
  onOpenCareers?: () => void;
  onStartProject: () => void;
}

const DefaultOwnerPortraitSvg: React.FC<{ name: string }> = ({ name }) => (
  <div className="w-full h-full bg-gradient-to-b from-[#17171D] via-[#0F0F14] to-[#08080A] flex flex-col items-center justify-center relative overflow-hidden p-6 text-center">
    {/* Subtle crimson radial studio light */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          'radial-gradient(circle at 50% 34%, rgba(227,27,35,0.26) 0%, rgba(140,10,15,0.08) 48%, transparent 75%)',
      }}
    />
    {/* Architectural grid lines */}
    <div
      className="absolute inset-0 opacity-15 pointer-events-none"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)',
        backgroundSize: '36px 36px',
      }}
    />
    {/* Executive Founder Portrait Illustration */}
    <svg
      viewBox="0 0 260 320"
      className="w-48 h-60 sm:w-56 sm:h-68 relative z-10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={name}
    >
      <defs>
        <linearGradient id="suitGrad" x1="130" y1="175" x2="130" y2="320" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#26262E" />
          <stop offset="100%" stopColor="#0B0B0F" />
        </linearGradient>
        <linearGradient id="shirtGrad" x1="130" y1="180" x2="130" y2="265" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E8E8EC" />
          <stop offset="100%" stopColor="#9A9AA6" />
        </linearGradient>
        <linearGradient id="skinGrad" x1="130" y1="52" x2="130" y2="175" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D6A78A" />
          <stop offset="100%" stopColor="#A67558" />
        </linearGradient>
        <linearGradient id="hairGrad" x1="130" y1="36" x2="130" y2="108" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#23232A" />
          <stop offset="100%" stopColor="#0E0E12" />
        </linearGradient>
      </defs>

      {/* Studio Rim Halo */}
      <circle
        cx="130"
        cy="115"
        r="74"
        stroke="#E31B23"
        strokeOpacity="0.38"
        strokeWidth="1.2"
        strokeDasharray="4 4"
      />

      {/* Tailored Executive Shoulders & Suit Jacket */}
      <path
        d="M24 318C30 238 70 198 130 198C190 198 230 238 236 318H24Z"
        fill="url(#suitGrad)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.5"
      />

      {/* Dress Shirt & Collar */}
      <path d="M104 198L130 264L156 198H104Z" fill="url(#shirtGrad)" />

      {/* Executive Tie */}
      <path d="M124 206H136L139 254L130 266L121 254L124 206Z" fill="#E31B23" />

      {/* Suit Lapels */}
      <path
        d="M96 198L130 266L164 198"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.6"
      />

      {/* Crimson Lapel Pin */}
      <circle cx="160" cy="232" r="3.5" fill="#E31B23" />

      {/* Neck & Jaw Shadow */}
      <rect x="112" y="152" width="36" height="50" rx="14" fill="url(#skinGrad)" />
      <path d="M112 165Q130 178 148 165V182H112V165Z" fill="rgba(0,0,0,0.22)" />

      {/* Ears */}
      <rect x="82" y="102" width="10" height="24" rx="5" fill="#B88668" />
      <rect x="168" y="102" width="10" height="24" rx="5" fill="#B88668" />

      {/* Head Contour */}
      <rect
        x="88"
        y="56"
        width="84"
        height="110"
        rx="42"
        fill="url(#skinGrad)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.2"
      />

      {/* Styled Hair & Side Part */}
      <path
        d="M86 98C86 64 104 46 132 46C158 46 174 64 174 98C168 80 154 70 132 70C108 70 94 78 86 98Z"
        fill="url(#hairGrad)"
      />

      {/* Eyebrows & Eyes */}
      <path d="M104 102Q113 98 122 101" stroke="#1E1E24" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M138 101Q147 98 156 102" stroke="#1E1E24" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="113" cy="110" r="3.2" fill="#18181D" />
      <circle cx="147" cy="110" r="3.2" fill="#18181D" />

      {/* Subtle Nose & Confident Expression */}
      <path d="M130 108V126L125 130" stroke="rgba(0,0,0,0.28)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M118 142Q130 149 142 142" stroke="#5A3828" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  </div>
);

export const OwnersBlogPage: React.FC<OwnersBlogPageProps> = ({
  onBackToHome,
  onOpenCareers,
  onStartProject,
}) => {
  const { content, openCms } = useCms();

  const ownerProfile: OwnerProfile = content.ownerProfile || {
    name: 'Founder & Managing Director',
    role: 'Founder & Principal Architect · Brand Origin',
    headline: 'THE VISION & LEADERSHIP BEHIND BRAND ORIGIN.',
    image: '',
    bio: `As the Founder and Principal Architect of Brand Origin, he established the agency with a singular conviction: ambitious ideas deserve more than fragmented agencies and surface-level aesthetics—they deserve a unified origin where strategy, identity, technology, and commercial growth compound together.\n\nWith deep multidisciplinary expertise spanning category positioning, mathematical brand identity systems, high-frequency digital engineering, and quantitative growth architecture, he works directly with founders and executive teams to transform raw concepts into category-leading ventures.\n\nUnder his leadership, Brand Origin has partnered with high-growth companies across clean mobility, quantitative fintech, luxury acoustics, and enterprise technology—architecting brand ecosystems that command lasting market authority and measurable revenue velocity.`,
    quote:
      'We do not just design how a brand looks—we architect the foundation from which its entire market identity, digital experience, and commercial growth originate.',
  };

  const allSections: OwnerBlogPost[] = content.ownerBlogs || [];
  const publishedSections = useMemo(
    () => allSections.filter((item) => item.status === 'published'),
    [allSections]
  );

  // Show the uploaded owner photo whenever a valid non-logo photo URL/dataURL is set
  const hasCustomOwnerPhoto =
    Boolean(ownerProfile.image) &&
    !ownerProfile.image.includes('brand_origin_logo');

  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-hidden overflow-x-clip pt-28 sm:pt-32 md:pt-32 pb-16 px-4 sm:px-6 md:px-12 text-[#F5F5F5]">
      {/* Subtle Ambient Crimson Radial Field */}
      <div
        className="pointer-events-none absolute top-16 left-1/2 -translate-x-1/2 w-[min(340px,88vw)] sm:w-[min(640px,85vw)] lg:w-[880px] h-[360px] rounded-full opacity-25 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(227,27,35,0.28) 0%, rgba(140,10,15,0.08) 50%, transparent 75%)',
        }}
      />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* Top Return Navigation Bar (Same Tab) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 sm:mb-14 border-b border-white/[0.08]">
          <button
            onClick={() => onBackToHome()}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#A0A0A0] hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-[#E31B23] transition-transform group-hover:-translate-x-1" />
            <span>Back to Brand Origin Home</span>
          </button>
        </div>

        {/* Section 1: Owner Portrait Photo & Content About Our Owner */}
        <section className="mb-16 sm:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Owner's Portrait Photo Showcase */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="p-4 sm:p-5 bg-[#0B0B0D] border border-white/[0.12] rounded-xs shadow-2xl">
                <div className="aspect-[3/4] w-full rounded-xs overflow-hidden border border-white/[0.1] bg-[#121215] relative">
                  {hasCustomOwnerPhoto ? (
                    <img
                      src={ownerProfile.image}
                      alt={ownerProfile.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <DefaultOwnerPortraitSvg name={ownerProfile.name} />
                  )}

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/65 to-transparent p-4 sm:p-5">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-[#E31B23]">
                      OUR OWNER &amp; FOUNDER · BRAND ORIGIN
                    </div>
                    <h2 className="font-['Syne'] text-xl sm:text-2xl font-bold text-white mt-0.5 leading-tight">
                      {ownerProfile.name}
                    </h2>
                    <div className="text-xs font-mono text-[#CCC] mt-1">
                      {ownerProfile.role}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Content About Our Owner */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-[#E31B23] mb-3">
                  OWNER&apos;S BLOG · ABOUT OUR OWNER
                </div>
                <h1 className="font-['Syne'] text-[clamp(1.85rem,5.2vw,3.5rem)] font-black uppercase tracking-tight leading-[1.05] text-white text-balance">
                  {ownerProfile.headline || 'THE VISION & LEADERSHIP BEHIND BRAND ORIGIN.'}
                </h1>
              </div>

              {/* Signature Quote from the Owner */}
              {ownerProfile.quote && (
                <div className="p-5 sm:p-6 bg-[#0B0B0D] border-l-2 border-[#E31B23] border-y border-r border-white/[0.08] rounded-xs space-y-2.5">
                  <Quote className="w-5 h-5 text-[#E31B23]" />
                  <p className="text-sm sm:text-base md:text-lg text-white italic leading-relaxed">
                    &ldquo;{ownerProfile.quote}&rdquo;
                  </p>
                  <div className="text-xs font-mono text-[#999]">
                    — {ownerProfile.name}, {ownerProfile.role}
                  </div>
                </div>
              )}

              {/* Full Multi-Paragraph Story / Content About the Owner */}
              <div className="space-y-5 text-sm sm:text-base md:text-[17px] text-[#D0D0D0] leading-[1.8] font-normal">
                {(ownerProfile.bio || '')
                  .split(/\n\n+/)
                  .map((p) => p.trim())
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <p key={index} className="text-pretty">
                      {paragraph}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Additional Content / Stories About Our Owner (Added via Admin Portal) */}
        {publishedSections.length > 0 && (
          <section className="mb-20 sm:mb-24 space-y-8">
            <div className="border-b border-white/[0.08] pb-4">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-[#E31B23] mb-1">
                  FOUNDER JOURNEY &amp; LEADERSHIP
                </div>
                <h2 className="font-['Syne'] text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
                  More About Our Owner &amp; Vision
                </h2>
              </div>
            </div>

            <div className="space-y-8">
              {publishedSections.map((section, idx) => {
                const sectionNumber = String(idx + 1).padStart(2, '0');
                const sectionPhoto =
                  section.coverImage ||
                  (section.ownerImage && !section.ownerImage.includes('brand_origin_logo')
                    ? section.ownerImage
                    : '');

                return (
                  <article
                    key={section.id}
                    className="p-6 sm:p-8 md:p-10 bg-[#0B0B0D] border border-white/[0.08] rounded-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                  >
                    <div
                      className={
                        sectionPhoto ? 'lg:col-span-7 space-y-4' : 'lg:col-span-12 space-y-4'
                      }
                    >
                      {/* Clean Unboxed Metadata */}
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono text-[#999] tabular-nums">
                        <span className="text-[#E31B23] font-semibold">
                          {sectionNumber}.
                        </span>
                        <span className="text-white font-medium uppercase">
                          {section.category || 'About Our Owner'}
                        </span>
                        {section.publishedAt && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{section.publishedAt}</span>
                          </>
                        )}
                      </div>

                      <h3 className="font-['Syne'] text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug">
                        {section.title}
                      </h3>

                      {section.excerpt && (
                        <p className="text-sm sm:text-base text-white/90 font-medium leading-relaxed">
                          {section.excerpt}
                        </p>
                      )}

                      <div className="space-y-4 text-xs sm:text-sm md:text-base text-[#B8B8B8] leading-[1.8]">
                        {section.content
                          .split(/\n\n+/)
                          .map((p) => p.trim())
                          .filter(Boolean)
                          .map((para, i) => (
                            <p key={i} className="text-pretty">
                              {para}
                            </p>
                          ))}
                      </div>
                    </div>

                    {sectionPhoto && (
                      <div className="lg:col-span-5 w-full rounded-xs overflow-hidden border border-white/[0.1] bg-[#121215]">
                        <img
                          src={sectionPhoto}
                          alt={section.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover max-h-[420px]"
                        />
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* Section 3: Connect with Brand Origin CTA */}
        <section className="p-7 sm:p-10 bg-[#0B0B0D] border border-white/[0.08] rounded-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-16">
          <div className="space-y-2 max-w-xl">
            <h3 className="font-['Syne'] text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">
              Partner Directly With Our Founding Team
            </h3>
            <p className="text-xs sm:text-sm text-[#999] leading-relaxed">
              Ready to build your brand from the origin up? Initiate a project brief to collaborate with our founder and multidisciplinary studio.
            </p>
          </div>
          <button
            onClick={onStartProject}
            className="w-full md:w-auto px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </section>

        {/* Footer with Same-Tab Links & Admin Portal Trigger */}
        <footer className="pt-10 pb-6 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-[#666]">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={openCms}
              className="text-white hover:text-[#E31B23] font-['Syne'] font-bold tracking-tight transition-colors flex items-center gap-1.5 group cursor-pointer focus:outline-none"
              title="Access Brand Origin Admin CMS Portal to manage Owner's Blog"
            >
              <span>BRAND ORIGIN</span>
              <Lock className="w-3 h-3 text-[#E31B23] opacity-70 group-hover:opacity-100 transition-opacity" />
              <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#E31B23]/15 text-[#E31B23] rounded-xs border border-[#E31B23]/30">
                CMS
              </span>
            </button>
            <span>© 2026. ALL RIGHTS RESERVED.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5">
            <button
              onClick={() => onBackToHome()}
              className="hover:text-white transition-colors cursor-pointer uppercase"
            >
              Home
            </button>
            <button
              onClick={() => onBackToHome('services')}
              className="hover:text-white transition-colors cursor-pointer uppercase"
            >
              Services
            </button>
            <button
              onClick={() => onBackToHome('work')}
              className="hover:text-white transition-colors cursor-pointer uppercase"
            >
              Projects
            </button>
            <button
              onClick={() => onBackToHome('about')}
              className="hover:text-white transition-colors cursor-pointer uppercase"
            >
              About
            </button>
            {onOpenCareers && (
              <button
                onClick={onOpenCareers}
                className="hover:text-white transition-colors cursor-pointer uppercase"
              >
                Careers
              </button>
            )}
            <button
              onClick={onStartProject}
              className="text-[#E31B23] hover:underline cursor-pointer uppercase"
            >
              Start a Project
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
