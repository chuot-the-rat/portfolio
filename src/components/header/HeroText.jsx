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

import { motion, useReducedMotion } from "framer-motion";
import { childVariants } from "../../utils/header/heroMotion";

export default function HeroText({
  descriptor,
  headline,
  headlineAs: Tag = "h1",
  subline,
}) {
  const shouldReduceMotion = useReducedMotion();

  // When reduced motion: pass no animation props — elements appear instantly
  const motionProps = shouldReduceMotion ? {} : { variants: childVariants };

  // Normalize headline to array so the render path is always the same
  const headlineLines = Array.isArray(headline) ? headline : [headline];

  return (
    <>
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
