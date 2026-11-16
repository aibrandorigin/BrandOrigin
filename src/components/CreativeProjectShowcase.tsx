import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Layers,
  ChevronRight,
  Activity,
  Cpu,
  BarChart3,
  Flame,
} from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { CaseStudyItem } from '../types';

interface CreativeProjectShowcaseProps {
  onStartOrigin: () => void;
}

export const CreativeProjectShowcase: React.FC<CreativeProjectShowcaseProps> = ({ onStartOrigin }) => {
  const { content } = useCms();
  const caseStudies: CaseStudyItem[] = content.projects && content.projects.length > 0 ? content.projects : [];

  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [filterIndustry, setFilterIndustry] = useState<string>('all');

  const currentProject = caseStudies[activeIdx] || caseStudies[0];

  const industries = ['all', ...Array.from(new Set(caseStudies.map((p) => p.industry).filter(Boolean)))];

  const filteredProjects = filterIndustry === 'all'
    ? caseStudies
    : caseStudies.filter((p) => p.industry === filterIndustry);

  if (!currentProject) return null;

  const executionStepsMeta = [
    { key: 'idea', num: '01', title: 'THE FOUNDER IDEA & THESIS', shortTitle: 'IDEA', color: 'text-[#E31B23]' },
    { key: 'identity', num: '02', title: 'MATHEMATICAL BRAND IDENTITY', shortTitle: 'IDENTITY', color: 'text-[#DDD]' },
    { key: 'digital', num: '03', title: 'DIGITAL PLATFORM & SHADERS', shortTitle: 'DIGITAL', color: 'text-[#38BDF8]' },
    { key: 'marketing', num: '04', title: 'PERFORMANCE MARKETING & REACH', shortTitle: 'MARKETING', color: 'text-[#C084FC]' },
    { key: 'growth', num: '05', title: 'COMMERCIAL VELOCITY & SCALE', shortTitle: 'SCALE', color: 'text-[#10B981]' },
  ] as const;

  const activeSteps: string[] =
    currentProject.selectedSteps && currentProject.selectedSteps.length > 0
      ? currentProject.selectedSteps
      : currentProject.stages
      ? Object.keys(currentProject.stages).filter((k) => Boolean((currentProject.stages as any)[k]))
      : ['idea', 'identity', 'digital', 'growth'];

  const activeStepItems = executionStepsMeta.filter((step) => activeSteps.includes(step.key));

  const populatedStageItems = activeStepItems.filter((step) => {
    const desc = (currentProject.stages as any)?.[step.key];
    return Boolean(desc && String(desc).trim().length > 0);
  });

  return (
    <section
      id="work"
      className="relative min-h-screen w-full py-24 sm:py-32 px-4 sm:px-6 md:px-12 border-t border-white/[0.08] overflow-hidden bg-[#040404]"
    >
      {/* Background Mission Control Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(227,27,35,0.08)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 origin-grid opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.08] pb-6 mb-10">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono text-[#E31B23] tracking-widest uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23] animate-pulse" />
              <span>CLIENT ARCHIVES // PROVEN CASE STUDIES</span>
            </div>
            <h2 className="font-['Syne'] text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase text-white leading-tight">
              PROJECTS.
            </h2>
          </div>

          <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2">
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => setFilterIndustry(ind)}
                className={`px-3 py-1 rounded-xs text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  filterIndustry === ind
                    ? 'bg-[#E31B23] text-white font-bold'
                    : 'bg-[#111] text-[#888] hover:text-white border border-white/10'
                }`}
              >
                {ind === 'all' ? 'All Projects' : ind}
              </button>
            ))}
          </div>
        </div>

        {/* Master Mission Control Terminal Interface */}
        <div className="bg-[#070707] border border-white/[0.12] rounded-xs overflow-hidden shadow-2xl">
          {/* Top Mission Selector Runway */}
          <div className="bg-[#0c0c0c] border-b border-white/[0.08] px-4 py-3 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#E31B23] uppercase font-bold tracking-wider mr-2 hidden sm:inline">
                SELECT PROJECT:
              </span>
              {filteredProjects.map((p, idx) => {
                const isSelected = p.id === currentProject.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      const realIdx = caseStudies.findIndex((item) => item.id === p.id);
                      if (realIdx !== -1) setActiveIdx(realIdx);
                    }}
                    className={`px-3.5 sm:px-4 py-2 rounded-xs font-['Syne'] text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-[#181112] text-white border border-[#E31B23] shadow-[0_0_15px_rgba(227,27,35,0.35)]'
                        : 'bg-[#0a0a0a] text-[#888] hover:text-white border border-white/[0.06] hover:border-white/20'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-[#E31B23]">0{idx + 1}</span>
                    <span>{p.client}</span>
                  </button>
                );
              })}
            </div>

            <div className="text-[10px] font-mono text-[#777] hidden md:flex items-center gap-2 shrink-0">
              <Activity className="w-3.5 h-3.5 text-[#E31B23]" />
              <span>TERMINAL TELEMETRY 120Hz</span>
            </div>
          </div>

          {/* Main Visual Cockpit Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left 7 Columns: Pristine Framed Visual Artifact & Quantified Outcomes */}
            <div className="lg:col-span-7 bg-[#050505] p-5 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/[0.08] relative">
              <div>
                {/* Visual Artifact Frame */}
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xs border border-white/[0.12] bg-[#111] shadow-[0_16px_45px_rgba(0,0,0,0.85)] group">
                  <img
                    src={currentProject.image}
                    alt={currentProject.client}
                    className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Corner Targeting HUD Reticles */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#E31B23] pointer-events-none" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#E31B23] pointer-events-none" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#E31B23] pointer-events-none" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#E31B23] pointer-events-none" />

                  {/* Identification Pill */}
                  <div className="absolute bottom-3 left-4 flex items-center gap-2 bg-[#050505]/90 backdrop-blur-md px-3.5 py-1.5 border border-white/[0.14] rounded-xs shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]" />
                    <span className="text-[11px] font-mono tracking-wider uppercase font-semibold text-white">
                      {currentProject.industry}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantified Outcome Telemetry Nodes */}
              <div className="mt-6 pt-5 border-t border-white/[0.08]">
                <div className="grid grid-cols-1 min-[540px]:grid-cols-3 gap-2.5 sm:gap-3">
                  {currentProject.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="bg-[#0b0b0b] px-3.5 py-2.5 min-[540px]:p-3.5 rounded-xs border border-white/[0.06] hover:border-[#E31B23]/40 transition-colors flex min-[540px]:block items-center justify-between gap-2"
                    >
                      <div className="font-['Syne'] text-lg sm:text-xl font-bold text-[#E31B23] tabular-nums">
                        {m.metric}
                      </div>
                      <div className="text-[10px] font-mono text-[#999] uppercase min-[540px]:mt-0.5 text-right min-[540px]:text-left">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Interactive Intelligence Dossier */}
            <div className="lg:col-span-5 p-5 sm:p-8 flex flex-col justify-between bg-[#080808]">
              <div className="space-y-5">
                <div className="border-b border-white/[0.08] pb-5">
                  <div className="text-[10px] font-mono text-[#E31B23] tracking-widest uppercase mb-2">
                    CASE STUDY FLIGHT DOSSIER
                  </div>

                  <h3 className="font-['Syne'] text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight uppercase leading-snug">
                    {currentProject.client}
                  </h3>

                  <p className="mt-2.5 text-sm sm:text-[15px] text-[#BBB] font-light leading-relaxed">
                    {currentProject.headline}
                  </p>
                </div>

                {/* Origin Execution Steps Matrix (Active Only, No Numbering) */}
                {activeStepItems.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="text-[10px] font-mono uppercase text-[#888]">
                      ORIGIN EXECUTION PROTOCOL
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeStepItems.map((step) => (
                        <div
                          key={step.key}
                          className="px-3.5 py-2 rounded-xs border bg-[#140d0e] border-[#E31B23]/50 text-white flex items-center justify-center"
                        >
                          <span className="text-[11px] font-['Syne'] font-bold uppercase tracking-wider">
                            {step.shortTitle}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stage Architecture Highlights (Active Only, No Numbering) */}
                {populatedStageItems.length > 0 && (
                  <div className="space-y-3 pt-1">
                    {populatedStageItems.slice(0, 3).map((step) => (
                      <div
                        key={step.key}
                        className="p-3.5 bg-[#0e0e0e] border border-white/[0.06] rounded-xs"
                      >
                        <div className={`text-[10px] font-mono uppercase ${step.color} mb-1 font-semibold`}>
                          {step.title}
                        </div>
                        <p className="text-xs text-[#CCC] leading-relaxed">
                          {(currentProject.stages as any)[step.key]}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Call to Action */}
              <div className="mt-6 pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onStartOrigin}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#E31B23] hover:bg-[#c9141b] text-white font-['Syne'] text-xs font-bold uppercase tracking-widest rounded-xs transition-all shadow-[0_0_20px_rgba(227,27,35,0.4)] flex items-center justify-center gap-2 cursor-pointer hover:scale-102"
                >
                  <span>Originate Similar Impact</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-[10px] font-mono text-[#666]">
                  MISSION 0{activeIdx + 1} OF 0{caseStudies.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
