import React, { useState, useEffect } from 'react';
import { X, Check, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useCms } from '../context/CmsContext';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  preselectedService,
}) => {
  const { addEnquiry } = useCms();
  const [step, setStep] = useState<number>(1);
  const [stage, setStage] = useState<string>('End-to-End Origin (Zero → Brand → Growth)');
  const [timeline, setTimeline] = useState<string>('Core Transformation (2–3 Months)');
  const [budget, setBudget] = useState<string>('₹25,00,000 – ₹50,00,000 INR');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    concept: '',
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (preselectedService) {
      setStage(preselectedService);
    }
  }, [preselectedService]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setErrorMsg('Please provide your name and work email address.');
      return;
    }
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setErrorMsg('Please provide a valid email format.');
      return;
    }
    setErrorMsg('');

    // Push into CMS enquiry pipeline
    addEnquiry({
      name: formData.name.trim(),
      email: formData.email.trim(),
      company: formData.company.trim() || 'Undisclosed Venture',
      stage,
      timeline,
      budget,
      concept: formData.concept.trim(),
    });

    setIsSubmitted(true);
  };

  const resetAndClose = () => {
    setIsSubmitted(false);
    setStep(1);
    setFormData({ name: '', email: '', company: '', concept: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/90 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-xl my-auto bg-[#090909] border border-white/[0.12] rounded-xs sm:rounded-sm shadow-2xl overflow-y-auto overflow-x-hidden max-h-[calc(100dvh-1.25rem)] sm:max-h-[calc(100dvh-2rem)] p-4 sm:p-6 text-left">
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[min(384px,85vw)] h-32 bg-[#E31B23]/25 blur-3xl rounded-full" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5 sm:pb-3.5 mb-3.5 sm:mb-5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#E31B23] shadow-[0_0_8px_#E31B23] shrink-0" />
            <span className="font-['Syne'] text-xs sm:text-base font-bold text-white tracking-wide truncate">
              INITIATE YOUR ORIGIN BRIEF
            </span>
          </div>
          <button
            onClick={resetAndClose}
            className="text-[#777] hover:text-white p-1.5 transition-colors focus:outline-none min-w-[32px] min-h-[32px] flex items-center justify-center shrink-0 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Confirmation State */}
        {isSubmitted ? (
          <div className="py-6 sm:py-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E31B23]/15 border border-[#E31B23] mx-auto flex items-center justify-center text-[#E31B23] shadow-[0_0_30px_rgba(227,27,35,0.4)]">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>

            <div>
              <h3 className="font-['Syne'] text-xl sm:text-2xl font-bold text-white uppercase">
                ORIGIN PROTOCOL INITIATED.
              </h3>
              <p className="text-xs sm:text-sm text-[#A0A0A0] max-w-md mx-auto mt-1.5 leading-relaxed font-light">
                Thank you, <span className="text-white font-medium">{formData.name}</span>. Our partners have received your brief for <span className="text-white font-medium">{formData.company || 'your brand'}</span>.
              </p>
            </div>

            <div className="p-3.5 bg-[#111] border border-white/[0.06] rounded-xs text-xs font-mono text-[#888] max-w-md mx-auto text-left space-y-1">
              <div>TARGET STAGE: <span className="text-white">{stage}</span></div>
              <div>TIMELINE: <span className="text-white">{timeline}</span></div>
              <div>STATUS: <span className="text-[#E31B23]">CONFIDENTIAL REVIEW IN PROGRESS (RESPONSE &lt; 12H)</span></div>
            </div>

            <button
              onClick={resetAndClose}
              className="px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-sm transition-all cursor-pointer"
            >
              Return to Experience
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Stage of origin */}
            {step === 1 && (
              <div className="space-y-3 sm:space-y-4">
                <div className="text-[11px] sm:text-xs font-mono text-[#888] uppercase">
                  STEP 01/03 · WHERE IS YOUR BRAND STARTING?
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                  {[
                    'End-to-End Origin (Zero → Brand → Growth)',
                    'Raw Business Idea & Strategy',
                    'Brand Naming & Linguistic Systems',
                    'Master Logo & Visual Identity',
                    'Bespoke Website & App Development',
                    'Performance Marketing & Scaling',
                  ].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setStage(option)}
                      className={`p-2.5 sm:p-3 text-xs text-left rounded-xs border transition-all cursor-pointer ${
                        stage === option
                          ? 'border-[#E31B23] bg-[#161112] text-white font-medium shadow-[0_0_15px_rgba(227,27,35,0.2)]'
                          : 'border-white/[0.08] bg-[#111] text-[#999] hover:border-white/20 hover:text-white'
                      }`}
                      data-interactive="true"
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-sm transition-all cursor-pointer"
                  >
                    <span>Next: Timeline &amp; Scope</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Target Timeframe */}
            {step === 2 && (
              <div className="space-y-4 sm:space-y-5">
                <div className="text-[11px] sm:text-xs font-mono text-[#888] uppercase">
                  STEP 02/03 · TARGET TIMEFRAME
                </div>

                <div>
                  <label className="text-xs text-[#AAA] block mb-2 font-mono">
                    TARGET TIMEFRAME:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      'Rapid Sprint (4–6 Weeks)',
                      'Core Transformation (2–3 Months)',
                      'Enterprise Partnership (Ongoing)',
                    ].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setTimeline(opt)}
                        className={`p-2.5 sm:p-3 text-xs text-center rounded-xs border transition-all cursor-pointer ${
                          timeline === opt
                            ? 'border-[#E31B23] bg-[#161112] text-white font-medium'
                            : 'border-white/[0.08] bg-[#111] text-[#999] hover:text-white'
                        }`}
                        data-interactive="true"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-mono text-[#888] hover:text-white cursor-pointer"
                  >
                    &larr; Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-sm transition-all cursor-pointer"
                  >
                    <span>Next: Founder Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Contact & Concept Details */}
            {step === 3 && (
              <div className="space-y-3">
                <div className="text-[11px] sm:text-xs font-mono text-[#888] uppercase">
                  STEP 03/03 · CONFIDENTIAL FOUNDER BRIEF
                </div>

                {errorMsg && (
                  <div className="p-2.5 bg-red-950/60 border border-red-500/50 text-red-300 text-xs rounded-xs">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-2.5 sm:gap-3">
                  <div>
                    <label className="text-[10px] sm:text-xs font-mono text-[#888] block mb-1">
                      YOUR FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Elena Vance"
                      className="w-full bg-[#111] border border-white/[0.1] focus:border-[#E31B23] rounded-xs px-3 py-2 text-xs text-white placeholder-[#555] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] sm:text-xs font-mono text-[#888] block mb-1">
                      WORK EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="elena@company.com"
                      className="w-full bg-[#111] border border-white/[0.1] focus:border-[#E31B23] rounded-xs px-3 py-2 text-xs text-white placeholder-[#555] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs font-mono text-[#888] block mb-1">
                    COMPANY OR WORKING VENTURE NAME
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. NextGen Autonomous Mobility"
                    className="w-full bg-[#111] border border-white/[0.1] focus:border-[#E31B23] rounded-xs px-3 py-2 text-xs text-white placeholder-[#555] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs font-mono text-[#888] block mb-1">
                    BRIEF CONCEPT / GOALS SUMMARY
                  </label>
                  <textarea
                    rows={2}
                    value={formData.concept}
                    onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
                    placeholder="Describe your current stage, category vision, or target outcomes..."
                    className="w-full bg-[#111] border border-white/[0.1] focus:border-[#E31B23] rounded-xs px-3 py-2 text-xs text-white placeholder-[#555] outline-none resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs font-mono text-[#888] hover:text-white cursor-pointer"
                  >
                    &larr; Back
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-sm transition-all shadow-[0_0_20px_rgba(227,27,35,0.4)] cursor-pointer"
                  >
                    Submit Confidential Brief &rarr;
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
