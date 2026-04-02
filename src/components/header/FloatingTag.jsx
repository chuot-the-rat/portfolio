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

  // Check at render time — sufficient for Vite/React (no SSR)
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;

  // On mobile: the absolute tag is hidden via CSS; don't bother animating it
  if (isMobile) return null;

  // Build the animate array — always show visible state, optionally add idle
  const animateState =
    idleMotion && !shouldReduceMotion
      ? ["visible", "idle"]
      : "visible";

  const motionProps = shouldReduceMotion
    ? { style: { opacity: 1 } }
    : {
        variants: { ...tagVariants, ...tagIdleVariants },
        custom: index,
        initial: "hidden",
        animate: animateState,
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
