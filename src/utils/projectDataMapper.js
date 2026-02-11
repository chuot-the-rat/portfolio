// Utility to map case_studies_standardized.json structure to the format expected by UI components
import caseStudiesData from "../assets/case_studies_standardized.json";
import { STANDALONE_PROJECT_IDS } from "../App";

/** IDs that live under /design/:slug instead of /projects/:id */
export { STANDALONE_PROJECT_IDS };

/** Check if a project ID is standalone (uses its own data.json, not case study format) */
export const isStandaloneProject = (id) => STANDALONE_PROJECT_IDS.includes(id);

/** Build the correct link path for a project */
export const getProjectPath = (id) =>
    isStandaloneProject(id) ? `/design/${id}` : `/projects/${id}`;

/**
 * Helper to extract images from section data
 */
const extractImages = (section) => {
    if (!section) return [];
    return section.images || section.visuals || [];
};

/**
 * Maps a case study from the centralized JSON to the format expected by ProjectDetail and Home components
 * Preserves the full data structure for comprehensive rendering
 * @param {object} caseStudy - raw case study object
 * @param {number} index - 0-based position in the case_studies array
 */
export const mapCaseStudyToProject = (caseStudy, index = 0) => {
    if (!caseStudy) return null;

    const { sections } = caseStudy;

    // Keep tools_used as categorized object AND create flattened array
    const toolsFlat = caseStudy.tools_used
        ? Object.values(caseStudy.tools_used).flat()
        : [];

    // Determine preview layout from project type if not specified
    const getPreviewLayout = () => {
        if (caseStudy.preview_layout) return caseStudy.preview_layout;
        const type = caseStudy.project_type?.toLowerCase() || "";
        if (type.includes("mobile")) return "mobile";
        if (type.includes("web")) return "tablet";
        return "tablet";
    };

    return {
        // Core metadata
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

        // Role data (preserve array and create string)
        roleArray: caseStudy.role || [],
        role: Array.isArray(caseStudy.role)
            ? caseStudy.role.join(", ")
            : caseStudy.role,
        responsibilities: caseStudy.responsibilities || [],

        // Tools (both formats)
        toolsCategories: caseStudy.tools_used || {},
        tools: toolsFlat,

        // Media
        media: caseStudy.media || {},

        // Links
        links: caseStudy.links || {},

        // Legacy fields for compatibility
        timeline: caseStudy.duration,
        team: `${caseStudy.team_size} team members`,

        // Map sections to expected format (preserve full data structure)
        overview: sections?.hook
            ? {
                  title: "Overview",
                  description: sections.hook.content,
                  images: extractImages(sections.hook),
              }
            : null,

        problem: sections?.problem_framing
            ? {
                  title: "The Problem",
                  description: sections.problem_framing.content,
                  images: extractImages(sections.problem_framing),
              }
            : null,

        research: sections?.research_process
            ? {
                  title: "Research & Ideation",
                  description: (() => {
                      const process = sections.research_process;
                      let desc = process.content || "";

                      if (
                          process.key_findings &&
                          process.key_findings.length > 0
                      ) {
                          desc +=
                              "\n\nKey findings: " +
                              process.key_findings.join(" ");
                      }

                      if (process.reflection) {
                          desc += "\n\n" + process.reflection;
                      }

                      return desc;
                  })(),
                  methods: sections.research_process.methods || [],
                  keyFindings: sections.research_process.key_findings || [],
                  participantCount: sections.research_process.participant_count,
                  reflection: sections.research_process.reflection,
                  images: extractImages(sections.research_process),
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

        // Structured pivot data for ProcessTimeline + FeatureGraveyard
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
                  description: sections.lofi_phase.content,
                  images: extractImages(sections.lofi_phase),
              }
            : null,

        iterations: sections?.hifi_phase
            ? {
                  title: "High-Fidelity Designs",
                  description: sections.hifi_phase.content,
                  improvements: sections.hifi_phase.key_decisions || [],
                  images: extractImages(sections.hifi_phase),
                  prototype: sections.hifi_phase.prototype || null,
              }
            : null,

        development: sections?.development
            ? {
                  title: "Development Approach",
                  description: sections.development.content,
                  technicalDecisions:
                      sections.development.technical_decisions || [],
                  constraints: sections.development.constraints || [],
              }
            : null,

        solution: sections?.feature_breakdown
            ? {
                  title: "Final Solution",
                  description: sections.feature_breakdown.intro || "",
                  features:
                      sections.feature_breakdown.features?.map((f) => ({
                          id: f.id,
                          title: f.title || f.name,
                          description: f.description || f.explanation || f.why,
                          why: f.why,
                          image: f.image,
                      })) || [],
                  images: extractImages(sections.feature_breakdown),
                  prototype: sections.feature_breakdown.prototype || null,
              }
            : sections?.development
              ? {
                    title: "Final Solution",
                    description: sections.development.content,
                    features: [],
                    images: extractImages(sections.development),
                }
              : null,

        validation: sections?.validation
            ? {
                  title: "Validation & Testing",
                  description: sections.validation.content,
                  method: sections.validation.method,
                  participantCount: sections.validation.participant_count,
                  quotes:
                      sections.validation.key_quotes ||
                      sections.validation.quotes ||
                      sections.validation.participant_quotes ||
                      [],
                  outcomes: sections.validation.outcomes || [],
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
              }
            : null,

        // Additional metadata
        previewLayout: getPreviewLayout(),
        status: caseStudy.status,
        featured: caseStudy.featured,
    };
};

/**
 * Gets all case studies and maps them to project format
 */
export const getAllProjects = () => {
    if (!caseStudiesData?.case_studies) {
        console.error("Case studies data not found");
        return [];
    }

    return caseStudiesData.case_studies.map((cs, i) =>
        mapCaseStudyToProject(cs, i),
    );
};

/**
 * Gets a single project by ID
 */
export const getProjectById = (id) => {
    if (!caseStudiesData?.case_studies) {
        console.error("Case studies data not found");
        return null;
    }

    const caseStudyIndex = caseStudiesData.case_studies.findIndex(
        (cs) => cs.id === id || cs.slug === id,
    );
    const caseStudy =
        caseStudyIndex >= 0
            ? caseStudiesData.case_studies[caseStudyIndex]
            : null;
    return caseStudy ? mapCaseStudyToProject(caseStudy, caseStudyIndex) : null;
};
