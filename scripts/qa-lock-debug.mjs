import fs from "node:fs";
import path from "node:path";

const DIST_DIR = path.join(process.cwd(), "dist");
const CANDIDATES = [
  path.join(DIST_DIR, "projects", "inklink", "images", "Home.svg"),
  path.join(DIST_DIR, "projects", "inklink", "images"),
  path.join(DIST_DIR, "projects", "inklink"),
  path.join(DIST_DIR, "projects"),
  DIST_DIR,
];

const describePath = (target) => {
  if (!fs.existsSync(target)) {
    return { path: target, status: "missing" };
  }

  try {
    fs.renameSync(target, target);
    return { path: target, status: "ok" };
  } catch (error) {
    return {
      path: target,
      status: "locked",
      error: String(error.message || error),
    };
  }
};

console.log("[qa:lock] Starting dist lock diagnostics...");
console.log(`[qa:lock] dist root: ${DIST_DIR}`);

const results = CANDIDATES.map(describePath);
for (const result of results) {
  if (result.status === "ok") {
    console.log(`[qa:lock] OK     ${result.path}`);
  } else if (result.status === "missing") {
    console.log(`[qa:lock] MISSING ${result.path}`);
  } else {
    console.log(`[qa:lock] LOCKED ${result.path}`);
    console.log(`[qa:lock]        ${result.error}`);
  }
}

const locked = results.filter((r) => r.status === "locked");
if (locked.length === 0) {
  console.log("[qa:lock] No lock detected in known dist paths.");
  process.exit(0);
}

console.error(`[qa:lock] ${locked.length} lock candidate(s) detected.`);
console.error("[qa:lock] Likely causes: OneDrive sync, antivirus scan, editor preview tab, or orphaned Node process.");
console.error("[qa:lock] Next actions:");
console.error(" - Pause OneDrive sync temporarily.");
console.error(" - Close preview/build terminals and editor tabs pointing at dist.");
console.error(" - Run `npm run qa -- --recovery` to stop known Node preview/build processes and retry.");
process.exit(1);

