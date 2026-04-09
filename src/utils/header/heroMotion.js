/**
 * heroMotion.js
 * Framer Motion variant presets for the header/hero system.
 *
 * Rules:
 * - Import and spread these into motion.* props — never define animation
 *   values inline in component JSX.
 * - Variant keys (hidden, visible, rest, hover, idle, tap) are a contract.
 *   Renaming them silently breaks animations.
 * - All easing uses [0.16, 1, 0.3, 1] — matches --ease-out-premium in energy.css.
 */

import { MOTION_DURATION, MOTION_EASE } from "../motion/tokens";

// ── Stagger orchestrator ─────────────────────────────────────────────────────
// Apply to the top-level motion.div in HeroContainer.
export const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: MOTION_DURATION.staggerFast,
      delayChildren: 0.05,
    },
  },
};

// ── Standard child ───────────────────────────────────────────────────────────
// 10px Y rise + opacity. Reduced travel = more restrained, editorial entrance.
export const childVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATION.revealSlow,
      ease: MOTION_EASE.editorial,
    },
  },
};

// ── Media panel entrance ─────────────────────────────────────────────────────
// Slides from the right + slight scale. Delayed so text leads.
export const mediaVariants = {
  hidden: { opacity: 0, x: 14, scale: 0.98 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: MOTION_DURATION.revealSlow,
      ease: MOTION_EASE.editorial,
      delay: 0.35,
    },
  },
};

// ── FloatingTag entrance ─────────────────────────────────────────────────────
// Staggered via `custom` prop (index). Tags enter after content settles.
export const tagVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATION.revealBase,
      ease: MOTION_EASE.editorial,
      delay: 0.55 + i * 0.1,
    },
  }),
};

// ── FloatingTag idle pulse ───────────────────────────────────────────────────
// Optional slow breathing. Enabled via `idleMotion: true` in headerConfig.
// Merged into tagVariants inside FloatingTag.jsx.
export const tagIdleVariants = {
  idle: {
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// ── Media panel hover ────────────────────────────────────────────────────────
// Subtle lift. Applied with initial="rest" whileHover="hover".
export const mediaHoverVariants = {
  rest: { y: 0 },
  hover: {
    y: -4,
    transition: { duration: MOTION_DURATION.hoverBase, ease: MOTION_EASE.editorial },
  },
};

// ── CTA hover ────────────────────────────────────────────────────────────────
// Y lift instead of scale — more editorial, less UI-component feeling.
export const ctaHoverVariants = {
  rest: { y: 0 },
  hover: {
    y: -2,
    transition: { duration: MOTION_DURATION.hoverSlow, ease: MOTION_EASE.editorial },
  },
  tap: { y: 0, opacity: 0.7 },
};
