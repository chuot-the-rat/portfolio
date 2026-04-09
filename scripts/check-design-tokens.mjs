import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceRoot = path.join(root, "src");
const cssFiles = [];

const collectCssFiles = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectCssFiles(fullPath);
      continue;
    }
    if (entry.isFile() && fullPath.endsWith(".css")) {
      cssFiles.push(fullPath);
    }
  }
};

collectCssFiles(sourceRoot);

const declarationMap = new Map();
const usageMap = new Map();

for (const file of cssFiles) {
  const content = fs.readFileSync(file, "utf8");

  for (const match of content.matchAll(/(--[a-z0-9-]+)\s*:/gi)) {
    const token = match[1];
    if (!declarationMap.has(token)) declarationMap.set(token, new Set());
    declarationMap.get(token).add(file);
  }

  for (const match of content.matchAll(/var\(\s*(--[a-z0-9-]+)\b/gi)) {
    const token = match[1];
    if (!usageMap.has(token)) usageMap.set(token, new Set());
    usageMap.get(token).add(file);
  }
}

const missingTokens = [...usageMap.keys()]
  .filter((token) => !declarationMap.has(token))
  .sort();

const coreTokenPrefixes = [
  "--color-",
  "--font-",
  "--space-",
  "--line-height-",
  "--letter-spacing-",
  "--motion-",
  "--layout-",
  "--chip-",
  "--dur-",
  "--ease-",
  "--focus-",
  "--max-width",
  "--container-",
  "--text-",
  "--h1",
  "--h2",
  "--h3",
  "--lh-",
  "--track-",
];

const duplicateAllowList = new Set([
  path.join("src", "styles", "index.css"),
  path.join("src", "components", "ScrollHighlightText.css"),
]);

const duplicateCoreTokens = [...declarationMap.entries()]
  .filter(([token, files]) => {
    if (files.size <= 1) return false;
    if (!coreTokenPrefixes.some((prefix) => token.startsWith(prefix))) return false;
    const normalized = [...files].map((file) => path.relative(root, file));
    const nonLegacy = normalized.filter((file) => !duplicateAllowList.has(file));
    return nonLegacy.length > 1;
  })
  .map(([token, files]) => ({
    token,
    files: [...files].sort(),
  }))
  .sort((a, b) => a.token.localeCompare(b.token));

if (missingTokens.length === 0 && duplicateCoreTokens.length === 0) {
  console.log("Design token check passed.");
  process.exit(0);
}

if (missingTokens.length > 0) {
  console.error("Missing CSS token declarations:");
  for (const token of missingTokens) {
    const usedIn = [...usageMap.get(token)]
      .map((file) => path.relative(root, file))
      .sort()
      .join(", ");
    console.error(`- ${token} (used in: ${usedIn})`);
  }
}

if (duplicateCoreTokens.length > 0) {
  console.error("Duplicate core token declarations:");
  for (const { token, files } of duplicateCoreTokens) {
    const fileList = files.map((file) => path.relative(root, file)).join(", ");
    console.error(`- ${token} (declared in: ${fileList})`);
  }
}

process.exit(1);
