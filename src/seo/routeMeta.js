const SITE_URL = "https://leanale.com";
const DEFAULT_IMAGE = `${SITE_URL}/starfruit.png`;

const normalizePath = (path = "/") => {
  if (!path) return "/";
  if (path === "/") return "/";
  return path.endsWith("/") ? path.slice(0, -1) : path;
};

const buildMeta = (path, title, description, options = {}) => {
  const normalized = normalizePath(path);
  const canonical = `${SITE_URL}${normalized}`;
  const {
    changefreq = "monthly",
    priority = 0.7,
  } = options;

  return {
    path: normalized,
    title,
    description,
    canonical,
    image: DEFAULT_IMAGE,
    ogTitle: title,
    ogDescription: description,
    ogUrl: canonical,
    twitterTitle: title,
    twitterDescription: description,
    sitemapChangefreq: changefreq,
    sitemapPriority: priority,
  };
};

export const INDEXED_ROUTE_ENTRIES = [
  buildMeta(
    "/",
    "Leana Le | UI/UX Product Designer",
    "UI/UX product designer in Vancouver. Research-informed case studies showing product decisions, visual systems, and measurable outcomes.",
    { priority: 1.0 },
  ),
  buildMeta(
    "/projects",
    "Leana Le | Projects",
    "Selected product design case studies and visual design projects with clear role ownership, practical outcomes, and shipped work.",
    { priority: 0.9 },
  ),
  buildMeta(
    "/about",
    "Leana Le | About",
    "About Leana Le: UI/UX product designer with frontend fluency as a support skill, based in Vancouver and open to product design roles.",
    { priority: 0.9 },
  ),
  buildMeta(
    "/case-studies/inklink",
    "InkLink | Collaborative Writing App | Leana Le",
    "InkLink case study: collaborative writing UX focused on reducing pressure and improving participation through shared storytelling flows.",
    { priority: 0.8 },
  ),
  buildMeta(
    "/case-studies/prolog",
    "ProLog | Mobile Apprenticeship Companion | Leana Le",
    "ProLog case study: apprenticeship progress and confidence tools for neurodivergent users with clear dashboard-first workflows.",
    { priority: 0.8 },
  ),
  buildMeta(
    "/case-studies/sidequest",
    "SideQuest | Micro-Adventure Web App | Leana Le",
    "SideQuest case study: reducing decision fatigue through playful quest framing and fast, low-pressure activity prompts.",
    { priority: 0.8 },
  ),
  buildMeta(
    "/design/fizzu-soda",
    "Fizzu Soda | Design Project | Leana Le",
    "Fizzu Soda packaging design project by Leana Le, focused on a playful soda can series with clear visual identity decisions.",
    { priority: 0.7 },
  ),
  buildMeta(
    "/design/sap",
    "SAP | Design Project | Leana Le",
    "Super Auto Pets motion graphics project by Leana Le, focused on game-driven motion and visual communication.",
    { priority: 0.7 },
  ),
  buildMeta(
    "/design/menu",
    "Menu Design | Design Project | Leana Le",
    "Editorial menu design project by Leana Le, focused on layout clarity, hierarchy, and branded print presentation.",
    { priority: 0.7 },
  ),
  buildMeta(
    "/design/yard-sale",
    "Yard Sale Flyer Series | Design Project | Leana Le",
    "Campaign design project by Leana Le featuring a yard sale flyer series built for clear promotion across formats.",
    { priority: 0.7 },
  ),
];

export const ROUTE_META = Object.fromEntries(
  INDEXED_ROUTE_ENTRIES.map((entry) => [entry.path, entry]),
);

export const INDEXED_ROUTE_PATHS = INDEXED_ROUTE_ENTRIES.map((entry) => entry.path);
export const CRITICAL_ROUTES = INDEXED_ROUTE_PATHS;

export const DEFAULT_ROUTE_META = ROUTE_META["/"];

export const getRouteMeta = (path) => {
  const normalized = normalizePath(path);
  return ROUTE_META[normalized] || null;
};

export { normalizePath, SITE_URL, DEFAULT_IMAGE };
