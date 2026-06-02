const SITE_URL = "https://leanale.com";
const DEFAULT_IMAGE = `${SITE_URL}/starfruit.png`;

const normalizePath = (path = "/") => {
  if (!path) return "/";
  if (path === "/") return "/";
  return path.endsWith("/") ? path.slice(0, -1) : path;
};

const buildMeta = (path, title, description) => {
  const normalized = normalizePath(path);
  const canonical = `${SITE_URL}${normalized}`;
  return {
    path: normalized,
    title,
    description,
    canonical,
    image: DEFAULT_IMAGE,
    ogTitle: title,
    ogUrl: canonical,
    twitterTitle: title,
  };
};

export const ROUTE_META = {
  "/": buildMeta(
    "/",
    "Leana Le | UI/UX Product Designer",
    "UI/UX product designer in Vancouver. Research-informed case studies showing product decisions, visual systems, and measurable outcomes.",
  ),
  "/projects": buildMeta(
    "/projects",
    "Leana Le | Projects",
    "Selected product design case studies and visual design projects with clear role ownership, practical outcomes, and shipped work.",
  ),
  "/about": buildMeta(
    "/about",
    "Leana Le | About",
    "About Leana Le: UI/UX product designer with frontend fluency as a support skill, based in Vancouver and open to product design roles.",
  ),
  "/case-studies/inklink": buildMeta(
    "/case-studies/inklink",
    "InkLink | Collaborative Writing App | Leana Le",
    "InkLink case study: collaborative writing UX focused on reducing pressure and improving participation through shared storytelling flows.",
  ),
  "/case-studies/prolog": buildMeta(
    "/case-studies/prolog",
    "ProLog | Mobile Apprenticeship Companion | Leana Le",
    "ProLog case study: apprenticeship progress and confidence tools for neurodivergent users with clear dashboard-first workflows.",
  ),
  "/case-studies/sidequest": buildMeta(
    "/case-studies/sidequest",
    "SideQuest | Micro-Adventure Web App | Leana Le",
    "SideQuest case study: reducing decision fatigue through playful quest framing and fast, low-pressure activity prompts.",
  ),
  "/projects/inklink": buildMeta(
    "/projects/inklink",
    "InkLink | Collaborative Writing App | Leana Le",
    "Legacy project route for InkLink. Collaborative writing case study focused on research-backed pivots, participation, and momentum.",
  ),
  "/projects/prolog": buildMeta(
    "/projects/prolog",
    "ProLog | Mobile Apprenticeship Companion | Leana Le",
    "Legacy project route for ProLog. Apprenticeship companion case study focused on decision clarity, confidence, and support for neurodivergent users.",
  ),
  "/projects/sidequest": buildMeta(
    "/projects/sidequest",
    "SideQuest | Micro-Adventure Web App | Leana Le",
    "Legacy project route for SideQuest. Micro-adventure case study designed to reduce hesitation through evidence-led interaction decisions.",
  ),
  "/design/fizzu-soda": buildMeta(
    "/design/fizzu-soda",
    "Fizzu Soda | Design Project | Leana Le",
    "Fizzu Soda standalone design project by Leana Le.",
  ),
  "/design/sap": buildMeta(
    "/design/sap",
    "SAP | Design Project | Leana Le",
    "SAP standalone design project by Leana Le.",
  ),
};

export const CRITICAL_ROUTES = Object.keys(ROUTE_META);

export const DEFAULT_ROUTE_META = ROUTE_META["/"];

export const getRouteMeta = (path) => {
  const normalized = normalizePath(path);
  return ROUTE_META[normalized] || null;
};

export { normalizePath, SITE_URL, DEFAULT_IMAGE };
