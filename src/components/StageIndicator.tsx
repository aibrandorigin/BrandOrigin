import React, { useEffect, useState } from 'react';
import { getViewportHeight } from '../utils/viewport';

interface Stage {
  id: string;
  num: string;
  label: string;
}

const STAGES: Stage[] = [
  { id: 'services', num: '01', label: 'SERVICES' },
  { id: 'work', num: '02', label: 'PROJECTS' },
  { id: 'about', num: '03', label: 'ABOUT' },
];

export const StageIndicator: React.FC = () => {
  const [activeStage, setActiveStage] = useState<string>('services');
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const vh = getViewportHeight();
      // Only show after scrolling past top hero fold
      const heroHeight = vh * 0.4;
      setVisible(window.scrollY > heroHeight);

      // Check which stage is in the middle of the viewport
      const scrollPos = window.scrollY + vh * 0.4;

      for (let i = STAGES.length - 1; i >= 0; i--) {
        const stage = STAGES[i];
        const el = document.getElementById(stage.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top - 100) {
            setActiveStage(stage.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    window.addEventListener('orientationchange', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('orientationchange', handleScroll);
    };
  }, []);

  const scrollToStage = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed right-6 md:right-8 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-3 select-none">
      <div className="text-[9px] uppercase tracking-widest text-[#555] font-mono mb-1 text-right">
        ORIGIN TIMELINE
      </div>
      {STAGES.map((s) => {
        const isActive = activeStage === s.id;
        return (
          <button
            key={s.id}
            onClick={() => scrollToStage(s.id)}
            className="group flex items-center justify-end gap-3 text-right focus:outline-none py-0.5"
            data-interactive="true"
          >
            <span
              className={`text-[10px] font-mono tracking-wider transition-all duration-200 ${
                isActive
                  ? 'text-white font-semibold translate-x-0 opacity-100'
                  : 'text-[#666] opacity-0 group-hover:opacity-100 group-hover:text-[#A0A0A0] translate-x-1 group-hover:translate-x-0'
              }`}
            >
              {s.num} {s.label}
            </span>
            <div className="relative flex items-center justify-center w-3 h-3">
              <span
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? 'w-2 h-2 bg-[#E31B23] shadow-[0_0_8px_#E31B23]'
                    : 'w-1 h-1 bg-[#444] group-hover:bg-[#888]'
                }`}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
};
