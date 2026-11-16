import React from 'react';

export interface MasterSpacecraftProps {
  idPrefix?: string;
  throttle?: number; // 0 (idle) to 1 (full burn)
  scale?: number;
  rotation?: number; // degrees roll / tilt
  tiltX?: number; // degrees pitch
  tiltY?: number; // degrees yaw
  isScanning?: boolean;
  statusBadge?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  glowColor?: string;
  landingGearDeployed?: boolean;
  // Environmental reflection & atmospheric wash props
  ambientLightColor?: string; // Cold space white vs warm atmospheric wash
  planetaryReflectionColor?: string; // Albedo bounce from nearby planet
  planetaryReflectionIntensity?: number; // 0 (deep space) to 1 (low orbit / atmosphere)
}

/**
 * Photorealistic Aerospace Interceptor — The Master Brand Origin Spacecraft.
 *
 * Engineered with high-end sci-fi aerospace aesthetics:
 * - Volumetric 3D lifting-body curves, eliminates flat papercraft polygons
 * - Multi-layered titanium & stealth composite carbon armor plating with precision panel seams
 * - Polarized quartz bubble canopy with internal holographic HUD avionics & curved glass specular glint
 * - Dual magnetohydrodynamic ion vector engines with cylindrical tungsten nozzles,
 *   mach shock diamonds (Mach disks), core laser spikes, and dynamic plasma bloom
 * - Supersonic boundary-layer intake cowlings, wing fences, and dorsal thermal radiator grilles
 * - Physical ambient-occlusion separation shadows between hull layers for genuine depth
 */
export const MasterSpacecraft: React.FC<MasterSpacecraftProps> = ({
  idPrefix = 'master-sc',
  throttle = 0.25,
  scale = 1,
  rotation = 0,
  tiltX = 0,
  tiltY = 0,
  isScanning = false,
  statusBadge,
  className = '',
  width = 260,
  height = 270,
  glowColor = 'rgba(227, 27, 35, 0.55)',
  landingGearDeployed = false,
  ambientLightColor = '#FFFFFF',
  planetaryReflectionColor = 'rgba(227, 27, 35, 0.45)',
  planetaryReflectionIntensity = 0.15,
}) => {
  const clampedThrottle = Math.max(0.05, Math.min(1.0, throttle));
  const engineGlowScale = 0.35 + clampedThrottle * 1.35;
  const engineOpacity = 0.55 + clampedThrottle * 0.45;
  const plumeLength = 32 + clampedThrottle * 75;

  // Color interpolation for atmospheric hull lighting
  const atmoWarmth = Math.max(0, Math.min(1, planetaryReflectionIntensity));

  // Unique IDs for SVG gradients and filters
  const hullDarkId = `${idPrefix}-hull-dark`;
  const hullTitaniumId = `${idPrefix}-hull-ti`;
  const hullChineId = `${idPrefix}-hull-chine`;
  const wingLeadingId = `${idPrefix}-wing-leading`;
  const canopyGlassId = `${idPrefix}-canopy-glass`;
  const canopyGlintId = `${idPrefix}-canopy-glint`;
  const canopyFrameId = `${idPrefix}-canopy-frame`;
  const fusionCoreId = `${idPrefix}-fusion-core`;
  const ionCorePlumeId = `${idPrefix}-ion-core-plume`;
  const ionCoronaPlumeId = `${idPrefix}-ion-corona-plume`;
  const machDiskId = `${idPrefix}-mach-disk`;
  const nozzleMetalId = `${idPrefix}-nozzle-metal`;
  const intakeGlowId = `${idPrefix}-intake-glow`;
  const planetAlbedoGradId = `${idPrefix}-planet-albedo`;
  const dropShadowId = `${idPrefix}-hull-shadow`;
  const plasmaBlurId = `${idPrefix}-plasma-blur`;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${rotation}deg) scale(${scale})`,
        transformOrigin: 'center center',
      }}
    >
      <svg
        viewBox="0 0 320 320"
        width={width}
        height={height}
        className="w-full h-full overflow-visible pointer-events-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Deep Ambient Occlusion Drop Shadow for physical 3D layer separation */}
          <filter id={dropShadowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.85" />
          </filter>

          {/* High-Energy Plasma Glow Bloom Filter */}
          <filter id={plasmaBlurId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>

          {/* Stealth Composite Carbon Fiber Base Deck Gradient */}
          <linearGradient id={hullDarkId} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#1C212B" />
            <stop offset="35%" stopColor="#12161E" />
            <stop offset="70%" stopColor="#0B0D13" />
            <stop offset="100%" stopColor="#181D26" />
          </linearGradient>

          {/* Brushed Aerospace Titanium Hull Plating Gradient */}
          <linearGradient id={hullTitaniumId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="15%" stopColor={atmoWarmth > 0.4 ? '#FEE2E2' : '#F1F5F9'} />
            <stop offset="40%" stopColor={atmoWarmth > 0.4 ? '#E2B8B8' : '#CBD5E1'} />
            <stop offset="65%" stopColor={atmoWarmth > 0.4 ? '#C99898' : '#94A3B8'} />
            <stop offset="88%" stopColor={atmoWarmth > 0.4 ? '#DFBCBC' : '#E2E8F0'} />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>

          {/* Sculpted Chine & Beveled Wing Edge Chamfer */}
          <linearGradient id={hullChineId} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="30%" stopColor="#CBD5E1" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#475569" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0.9" />
          </linearGradient>

          {/* Titanium Leading-Edge Specular Razor Strip */}
          <linearGradient id={wingLeadingId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
            <stop offset="45%" stopColor="#E2E8F0" stopOpacity="0.85" />
            <stop offset="75%" stopColor="#94A3B8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#334155" stopOpacity="0.9" />
          </linearGradient>

          {/* Polarized Deep-Quartz Cockpit Canopy Glass */}
          <linearGradient id={canopyGlassId} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#081018" />
            <stop offset="30%" stopColor="#0E1E2C" />
            <stop offset="70%" stopColor="#142B3E" />
            <stop offset="100%" stopColor="#060C12" />
          </linearGradient>

          {/* Aerodynamic Glass Specular Glint Arc */}
          <linearGradient id={canopyGlintId} x1="20%" y1="10%" x2="80%" y2="90%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Armored Canopy Frame Ribs */}
          <linearGradient id={canopyFrameId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>

          {/* Planetary Albedo Ventral Reflection Gradient */}
          <linearGradient id={planetAlbedoGradId} x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#E31B23" stopOpacity={0.85 * atmoWarmth} />
            <stop offset="50%" stopColor="#FF4A52" stopOpacity={0.35 * atmoWarmth} />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
          </linearGradient>

          {/* Machined Tungsten Thruster Nozzle Gradient */}
          <linearGradient id={nozzleMetalId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E232A" />
            <stop offset="25%" stopColor="#3A4250" />
            <stop offset="50%" stopColor="#64748B" />
            <stop offset="75%" stopColor="#2D343F" />
            <stop offset="100%" stopColor="#111418" />
          </linearGradient>

          {/* Ion Thruster Outer Volumetric Corona */}
          <linearGradient id={ionCoronaPlumeId} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="18%" stopColor="#FF6B72" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#E31B23" stopOpacity="0.75" />
            <stop offset="78%" stopColor="#88080E" stopOpacity="0.40" />
            <stop offset="100%" stopColor="#E31B23" stopOpacity="0" />
          </linearGradient>

          {/* Ion Core Focused Plasma Jet */}
          <linearGradient id={ionCorePlumeId} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="30%" stopColor="#FFE4E6" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#FF2E36" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#E31B23" stopOpacity="0" />
          </linearGradient>

          {/* Mach Shock Diamond / Shock Disk Gradient */}
          <radialGradient id={machDiskId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="45%" stopColor="#FF8B90" stopOpacity="0.9" />
            <stop offset="85%" stopColor="#E31B23" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#E31B23" stopOpacity="0" />
          </radialGradient>

          {/* Singularity Reactor Radial Core */}
          <radialGradient id={fusionCoreId} cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="20%" stopColor="#FF6B72" />
            <stop offset="50%" stopColor="#E31B23" />
            <stop offset="80%" stopColor="#7F090E" />
            <stop offset="100%" stopColor="#250204" />
          </radialGradient>

          {/* Boundary Layer Intake Glow */}
          <radialGradient id={intakeGlowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E31B23" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#7F090E" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ================================================================= */}
        {/* LAYER 1: TWIN VECTOR ION THRUSTERS & PLASMA SHOCK DIAMONDS       */}
        {/* ================================================================= */}
        <g>
          {/* PORT THRUSTER JET (X=118, Y=226) */}
          <g transform="translate(118, 226)">
            {/* Outer Volumetric Plasma Flare */}
            <path
              d={`M -9 4 C -12 ${plumeLength * 0.35}, -7 ${plumeLength * 0.75}, 0 ${plumeLength} C 7 ${plumeLength * 0.75}, 12 ${plumeLength * 0.35}, 9 4 Z`}
              fill={`url(#${ionCoronaPlumeId})`}
              opacity={engineOpacity}
              filter={`url(#${plasmaBlurId})`}
            />
            {/* Focused Core Plasma Flame */}
            <path
              d={`M -5 3 C -7 ${plumeLength * 0.25}, -3 ${plumeLength * 0.65}, 0 ${plumeLength * 0.85} C 3 ${plumeLength * 0.65}, 7 ${plumeLength * 0.25}, 5 3 Z`}
              fill={`url(#${ionCorePlumeId})`}
              opacity={Math.min(1, engineOpacity + 0.15)}
            />
            {/* Mach Shock Diamonds (Mach Disks pulsing along jet centerline) */}
            <polygon
              points={`0,${12 * engineGlowScale} 4,${17 * engineGlowScale} 0,${22 * engineGlowScale} -4,${17 * engineGlowScale}`}
              fill={`url(#${machDiskId})`}
              opacity={engineOpacity}
            />
            <polygon
              points={`0,${28 * engineGlowScale} 3,${32 * engineGlowScale} 0,${36 * engineGlowScale} -3,${32 * engineGlowScale}`}
              fill={`url(#${machDiskId})`}
              opacity={engineOpacity * 0.85}
            />
            <polygon
              points={`0,${44 * engineGlowScale} 2.5,${47 * engineGlowScale} 0,${50 * engineGlowScale} -2.5,${47 * engineGlowScale}`}
              fill={`url(#${machDiskId})`}
              opacity={engineOpacity * 0.65}
            />
            {/* Relativistic Needle Ion Spike */}
            <line
              x1="0"
              y1="2"
              x2="0"
              y2={plumeLength * 0.7}
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity={0.95}
            />
          </g>

          {/* STARBOARD THRUSTER JET (X=202, Y=226) */}
          <g transform="translate(202, 226)">
            {/* Outer Volumetric Plasma Flare */}
            <path
              d={`M -9 4 C -12 ${plumeLength * 0.35}, -7 ${plumeLength * 0.75}, 0 ${plumeLength} C 7 ${plumeLength * 0.75}, 12 ${plumeLength * 0.35}, 9 4 Z`}
              fill={`url(#${ionCoronaPlumeId})`}
              opacity={engineOpacity}
              filter={`url(#${plasmaBlurId})`}
            />
            {/* Focused Core Plasma Flame */}
            <path
              d={`M -5 3 C -7 ${plumeLength * 0.25}, -3 ${plumeLength * 0.65}, 0 ${plumeLength * 0.85} C 3 ${plumeLength * 0.65}, 7 ${plumeLength * 0.25}, 5 3 Z`}
              fill={`url(#${ionCorePlumeId})`}
              opacity={Math.min(1, engineOpacity + 0.15)}
            />
            {/* Mach Shock Diamonds */}
            <polygon
              points={`0,${12 * engineGlowScale} 4,${17 * engineGlowScale} 0,${22 * engineGlowScale} -4,${17 * engineGlowScale}`}
              fill={`url(#${machDiskId})`}
              opacity={engineOpacity}
            />
            <polygon
              points={`0,${28 * engineGlowScale} 3,${32 * engineGlowScale} 0,${36 * engineGlowScale} -3,${32 * engineGlowScale}`}
              fill={`url(#${machDiskId})`}
              opacity={engineOpacity * 0.85}
            />
            <polygon
              points={`0,${44 * engineGlowScale} 2.5,${47 * engineGlowScale} 0,${50 * engineGlowScale} -2.5,${47 * engineGlowScale}`}
              fill={`url(#${machDiskId})`}
              opacity={engineOpacity * 0.65}
            />
            {/* Relativistic Needle Ion Spike */}
            <line
              x1="0"
              y1="2"
              x2="0"
              y2={plumeLength * 0.7}
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity={0.95}
            />
          </g>

          {/* MACHINED TUNGSTEN NOZZLE CASINGS WITH COOLING FLUTES */}
          {/* Port Nozzle Assembly */}
          <g transform="translate(118, 222)">
            {/* Vector Gimbal Bracket */}
            <rect x="-10" y="-12" width="20" height="8" rx="2" fill="#0D1117" stroke="#2D3748" strokeWidth="0.8" />
            {/* Cylindrical Nozzle Bell */}
            <path
              d="M -9 -4 L 9 -4 L 8 6 L -8 6 Z"
              fill={`url(#${nozzleMetalId})`}
              stroke="#475569"
              strokeWidth="0.8"
            />
            {/* Cooling Ring Grooves */}
            <line x1="-8.5" y1="-1" x2="8.5" y2="-1" stroke="#0F172A" strokeWidth="0.8" />
            <line x1="-8.2" y1="2" x2="8.2" y2="2" stroke="#0F172A" strokeWidth="0.8" />
            {/* Thermal Ceramic Throat Ring Glowing with Reactor Heat */}
            <ellipse cx="0" cy="5.5" rx="7.5" ry="2.2" fill="#E31B23" opacity="0.9" />
            <ellipse cx="0" cy="5.5" rx="5" ry="1.4" fill="#FFFFFF" opacity="0.95" />
          </g>

          {/* Starboard Nozzle Assembly */}
          <g transform="translate(202, 222)">
            {/* Vector Gimbal Bracket */}
            <rect x="-10" y="-12" width="20" height="8" rx="2" fill="#0D1117" stroke="#2D3748" strokeWidth="0.8" />
            {/* Cylindrical Nozzle Bell */}
            <path
              d="M -9 -4 L 9 -4 L 8 6 L -8 6 Z"
              fill={`url(#${nozzleMetalId})`}
              stroke="#475569"
              strokeWidth="0.8"
            />
            {/* Cooling Ring Grooves */}
            <line x1="-8.5" y1="-1" x2="8.5" y2="-1" stroke="#0F172A" strokeWidth="0.8" />
            <line x1="-8.2" y1="2" x2="8.2" y2="2" stroke="#0F172A" strokeWidth="0.8" />
            {/* Thermal Ceramic Throat Ring */}
            <ellipse cx="0" cy="5.5" rx="7.5" ry="2.2" fill="#E31B23" opacity="0.9" />
            <ellipse cx="0" cy="5.5" rx="5" ry="1.4" fill="#FFFFFF" opacity="0.95" />
          </g>
        </g>

        {/* ================================================================= */}
        {/* LAYER 2: VENTRAL SWEPT WINGS & AIRFOIL BODY (AERODYNAMIC 3D FORM) */}
        {/* ================================================================= */}
        <g filter={`url(#${dropShadowId})`}>
          {/* PORT SWEPT DELTA-WING AIRFOIL */}
          <g>
            {/* Wing Base Plate with Aerodynamic Camber */}
            <path
              d="M 124 150
                 L 22 174
                 C 16 176, 12 184, 18 190
                 L 38 206
                 C 44 210, 52 210, 58 206
                 L 118 198
                 Z"
              fill={`url(#${hullDarkId})`}
            />

            {/* Wing Upper Titanium Armor Layer */}
            <path
              d="M 120 154
                 L 28 177
                 C 22 179, 20 186, 25 190
                 L 40 203
                 L 116 195
                 Z"
              fill={`url(#${hullTitaniumId})`}
            />

            {/* Titanium Leading-Edge Specular Razor Strip */}
            <path
              d="M 122 152
                 L 24 175
                 L 27 180
                 L 121 157
                 Z"
              fill={`url(#${wingLeadingId})`}
            />

            {/* Wing Surface Panel Seams & Elevon Control Flap Gaps */}
            <path d="M 55 186 L 110 178" stroke="#1E293B" strokeWidth="1.2" />
            <path d="M 55 187 L 110 179" stroke="#FFFFFF" strokeWidth="0.6" strokeOpacity="0.4" />
            <path d="M 45 198 L 98 192" stroke="#0F172A" strokeWidth="1.0" />

            {/* Brand Origin Signature Crimson Wing Inlay Stripe */}
            <path
              d="M 72 176 L 96 172 L 94 179 L 70 183 Z"
              fill="#E31B23"
              opacity="0.92"
            />

            {/* Port Wingtip Navigation Strobe & Avionics Pod */}
            <g transform="translate(24, 182)">
              <rect x="-3" y="-3" width="6" height="12" rx="3" fill="#0B0F15" stroke="#334155" strokeWidth="0.7" />
              <circle cx="0" cy="3" r="2.2" fill="#E31B23" />
              <circle cx="0" cy="3" r="1.0" fill="#FFFFFF" />
            </g>

            {/* Atmospheric albedo bounce on port wing */}
            {atmoWarmth > 0.08 && (
              <path
                d="M 120 154 L 28 177 L 40 203 L 116 195 Z"
                fill={`url(#${planetAlbedoGradId})`}
                opacity={atmoWarmth * 0.75}
              />
            )}
          </g>

          {/* STARBOARD SWEPT DELTA-WING AIRFOIL */}
          <g>
            {/* Wing Base Plate with Aerodynamic Camber */}
            <path
              d="M 196 150
                 L 298 174
                 C 304 176, 308 184, 302 190
                 L 282 206
                 C 276 210, 268 210, 262 206
                 L 202 198
                 Z"
              fill={`url(#${hullDarkId})`}
            />

            {/* Wing Upper Titanium Armor Layer */}
            <path
              d="M 200 154
                 L 292 177
                 C 298 179, 300 186, 295 190
                 L 280 203
                 L 204 195
                 Z"
              fill={`url(#${hullTitaniumId})`}
            />

            {/* Titanium Leading-Edge Specular Razor Strip */}
            <path
              d="M 198 152
                 L 296 175
                 L 293 180
                 L 199 157
                 Z"
              fill={`url(#${wingLeadingId})`}
            />

            {/* Wing Surface Panel Seams & Elevon Control Flap Gaps */}
            <path d="M 265 186 L 210 178" stroke="#1E293B" strokeWidth="1.2" />
            <path d="M 265 187 L 210 179" stroke="#FFFFFF" strokeWidth="0.6" strokeOpacity="0.4" />
            <path d="M 275 198 L 222 192" stroke="#0F172A" strokeWidth="1.0" />

            {/* Brand Origin Signature Crimson Wing Inlay Stripe */}
            <path
              d="M 248 176 L 224 172 L 226 179 L 250 183 Z"
              fill="#E31B23"
              opacity="0.92"
            />

            {/* Starboard Wingtip Amber Navigation Strobe & Avionics Pod */}
            <g transform="translate(296, 182)">
              <rect x="-3" y="-3" width="6" height="12" rx="3" fill="#0B0F15" stroke="#334155" strokeWidth="0.7" />
              <circle cx="0" cy="3" r="2.2" fill="#FF5757" />
              <circle cx="0" cy="3" r="1.0" fill="#FFFFFF" />
            </g>

            {/* Atmospheric albedo bounce on starboard wing */}
            {atmoWarmth > 0.08 && (
              <path
                d="M 200 154 L 292 177 L 280 203 L 204 195 Z"
                fill={`url(#${planetAlbedoGradId})`}
                opacity={atmoWarmth * 0.75}
              />
            )}
          </g>
        </g>

        {/* ================================================================= */}
        {/* LAYER 3: CORE LIFTING-BODY FUSELAGE CHASSIS & AEROSPACE CHINES    */}
        {/* ================================================================= */}
        <g filter={`url(#${dropShadowId})`}>
          {/* Main Aerodynamic Lifting Fuselage (Hypersonic Blended Body) */}
          <path
            d="M 160 22
               C 168 36, 182 82, 194 130
               C 204 168, 222 208, 228 224
               C 220 228, 192 222, 160 226
               C 128 222, 100 228, 92 224
               C 98 208, 116 168, 126 130
               C 138 82, 152 36, 160 22 Z"
            fill={`url(#${hullTitaniumId})`}
          />

          {/* Underbody Ventral Shadow / Recess Plate */}
          <path
            d="M 160 48
               C 166 62, 178 104, 188 148
               C 196 182, 212 214, 216 220
               L 104 220
               C 108 214, 124 182, 132 148
               C 142 104, 154 62, 160 48 Z"
            fill={`url(#${hullDarkId})`}
            opacity="0.82"
          />

          {/* Upper Dorsal Titanium Spine Fairing */}
          <path
            d="M 160 24
               C 164 42, 172 88, 178 132
               C 182 164, 190 196, 192 216
               L 160 222
               L 128 216
               C 130 196, 138 164, 142 132
               C 148 88, 156 42, 160 24 Z"
            fill={`url(#${hullTitaniumId})`}
          />

          {/* Precision Aerospace Chamfer Outer Edge Highlight */}
          <path
            d="M 160 22
               C 168 36, 182 82, 194 130
               C 204 168, 222 208, 228 224
               L 160 226
               L 92 224
               C 98 208, 116 168, 126 130
               C 138 82, 152 36, 160 22 Z"
            stroke={`url(#${hullChineId})`}
            strokeWidth="1.4"
            fill="none"
          />

          {/* Dorsal Spine Centerline Razor Beam */}
          <line
            x1="160"
            y1="24"
            x2="160"
            y2="175"
            stroke="#FFFFFF"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.95"
          />
          <line
            x1="160.8"
            y1="26"
            x2="160.8"
            y2="175"
            stroke="#0F172A"
            strokeWidth="0.8"
            opacity="0.75"
          />

          {/* Supersonic Boundary Layer Intake Scoops (Port & Starboard) */}
          {/* Port Intake Flank */}
          <g>
            <path
              d="M 124 140 L 138 140 L 136 172 L 122 170 Z"
              fill="#080C12"
              stroke="#334155"
              strokeWidth="0.8"
            />
            {/* Intake Compression Shock Ramp */}
            <path d="M 126 142 L 136 142 L 134 160 L 125 158 Z" fill={`url(#${hullDarkId})`} />
            {/* Interior Crimson Sensor / Core Glow within Intake */}
            <circle cx="130" cy="158" r="5" fill={`url(#${intakeGlowId})`} />
          </g>

          {/* Starboard Intake Flank */}
          <g>
            <path
              d="M 196 140 L 182 140 L 184 172 L 198 170 Z"
              fill="#080C12"
              stroke="#334155"
              strokeWidth="0.8"
            />
            {/* Intake Compression Shock Ramp */}
            <path d="M 194 142 L 184 142 L 186 160 L 195 158 Z" fill={`url(#${hullDarkId})`} />
            {/* Interior Crimson Sensor / Core Glow within Intake */}
            <circle cx="190" cy="158" r="5" fill={`url(#${intakeGlowId})`} />
          </g>

          {/* High-Precision Panel Seam Engravings with Specular Chamfers */}
          {/* Forward Nose Chine Panel */}
          <path d="M 152 75 L 160 84 L 168 75" stroke="#1E293B" strokeWidth="1.1" fill="none" />
          <path d="M 152 76 L 160 85 L 168 76" stroke="#FFFFFF" strokeWidth="0.6" strokeOpacity="0.5" fill="none" />

          {/* Mid Fuselage Chevron Seam */}
          <path d="M 144 112 L 160 124 L 176 112" stroke="#1E293B" strokeWidth="1.1" fill="none" />
          <path d="M 144 113 L 160 125 L 176 113" stroke="#FFFFFF" strokeWidth="0.6" strokeOpacity="0.45" fill="none" />

          {/* Aft Service Panel Ribs */}
          <line x1="142" y1="184" x2="154" y2="198" stroke="#1E293B" strokeWidth="1.0" />
          <line x1="142.5" y1="184.5" x2="154.5" y2="198.5" stroke="#FFFFFF" strokeWidth="0.5" strokeOpacity="0.4" />
          <line x1="178" y1="184" x2="166" y2="198" stroke="#1E293B" strokeWidth="1.0" />
          <line x1="177.5" y1="184.5" x2="165.5" y2="198.5" stroke="#FFFFFF" strokeWidth="0.5" strokeOpacity="0.4" />

          {/* Brand Origin Signature Crimson Centerline Livery Accents */}
          <path
            d="M 160 88 L 165 96 L 160 102 L 155 96 Z"
            fill="#E31B23"
            opacity="0.95"
          />
          <path
            d="M 158 106 L 162 106 L 161 118 L 159 118 Z"
            fill="#E31B23"
            opacity="0.85"
          />
        </g>

        {/* ================================================================= */}
        {/* LAYER 4: 3D AERODYNAMIC COCKPIT CANOPY & HOLOGRAPHIC HUD DOME     */}
        {/* ================================================================= */}
        <g filter={`url(#${dropShadowId})`}>
          {/* Canopy Structural Mounting Gasket (Outer Recess) */}
          <path
            d="M 160 44
               C 167 52, 172 74, 172 96
               C 172 108, 166 118, 160 122
               C 154 118, 148 108, 148 96
               C 148 74, 153 52, 160 44 Z"
            fill="#06090E"
            stroke="#1E293B"
            strokeWidth="1.4"
          />

          {/* Polarized Quartz Bubble Canopy Glass Dome */}
          <path
            d="M 160 47
               C 165 55, 170 75, 170 95
               C 170 105, 165 114, 160 118
               C 155 114, 150 105, 150 95
               C 150 75, 155 55, 160 47 Z"
            fill={`url(#${canopyGlassId})`}
          />

          {/* Internal Holographic Avionics Display (HUD Horizon & Reticle) */}
          <g opacity="0.88">
            {/* Cyan/Crimson Quantum Reticle */}
            <circle cx="160" cy="85" r="5.5" stroke="#38BDF8" strokeWidth="0.7" strokeDasharray="3 2" fill="none" />
            <circle cx="160" cy="85" r="1.8" fill="#E31B23" />
            {/* Artificial Horizon Pitch Ladder */}
            <line x1="154" y1="80" x2="166" y2="80" stroke="#38BDF8" strokeWidth="0.6" strokeOpacity="0.8" />
            <line x1="156" y1="75" x2="164" y2="75" stroke="#38BDF8" strokeWidth="0.6" strokeOpacity="0.6" />
            <line x1="156" y1="90" x2="164" y2="90" stroke="#38BDF8" strokeWidth="0.6" strokeOpacity="0.6" />
          </g>

          {/* 3D Curved Specular Glass Reflection Highlights */}
          {/* Primary Optical Glint Arc (Shows 3D spherical dome curvature) */}
          <path
            d="M 160 49
               C 163 56, 167 74, 167 92
               C 167 97, 165 102, 163 105
               C 163 94, 160 76, 158 64
               C 157 58, 158 53, 160 49 Z"
            fill={`url(#${canopyGlintId})`}
          />
          {/* Crisp Specular Glint Dot */}
          <ellipse cx="157" cy="58" rx="1.5" ry="3.5" transform="rotate(-15 157 58)" fill="#FFFFFF" opacity="0.95" />
          <ellipse cx="162" cy="74" rx="0.9" ry="2.0" transform="rotate(-15 162 74)" fill="#FFFFFF" opacity="0.75" />

          {/* Reinforced Titanium Canopy Frame Spars */}
          <path
            d="M 160 45 L 160 120"
            stroke={`url(#${canopyFrameId})`}
            strokeWidth="0.9"
            strokeLinecap="round"
          />
          <path
            d="M 150 96 C 155 98, 165 98, 170 96"
            stroke={`url(#${canopyFrameId})`}
            strokeWidth="0.8"
            fill="none"
          />
        </g>

        {/* ================================================================= */}
        {/* LAYER 5: DORSAL SINGULARITY REACTOR & MAGNETIC CONFINEMENT CORE   */}
        {/* ================================================================= */}
        <g filter={`url(#${dropShadowId})`}>
          {/* Heavy Hexagonal Reactor Well */}
          <polygon
            points="160,172 176,182 176,204 160,214 144,204 144,182"
            fill="#090D14"
            stroke="#334155"
            strokeWidth="1.2"
          />

          {/* Radiating Thermal Heat Sink Vents */}
          <line x1="144" y1="188" x2="136" y2="188" stroke="#E31B23" strokeWidth="1.0" opacity="0.8" />
          <line x1="144" y1="194" x2="134" y2="194" stroke="#E31B23" strokeWidth="1.0" opacity="0.8" />
          <line x1="144" y1="200" x2="136" y2="200" stroke="#E31B23" strokeWidth="1.0" opacity="0.8" />
          <line x1="176" y1="188" x2="184" y2="188" stroke="#E31B23" strokeWidth="1.0" opacity="0.8" />
          <line x1="176" y1="194" x2="186" y2="194" stroke="#E31B23" strokeWidth="1.0" opacity="0.8" />
          <line x1="176" y1="200" x2="184" y2="200" stroke="#E31B23" strokeWidth="1.0" opacity="0.8" />

          {/* Active Magnetic Confinement Torus Ring */}
          <ellipse
            cx="160"
            cy="193"
            rx="11"
            ry="11"
            fill={`url(#${fusionCoreId})`}
            stroke="#FF6B72"
            strokeWidth="1.0"
          />

          {/* Singularity Reactor White-Hot Core Pinpoint */}
          <circle cx="160" cy="193" r="4.5" fill="#FFFFFF" opacity="0.98" filter={`url(#${plasmaBlurId})`} />
          <circle cx="160" cy="193" r="2.2" fill="#FFFFFF" />

          {/* Magnetic Confinement Field Struts */}
          <line x1="160" y1="174" x2="160" y2="182" stroke="#FFFFFF" strokeWidth="1.0" opacity="0.8" />
          <line x1="160" y1="204" x2="160" y2="212" stroke="#FFFFFF" strokeWidth="1.0" opacity="0.8" />
          <line x1="146" y1="193" x2="152" y2="193" stroke="#FFFFFF" strokeWidth="1.0" opacity="0.8" />
          <line x1="168" y1="193" x2="174" y2="193" stroke="#FFFFFF" strokeWidth="1.0" opacity="0.8" />
        </g>

        {/* ================================================================= */}
        {/* LAYER 6: TACTICAL AVIONICS, SENSORS & STATUS TELEMETRY            */}
        {/* ================================================================= */}
        <g>
          {/* Nose Quantum Sensor Array / FLIR Dome */}
          <g transform="translate(160, 24)">
            <ellipse cx="0" cy="0" rx="2.5" ry="4" fill="#0A0F18" stroke="#E31B23" strokeWidth="0.8" />
            <circle cx="0" cy="-0.5" r="1.0" fill="#FFFFFF" />
          </g>

          {/* Forward Reaction Control System (RCS) Thruster Quads on Chines */}
          {/* Port Forward RCS */}
          <g transform="translate(142, 68)">
            <rect x="-1" y="-2" width="2" height="4" rx="1" fill="#0D1117" stroke="#475569" strokeWidth="0.6" />
            <circle cx="-1.5" cy="0" r="0.8" fill="#94A3B8" />
          </g>
          {/* Starboard Forward RCS */}
          <g transform="translate(178, 68)">
            <rect x="-1" y="-2" width="2" height="4" rx="1" fill="#0D1117" stroke="#475569" strokeWidth="0.6" />
            <circle cx="1.5" cy="0" r="0.8" fill="#94A3B8" />
          </g>

          {/* Scanning Beam Telemetry Sweep (Active when isScanning is true) */}
          {isScanning && (
            <g className="animate-pulse">
              <path
                d="M 160 22 L 80 -40 L 240 -40 Z"
                fill="url(#scanning-beam)"
                opacity="0.35"
              />
              <line x1="80" y1="-40" x2="240" y2="-40" stroke="#E31B23" strokeWidth="1.5" opacity="0.8" />
            </g>
          )}
        </g>

        {/* ================================================================= */}
        {/* LAYER 7: HEAVY-DUTY AEROSPACE HYDRAULIC LANDING GEAR & TOUCHDOWN   */}
        {/* ================================================================= */}
        {landingGearDeployed && (
          <g className="transition-opacity duration-300">
            {/* Ground Contact Magnetic Clamping Shadows */}
            <ellipse cx="160" cy="116" rx="9" ry="3.5" fill="#000000" opacity="0.65" />
            <ellipse cx="116" cy="198" rx="12" ry="4.5" fill="#000000" opacity="0.65" />
            <ellipse cx="204" cy="198" rx="12" ry="4.5" fill="#000000" opacity="0.65" />

            {/* --- NOSE LANDING GEAR ASSEMBLY --- */}
            <g id="nose-gear">
              {/* Nose Gear Bay Door Flaps */}
              <polygon points="154,92 150,104 154,104" fill="#1E293B" stroke="#0F172A" strokeWidth="0.6" />
              <polygon points="166,92 170,104 166,104" fill="#1E293B" stroke="#0F172A" strokeWidth="0.6" />

              {/* Main Oleo Telescoping Strut */}
              <rect x="158" y="94" width="4" height="18" rx="1" fill="#475569" stroke="#0F172A" strokeWidth="0.7" />
              {/* Chrome Piston Rod */}
              <rect x="159" y="104" width="2" height="10" fill="#E2E8F0" />
              {/* Torque Link Scissors Hinge */}
              <polyline points="158,98 154,104 158,110" fill="none" stroke="#64748B" strokeWidth="1.0" />

              {/* Twin Nose Wheels */}
              <rect x="153" y="110" width="4.5" height="7" rx="2" fill="#0F172A" stroke="#334155" strokeWidth="0.6" />
              <rect x="162.5" y="110" width="4.5" height="7" rx="2" fill="#0F172A" stroke="#334155" strokeWidth="0.6" />
              {/* Titanium Hub Caps */}
              <circle cx="155.2" cy="113.5" r="1.2" fill="#94A3B8" />
              <circle cx="164.8" cy="113.5" r="1.2" fill="#94A3B8" />

              {/* High-Intensity Nose Taxi Spotlight */}
              <circle cx="160" cy="103" r="2.2" fill="#FFFFFF" />
              <circle cx="160" cy="103" r="4" fill="#38BDF8" opacity="0.4" />
            </g>

            {/* --- PORT MAIN LANDING GEAR ASSEMBLY --- */}
            <g id="port-main-gear">
              {/* Main Gear Bay Housing Door */}
              <path d="M 108 174 L 102 188 L 108 188 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="0.6" />

              {/* Trailing-Link Articulating Strut */}
              <line x1="116" y1="172" x2="116" y2="192" stroke="#475569" strokeWidth="3.2" strokeLinecap="round" />
              <line x1="116" y1="180" x2="116" y2="193" stroke="#CBD5E1" strokeWidth="1.6" />
              {/* Actuator Cross Brace */}
              <line x1="110" y1="176" x2="116" y2="186" stroke="#64748B" strokeWidth="1.4" />

              {/* Dual Main Bogie Wheels / Magnetic Touchdown Pads */}
              <rect x="110" y="190" width="5.5" height="9" rx="2.5" fill="#0F172A" stroke="#334155" strokeWidth="0.7" />
              <rect x="117.5" y="190" width="5.5" height="9" rx="2.5" fill="#0F172A" stroke="#334155" strokeWidth="0.7" />
              <circle cx="112.7" cy="194.5" r="1.5" fill="#E2E8F0" />
              <circle cx="120.2" cy="194.5" r="1.5" fill="#E2E8F0" />
              {/* Magnetic Lock Beacon */}
              <circle cx="116" cy="189" r="1.2" fill="#E31B23" />
            </g>

            {/* --- STARBOARD MAIN LANDING GEAR ASSEMBLY --- */}
            <g id="starboard-main-gear">
              {/* Main Gear Bay Housing Door */}
              <path d="M 212 174 L 218 188 L 212 188 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="0.6" />

              {/* Trailing-Link Articulating Strut */}
              <line x1="204" y1="172" x2="204" y2="192" stroke="#475569" strokeWidth="3.2" strokeLinecap="round" />
              <line x1="204" y1="180" x2="204" y2="193" stroke="#CBD5E1" strokeWidth="1.6" />
              {/* Actuator Cross Brace */}
              <line x1="210" y1="176" x2="204" y2="186" stroke="#64748B" strokeWidth="1.4" />

              {/* Dual Main Bogie Wheels / Magnetic Touchdown Pads */}
              <rect x="197" y="190" width="5.5" height="9" rx="2.5" fill="#0F172A" stroke="#334155" strokeWidth="0.7" />
              <rect x="204.5" y="190" width="5.5" height="9" rx="2.5" fill="#0F172A" stroke="#334155" strokeWidth="0.7" />
              <circle cx="199.7" cy="194.5" r="1.5" fill="#E2E8F0" />
              <circle cx="207.2" cy="194.5" r="1.5" fill="#E2E8F0" />
              {/* Magnetic Lock Beacon */}
              <circle cx="204" cy="189" r="1.2" fill="#E31B23" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
