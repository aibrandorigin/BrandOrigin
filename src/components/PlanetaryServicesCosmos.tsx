import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowUpRight,
  Radio,
  Compass,
  Target,
  Crown,
  Layers,
  Globe,
  Code2,
  Layout,
  Sparkles,
  Smartphone,
  Cpu,
  Database,
  ShieldCheck,
  Megaphone,
  Share2,
  Film,
  Users,
  TrendingUp,
  BarChart3,
  Zap,
  Crosshair,
  Building2,
  Rocket,
  Network,
  Award,
} from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { ServiceItem } from '../types';
import { getViewportHeight } from '../utils/viewport';

export interface ServicePlanetVisual {
  id: string;
  planetName: string;
  sectorCode: string;
  stageName: string;
  primaryColor: string;
  highlightColor: string;
  secondaryColor: string;
  shadowColor: string;
  glowColor: string;
  atmosphereHaze: string;
  align: 'left' | 'right';
  hasRings?: boolean;
  ringTilt?: string;
  orbitalVelocity: string;
  atmosphericComposition: string;
  moonName: string;
}

export const SERVICE_PLANETS_DATA: Record<string, ServicePlanetVisual> = {
  strategy: {
    id: 'strategy',
    planetName: 'STRATOS',
    sectorCode: 'SECTOR 01 // GENESIS',
    stageName: 'Genesis Stage',
    primaryColor: '#E31B23',
    highlightColor: '#FF8A65',
    secondaryColor: '#F59E0B',
    shadowColor: '#240204',
    glowColor: 'rgba(227, 27, 35, 0.78)',
    atmosphereHaze: 'rgba(255, 115, 85, 0.42)',
    align: 'left',
    orbitalVelocity: '29,400 KM/S',
    atmosphericComposition: 'Volcanic Magma / Obsidian Tectonics',
    moonName: 'IGNIS-I',
  },
  web: {
    id: 'web',
    planetName: 'AETHER',
    sectorCode: 'SECTOR 02 // DIGITAL EXPERIENCE',
    stageName: 'Digital Stage',
    primaryColor: '#0284C7',
    highlightColor: '#67E8F9',
    secondaryColor: '#0EA5E9',
    shadowColor: '#021524',
    glowColor: 'rgba(56, 189, 248, 0.78)',
    atmosphereHaze: 'rgba(103, 232, 249, 0.4)',
    align: 'right',
    orbitalVelocity: '34,200 KM/S',
    atmosphericComposition: 'Deep Azure Hydrosphere / Polar Ice',
    moonName: 'THALASSA',
  },
  app: {
    id: 'app',
    planetName: 'SYNAPSE',
    sectorCode: 'SECTOR 03 // SOFTWARE ARCHITECTURE',
    stageName: 'Digital Stage',
    primaryColor: '#4F46E5',
    highlightColor: '#A5B4FC',
    secondaryColor: '#22D3EE',
    shadowColor: '#0E0B29',
    glowColor: 'rgba(129, 140, 248, 0.78)',
    atmosphereHaze: 'rgba(129, 140, 248, 0.42)',
    align: 'left',
    orbitalVelocity: '38,800 KM/S',
    atmosphericComposition: 'Ion Storm / Bioluminescent Neural Core',
    moonName: 'NEXUS-9',
  },
  marketing: {
    id: 'marketing',
    planetName: 'OMNICRON',
    sectorCode: 'SECTOR 04 // OMNICHANNEL REACH',
    stageName: 'Ecosystem Stage',
    primaryColor: '#9333EA',
    highlightColor: '#F0ABFC',
    secondaryColor: '#EC4899',
    shadowColor: '#210430',
    glowColor: 'rgba(217, 70, 239, 0.78)',
    atmosphereHaze: 'rgba(240, 171, 252, 0.42)',
    align: 'right',
    hasRings: true,
    ringTilt: '-18deg',
    orbitalVelocity: '42,100 KM/S',
    atmosphericComposition: 'Jovian Super-Storms / Crystalline Rings',
    moonName: 'LYRA-IV',
  },
  performance: {
    id: 'performance',
    planetName: 'VALKYRIE',
    sectorCode: 'SECTOR 05 // QUANT VELOCITY',
    stageName: 'Growth Stage',
    primaryColor: '#D97706',
    highlightColor: '#FEF08A',
    secondaryColor: '#F97316',
    shadowColor: '#2E1202',
    glowColor: 'rgba(245, 158, 11, 0.82)',
    atmosphereHaze: 'rgba(253, 224, 71, 0.42)',
    align: 'left',
    orbitalVelocity: '48,600 KM/S',
    atmosphericComposition: 'Solar Amber / Magnetic Plasma Loops',
    moonName: 'HELIOS-B',
  },
  growth: {
    id: 'growth',
    planetName: 'MONOLITH',
    sectorCode: 'SECTOR 06 // ENTERPRISE SCALE',
    stageName: 'Scale Stage',
    primaryColor: '#059669',
    highlightColor: '#6EE7B7',
    secondaryColor: '#14B8A6',
    shadowColor: '#021C11',
    glowColor: 'rgba(16, 185, 129, 0.78)',
    atmosphereHaze: 'rgba(110, 231, 183, 0.4)',
    align: 'right',
    hasRings: true,
    ringTilt: '14deg',
    orbitalVelocity: '54,000 KM/S',
    atmosphericComposition: 'Emerald Terrestrial / Viridian Exosphere',
    moonName: 'GAIA-PRIME',
  },
};

const DEFAULT_PLANET: ServicePlanetVisual = {
  id: 'default',
  planetName: 'ORIGIN WORLD',
  sectorCode: 'SECTOR // CAPABILITY',
  stageName: 'Origin Discipline',
  primaryColor: '#E31B23',
  highlightColor: '#FF6B6B',
  secondaryColor: '#F59E0B',
  shadowColor: '#2B0407',
  glowColor: 'rgba(227, 27, 35, 0.75)',
  atmosphereHaze: 'rgba(255, 107, 107, 0.35)',
  align: 'left',
  orbitalVelocity: '30,000 KM/S',
  atmosphericComposition: 'Standard Space',
  moonName: 'ORIGIN-I',
};

/**
 * Renders rich interior planetary elements: continents, lava fissures, storm bands,
 * polar ice caps, bioluminescent networks, craters, and cloud formations inside the sphere.
 */
const PlanetInteriorElements: React.FC<{ planetId: string; theme: ServicePlanetVisual; isEngaged: boolean }> = ({
  planetId,
  theme,
  isEngaged,
}) => {
  switch (planetId) {
    case 'strategy':
      // STRATOS: Volcanic Tectonic World with glowing magma fissures, obsidian continents, and ash plumes
      return (
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <radialGradient id="stratos-lava" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="45%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#E31B23" stopOpacity="0" />
            </radialGradient>
            <filter id="magma-glow">
              <feGaussianBlur stdDeviation="2.2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Dark Obsidian Tectonic Crust Plates */}
          <path
            d="M -10,55 Q 35,40 68,62 T 135,50 Q 170,68 210,55 L 210,130 Q 160,115 115,135 T 40,120 L -10,135 Z"
            fill="#1A0305"
            opacity="0.62"
          />
          <path
            d="M 15,145 Q 60,130 105,155 T 195,140 L 195,205 L 15,205 Z"
            fill="#140203"
            opacity="0.7"
          />
          <path
            d="M 25,10 Q 75,32 125,18 T 185,35 L 185,-5 L 25,-5 Z"
            fill="#240407"
            opacity="0.5"
          />

          {/* Glowing Molten Magma Rift Rivers */}
          <g filter="url(#magma-glow)" className={isEngaged ? ' opacity-100' : 'opacity-80'}>
            <path
              d="M 8,68 Q 45,52 72,74 T 132,64 T 192,86"
              fill="none"
              stroke="#FDE047"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M 72,74 Q 84,104 65,132 T 98,172"
              fill="none"
              stroke="#FB923C"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M 132,64 Q 148,95 126,118 T 164,154"
              fill="none"
              stroke="#FBBF24"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M 28,118 Q 58,108 65,132"
              fill="none"
              stroke="#FCA5A5"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </g>

          {/* Active Volcanic Caldera Hotspots & Impact Craters */}
          <circle cx="72" cy="74" r="9" fill="url(#stratos-lava)" />
          <circle cx="72" cy="74" r="3" fill="#FFFFFF" />
          <circle cx="132" cy="64" r="7" fill="url(#stratos-lava)" />
          <circle cx="132" cy="64" r="2.2" fill="#FFFBEB" />
          <circle cx="65" cy="132" r="6.5" fill="url(#stratos-lava)" />
          <circle cx="126" cy="118" r="5" fill="url(#stratos-lava)" />

          {/* Crater Rings */}
          <ellipse cx="42" cy="92" rx="11" ry="7" fill="#180204" stroke="#FF6B6B" strokeWidth="0.6" strokeOpacity="0.45" transform="rotate(-14 42 92)" />
          <ellipse cx="152" cy="105" rx="14" ry="8.5" fill="#180204" stroke="#FB923C" strokeWidth="0.7" strokeOpacity="0.4" transform="rotate(18 152 105)" />
          <ellipse cx="105" cy="38" rx="9" ry="5" fill="#180204" stroke="#FCA5A5" strokeWidth="0.5" strokeOpacity="0.35" />

          {/* High-Altitude Volcanic Ash & Pyroclastic Cloud Bands */}
          <path
            d="M -10,42 Q 55,28 110,44 T 210,36"
            fill="none"
            stroke="#FECACA"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.18"
          />
          <path
            d="M -10,152 Q 65,168 135,150 T 210,162"
            fill="none"
            stroke="#FDE68A"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.14"
          />
        </svg>
      );

    case 'web':
      // AETHER: Oceanic Archipelago World with polar ice caps, turquoise continental shelves, and hurricane vortex
      return (
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full pointer-events-none">
          {/* North & South Crystalline Polar Ice Caps */}
          <path
            d="M 30,8 Q 100,28 170,8 Q 135,-6 65,-6 Z"
            fill="#ECFEFF"
            opacity="0.82"
          />
          <path
            d="M 42,192 Q 100,176 158,192 Q 130,204 70,204 Z"
            fill="#CFFAFE"
            opacity="0.68"
          />

          {/* Shallow Turquoise Coral Shelves & Continental Archipelagos */}
          <path
            d="M 22,68 Q 48,50 76,65 T 118,58 Q 132,75 112,94 T 58,98 Q 28,92 22,68 Z"
            fill="#22D3EE"
            opacity="0.45"
          />
          <path
            d="M 28,70 Q 50,56 72,68 T 106,64 Q 116,76 100,88 T 56,90 Z"
            fill="#67E8F9"
            opacity="0.55"
          />

          {/* Secondary Southern Landmass & Atoll Chain */}
          <path
            d="M 108,118 Q 138,104 166,122 T 178,152 Q 152,166 124,150 T 108,118 Z"
            fill="#38BDF8"
            opacity="0.48"
          />
          <path
            d="M 116,122 Q 138,112 158,126 T 164,146 Q 144,154 126,142 Z"
            fill="#A5F3FC"
            opacity="0.5"
          />
          <circle cx="82" cy="134" r="6" fill="#67E8F9" opacity="0.45" />
          <circle cx="66" cy="142" r="4" fill="#A5F3FC" opacity="0.4" />
          <circle cx="94" cy="145" r="3.5" fill="#67E8F9" opacity="0.4" />

          {/* Planetary Hurricane Super-Vortex (Spinning Cloud Eye) */}
          <g transform="translate(62, 114)">
            <path
              d="M 0,0 C 8,-12 24,-10 26,4 C 28,18 8,26 -8,18 C -24,10 -22,-14 -4,-22 C 14,-30 36,-16 38,8"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.6"
              strokeLinecap="round"
              opacity="0.68"
            />
            <path
              d="M 2,-4 C -6,6 -16,4 -16,-6 C -16,-16 2,-20 14,-12"
              fill="none"
              stroke="#E0F2FE"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.55"
            />
            <circle cx="0" cy="0" r="2.8" fill="#0369A1" stroke="#FFFFFF" strokeWidth="1.2" />
          </g>

          {/* Swirling Trade-Wind Jetstreams & Cirrus Cloud Bands */}
          <path
            d="M -10,46 Q 55,34 115,48 T 210,40"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="4.5"
            strokeLinecap="round"
            opacity="0.38"
          />
          <path
            d="M -5,88 Q 75,102 145,84 T 210,94"
            fill="none"
            stroke="#E0F2FE"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.32"
          />
          <path
            d="M 10,100 Q 85,112 165,96"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.45"
          />
          <path
            d="M -10,156 Q 60,142 130,158 T 210,148"
            fill="none"
            stroke="#BAE6FD"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.34"
          />
        </svg>
      );

    case 'app':
      // SYNAPSE: Bioluminescent Cyber-Organic World with glowing neural nexus hubs, plasma storms, and auroras
      return (
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <radialGradient id="synapse-node" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Deep Ionized Continental Masses */}
          <path
            d="M 15,52 Q 65,35 110,58 T 185,48 L 190,142 Q 135,160 85,138 T 12,148 Z"
            fill="#1E1B4B"
            opacity="0.58"
          />

          {/* Glowing Neural Constellation Pathways Across the Surface */}
          <g stroke="#38BDF8" strokeOpacity="0.65" fill="none">
            <path d="M 38,68 Q 72,54 96,78 T 154,66" strokeWidth="1.5" />
            <path d="M 96,78 Q 112,108 88,132 T 142,145" strokeWidth="1.4" />
            <path d="M 38,68 Q 48,104 88,132" strokeWidth="1.2" />
            <path d="M 154,66 Q 162,105 142,145" strokeWidth="1.2" />
            <path d="M 52,118 L 88,132 L 122,104 L 96,78" strokeWidth="1" strokeDasharray="2 2" />
            <path d="M 65,42 L 96,78 L 132,44" strokeWidth="1" />
          </g>

          {/* Electric Aurora Borealis Waves near Poles */}
          <path
            d="M 22,26 Q 65,10 105,28 T 178,20"
            fill="none"
            stroke="#22D3EE"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.38"
          />
          <path
            d="M 32,32 Q 75,18 115,34 T 168,26"
            fill="none"
            stroke="#A855F7"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.42"
          />
          <path
            d="M 35,174 Q 95,188 162,172"
            fill="none"
            stroke="#22D3EE"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.32"
          />

          {/* Luminous Neural Core Hubs (Planetary Megacities / Energy Nodes) */}
          {[
            { cx: 38, cy: 68, r: 7 },
            { cx: 96, cy: 78, r: 10 },
            { cx: 154, cy: 66, r: 7.5 },
            { cx: 88, cy: 132, r: 8.5 },
            { cx: 142, cy: 145, r: 6.5 },
            { cx: 52, cy: 118, r: 5.5 },
            { cx: 122, cy: 104, r: 6 },
            { cx: 65, cy: 42, r: 5 },
            { cx: 132, cy: 44, r: 5 },
          ].map((node, i) => (
            <g key={i}>
              <circle cx={node.cx} cy={node.cy} r={node.r} fill="url(#synapse-node)" />
              <circle cx={node.cx} cy={node.cy} r={node.r * 0.28} fill="#FFFFFF" />
            </g>
          ))}

          {/* Ion Atmospheric Cloud Eddy */}
          <ellipse
            cx="118"
            cy="104"
            rx="24"
            ry="12"
            fill="none"
            stroke="#C7D2FE"
            strokeWidth="1.2"
            strokeDasharray="4 3"
            opacity="0.4"
            transform="rotate(-12 118 104)"
          />
        </svg>
      );

    case 'marketing':
      // OMNICRON: Banded Jovian Gas Giant with turbulent atmospheric belts, festoons, and Great Amethyst Vortex
      return (
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Tilted Jovian Gas Belts & Atmospheric Jet Streams */}
          <g transform="rotate(-12 100 100)">
            {/* Upper Polar Haze */}
            <path d="M -20,22 Q 100,14 220,22 L 220,38 Q 100,30 -20,38 Z" fill="#581C87" opacity="0.55" />

            {/* North Temperate Luminous Band */}
            <path
              d="M -20,44 Q 45,36 105,46 T 220,42 L 220,60 Q 150,66 95,56 T -20,62 Z"
              fill="#F0ABFC"
              opacity="0.38"
            />

            {/* Equatorial Crimson-Magenta Storm Belt */}
            <path
              d="M -20,72 Q 60,64 120,76 T 220,70 L 220,96 Q 140,104 80,92 T -20,98 Z"
              fill="#701A75"
              opacity="0.62"
            />
            <path
              d="M -20,82 Q 70,74 135,86 T 220,80"
              fill="none"
              stroke="#F5D0FE"
              strokeWidth="3"
              opacity="0.45"
            />

            {/* Tropical Lavender Zone */}
            <path
              d="M -20,106 Q 65,116 135,104 T 220,112 L 220,132 Q 135,122 65,134 T -20,126 Z"
              fill="#E879F9"
              opacity="0.35"
            />

            {/* South Temperate Deep Belt */}
            <path
              d="M -20,144 Q 80,134 150,146 T 220,140 L 220,162 Q 140,170 70,158 T -20,164 Z"
              fill="#3B0764"
              opacity="0.6"
            />

            {/* The Great Amethyst Anticyclone Eye (Like Jupiter's Great Red Spot) */}
            <g transform="translate(126, 114)">
              <ellipse cx="0" cy="0" rx="24" ry="14" fill="#581C87" opacity="0.8" />
              <ellipse cx="0" cy="0" rx="20" ry="11" fill="#D946EF" opacity="0.75" />
              <ellipse cx="-2" cy="-1" rx="14" ry="7.5" fill="#F5D0FE" opacity="0.7" />
              <ellipse cx="-3" cy="-1" rx="7" ry="3.8" fill="#FFFFFF" opacity="0.85" />
              <path
                d="M -18,2 C -10,-8 10,-8 18,2 C 12,10 -12,10 -18,2 Z"
                fill="none"
                stroke="#FAE8FF"
                strokeWidth="1.2"
                opacity="0.7"
              />
            </g>

            {/* Secondary White Oval Storm Eddies */}
            <ellipse cx="54" cy="64" rx="10" ry="5.5" fill="#FAE8FF" opacity="0.55" />
            <ellipse cx="78" cy="66" rx="7" ry="4" fill="#F0ABFC" opacity="0.5" />
            <ellipse cx="62" cy="148" rx="12" ry="6" fill="#E879F9" opacity="0.45" />
          </g>
        </svg>
      );

    case 'performance':
      // VALKYRIE: Solar Amber Plasma World with radiant convection cells, sunspot vortices, and golden flares
      return (
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <radialGradient id="valkyrie-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Radiant Solar Plasma Granulation & Convection Zones */}
          <circle cx="72" cy="68" r="32" fill="url(#valkyrie-core)" opacity="0.55" />
          <circle cx="134" cy="118" r="28" fill="url(#valkyrie-core)" opacity="0.48" />
          <circle cx="64" cy="136" r="22" fill="url(#valkyrie-core)" opacity="0.4" />

          {/* Sweeping Magnetic Plasma Filaments & Solar Winds */}
          <path
            d="M -10,58 C 45,32 95,88 150,56 C 175,42 195,52 210,48"
            fill="none"
            stroke="#FEF9C3"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.55"
          />
          <path
            d="M -10,104 C 55,132 110,74 168,108 C 188,120 200,114 215,118"
            fill="none"
            stroke="#FDE047"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.45"
          />
          <path
            d="M 15,152 Q 85,126 145,156 T 205,144"
            fill="none"
            stroke="#FDBA74"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.45"
          />

          {/* Magnetic Sunspot Active Regions (Dark Umbra + Glowing Penumbra) */}
          <g transform="translate(88, 92) rotate(-15)">
            <ellipse cx="0" cy="0" rx="14" ry="9" fill="#F59E0B" opacity="0.7" />
            <ellipse cx="0" cy="0" rx="8" ry="5" fill="#451A03" opacity="0.9" />
            <ellipse cx="18" cy="6" rx="9" ry="6" fill="#F59E0B" opacity="0.65" />
            <ellipse cx="18" cy="6" rx="4.5" ry="3" fill="#451A03" opacity="0.88" />
            {/* Magnetic Flux Arch Connecting the Sunspot Pair */}
            <path
              d="M 0,0 Q 9,-18 18,6"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              opacity="0.85"
            />
            <path
              d="M 0,0 Q 9,-26 18,6"
              fill="none"
              stroke="#FEF08A"
              strokeWidth="1.2"
              opacity="0.65"
            />
          </g>

          {/* Secondary Active Flare Loop */}
          <g transform="translate(136, 62) rotate(22)">
            <ellipse cx="0" cy="0" rx="7" ry="4.5" fill="#451A03" stroke="#FDE047" strokeWidth="1.5" />
            <ellipse cx="12" cy="2" rx="5" ry="3" fill="#451A03" stroke="#FDE047" strokeWidth="1.2" />
            <path d="M 0,0 Q 6,-14 12,2" fill="none" stroke="#FFFFFF" strokeWidth="1.6" opacity="0.8" />
          </g>
        </svg>
      );

    case 'growth':
    default:
      // MONOLITH: Lush Emerald Super-Earth with sculpted continents, river deltas, mountain ranges, and cloud bands
      return (
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Polar Frost Caps */}
          <path d="M 38,6 Q 100,22 162,6 Q 130,-5 70,-5 Z" fill="#D1FAE5" opacity="0.75" />
          <path d="M 48,194 Q 100,180 152,194 Z" fill="#A7F3D0" opacity="0.65" />

          {/* Primary Super-Continent (Primeval Emerald Terra) */}
          <path
            d="M 28,48 Q 62,34 88,52 T 134,46 Q 156,64 142,92 T 104,124 Q 72,136 48,114 T 24,78 Q 18,60 28,48 Z"
            fill="#047857"
            opacity="0.72"
          />
          {/* Highland Viridian Ridges */}
          <path
            d="M 42,58 Q 68,46 88,62 T 124,58 Q 136,72 122,90 T 88,108 Q 62,114 46,96 Z"
            fill="#10B981"
            opacity="0.65"
          />
          <path
            d="M 54,66 Q 74,58 92,70 T 112,76 Q 96,94 72,92 Z"
            fill="#6EE7B7"
            opacity="0.5"
          />

          {/* Glowing Bioluminescent River Deltas Carving Through the Continent */}
          <path
            d="M 52,58 Q 74,76 86,102 T 102,124"
            fill="none"
            stroke="#A7F3D0"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.75"
          />
          <path
            d="M 114,62 Q 96,78 86,102"
            fill="none"
            stroke="#6EE7B7"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.7"
          />

          {/* Southern Eastern Continent & Island Chains */}
          <path
            d="M 118,132 Q 148,118 176,136 T 182,168 Q 154,180 128,164 T 118,132 Z"
            fill="#059669"
            opacity="0.68"
          />
          <path
            d="M 128,138 Q 150,128 168,142 T 166,162 Q 146,168 132,154 Z"
            fill="#34D399"
            opacity="0.55"
          />

          {/* Dynamic Atmospheric Weather & Cloud Swirls */}
          <path
            d="M -10,64 Q 55,48 118,66 T 210,56"
            fill="none"
            stroke="#ECFDF5"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.36"
          />
          <path
            d="M -5,116 Q 75,132 145,112 T 210,122"
            fill="none"
            stroke="#D1FAE5"
            strokeWidth="4.5"
            strokeLinecap="round"
            opacity="0.32"
          />
          <path
            d="M 22,154 Q 82,140 142,158"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.3"
          />
        </svg>
      );
  }
};

interface OrbitingArtifact {
  label: string;
  Icon: React.FC<{ className?: string; style?: React.CSSProperties }>;
  angleDeg: number;
}

const SERVICE_ORBITING_ITEMS: Record<string, OrbitingArtifact[]> = {
  strategy: [
    { label: 'POSITIONING', Icon: Compass, angleDeg: 0 },
    { label: 'BRAND DNA', Icon: Crown, angleDeg: 90 },
    { label: 'MARKET FIT', Icon: Target, angleDeg: 180 },
    { label: 'ARCHITECTURE', Icon: Layers, angleDeg: 270 },
  ],
  web: [
    { label: 'WEBGL 3D', Icon: Globe, angleDeg: 0 },
    { label: 'UI / UX SYSTEM', Icon: Layout, angleDeg: 90 },
    { label: 'FULL-STACK', Icon: Code2, angleDeg: 180 },
    { label: 'INTERACTION', Icon: Sparkles, angleDeg: 270 },
  ],
  app: [
    { label: 'IOS & ANDROID', Icon: Smartphone, angleDeg: 0 },
    { label: 'CLOUD API', Icon: Database, angleDeg: 90 },
    { label: 'AI ENGINE', Icon: Cpu, angleDeg: 180 },
    { label: 'SECURITY', Icon: ShieldCheck, angleDeg: 270 },
  ],
  marketing: [
    { label: 'CAMPAIGNS', Icon: Megaphone, angleDeg: 0 },
    { label: 'FILM & MOTION', Icon: Film, angleDeg: 90 },
    { label: 'SOCIAL REACH', Icon: Share2, angleDeg: 180 },
    { label: 'CREATOR NET', Icon: Users, angleDeg: 270 },
  ],
  performance: [
    { label: 'ROAS SCALE', Icon: TrendingUp, angleDeg: 0 },
    { label: 'ATTRIBUTION', Icon: BarChart3, angleDeg: 90 },
    { label: 'PAID VELOCITY', Icon: Zap, angleDeg: 180 },
    { label: 'CONVERSION', Icon: Crosshair, angleDeg: 270 },
  ],
  growth: [
    { label: 'ENTERPRISE', Icon: Building2, angleDeg: 0 },
    { label: 'GLOBAL EXPANSION', Icon: Network, angleDeg: 90 },
    { label: 'REVENUE ENGINE', Icon: Rocket, angleDeg: 180 },
    { label: 'CATEGORY LEADER', Icon: Award, angleDeg: 270 },
  ],
};

/**
 * Renders service-specific items & artifacts continuously rotating in orbit around each planet.
 * Uses counter-rotation so icons and labels always remain upright and legible as they revolve.
 */
const ServiceOrbitingItems: React.FC<{
  planetId: string;
  theme: ServicePlanetVisual;
  isEngaged: boolean;
}> = ({ planetId, theme, isEngaged }) => {
  const items = SERVICE_ORBITING_ITEMS[planetId] || SERVICE_ORBITING_ITEMS.strategy;
  const orbitDuration = '34s';

  return (
    <div
      className={`absolute pointer-events-none flex items-center justify-center z-20 transition-all duration-700 ${
        isEngaged
          ? 'w-[clamp(160px,46vw,236px)] h-[clamp(160px,46vw,236px)] md:w-[272px] md:h-[272px] lg:w-[332px] lg:h-[332px]'
          : 'w-[clamp(144px,41vw,210px)] h-[clamp(144px,41vw,210px)] md:w-[238px] md:h-[238px] lg:w-[270px] lg:h-[270px]'
      }`}
    >
      {/* Subtle Celestial Orbital Track Path */}
      <div
        className="absolute inset-0 rounded-full transition-opacity duration-700"
        style={{
          border: `1px dashed ${theme.highlightColor}`,
          opacity: isEngaged ? 0.38 : 0.16,
        }}
      />

      {/* Primary Clockwise Rotating Satellite Constellation */}
      <div
        className="relative w-full h-full"
        style={{
          animation: `planetOrbitSpin ${orbitDuration} linear infinite`,
        }}
      >
        {items.map((item, idx) => {
          const rad = (item.angleDeg * Math.PI) / 180;
          const xPct = 50 + 50 * Math.cos(rad);
          const yPct = 50 + 50 * Math.sin(rad);
          const IconComponent = item.Icon;

          return (
            <div
              key={idx}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${xPct}%`,
                top: `${yPct}%`,
              }}
            >
              {/* Counter-rotating wrapper keeps icon + label upright throughout 360° orbit */}
              <div
                className="flex flex-col items-center gap-0.5 sm:gap-1"
                style={{
                  animation: `planetOrbitCounterSpin ${orbitDuration} linear infinite`,
                }}
              >
                {/* Luminous Celestial Artifact Node */}
                <div
                  className={`relative flex items-center justify-center rounded-full transition-all duration-500 ${
                    isEngaged
                      ? 'w-5.5 h-5.5 min-[375px]:w-6.5 min-[375px]:h-6.5 md:w-8 md:h-8'
                      : 'w-5 h-5 min-[375px]:w-5.5 min-[375px]:h-5.5 md:w-6.5 md:h-6.5'
                  }`}
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${theme.highlightColor}55 0%, ${theme.shadowColor}E6 75%, #050505 100%)`,
                    boxShadow: isEngaged
                      ? `0 0 18px ${theme.glowColor}, inset 0 0 8px ${theme.highlightColor}88`
                      : `0 0 10px ${theme.glowColor}`,
                  }}
                >
                  <IconComponent
                    className={isEngaged ? 'w-3 h-3 min-[375px]:w-3.5 min-[375px]:h-3.5 md:w-4 md:h-4 text-white' : 'w-2.5 h-2.5 min-[375px]:w-3 min-[375px]:h-3 text-white/85'}
                    style={{
                      filter: `drop-shadow(0 0 6px ${theme.highlightColor})`,
                    }}
                  />
                </div>

                {/* Clean Unboxed Orbital Telemetry Label */}
                <span
                  className={`font-mono tracking-wider sm:tracking-widest uppercase whitespace-nowrap transition-all duration-500 ${
                    isEngaged
                      ? 'text-[7px] min-[375px]:text-[8px] md:text-[9.5px] lg:text-[10px] text-white font-semibold opacity-100'
                      : 'text-[6.5px] min-[375px]:text-[7.5px] md:text-[8px] text-zinc-400 opacity-70'
                  }`}
                  style={{
                    textShadow: '0 2px 8px rgba(0,0,0,0.95), 0 0 12px rgba(0,0,0,0.9)',
                  }}
                >
                  {item.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inner Counter-Rotating Natural Moon & Micro-Probes */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '76%',
          height: '76%',
          animation: 'planetOrbitCounterSpin 22s linear infinite',
        }}
      >
        <div
          className="absolute -top-1.5 left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: isEngaged ? '10px' : '7px',
            height: isEngaged ? '10px' : '7px',
            background: `radial-gradient(circle at 30% 30%, #FFFFFF 0%, ${theme.highlightColor} 50%, ${theme.shadowColor} 90%)`,
            boxShadow: `0 0 12px ${theme.glowColor}`,
          }}
        />
        <div
          className="absolute bottom-1 right-3 rounded-full"
          style={{
            width: isEngaged ? '6px' : '4px',
            height: isEngaged ? '6px' : '4px',
            background: theme.secondaryColor,
            boxShadow: `0 0 8px ${theme.glowColor}`,
            opacity: 0.85,
          }}
        />
      </div>
    </div>
  );
};

interface PlanetaryServicesCosmosProps {
  onSelectService: (serviceName: string) => void;
}

export const PlanetaryServicesCosmos: React.FC<PlanetaryServicesCosmosProps> = ({ onSelectService }) => {
  const { content } = useCms();
  const servicesList: ServiceItem[] = content.services && content.services.length > 0 ? content.services : [];

  const [activePlanetId, setActivePlanetId] = useState<string>(servicesList[0]?.id || 'strategy');
  const [activePlanetIndex, setActivePlanetIndex] = useState<number>(0);
  const [isInTransit, setIsInTransit] = useState<boolean>(false);
  const planetRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activePlanetIdRef = useRef<string>(activePlanetId);

  useEffect(() => {
    activePlanetIdRef.current = activePlanetId;
  }, [activePlanetId]);

  // Smooth Google Flow warp jump to specific planet
  const scrollToPlanet = (planetId: string) => {
    const el = document.getElementById(`planet-waypoint-${planetId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Real-time viewport engagement detection with scroll, resize & orientationchange
  useEffect(() => {
    const handleScroll = () => {
      const vh = getViewportHeight();
      const windowCenter = vh * 0.48;

      let closestIdx = 0;
      let minDistance = Infinity;

      planetRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;
        const dist = Math.abs(elCenter - windowCenter);

        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      });

      const inTransitNow = minDistance > vh * 0.28;
      setIsInTransit(inTransitNow);

      const closestSrv = servicesList[closestIdx];
      if (closestSrv && closestSrv.id !== activePlanetIdRef.current) {
        activePlanetIdRef.current = closestSrv.id;
        setActivePlanetId(closestSrv.id);
        setActivePlanetIndex(closestIdx);

        // Notify OriginSpacecraft of engaged planet
        const theme = SERVICE_PLANETS_DATA[closestSrv.id] || DEFAULT_PLANET;
        window.dispatchEvent(
          new CustomEvent('brandorigin:service-waypoint', {
            detail: {
              serviceId: closestSrv.id,
              serviceIndex: closestIdx,
              glowColor: theme.glowColor,
              align: theme.align,
            },
          })
        );
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
  }, [servicesList]);

  const activePlanet = SERVICE_PLANETS_DATA[activePlanetId] || DEFAULT_PLANET;

  return (
    <section
      id="services"
      className="relative w-full py-20 sm:py-28 lg:py-36 px-4 sm:px-6 md:px-12 overflow-hidden bg-transparent select-none"
    >
      {/* Keyframes for smooth 360-degree orbital rotation & upright counter-rotation */}
      <style>{`
        @keyframes planetOrbitSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes planetOrbitCounterSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* Section Header: Clean, Boundless Cosmos */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-10 sm:mb-14 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2.5 sm:gap-3 text-[10px] sm:text-xs font-mono text-[#E31B23] tracking-widest uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23] animate-pulse shrink-0" />
              <span className="truncate">CAPABILITY COSMOS // CELESTIAL PLANETARY FLIGHT</span>
            </div>
            <h2 className="font-['Syne'] text-[clamp(2rem,7vw,4rem)] lg:text-6xl font-bold tracking-tight uppercase text-white leading-none">
              SERVICES.
            </h2>
          </div>

          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-xs font-mono text-[#888]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E31B23] animate-ping shrink-0" />
              <span>
                ACTIVE ORBIT: <span className="text-white font-semibold">0{activePlanetIndex + 1} / 0{servicesList.length}</span>
              </span>
            </div>
            <span className="text-zinc-500 hidden sm:inline">· SCROLL TO NAVIGATE THROUGH DEEP SPACE</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* REAL-TIME INTERPLANETARY FLIGHT TELEMETRY HUD & QUICK JUMP DOCK          */}
        {/* ========================================================================= */}
        <div className="mb-12 sm:mb-20 lg:mb-24 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 sm:gap-4 pb-4 border-b border-white/[0.06] text-xs font-mono">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Radio className={`w-3.5 h-3.5 shrink-0 ${isInTransit ? 'text-amber-400 animate-spin' : 'text-[#E31B23] animate-pulse'}`} />
            <span className="text-zinc-500 uppercase shrink-0 text-[10px] sm:text-xs">FLIGHT STATUS:</span>
            <span className={`font-semibold tracking-wider truncate text-[10px] sm:text-xs ${isInTransit ? 'text-amber-300' : 'text-white'}`}>
              {isInTransit
                ? `INTERPLANETARY TRANSIT // CRUISING TO 0${activePlanetIndex + 1} ${activePlanet.planetName}`
                : `ORBITAL CAPTURE // 0${activePlanetIndex + 1} ${activePlanet.planetName} (${activePlanet.orbitalVelocity})`}
            </span>
          </div>

          {/* Quick-Nav Planet Fast-Travel Waypoints */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 w-full md:w-auto">
            <span className="text-[10px] text-zinc-600 uppercase mr-1 hidden lg:inline shrink-0">COORDINATES:</span>
            {servicesList.map((srv, idx) => {
              const theme = SERVICE_PLANETS_DATA[srv.id] || DEFAULT_PLANET;
              const isCurrent = srv.id === activePlanetId;
              return (
                <button
                  key={srv.id}
                  onClick={() => scrollToPlanet(srv.id)}
                  className={`px-2.5 sm:px-3 py-1.5 text-[10px] font-mono tracking-wider uppercase transition-all duration-300 rounded-xs cursor-pointer whitespace-nowrap shrink-0 ${
                    isCurrent
                      ? 'bg-[#E31B23] text-white font-bold shadow-[0_0_12px_rgba(227,27,35,0.4)]'
                      : 'bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  0{idx + 1} · {theme.planetName}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BOUNDLESS CELESTIAL FLIGHT PATH (RICH PLANETS, NO BOXES)                  */}
        {/* ========================================================================= */}
        <div className="space-y-20 sm:space-y-32 md:space-y-40 lg:space-y-56 relative">
          {/* Subtle Background Interplanetary Hohmann Transfer Trajectory Line (Desktop Only) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block opacity-35 z-0">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="orbital-path-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#E31B23" stopOpacity="0.7" />
                  <stop offset="20%" stopColor="#38BDF8" stopOpacity="0.7" />
                  <stop offset="40%" stopColor="#818CF8" stopOpacity="0.7" />
                  <stop offset="60%" stopColor="#C084FC" stopOpacity="0.7" />
                  <stop offset="80%" stopColor="#F59E0B" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.7" />
                </linearGradient>
              </defs>
              <path
                d="M 28 8 C 28 14, 72 18, 72 25 C 72 32, 28 36, 28 43 C 28 50, 72 54, 72 61 C 72 68, 28 72, 28 79 C 28 86, 72 90, 72 96"
                fill="none"
                stroke="url(#orbital-path-grad)"
                strokeWidth="0.35"
                strokeDasharray="1.5 2.5"
                className="opacity-70"
              />
            </svg>
          </div>

          {servicesList.map((srv, idx) => {
            const theme = SERVICE_PLANETS_DATA[srv.id] || DEFAULT_PLANET;
            const isEngaged = srv.id === activePlanetId;
            const isLeft = theme.align === 'left';

            return (
              <div
                key={srv.id}
                ref={(el) => {
                  planetRefs.current[idx] = el;
                }}
                id={`planet-waypoint-${srv.id}`}
                className="relative flex items-center justify-center lg:justify-between transition-all duration-700 z-10"
              >
                {/* 2-Column Floating Cosmic Layout: Stacked on Mobile/Tablet (<1024px), Alternating Side-by-Side on Desktop (>=1024px) */}
                <div
                  className={`w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-none mx-auto flex flex-col ${
                    isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } items-center justify-between gap-6 sm:gap-10 lg:gap-16 xl:gap-20`}
                >
                  {/* =========================================================== */}
                  {/* HIGH-FIDELITY CELESTIAL PLANET SYSTEM (SELF-CONTAINED)      */}
                  {/* =========================================================== */}
                  <div
                    onClick={() => onSelectService(srv.title)}
                    className="relative flex flex-col items-center justify-center shrink-0 cursor-pointer group w-[clamp(224px,64vw,296px)] h-[clamp(224px,64vw,296px)] md:w-[324px] md:h-[324px] lg:w-[376px] lg:h-[376px]"
                  >
                    {/* Sphere Container (Houses Corona, Rings, Planet Body, & Service-Specific Rotating Items) */}
                    <div className="relative w-full h-full flex items-center justify-center">
                      {/* 1. Deep Atmospheric Scattering Corona */}
                      <div
                        className="absolute rounded-full pointer-events-none transition-all duration-700"
                        style={{
                          width: isEngaged ? 'clamp(190px, 52vw, 270px)' : 'clamp(160px, 44vw, 220px)',
                          height: isEngaged ? 'clamp(190px, 52vw, 270px)' : 'clamp(160px, 44vw, 220px)',
                          background: `radial-gradient(circle, ${theme.glowColor} 0%, ${theme.atmosphereHaze} 38%, rgba(0,0,0,0) 72%)`,
                          filter: isEngaged ? 'blur(32px)' : 'blur(20px)',
                          opacity: isEngaged ? 0.95 : 0.4,
                          transform: isEngaged ? 'scale(1.1)' : 'scale(1.0)',
                        }}
                      />

                      {/* 2. Planetary Ring System (Accretion & Crystalline Ice Rings for Ringed Worlds) */}
                      {theme.hasRings && (
                        <div
                          className={`absolute pointer-events-none transition-all duration-700 z-0 ${
                            isEngaged
                              ? 'w-[clamp(195px,54vw,265px)] h-[clamp(56px,15vw,76px)] md:w-[290px] md:h-[84px] lg:w-[355px] lg:h-[102px]'
                              : 'w-[clamp(170px,46vw,230px)] h-[clamp(48px,13vw,64px)] md:w-[250px] md:h-[70px] lg:w-[285px] lg:h-[80px]'
                          }`}
                          style={{
                            transform: `rotate(${theme.ringTilt || '-16deg'})`,
                            opacity: isEngaged ? 0.92 : 0.5,
                          }}
                        >
                          {/* Outer Cassini Division Ring */}
                          <div
                            className="w-full h-full rounded-full"
                            style={{
                              border: `2px solid ${theme.highlightColor}`,
                              boxShadow: `0 0 22px ${theme.glowColor}, inset 0 0 14px ${theme.glowColor}`,
                              opacity: 0.65,
                            }}
                          />
                          {/* Inner Dense Dust Band */}
                          <div
                            className="absolute inset-[10%] rounded-full"
                            style={{
                              border: `4px solid ${theme.atmosphereHaze}`,
                              opacity: 0.75,
                            }}
                          />
                        </div>
                      )}

                      {/* 3. Service-Specific Items Rotating Around the Planet */}
                      <ServiceOrbitingItems
                        planetId={srv.id}
                        theme={theme}
                        isEngaged={isEngaged}
                      />

                      {/* 4. Rich Multi-Layered Planetary Sphere Body (Proportional Across Mobile, Tablet, Desktop) */}
                      <div
                        className={`rounded-full relative overflow-hidden transition-all duration-700 ease-out z-10 ${
                          isEngaged
                            ? 'w-[clamp(124px,34vw,176px)] h-[clamp(124px,34vw,176px)] md:w-48 md:h-48 lg:w-64 lg:h-64'
                            : 'w-[clamp(108px,30vw,152px)] h-[clamp(108px,30vw,152px)] md:w-40 md:h-40 lg:w-52 lg:h-52 opacity-80 group-hover:opacity-100'
                        }`}
                        style={{
                          background: `radial-gradient(circle at 32% 28%, ${theme.highlightColor} 0%, ${theme.primaryColor} 42%, ${theme.shadowColor} 78%, #020202 100%)`,
                          boxShadow: isEngaged
                            ? `inset -34px -24px 58px rgba(0,0,0,0.96), inset 8px 8px 26px ${theme.highlightColor}55, 0 0 55px ${theme.glowColor}`
                            : `inset -24px -18px 46px rgba(0,0,0,0.94), inset 4px 4px 14px ${theme.highlightColor}33, 0 0 24px rgba(0,0,0,0.9)`,
                        }}
                      >
                        {/* Layer A: Bespoke Planetary Geography, Continents, Magma Rifts, Storms & Auroras */}
                        <PlanetInteriorElements
                          planetId={srv.id}
                          theme={theme}
                          isEngaged={isEngaged}
                        />

                        {/* Layer B: Atmospheric Convection & Swirling Cloud Haze */}
                        <div
                          className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none"
                          style={{
                            background: `radial-gradient(ellipse at 35% 65%, ${theme.secondaryColor}55 0%, transparent 55%), radial-gradient(ellipse at 72% 24%, ${theme.highlightColor}44 0%, transparent 60%)`,
                          }}
                        />

                        {/* Layer C: Solar Specular Ocean / Atmosphere Reflection Glint */}
                        <div
                          className="absolute top-3 left-4 sm:top-5 sm:left-6 w-10 h-10 sm:w-16 sm:h-16 rounded-full pointer-events-none blur-[4px]"
                          style={{
                            background: 'radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.12) 55%, transparent 100%)',
                          }}
                        />

                        {/* Layer D: Crisp Atmospheric Fresnel Rim Light (Day-Side Horizon Limb) */}
                        <div
                          className="absolute inset-0 rounded-full pointer-events-none"
                          style={{
                            boxShadow: `inset 3px 3px 10px ${theme.highlightColor}88, inset -2px -2px 8px rgba(0,0,0,0.9)`,
                          }}
                        />

                        {/* Layer E: Deep Night-Side Crescent Terminator Shadow */}
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background:
                              'radial-gradient(circle at 28% 28%, transparent 46%, rgba(0, 0, 0, 0.55) 68%, rgba(0, 0, 0, 0.92) 92%)',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* =========================================================== */}
                  {/* PURE TYPOGRAPHY & SERVICE INFORMATION (NO BOX OR CARDS)     */}
                  {/* =========================================================== */}
                  <div className="flex-1 max-w-xl text-center lg:text-left w-full px-1 sm:px-0">
                    {/* Orbit Index & Category */}
                    <div className="flex items-center justify-center lg:justify-start gap-2.5 sm:gap-3 font-mono text-[11px] sm:text-xs text-[#888] tracking-widest uppercase mb-3">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: theme.primaryColor }}
                      />
                      <span className="font-bold text-[#E31B23]">0{idx + 1}</span>
                      <span className="text-zinc-600">/</span>
                      <span className="text-zinc-300 font-semibold">{theme.stageName}</span>
                    </div>

                    {/* PROMINENT SERVICE NAME (ENGAGED TITLE) */}
                    <h3
                      className={`font-['Syne'] text-[clamp(1.5rem,5.2vw,2.5rem)] md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[1.08] text-balance transition-all duration-500 ${
                        isEngaged
                          ? 'text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                          : 'text-zinc-400'
                      }`}
                    >
                      {srv.title}
                    </h3>

                    {/* Clean Descriptive Narrative */}
                    <p className="mt-3 sm:mt-4 text-sm sm:text-base text-zinc-300 font-light leading-relaxed max-w-lg mx-auto lg:mx-0">
                      {srv.description}
                    </p>

                    {/* Clean Deliverable List: Unified 1-Col on Mobile (<768px), 2-Col on Tablet/Desktop (>=768px) */}
                    <div className="mt-5 sm:mt-6 space-y-2.5 max-w-sm md:max-w-lg mx-auto lg:mx-0 text-left">
                      <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2 text-center lg:text-left">
                        CAPABILITY DELIVERABLES:
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-2 text-xs sm:text-[13px] text-zinc-300">
                        {srv.deliverables.map((del, i) => (
                          <div key={i} className="flex items-center gap-2.5 bg-white/[0.02] md:bg-transparent px-3 py-1.5 md:p-0 rounded-xs">
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: isEngaged ? theme.primaryColor : '#888' }}
                            />
                            <span className="leading-snug">{del}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Trigger: Full-width Mobile Stack (<768px), Inline Button on Tablet/Desktop (>=768px) */}
                    <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/[0.08] flex items-center justify-center lg:justify-start">
                      <button
                        onClick={() => onSelectService(srv.title)}
                        className="w-full max-w-sm md:w-auto md:min-w-[220px] px-7 py-3.5 sm:py-3 bg-[#E31B23] hover:bg-[#c9141b] text-white font-['Syne'] text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(227,27,35,0.4)] flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95 min-h-[46px]"
                      >
                        <span>Initiate Brief</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
