import fs from "node:fs";
import path from "node:path";
import {
  INDEXED_ROUTE_ENTRIES,
  ROUTE_META,
  SITE_URL,
} from "../src/seo/routeMeta.js";

const root = process.cwd();
const publicSitemapPath = path.join(root, "public", "sitemap.xml");
const distSitemapPath = path.join(root, "dist", "sitemap.xml");
const failures = [];

const extractLocs = (xml) =>
  Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g), (match) => match[1].trim());

const readFileOrFail = (filePath) => {
  if (!fs.existsSync(filePath)) {
    failures.push(`[qa:sitemap] missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
};

const expectedPaths = INDEXED_ROUTE_ENTRIES.map((entry) => entry.path);
const expectedLocs = INDEXED_ROUTE_ENTRIES.map((entry) => entry.canonical);
const expectedLocSet = new Set(expectedLocs);
const expectedPathSet = new Set(expectedPaths);

const derivedLegacyProjectLocs = expectedPaths
  .filter((route) => route.startsWith("/case-studies/") || route.startsWith("/design/"))
  .map((route) => `${SITE_URL}/projects/${route.split("/").pop()}`);

const bannedLocs = new Set([
  `${SITE_URL}/contact`,
  `${SITE_URL}/resume`,
  ...derivedLegacyProjectLocs,
]);

for (const route of expectedPaths) {
  if (!ROUTE_META[route]) {
    failures.push(`[qa:sitemap] missing ROUTE_META entry for indexed route ${route}`);
  }
}

for (const [route] of Object.entries(ROUTE_META)) {
  if (!expectedPathSet.has(route)) {
    failures.push(`[qa:sitemap] ROUTE_META contains non-indexed route ${route}`);
  }
}

const publicXml = readFileOrFail(publicSitemapPath);
const distXml = readFileOrFail(distSitemapPath);

const publicLocs = extractLocs(publicXml);
const distLocs = extractLocs(distXml);

const validateSitemap = (label, locs) => {
  const locSet = new Set(locs);

  for (const expectedLoc of expectedLocs) {
    if (!locSet.has(expectedLoc)) {
      failures.push(`[qa:sitemap] ${label} missing indexed route ${expectedLoc}`);
    }
  }

  for (const loc of locs) {
    if (!expectedLocSet.has(loc)) {
      failures.push(`[qa:sitemap] ${label} contains unexpected route ${loc}`);
    }
    if (bannedLocs.has(loc)) {
      failures.push(`[qa:sitemap] ${label} contains legacy redirect route ${loc}`);
    }
  }
};

validateSitemap("public/sitemap.xml", publicLocs);
validateSitemap("dist/sitemap.xml", distLocs);

if (publicXml && distXml && publicXml !== distXml) {
  failures.push("[qa:sitemap] public/sitemap.xml and dist/sitemap.xml differ");
}

if (failures.length > 0) {
  console.error("[qa:sitemap] FAIL");
  failures.forEach((failure) => console.error(` - ${failure}`));
  process.exit(1);
}

console.log(`[qa:sitemap] PASS indexed route count=${expectedLocs.length}`);
