/**
 * Hero.tsx
 *
 * Clean integration of PixelLoopCanvas (background) and BracketCycler (headline).
 * Both animations run simultaneously from page load.
 *
 * CSS Variables (set in index.css):
 *   ── PixelLoopCanvas tuning ────
 *   --hero-accent-opacity: 0.055 (base transparency)
 *   --hero-accent-sat: 0.12 (desaturation multiplier)
 *   --hero-accent-stroke: 0.55 (twinkle square opacity)
 *   --hero-accent-cell: 14 (pixel grid cell size, px)
 *   --hero-accent-duration: 8000 (freeze time, ms)
 *
 *   ── BracketCycler tuning ────
 *   --bc-text: text color (default: --foreground)
 *   --bc-bracket: [ ] color (default: --muted-foreground)
 *   --bc-token: token color (default: --foreground)
 *   --bc-font: token font (default: ui-monospace)
 *   --bc-enter-ms: 200ms
 *   --bc-enter-y: 5px
 *   --bracket-opacity: 0.4
 *   --cycler-freeze-ms: 15000 (animation lifetime, ms)
 */

import PixelLoopCanvas from "./PixelLoopCanvas";
import BracketCycler from "./BracketCycler";
import "./Hero.css";

interface HeroProps {
    /** Base text before the bracket (e.g., "leanale") */
    baseText?: string;
    /** Email and domain tokens that get longer dwell time */
    primaryTokens?: string[];
    /** Brief flashing tokens between primary tokens */
    burstTokens?: string[];
    /** Main headline text to display above the cycler */
    headline?: string;
    /** Subheadline or tagline */
    tagline?: string;
    /** CTA button text */
    ctaText?: string;
    /** CTA button onClick handler */
    onCtaClick?: () => void;
}

export default function Hero({
    baseText = "leanale",
    primaryTokens = [".com", "003@gmail.com"],
    burstTokens = [
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
    ],
    headline = "Digital Product Designer & Developer",
    tagline = "Crafting experiences that bridge design and technology",
    ctaText = "Let's Build Something →",
    onCtaClick,
}: HeroProps) {
    return (
        <section
            className="hero"
            role="banner"
        >
            {/* Canvas background layer — z-index 0 */}
            <div className="hero__canvas-container">
                <PixelLoopCanvas />
            </div>

            {/* Content layer — z-index 10 */}
            <div className="hero__content">
                {/* Main headline with animated bracket cycler */}
                <h1 className="hero__headline">{headline}</h1>

                {/* Animated bracket cycler — shows "name[token]" */}
                <div className="hero__cycler-wrapper">
                    <BracketCycler
                        baseText={baseText}
                        primaryTokens={primaryTokens}
                        burstTokens={burstTokens}
                        className="hero__bracket-cycler"
                    />
                </div>

                {/* Tagline below the cycler */}
                {tagline && <p className="hero__tagline">{tagline}</p>}

                {/* CTA button */}
                {ctaText && (
                    <button
                        className="hero__cta"
                        onClick={onCtaClick}
                        aria-label={ctaText}
                    >
                        {ctaText}
                    </button>
                )}
            </div>
        </section>
    );
}
