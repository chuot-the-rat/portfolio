import fs from "node:fs";
import path from "node:path";
import { CRITICAL_ROUTES, ROUTE_META, INDEXED_ROUTE_ENTRIES } from "../src/seo/routeMeta.js";

const root = process.cwd();
const distDir = path.join(root, "dist");
const baseHtmlPath = path.join(distDir, "index.html");
const publicSitemapPath = path.join(root, "public", "sitemap.xml");
const distSitemapPath = path.join(distDir, "sitemap.xml");

const fail = (msg) => {
  console.error(`[prerender] ${msg}`);
  process.exit(1);
};

if (!fs.existsSync(baseHtmlPath)) {
  fail("dist/index.html not found. Run build before prerender.");
}

const baseHtml = fs.readFileSync(baseHtmlPath, "utf8");

const upsertMeta = (html, selectorRegex, tagFactory) => {
  if (selectorRegex.test(html)) {
    return html.replace(selectorRegex, tagFactory);
  }
  return html.replace("</head>", `${tagFactory}\n</head>`);
};

const injectRouteMeta = (html, meta) => {
  let out = html;
  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${meta.title}</title>`);
  out = upsertMeta(
    out,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${meta.description}">`,
  );
  out = upsertMeta(
    out,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${meta.canonical}">`,
  );
  out = upsertMeta(
    out,
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${meta.ogTitle}">`,
  );
  out = upsertMeta(
    out,
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${meta.ogDescription}">`,
  );
  out = upsertMeta(
    out,
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${meta.ogUrl}">`,
  );
  out = upsertMeta(
    out,
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${meta.twitterTitle}">`,
  );
  out = upsertMeta(
    out,
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${meta.twitterDescription}">`,
  );
  return out;
};

const buildSitemapXml = (entries) => {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  for (const entry of entries) {
    lines.push("  <url>");
    lines.push(`    <loc>${entry.canonical}</loc>`);
    lines.push(`    <changefreq>${entry.sitemapChangefreq}</changefreq>`);
    lines.push(`    <priority>${entry.sitemapPriority.toFixed(1)}</priority>`);
    lines.push("  </url>");
  }

  lines.push("</urlset>", "");
  return lines.join("\n");
};

const writeRouteFile = (route, html) => {
  if (route === "/") return;
  const clean = route.replace(/^\/+/, "");
  const routeDir = path.join(distDir, clean);
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(path.join(routeDir, "index.html"), html, "utf8");
};

for (const route of CRITICAL_ROUTES) {
  const meta = ROUTE_META[route];
  if (!meta) continue;
  const prerendered = injectRouteMeta(baseHtml, meta);
  writeRouteFile(route, prerendered);
}

// Also ensure root has route-correct metadata applied.
if (ROUTE_META["/"]) {
  const rootHtml = injectRouteMeta(baseHtml, ROUTE_META["/"]);
  fs.writeFileSync(baseHtmlPath, rootHtml, "utf8");
}

const sitemapXml = buildSitemapXml(INDEXED_ROUTE_ENTRIES);
fs.writeFileSync(publicSitemapPath, sitemapXml, "utf8");
fs.writeFileSync(distSitemapPath, sitemapXml, "utf8");

console.log(`[prerender] Wrote prerendered HTML for ${CRITICAL_ROUTES.length} routes.`);
