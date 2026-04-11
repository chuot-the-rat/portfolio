import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CASE_STUDIES_PATH = path.join(
  ROOT,
  "src",
  "assets",
  "case_studies_standardized.json",
);
const PROJECTS_LIST_PATH = path.join(ROOT, "public", "projects.json");
const PUBLIC_DIR = path.join(ROOT, "public");
const REPORT_PATH = path.join(ROOT, "QA_MEDIA_INTEGRITY_REPORT.md");

const CASE_STUDIES_DATA = JSON.parse(fs.readFileSync(CASE_STUDIES_PATH, "utf8"));
const CASE_STUDIES = Array.isArray(CASE_STUDIES_DATA.case_studies)
  ? CASE_STUDIES_DATA.case_studies
  : [];
const PROJECTS_LIST = JSON.parse(fs.readFileSync(PROJECTS_LIST_PATH, "utf8"));

const caseStudyIds = new Set(CASE_STUDIES.map((study) => study.id));
const standaloneProjects = PROJECTS_LIST.filter(
  (entry) => entry?.id && !caseStudyIds.has(entry.id),
);

const PROJECT_PATH_PATTERN = /^\/projects\/[^/]+\/.+/i;
const MEDIA_EXT_PATTERN = /\.(png|jpe?g|webp|svg|gif|avif|mp4|webm|ogg|pdf)$/i;
const shouldWriteReport =
  process.argv.includes("--write-report") || process.env.QA_MEDIA_WRITE === "1";

const normalizeMediaPath = (value) => String(value || "").trim();

const collectMediaRefs = (node, refs = new Set()) => {
  if (!node) return refs;
  if (Array.isArray(node)) {
    node.forEach((item) => collectMediaRefs(item, refs));
    return refs;
  }
  if (typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      if (typeof value === "string") {
        const mediaPath = normalizeMediaPath(value);
        if (
          PROJECT_PATH_PATTERN.test(mediaPath) &&
          (MEDIA_EXT_PATTERN.test(mediaPath) || key === "src" || key === "image")
        ) {
          refs.add(mediaPath);
        }
      } else {
        collectMediaRefs(value, refs);
      }
    }
  }
  return refs;
};

const projectPathToDiskPath = (mediaPath) =>
  path.join(PUBLIC_DIR, mediaPath.replace(/^\//, "").replace(/\//g, path.sep));

const toProjectMediaPath = (projectId, candidate) => {
  if (!candidate || typeof candidate !== "string") return null;
  const value = candidate.trim();
  if (!value || value.startsWith("http")) return null;
  if (value.startsWith("/")) return value;
  if (value.startsWith(`projects/${projectId}/`)) return `/${value}`;
  return `/projects/${projectId}/${value.replace(/^\.?\//, "")}`;
};

const caseStudyResults = CASE_STUDIES.map((study) => {
  const refs = [...collectMediaRefs(study)].sort((a, b) => a.localeCompare(b));
  const missing = refs.filter((ref) => !fs.existsSync(projectPathToDiskPath(ref)));
  return {
    id: study.id || "unknown",
    title: study.title || "Untitled",
    total: refs.length,
    missing,
    present: refs.length - missing.length,
  };
});

const standaloneResults = standaloneProjects.map((entry) => {
  const id = entry.id;
  const dataPath = path.join(ROOT, "public", "projects", id, "data.json");
  const refs = new Set();

  if (fs.existsSync(dataPath)) {
    const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    collectMediaRefs(data, refs);
  }

  for (const key of ["thumbnail", "previewVideo", "previewVideoSrc"]) {
    const mediaPath = toProjectMediaPath(id, entry[key]);
    if (mediaPath) refs.add(mediaPath);
  }

  const refsList = [...refs].sort((a, b) => a.localeCompare(b));
  const missing = refsList.filter((ref) => !fs.existsSync(projectPathToDiskPath(ref)));

  return {
    id,
    title: entry.title || id,
    total: refsList.length,
    missing,
    present: refsList.length - missing.length,
  };
});

const launchMediaChecks = CASE_STUDIES.map((study) => {
  const launchAd = study?.sections?.launch_ad;
  if (!launchAd) {
    return {
      id: study.id || "unknown",
      title: study.title || "Untitled",
      status: "no-launch-ad",
      ok: true,
    };
  }

  const hasRenderableSource = Boolean(
    launchAd.video_url || launchAd.youtube_url || launchAd.embed_url,
  );

  return {
    id: study.id || "unknown",
    title: study.title || "Untitled",
    status: hasRenderableSource ? "ok" : "missing-source",
    ok: hasRenderableSource,
  };
});

const allResults = [...caseStudyResults, ...standaloneResults];
const totalRefs = allResults.reduce((sum, item) => sum + item.total, 0);
const totalMissing = allResults.reduce((sum, item) => sum + item.missing.length, 0);
const totalPresent = totalRefs - totalMissing;
const launchMissingCount = launchMediaChecks.filter(
  (check) => check.status === "missing-source",
).length;
const hasFailures = totalMissing > 0 || launchMissingCount > 0;

const buildReportLines = () => {
  const generatedAt = new Date().toISOString();
  const lines = [
    "# Portfolio Media Integrity Report",
    "",
    `Generated: ${generatedAt}`,
    "",
    `- Total referenced media: ${totalRefs}`,
    `- Present in \`public/projects\`: ${totalPresent}`,
    `- Missing from \`public/projects\`: ${totalMissing}`,
    "",
    "## Launch Media Checks (Case Studies)",
    "",
  ];

  for (const check of launchMediaChecks) {
    if (check.status === "no-launch-ad") {
      lines.push(`- ${check.title} (\`${check.id}\`): no launch media block`);
    } else if (check.ok) {
      lines.push(`- ${check.title} (\`${check.id}\`): launch media source present`);
    } else {
      lines.push(`- ${check.title} (\`${check.id}\`): launch media source missing`);
    }
  }

  lines.push("");
  lines.push("## Missing Paths by Case Study");
  lines.push("");

  for (const item of caseStudyResults) {
    lines.push(`### ${item.title} (\`${item.id}\`)`);
    lines.push(`- Referenced: ${item.total}`);
    lines.push(`- Missing: ${item.missing.length}`);
    if (item.missing.length === 0) {
      lines.push("- Missing paths: none");
    } else {
      lines.push("- Missing paths:");
      for (const ref of item.missing) lines.push(`  - \`${ref}\``);
    }
    lines.push("");
  }

  lines.push("## Missing Paths by Standalone Design Project");
  lines.push("");

  for (const item of standaloneResults) {
    lines.push(`### ${item.title} (\`${item.id}\`)`);
    lines.push(`- Referenced: ${item.total}`);
    lines.push(`- Missing: ${item.missing.length}`);
    if (item.missing.length === 0) {
      lines.push("- Missing paths: none");
    } else {
      lines.push("- Missing paths:");
      for (const ref of item.missing) lines.push(`  - \`${ref}\``);
    }
    lines.push("");
  }

  return lines;
};

if (shouldWriteReport) {
  const lines = buildReportLines();
  fs.writeFileSync(REPORT_PATH, `${lines.join("\n")}\n`, "utf8");
}

console.log(`[qa:media] Total refs: ${totalRefs}`);
console.log(`[qa:media] Present: ${totalPresent}`);
console.log(`[qa:media] Missing: ${totalMissing}`);
for (const item of caseStudyResults) {
  console.log(`[qa:media] case:${item.id} missing ${item.missing.length}/${item.total}`);
}
for (const item of standaloneResults) {
  console.log(`[qa:media] standalone:${item.id} missing ${item.missing.length}/${item.total}`);
}
for (const check of launchMediaChecks) {
  if (check.status === "no-launch-ad") {
    console.log(`[qa:media] ${check.id}: launch media not configured`);
  } else if (check.ok) {
    console.log(`[qa:media] ${check.id}: launch media source present`);
  } else {
    console.log(`[qa:media] ${check.id}: launch media source missing`);
  }
}
if (shouldWriteReport) {
  console.log(`[qa:media] Report written: ${path.relative(ROOT, REPORT_PATH)}`);
} else {
  console.log("[qa:media] Report write skipped (check-only mode).");
}

if (hasFailures) {
  console.error(
    `[qa:media] Integrity check failed (missing media: ${totalMissing}, missing launch sources: ${launchMissingCount}).`,
  );
  process.exitCode = 1;
}
