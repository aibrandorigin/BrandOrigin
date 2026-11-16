/**
 * CINEMATIC SPACE JOURNEY SHOT CHOREOGRAPHY SYSTEM
 *
 * Implements the 8-Shot Cinematographer Progression (SHOT A through SHOT H)
 * adhering strictly to deliberate professional sci-fi cinematography:
 *
 * - SHOT A: Very wide establishing shot. Spaceship is small within a huge environment.
 * - SHOT B: Slow orbital camera movement around the spaceship. Reveal silhouette & scale.
 * - SHOT C: Three-quarter rear tracking shot. Camera follows spacecraft as it begins travelling.
 * - SHOT D: Side tracking shot. Spacecraft crosses the frame while environment moves naturally.
 * - SHOT E: Front three-quarter shot. Reveal spacecraft approaching the destination.
 * - SHOT F: Close cinematic shot. Subtle reflections, engine illumination & material detail.
 * - SHOT G: Wide destination shot. Reveal the planet and spacecraft together.
 * - SHOT H: Atmospheric approach. Camera follows spacecraft into the planet's atmosphere.
 *
 * Ground rules:
 * - NO locking camera behind ship for entire animation.
 * - Intentional, expensive camera movements: slow dolly, controlled tracking, orbital movement,
 *   crane-like movement, gentle push-in, gradual pull-back, cinematic parallax, realistic depth of field.
 * - ZERO handheld camera shake, zero rapid zooms, zero unnecessary spins, zero drone-like random movement,
 *   zero camera teleportation.
 */

export interface CinematicShotDefinition {
  id: string;
  shotLetter: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
  shotNumber: string;
  title: string;
  sectionAnchor: string;
  scrollStart: number; // 0.0 - 1.0
  scrollEnd: number;   // 0.0 - 1.0

  // Film Director & Cinematographer Breakdown
  directorBreakdown: {
    subject: string;
    cameraPosition: string;
    cameraMovement: string;
    spaceshipMovement: string;
    environmentMovement: string;
    lighting: string;
    depth: string;
    transitionIntoNextShot: string;
  };

  // Physical Spacecraft Transform at Keypoints (start, end)
  transform: {
    start: {
      x: number;       // percentage of viewport width (vw)
      y: number;       // percentage of viewport height (vh)
      scale: number;   // camera proximity scale
      tiltX: number;   // camera pitch / ship pitch in degrees
      tiltY: number;   // camera yaw / orbital angle in degrees
      roll: number;    // camera roll / bank in degrees
      throttle: number;// 0.0 idle to 1.0 full burn
    };
    end: {
      x: number;
      y: number;
      scale: number;
      tiltX: number;
      tiltY: number;
      roll: number;
      throttle: number;
    };
  };

  // Atmospheric and cinematic lighting specs
  atmosphere: {
    ambientColor: string;
    rimLightColor: string;
    keyLightAngleDeg: number;
    volumetricHaze: number; // 0.0 - 1.0
    lensExposure: number;   // 0.0 - 1.0
    landingGearDeployed?: boolean;
    scanningGrid?: boolean;
    backdropTone?: string;
  };

  // Cinematic Shot Overlay Info (film slate)
  slate: {
    lens: string;             // e.g. "Anamorphic 40mm T2.0 Prime"
    cameraTechnique: string;  // e.g. "EXTREME WIDE VISTA DOLLY"
    lightingKey: string;      // e.g. "Deep Void Rim / Singularity Core"
  };
}

export const CINEMATIC_SHOTS: CinematicShotDefinition[] = [
  // ---------------------------------------------------------------------------
  // SHOT A: VERY WIDE ESTABLISHING SHOT
  // "The spaceship is small within a huge environment."
  // ---------------------------------------------------------------------------
  {
    id: 'shot-a-establishing',
    shotLetter: 'A',
    shotNumber: 'SHOT A',
    title: 'VERY WIDE ESTABLISHING VISTA',
    sectionAnchor: 'hero',
    scrollStart: 0.0,
    scrollEnd: 0.125,
    directorBreakdown: {
      subject: 'Master Brand Origin Spacecraft isolated against the immense cosmic genesis void.',
      cameraPosition: 'Extreme wide establishing distance, 120m away on the central vector axis, slightly elevated.',
      cameraMovement: 'Extremely slow, deliberate forward dolly through deep space. No shake, no rapid motion.',
      spaceshipMovement: 'Vessel holds position with gentle micro-inertial stabilization over the Brand Origin genesis coordinate.',
      environmentMovement: 'Distant star clusters and faint cosmic nebula sheets drift with subtle physical deep-field parallax.',
      lighting: 'Cold deep-void directional key light skimming titanium hull chamfers, faint crimson rim from fusion core.',
      depth: 'Vast cosmic depth of field: ship is sharp and small in frame, background stars infinitely deep.',
      transitionIntoNextShot: 'Camera begins a slow circular crane arc, smoothly transitioning into an orbital inspection of the hull.',
    },
    transform: {
      start: { x: 50.0, y: 32.0, scale: 0.42, tiltX: 6, tiltY: 0, roll: 0, throttle: 0.18 },
      end:   { x: 50.0, y: 34.0, scale: 0.58, tiltX: 8, tiltY: -6, roll: 2, throttle: 0.22 },
    },
    atmosphere: {
      ambientColor: 'rgba(227, 27, 35, 0.08)',
      rimLightColor: 'rgba(255, 255, 255, 0.85)',
      keyLightAngleDeg: 140,
      volumetricHaze: 0.15,
      lensExposure: 0.82,
    },
    slate: {
      lens: 'Anamorphic 28mm T2.8 Large-Format',
      cameraTechnique: 'SLOW FORWARD DOLLY // VAST SCALE',
      lightingKey: 'Deep Void Key & Subdued Reactor Rim',
    },
  },

  // ---------------------------------------------------------------------------
  // SHOT B: SLOW ORBITAL CAMERA MOVEMENT AROUND THE SPACESHIP
  // "Reveal the silhouette and scale."
  // ---------------------------------------------------------------------------
  {
    id: 'shot-b-orbital',
    shotLetter: 'B',
    shotNumber: 'SHOT B',
    title: 'ORBITAL CAMERA SILHOUETTE INSPECTION',
    sectionAnchor: 'genesis',
    scrollStart: 0.125,
    scrollEnd: 0.25,
    directorBreakdown: {
      subject: 'The iconic Brand Origin monogram silhouette carved in brushed titanium hull plating.',
      cameraPosition: 'Sweeping 180° orbital arc from three-quarter front to port side flank.',
      cameraMovement: 'Controlled technocrane orbital sweep maintaining a steady 12m focal radius around the vehicle.',
      spaceshipMovement: 'Spacecraft rotates subtly against the camera orbit, revealing its 45° vector canards and engine cowlings.',
      environmentMovement: 'Cosmic grid coordinates glide fluidly in the background, accentuating the curved orbital camera path.',
      lighting: 'Specular reflection travels continuously across the anisotropic titanium fuselage as the camera orbits.',
      depth: 'Medium shot intimacy; hull geometry stands out crisply with rich cinematic tonal contrast.',
      transitionIntoNextShot: 'Camera settles directly into a three-quarter rear position as main ion propulsion drives spool up.',
    },
    transform: {
      start: { x: 50.0, y: 34.0, scale: 0.58, tiltX: 8, tiltY: -6, roll: 2, throttle: 0.22 },
      end:   { x: 64.0, y: 38.0, scale: 0.82, tiltX: 12, tiltY: -32, roll: 5, throttle: 0.32 },
    },
    atmosphere: {
      ambientColor: 'rgba(227, 27, 35, 0.12)',
      rimLightColor: 'rgba(255, 255, 255, 0.95)',
      keyLightAngleDeg: 80,
      volumetricHaze: 0.20,
      lensExposure: 0.88,
    },
    slate: {
      lens: 'Anamorphic 50mm T2.0 Cine Prime',
      cameraTechnique: 'CONTROLLED TECHNOCRANE ORBITAL SWEEP',
      lightingKey: 'Dynamic Specular Hull Traveling Glint',
    },
  },

  // ---------------------------------------------------------------------------
  // SHOT C: THREE-QUARTER REAR TRACKING SHOT
  // "Camera follows the spacecraft as it approaches the first Service Planets."
  // ---------------------------------------------------------------------------
  {
    id: 'shot-c-rear-tracking',
    shotLetter: 'C',
    shotNumber: 'SHOT C',
    title: 'INTERPLANETARY INJECTION // SERVICE PLANETS ENCOUNTER',
    sectionAnchor: 'services',
    scrollStart: 0.25,
    scrollEnd: 0.375,
    directorBreakdown: {
      subject: 'Dual ion propulsion thrusters accelerating spacecraft toward Planet 01 (Strategy & Moat) and Planet 02 (Aether-Web).',
      cameraPosition: 'Positioned 20m behind and 4m above the port thruster nozzle, angled forward along flight path.',
      cameraMovement: 'Smooth pursuit chase truck, matching spacecraft forward acceleration with gentle inertial lag.',
      spaceshipMovement: 'Spacecraft gradually increases velocity; dual ion thruster nozzles flare with restrained, controlled plasma.',
      environmentMovement: 'Celestial service coordinates and planetary atmospheres stream into optical focus.',
      lighting: 'Brilliant ion plasma backlighting illuminating camera lens elements with subtle anamorphic horizontal streak.',
      depth: 'Long-lens perspective compression: aft thrusters in crisp focus, target service planet glowing ahead.',
      transitionIntoNextShot: 'Camera smoothly glides out to the starboard flank for a parallel side-tracking profile.',
    },
    transform: {
      start: { x: 62.0, y: 38.0, scale: 0.84, tiltX: 12, tiltY: -28, roll: 5, throttle: 0.34 },
      end:   { x: 34.0, y: 40.0, scale: 0.92, tiltX: 14, tiltY: 20, roll: -7, throttle: 0.46 },
    },
    atmosphere: {
      ambientColor: 'rgba(227, 27, 35, 0.16)',
      rimLightColor: '#FF4A52',
      keyLightAngleDeg: 170,
      volumetricHaze: 0.24,
      lensExposure: 0.92,
    },
    slate: {
      lens: 'Anamorphic 65mm T1.8 Pursuit Prime',
      cameraTechnique: 'HIGH-INERTIA REAR CHASE TRUCK',
      lightingKey: 'Ion Plasma Exhaust & Aft Rim Flare',
    },
  },

  // ---------------------------------------------------------------------------
  // SHOT D: SIDE TRACKING SHOT
  // "Spacecraft crosses the frame while orbiting the Digital Service Planets."
  // ---------------------------------------------------------------------------
  {
    id: 'shot-d-side-tracking',
    shotLetter: 'D',
    shotNumber: 'SHOT D',
    title: 'PLANETARY ORBITAL SWEEP // DIGITAL DISCIPLINES',
    sectionAnchor: 'services',
    scrollStart: 0.375,
    scrollEnd: 0.50,
    directorBreakdown: {
      subject: 'Clean horizontal aerodynamic profile of the titanium fuselage orbiting Planet 03 (Synapse Engine) and Planet 04 (Omnicron Reach).',
      cameraPosition: 'Mounted directly perpendicular to vessel heading, 90° beam aspect, level horizontal plane.',
      cameraMovement: 'Pure lateral dolly tracking alongside the vessel at matched cruise velocity.',
      spaceshipMovement: 'Spacecraft cuts steadily through the frame horizontally, wings level, propulsion at smooth cruising thrust.',
      environmentMovement: 'Deep background stars and glowing planetary rings slide horizontally at realistic multi-plane parallax.',
      lighting: 'Architectural studio raking light: crisp top bevel highlights, planetary colored rim lighting.',
      depth: 'True cinematic multi-plane parallax: fast foreground grid -> crisp spacecraft -> slowly drifting background celestial planets.',
      transitionIntoNextShot: 'Camera cranes forward and arcs across the bow into a front three-quarter approach perspective.',
    },
    transform: {
      start: { x: 34.0, y: 40.0, scale: 0.92, tiltX: 14, tiltY: 20, roll: -7, throttle: 0.46 },
      end:   { x: 70.0, y: 42.0, scale: 0.90, tiltX: 2, tiltY: -50, roll: 3, throttle: 0.44 },
    },
    atmosphere: {
      ambientColor: 'rgba(56, 189, 248, 0.10)',
      rimLightColor: '#38BDF8',
      keyLightAngleDeg: 60,
      volumetricHaze: 0.20,
      lensExposure: 0.88,
    },
    slate: {
      lens: 'Anamorphic 75mm T2.4 Studio Profile',
      cameraTechnique: 'MATCHED VELOCITY LATERAL DOLLY',
      lightingKey: 'Architectural Raking Key & Planetary Albedo',
    },
  },

  // ---------------------------------------------------------------------------
  // SHOT E: FRONT THREE-QUARTER SHOT
  // "Reveal the spacecraft approaching the Growth Planets."
  // ---------------------------------------------------------------------------
  {
    id: 'shot-e-front-three-quarter',
    shotLetter: 'E',
    shotNumber: 'SHOT E',
    title: 'APPROACHING GROWTH WORLDS // QUANT & SCALE',
    sectionAnchor: 'services',
    scrollStart: 0.50,
    scrollEnd: 0.625,
    directorBreakdown: {
      subject: 'Forward cockpit canopy and bow titanium nose scanning Planet 05 (Valkyrie Velocity) and Planet 06 (Monolith Scale).',
      cameraPosition: 'Positioned ahead of the vessel, looking back at a 40° bow angle as the craft approaches camera.',
      cameraMovement: 'Gentle pullback dolly matching vessel approach speed, keeping the advancing ship framed with authority.',
      spaceshipMovement: 'Spaceship powers toward camera along its destination vector, executing a subtle 4° stabilization roll.',
      environmentMovement: 'Distant solar gold and emerald atmospheres expand outward with natural optical perspective.',
      lighting: 'Forward key light reflecting off cockpit glazing; internal red fusion reactor core casting warm glow onto inner nose.',
      depth: 'Vessel advances from midground toward close presence; background cosmic fields gently soft-focus.',
      transitionIntoNextShot: 'Camera tightens focus and pushes in for an intimate close-up on physical hull materials.',
    },
    transform: {
      start: { x: 70.0, y: 42.0, scale: 0.90, tiltX: 2, tiltY: -50, roll: 3, throttle: 0.44 },
      end:   { x: 42.0, y: 42.0, scale: 0.98, tiltX: -6, tiltY: 24, roll: -4, throttle: 0.38 },
    },
    atmosphere: {
      ambientColor: 'rgba(245, 158, 11, 0.12)',
      rimLightColor: '#F59E0B',
      keyLightAngleDeg: 120,
      volumetricHaze: 0.26,
      lensExposure: 0.90,
    },
    slate: {
      lens: 'Anamorphic 50mm T1.8 Forward Prime',
      cameraTechnique: 'GENTLE PULL-BACK ADVANCING DOLLY',
      lightingKey: 'Cockpit Specular Glaze & Solar Atmosphere',
    },
  },

  // ---------------------------------------------------------------------------
  // SHOT F: CLOSE CINEMATIC SHOT
  // "Show subtle reflections, engine illumination and material detail."
  // ---------------------------------------------------------------------------
  {
    id: 'shot-f-close-cinematic',
    shotLetter: 'F',
    shotNumber: 'SHOT F',
    title: 'CLOSE CINEMATIC MATERIAL & HULL DETAIL',
    sectionAnchor: 'transformation',
    scrollStart: 0.625,
    scrollEnd: 0.75,
    directorBreakdown: {
      subject: 'Precision engineering details: anisotropic brushed titanium grain, laser-cut chamfer bevels, fusion core disc.',
      cameraPosition: 'Tight macro cinematic distance (3m from hull), angled across the central Brand Origin incision line.',
      cameraMovement: 'Slow, majestic macro jib drift across the titanium panel seams and glowing fusion reactor rim.',
      spaceshipMovement: 'Spacecraft maintains silky smooth cruising alignment; thrusters pulse with micro-adjustments.',
      environmentMovement: 'External starfield is deeply blurred in bokeh; light from passing stars glints across metallic bevels.',
      lighting: 'Extreme macro studio lighting: razor-sharp specular streaks along bevel lines, soft red subsurface core diffusion.',
      depth: 'Shallow depth of field: foreground titanium panel in crystalline focus, background wingtip softly blurred.',
      transitionIntoNextShot: 'Camera fluidly pulls back on a high crane boom, revealing the planetary destination ahead.',
    },
    transform: {
      start: { x: 42.0, y: 42.0, scale: 0.98, tiltX: -6, tiltY: 24, roll: -4, throttle: 0.38 },
      end:   { x: 54.0, y: 40.0, scale: 1.12, tiltX: 4, tiltY: -12, roll: 0, throttle: 0.30 },
    },
    atmosphere: {
      ambientColor: 'rgba(227, 27, 35, 0.18)',
      rimLightColor: '#FFFFFF',
      keyLightAngleDeg: 95,
      volumetricHaze: 0.28,
      lensExposure: 0.94,
    },
    slate: {
      lens: 'Anamorphic 90mm T1.5 Macro Master',
      cameraTechnique: 'SLOW JIB DRIFT // SHALLOW FOCUS',
      lightingKey: 'Macro Specular Glint & Anisotropic Titanium',
    },
  },

  // ---------------------------------------------------------------------------
  // SHOT G: WIDE DESTINATION SHOT
  // "Reveal Mission Flight Logs Archive."
  // ---------------------------------------------------------------------------
  {
    id: 'shot-g-wide-destination',
    shotLetter: 'G',
    shotNumber: 'SHOT G',
    title: 'MISSION FLIGHT LOGS // CASE ARCHIVE CONJUNCTION',
    sectionAnchor: 'work',
    scrollStart: 0.75,
    scrollEnd: 0.875,
    directorBreakdown: {
      subject: 'Master Spacecraft in conjunction with Mission Flight Logs terminal and proven commercial transformations.',
      cameraPosition: 'Grand wide cinematic angle framing both the orbital terminal telemetry and the cruising spacecraft.',
      cameraMovement: 'Controlled high crane pedestal down, balancing the majestic scale of the archives and the precise craft.',
      spaceshipMovement: 'Spacecraft decelerates noticeably, throttling down from cruise to orbital insertion vector.',
      environmentMovement: 'Flight telemetry data arcs stream across deep space.',
      lighting: 'Atmospheric albedo reflection: rich colored telemetry light reflects across the titanium belly.',
      depth: 'Two-tier cosmic depth: midground spacecraft positioned in perfect compositional harmony with flight logs terminal.',
      transitionIntoNextShot: 'Camera locks onto the spacecraft tail and pushes in as the vessel penetrates atmospheric landing approach.',
    },
    transform: {
      start: { x: 54.0, y: 40.0, scale: 1.12, tiltX: 4, tiltY: -12, roll: 0, throttle: 0.30 },
      end:   { x: 50.0, y: 46.0, scale: 0.88, tiltX: 12, tiltY: 0, roll: 0, throttle: 0.24 },
    },
    atmosphere: {
      ambientColor: 'rgba(227, 27, 35, 0.25)',
      rimLightColor: '#FF4A52',
      keyLightAngleDeg: 130,
      volumetricHaze: 0.35,
      lensExposure: 0.98,
      scanningGrid: true,
    },
    slate: {
      lens: 'Anamorphic 35mm T2.0 Vista Prime',
      cameraTechnique: 'HIGH CRANE PEDESTAL // ARCHIVE CONJUNCTION',
      lightingKey: 'Telemetry Albedo Bounce & Dual Horizon Rim',
    },
  },

  // ---------------------------------------------------------------------------
  // SHOT H: ATMOSPHERIC APPROACH
  // "Camera follows the spacecraft into the planet's atmosphere."
  // ---------------------------------------------------------------------------
  {
    id: 'shot-h-atmospheric-approach',
    shotLetter: 'H',
    shotNumber: 'SHOT H',
    title: 'ATMOSPHERIC ENTRY & FOOTER TOUCHDOWN',
    sectionAnchor: 'cta',
    scrollStart: 0.875,
    scrollEnd: 1.0,
    directorBreakdown: {
      subject: 'Master Brand Origin Spacecraft descending and executing precision docking landing inside the footer recovery cradle.',
      cameraPosition: 'Elevated overhead approach tracking shot following the vessel to touchdown.',
      cameraMovement: 'Cinematic glide with soft decelerate flare into the footer landing pad.',
      spaceshipMovement: 'Controlled landing descent with deployed hydraulic landing gear and cold-idle thruster flare.',
      environmentMovement: 'Runway guide beacons activate as the craft secures onto the recovery pad.',
      lighting: 'Runway deck illumination and titanium hull ambient reflections.',
      depth: 'Vessel scales down to miniature precision size and docks inside the recovery pad.',
      transitionIntoNextShot: 'Touchdown confirmed: ship rests securely docked in the footer cradle.',
    },
    transform: {
      start: { x: 50.0, y: 46.0, scale: 0.88, tiltX: 12, tiltY: 0, roll: 0, throttle: 0.24 },
      end:   { x: 50.0, y: 88.0, scale: 0.22, tiltX: 0, tiltY: 0, roll: 0, throttle: 0.04 },
    },
    atmosphere: {
      ambientColor: 'rgba(227, 27, 35, 0.08)',
      rimLightColor: 'rgba(255, 255, 255, 0.6)',
      keyLightAngleDeg: 90,
      volumetricHaze: 0.16,
      lensExposure: 0.85,
      landingGearDeployed: true,
    },
    slate: {
      lens: 'Anamorphic 40mm T2.4 Atmosphere Prime',
      cameraTechnique: 'ATMOSPHERIC CRUISE TRACKING & HORIZON SWEEP',
      lightingKey: 'Atmospheric Strata Key & Continuous Ion Burn',
    },
  },
];
