import React, { useEffect, useRef, useState } from 'react';
import { MasterSpacecraft } from './MasterSpacecraft';
import { CINEMATIC_SHOTS } from '../data/spaceJourneyShots';
import {
  getViewportWidth,
  getViewportHeight,
  isMobileViewport,
  isTabletViewport,
} from '../utils/viewport';

interface OriginSpacecraftProps {
  onSectorChange?: (sector: string) => void;
  overrideSector?: string | null;
  isIntroActive?: boolean;
}

/**
 * Google Flow Flight Path Waypoint Definition.
 * Evaluated with continuous centripetal Catmull-Rom spline curves (C1/C2 continuity).
 */
interface FlowWaypoint {
  t: number;
  x: number;       // percentage of viewport width (vw)
  y: number;       // percentage of viewport height (vh)
  scale: number;   // camera proximity scale
  tiltX: number;   // pitch (degrees)
  tiltY: number;   // yaw (degrees)
  roll: number;    // roll / bank (degrees)
  throttle: number;// 0.0 idle to 1.0 burn
}

const GOOGLE_FLOW_WAYPOINTS: FlowWaypoint[] = [
  // 0.000: Hero Origin Point
  { t: 0.000, x: 50.0, y: 32.0, scale: 0.42, tiltX: 6, tiltY: 0, roll: 0, throttle: 0.18 },
  // 0.080: Leaving Genesis Orbit into Deep Space
  { t: 0.080, x: 50.0, y: 34.0, scale: 0.58, tiltX: 8, tiltY: -6, roll: 2, throttle: 0.22 },
  // 0.160: Planet 01 (Stratos // Business Strategy) Engagement on Left
  { t: 0.160, x: 38.0, y: 44.0, scale: 0.88, tiltX: 10, tiltY: -18, roll: -6, throttle: 0.34 },
  // 0.260: Planet 02 (Aether // Bespoke Web Development) Engagement on Right
  { t: 0.260, x: 62.0, y: 44.0, scale: 0.92, tiltX: 12, tiltY: 20, roll: 6, throttle: 0.38 },
  // 0.360: Planet 03 (Synapse // App Engineering) Engagement on Left
  { t: 0.360, x: 38.0, y: 44.0, scale: 0.90, tiltX: 8, tiltY: -20, roll: -6, throttle: 0.36 },
  // 0.460: Planet 04 (Omnicron // Omnichannel Marketing) Engagement on Right
  { t: 0.460, x: 62.0, y: 44.0, scale: 0.94, tiltX: 10, tiltY: 22, roll: 6, throttle: 0.38 },
  // 0.560: Planet 05 (Valkyrie // Performance & Paid Velocity) Engagement on Left
  { t: 0.560, x: 38.0, y: 44.0, scale: 0.92, tiltX: 6, tiltY: -18, roll: -5, throttle: 0.36 },
  // 0.660: Planet 06 (Monolith // Enterprise Scaling) Engagement on Right
  { t: 0.660, x: 60.0, y: 44.0, scale: 0.96, tiltX: 8, tiltY: 16, roll: 4, throttle: 0.34 },
  // 0.760: Transformation & Projects Conjunction in Center Corridor
  { t: 0.760, x: 50.0, y: 40.0, scale: 1.05, tiltX: 2, tiltY: 0, roll: 0, throttle: 0.28 },
  // 0.880: Atmospheric Approach into Brand Origin Base
  { t: 0.880, x: 50.0, y: 48.0, scale: 0.62, tiltX: 8, tiltY: 0, roll: 0, throttle: 0.22 },
  // 1.000: Footer Touchdown & Miniature Docking Pad (scale 0.22 with landing gear)
  { t: 1.000, x: 50.0, y: 88.0, scale: 0.22, tiltX: 0, tiltY: 0, roll: 0, throttle: 0.04 },
];

/**
 * Standard Catmull-Rom spline interpolation for scalar values.
 */
function catmullRom(p0: number, p1: number, p2: number, p3: number, u: number): number {
  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * u +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u +
      (-p0 + 3 * p1 - 3 * p2 + p3) * u * u * u)
  );
}

/**
 * Analytical derivative for Catmull-Rom spline (tangent velocity vector).
 */
function catmullRomDerivative(p0: number, p1: number, p2: number, p3: number, u: number): number {
  return (
    0.5 *
    ((-p0 + p2) +
      2 * (2 * p0 - 5 * p1 + 4 * p2 - p3) * u +
      3 * (-p0 + 3 * p1 - 3 * p2 + p3) * u * u)
  );
}

/**
 * Evaluates the full flight state and analytical tangent derivatives along Google Flow spline.
 */
function evaluateGoogleFlowSpline(progress: number) {
  const pts = GOOGLE_FLOW_WAYPOINTS;
  const clampedT = Math.max(0, Math.min(1, progress));
  const numSegments = pts.length - 1;
  const totalU = clampedT * numSegments;
  const idx = Math.min(numSegments - 1, Math.max(0, Math.floor(totalU)));
  const u = totalU - idx;

  const p0 = pts[Math.max(0, idx - 1)];
  const p1 = pts[idx];
  const p2 = pts[Math.min(pts.length - 1, idx + 1)];
  const p3 = pts[Math.min(pts.length - 1, idx + 2)];

  const x = catmullRom(p0.x, p1.x, p2.x, p3.x, u);
  const y = catmullRom(p0.y, p1.y, p2.y, p3.y, u);
  const scale = catmullRom(p0.scale, p1.scale, p2.scale, p3.scale, u);
  const tiltX = catmullRom(p0.tiltX, p1.tiltX, p2.tiltX, p3.tiltX, u);
  const tiltY = catmullRom(p0.tiltY, p1.tiltY, p2.tiltY, p3.tiltY, u);
  const roll = catmullRom(p0.roll, p1.roll, p2.roll, p3.roll, u);
  const throttle = catmullRom(p0.throttle, p1.throttle, p2.throttle, p3.throttle, u);

  // Tangents scaled by number of segments for normalized progress
  const tanX = catmullRomDerivative(p0.x, p1.x, p2.x, p3.x, u) * numSegments;
  const tanY = catmullRomDerivative(p0.y, p1.y, p2.y, p3.y, u) * numSegments;

  return { x, y, scale, tiltX, tiltY, roll, throttle, tanX, tanY };
}

/**
 * OriginSpacecraft: Upgraded with Google Flow Motion Architecture
 *
 * Implements:
 * 1. Google Material 3 Critically Damped Fluid Spring Dynamics (zero lag, fluid inertia, zero overshoot).
 * 2. Continuous Centripetal Catmull-Rom Flow Spline across the celestial journey.
 * 3. Flow Tangent Vector Steering & Natural Aerodynamic Banking:
 *    - The spaceship banks dynamically into lateral flight curves.
 *    - Pitch responds organically to ascent and descent vectors.
 *    - Yaw leads the flight trajectory like Google Earth spatial navigators.
 * 4. Velocity-Reactive Thruster Plume:
 *    - Ion thrusters bloom and lengthen with real flight acceleration.
 * 5. Pure Spaceship Presentation:
 *    - Zero hovers, zero click popups, zero bounding halos.
 */
export const OriginSpacecraft: React.FC<OriginSpacecraftProps> = ({
  onSectorChange,
  overrideSector,
  isIntroActive = false,
}) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Render-affecting states (updated only when discrete threshold changes occur)
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isPlanetTraveling, setIsPlanetTraveling] = useState<boolean>(false);
  const [isGearDeployed, setIsGearDeployed] = useState<boolean>(false);
  const [isScanningActive, setIsScanningActive] = useState<boolean>(false);
  const [planetReflectionColor, setPlanetReflectionColor] = useState<string>('rgba(227, 27, 35, 0.45)');
  const [displayThrottle, setDisplayThrottle] = useState<number>(0.18);

  // Google Flow Physics State (100% ref-driven at 60-120fps without React re-render overhead)
  const flowPhysicsRef = useRef({
    // Spring tracking
    targetProgress: 0,
    currentProgress: 0,
    progressVelocity: 0,
    heroIntroProgress: 0,

    // Real spatial coordinates
    posX: 50.0,
    posY: 32.0,
    pitch: 6.0,
    yaw: 0.0,
    roll: 0.0,
    scale: 0.42,
    throttle: 0.18,
    lastRenderedThrottle: 0.18,

    // Environmental & Landing state
    isGrounded: false,
    isGearActive: false,
    isScanning: false,
    mouseX: 0,
    mouseY: 0,
    gimbalX: 0,
    gimbalY: 0,

    isMobile: false,
    isTablet: false,
    lastFrameTime: 0,
    introStartTime: 0,
    lastSectorName: 'SYS.DEEP_SPACE',
  });

  // Listen to planet travel state & service waypoint reflections
  useEffect(() => {
    const handlePlanetTravel = (e: Event) => {
      const customEvent = e as CustomEvent;
      const isTraveling = Boolean(customEvent.detail?.isTraveling);
      setIsPlanetTraveling(isTraveling);
    };

    const handleServiceWaypoint = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.glowColor) {
        setPlanetReflectionColor(customEvent.detail.glowColor);
      }
    };

    window.addEventListener('brandorigin:planet-travel-active', handlePlanetTravel);
    window.addEventListener('brandorigin:service-waypoint', handleServiceWaypoint);
    return () => {
      window.removeEventListener('brandorigin:planet-travel-active', handlePlanetTravel);
      window.removeEventListener('brandorigin:service-waypoint', handleServiceWaypoint);
    };
  }, []);

  // Reduced motion preference
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(media.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, []);

  // Viewport resize & subtle camera gimbal tracking
  useEffect(() => {
    const handleResize = () => {
      flowPhysicsRef.current.isMobile = isMobileViewport();
      flowPhysicsRef.current.isTablet = isTabletViewport();
    };
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      const cx = getViewportWidth() / 2;
      const cy = getViewportHeight() / 2;
      if (cx > 0 && cy > 0) {
        flowPhysicsRef.current.mouseX = (e.clientX - cx) / cx;
        flowPhysicsRef.current.mouseY = (e.clientY - cy) / cy;
      }
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Genesis emergence: Google Emphasized deceleration arrival into orbital hold (ref-driven)
  useEffect(() => {
    flowPhysicsRef.current.introStartTime = performance.now();
    let introId: number;

    const runIntro = (time: number) => {
      const elapsed = time - flowPhysicsRef.current.introStartTime;
      const duration = 1200; // Snappy Google Flow entrance
      const progress = Math.min(1, elapsed / duration);
      // Google Emphasized Decelerate cubic curve
      const eased = 1 - Math.pow(1 - progress, 3);
      flowPhysicsRef.current.heroIntroProgress = eased;

      if (progress < 1) {
        introId = requestAnimationFrame(runIntro);
      }
    };

    introId = requestAnimationFrame(runIntro);
    return () => cancelAnimationFrame(introId);
  }, []);

  // Google Flow Physics Engine (Raf Tick Loop)
  useEffect(() => {
    let animId: number;

    const handleScroll = () => {
      const vh = getViewportHeight();
      const docHeight = document.documentElement.scrollHeight - vh;
      const rawProgress = docHeight > 0 ? Math.max(0, Math.min(1, window.scrollY / docHeight)) : 0;
      flowPhysicsRef.current.targetProgress = rawProgress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    window.addEventListener('orientationchange', handleScroll, { passive: true });
    handleScroll();

    const tick = (now: number) => {
      const p = flowPhysicsRef.current;
      const prevTime = p.lastFrameTime || now;
      p.lastFrameTime = now;
      const dt = Math.min(0.033, Math.max(0.001, (now - prevTime) / 1000));

      // 1. GOOGLE MATERIAL 3 SPRING KINEMATICS (CRITICALLY DAMPED FLUID FLOW)
      const SPRING_OMEGA = 15.0;
      const SPRING_ZETA = 0.98;
      const diff = p.targetProgress - p.currentProgress;
      const springAcc = SPRING_OMEGA * SPRING_OMEGA * diff - 2 * SPRING_ZETA * SPRING_OMEGA * p.progressVelocity;
      p.progressVelocity += springAcc * dt;
      p.currentProgress += p.progressVelocity * dt;

      const currentP = Math.max(0, Math.min(1, p.currentProgress));
      const flowVelocity = p.progressVelocity; // signed scroll rate
      const flowSpeed = Math.abs(flowVelocity) * 60; // normalized speed

      // 2. ACTIVE CINEMATIC SHOT LOOKUP (Only notify parent when sector actually changes)
      let matchedShot = CINEMATIC_SHOTS[0];
      for (let i = 0; i < CINEMATIC_SHOTS.length; i++) {
        const shot = CINEMATIC_SHOTS[i];
        if (currentP >= shot.scrollStart && currentP <= shot.scrollEnd) {
          matchedShot = shot;
          break;
        }
      }
      if (currentP > CINEMATIC_SHOTS[CINEMATIC_SHOTS.length - 1].scrollEnd) {
        matchedShot = CINEMATIC_SHOTS[CINEMATIC_SHOTS.length - 1];
      }

      const activeSectorName = overrideSector || matchedShot.title;
      if (p.lastSectorName !== activeSectorName) {
        p.lastSectorName = activeSectorName;
        onSectorChange?.(activeSectorName);
      }

      // 2b. SERVICE PLANET PROXIMITY DETECTION & SCANNING ENGAGEMENT
      const isNearPlanet = currentP >= 0.12 && currentP <= 0.72;
      if (p.isScanning !== isNearPlanet) {
        p.isScanning = isNearPlanet;
        setIsScanningActive(isNearPlanet);
      }

      // 3. CONTINUOUS CATMULL-ROM GOOGLE FLOW SPLINE EVALUATION
      const flow = evaluateGoogleFlowSpline(currentP);

      // Check proximity to planet waypoints to calculate interplanetary transit burn
      const planetWaypoints = [0.160, 0.260, 0.360, 0.460, 0.560, 0.660];
      let minPlanetDist = 1.0;
      planetWaypoints.forEach((wp) => {
        const d = Math.abs(currentP - wp);
        if (d < minPlanetDist) minPlanetDist = d;
      });
      const isTransitFlight = currentP >= 0.12 && currentP <= 0.70 && minPlanetDist > 0.022;
      const transitBurnBoost = isTransitFlight ? Math.min(0.24, minPlanetDist * 5.0) : 0;

      let targetX = flow.x;
      let targetY = flow.y;
      let targetScale = flow.scale;
      let targetPitch = flow.tiltX;
      let targetYaw = flow.tiltY;
      let targetRoll = flow.roll;
      let baseThrottle = flow.throttle + transitBurnBoost;

      // Authoritative CSS layout viewport width & height (synchronized with CSS @media breakpoints)
      const vw = overlayRef.current?.clientWidth || getViewportWidth();
      const vh = overlayRef.current?.clientHeight || getViewportHeight();
      const isMobile = isMobileViewport();
      const isTablet = isTabletViewport();

      if (isMobile) {
        // All Mobile Phones (320px - 767px): Proportionally scaled spacecraft along the smooth Catmull-Rom trajectory
        const mobileScaleFactor = vw < 400 ? 0.44 : 0.48;
        const maxMobileScale = vw < 400 ? 0.38 : 0.44;
        targetScale = Math.min(maxMobileScale, flow.scale * mobileScaleFactor);
        targetX = Math.max(18, Math.min(82, 50 + (flow.x - 50) * 1.15));
      } else if (isTablet) {
        // Tablets (768px - 1023px): Balanced intermediate scale along smooth spline trajectory
        targetScale = Math.min(0.62, flow.scale * 0.68);
        targetX = Math.max(22, Math.min(78, 50 + (flow.x - 50) * 1.1));
      }

      // 4. PRECISION FOOTER DOCKING GUIDANCE (SPACECRAFT BECOMES SMALL AND LANDS INSIDE FOOTER)
      const landingStart = 0.84;
      const landingT = Math.max(0, Math.min(1, (currentP - landingStart) / (1.0 - landingStart)));
      const landingEase = landingT * landingT * (3 - 2 * landingT); // smoothstep curve

      // Query real-time footer landing deck target relative to authoritative overlay dimensions
      let dockCenterX = 50.0;
      let dockCenterY = 88.0;
      const touchdownPad = typeof document !== 'undefined' ? document.getElementById('footer-touchdown-pad') : null;
      if (touchdownPad && vw > 0 && vh > 0) {
        const rect = touchdownPad.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          dockCenterX = ((rect.left + rect.width / 2) / vw) * 100;
          dockCenterY = ((rect.top + rect.height / 2) / vh) * 100;
        }
      }

      if (landingT > 0) {
        targetX = targetX * (1 - landingEase) + dockCenterX * landingEase;
        targetY = targetY * (1 - landingEase) + dockCenterY * landingEase;
        const dockScale = isMobile ? 0.18 : isTablet ? 0.20 : 0.22;
        targetScale = targetScale * (1 - landingEase) + dockScale * landingEase;
        targetPitch = targetPitch * (1 - landingEase);
        targetRoll = targetRoll * (1 - landingEase);
        targetYaw = targetYaw * (1 - landingEase);
        baseThrottle = baseThrottle * (1 - landingEase) + 0.03 * landingEase;
      }

      // Landing gear triggers during descent flare
      const gearShouldDeploy = landingT >= 0.35;
      if (p.isGearActive !== gearShouldDeploy) {
        p.isGearActive = gearShouldDeploy;
        setIsGearDeployed(gearShouldDeploy);
      }

      // Grounded state confirmation once nestled inside footer pad
      const isTouchdown = landingT >= 0.94;
      if (p.isGrounded !== isTouchdown) {
        p.isGrounded = isTouchdown;
        window.dispatchEvent(
          new CustomEvent('brandorigin:spacecraft-landed', {
            detail: { isLanded: isTouchdown },
          })
        );
      }

      // 5. FLIGHT TANGENT VECTOR & NATURAL AERODYNAMIC BANKING (GOOGLE FLOW VECTOR)
      const velocityVx = flowVelocity * flow.tanX * 60;
      const velocityVy = flowVelocity * flow.tanY * 60;

      const landingStabilizer = 1 - landingEase;
      const dynamicBankRoll = Math.max(-18, Math.min(18, velocityVx * 0.70)) * landingStabilizer;
      const dynamicPitch = Math.max(-8, Math.min(8, velocityVy * 0.35)) * landingStabilizer;
      const dynamicLookaheadYaw = Math.max(-14, Math.min(14, velocityVx * 0.50)) * landingStabilizer;

      // 6. UNIFIED RIGID-BODY TRACKING
      const FOLLOW_RATE = 0.22;
      p.posX += (targetX - p.posX) * FOLLOW_RATE;
      p.posY += (targetY - p.posY) * FOLLOW_RATE;
      p.scale += (targetScale - p.scale) * FOLLOW_RATE;

      p.roll += (targetRoll + dynamicBankRoll - p.roll) * FOLLOW_RATE;
      p.pitch += (targetPitch + dynamicPitch - p.pitch) * FOLLOW_RATE;
      p.yaw += (targetYaw + dynamicLookaheadYaw - p.yaw) * FOLLOW_RATE;

      // 7. REACTIVE ION ENGINE THROTTLE DYNAMICS
      const targetThrottle = landingT > 0.8
        ? 0.03
        : Math.max(0.18, Math.min(0.92, baseThrottle + flowSpeed * 0.65));
      p.throttle += (targetThrottle - p.throttle) * 0.16;
      if (Math.abs(p.throttle - p.lastRenderedThrottle) > 0.035) {
        p.lastRenderedThrottle = p.throttle;
        setDisplayThrottle(p.throttle);
      }

      // 8. ORGANIC WEIGHTLESS ZERO-G STABILIZATION
      const floatDamping = 1 - Math.min(1, landingEase * 1.15);
      const microFloatY = Math.sin(now * 0.001) * 0.25 * floatDamping;
      const microFloatRoll = Math.cos(now * 0.0008) * 0.20 * floatDamping;

      p.gimbalX += (p.mouseX - p.gimbalX) * 0.06;
      p.gimbalY += (p.mouseY - p.gimbalY) * 0.06;
      const gimbalRoll = p.gimbalX * 1.0 * floatDamping;
      const gimbalPitch = -p.gimbalY * 0.8 * floatDamping;
      const gimbalYaw = p.gimbalX * 1.0 * floatDamping;

      const introProgress = p.heroIntroProgress;
      const introScaleMul = 0.25 + 0.75 * introProgress;
      const introYOffset = (1 - introProgress) * -18;
      const introOpacity = Math.min(1, introProgress * 1.8);

      const finalX = p.posX;
      const finalY = p.posY + microFloatY * 0.04 + (currentP < 0.06 ? introYOffset : 0);
      const finalRoll = p.roll + microFloatRoll + gimbalRoll;
      const finalPitch = p.pitch + gimbalPitch;
      const finalYaw = p.yaw + gimbalYaw;
      const finalScale = p.scale * (currentP < 0.06 ? introScaleMul : 1);

      // 9. PIXEL-EXACT HARDWARE-ACCELERATED 3D RENDER (Avoids iOS Safari / Android Chrome vw/vh transform drift)
      if (containerRef.current) {
        const pxX = (finalX / 100) * vw;
        const pxY = (finalY / 100) * vh;
        containerRef.current.style.transform = `translate3d(${pxX.toFixed(1)}px, ${pxY.toFixed(1)}px, 0px) rotateZ(${finalRoll.toFixed(2)}deg) rotateX(${finalPitch.toFixed(2)}deg) rotateY(${finalYaw.toFixed(2)}deg) scale(${finalScale.toFixed(3)})`;
        containerRef.current.style.opacity = `${introOpacity}`;
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('orientationchange', handleScroll);
      cancelAnimationFrame(animId);
    };
  }, [overrideSector, onSectorChange]);

  if (reducedMotion || isIntroActive || isPlanetTraveling) {
    return null;
  }

  const currentThrottle = displayThrottle;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none"
      style={{ perspective: '1600px' }}
      aria-hidden="true"
    >
      {/* Master Spacecraft Container - Pure, isolated spacecraft without surrounding glows or hovers */}
      <div
        ref={containerRef}
        className="absolute top-0 left-0 -ml-[130px] -mt-[135px] w-[260px] h-[270px] will-change-transform flex items-center justify-center opacity-100 pointer-events-none"
      >
        <div className="relative pointer-events-none">
          {/* High-Velocity Interplanetary Ion Slipstream Trails */}
          {currentThrottle > 0.28 && !isGearDeployed && (
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{ opacity: Math.min(0.9, (currentThrottle - 0.25) * 2.0) }}
            >
              {/* Port Engine Slipstream Ribbon */}
              <div
                className="absolute top-[162px] left-[93px] w-[3px] bg-gradient-to-b from-[#FF4A52] via-[#E31B23]/60 to-transparent blur-[1px] rounded-full pointer-events-none"
                style={{ height: `${Math.min(160, currentThrottle * 180)}px` }}
              />
              {/* Starboard Engine Slipstream Ribbon */}
              <div
                className="absolute top-[162px] left-[164px] w-[3px] bg-gradient-to-b from-[#FF4A52] via-[#E31B23]/60 to-transparent blur-[1px] rounded-full pointer-events-none"
                style={{ height: `${Math.min(160, currentThrottle * 180)}px` }}
              />
            </div>
          )}

          <MasterSpacecraft
            idPrefix="master-film-spacecraft"
            throttle={currentThrottle}
            width={260}
            height={270}
            landingGearDeployed={isGearDeployed}
            isScanning={isScanningActive}
            planetaryReflectionColor={planetReflectionColor}
            planetaryReflectionIntensity={isScanningActive ? 0.75 : 0.08}
          />
        </div>
      </div>
    </div>
  );
};
