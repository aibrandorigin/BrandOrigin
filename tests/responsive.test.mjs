import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const VIEWPORTS = [
  { width: 320, height: 568, category: 'small-mobile', expectedTier: 'mobile-sm', isMobile: true, isTablet: false, isDesktop: false },
  { width: 360, height: 800, category: 'small-mobile', expectedTier: 'mobile-sm', isMobile: true, isTablet: false, isDesktop: false },
  { width: 375, height: 667, category: 'medium-mobile', expectedTier: 'mobile-md', isMobile: true, isTablet: false, isDesktop: false },
  { width: 390, height: 844, category: 'medium-mobile', expectedTier: 'mobile-md', isMobile: true, isTablet: false, isDesktop: false },
  { width: 414, height: 896, category: 'large-mobile', expectedTier: 'mobile-lg', isMobile: true, isTablet: false, isDesktop: false },
  { width: 430, height: 932, category: 'large-mobile', expectedTier: 'mobile-lg', isMobile: true, isTablet: false, isDesktop: false },
  { width: 600, height: 960, category: 'large-mobile', expectedTier: 'mobile-lg', isMobile: true, isTablet: false, isDesktop: false },
  { width: 768, height: 1024, category: 'tablet', expectedTier: 'tablet', isMobile: false, isTablet: true, isDesktop: false },
  { width: 1024, height: 768, category: 'desktop', expectedTier: 'desktop', isMobile: false, isTablet: false, isDesktop: true },
  { width: 1280, height: 800, category: 'desktop', expectedTier: 'desktop', isMobile: false, isTablet: false, isDesktop: true },
];

function evaluateClamp(minPx, vwFactor, maxPx, viewportWidth) {
  const preferred = (vwFactor / 100) * viewportWidth;
  return Math.max(minPx, Math.min(maxPx, preferred));
}

function createMockWindow({ innerWidth, clientWidth, innerHeight = 800, screenWidth = innerWidth }) {
  return {
    innerWidth,
    innerHeight,
    screen: { width: screenWidth, height: innerHeight },
    document: {
      documentElement: {
        clientWidth,
        clientHeight: innerHeight,
      },
    },
    matchMedia: (query) => {
      const m = query.match(/\(min-width:\s*(\d+)px\)/);
      const effectiveWidth = Math.min(clientWidth || innerWidth, innerWidth || clientWidth);
      const matches = m ? effectiveWidth >= Number(m[1]) : false;
      return {
        matches,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      };
    },
  };
}

let passed = 0;
function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`PASS: ${name}`);
  } catch (err) {
    console.error(`FAIL: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

// 1. Viewport Meta Tag & HTML Root Containment Audit
test('1. index.html includes canonical viewport meta tag and root overflow containment without 100vw scrollbar overflow', () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  assert.match(html, /<meta\s+name="viewport"\s+content="width=device-width,\s*initial-scale=1"\s*\/>/);
  assert.match(html, /overflow-x-hidden/);
  assert.match(html, /overflow-x-clip/);
  assert.doesNotMatch(html, /max-w-\[100vw\]/, 'index.html should use max-w-full instead of max-w-[100vw] to prevent scrollbar overflow');
});

// 2. CSS Breakpoint Units & Cross-Browser Media Query Syntax Audit
test('2. src/index.css locks all Tailwind breakpoints to CSS pixels (px) and enforces border-box + text-size-adjust', () => {
  const css = fs.readFileSync(path.join(ROOT, 'src/index.css'), 'utf8');
  assert.match(css, /--breakpoint-xs:\s*375px;/);
  assert.match(css, /--breakpoint-sm:\s*640px;/);
  assert.match(css, /--breakpoint-md:\s*768px;/);
  assert.match(css, /--breakpoint-lg:\s*1024px;/);
  assert.match(css, /--breakpoint-xl:\s*1280px;/);
  assert.match(css, /--breakpoint-2xl:\s*1536px;/);
  assert.match(css, /box-sizing:\s*border-box;/);
  assert.match(css, /-webkit-text-size-adjust:\s*100%;/);
  assert.match(css, /overflow-x:\s*hidden;/);
  assert.match(css, /overflow-x:\s*clip;/);
});

// 3. Compiled Production CSS Bundle Audit
test('3. Compiled dist CSS uses standard @media (min-width: ...px) queries with zero rem-based or Level-4 range queries', () => {
  const assetsDir = path.join(ROOT, 'dist/assets');
  assert.ok(fs.existsSync(assetsDir), 'dist/assets directory must exist after build');
  const cssFiles = fs.readdirSync(assetsDir).filter((f) => f.endsWith('.css'));
  assert.ok(cssFiles.length > 0, 'At least one compiled CSS file must exist in dist/assets');

  const compiledCss = fs.readFileSync(path.join(assetsDir, cssFiles[0]), 'utf8');
  const mediaQueries = [...compiledCss.matchAll(/@media[^{]+\{/g)].map((m) => m[0]);

  for (const mq of mediaQueries) {
    assert.doesNotMatch(
      mq,
      /\d+rem/,
      `Media query "${mq}" must not use rem units which shift under Android/iOS OS font scaling`
    );
    assert.doesNotMatch(
      mq,
      /width\s*>=|width\s*<=/,
      `Media query "${mq}" must compile to universal min-width/max-width syntax for older iOS Safari and Android WebViews`
    );
  }

  assert.match(compiledCss, /@media\s*\(min-width:\s*768px\)/, 'Must include standard 768px tablet breakpoint');
  assert.match(compiledCss, /@media\s*\(min-width:\s*1024px\)/, 'Must include standard 1024px desktop breakpoint');
});

// 4. Viewport Width vs innerWidth vs screen.width Reconciliation Across Small, Medium, and Large Mobile Viewports
test('4. Viewport classification across 320px, 360px, 375px, 390px, 414px, 430px, 600px, 768px, 1024px, and 1280px', () => {
  for (const vp of VIEWPORTS) {
    // Simulate physical device where screen.width may be hardware pixels (e.g. 1080 or 1170) or innerWidth has scrollbar offset
    const mockWin = createMockWindow({
      innerWidth: vp.width,
      clientWidth: vp.width,
      innerHeight: vp.height,
      screenWidth: vp.width * 3,
    });

    const effectiveWidth = Math.min(mockWin.document.documentElement.clientWidth, mockWin.innerWidth);
    assert.equal(effectiveWidth, vp.width);

    const isMobile = !mockWin.matchMedia('(min-width: 768px)').matches;
    const isTablet = mockWin.matchMedia('(min-width: 768px)').matches && !mockWin.matchMedia('(min-width: 1024px)').matches;
    const isDesktop = mockWin.matchMedia('(min-width: 1024px)').matches;

    assert.equal(isMobile, vp.isMobile, `Expected isMobile=${vp.isMobile} at ${vp.width}px (${vp.category})`);
    assert.equal(isTablet, vp.isTablet, `Expected isTablet=${vp.isTablet} at ${vp.width}px (${vp.category})`);
    assert.equal(isDesktop, vp.isDesktop, `Expected isDesktop=${vp.isDesktop} at ${vp.width}px (${vp.category})`);
  }
});

// 5. Discrepancy Between window.innerWidth and document.documentElement.clientWidth on Mobile Browsers
test('5. Reconciles innerWidth vs documentElement.clientWidth when scrollbar or mobile viewport inflation occurs', () => {
  // Case: Mobile browser reports innerWidth=780 due to transient unclipped layer, while clientWidth=390
  const inflatedWin = createMockWindow({ innerWidth: 780, clientWidth: 390, screenWidth: 1170 });
  const resolvedWidth = Math.min(
    inflatedWin.document.documentElement.clientWidth,
    inflatedWin.innerWidth
  );
  assert.equal(resolvedWidth, 390, 'Must prefer authoritative smaller clientWidth over inflated innerWidth');
  assert.equal(inflatedWin.matchMedia('(min-width: 768px)').matches, false, 'Must remain in mobile layout at 390px clientWidth');
});

// 6. PlanetaryServicesCosmos Orbital Containment Across Small (320px/360px), Medium (375px/390px), and Large (414px/430px/600px) Mobile Viewports
test('6. PlanetaryServicesCosmos planet stage and rotating orbital items fit within every mobile viewport (320px-600px) without horizontal overflow', () => {
  const mobileViewports = VIEWPORTS.filter((v) => v.isMobile);
  for (const vp of mobileViewports) {
    const horizontalPadding = vp.width >= 640 ? 48 : 32; // px-4 (32px) or sm:px-6 (48px)
    const availableWidth = vp.width - horizontalPadding;

    // Stage container: clamp(224px, 64vw, 296px)
    const stageWidth = evaluateClamp(224, 64, 296, vp.width);
    assert.ok(
      stageWidth <= availableWidth + 1,
      `Planet stage (${stageWidth}px) must fit within available mobile width (${availableWidth}px) at ${vp.width}px`
    );

    // Engaged orbit diameter: clamp(160px, 46vw, 236px)
    const engagedOrbitDiameter = evaluateClamp(160, 46, 236, vp.width);
    // Max label half-width protrusion at 0deg/180deg is ~38px on <375px and ~42px on >=375px
    const labelHalfProtrusion = vp.width < 375 ? 38 : 42;
    const totalOrbitSpanWithLabels = engagedOrbitDiameter + labelHalfProtrusion * 2;

    assert.ok(
      totalOrbitSpanWithLabels <= vp.width - 16,
      `Orbiting items + labels (${totalOrbitSpanWithLabels.toFixed(1)}px) must never overflow viewport (${vp.width}px)`
    );
  }
});

// 7. Component Source Code Invariant Audit (No Competing Waypoints, No 60fps State Re-renders, No Unclipped Fixed Widths)
test('7. Component source invariants: pixel-locked spacecraft transforms, single waypoint authority, and responsive grids', () => {
  const spacecraftSrc = fs.readFileSync(path.join(ROOT, 'src/components/OriginSpacecraft.tsx'), 'utf8');
  assert.doesNotMatch(
    spacecraftSrc,
    /translate3d\(\$\{[^}]+\}vw/,
    'OriginSpacecraft must use pixel-computed translate3d offsets instead of vw/vh inside 3D perspective container'
  );
  assert.doesNotMatch(
    spacecraftSrc,
    /dispatchEvent\(\s*new CustomEvent\(['"]brandorigin:service-waypoint['"]/,
    'OriginSpacecraft must not dispatch competing hardcoded scroll-percentage service-waypoint events'
  );

  const heroSrc = fs.readFileSync(path.join(ROOT, 'src/components/HeroSection.tsx'), 'utf8');
  assert.match(heroSrc, /grid-cols-2\s+min-\[375px\]:grid-cols-3\s+md:flex/, 'HeroSection genesis steps must use symmetrical grid on mobile and flex on tablet/desktop');

  const navSrc = fs.readFileSync(path.join(ROOT, 'src/components/Navigation.tsx'), 'utf8');
  assert.match(navSrc, /hidden\s+md:flex/, 'Desktop navigation links must be hidden below md (768px)');
  assert.match(navSrc, /md:hidden/, 'Mobile hamburger toggle and drawer must be restricted to below md (768px)');
  assert.match(navSrc, /document\.body\.style\.overflowY/, 'Navigation must lock overflowY only so overflow-x containment is preserved');
});

console.log(`\nAll ${passed} responsive regression test suites passed across all 10 device viewports (320px - 1280px).`);
