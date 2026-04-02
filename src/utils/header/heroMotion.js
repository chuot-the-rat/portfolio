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

// ── Stagger orchestrator ─────────────────────────────────────────────────────
// Apply to the top-level motion.div in HeroContainer.
export const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04, // 40ms between each child
      delayChildren: 0.1,
    },
  },
};

// ── Standard child ───────────────────────────────────────────────────────────
// 20px Y rise + opacity. Used by HeroText nodes and CTAGroup.
export const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// ── Media panel entrance ─────────────────────────────────────────────────────
// Slides from the right + slight scale. Delayed so text leads.
export const mediaVariants = {
  hidden: { opacity: 0, x: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.2,
    },
  },
};

// ── FloatingTag entrance ─────────────────────────────────────────────────────
// Staggered via `custom` prop (index). Pass index={i} on each FloatingTag.
export const tagVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.35 + i * 0.08,
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
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

// ── CTA hover ────────────────────────────────────────────────────────────────
export const ctaHoverVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
  tap: { scale: 0.98 },
};
