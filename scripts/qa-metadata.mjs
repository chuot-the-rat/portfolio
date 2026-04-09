import fs from "node:fs";
import path from "node:path";
import { CRITICAL_ROUTES, ROUTE_META } from "../src/seo/routeMeta.js";

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:4173";
const MODE = process.env.QA_METADATA_MODE || "dist";
const DIST_DIR = path.join(process.cwd(), "dist");
const failures = [];

const extract = (html, regex) => {
  const match = regex.exec(html);
  return match?.[1]?.trim() || "";
};

const getDistFileForRoute = (route) => {
  if (route === "/") {
    return path.join(DIST_DIR, "index.html");
  }
  const clean = route.replace(/^\/+/, "");
  return path.join(DIST_DIR, clean, "index.html");
};

const getHtml = async (route) => {
  if (MODE === "served") {
    const url = `${BASE_URL}${route}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`non-200 response for ${url} (${res.status})`);
    }
    return res.text();
  }

  const filePath = getDistFileForRoute(route);
  if (!fs.existsSync(filePath)) {
    throw new Error(`missing prerendered file: ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf8");
};

for (const route of CRITICAL_ROUTES) {
  const expected = ROUTE_META[route];
  try {
    const html = await getHtml(route);
    const title = extract(html, /<title>([\s\S]*?)<\/title>/i);
    const description = extract(html, /<meta\s+name="description"\s+content="([^"]*)"/i);
    const canonical = extract(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i);
    const ogTitle = extract(html, /<meta\s+property="og:title"\s+content="([^"]*)"/i);
    const ogUrl = extract(html, /<meta\s+property="og:url"\s+content="([^"]*)"/i);
    const twitterTitle = extract(html, /<meta\s+name="twitter:title"\s+content="([^"]*)"/i);

    const checks = [
      ["title", title, expected.title],
      ["description", description, expected.description],
      ["canonical", canonical, expected.canonical],
      ["og:title", ogTitle, expected.ogTitle],
      ["og:url", ogUrl, expected.ogUrl],
      ["twitter:title", twitterTitle, expected.twitterTitle],
    ];

    for (const [name, actual, expectedValue] of checks) {
      if (!actual || actual === "Loading…" || actual !== expectedValue) {
        failures.push({
          route,
          field: name,
          actual,
          expected: expectedValue,
        });
      }
    }

    if (!checks.some(([, actual, expectedValue]) => !actual || actual === "Loading…" || actual !== expectedValue)) {
      console.log(`[qa:metadata] PASS ${route}`);
    }
  } catch (error) {
    failures.push({
      route,
      field: MODE === "served" ? "response" : "file",
      actual: String(error.message || error),
      expected: MODE === "served" ? "200 + metadata" : "prerendered file with metadata",
    });
  }
}

if (failures.length > 0) {
  console.error(`[qa:metadata] FAIL (mode=${MODE})`);
  for (const fail of failures) {
    console.error(
      ` - ${fail.route} | ${fail.field} | actual="${fail.actual}" | expected="${fail.expected}"`,
    );
  }
  process.exit(1);
}

console.log(`[qa:metadata] All metadata checks passed (mode=${MODE}).`);
