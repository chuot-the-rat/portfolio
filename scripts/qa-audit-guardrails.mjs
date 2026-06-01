import fs from "node:fs";
import path from "node:path";
import { homeHeroConfig } from "../src/data/header/headerConfig.js";
import { ROUTE_META } from "../src/seo/routeMeta.js";

const TARGET_CASE_IDS = new Set(["inklink", "prolog", "sidequest"]);
const REQUIRED_EVIDENCE_FIELDS = [
  "original_assumption",
  "research_changed_direction",
  "what_changed_why",
  "what_was_cut",
  "next_iteration",
];

const DESIGN_ROLE_PRIORITY = [
  "Product Designer",
  "UX Designer",
  "UI/UX Designer",
  "UI Designer",
  "Product Design",
  "UX Researcher",
  "UX Research",
  "Interaction Designer",
  "Researcher",
];

const BANNED_PHRASES = ["seamless", "intuitive", "user-friendly", "easy to use"];
const ROLE_DRIFT_TERMS = [
  "frontend developer",
  "front-end developer",
  "full stack developer",
  "full-stack developer",
  "software engineer",
];
const failures = [];

const clean = (value) => String(value || "").replace(/\s+/g, " ").trim();

const toRolePriority = (role = "") => {
  const normalized = clean(role).toLowerCase();
  if (!normalized) return Number.POSITIVE_INFINITY;

  for (let i = 0; i < DESIGN_ROLE_PRIORITY.length; i += 1) {
    const keyword = DESIGN_ROLE_PRIORITY[i].toLowerCase();
    if (normalized.includes(keyword)) return i;
  }

  return Number.POSITIVE_INFINITY;
};

const resolveDisplayRole = (caseStudy) => {
  const roleArray = Array.isArray(caseStudy?.role) ? caseStudy.role : [];
  const normalizedRoles = roleArray.map((role) => clean(role)).filter(Boolean);

  if (normalizedRoles.length > 0) {
    const ranked = normalizedRoles
      .map((role) => ({ role, priority: toRolePriority(role) }))
      .sort((a, b) => a.priority - b.priority);

    if (Number.isFinite(ranked[0]?.priority)) return ranked[0].role;
    return normalizedRoles[0];
  }

  const role = clean(caseStudy?.role);
  if (!role) return "";
  return clean(role.split(",")[0]);
};

const collectStrings = (value, collector = []) => {
  if (typeof value === "string") {
    const text = clean(value);
    if (text) collector.push(text);
    return collector;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectStrings(item, collector));
    return collector;
  }

  if (value && typeof value === "object") {
    Object.values(value).forEach((item) => collectStrings(item, collector));
  }

  return collector;
};

const dataPath = path.join(
  process.cwd(),
  "src",
  "assets",
  "case_studies_standardized.json",
);
const caseStudiesData = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const allCaseStudies = Array.isArray(caseStudiesData?.case_studies)
  ? caseStudiesData.case_studies
  : [];
const homeWorkListPath = path.join(
  process.cwd(),
  "src",
  "components",
  "home",
  "HomeWorkList.jsx",
);
const homeWorkListSource = fs.readFileSync(homeWorkListPath, "utf8");

const targetStudies = allCaseStudies.filter((study) => TARGET_CASE_IDS.has(study.id));

for (const id of TARGET_CASE_IDS) {
  if (!targetStudies.some((study) => study.id === id)) {
    failures.push(`[qa:audit] missing target case study id="${id}"`);
  }
}

for (const study of targetStudies) {
  const evidence = study?.evidence_narrative;
  if (!evidence || typeof evidence !== "object") {
    failures.push(`[qa:audit] ${study.id}: missing evidence_narrative block`);
    continue;
  }

  for (const field of REQUIRED_EVIDENCE_FIELDS) {
    if (!(field in evidence)) {
      failures.push(`[qa:audit] ${study.id}: missing evidence_narrative.${field}`);
      continue;
    }

    if (field === "what_was_cut") {
      if (!Array.isArray(evidence[field]) || evidence[field].length === 0) {
        failures.push(`[qa:audit] ${study.id}: evidence_narrative.what_was_cut must be a non-empty array`);
      }
      continue;
    }

    if (!clean(evidence[field])) {
      failures.push(`[qa:audit] ${study.id}: evidence_narrative.${field} must be non-empty`);
    }
  }

  const displayRole = resolveDisplayRole(study);
  if (!displayRole) {
    failures.push(`[qa:audit] ${study.id}: display role resolver returned empty value`);
  } else if (!Number.isFinite(toRolePriority(displayRole))) {
    failures.push(
      `[qa:audit] ${study.id}: design-role precedence regression (resolved role="${displayRole}")`,
    );
  }

  const textCorpus = collectStrings({
    title: study.title,
    subtitle: study.subtitle,
    summary: study.summary,
    evidence_narrative: study.evidence_narrative,
    sections: study.sections,
  });
  const normalizedCorpus = textCorpus.join(" ").toLowerCase();

  for (const phrase of BANNED_PHRASES) {
    if (normalizedCorpus.includes(phrase)) {
      failures.push(`[qa:audit] ${study.id}: banned vague phrase found ("${phrase}")`);
    }
  }

  if (failures.length === 0 || !failures.some((entry) => entry.includes(`[qa:audit] ${study.id}:`))) {
    console.log(`[qa:audit] PASS ${study.id}`);
  }
}

const ensureTextIncludes = (label, value, requiredTerms = []) => {
  const normalizedValue = clean(value).toLowerCase();
  if (!normalizedValue) {
    failures.push(`[qa:audit] ${label}: missing text value`);
    return;
  }

  const hasRequired = requiredTerms.some((term) =>
    normalizedValue.includes(term.toLowerCase()),
  );

  if (!hasRequired) {
    failures.push(
      `[qa:audit] ${label}: expected one of [${requiredTerms.join(", ")}]`,
    );
  }
};

const rejectRoleDriftTerms = (label, value) => {
  const normalizedValue = clean(value).toLowerCase();
  if (!normalizedValue) return;

  for (const term of ROLE_DRIFT_TERMS) {
    if (normalizedValue.includes(term)) {
      failures.push(`[qa:audit] ${label}: role-drift phrase found ("${term}")`);
    }
  }

  if (normalizedValue.includes("developer") && !normalizedValue.includes("designer")) {
    failures.push(
      `[qa:audit] ${label}: includes developer language without design anchor`,
    );
  }
};

const heroDescriptor = homeHeroConfig?.text?.descriptor;
const heroSubline = homeHeroConfig?.text?.subline;
const homeMeta = ROUTE_META?.["/"] || {};
const aboutMeta = ROUTE_META?.["/about"] || {};

ensureTextIncludes("homeHeroConfig.text.descriptor", heroDescriptor, [
  "ui/ux",
  "product designer",
]);
ensureTextIncludes("homeHeroConfig.text.subline", heroSubline, [
  "research-informed",
  "product",
]);
ensureTextIncludes("ROUTE_META[/].title", homeMeta.title, ["ui/ux", "product designer"]);
ensureTextIncludes("ROUTE_META[/].description", homeMeta.description, [
  "ui/ux",
  "product",
  "designer",
]);
ensureTextIncludes("ROUTE_META[/about].description", aboutMeta.description, [
  "ui/ux",
  "product designer",
]);

rejectRoleDriftTerms("homeHeroConfig.text.descriptor", heroDescriptor);
rejectRoleDriftTerms("homeHeroConfig.text.subline", heroSubline);
rejectRoleDriftTerms("ROUTE_META[/].title", homeMeta.title);
rejectRoleDriftTerms("ROUTE_META[/].description", homeMeta.description);
rejectRoleDriftTerms("ROUTE_META[/about].description", aboutMeta.description);

for (const study of targetStudies) {
  const rawScope = clean(study?.project_type);
  const rawYear = clean(study?.year);
  const rawSummary = clean(
    study?.evidence_narrative?.what_changed_why ||
      study?.subtitle ||
      study?.summary,
  );
  const rawRole = resolveDisplayRole(study);

  if (!rawRole) {
    failures.push(`[qa:audit] ${study.id}: missing displayRole for recruiter scan`);
  }
  if (!rawScope) {
    failures.push(`[qa:audit] ${study.id}: missing displayScope for recruiter scan`);
  }
  if (!rawYear) {
    failures.push(`[qa:audit] ${study.id}: missing displayYear for recruiter scan`);
  }
  if (!rawSummary) {
    failures.push(`[qa:audit] ${study.id}: missing value statement summary for recruiter scan`);
  }
}

if (
  !/\[\s*project\.displayRole\s*,\s*project\.displayScope\s*,\s*project\.displayYear\s*,?\s*\]/m.test(
    homeWorkListSource,
  )
) {
  failures.push(
    "[qa:audit] HomeWorkList: metadata order regression (expected role/scope/year)",
  );
}

if (
  !/\{\s*project\.displaySummary\s*\?\?\s*project\.subtitle\s*\?\?\s*project\.tagline\s*\}/m.test(
    homeWorkListSource,
  )
) {
  failures.push(
    "[qa:audit] HomeWorkList: value-statement fallback regression (expected displaySummary first)",
  );
}

if (failures.length > 0) {
  console.error("[qa:audit] FAIL");
  failures.forEach((failure) => console.error(` - ${failure}`));
  process.exit(1);
}

console.log("[qa:audit] All skill-map guardrail checks passed.");
