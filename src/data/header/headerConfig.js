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

  // FloatingTags — skill/status pills. Always visible regardless of mode.
  tags: [
    { label: "Available", icon: "✦", initialX: 680, initialY: -18, index: 0 },
    { label: "Figma",     icon: null, initialX: 820, initialY:  70, index: 1 },
    { label: "React",     icon: null, initialX: 700, initialY: 160, index: 2 },
    { label: "Framer",    icon: null, initialX: 950, initialY: 160, index: 3 },
    { label: "CSS",       icon: null, initialX: 840, initialY: 250, index: 4 },
  ],

  // FloatingImages — draggable image cards that rearrange per mode.
  // Set src: "/your/image.jpg" when ready. Leave null to show placeholders.
  floatingImages: [
    {
      id: "hero-img-1",
      src: null,           // → add your image path here
      alt: "Project 1",
      width: 200,
      modes: {
        work:  { x: 880, y:  20, rotate:  2 },
        study: { x: 600, y: -40, rotate: -4 },
        chaos: { x: 920, y: -70, rotate: 14 },
      },
    },
    {
      id: "hero-img-2",
      src: null,
      alt: "Project 2",
      width: 160,
      modes: {
        work:  { x: 760, y: 260, rotate: -3 },
        study: { x: 800, y: 190, rotate:  6 },
        chaos: { x: 630, y: 170, rotate: -18 },
      },
    },
    {
      id: "hero-img-3",
      src: null,
      alt: "Project 3",
      width: 145,
      modes: {
        work:  { x: 980, y: 145, rotate:  4 },
        study: { x: 700, y: 290, rotate: -8 },
        chaos: { x: 760, y:  90, rotate: 22 },
      },
    },
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
