import React, { useState, useEffect, useRef } from 'react';
import { Bot, Radio, ChevronUp, ChevronDown, Compass, Send, Sparkles, Volume2, VolumeX, Shield, Terminal } from 'lucide-react';
import { useCms } from '../context/CmsContext';

interface AiFlightCompanionProps {
  currentSector: string;
  onNavigateToPlanet?: (planetId: string) => void;
  onNavigateToSection?: (sectionId: string) => void;
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  action?: {
    label: string;
    target: string;
    type: 'planet' | 'section';
  };
}

export const AiFlightCompanion: React.FC<AiFlightCompanionProps> = ({
  currentSector,
  onNavigateToPlanet,
  onNavigateToSection,
}) => {
  const { content } = useCms();
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Greetings, Commander. I am AURA — Brand Origin’s mission intelligence. The master spacecraft is active and synchronized to your flight controls. Where would you like to travel?',
      timestamp: '00:01',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Sector change notification
  const prevSectorRef = useRef(currentSector);
  useEffect(() => {
    if (prevSectorRef.current !== currentSector && currentSector) {
      prevSectorRef.current = currentSector;
      const sectorBriefings: Record<string, string> = {
        'SYS.HERO': 'Entering Genesis Sector. Initializing Brand Origin master propulsion.',
        'STAGE.01 // IDEA': 'Approaching Sector 01: Idea Architecture. Scanning market economics and TAM valuation.',
        'STAGE.02 // DIGITAL': 'Navigating Sector 02: Digital Immersion. 60FPS fluid WebGL interaction protocols engaged.',
        'STAGE.03 // PERFORMANCE': 'Cruising through Sector 03: Performance Engine. High-velocity conversion funnels detected.',
        'SERVICES // SYSTEM': 'Approaching Orbital Technology Grid. 9 Core Autonomous Brand Disciplines available for inspection.',
        'PLANET // AURORA': 'Orbital approach vector locked: Planet Aurora Mobility. Hypercar pre-order pipeline ₹1,500 Cr.',
        'PLANET // ZENITH': 'Orbital approach vector locked: Planet Zenith Terminal. Algorithmic macro-data monolith.',
        'PLANET // KROMA': 'Orbital approach vector locked: Planet Kroma Spatial. Acoustic resonance world active.',
        'SYS.HOMEBASE': 'Initiating final approach trajectory. Aligning docking clamps with Brand Origin Home Base.',
      };

      const brief = sectorBriefings[currentSector];
      if (brief) {
        const time = new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' });
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: brief,
            timestamp: time,
          },
        ]);
      }
    }
  }, [currentSector]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!userInput.trim()) return;

    const userText = userInput.trim();
    const time = new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' });
    
    setMessages((prev) => [...prev, { sender: 'user', text: userText, timestamp: time }]);
    setUserInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const lower = userText.toLowerCase();
      let reply = '';
      let action: Message['action'] | undefined = undefined;

      if (lower.includes('aurora') || lower.includes('zenith') || lower.includes('kroma') || lower.includes('project') || lower.includes('work') || lower.includes('case')) {
        reply = 'Opening Projects archive: real-world transformations engineered from founder thesis to category market monoliths.';
        action = { label: 'Explore Projects', target: 'work', type: 'section' };
      } else if (lower.includes('service') || lower.includes('planet') || lower.includes('web') || lower.includes('app') || lower.includes('strategy')) {
        reply = 'Brand Origin services are mapped across 6 Celestial Capability Planets: Stratos (Strategy), Aether-Web (Web Development), Synapse (App Engineering), Omnicron (Marketing), Valkyrie (Paid Velocity), and Monolith (Enterprise Scale). Navigating to Services.';
        action = { label: 'Explore Services', target: 'services', type: 'section' };
      } else if (lower.includes('contact') || lower.includes('start') || lower.includes('hire')) {
        reply = 'Initiating project brief sequence. You can engage the Brand Origin creative engineering ecosystem directly.';
        action = { label: 'Initiate Brief', target: 'final-cta', type: 'section' };
      } else {
        reply = `Telemetry acknowledged. We are currently travelling through ${currentSector || 'the Brand Origin Cosmos'}. Where shall we chart our course next?`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
          action,
        },
      ]);
    }, 600);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40 select-none">
      {/* Expanded AI HUD Interface */}
      {isOpen ? (
        <div className="w-[calc(100vw-32px)] sm:w-[380px] max-h-[82dvh] h-[480px] bg-[#070707]/95 border border-white/[0.12] rounded-xs shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header Bar */}
          <div className="px-3.5 py-2.5 bg-[#0e0c0d] border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-[#E31B23] animate-pulse" />
                <span className="absolute w-3.5 h-3.5 rounded-full border border-[#E31B23]/40 animate-ping" />
              </div>
              <div>
                <div className="font-['Syne'] text-xs font-bold text-white tracking-wider uppercase flex items-center gap-1.5">
                  <span>AURA // MISSION AI</span>
                  <span className="text-[8px] font-mono px-1 py-0.2 bg-[#E31B23]/20 text-[#E31B23] rounded-xs border border-[#E31B23]/40">
                    FLIGHT COMPANION
                  </span>
                </div>
                <div className="text-[9px] font-mono text-[#777]">
                  SEC: {currentSector || 'COSMOS.FREE_FLIGHT'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="p-1 text-[#888] hover:text-white transition-colors"
                title={isMuted ? 'Unmute Transmission Audio' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#E31B23]" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-[#888] hover:text-white transition-colors"
                title="Minimize AI Companion"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Nav Destination Shortcuts */}
          <div className="px-3 py-1.5 bg-[#090909] border-b border-white/[0.05] flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[9px] font-mono text-[#888]">
            <span className="text-[#555] shrink-0">DESTINATIONS:</span>
            <button
              onClick={() => onNavigateToPlanet?.('aurora')}
              className="px-2 py-0.5 rounded-xs bg-[#121212] hover:bg-[#1a1112] text-white hover:text-[#E31B23] border border-white/5 transition-all whitespace-nowrap"
            >
              Planet Aurora
            </button>
            <button
              onClick={() => onNavigateToPlanet?.('zenith')}
              className="px-2 py-0.5 rounded-xs bg-[#121212] hover:bg-[#1a1112] text-white hover:text-[#E31B23] border border-white/5 transition-all whitespace-nowrap"
            >
              Planet Zenith
            </button>
            <button
              onClick={() => onNavigateToPlanet?.('kroma')}
              className="px-2 py-0.5 rounded-xs bg-[#121212] hover:bg-[#1a1112] text-white hover:text-[#E31B23] border border-white/5 transition-all whitespace-nowrap"
            >
              Planet Kroma
            </button>
            <button
              onClick={() => onNavigateToSection?.('services')}
              className="px-2 py-0.5 rounded-xs bg-[#121212] hover:bg-[#1a1112] text-white hover:text-[#E31B23] border border-white/5 transition-all whitespace-nowrap"
            >
              Services Grid
            </button>
          </div>

          {/* Chat Transmission Area */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 font-sans text-xs scrollbar-none">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="text-[9px] font-mono text-[#555] mb-0.5 px-1">
                  {msg.sender === 'ai' ? 'AURA // GUIDE' : 'PILOT'} · {msg.timestamp}
                </div>
                <div
                  className={`p-2.5 rounded-xs max-w-[88%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#181818] border border-white/10 text-white'
                      : 'bg-[#140b0d] border border-[#E31B23]/30 text-[#E0E0E0]'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.action && (
                    <button
                      onClick={() => {
                        if (msg.action?.type === 'planet') {
                          onNavigateToPlanet?.(msg.action.target);
                        } else {
                          onNavigateToSection?.(msg.action?.target || 'services');
                        }
                      }}
                      className="mt-2 w-full py-1.5 px-2 bg-[#E31B23] hover:bg-[#c9141b] text-white rounded-xs text-[10px] font-['Syne'] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(227,27,35,0.4)]"
                    >
                      <Compass className="w-3 h-3" />
                      <span>{msg.action.label}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#888] bg-[#140b0d] p-2 rounded-xs border border-[#E31B23]/20 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23] animate-ping" />
                <span>AURA processing trajectory...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Interactive Input Field */}
          <form onSubmit={handleSendMessage} className="p-2 bg-[#090909] border-t border-white/[0.08] flex items-center gap-1.5">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask AURA to navigate or explain..."
              className="flex-1 bg-[#141414] border border-white/10 focus:border-[#E31B23] text-xs text-white placeholder-[#666] px-2.5 py-2 rounded-xs outline-none font-sans"
            />
            <button
              type="submit"
              disabled={!userInput.trim()}
              className="p-2 bg-[#E31B23] hover:bg-[#c9141b] disabled:opacity-40 disabled:hover:bg-[#E31B23] text-white rounded-xs transition-colors shrink-0"
              title="Transmit command"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ) : (
        /* Minimized High-Tech AI Companion Pill */
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 bg-[#080808]/90 hover:bg-[#140b0d] border border-white/[0.15] hover:border-[#E31B23] px-3.5 py-2.5 rounded-xs shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all duration-300 cursor-pointer"
          title="Open AURA AI Mission Companion"
        >
          <div className="relative flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#E31B23] animate-pulse" />
            <span className="absolute w-4 h-4 rounded-full border border-[#E31B23]/40 animate-ping" />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-['Syne'] text-[11px] font-bold text-white uppercase tracking-wider group-hover:text-[#E31B23] transition-colors">
                AURA // AI GUIDE
              </span>
              <span className="text-[8px] font-mono px-1 py-0.2 rounded-xs bg-white/10 text-[#AAA]">
                ONLINE
              </span>
            </div>
            <span className="text-[9px] font-mono text-[#888]">
              {currentSector || 'SYS.FLIGHT_ACTIVE'}
            </span>
          </div>
          <ChevronUp className="w-3.5 h-3.5 text-[#888] group-hover:text-white transition-colors" />
        </button>
      )}
    </div>
  );
};
