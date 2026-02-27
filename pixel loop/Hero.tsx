/**
 * Hero.tsx
 *
 * Drop-in hero section that layers PixelLoopCanvas behind your content.
 *
 * ── CSS variable tuning (set in globals.css or inline) ────────────────────
 *
 *   :root {
 *     --hero-accent-opacity:  0.055;   ↑ raise for more visible grid
 *     --hero-accent-sat:      0.12;    ↑ raise to let accent hue bleed in
 *     --hero-accent-stroke:   0.55;    ↑ raise for bolder twinkle squares
 *     --hero-accent-cell:     14;      px cell size — 10=dense, 20=airy
 *     --hero-accent-duration: 8000;    ms before animation freezes
 *   }
 *
 * ── Dark-mode example ─────────────────────────────────────────────────────
 *
 *   .dark {
 *     --hero-accent-opacity: 0.045;   slightly lower — dark bg amplifies
 *     --hero-accent-sat:     0.18;    can afford a touch more hue in dark
 *   }
 *
 * ── Props ─────────────────────────────────────────────────────────────────
 *   children     — Your headline, subhead, CTA etc.
 *   className    — Extra classes applied to the outer section
 *   minHeight    — Tailwind class or CSS value for section height
 *                  (default: "100svh")
 * ──────────────────────────────────────────────────────────────────────────
 */

import React from "react";
import PixelLoopCanvas from "./PixelLoopCanvas";

interface HeroProps {
  children?: React.ReactNode;
  className?: string;
  minHeight?: string;
}

export default function Hero({
  children,
  className = "",
  minHeight = "100svh",
}: HeroProps) {
  return (
    <section
      className={`relative overflow-hidden ${className}`}
      style={{
        minHeight,
        /*
         * CSS variable defaults — override in :root or a parent selector.
         * These are the values that ship "out of the box" with a neutral
         * designer-portfolio palette (off-white bg, near-black fg).
         */
        ["--hero-accent-opacity" as string]: "0.055",
        ["--hero-accent-sat" as string]: "0.12",
        ["--hero-accent-stroke" as string]: "0.55",
        ["--hero-accent-cell" as string]: "14",
        ["--hero-accent-duration" as string]: "8000",
      }}
    >
      {/*
       * ── Layer 0: Canvas accent ──────────────────────────────────────────
       * Positioned absolute, z-0, pointer-events-none, blend mode multiply.
       * The radial fade inside the canvas ensures it never fights text or nav.
       */}
      <PixelLoopCanvas />

      {/*
       * ── Layer 1: Content ────────────────────────────────────────────────
       * z-10 puts it above the canvas. Add your headline, role, CTA etc.
       * The example below is a minimal placeholder — replace freely.
       */}
      <div
        className="relative z-10 flex flex-col items-start justify-center h-full"
        style={{ minHeight, padding: "clamp(3rem, 8vw, 7rem) clamp(1.5rem, 6vw, 5rem)" }}
      >
        {children ?? <DefaultHeroContent />}
      </div>
    </section>
  );
}

// ─── Placeholder content — replace with your own ────────────────────────────

function DefaultHeroContent() {
  return (
    <div style={{ maxWidth: "52rem" }}>
      {/* Eyebrow */}
      <p
        style={{
          fontSize: "clamp(0.75rem, 1.1vw, 0.875rem)",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          opacity: 0.5,
          marginBottom: "1.25rem",
          fontWeight: 500,
        }}
      >
        UI/UX Designer & Developer
      </p>

      {/* Headline */}
      <h1
        style={{
          fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
          lineHeight: 1.05,
          fontWeight: 700,
          letterSpacing: "-0.025em",
          marginBottom: "1.75rem",
          color: "hsl(var(--foreground))",
        }}
      >
        Leana Le
      </h1>

      {/* Sub-headline */}
      <p
        style={{
          fontSize: "clamp(1rem, 1.6vw, 1.2rem)",
          lineHeight: 1.7,
          opacity: 0.6,
          maxWidth: "38rem",
          marginBottom: "2.75rem",
          color: "hsl(var(--foreground))",
        }}
      >
        Designing thoughtful digital products at the intersection of
        craft and systems thinking.
      </p>

      {/* CTA */}
      <a
        href="#work"
        style={{
          display: "inline-block",
          padding: "0.75rem 1.75rem",
          fontSize: "0.875rem",
          fontWeight: 600,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          border: "1px solid hsl(var(--foreground) / 0.18)",
          borderRadius: "2px",
          color: "hsl(var(--foreground))",
          textDecoration: "none",
          transition: "background 0.2s, border-color 0.2s",
        }}
        onMouseEnter={(e) => {
          const t = e.currentTarget;
          t.style.background = "hsl(var(--foreground) / 0.06)";
          t.style.borderColor = "hsl(var(--foreground) / 0.35)";
        }}
        onMouseLeave={(e) => {
          const t = e.currentTarget;
          t.style.background = "transparent";
          t.style.borderColor = "hsl(var(--foreground) / 0.18)";
        }}
      >
        View work →
      </a>
    </div>
  );
}
