import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Compass, Eye, Download, Maximize2, X, Sparkles, Sliders } from 'lucide-react';
import { MasterSpacecraft } from './MasterSpacecraft';

export type SpacecraftAngle = 'front' | 'three-quarter-front' | 'side' | 'rear' | 'top' | 'three-quarter-rear' | 'all-sheet';

interface MasterSpaceshipStudioProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MasterSpaceshipStudio: React.FC<MasterSpaceshipStudioProps> = ({ isOpen, onClose }) => {
  const [selectedAngle, setSelectedAngle] = useState<SpacecraftAngle>('three-quarter-front');
  const [throttle, setThrottle] = useState<number>(0.35);
  const [rotationZ, setRotationZ] = useState<number>(0);
  const [rotationX, setRotationX] = useState<number>(12);
  const [rotationY, setRotationY] = useState<number>(-22);
  const [zoom, setZoom] = useState<number>(1.1);
  const [isAutoSpinning, setIsAutoSpinning] = useState<boolean>(false);
  const [studioBackdrop, setStudioBackdrop] = useState<'void' | 'grid' | 'softbox'>('void');

  // Drag interaction physics
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Reset preset angles when selected
    switch (selectedAngle) {
      case 'front':
        setRotationX(0);
        setRotationY(0);
        setRotationZ(0);
        setZoom(1.15);
        break;
      case 'three-quarter-front':
        setRotationX(14);
        setRotationY(-26);
        setRotationZ(-4);
        setZoom(1.1);
        break;
      case 'side':
        setRotationX(0);
        setRotationY(-88);
        setRotationZ(0);
        setZoom(1.2);
        break;
      case 'rear':
        setRotationX(0);
        setRotationY(180);
        setRotationZ(0);
        setZoom(1.15);
        break;
      case 'top':
        setRotationX(78);
        setRotationY(0);
        setRotationZ(0);
        setZoom(1.1);
        break;
      case 'three-quarter-rear':
        setRotationX(16);
        setRotationY(154);
        setRotationZ(4);
        setZoom(1.1);
        break;
      case 'all-sheet':
        break;
    }
  }, [selectedAngle]);

  // Auto-spin animation tick
  useEffect(() => {
    if (!isAutoSpinning || selectedAngle === 'all-sheet') return;
    let animId: number;
    const spin = () => {
      setRotationY((prev) => (prev + 0.6) % 360);
      animId = requestAnimationFrame(spin);
    };
    animId = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(animId);
  }, [isAutoSpinning, selectedAngle]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    setIsAutoSpinning(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    setRotationY((prev) => prev + dx * 0.45);
    setRotationX((prev) => Math.max(-85, Math.min(85, prev - dy * 0.45)));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#020202]/95 backdrop-blur-2xl flex flex-col justify-between overflow-hidden select-none animate-in fade-in duration-300"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Studio Header: Minimalist Reference Dossier Bar */}
      <header className="w-full px-6 py-4 border-b border-white/[0.08] flex items-center justify-between z-20 bg-[#050505]/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-2.5 h-2.5 rounded-full bg-[#E31B23] shadow-[0_0_12px_#E31B23] animate-pulse" />
          <div>
            <div className="font-['Syne'] text-sm sm:text-base font-bold text-white uppercase tracking-wider">
              BRAND ORIGIN // MASTER VEHICLE SPECIFICATION
            </div>
            <div className="text-[10px] font-mono text-[#888]">
              DEFINITIVE AEROSPACE GEOMETRY · EVOLVED FROM ORIGIN MONOGRAM 'B'
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="hidden lg:flex items-center gap-1.5 p-1 bg-[#0c0c0c] border border-white/[0.08] rounded-xs">
          {[
            { id: 'front', label: 'FRONT' },
            { id: 'three-quarter-front', label: '3/4 FRONT' },
            { id: 'side', label: 'SIDE' },
            { id: 'rear', label: 'REAR' },
            { id: 'top', label: 'TOP (PLAN)' },
            { id: 'three-quarter-rear', label: '3/4 REAR' },
            { id: 'all-sheet', label: '6-ANGLE SHEET' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedAngle(tab.id as SpacecraftAngle)}
              className={`px-3 py-1.5 text-[11px] font-mono tracking-wider rounded-xs transition-all uppercase cursor-pointer ${
                selectedAngle === tab.id
                  ? 'bg-[#E31B23] text-white font-bold shadow-[0_0_12px_rgba(227,27,35,0.4)]'
                  : 'text-[#888] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Close Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAutoSpinning((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xs text-xs font-mono border transition-colors flex items-center gap-1.5 cursor-pointer ${
              isAutoSpinning
                ? 'bg-[#180e0f] text-[#E31B23] border-[#E31B23]'
                : 'bg-[#101010] text-[#AAA] border-white/10 hover:text-white'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoSpinning ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">360° Turntable</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 text-[#AAA] hover:text-white hover:bg-white/[0.08] rounded-xs border border-white/10 transition-colors cursor-pointer"
            aria-label="Close Studio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Studio Viewport */}
      <main className="relative flex-1 w-full overflow-hidden flex items-center justify-center">
        {/* Studio Background Illumination Options */}
        {studioBackdrop === 'void' && (
          <div className="absolute inset-0 bg-[#030303] pointer-events-none">
            {/* Subtle Volumetric Studio Key Light from Top Left */}
            <div className="absolute -top-32 -left-32 w-[650px] h-[650px] bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,transparent_65%)] blur-3xl pointer-events-none" />
            {/* Soft Radiant Crimson Bounce Rim Light from Bottom Right */}
            <div className="absolute -bottom-32 -right-32 w-[650px] h-[650px] bg-[radial-gradient(circle,rgba(227,27,35,0.08)_0%,transparent_65%)] blur-3xl pointer-events-none" />
          </div>
        )}

        {studioBackdrop === 'grid' && (
          <div className="absolute inset-0 bg-[#030303] pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#030303_85%)]" />
          </div>
        )}

        {studioBackdrop === 'softbox' && (
          <div className="absolute inset-0 bg-[#050505] pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,rgba(227,27,35,0.05)_40%,transparent_75%)] blur-2xl" />
          </div>
        )}

        {/* VIEW 1: INTERACTIVE 3D ORTHOGRAPHIC / PERSPECTIVE TURNTABLE */}
        {selectedAngle !== 'all-sheet' && (
          <div
            onMouseDown={handleMouseDown}
            className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
          >
            <div
              className="relative transition-transform duration-100 ease-out flex items-center justify-center"
              style={{
                transform: `scale(${zoom})`,
              }}
            >
              <MasterSpacecraft
                idPrefix={`studio-${selectedAngle}`}
                throttle={throttle}
                tiltX={rotationX}
                tiltY={rotationY}
                rotation={rotationZ}
                width={360}
                height={380}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: DEFINITIVE 6-ANGLE MULTI-VIEW SHEET (FRONT, 3/4 FRONT, SIDE, REAR, TOP, 3/4 REAR) */}
        {selectedAngle === 'all-sheet' && (
          <div className="relative w-full h-full p-4 sm:p-8 overflow-y-auto z-10 max-w-7xl mx-auto flex flex-col justify-center">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 w-full my-auto">
              {/* 1. FRONT VIEW */}
              <div className="bg-[#070707] border border-white/[0.08] rounded-xs p-4 flex flex-col items-center justify-between group hover:border-[#E31B23]/40 transition-colors">
                <div className="w-full flex items-center justify-between text-[10px] font-mono text-[#888] pb-2 border-b border-white/[0.06]">
                  <span className="text-white font-semibold">VIEW 01 // FRONT</span>
                  <span>ELEVATION 0°</span>
                </div>
                <div className="py-6 flex items-center justify-center">
                  <MasterSpacecraft
                    idPrefix="sheet-front"
                    throttle={throttle}
                    tiltX={0}
                    tiltY={0}
                    rotation={0}
                    width={180}
                    height={190}
                  />
                </div>
                <div className="w-full text-center text-[9px] font-mono text-[#666]">
                  SYMMETRIC INTAKE · WINGTIP STROBES
                </div>
              </div>

              {/* 2. THREE-QUARTER FRONT VIEW (HERO) */}
              <div className="bg-[#070707] border border-[#E31B23]/50 rounded-xs p-4 flex flex-col items-center justify-between group shadow-[0_0_20px_rgba(227,27,35,0.15)]">
                <div className="w-full flex items-center justify-between text-[10px] font-mono text-[#E31B23] pb-2 border-b border-white/[0.06]">
                  <span className="font-bold">VIEW 02 // 3/4 FRONT (HERO)</span>
                  <span className="bg-[#E31B23]/20 px-1 py-0.2 rounded-xs border border-[#E31B23]/30">MASTER</span>
                </div>
                <div className="py-6 flex items-center justify-center">
                  <MasterSpacecraft
                    idPrefix="sheet-tq-front"
                    throttle={throttle}
                    tiltX={14}
                    tiltY={-26}
                    rotation={-4}
                    width={190}
                    height={200}
                  />
                </div>
                <div className="w-full text-center text-[9px] font-mono text-[#AAA]">
                  CHAMFER BEVELS · RADIANT FUSION CORE
                </div>
              </div>

              {/* 3. SIDE VIEW */}
              <div className="bg-[#070707] border border-white/[0.08] rounded-xs p-4 flex flex-col items-center justify-between group hover:border-[#E31B23]/40 transition-colors">
                <div className="w-full flex items-center justify-between text-[10px] font-mono text-[#888] pb-2 border-b border-white/[0.06]">
                  <span className="text-white font-semibold">VIEW 03 // SIDE PROFILE</span>
                  <span>YAW -90°</span>
                </div>
                <div className="py-6 flex items-center justify-center">
                  <MasterSpacecraft
                    idPrefix="sheet-side"
                    throttle={throttle}
                    tiltX={0}
                    tiltY={-88}
                    rotation={0}
                    width={180}
                    height={190}
                  />
                </div>
                <div className="w-full text-center text-[9px] font-mono text-[#666]">
                  KNIFE-EDGE AERO · DIELECTRIC CANOPY
                </div>
              </div>

              {/* 4. REAR VIEW */}
              <div className="bg-[#070707] border border-white/[0.08] rounded-xs p-4 flex flex-col items-center justify-between group hover:border-[#E31B23]/40 transition-colors">
                <div className="w-full flex items-center justify-between text-[10px] font-mono text-[#888] pb-2 border-b border-white/[0.06]">
                  <span className="text-white font-semibold">VIEW 04 // REAR</span>
                  <span>AFT 180°</span>
                </div>
                <div className="py-6 flex items-center justify-center">
                  <MasterSpacecraft
                    idPrefix="sheet-rear"
                    throttle={throttle}
                    tiltX={0}
                    tiltY={180}
                    rotation={0}
                    width={180}
                    height={190}
                  />
                </div>
                <div className="w-full text-center text-[9px] font-mono text-[#666]">
                  DUAL ION NOZZLES · THERMAL TILES
                </div>
              </div>

              {/* 5. TOP VIEW (PLAN ORTHOGRAPHIC) */}
              <div className="bg-[#070707] border border-white/[0.08] rounded-xs p-4 flex flex-col items-center justify-between group hover:border-[#E31B23]/40 transition-colors">
                <div className="w-full flex items-center justify-between text-[10px] font-mono text-[#888] pb-2 border-b border-white/[0.06]">
                  <span className="text-white font-semibold">VIEW 05 // TOP (PLAN)</span>
                  <span>ORTHO 90°</span>
                </div>
                <div className="py-6 flex items-center justify-center">
                  <MasterSpacecraft
                    idPrefix="sheet-top"
                    throttle={throttle}
                    tiltX={78}
                    tiltY={0}
                    rotation={0}
                    width={180}
                    height={190}
                  />
                </div>
                <div className="w-full text-center text-[9px] font-mono text-[#666]">
                  BRAND ORIGIN 'B' SILHOUETTE · 45° APERTURE
                </div>
              </div>

              {/* 6. THREE-QUARTER REAR VIEW */}
              <div className="bg-[#070707] border border-white/[0.08] rounded-xs p-4 flex flex-col items-center justify-between group hover:border-[#E31B23]/40 transition-colors">
                <div className="w-full flex items-center justify-between text-[10px] font-mono text-[#888] pb-2 border-b border-white/[0.06]">
                  <span className="text-white font-semibold">VIEW 06 // 3/4 REAR</span>
                  <span>AFT-QUARTER</span>
                </div>
                <div className="py-6 flex items-center justify-center">
                  <MasterSpacecraft
                    idPrefix="sheet-tq-rear"
                    throttle={throttle}
                    tiltX={16}
                    tiltY={154}
                    rotation={4}
                    width={180}
                    height={190}
                  />
                </div>
                <div className="w-full text-center text-[9px] font-mono text-[#666]">
                  THRUST VECTORING · CORE BACK-HAZE
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Studio Footer Control Panel */}
      <footer className="w-full px-6 py-4 border-t border-white/[0.08] bg-[#050505]/90 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 z-20">
        {/* Left: Telemetry & Orientation Matrix */}
        <div className="flex items-center gap-6 text-[10px] font-mono text-[#888]">
          <div>
            <span className="text-[#555]">ORIENTATION: </span>
            <span className="text-white">
              PITCH {rotationX.toFixed(0)}° / YAW {((rotationY % 360 + 360) % 360).toFixed(0)}°
            </span>
          </div>
          <div>
            <span className="text-[#555]">MAGNIFICATION: </span>
            <span className="text-white">{(zoom * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Center: Angle Quick Selector (Mobile/Tablet Friendly) */}
        <div className="flex lg:hidden flex-wrap items-center justify-center gap-1.5">
          {(['front', 'three-quarter-front', 'side', 'rear', 'top', 'all-sheet'] as SpacecraftAngle[]).map((ang) => (
            <button
              key={ang}
              onClick={() => setSelectedAngle(ang)}
              className={`px-2.5 py-1 text-[10px] font-mono rounded-xs uppercase ${
                selectedAngle === ang ? 'bg-[#E31B23] text-white font-bold' : 'bg-[#121212] text-[#888]'
              }`}
            >
              {ang.replace('three-quarter-', '3/4 ')}
            </button>
          ))}
        </div>

        {/* Right: Engine Throttle & Studio Controls */}
        <div className="flex items-center gap-4">
          {/* Backdrop Mode */}
          <div className="flex items-center gap-1 bg-[#101010] p-1 rounded-xs border border-white/10">
            {(['void', 'grid', 'softbox'] as const).map((b) => (
              <button
                key={b}
                onClick={() => setStudioBackdrop(b)}
                className={`px-2 py-0.5 text-[9px] font-mono uppercase rounded-xs transition-colors ${
                  studioBackdrop === b ? 'bg-white/20 text-white font-bold' : 'text-[#666] hover:text-white'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Engine Throttle Slider */}
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#AAA]">
            <span className="text-[9px]">THRUST:</span>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={throttle}
              onChange={(e) => setThrottle(parseFloat(e.target.value))}
              className="w-20 accent-[#E31B23] cursor-pointer"
            />
            <span className="text-white tabular-nums w-8">{(throttle * 100).toFixed(0)}%</span>
          </div>

          {/* Zoom In/Out */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
              className="p-1.5 bg-[#121212] hover:bg-[#1a1a1a] rounded-xs border border-white/10 text-[#AAA] hover:text-white cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.min(2.2, z + 0.15))}
              className="p-1.5 bg-[#121212] hover:bg-[#1a1a1a] rounded-xs border border-white/10 text-[#AAA] hover:text-white cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
