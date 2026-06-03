export const toSentence = (value) =>
    String(value || "").replace(/\s+/g, " ").trim();

export const toConciseLine = (value, maxChars = 140) => {
    const sentence = toSentence(value);
    if (!sentence) return "";
    if (sentence.length <= maxChars) return sentence;
    return `${sentence.slice(0, maxChars).replace(/\s+\S*$/, "").trimEnd()}…`;
};

export const toSentenceCaseLine = (value, maxChars = 140) => {
    const line = toConciseLine(value, maxChars);
    if (!line) return "";
    return `${line.charAt(0).toUpperCase()}${line.slice(1)}`;
};

export const toLeadingSentence = (value, fallback = "", maxSentences = 2) => {
    const sentence = toSentence(value);
    if (!sentence) return fallback;
    const parts = sentence.split(/(?<=[.!?])\s+/);
    return parts.slice(0, maxSentences).join(" ");
};

export const normalizeTextKey = (value) =>
    String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();

export const dedupeTextList = (items = []) => {
    const seen = new Set();
    const unique = [];

    for (const item of items) {
        const text = toSentence(item);
        if (!text) continue;
        const key = normalizeTextKey(text);
        if (!key || seen.has(key)) continue;
        seen.add(key);
        unique.push(text);
    }

    return unique;
};

export const filterRedundantOutcomes = (description, outcomes = []) => {
    const compactDescription = normalizeTextKey(description);
    const lowValuePatterns = [
        /collaborative turns/i,
        /perfectionism/i,
        /timed turns.*momentum/i,
        /low-pressure.*fun/i,
    ];
    return dedupeTextList(outcomes).filter((outcome) => {
        const outcomeKey = normalizeTextKey(outcome);
        if (!outcomeKey) return false;
        if (lowValuePatterns.some((pattern) => pattern.test(outcome))) return false;
        if (!compactDescription) return true;
        return !(
            compactDescription.includes(outcomeKey) ||
            outcomeKey.includes(compactDescription)
        );
    });
};

export const hasConcreteSignal = (value) =>
    /\d|%|hour|hours|week|weeks|month|months|participant|prototype|testing|validated|reduced|improved/i.test(
        String(value || ""),
    );

export const CASE_COPY_FALLBACKS = {
    impactSnapshot:
        "Validated through moderated usability sessions with documented outcomes.",
    problem:
        "Defined the user friction and why it blocked progress.",
    constraints:
        "Balanced scope constraints, technical limits, and delivery timing.",
    ownership:
        "Owned end-to-end product design from research to shipped UX.",
    decisions:
        "Prioritized decisions with evidence from user feedback and testing.",
    evidence:
        "Documented impact through validation outcomes and measurable signals.",
    next:
        "Captured next-step hypotheses for the following iteration cycle.",
    heroFraming:
        "This case study traces the key product decisions, why they changed, and what improved in outcomes.",
    pageSummary:
        "Case study detailing role, process, and measurable product outcomes.",
};

export const CASE_SECTION_FALLBACKS = {
    default: "This section highlights the key decision, implementation move, and resulting impact.",
    overview:
        "This overview frames the core user problem, context, and project direction.",
    problem:
        "This section defines the user friction and why it blocked progress.",
    research:
        "Research signals clarified user needs, constraints, and the most viable direction.",
    personas:
        "Personas aligned feature priorities with concrete user needs and usage contexts.",
    userFlows:
        "Flow mapping clarified the critical path and removed avoidable decision friction.",
    ia: "Information architecture organized content into a structure users could scan and trust.",
    lofi: "Lo-fi exploration tested interaction logic before visual polish was introduced.",
    styleGuide:
        "The visual system established consistent hierarchy, readability, and component behavior.",
    iterations:
        "Each iteration addressed observed friction, then revalidated the updated interaction.",
    hifi: "High-fidelity execution translated validated flows into a clearer production-ready experience.",
    development:
        "Development decisions balanced implementation constraints with usability and reliability goals.",
    userTesting:
        "Testing evaluated task clarity, identified usability risks, and informed focused refinements.",
    finalPresentation:
        "This presentation summarizes the problem framing, design rationale, and final outcomes.",
    solution:
        "The final solution prioritizes clarity, confidence, and measurable progress through core workflows.",
    finalExperience:
        "The complete experience demonstrates the polished end-to-end flow in one contiguous journey.",
    validation:
        "Validation findings show where the design improved task completion, confidence, and clarity.",
    outcomes:
        "Outcome evidence captures impact with measurable changes and observed behavior shifts.",
    decisionEvidence:
        "This section traces the assumption, evidence, and resulting product decisions.",
};

export const CASE_NESTED_FALLBACKS = {
    default: "This detail clarifies the decision and why it mattered.",
    flowDescription:
        "This flow reduces friction on the critical user path from intent to completion.",
    featureDescription:
        "This feature targets a specific friction point and clarifies the next user action.",
    insightDescription:
        "This learning informed subsequent prioritization and design direction.",
    prototypeDescription:
        "This prototype demonstrates the intended interaction model and expected outcomes.",
    screenDescription:
        "This screen documents a key interaction state in the final experience.",
    validationOutcomeLine:
        "This outcome summarizes observed impact from testing and iteration.",
};

export const CASE_STUDY_COPY_TARGET_IDS = new Set(["inklink", "prolog", "sidequest"]);

export const CASE_PILOT_OVERRIDES = {
    inklink: {
        tagline:
            "Collaborative writing that turns writer's block into shared momentum.",
        framing:
            "InkLink reframed writing as short, turn-based collaboration so users could keep stories moving without perfection pressure.",
        sections: {
            overview:
                "InkLink reframed stalled solo writing into a collaborative flow where each contributor adds one short passage at a time.",
            problem:
                "Writers were not short on ideas; they were blocked by perfection pressure, isolation, and tools optimized for productivity over creative momentum.",
            research:
                "Research confirmed the need for low-friction contribution, stronger onboarding, and layouts that support long-form reading on larger screens.",
            solution:
                "The final experience centered on public and private story chains, low-friction contribution, and clear status cues that sustain creative momentum.",
            validation:
                "Testing showed stronger task completion and higher confidence after onboarding, contribution flow, and interaction hierarchy were refined.",
            outcomes:
                "Measured improvements in task completion and satisfaction, paired with direct user feedback, validated the collaborative turn-based model.",
        },
        nested: {
            flowDescription:
                "Each flow keeps the contribution loop short and legible so users can commit without overthinking.",
            featureDescription:
                "Each feature supports momentum by reducing friction between reading, writing, and passing the story forward.",
            insightDescription:
                "Each insight captured a concrete product principle that informed later iteration decisions.",
            validationOutcomeLine:
                "Testing outcomes showed stronger completion and confidence after interaction hierarchy improvements.",
        },
    },
};

export const toEditorialCopy = (
    value,
    { fallback = "", maxSentences = 2, maxChars = 220 } = {},
) => {
    const leading = toLeadingSentence(value, "", maxSentences);
    const compact = toSentenceCaseLine(leading || value || "", maxChars);
    if (compact) return compact;
    return toSentenceCaseLine(fallback, maxChars) || fallback;
};

export const getCaseOverrides = (project) =>
    CASE_PILOT_OVERRIDES[String(project?.id || "").toLowerCase()] || null;

export const isCaseStudyCopyTarget = (project) =>
    CASE_STUDY_COPY_TARGET_IDS.has(String(project?.id || "").toLowerCase());

export const getHeroTaglineCopy = (project) => {
    const overrides = getCaseOverrides(project);
    return toEditorialCopy(overrides?.tagline || project?.tagline || project?.subtitle, {
        fallback: "A product case study focused on clarity, flow, and measurable outcomes.",
        maxSentences: 1,
        maxChars: 98,
    });
};

export const getHeroFramingCopy = (project, displaySummary = "") => {
    const overrides = getCaseOverrides(project);
    return toEditorialCopy(
        overrides?.framing ||
            project?.problem?.description ||
            displaySummary ||
            project?.summary ||
            project?.tagline,
        {
            fallback: CASE_COPY_FALLBACKS.heroFraming,
            maxSentences: 1,
            maxChars: 164,
        },
    );
};

export const getSectionIntroCopy = (
    project,
    sectionKey,
    value,
    { maxSentences = 2, maxChars = 228, fallback } = {},
) => {
    const overrides = getCaseOverrides(project);
    const overrideText = overrides?.sections?.[sectionKey];
    return toEditorialCopy(overrideText || value, {
        fallback:
            fallback ||
            CASE_SECTION_FALLBACKS[sectionKey] ||
            CASE_SECTION_FALLBACKS.default,
        maxSentences,
        maxChars,
    });
};

export const getNestedCopy = (
    project,
    nestedKey,
    value,
    { fallback = "", maxSentences = 1, maxChars = 170 } = {},
) => {
    if (!isCaseStudyCopyTarget(project)) {
        return value || fallback;
    }

    const overrides = getCaseOverrides(project);
    const overrideText = overrides?.nested?.[nestedKey];
    return toEditorialCopy(overrideText || value, {
        fallback:
            fallback ||
            CASE_NESTED_FALLBACKS[nestedKey] ||
            CASE_NESTED_FALLBACKS.default,
        maxSentences,
        maxChars,
    });
};

export const dedupeAdjacentCopy = (current, previous = "") =>
    normalizeTextKey(current) === normalizeTextKey(previous) ? "" : current;

export const getImpactSnapshot = (project) => {
    if (Array.isArray(project?.outcomes?.metrics) && project.outcomes.metrics.length > 0) {
        return project.outcomes.metrics
            .slice(0, 3)
            .map((metric) => `${metric.value} ${metric.label}`);
    }
    if (Array.isArray(project?.validation?.outcomes) && project.validation.outcomes.length > 0) {
        return project.validation.outcomes.slice(0, 3);
    }
    return [CASE_COPY_FALLBACKS.impactSnapshot];
};

export const firstNonEmpty = (...values) => {
    for (const value of values) {
        const text = toSentence(value);
        if (text) return text;
    }
    return "";
};

export const toShortActionLine = (value, maxChars = 150) =>
    toSentenceCaseLine(toLeadingSentence(value, "", 1), maxChars);

export const getSectionWhyLine = (project, sectionKey) => {
    const sectionMap = {
        research: [
            project?.research?.reflection,
            project?.research?.keyFindings?.[0],
            project?.research?.methods?.[0],
        ],
        userFlows: [
            project?.userFlows?.flows?.[0]?.description,
            project?.userFlows?.description,
        ],
        lofi: [
            project?.lofi?.prototype?.description,
            project?.lofi?.description,
        ],
        iterations: [
            project?.iterations?.improvements?.[0],
            project?.iterations?.description,
        ],
        hifi: [
            project?.hifi?.screens?.[0]?.description,
            project?.hifi?.description,
        ],
        development: [
            project?.development?.technicalDecisions?.[0],
            project?.development?.constraints?.[0],
        ],
        solution: [
            project?.solution?.features?.[0]?.why,
            project?.solution?.features?.[0]?.description,
        ],
        validation: [
            project?.validation?.outcomes?.[0],
            project?.validation?.method,
        ],
    };

    const source = firstNonEmpty(...(sectionMap[sectionKey] || []));
    if (!source) return "";
    return toShortActionLine(source, 156);
};

export const getWhatChangedClose = (project) => {
    const sources = [
        project?.outcomes?.description,
        project?.validation?.outcomes?.[0],
        project?.outcomes?.metrics?.[0]
            ? `${project.outcomes.metrics[0].value} ${project.outcomes.metrics[0].label}`
            : "",
    ];
    const source = firstNonEmpty(...sources);
    if (!source) return "";
    return toShortActionLine(source, 172);
};

export const getCredibilityRows = (project) => {
    const roleValue = Array.isArray(project?.role)
        ? project.role.join(", ")
        : project?.role || CASE_COPY_FALLBACKS.ownership;

    const constraints =
        project?.development?.constraints?.slice(0, 2) ||
        project?.challenges?.pivots?.slice(0, 2).map((pivot) => pivot.reason) ||
        [];

    const decisions =
        project?.iterations?.improvements?.slice(0, 2) ||
        project?.solution?.features?.slice(0, 2).map((feature) => feature.title) ||
        [];

    const measurable = getImpactSnapshot(project).slice(0, 2);
    const next =
        project?.evolution?.items?.slice(0, 2).map((item) => item.title || item.outcome) ||
        [];

    const evidenceLine = measurable.map(toSentence).join(" • ");

    return [
        {
            label: "Problem that mattered",
            value:
                toLeadingSentence(
                    project?.problem?.description || project?.overview?.description,
                    CASE_COPY_FALLBACKS.problem,
                ) ||
                CASE_COPY_FALLBACKS.problem,
        },
        {
            label: "Approach and constraints",
            value:
                constraints.length > 0
                    ? constraints.map(toSentence).join(" • ")
                    : CASE_COPY_FALLBACKS.constraints,
        },
        { label: "Ownership", value: roleValue },
        {
            label: "Key decisions",
            value:
                decisions.length > 0
                    ? decisions.map(toSentence).join(" • ")
                    : CASE_COPY_FALLBACKS.decisions,
        },
        {
            label: "Evidence of impact",
            value:
                hasConcreteSignal(evidenceLine)
                    ? evidenceLine
                    : CASE_COPY_FALLBACKS.evidence,
        },
        {
            label: "Next iteration",
            value:
                next.length > 0
                    ? next.map(toSentence).join(" • ")
                    : CASE_COPY_FALLBACKS.next,
        },
    ];
};

export const getYouTubeEmbedUrl = (url) => {
    const value = String(url || "").trim();
    if (!value) return "";
    if (value.includes("youtube-nocookie.com/embed/")) return value;
    if (value.includes("youtube.com/embed/")) {
        return value.replace("youtube.com/embed/", "youtube-nocookie.com/embed/");
    }
    const shortMatch = value.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch?.[1]) {
        return `https://www.youtube-nocookie.com/embed/${shortMatch[1]}`;
    }
    const longMatch = value.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (longMatch?.[1]) {
        return `https://www.youtube-nocookie.com/embed/${longMatch[1]}`;
    }
    return value;
};

export const getLaunchMediaCaption = (launchAd) => {
    const explicitCaption = toSentenceCaseLine(launchAd?.caption, 156);
    if (explicitCaption) return explicitCaption;

    const hasVideo = Boolean(launchAd?.video_url || launchAd?.youtube_url);
    const hasDeck = Boolean(launchAd?.embed_url);

    if (hasVideo && hasDeck) {
        return "Use the walkthrough for flow context, then the deck for full rationale.";
    }

    if (hasVideo) {
        return "A concise walkthrough of the concept and core user flow.";
    }

    if (hasDeck) {
        return "Slide deck summarizing concept, decisions, and final flow.";
    }

    return "";
};
