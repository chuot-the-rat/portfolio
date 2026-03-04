/**
 * PixelLoopCanvas.tsx
 *
 * A canvas-based pixel-grid accent for the hero section.
 * Reads theme tokens from CSS custom properties so it never clashes
 * with the host site's palette.
 *
 * ── Tuning knobs (CSS variables you can set on :root or .hero) ─────────────
 *   --hero-accent-opacity   base opacity of the whole canvas   (default 0.055)
 *   --hero-accent-sat       saturation multiplier 0‒1          (default 0.12)
 *   --hero-accent-stroke    stroke opacity for twinkle squares  (default 0.55)
 *   --hero-accent-cell      pixel cell size in px               (default 14)
 *   --hero-accent-duration  freeze time in ms                   (default 8000)
 * ──────────────────────────────────────────────────────────────────────────
 */

"use client";

import { useEffect, useRef } from "react";

// ─── helpers ────────────────────────────────────────────────────────────────

/** Parse a CSS HSL string like "220 14% 11%" or "hsl(220 14% 11%)" into [h,s,l]. */
function parseHsl(raw: string): [number, number, number] {
  const clean = raw.replace(/hsl\(|\)/g, "").trim();
  const parts = clean.split(/[\s,]+/).map(Number);
  return [parts[0] ?? 220, parts[1] ?? 10, parts[2] ?? 10];
}

/** Blend HSL toward neutral (reduce saturation, pull lightness toward midpoint). */
function desaturate(h: number, s: number, l: number, sat: number): string {
  const s2 = s * sat;
  // pull lightness very mildly toward 50 so it doesn't ghost too bright/dark
  const l2 = l + (50 - l) * 0.08;
  return `hsl(${h} ${s2.toFixed(1)}% ${l2.toFixed(1)}%)`;
}

/** Read a CSS custom property from :root, fallback if missing/empty. */
function cssVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v || fallback;
}

function cssVarFloat(name: string, fallback: number): number {
  const v = parseFloat(cssVar(name, String(fallback)));
  return isNaN(v) ? fallback : v;
}

// ─── seeded PRNG so cell states are stable across redraws ───────────────────
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── types ──────────────────────────────────────────────────────────────────

interface Cell {
  x: number;
  y: number;
  baseAlpha: number; // static brightness for this cell (0..1)
  twinklePhase: number; // independent oscillation phase
}

interface TwinkleSquare {
  col: number;
  row: number;
  born: number; // timestamp when it appeared
  life: number; // total lifespan ms
}

// ─── component ──────────────────────────────────────────────────────────────

export default function PixelLoopCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // ── 1. Respect prefers-reduced-motion ──────────────────────────────────
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // From this point on, we know canvas and ctx are defined
    // Use them with ! assertions to satisfy TypeScript

    // ── 2. Read theme tokens ───────────────────────────────────────────────
    // shadcn/ui stores HSL components as bare "H S% L%" strings
    const fgRaw = cssVar("--foreground", "220 9% 11%");
    const mutedRaw = cssVar("--muted", "220 14% 96%");
    const accentRaw = cssVar("--accent", "220 14% 96%");

    // Tuning knobs (baseOpacity delegated to CSS opacity on the element)
    const satMultiplier = cssVarFloat("--hero-accent-sat", 0.12);
    const strokeOpacity = cssVarFloat("--hero-accent-stroke", 0.55);
    const CELL = Math.max(8, cssVarFloat("--hero-accent-cell", 14));
    const FREEZE_MS = cssVarFloat("--hero-accent-duration", 8000);

    // Derive pixel color: blend muted + foreground toward desaturated
    const [mh, ms, ml] = parseHsl(mutedRaw);
    const [ah, as_, al] = parseHsl(accentRaw);
    const [fh, fs, fl] = parseHsl(fgRaw);

    // Pixel dot color — mid-point between muted and foreground, heavily desaturated
    const blendH = (mh + fh) / 2;
    const blendS = (ms + fs) / 2;
    const blendL = (ml + fl) / 2;
    const pixelColor = desaturate(blendH, blendS, blendL, satMultiplier);

    // Twinkle square stroke: accent color, desaturated
    const twinkleColor = desaturate(ah, as_, al, satMultiplier * 1.6);

    // ── 3. Size canvas to parent ───────────────────────────────────────────
    const parent = canvas.parentElement!;
    let W = 0,
      H = 0;
    let cols = 0,
      rows = 0;
    let cells: Cell[] = [];
    let twinkles: TwinkleSquare[] = [];
    const rand = mulberry32(0xdeadbeef);

    function resize() {
      const rect = parent.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      // Device pixel ratio for crisp rendering
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width = W + "px";
      canvas!.style.height = H + "px";
      // Reset transform before re-applying DPR scale to avoid stacking
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.scale(dpr, dpr);

      cols = Math.ceil(W / CELL) + 1;
      rows = Math.ceil(H / CELL) + 1;

      // Re-seed cells with stable random values
      const r2 = mulberry32(0xdeadbeef);
      cells = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const v = r2();
          // Sparse — only ~28% of cells are "on"
          if (v > 0.28) continue;
          cells.push({
            x: col * CELL,
            y: row * CELL,
            baseAlpha: 0.15 + r2() * 0.6, // variety in brightness
            twinklePhase: r2() * Math.PI * 2,
          });
        }
      }
    }

    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    resize();

    // ── 4. Twinkle square spawner ──────────────────────────────────────────
    let lastTwinkleSpawn = 0;

    function maybeSpawnTwinkle(now: number) {
      if (now - lastTwinkleSpawn < 900 + rand() * 1400) return; // 0.9–2.3 s gap
      lastTwinkleSpawn = now;
      // Limit to 4 simultaneous twinkles
      if (twinkles.length >= 4) return;
      const col = Math.floor(rand() * cols);
      const row = Math.floor(rand() * rows);
      twinkles.push({
        col,
        row,
        born: now,
        life: 1200 + rand() * 1600, // 1.2–2.8 s lifespan
      });
    }

    // ── 5. Draw one frame ──────────────────────────────────────────────────
    function draw(now: number, frozen: boolean) {
      const elapsed = frozen ? FREEZE_MS : now;
      const t = elapsed / 1000; // seconds

      ctx!.clearRect(0, 0, W, H);

      // ── 5a. Pixel dots ─────────────────────────────────────────────────
      // Global pulse: slow sinusoidal envelope 0.6..1.0
      const pulse = 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(t * 0.7));

      // Scan shimmer: a horizontal band that sweeps every ~4 s
      const scanY = ((t % 4) / 4) * (H + 80) - 40; // top to bottom + bleed
      const scanWidth = H * 0.18;

      for (const cell of cells) {
        // Per-cell oscillation (very slow)
        const cellPulse =
          0.5 + 0.5 * Math.sin(t * 0.4 + cell.twinklePhase);

        // Scan contribution: gaussian bell centered on scanY
        const dy = cell.y - scanY;
        const scanBoost =
          0.45 * Math.exp((-dy * dy) / (2 * scanWidth * scanWidth));

        const alpha = cell.baseAlpha * pulse * (0.7 + 0.3 * cellPulse) + scanBoost;

        ctx!.fillStyle = pixelColor;
        // Per-cell alpha 0..1. The canvas element's CSS opacity
        // (driven by --hero-accent-opacity) provides the global cap.
        ctx!.globalAlpha = Math.min(1, alpha);
        // tiny square dot, 1px smaller than cell for breathing room
        ctx!.fillRect(cell.x + 1, cell.y + 1, CELL - 2, CELL - 2);
      }

      // ── 5b. Twinkle outlined squares ──────────────────────────────────
      for (const tw of twinkles) {
        const age = elapsed - tw.born;
        const progress = age / tw.life; // 0..1
        // Fade in over first 20%, hold, fade out over last 30%
        let alpha = 0;
        if (progress < 0.2) {
          alpha = progress / 0.2;
        } else if (progress < 0.7) {
          alpha = 1;
        } else {
          alpha = (1 - progress) / 0.3;
        }

        // Outlined square — 1 cell but centered on a cross-grid dot
        const x = tw.col * CELL + CELL / 2;
        const y = tw.row * CELL + CELL / 2;
        const size = CELL * 1.5;

        ctx!.globalAlpha = alpha * strokeOpacity;
        ctx!.strokeStyle = twinkleColor;
        ctx!.lineWidth = 0.75;
        ctx!.strokeRect(x - size / 2, y - size / 2, size, size);
      }

      ctx!.globalAlpha = 1;

      // ── 5c. Radial mask — fade to transparent at edges ─────────────────
      // Use destination-in: keep pixels where the gradient is opaque,
      // erase where gradient is transparent.
      const gx = W / 2;
      const gy = H * 0.45; // slightly above center — hero content sits upper half
      const radius = Math.max(W, H) * 0.62;

      const grad = ctx!.createRadialGradient(gx, gy, 0, gx, gy, radius);
      grad.addColorStop(0.0, "rgba(0,0,0,1)");
      grad.addColorStop(0.45, "rgba(0,0,0,0.9)");
      grad.addColorStop(0.72, "rgba(0,0,0,0.4)");
      grad.addColorStop(1.0, "rgba(0,0,0,0)");

      ctx!.globalCompositeOperation = "destination-in";
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, W, H);
      ctx!.globalCompositeOperation = "source-over";
    }

    // ── 6. Animation loop ─────────────────────────────────────────────────
    let startTime: number | null = null;
    let rafId: number;
    let frozen = false;

    function loop(now: number) {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;

      if (!frozen) {
        if (elapsed >= FREEZE_MS) {
          frozen = true;
          // Prune twinkles that haven't faded yet so last frame is clean
          twinkles = twinkles.filter(
            (tw) => elapsed - tw.born < tw.life * 0.9
          );
        } else {
          maybeSpawnTwinkle(elapsed);
          // Cull dead twinkles
          twinkles = twinkles.filter((tw) => elapsed - tw.born < tw.life);
        }
      }

      draw(elapsed, frozen);

      if (!frozen) {
        rafId = requestAnimationFrame(loop);
      }
    }

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        // Canvas-wide opacity driven by the CSS variable tuning knob.
        // Using opacity (not blend mode) so it works identically on
        // light AND dark themes — no multiply-darkens-dark-bg problem.
        opacity: "var(--hero-accent-opacity, 0.055)",
      }}
    />
  );
}
