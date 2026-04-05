/**
 * HeroText.jsx
 * Renders the editorial text block: descriptor kicker, display headline,
 * and subline paragraph.
 *
 * - Font choices, sizing, and spacing are all controlled via --hs-* tokens
 *   in HeroSection.css. Nothing is hardcoded here.
 * - Each text node is an independent motion.* element using childVariants
 *   from heroMotion.js — the stagger timing is orchestrated by HeroContainer.
 * - headline can be a string (single line) or string[] (one word per line).
 */

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { childVariants } from "../../utils/header/heroMotion";

/** Shows Vancouver local time, updating every 30 s */
function LiveClock() {
  const fmt = () =>
    new Date().toLocaleTimeString("en-US", {
      timeZone: "America/Vancouver",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  const [time, setTime] = useState(fmt);

  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 30_000);
    return () => clearInterval(id);
  }, []);

  return <span className="hs-clock">{time}</span>;
}

export default function HeroText({
  descriptor,
  headline,
  headlineAs: Tag = "h1",
  subline,
  showStatus = false,
}) {
  const shouldReduceMotion = useReducedMotion();

  // When reduced motion: pass no animation props — elements appear instantly
  const motionProps = shouldReduceMotion ? {} : { variants: childVariants };

  // Normalize headline to array so the render path is always the same
  const headlineLines = Array.isArray(headline) ? headline : [headline];

  return (
    <>
      {showStatus && (
        <motion.div className="hs-text__status" {...motionProps}>
          <span className="hs-status-dot" aria-hidden="true" />
          <span>Available</span>
          <span className="hs-status-sep" aria-hidden="true">·</span>
          <span>Vancouver, BC</span>
          <span className="hs-status-sep" aria-hidden="true">·</span>
          <LiveClock />
        </motion.div>
      )}

      {descriptor && (
        <motion.span className="hs-text__descriptor" {...motionProps}>
          {descriptor}
        </motion.span>
      )}

      <motion.div {...motionProps}>
        <Tag className="hs-text__headline">
          {headlineLines.map((line, i) => (
            <span key={i} className="hs-text__headline-word">
              {line}
            </span>
          ))}
        </Tag>
      </motion.div>

      {subline && (
        <motion.p className="hs-text__subline" {...motionProps}>
          {subline}
        </motion.p>
      )}
    </>
  );
}
