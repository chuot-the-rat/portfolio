/**
 * readingTime.js
 * Estimates reading time from a project data object.
 *
 * Collects text from all narrative fields (titles, descriptions, findings, etc.)
 * Word count / 200 = minutes, minimum 1.
 */

const TEXT_FIELDS = [
  "title", "tagline", "description", "intro",
  "summary", "context", "findings", "outcome",
  "impact", "rationale", "hypothesis",
];

const SECTION_KEYS = [
  "overview", "problem", "research", "solution",
  "iterations", "personas", "userFlows",
  "informationArchitecture", "styleGuide", "hifi",
  "prototype", "userTesting", "finalPresentation",
  "finalExperience", "outcome",
];

function extractText(obj, depth = 0) {
  if (!obj || depth > 4) return "";
  if (typeof obj === "string") return obj;
  if (Array.isArray(obj)) return obj.map((item) => extractText(item, depth + 1)).join(" ");
  if (typeof obj === "object") {
    return TEXT_FIELDS
      .map((key) => (obj[key] ? extractText(obj[key], depth + 1) : ""))
      .join(" ");
  }
  return "";
}

/**
 * Returns estimated reading time in minutes (minimum 1).
 * @param {object} project — full project data object
 * @returns {number}
 */
export function readingTime(project) {
  if (!project) return 1;

  const chunks = [
    project.title ?? "",
    project.tagline ?? "",
    ...SECTION_KEYS.map((key) => extractText(project[key])),
  ];

  const words = chunks
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 200));
}
