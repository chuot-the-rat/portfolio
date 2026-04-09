/**
 * projectDataMapper.js
 * Utilities for loading and transforming project data.
 *
 * This file handles:
 * - Loading case studies from the centralized JSON file
 * - Identifying standalone vs case study projects
 * - Transforming raw case study data into app-friendly format
 * - Building correct links for different project types
 *
 * Two project types:
 * 1. Case studies: Live in /case-studies/:id, share structure, defined in database
 * 2. Standalone projects: Live in /design/:id, self-contained data.json files
 *
 * Data source:
 * - Case studies come from case_studies_standardized.json (imported at top)
 * - Standalone IDs are listed in STANDALONE_PROJECT_IDS from App.jsx
 */

// Utility to map case_studies_standardized.json structure to the format expected by UI components
import caseStudiesData from "../assets/case_studies_standardized.json";
import { CASE_STUDY_BASE_PATH, STANDALONE_PROJECT_IDS } from "../App";

/** IDs that live under /design/:slug instead of /case-studies/:id */
export { STANDALONE_PROJECT_IDS };

/**
 * Check if a project is a standalone (self-contained) project.
 * Standalone projects aren't case studies and live in their own /design/:id route.
 * @param {string} id - Project ID to check
 * @returns {boolean} True if this is a standalone project
 */
export const isStandaloneProject = (id) => STANDALONE_PROJECT_IDS.includes(id);

/**
 * Get the correct link path for any project.
 * Automatically routes to correct URL based on project type.
 * @param {string} id - Project ID
 * @returns {string} URL path (/case-studies/:id or /design/:id)
 */
export const getProjectPath = (id) =>
    isStandaloneProject(id) ? `/design/${id}` : `${CASE_STUDY_BASE_PATH}/${id}`;

/**
 * Helper to extract images from section data.
 * Different sections store images in different properties.
 * @param {object} section - Section object that may contain images
 * @returns {array} Array of image URLs or empty array if none found
 */
const extractImages = (section) => {
    if (!section) return [];
    // Try different property names common across case studies
    return section.images || section.visuals || [];
};

const toHybridNarrative = (value, maxSentences = 2) => {
    const clean = String(value || "").replace(/\s+/g, " ").trim();
    if (!clean) return "";
    const sentences = clean.split(/(?<=[.!?])\s+/);
    return sentences.slice(0, maxSentences).join(" ");
};

const normalizeImagesWithContext = (section, contextLabel) =>
    extractImages(section).map((image, index) => {
        const altText =
            image?.alt || `${contextLabel} visual ${index + 1}`;
        const caption =
            image?.caption ||
            `${contextLabel}: ${toHybridNarrative(altText, 1)}`;

        return {
            ...image,
            alt: altText,
            caption,
        };
    });

const normalizeMediaDemo = (section) => {
    if (!section?.media_demo) return null;
    const media = section.media_demo;
    return {
        src: media.src || media.image || "",
        videoSrc: media.video_src || media.videoSrc || "",
        videoType: media.video_type || media.videoType || "video/mp4",
        type: media.type || "",
        poster: media.poster || "",
        alt: media.alt || "",
        caption: media.caption || "",
        muted: media.muted,
        loop: media.loop,
        browserBarImage: media.browser_bar_image || media.browserBarImage || "",
    };
};

const normalizeVerdict = (section) => {
    if (!section?.verdict) return null;
    return {
        do: section.verdict.do || null,
        dont: section.verdict.dont || null,
    };
};

const mapEditorial = (section) => ({
    mediaDemo: normalizeMediaDemo(section),
    verdict: normalizeVerdict(section),
});

/**
 * Maps a raw case study from the JSON into the format UI components expect.
 * This is the main transformation function — handles data shape differences.
 *
 * Why this is needed:
 * - Raw JSON has deep nested sections with varied property names
 * - UI components expect flat properties (project.problem, project.solution, etc.)
 * - This function bridges the gap, preserving all data while restructuring
 *
 * @param {object} caseStudy - Raw case study object from JSON
 * @param {number} index - 0-based position in the case_studies array
 * @returns {object} Transformed project object ready for UI
 */
export const mapCaseStudyToProject = (caseStudy, index = 0) => {
    if (!caseStudy) return null;

    const { sections } = caseStudy;

    // ─── TOOLS TRANSFORMATION ───
    // Keep tools_used as categorized object AND create flattened array
    const toolsFlat = caseStudy.tools_used
        ? Object.values(caseStudy.tools_used).flat()
        : [];

    // ─── PREVIEW LAYOUT DETECTION ───
    // Determine how to display preview based on project type
    const getPreviewLayout = () => {
        if (caseStudy.preview_layout) return caseStudy.preview_layout;
        const type = caseStudy.project_type?.toLowerCase() || "";
        if (type.includes("mobile")) return "mobile";
        if (type.includes("web")) return "tablet";
        return "tablet";
    };

    // Return transformed object with all properties UI components need
    return {
        // ─── CORE METADATA ───
        id: caseStudy.id,
        slug: caseStudy.slug,
        caseIndex: index + 1, // 1-based case study index for micro-index system
        title: caseStudy.title,
        tagline: caseStudy.subtitle || caseStudy.summary,
        subtitle: caseStudy.subtitle,
        summary: caseStudy.summary,
        category: caseStudy.project_type,
        year: caseStudy.year,
        duration: caseStudy.duration,
        context: caseStudy.context,
        teamSize: caseStudy.team_size,

        // ─── ROLE DATA ─── preserve both array and string formats
        roleArray: caseStudy.role || [],
        role: Array.isArray(caseStudy.role)
            ? caseStudy.role.join(", ")
            : caseStudy.role,
        responsibilities: caseStudy.responsibilities || [],

        // ─── TOOLS ─── provide both categorized and flat arrays
        toolsCategories: caseStudy.tools_used || {},
        tools: toolsFlat,

        // ─── LINKS & MEDIA ───
        media: caseStudy.media || {},
        links: caseStudy.links || {},
        heroMarquee:
            caseStudy.hero?.marqueeText || caseStudy.hero?.marquee_text || "",
        checklist: caseStudy.checklist || null,

        // ─── LEGACY FIELDS ─── for backwards compatibility with older component code
        timeline: caseStudy.duration,
        team: `${caseStudy.team_size} team members`,

        // ─── SECTION TRANSFORMATIONS ───
        // Convert nested section structure to flat project properties
        // Each property corresponds to a section of the case study
        overview: sections?.hook
            ? {
                  title: "Overview",
                  description: toHybridNarrative(sections.hook.content, 2),
                  images: normalizeImagesWithContext(sections.hook, "Overview"),
                  ...mapEditorial(sections.hook),
              }
            : null,

        problem: sections?.problem_framing
            ? {
                  title: "The Problem",
                  description: toHybridNarrative(
                      sections.problem_framing.content,
                      3,
                  ),
                  images: normalizeImagesWithContext(
                      sections.problem_framing,
                      "Problem framing",
                  ),
                  ...mapEditorial(sections.problem_framing),
              }
            : null,

        research: sections?.research_process
            ? {
                  title: "Research & Ideation",
                  description: toHybridNarrative(
                      sections.research_process.content || "",
                      2,
                  ),
                  methods: sections.research_process.methods || [],
                  keyFindings: sections.research_process.key_findings || [],
                  participantCount: sections.research_process.participant_count,
                  reflection: sections.research_process.reflection,
                  images: normalizeImagesWithContext(
                      sections.research_process,
                      "Research",
                  ),
                  ...mapEditorial(sections.research_process),
              }
            : null,

        challenges:
            sections?.early_challenges || sections?.pivots
                ? {
                      title: "Early Challenges & Pivots",
                      description: sections.early_challenges?.content || "",
                      pivots:
                          sections.pivots?.map((pivot) => ({
                              from: pivot.from,
                              to: pivot.to,
                              reason: pivot.reason,
                          })) || [],
                  }
                : null,

        // ─── PIVOT DATA ─── structured for ProcessTimeline + FeatureGraveyard
        pivot: sections?.pivot
            ? {
                  timelineSteps: sections.pivot.timelineSteps || [],
                  highlightedStep:
                      sections.pivot.highlightedStep || "Realization",
                  removedFeatures: sections.pivot.removedFeatures || [],
                  reflection: sections.pivot.reflection || "",
                  weightLifted: sections.pivot.weightLifted
                      ? {
                            ...sections.pivot.weightLifted,
                            beforeImage:
                                sections.pivot.weightLifted.beforeImage || null,
                            afterImage:
                                sections.pivot.weightLifted.afterImage || null,
                            displayMode:
                                sections.pivot.weightLifted.displayMode || null,
                        }
                      : null,
                  clarityScene: sections.pivot.clarity_scene || null,
              }
            : null,

        lofi: sections?.lofi_phase
            ? {
                  title: "Lo‑Fi Exploration",
                  description: toHybridNarrative(sections.lofi_phase.content, 2),
                  images: normalizeImagesWithContext(
                      sections.lofi_phase,
                      "Lo-fi exploration",
                  ),
                  ...mapEditorial(sections.lofi_phase),
              }
            : null,

        iterations: sections?.hifi_phase
            ? {
                  title: "High-Fidelity Designs",
                  description: toHybridNarrative(sections.hifi_phase.content, 2),
                  improvements: sections.hifi_phase.key_decisions || [],
                  images: normalizeImagesWithContext(
                      sections.hifi_phase,
                      "High-fidelity decisions",
                  ),
                  prototype: sections.hifi_phase.prototype || null,
                  ...mapEditorial(sections.hifi_phase),
              }
            : null,

        development: sections?.development
            ? {
                  title: "Development Approach",
                  description: toHybridNarrative(
                      sections.development.content,
                      2,
                  ),
                  technicalDecisions:
                      sections.development.technical_decisions || [],
                  constraints: sections.development.constraints || [],
                  ...mapEditorial(sections.development),
              }
            : null,

        solution: sections?.feature_breakdown
            ? {
                  title: "Final Solution",
                  description: toHybridNarrative(
                      sections.feature_breakdown.intro || "",
                      2,
                  ),
                  features:
                      sections.feature_breakdown.features?.map((f) => ({
                          id: f.id,
                          title: f.title || f.name,
                          description: f.description || f.explanation || f.why,
                          why: f.why,
                          image: f.image,
                          caption: toHybridNarrative(
                              f.caption || f.why || f.description || "",
                              1,
                          ),
                      })) || [],
                  images: normalizeImagesWithContext(
                      sections.feature_breakdown,
                      "Solution",
                  ),
                  prototype: sections.feature_breakdown.prototype || null,
                  ...mapEditorial(sections.feature_breakdown),
              }
            : sections?.development
              ? {
                    title: "Final Solution",
                    description: toHybridNarrative(
                        sections.development.content,
                        2,
                    ),
                    features: [],
                    images: normalizeImagesWithContext(
                        sections.development,
                        "Solution",
                    ),
                    ...mapEditorial(sections.development),
                }
              : null,

        validation: sections?.validation
            ? {
                  title: "Validation & Testing",
                  description: toHybridNarrative(sections.validation.content, 2),
                  method: sections.validation.method,
                  participantCount: sections.validation.participant_count,
                  quotes:
                      sections.validation.key_quotes ||
                      sections.validation.quotes ||
                      sections.validation.participant_quotes ||
                      [],
                  outcomes: sections.validation.outcomes || [],
                  ...mapEditorial(sections.validation),
              }
            : null,

        learnings: sections?.what_i_learned
            ? {
                  title: "What I Learned",
                  insights: Array.isArray(sections.what_i_learned)
                      ? sections.what_i_learned.map((item) => ({
                            title: item.insight || item.point || item.title,
                            description:
                                item.reflection ||
                                item.explanation ||
                                item.description,
                        }))
                      : sections.what_i_learned.insights?.map((insight) => ({
                            title:
                                insight.point ||
                                insight.insight ||
                                insight.title,
                            description:
                                insight.explanation ||
                                insight.reflection ||
                                insight.description,
                        })) || [],
              }
            : null,

        evolution: sections?.next_steps
            ? {
                  title: "Where It Evolves",
                  items: Array.isArray(sections.next_steps)
                      ? sections.next_steps.map((step) => ({
                            title: step.title || step.item || step,
                            tag: step.tag || "",
                            outcome: step.outcome || "",
                            impact: step.impact || "",
                        }))
                      : (
                            sections.next_steps.planned ||
                            sections.next_steps.items ||
                            []
                        ).map((item) => ({
                            title:
                                typeof item === "string"
                                    ? item
                                    : item.title || item.item,
                            tag: typeof item === "object" ? item.tag || "" : "",
                            outcome:
                                typeof item === "object"
                                    ? item.outcome || ""
                                    : "",
                            impact:
                                typeof item === "object"
                                    ? item.impact || ""
                                    : "",
                        })),
              }
            : null,

        finalExperience: sections?.final_experience
            ? {
                  intro: sections.final_experience.intro,
                  prototype: sections.final_experience.prototype || null,
                  ...mapEditorial(sections.final_experience),
              }
            : null,

        // ─── DISPLAY SETTINGS ───
        previewLayout: getPreviewLayout(),
        status: caseStudy.status,
        featured: caseStudy.featured,
    };
};

/**
 * Gets all case studies and maps them to project format.
 * Use this to load the full project list.
 *
 * @returns {array} Array of transformed project objects
 */
export const getAllProjects = () => {
    if (!caseStudiesData?.case_studies) {
        console.error("Case studies data not found");
        return [];
    }

    // Map each case study with its index (for micro-index numbering)
    return caseStudiesData.case_studies.map((cs, i) =>
        mapCaseStudyToProject(cs, i),
    );
};

/**
 * Gets a single project by ID or slug.
 * Use this when loading a specific project detail page.
 *
 * @param {string} id - Project ID or slug to look up
 * @returns {object|null} Transformed project object or null if not found
 */
export const getProjectById = (id) => {
    if (!caseStudiesData?.case_studies) {
        console.error("Case studies data not found");
        return null;
    }

    // Find the case study by matching either id or slug
    const caseStudyIndex = caseStudiesData.case_studies.findIndex(
        (cs) => cs.id === id || cs.slug === id,
    );

    // Get the case study (or null if not found)
    const caseStudy =
        caseStudyIndex >= 0
            ? caseStudiesData.case_studies[caseStudyIndex]
            : null;

    // Transform and return (includes the case study index for numbering)
    return caseStudy ? mapCaseStudyToProject(caseStudy, caseStudyIndex) : null;
};
