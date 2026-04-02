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
  layout: "full-left", // "asymmetric" | "centered" | "full-left"
  minHeight: "90vh",

  // HeroText
  text: {
    descriptor: "UI/UX Designer & Developer",
    headline: ["Leana", "Le"], // array = one word per display line
    headlineAs: "h1",
    subline:
      "Crafting experiences that bridge research, design, and clean code.",
  },

  // MediaBlock — null until portrait asset is added
  media: null,

  // FloatingTags — px offsets from the HeroContainer top-left origin.
  // Spread intentionally so they orbit the right side of the headline block.
  // When switching to "asymmetric" layout, reposition tags to surround the
  // media panel (e.g. cluster near the panel edges rather than the text).
  tags: [
    { label: "Available", icon: "✦", initialX: 680, initialY: -18, index: 0 }, // upper-right
    { label: "React",     icon: null,  initialX: 760, initialY:  86, index: 1 }, // far-right mid
    { label: "Burnaby",   icon: "→",   initialX: 560, initialY: 160, index: 2 }, // lower-center
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
// Note: Projects.jsx keeps its own dynamic header (headline shows live project
// count). This config is available for standalone use on other pages if needed.
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

// ── Resume page header ───────────────────────────────────────────────────────
export const resumeHeroConfig = {
  layout: "full-left",
  minHeight: "35vh",
  text: {
    descriptor: "Resume",
    headline: "Experience & Skills",
    headlineAs: "h1",
    subline: null,
  },
  media: null,
  tags: [],
  ctas: [
    {
      label: "Download PDF",
      href: "/Le_Leana_Resume_NoNumber.pdf",
      variant: "ghost",
      download: "Leana_Le_Resume.pdf",
    },
  ],
  ctaLayout: "row",
  idleMotion: false,
};
