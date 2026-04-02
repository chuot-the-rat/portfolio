/**
 * headerConfig.js
 * All content for the header/hero system lives here.
 *
 * Rules:
 * - Content changes → edit this file only. Never hardcode content in JSX.
 * - To hide the media panel → set `media: null`
 * - To remove floating tags → set `tags: []`
 * - To change layout → set `layout` to "asymmetric" | "centered" | "full-left"
 * - To add a new page header → add a named export following the same shape
 */

// ── Home page hero ───────────────────────────────────────────────────────────
export const homeHeroConfig = {
  // HeroContainer layout preset
  layout: "asymmetric", // "asymmetric" | "centered" | "full-left"
  minHeight: "90vh",

  // HeroText
  text: {
    descriptor: "UI/UX Designer & Developer",
    headline: ["Leana", "Le"], // array = one word per display line
    headlineAs: "h1",
    subline:
      "Crafting experiences that bridge research, design, and clean code.",
  },

  // MediaBlock — set to null to collapse the media column entirely
  media: {
    src: "/assets/leana-portrait.jpg",
    alt: "Leana Le",
    type: "image", // "image" | "video"
    caption: "Burnaby, BC",
    rotation: 1.5, // degrees of editorial tilt (0 = flat, negative = left-lean)
    aspectRatio: "4/5",
  },

  // FloatingTags — positions are px offsets from the HeroContainer origin
  tags: [
    { label: "Available", icon: "✦", initialX: 48, initialY: -18, index: 0 },
    { label: "React", icon: null, initialX: -24, initialY: 64, index: 1 },
    { label: "Burnaby", icon: "→", initialX: 72, initialY: 108, index: 2 },
  ],

  // CTAGroup
  ctas: [
    {
      label: "Let's Build Something →",
      href: "mailto:leanale003@gmail.com",
      variant: "primary",
    },
    {
      label: "Resume",
      href: "/Le_Leana_Resume_NoNumber.pdf",
      variant: "ghost",
      download: "Leana_Le_Resume.pdf",
    },
  ],
  ctaLayout: "row", // "row" | "stack"

  // Set to false to disable the idle breathing pulse on FloatingTags
  idleMotion: true,
};

// ── About page header ────────────────────────────────────────────────────────
export const aboutHeroConfig = {
  layout: "full-left",
  minHeight: "45vh",
  text: {
    descriptor: "About",
    headline: "Designed in the spaces between",
    headlineAs: "h1",
    subline: null,
  },
  media: null,
  tags: [],
  ctas: [],
  ctaLayout: "row",
  idleMotion: false,
};

// ── Projects page header ─────────────────────────────────────────────────────
export const projectsHeroConfig = {
  layout: "full-left",
  minHeight: "40vh",
  text: {
    descriptor: "Work",
    headline: "Selected projects",
    headlineAs: "h1",
    subline: null,
  },
  media: null,
  tags: [],
  ctas: [],
  ctaLayout: "row",
  idleMotion: false,
};
