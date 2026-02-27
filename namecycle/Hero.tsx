/**
 * Hero.tsx
 *
 * Drop-in hero section for leanale.com.
 * Renders the animated `leanale[.com]` name treatment + supporting content.
 *
 * ────────────────────────────────────────────────────────────────────────────
 *  QUICK USAGE
 * ────────────────────────────────────────────────────────────────────────────
 *
 *   // app/page.tsx  (or wherever your hero lives)
 *   import Hero from "@/components/Hero";
 *   export default function Home() {
 *     return <Hero />;
 *   }
 *
 * ────────────────────────────────────────────────────────────────────────────
 *  CSS VARIABLE PALETTE TUNING  (set in globals.css or a parent selector)
 * ────────────────────────────────────────────────────────────────────────────
 *
 *   :root {
 *     --bc-text:          hsl(220 9% 10%);   // name + bracket base color
 *     --bc-bracket:       hsl(220 9% 52%);   // [ ] color only
 *     --bc-token:         hsl(220 9% 10%);   // token text color (normal)
 *     --bc-scramble:      hsl(220 9% 52%);   // token color during scramble
 *     --bc-font:          'Fira Code', ui-monospace; // token monospace font
 *     --bc-enter-ms:      200ms;             // enter animation speed
 *     --bc-enter-y:       5px;               // enter Y-nudge distance
 *     --bracket-opacity:  0.40;              // [ ] opacity
 *     --cycler-freeze-ms: 15000;             // animation lifetime (ms)
 *   }
 *
 *   // Warm off-white palette (common designer portfolio):
 *   :root {
 *     --bc-text:         hsl(25 10% 12%);
 *     --bc-bracket:      hsl(25 8% 48%);
 *     --bc-token:        hsl(25 10% 12%);
 *     --bracket-opacity: 0.38;
 *   }
 *
 *   // Dark mode:
 *   .dark {
 *     --bc-text:     hsl(0 0% 93%);
 *     --bc-bracket:  hsl(0 0% 56%);
 *     --bc-token:    hsl(0 0% 93%);
 *     --bracket-opacity: 0.42;
 *   }
 *
 *   // Subtle accent tint on token only:
 *   :root   { --bc-token: hsl(220 55% 30%); }
 *   .dark   { --bc-token: hsl(210 50% 75%); }
 *
 * ────────────────────────────────────────────────────────────────────────────
 *  TOKEN CUSTOMISATION
 * ────────────────────────────────────────────────────────────────────────────
 *
 *   PRIMARY_TOKENS — long dwell; tokens with "@" get typewriter treatment.
 *   BURST_TOKENS   — brief interstitial flashes; keep 6–12 for intentionality.
 */

import React from "react";
import BracketCycler from "./BracketCycler";

// ─── Token sets ───────────────────────────────────────────────────────────────

const PRIMARY_TOKENS = [".com", "003@gmail.com"];

const BURST_TOKENS = [
  "ux",
  "ui",
  "react",
  "motion",
  "fig.02",
  "v2.1",
  "s03",
  "available",
  "burnaby",
  "portfolio",
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface HeroProps {
  primaryTokens?: string[];
  burstTokens?: string[];
  children?: React.ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Hero({
  primaryTokens = PRIMARY_TOKENS,
  burstTokens = BURST_TOKENS,
  children,
}: HeroProps) {
  return (
    <section
      style={{
        // CSS variable defaults — override in :root / .dark to match your theme
        ["--bc-text" as string]: "var(--foreground, hsl(220 9% 10%))",
        ["--bc-bracket" as string]: "var(--muted-foreground, hsl(220 9% 52%))",
        ["--bc-token" as string]: "var(--foreground, hsl(220 9% 10%))",
        ["--bc-scramble" as string]: "var(--muted-foreground, hsl(220 9% 52%))",
        ["--bc-font" as string]:
          "ui-monospace, 'SF Mono', 'Fira Code', Consolas, monospace",
        ["--bc-enter-ms" as string]: "200ms",
        ["--bc-enter-y" as string]: "5px",
        ["--bracket-opacity" as string]: "0.40",
        ["--cycler-freeze-ms" as string]: "15000",

        // Layout
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: "100svh",
        padding: "clamp(4rem, 10vw, 8rem) clamp(1.5rem, 6vw, 5rem)",
        overflow: "hidden",
      }}
    >
      {/* Eyebrow */}
      <p
        style={{
          fontSize: "clamp(0.68rem, 0.95vw, 0.78rem)",
          letterSpacing: "0.17em",
          textTransform: "uppercase",
          opacity: 0.38,
          marginBottom: "clamp(1rem, 2.5vw, 1.75rem)",
          color: "var(--bc-text)",
          fontWeight: 500,
        }}
      >
        UI/UX Designer &amp; Developer
      </p>

      {/* Name + animated bracket suffix */}
      <h1
        style={{
          fontSize: "clamp(3.4rem, 9.5vw, 9rem)",
          fontWeight: 700,
          lineHeight: 1.0,
          letterSpacing: "-0.03em",
          margin: 0,
          marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
          color: "var(--bc-text)",
          display: "block",
        }}
      >
        <BracketCycler
          baseText="leanale"
          primaryTokens={primaryTokens}
          burstTokens={burstTokens}
        />
      </h1>

      {/* Descriptor */}
      <p
        style={{
          fontSize: "clamp(0.95rem, 1.5vw, 1.12rem)",
          lineHeight: 1.68,
          opacity: 0.52,
          maxWidth: "36rem",
          marginBottom: "clamp(2rem, 4vw, 3.25rem)",
          color: "var(--bc-text)",
        }}
      >
        Designing thoughtful digital products at the intersection of craft and
        systems thinking.
      </p>

      {/* CTA row */}
      <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
        <HeroLink href="#work" variant="solid">
          View work
        </HeroLink>
        <HeroLink href="mailto:leanale003@gmail.com" variant="ghost">
          Get in touch
        </HeroLink>
      </div>

      {/* Optional extra content */}
      {children}
    </section>
  );
}

// ─── HeroLink ─────────────────────────────────────────────────────────────────

function HeroLink({
  href,
  variant,
  children,
}: {
  href: string;
  variant: "solid" | "ghost";
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = React.useState(false);

  const base: React.CSSProperties = {
    display: "inline-block",
    padding: "0.65rem 1.6rem",
    fontSize: "0.775rem",
    fontWeight: 600,
    letterSpacing: "0.09em",
    textTransform: "uppercase",
    textDecoration: "none",
    borderRadius: "2px",
    transition: "opacity 180ms, background 180ms",
    cursor: "pointer",
    opacity: hovered ? 0.7 : 1,
  };

  if (variant === "solid") {
    return (
      <a
        href={href}
        style={{
          ...base,
          background: "var(--bc-text)",
          color: "var(--background, #fafafa)",
          border: "1px solid var(--bc-text)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      style={{
        ...base,
        background: "transparent",
        color: "var(--bc-text)",
        border:
          "1px solid color-mix(in srgb, var(--bc-text) 22%, transparent)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </a>
  );
}
