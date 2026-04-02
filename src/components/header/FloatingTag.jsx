/**
 * FloatingTag.jsx
 * Draggable pill element positioned absolutely within HeroContainer.
 *
 * - Drag is constrained to the parent HeroContainer via dragConstraintsRef.
 * - On mobile (< 768px): drag is disabled. The tag is hidden at its absolute
 *   position; HeroContainer renders a separate static version in the mobile
 *   tag row below the CTAs.
 * - idleMotion enables a slow breathing opacity pulse (6s loop).
 * - Entrance is staggered via the `index` prop fed into tagVariants.
 */

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  tagVariants,
  tagIdleVariants,
} from "../../utils/header/heroMotion";

export default function FloatingTag({
  label,
  icon = null,
  initialX = 0,
  initialY = 0,
  index = 0,
  dragConstraintsRef,
  idleMotion = true,
}) {
  const shouldReduceMotion = useReducedMotion();

  // Phase: "entrance" first, then switches to "idle" via onAnimationComplete.
  // This ensures the entrance (y rise + opacity fade) fully completes before
  // the breathing pulse begins — not both running simultaneously.
  const [phase, setPhase] = useState("entrance");

  // Check at render time — sufficient for Vite/React (no SSR)
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;

  // On mobile: the absolute tag is hidden via CSS; don't bother animating it
  if (isMobile) return null;

  const motionProps = shouldReduceMotion
    ? { style: { opacity: 1 } }
    : {
        variants: { ...tagVariants, ...tagIdleVariants },
        custom: index,
        initial: "hidden",
        animate: phase === "idle" ? "idle" : "visible",
        onAnimationComplete: (def) => {
          // Switch to idle loop once entrance ("visible") finishes
          if (def === "visible" && idleMotion) setPhase("idle");
        },
      };

  return (
    <motion.span
      className="hs-tag"
      style={{
        left: initialX,
        top: initialY,
      }}
      drag={!shouldReduceMotion}
      dragConstraints={dragConstraintsRef}
      dragElastic={0.08}
      dragMomentum={false}
      aria-hidden="true"
      {...motionProps}
    >
      {icon && (
        <i className="hs-tag__icon" aria-hidden="true">
          {icon}
        </i>
      )}
      {label}
    </motion.span>
  );
}
