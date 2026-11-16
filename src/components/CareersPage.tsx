import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle2,
  X,
  Lock,
  Send,
} from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { CareerOpening } from '../types';
import { BrandOriginLogo } from './BrandOriginLogo';

interface CareersPageProps {
  onBackToHome: (sectionId?: string) => void;
  onStartProject: () => void;
}

const CULTURE_PILLARS = [
  {
    num: '01',
    title: 'Ownership Over Hierarchy',
    desc: 'Every strategist, designer, and engineer owns outcomes from founder brief to production deployment without bureaucratic layers.',
  },
  {
    num: '02',
    title: 'Uncompromising Craft',
    desc: 'We treat typographic precision, 120Hz frame budgets, and mathematical unit economics as non-negotiable standards.',
  },
  {
    num: '03',
    title: 'Multidisciplinary Pods',
    desc: 'Brand identity architects, creative technologists, and quantitative growth leads build side by side under one roof.',
  },
  {
    num: '04',
    title: 'Compounding Trajectory',
    desc: 'Competitive Indian Rupee compensation, performance incentives, and direct exposure to category-defining ventures.',
  },
];

export const CareersPage: React.FC<CareersPageProps> = ({
  onBackToHome,
  onStartProject,
}) => {
  const { content, addCareerApplication, openCms } = useCms();
  const allOpenings: CareerOpening[] = content.careers || [];
  const activeOpenings = useMemo(
    () => allOpenings.filter((item) => item.status === 'active'),
    [allOpenings]
  );

  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedRoleId, setExpandedRoleId] = useState<string | null>(
    activeOpenings[0]?.id || null
  );

  // Application Modal State
  const [applyingRole, setApplyingRole] = useState<CareerOpening | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantPortfolio, setApplicantPortfolio] = useState('');
  const [applicantExperience, setApplicantExperience] = useState('');
  const [applicantNote, setApplicantNote] = useState('');
  const [formError, setFormError] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const departments = useMemo(() => {
    const unique = Array.from(
      new Set(activeOpenings.map((o) => o.department).filter(Boolean))
    );
    return ['All', ...unique];
  }, [activeOpenings]);

  const filteredOpenings = useMemo(() => {
    return activeOpenings.filter((role) => {
      const matchesDept =
        selectedDepartment === 'All' || role.department === selectedDepartment;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesDept;
      const matchesText =
        role.title.toLowerCase().includes(q) ||
        role.department.toLowerCase().includes(q) ||
        role.location.toLowerCase().includes(q) ||
        role.summary.toLowerCase().includes(q);
      return matchesDept && matchesText;
    });
  }, [activeOpenings, selectedDepartment, searchQuery]);

  const handleOpenApplication = (role: CareerOpening) => {
    setApplyingRole(role);
    setFormError('');
    setSubmittedSuccess(false);
  };

  const handleOpenGeneralApplication = () => {
    setApplyingRole({
      id: 'general-application',
      title: 'General Portfolio Application',
      department: '',
      location: '',
      type: 'Full-Time',
      experience: 'Open',
      compensation: 'Competitive Package (₹ INR)',
      summary: 'Open application for exceptional designers, engineers, and strategists.',
      responsibilities: [],
      requirements: [],
      status: 'active',
      postedAt: new Date().toISOString().split('T')[0],
    });
    setFormError('');
    setSubmittedSuccess(false);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingRole) return;

    if (!applicantName.trim() || !applicantEmail.trim()) {
      setFormError('Please provide your full name and email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(applicantEmail.trim())) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!applicantPortfolio.trim()) {
      setFormError('Please share a link to your portfolio, GitHub, or LinkedIn profile.');
      return;
    }

    addCareerApplication({
      openingId: applyingRole.id,
      openingTitle: applyingRole.title,
      department: applyingRole.department,
      name: applicantName.trim(),
      email: applicantEmail.trim(),
      phone: applicantPhone.trim() || 'Not specified',
      portfolioUrl: applicantPortfolio.trim(),
      experience: applicantExperience.trim() || applyingRole.experience,
      coverNote: applicantNote.trim() || 'Submitted via Brand Origin Careers Page.',
    });

    setFormError('');
    setSubmittedSuccess(true);
    setApplicantName('');
    setApplicantEmail('');
    setApplicantPhone('');
    setApplicantPortfolio('');
    setApplicantExperience('');
    setApplicantNote('');
  };

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

          <div className="flex items-center gap-3 text-xs font-mono text-[#888] tabular-nums">
            <span>OPEN ROLES:</span>
            <strong className="text-white">{activeOpenings.length}</strong>
          </div>
        </div>

        {/* Section 1: Careers Hero Proposition */}
        <section className="mb-16 sm:mb-24">
          <div className="text-xs font-mono uppercase tracking-widest text-[#E31B23] mb-3">
            CAREERS AT BRAND ORIGIN
          </div>
          <h1 className="font-['Syne'] text-[clamp(2rem,6.5vw,4.25rem)] font-black uppercase tracking-tight leading-[1.04] text-white text-balance max-w-4xl">
            BUILD THE ORIGIN OF{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-[#F5F5F5] to-[#888]">
              ICONIC BRANDS.
            </span>
          </h1>
          <p className="mt-5 sm:mt-6 text-sm sm:text-base md:text-lg text-[#A0A0A0] max-w-2xl leading-relaxed font-normal">
            We are an interdisciplinary collective of brand strategists, identity
            designers, creative technologists, and quantitative growth architects.
            Join us to turn ambitious ideas into category-leading businesses.
          </p>

          {/* 4 Culture Pillars Grid */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {CULTURE_PILLARS.map((pillar) => (
              <div
                key={pillar.num}
                className="p-6 bg-[#0B0B0C]/90 border border-white/[0.08] hover:border-white/[0.18] transition-colors rounded-xs flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-mono text-[#E31B23] font-semibold tabular-nums mb-3">
                    {pillar.num}.
                  </div>
                  <h2 className="font-['Syne'] text-lg font-bold text-white tracking-tight mb-2">
                    {pillar.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#999] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Interactive Department Filter Controls & Openings Directory */}
        <section id="openings-directory" className="mb-20 sm:mb-28">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 mb-8 border-b border-white/[0.08]">
            <div>
              <h2 className="font-['Syne'] text-[clamp(1.65rem,4.5vw,2.75rem)] font-bold uppercase tracking-tight text-white leading-tight">
                Open Positions
              </h2>
              <p className="text-xs sm:text-sm text-[#888] mt-1">
                Select a position to inspect role deliverables, requirements, and submit your application.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-[#666] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search role, team, or city..."
                className="w-full bg-[#0E0E10] border border-white/[0.1] focus:border-[#E31B23] rounded-xs pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-[#666] outline-none transition-colors"
              />
            </div>
          </div>

          {/* Interactive Department Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-2 mb-8">
            {departments.map((dept) => {
              const isSelected = selectedDepartment === dept;
              const count =
                dept === 'All'
                  ? activeOpenings.length
                  : activeOpenings.filter((o) => o.department === dept).length;

              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
                    isSelected
                      ? 'bg-[#E31B23] text-white font-semibold'
                      : 'bg-[#111113] text-[#999] hover:text-white border border-white/[0.07]'
                  }`}
                >
                  {dept} ({count})
                </button>
              );
            })}
          </div>

          {/* Active Openings List */}
          {filteredOpenings.length === 0 ? (
            <div className="p-10 sm:p-14 bg-[#0B0B0C] border border-white/[0.08] rounded-xs text-center space-y-4">
              <div className="font-['Syne'] text-xl font-bold text-white">
                No matching openings found
              </div>
              <p className="text-sm text-[#888] max-w-md mx-auto">
                We are always looking for extraordinary talent across strategy, design, engineering, and growth.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleOpenGeneralApplication}
                  className="px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-xs transition-colors cursor-pointer"
                >
                  Submit Open Portfolio Application
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOpenings.map((role, idx) => {
                const isExpanded = expandedRoleId === role.id;
                const roleNumber = String(idx + 1).padStart(2, '0');

                return (
                  <div
                    key={role.id}
                    className={`bg-[#0B0B0D] border transition-colors rounded-xs ${
                      isExpanded
                        ? 'border-[#E31B23]/60'
                        : 'border-white/[0.08] hover:border-white/[0.2]'
                    }`}
                  >
                    {/* Role Summary Header Row */}
                    <div
                      onClick={() =>
                        setExpandedRoleId(isExpanded ? null : role.id)
                      }
                      className="p-5 sm:p-7 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2 min-w-0">
                        {/* Clean Unboxed Metadata with Typographic Separators */}
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-[#999] tabular-nums">
                          <span className="text-[#E31B23] font-semibold">
                            {roleNumber}.
                          </span>
                          <span className="text-white font-medium">
                            {role.department}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{role.location}</span>
                          <span aria-hidden="true">·</span>
                          <span>{role.type}</span>
                          {role.experience && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>{role.experience}</span>
                            </>
                          )}
                          {role.compensation && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-zinc-300">
                                {role.compensation}
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="font-['Syne'] text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">
                          {role.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed max-w-3xl">
                          {role.summary}
                        </p>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/[0.06]">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenApplication(role);
                          }}
                          className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Apply Now</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          aria-label={
                            isExpanded ? 'Collapse role details' : 'Expand role details'
                          }
                          className="p-2.5 text-[#999] hover:text-white bg-white/[0.03] border border-white/[0.08] rounded-xs transition-colors cursor-pointer"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Role Specification */}
                    {isExpanded && (
                      <div className="px-5 sm:px-7 pb-6 sm:pb-8 pt-4 border-t border-white/[0.08] grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                        <div>
                          <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold mb-3">
                            01. Key Responsibilities
                          </h4>
                          {role.responsibilities &&
                          role.responsibilities.length > 0 ? (
                            <ul className="space-y-2.5 text-xs sm:text-sm text-[#B0B0B0] leading-relaxed">
                              {role.responsibilities.map((item, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                  <span className="text-[#E31B23] font-mono select-none">
                                    —
                                  </span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs sm:text-sm text-[#888]">
                              Partner with founders and multidisciplinary leads to deliver high-impact outcomes.
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col justify-between gap-6">
                          <div>
                            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold mb-3">
                              02. Craft &amp; Experience Requirements
                            </h4>
                            {role.requirements && role.requirements.length > 0 ? (
                              <ul className="space-y-2.5 text-xs sm:text-sm text-[#B0B0B0] leading-relaxed">
                                {role.requirements.map((req, i) => (
                                  <li key={i} className="flex items-start gap-2.5">
                                    <span className="text-[#E31B23] font-mono select-none">
                                      —
                                    </span>
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-xs sm:text-sm text-[#888]">
                                Strong portfolio of shipped production work and collaborative execution.
                              </p>
                            )}
                          </div>

                          <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
                            <div className="text-xs font-mono text-[#777] tabular-nums">
                              Posted {role.postedAt || '2026'}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleOpenApplication(role)}
                              className="px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-xs transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2"
                            >
                              <span>Apply for {role.title}</span>
                              <ArrowUpRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Section 3: Open Portfolio Callout */}
        <section className="p-7 sm:p-10 bg-[#0B0B0D] border border-white/[0.08] rounded-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-16">
          <div className="space-y-2 max-w-xl">
            <h3 className="font-['Syne'] text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">
              Don&apos;t See Your Exact Role?
            </h3>
            <p className="text-xs sm:text-sm text-[#999] leading-relaxed">
              We create custom roles for extraordinary creative technologists, brand thinkers, and growth engineers. Share your body of work with our founding team.
            </p>
          </div>
          <button
            onClick={handleOpenGeneralApplication}
            className="w-full md:w-auto px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-white bg-[#151518] hover:bg-[#1E1E22] border border-white/[0.14] hover:border-[#E31B23]/60 rounded-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer text-center"
          >
            Submit General Application
          </button>
        </section>

        {/* Footer with Same-Tab Links & Admin Portal Trigger */}
        <footer className="pt-10 pb-6 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-[#666]">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={openCms}
              className="text-white hover:text-[#E31B23] font-['Syne'] font-bold tracking-tight transition-colors flex items-center gap-1.5 group cursor-pointer focus:outline-none"
              title="Access Brand Origin Admin CMS Portal to manage openings"
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
            <button
              onClick={onStartProject}
              className="text-[#E31B23] hover:underline cursor-pointer uppercase"
            >
              Start a Project
            </button>
          </div>
        </footer>
      </div>

      {/* Role Application Modal (Same Tab) */}
      {applyingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
          <div className="relative w-full max-w-lg my-auto bg-[#0A0A0C] border border-white/[0.12] rounded-xs shadow-2xl overflow-hidden max-h-[calc(100dvh-1.25rem)] sm:max-h-[calc(100dvh-2rem)] flex flex-col">
            {/* Modal Header */}
            <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-white/[0.08] flex items-center justify-between gap-3 shrink-0">
              <div className="min-w-0">
                {applyingRole.id !== 'general-application' &&
                  (applyingRole.department || applyingRole.location) && (
                    <div className="text-[10px] sm:text-[11px] font-mono text-[#E31B23] uppercase tracking-wider mb-0.5 truncate">
                      {[applyingRole.department, applyingRole.location]
                        .filter(Boolean)
                        .join(' · ')}
                    </div>
                  )}
                <h3 className="font-['Syne'] text-base sm:text-lg font-bold text-white leading-snug truncate">
                  {applyingRole.title}
                </h3>
              </div>
              <button
                onClick={() => setApplyingRole(null)}
                className="text-[#888] hover:text-white p-1.5 rounded-xs bg-white/[0.04] border border-white/[0.08] cursor-pointer shrink-0"
                aria-label="Close application modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto">
              {submittedSuccess ? (
                <div className="py-6 sm:py-8 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="font-['Syne'] text-lg sm:text-xl font-bold text-white uppercase">
                    Application Received
                  </h4>
                  <p className="text-xs sm:text-sm text-[#A0A0A0] max-w-md mx-auto leading-relaxed">
                    Thank you for applying for{' '}
                    <span className="text-white font-medium">
                      {applyingRole.title}
                    </span>
                    . Our team reviews every portfolio and will reach out if there is a strong alignment.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setApplyingRole(null)}
                      className="px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-xs transition-colors cursor-pointer"
                    >
                      Return to Openings
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitApplication} className="space-y-2.5 sm:space-y-3">
                  {formError && (
                    <div className="p-2.5 bg-red-950/50 border border-red-500/40 rounded-xs text-xs text-red-200 font-mono">
                      {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-2.5 sm:gap-3">
                    <div>
                      <label className="block text-[10px] sm:text-[11px] font-mono uppercase text-[#999] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        placeholder="Aarav Sharma"
                        className="w-full bg-[#121215] border border-white/[0.1] focus:border-[#E31B23] rounded-xs px-3 py-2 text-xs text-white placeholder-[#555] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] sm:text-[11px] font-mono uppercase text-[#999] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        placeholder="aarav@domain.com"
                        className="w-full bg-[#121215] border border-white/[0.1] focus:border-[#E31B23] rounded-xs px-3 py-2 text-xs text-white placeholder-[#555] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-2.5 sm:gap-3">
                    <div>
                      <label className="block text-[10px] sm:text-[11px] font-mono uppercase text-[#999] mb-1">
                        Phone &amp; Current City
                      </label>
                      <input
                        type="text"
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        placeholder="+91 98765 43210 · Bengaluru"
                        className="w-full bg-[#121215] border border-white/[0.1] focus:border-[#E31B23] rounded-xs px-3 py-2 text-xs text-white placeholder-[#555] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] sm:text-[11px] font-mono uppercase text-[#999] mb-1">
                        Years of Experience
                      </label>
                      <input
                        type="text"
                        value={applicantExperience}
                        onChange={(e) => setApplicantExperience(e.target.value)}
                        placeholder="e.g., 5 Years"
                        className="w-full bg-[#121215] border border-white/[0.1] focus:border-[#E31B23] rounded-xs px-3 py-2 text-xs text-white placeholder-[#555] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-mono uppercase text-[#999] mb-1">
                      Portfolio / GitHub / LinkedIn URL *
                    </label>
                    <input
                      type="text"
                      required
                      value={applicantPortfolio}
                      onChange={(e) => setApplicantPortfolio(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-[#121215] border border-white/[0.1] focus:border-[#E31B23] rounded-xs px-3 py-2 text-xs text-white placeholder-[#555] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-mono uppercase text-[#999] mb-1">
                      Brief Note / Proudest Shipped Work
                    </label>
                    <textarea
                      rows={2}
                      value={applicantNote}
                      onChange={(e) => setApplicantNote(e.target.value)}
                      placeholder="Tell us about a brand, product, or growth system you built from the ground up..."
                      className="w-full bg-[#121215] border border-white/[0.1] focus:border-[#E31B23] rounded-xs px-3 py-2 text-xs text-white placeholder-[#555] outline-none resize-none"
                    />
                  </div>

                  <div className="pt-1.5 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setApplyingRole(null)}
                      className="px-3.5 py-2 text-xs font-mono uppercase text-[#888] hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-xs transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Application</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
