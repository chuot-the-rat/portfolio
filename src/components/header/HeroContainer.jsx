/**
 * HeroContainer.jsx
 * Layout orchestrator for the header/hero system.
 *
 * - Reads the full config object from headerConfig.js
 * - Sets up the CSS Grid via data-layout attribute
 * - Provides the stagger animation context for child components
 * - Passes containerRef to FloatingTags and FloatingImages as their drag boundary
 * - Renders HeroText, MediaBlock, FloatingTag(s), FloatingImage(s), and CTAGroup
 * - Optionally renders HeroModeToggle when floatingImages are configured
 *
 * Usage:
 *   import HeroContainer from "../components/header/HeroContainer";
 *   import { homeHeroConfig } from "../data/header/headerConfig";
 *   <HeroContainer config={homeHeroConfig} mode="work" onModeChange={setMode} />
 */

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import HeroText from "./HeroText";
import MediaBlock from "./MediaBlock";
import FloatingTag from "./FloatingTag";
import FloatingImage from "./FloatingImage";
import HeroModeToggle from "./HeroModeToggle";
import CTAGroup from "./CTAGroup";
import { containerVariants } from "../../utils/header/heroMotion";
import "./HeroSection.css";

export default function HeroContainer({
  config,
  className = "",
  mode = "work",
  onModeChange,
}) {
  const {
    layout = "asymmetric",
    minHeight = "90vh",
    text,
    media,
    tags = [],
    floatingImages = [],
    ctas = [],
    ctaLayout = "row",
    idleMotion = true,
  } = config;

  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const motionProps = shouldReduceMotion
    ? {}
    : { variants: containerVariants, initial: "hidden", animate: "visible" };

  const showModeToggle = typeof onModeChange === "function";

  return (
    <section
      ref={containerRef}
      className={["hs-container", className].filter(Boolean).join(" ")}
      data-layout={layout}
      data-mode={mode}
      style={{ minHeight }}
      aria-label="Hero section"
    >
      {/* FloatingTags: spring to mode-specific positions */}
      {tags.map((tag) => (
        <FloatingTag
          key={tag.label}
          label={tag.label}
          icon={tag.icon ?? null}
          initialX={tag.initialX ?? 0}
          initialY={tag.initialY ?? 0}
          index={tag.index ?? 0}
          position={tag.modes?.[mode] ?? { x: tag.initialX ?? 0, y: tag.initialY ?? 0 }}
          dragConstraintsRef={containerRef}
          idleMotion={idleMotion}
        />
      ))}

      {/* FloatingImages: rearrange per mode */}
      {floatingImages.map((img, i) => (
        <FloatingImage
          key={img.id}
          src={img.src}
          alt={img.alt}
          width={img.width}
          position={img.modes?.[mode] ?? { x: 0, y: 0, rotate: 0 }}
          index={i}
        />
      ))}

      {/* Grid: stagger orchestrator wraps the column structure */}
      <motion.div className="hs-grid" {...motionProps}>
        {/* Text column — always present */}
        <div className="hs-text-col">
          {text && <HeroText key={mode} {...text} />}

          {ctas.length > 0 && <CTAGroup ctas={ctas} layout={ctaLayout} />}

          {/* Mode toggle — rendered below CTAs when floatingImages are configured */}
          {showModeToggle && (
            <HeroModeToggle mode={mode} onChange={onModeChange} />
          )}

          {/* Mobile: tags render here as static chips instead of absolute pills */}
          {tags.length > 0 && (
            <div className="hs-tags-mobile-row" aria-hidden="true">
              {tags.map((tag) => (
                <span key={`mobile-${tag.label}`} className="hs-tag">
                  {tag.icon && (
                    <i className="hs-tag__icon">{tag.icon}</i>
                  )}
                  {tag.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Media column — only when config.media is not null */}
        {media && (
          <div className="hs-media-col">
            <MediaBlock {...media} />
          </div>
        )}
      </motion.div>
    </section>
  );
}
