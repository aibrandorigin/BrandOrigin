import React from 'react';

interface BrandOriginLogoProps {
  size?: number | string;
  variant?: 'full' | 'mark' | 'horizontal' | 'badge';
  color?: 'white' | 'red' | 'silver' | 'gradient';
  showTagline?: boolean;
  className?: string;
  glow?: boolean;
  isHeader?: boolean;
}

export const BrandOriginLogo: React.FC<BrandOriginLogoProps> = ({
  size = 110,
  variant = 'full',
  showTagline = true,
  className = '',
  glow = true,
  isHeader = false,
}) => {
  const gradId = 'bo-metallic-platinum-v7';
  const bevelGradId = 'bo-metallic-bevel-v7';
  const redGradId = 'bo-crimson-gem-v7';
  const shadowId = 'bo-sculpt-shadow-v7';
  const laserGradId = 'bo-laser-cut-v7';

  // Master Brand Origin Monogram Emblem Geometry:
  // - Mathematical unified path fusing 'b' stem and 'o' outer ring with zero internal seams
  // - Center at (107, 138) with outer radius 62, inner counter radius 35 (wall thickness = 27)
  // - Perfect 45.0° laser-cut aperture slit in the lower-right quadrant
  // - Floating central Origin disc (r = 20.5) in Brand Origin Crimson Red (#E31B23)
  const emblemPath = `M 45 32
    A 14 14 0 0 1 73 32
    L 73 86.15
    A 62 62 0 0 1 155.52 176.60
    L 134.39 159.79
    A 35 35 0 1 0 128.79 165.39
    L 145.60 186.52
    A 62 62 0 0 1 45 138
    L 45 32 Z`;

  const renderMark = (markSize?: number | string, isCompact: boolean = false) => {
    const isSmall = isCompact || (typeof markSize === 'number' && markSize <= 36);
    const pixelWidth = typeof markSize === 'number' ? markSize : 100;
    const pixelHeight = typeof markSize === 'number' ? Math.round(markSize * (240 / 214)) : 112;

    return (
      <svg
        viewBox="0 0 214 240"
        width={isCompact ? undefined : pixelWidth}
        height={isCompact ? undefined : pixelHeight}
        className={`shrink-0 transition-transform duration-300 ${isCompact ? 'w-full h-full block' : ''} ${
          glow && !isSmall ? 'filter drop-shadow-[0_14px_30px_rgba(227,27,35,0.45)]' : ''
        }`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="geometricPrecision"
      >
        <defs>
          {/* Anisotropic Sculptural Brushed Platinum / Chrome Gradient */}
          <linearGradient id={gradId} x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="18%" stopColor="#EEEEEE" />
            <stop offset="38%" stopColor="#C6C6C6" />
            <stop offset="55%" stopColor="#FFFFFF" />
            <stop offset="72%" stopColor="#B4B4B4" />
            <stop offset="88%" stopColor="#E8E8E8" />
            <stop offset="100%" stopColor="#B0B0B0" />
          </linearGradient>

          {/* Precision Chamfered Bevel Highlight (Light striking top-left edges) */}
          <linearGradient id={bevelGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.55" />
            <stop offset="65%" stopColor="#707070" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#252525" stopOpacity="0.4" />
          </linearGradient>

          {/* Deep Gemstone Crimson Red Gradient (#E31B23 Core) */}
          <radialGradient id={redGradId} cx="38%" cy="34%" r="65%">
            <stop offset="0%" stopColor="#FF4A52" />
            <stop offset="28%" stopColor="#E31B23" />
            <stop offset="68%" stopColor="#A80B11" />
            <stop offset="92%" stopColor="#680206" />
            <stop offset="100%" stopColor="#3C0003" />
          </radialGradient>

          {/* Laser Cut Edge Sheen Gradient */}
          <linearGradient id={laserGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#E31B23" stopOpacity="0.6" />
          </linearGradient>

          {/* 3D Cast Shadow */}
          <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy={isSmall ? "1" : "8"} stdDeviation={isSmall ? "1" : "6"} floodColor="#000000" floodOpacity="0.65" />
            {!isSmall && <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#E31B23" floodOpacity="0.35" />}
          </filter>
        </defs>

        {/* Ambient Red Halo behind Monogram */}
        {!isSmall && (
          <ellipse
            cx="107"
            cy="138"
            rx="75"
            ry="75"
            fill="url(#bo-crimson-gem-v7)"
            opacity="0.12"
            filter="blur(16px)"
          />
        )}

        {/* Unified Continuous Monogram Body */}
        <g filter={`url(#${shadowId})`}>
          {/* Solid Brushed Metal Core */}
          <path
            d={emblemPath}
            fill={`url(#${gradId})`}
          />

          {/* Sculptural Chamfer Edge Bevel Stroke */}
          <path
            d={emblemPath}
            stroke={`url(#${bevelGradId})`}
            strokeWidth={isSmall ? "0.8" : "1.2"}
            strokeLinejoin="round"
            fill="none"
          />

          {/* Laser Cut Face 1 Specular Edge Highlight */}
          <line
            x1="134.39"
            y1="159.79"
            x2="155.52"
            y2="176.60"
            stroke={`url(#${laserGradId})`}
            strokeWidth={isSmall ? "0.8" : "1.2"}
          />

          {/* Laser Cut Face 2 Specular Edge Highlight */}
          <line
            x1="128.79"
            y1="165.39"
            x2="145.60"
            y2="186.52"
            stroke={`url(#${laserGradId})`}
            strokeWidth={isSmall ? "0.8" : "1.2"}
          />
        </g>

        {/* Floating Center Origin Disc — Radiant Crimson Red (#E31B23) */}
        <g filter={isSmall ? "drop-shadow(0 0 3px rgba(227,27,35,0.8))" : "drop-shadow(0 0 16px rgba(227,27,35,0.9))"}>
          {/* Main Gemstone Disc */}
          <circle
            cx="107"
            cy="138"
            r="20.5"
            fill={`url(#${redGradId})`}
          />

          {/* Fine Chamfered Rim on the Red Disc */}
          <circle
            cx="107"
            cy="138"
            r="20.5"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth={isSmall ? "0.6" : "0.9"}
            fill="none"
          />

          {/* 3D Spherical Specular Curved Glaze */}
          <ellipse
            cx="101.5"
            cy="132.5"
            rx="8"
            ry="5.5"
            transform="rotate(-25 101.5 132.5)"
            fill="#FFFFFF"
            className="opacity-45"
          />

          {/* Hot Singularity Fusion Core Point */}
          <circle
            cx="107"
            cy="138"
            r={isSmall ? "3.5" : "5"}
            fill="#FFFFFF"
            className="opacity-85"
          />
        </g>
      </svg>
    );
  };

  // Standard wordmark
  const renderWordmark = () => (
    <div className="flex flex-col items-center select-none text-center">
      <div className="font-['Syne'] font-extrabold text-white text-xl sm:text-3xl md:text-4xl uppercase tracking-[0.16em] sm:tracking-[0.24em] leading-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
        BRAND ORIGIN
      </div>

      {showTagline && (
        <div className="mt-2 sm:mt-3 text-[10px] sm:text-xs md:text-sm font-sans tracking-[0.2em] sm:tracking-[0.32em] text-[#E0E0E0] uppercase font-semibold drop-shadow-sm flex items-center justify-center gap-1.5 sm:gap-2">
          <span>Build</span>
          <span className="text-[#E31B23] font-bold">.</span>
          <span>Innovate</span>
          <span className="text-[#E31B23] font-bold">.</span>
          <span>Grow</span>
        </div>
      )}
    </div>
  );

  if (variant === 'mark') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{renderMark(size)}</div>;
  }

  if (variant === 'horizontal') {
    const emblemHeightClass = isHeader
      ? 'h-5 min-[375px]:h-6 sm:h-7 md:h-8'
      : 'h-4 sm:h-[18px] md:h-5';

    return (
      <div className={`inline-flex items-center gap-2 min-[375px]:gap-2.5 sm:gap-3 ${className}`}>
        {/* Emblem sized so its visual height matches the naming text with exact aspect ratio */}
        <div
          id="header-brand-emblem"
          className={`relative flex items-center justify-center shrink-0 aspect-[214/240] ${emblemHeightClass}`}
          style={size && size !== 110 ? { height: typeof size === 'number' ? `${size}px` : size } : undefined}
        >
          {renderMark(undefined, true)}
        </div>
        <div className="flex flex-col text-left justify-center">
          <div className="font-['Syne'] font-extrabold text-white text-sm min-[375px]:text-base sm:text-lg md:text-xl uppercase tracking-[0.12em] min-[375px]:tracking-[0.16em] sm:tracking-[0.2em] leading-none select-none whitespace-nowrap">
            BRAND ORIGIN
          </div>
          {showTagline && (
            <div className="text-[8px] sm:text-[9px] font-sans tracking-[0.2em] text-[#B0B0B0] uppercase mt-0.5">
              Build . Innovate . Grow
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full stacked lockup
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <div className="mb-3 sm:mb-5">
        {renderMark(size)}
      </div>
      {renderWordmark()}
    </div>
  );
};
