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
    showStatus: true,
    descriptor: "UI/UX Designer & Developer",
    headline: ["Leana", "Le"], // array = one word per display line
    headlineAs: "h1",
    subline:
      "Crafting experiences that bridge research, design, and clean code.",
  },

  // MediaBlock — null until portrait asset is added
  media: null,

  // FloatingTags — skill/status pills. Spring between mode-specific positions.
  tags: [
    {
      label: "Available", icon: "✦", index: 0,
      initialX: 680, initialY: -18,
      modes: {
        work:  { x: 680, y: -18 },
        study: { x: 640, y: -40 },
        chaos: { x: 560, y:  80 },
      },
    },
    {
      label: "Figma", icon: null, index: 1,
      initialX: 820, initialY: 70,
      modes: {
        work:  { x: 820, y:  70 },
        study: { x: 780, y:  20 },
        chaos: { x: 940, y: -30 },
      },
    },
    {
      label: "React", icon: null, index: 2,
      initialX: 700, initialY: 160,
      modes: {
        work:  { x: 700, y: 160 },
        study: { x: 660, y: 120 },
        chaos: { x: 610, y: 220 },
      },
    },
    {
      label: "Framer", icon: null, index: 3,
      initialX: 950, initialY: 160,
      modes: {
        work:  { x: 950, y: 160 },
        study: { x: 900, y: 100 },
        chaos: { x: 870, y: 260 },
      },
    },
    {
      label: "CSS", icon: null, index: 4,
      initialX: 840, initialY: 250,
      modes: {
        work:  { x: 840, y: 250 },
        study: { x: 760, y: 200 },
        chaos: { x: 700, y: 330 },
      },
    },
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
  minHeight: "40vh",
  text: {
    descriptor: "About",
    headline: "Hi! It's Leana.",
    headlineAs: "h1",
    subline: "Designer, developer, and recovering hospitality worker.",
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
