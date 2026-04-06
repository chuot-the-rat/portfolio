/**
 * animation.config.js
 * Single source of truth for all animation constants.
 *
 * Rules:
 * - Import from here. Never hardcode timing values in individual components.
 * - EASING values are cubic-bezier arrays for Framer Motion.
 * - CSS transitions should reference the matching --ease-* and --dur-* tokens
 *   in variables.css — keep both in sync.
 */

export const EASING = {
  /** General-purpose: smooth and professional */
  default: [0.25, 0, 0, 1],
  /** Fast deceleration: for UI elements entering the screen */
  spring: [0.16, 1, 0.3, 1],
  /** Framer Motion named ease for simple cases */
  easeOut: "easeOut",
};

export const DURATION = {
  /** Immediate feedback: icon flips, press states */
  fast: 0.15,
  /** Standard hover: color, opacity, border transitions */
  hover: 0.2,
  /** Content reveals: cards, list items */
  reveal: 0.5,
  /** Image crossfades */
  image: 0.6,
  /** Hero entrances */
  hero: 0.72,
};

export const STAGGER = {
  /** Project grid / card lists */
  grid: 0.07,
  /** Hero headline words */
  hero: 0.06,
  /** Vertical list items (e.g. passbook rows) */
  list: 0.08,
  /** Section-level stagger (rare — keep under 4 children) */
  section: 0.08,
};

export const DELAY = {
  /** Small offset so text leads before supplemental elements appear */
  content: 0.05,
  /** Image rewards: not instant — the delay makes it feel earned */
  imageReward: 0.12,
  /** Scroll cue: appears after all hero content settles */
  scrollCue: 1.2,
};

/** Standard reveal variant — opacity + translateY. No scale. */
export const revealVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.reveal,
      ease: EASING.spring,
    },
  },
};

/** Stagger container — use on a motion.div wrapping staggered children */
export const staggerContainerVariants = (stagger = STAGGER.grid) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: DELAY.content,
    },
  },
});
