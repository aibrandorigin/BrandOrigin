import React, { useEffect, useRef } from 'react';
import { getViewportWidth, getViewportHeight } from '../utils/viewport';

/**
 * DeepCinematicEnvironment
 *
 * Implements a 6-layer cinematic deep space universe with physics-based multi-plane parallax:
 * - Layer 1: Very distant stars (deep void stellar field, slow subtle drift, non-twinkling micro-luminosity).
 * - Layer 2: Subtle nebula clouds (quiet, monochromatic dark-charcoal & deep crimson dust filaments, NO psychedelic colors).
 * - Layer 3: Very distant celestial bodies (dim distant lunar crescent, deep void orbital waypoint beacon, cold dwarf sphere).
 * - Layer 4: Mid-distance particles (space debris, micro-meteorites, cosmic dust drifting along vector trajectory).
 * - Layer 5: Near-camera particles (fast streaking micro-particulates creating extreme cinematic optical depth of field).
 * - Layer 6: Planetary atmospheric elements (soft limb haze, volumetric Rayleigh albedo wash, horizon light wrap).
 *
 * All layers move at strictly differentiated apparent velocities based on physical camera translation and mouse parallax.
 */
export const CanvasBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = getViewportWidth());
    let height = (canvas.height = getViewportHeight());

    // Parallax tracking physics
    const state = {
      scrollProgress: 0,
      targetScrollProgress: 0,
      scrollVelocity: 0,
      scrollY: window.scrollY,
      prevScrollY: window.scrollY,
      cameraX: 0,
      cameraY: 0,
      targetCameraX: 0,
      targetCameraY: 0,
      prevTime: performance.now(),
    };

    const handleScroll = () => {
      const vh = getViewportHeight();
      const docHeight = document.documentElement.scrollHeight - vh;
      state.targetScrollProgress = docHeight > 0 ? Math.max(0, Math.min(1, window.scrollY / docHeight)) : 0;
      state.scrollY = window.scrollY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = getViewportWidth();
      height = canvas.height = getViewportHeight();
      handleScroll();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const cx = getViewportWidth() / 2;
      const cy = getViewportHeight() / 2;
      if (cx > 0 && cy > 0) {
        state.targetCameraX = (e.clientX - cx) / cx; // -1 to +1
        state.targetCameraY = (e.clientY - cy) / cy; // -1 to +1
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // =========================================================================
    // LAYER 1: VERY DISTANT STARS (Normalized coordinates for dynamic resize)
    // =========================================================================
    const distantStarCount = 110;
    const layer1Stars = Array.from({ length: distantStarCount }, () => ({
      relX: Math.random(),
      relY: Math.random() * 2.5,
      radius: 0.5 + Math.random() * 0.7, // tiny sub-pixel points
      baseAlpha: 0.25 + Math.random() * 0.45,
      pulseSpeed: 0.0006 + Math.random() * 0.001,
      color: Math.random() < 0.08 ? '#FF8A90' : '#EAEAEA',
    }));

    // =========================================================================
    // LAYER 2: SUBTLE NEBULA CLOUDS (Dark, restrained, non-psychedelic filaments)
    // =========================================================================
    const layer2Nebulae = [
      {
        relX: 0.75,
        relY: 0.20,
        radiusX: 480,
        radiusY: 340,
        rotation: -0.25,
        colorInner: 'rgba(180, 20, 28, 0.065)', // deep muted crimson core
        colorOuter: 'rgba(10, 10, 10, 0)',
      },
      {
        relX: 0.22,
        relY: 0.58,
        radiusX: 520,
        radiusY: 280,
        rotation: 0.35,
        colorInner: 'rgba(227, 27, 35, 0.045)',
        colorOuter: 'rgba(5, 5, 5, 0)',
      },
      {
        relX: 0.55,
        relY: 0.85,
        radiusX: 600,
        radiusY: 420,
        rotation: -0.15,
        colorInner: 'rgba(160, 15, 22, 0.075)',
        colorOuter: 'rgba(5, 5, 5, 0)',
      },
    ];

    // =========================================================================
    // LAYER 3: VERY DISTANT CELESTIAL BODIES (Waypoint singularity node)
    // =========================================================================
    const layer3Celestials = [
      // Distant Waypoint Singularity Node (mid-journey)
      {
        relX: 0.12,
        relY: 0.62,
        radius: 20,
        parallaxSpeed: 0.12,
        glowColor: 'rgba(227, 27, 35, 0.12)',
        crescentAngle: 0.6,
      },
    ];

    // =========================================================================
    // LAYER 4: MID-DISTANCE PARTICLES (Normalized coordinates)
    // =========================================================================
    const midParticleCount = 45;
    const layer4Particles = Array.from({ length: midParticleCount }, () => ({
      relX: Math.random(),
      relY: Math.random() * 3.0,
      radius: 0.9 + Math.random() * 1.2,
      baseAlpha: 0.2 + Math.random() * 0.35,
      driftX: (Math.random() - 0.5) * 0.0002,
      driftY: 0.1 + Math.random() * 0.2,
      isRed: Math.random() < 0.14,
    }));

    // =========================================================================
    // LAYER 5: NEAR-CAMERA PARTICLES (Normalized coordinates)
    // =========================================================================
    const nearParticleCount = 18;
    const layer5Particles = Array.from({ length: nearParticleCount }, () => ({
      relX: Math.random(),
      relY: Math.random(),
      radius: 1.8 + Math.random() * 1.6,
      baseAlpha: 0.08 + Math.random() * 0.18, // softly out of focus
      speedMul: 1.8 + Math.random() * 2.2,
      driftX: (Math.random() - 0.5) * 0.0005,
    }));

    // Main 60fps render tick
    const render = (now: number) => {
      state.prevTime = now;

      // Smooth camera interpolation
      state.cameraX += (state.targetCameraX - state.cameraX) * 0.04;
      state.cameraY += (state.targetCameraY - state.cameraY) * 0.04;

      // Smooth scroll progress interpolation
      const prevProgress = state.scrollProgress;
      state.scrollProgress += (state.targetScrollProgress - state.scrollProgress) * 0.06;
      state.scrollVelocity = Math.abs(state.scrollProgress - prevProgress) * 100;

      const p = state.scrollProgress;
      const camX = state.cameraX;
      const camY = state.cameraY;

      // Base Void Clear: Dark cinematic obsidian black (#030303 to #050505)
      ctx.fillStyle = '#030303';
      ctx.fillRect(0, 0, width, height);

      // =======================================================================
      // RENDER LAYER 2: SUBTLE NEBULA CLOUDS (Slowest parallax, 0.05 speed)
      // =======================================================================
      const nebulaScrollOffset = p * height * 0.6;
      layer2Nebulae.forEach((nebula) => {
        const nx = nebula.relX * width + camX * -15;
        const ny = nebula.relY * height * 2.0 - nebulaScrollOffset + camY * -10;

        if (ny > -nebula.radiusY && ny < height + nebula.radiusY) {
          ctx.save();
          ctx.translate(nx, ny);
          ctx.rotate(nebula.rotation);
          ctx.scale(nebula.radiusX / nebula.radiusY, 1.0);

          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, nebula.radiusY);
          grad.addColorStop(0, nebula.colorInner);
          grad.addColorStop(0.55, 'rgba(15, 10, 12, 0.02)');
          grad.addColorStop(1, nebula.colorOuter);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, nebula.radiusY, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      // =======================================================================
      // RENDER LAYER 3: VERY DISTANT CELESTIAL BODIES (Parallax speed: 0.12)
      // =======================================================================
      layer3Celestials.forEach((body) => {
        const bx = body.relX * width + camX * -25 * body.parallaxSpeed;
        const by = body.relY * height * 2.2 - p * height * 1.2 * body.parallaxSpeed + camY * -20;

        if (by > -body.radius * 2 && by < height + body.radius * 2) {
          ctx.save();
          // Soft atmospheric glow halo
          const glowGrad = ctx.createRadialGradient(bx, by, body.radius * 0.4, bx, by, body.radius * 2.2);
          glowGrad.addColorStop(0, body.glowColor);
          glowGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(bx, by, body.radius * 2.2, 0, Math.PI * 2);
          ctx.fill();

          // Dark celestial sphere with sharp physical rim terminator
          ctx.beginPath();
          ctx.arc(bx, by, body.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#060606';
          ctx.fill();

          // Subtle sunlit crescent rim
          ctx.save();
          ctx.beginPath();
          ctx.arc(bx, by, body.radius, 0, Math.PI * 2);
          ctx.clip();

          ctx.translate(bx, by);
          ctx.rotate(body.crescentAngle);
          const rimGrad = ctx.createLinearGradient(-body.radius, 0, body.radius, 0);
          rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
          rimGrad.addColorStop(0.2, 'rgba(255, 255, 255, 0.08)');
          rimGrad.addColorStop(0.5, 'transparent');
          ctx.fillStyle = rimGrad;
          ctx.fillRect(-body.radius, -body.radius, body.radius * 2, body.radius * 2);
          ctx.restore();

          ctx.restore();
        }
      });

      // =======================================================================
      // RENDER LAYER 1: VERY DISTANT STARS (Parallax speed: 0.22)
      // =======================================================================
      const starScrollY = p * height * 1.4;
      layer1Stars.forEach((star, idx) => {
        const totalY = star.relY * height - starScrollY + camY * -18;
        const sx = ((star.relX * width + camX * -14) % width + width) % width;
        const sy = ((totalY % height) + height) % height;

        const pulse = Math.sin(now * star.pulseSpeed + idx) * 0.15;
        const alpha = Math.max(0.1, Math.min(1.0, star.baseAlpha + pulse));

        ctx.beginPath();
        ctx.arc(sx, sy, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color === '#FF8A90'
          ? `rgba(227, 27, 35, ${alpha * 0.85})`
          : `rgba(235, 235, 235, ${alpha})`;
        ctx.fill();
      });

      // =======================================================================
      // RENDER LAYER 4: MID-DISTANCE PARTICLES (Parallax speed: 0.65)
      // =======================================================================
      const midScrollY = p * height * 3.2;
      layer4Particles.forEach((pt) => {
        pt.relX += pt.driftX;
        if (pt.relX < 0) pt.relX = 1;
        if (pt.relX > 1) pt.relX = 0;

        const totalY = pt.relY * height - midScrollY + camY * -45;
        const mx = ((pt.relX * width + camX * -35) % width + width) % width;
        const my = ((totalY % height) + height) % height;

        const velStretch = Math.min(7.0, 1.0 + state.scrollVelocity * 0.35);
        ctx.beginPath();
        if (velStretch > 1.2) {
          ctx.ellipse(mx, my, Math.max(0.4, pt.radius * 0.6), pt.radius * velStretch, 0, 0, Math.PI * 2);
        } else {
          ctx.arc(mx, my, pt.radius, 0, Math.PI * 2);
        }
        ctx.fillStyle = pt.isRed
          ? `rgba(227, 27, 35, ${pt.baseAlpha})`
          : `rgba(220, 220, 220, ${pt.baseAlpha})`;
        ctx.fill();
      });

      // =======================================================================
      // RENDER LAYER 5: NEAR-CAMERA PARTICLES (Fast streaks, high depth blur)
      // =======================================================================
      layer5Particles.forEach((np) => {
        np.relX += np.driftX;
        np.relY -= (0.6 * np.speedMul + state.scrollVelocity * 0.8) / Math.max(400, height);

        if (np.relX < -0.05) np.relX = 1.05;
        if (np.relX > 1.05) np.relX = -0.05;
        if (np.relY < -0.05) np.relY = 1.05;
        if (np.relY > 1.05) np.relY = -0.05;

        const nx = np.relX * width + camX * -85;
        const ny = np.relY * height + camY * -65;

        // Draw relativistic velocity streaks when traveling fast, soft bokeh when cruising
        const nearStretch = Math.min(12.0, 1.0 + state.scrollVelocity * 0.65);
        ctx.beginPath();
        if (nearStretch > 1.3) {
          ctx.ellipse(nx, ny, Math.max(0.8, np.radius * 0.5), np.radius * nearStretch, 0, 0, Math.PI * 2);
        } else {
          ctx.arc(nx, ny, np.radius, 0, Math.PI * 2);
        }
        ctx.fillStyle = `rgba(240, 240, 240, ${np.baseAlpha})`;
        ctx.fill();
      });

      // =======================================================================
      // RENDER LAYER 6: PLANETARY ATMOSPHERIC ELEMENTS (Volumetric Lighting)
      // Approaches when scrollProgress approaches Sector 04 / Projects (0.65 -> 0.90)
      // and Final Landing Base (0.92 -> 1.0)
      // =======================================================================
      if (p >= 0.55) {
        // Atmospheric transition curve from cold space to warm planetary wash
        const atmosphereT = Math.min(1.0, (p - 0.55) / 0.35);
        const atmoAlpha = Math.sin(atmosphereT * Math.PI) * 0.18 + (p > 0.9 ? (p - 0.9) * 2.0 * 0.12 : 0);

        if (atmoAlpha > 0.01) {
          // Bottom-right celestial horizon glow
          const atmoGrad = ctx.createRadialGradient(
            width * 0.5 + camX * -40,
            height * 0.85 + camY * -30,
            width * 0.1,
            width * 0.5 + camX * -40,
            height * 0.85 + camY * -30,
            width * 0.8
          );
          atmoGrad.addColorStop(0, `rgba(227, 27, 35, ${atmoAlpha})`);
          atmoGrad.addColorStop(0.45, `rgba(160, 15, 20, ${atmoAlpha * 0.5})`);
          atmoGrad.addColorStop(1, 'transparent');

          ctx.fillStyle = atmoGrad;
          ctx.fillRect(0, 0, width, height);

          // Atmospheric horizon Rayleigh scattering line
          ctx.save();
          ctx.strokeStyle = `rgba(255, 120, 125, ${atmoAlpha * 0.4})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(
            width * 0.5 + camX * -25,
            height * 0.92,
            width * 0.65,
            height * 0.15,
            0,
            0,
            Math.PI * 2
          );
          ctx.stroke();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Cinematic subtle vignette with natural optical light falloff */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.72) 100%)',
        }}
      />
    </div>
  );
};
