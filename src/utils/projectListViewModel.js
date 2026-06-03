import { getDisplayProjectMeta } from "./displayProjectMeta";
import { isStandaloneProject } from "../config/projectRoutes";
import {
    buildPreviewViewModel,
    normalizeProjectImage,
} from "./projectPreviewModel";

export const HOVER_PATTERNS = ["pattern-a", "pattern-b", "pattern-c", "pattern-d"];

export const HOME_ENRICHMENT_IMAGE_SECTIONS = [
    "overview",
    "problem",
    "solution",
    "research",
    "personas",
    "userFlows",
    "hifi",
    "prototype",
    "styleGuide",
    "iterations",
];

export const PROJECTS_ENRICHMENT_IMAGE_SECTIONS = [
    "overview",
    "problem",
    "solution",
    "research",
    "hifi",
    "styleGuide",
    "iterations",
];

const requiredCardKeys = [
    "id",
    "title",
    "previewImage",
    "previewVideo",
    "previewAlt",
    "previewFit",
    "previewFocal",
    "previewCandidates",
    "displayScope",
    "displayRole",
    "displayYear",
    "displaySummary",
];

const assertProjectCardContract = (card, contextLabel = "unknown") => {
    const normalizedCard = {
        previewImage: null,
        previewVideo: null,
        previewAlt: "Project preview",
        previewFit: "cover",
        previewFocal: "center",
        previewCandidates: [],
        allImages: [],
        ...card,
    };

    if (import.meta.env.PROD) {
        return normalizedCard;
    }

    const missing = requiredCardKeys.filter((key) => !(key in normalizedCard));
    if (missing.length > 0) {
        // Dev-only guardrail: do not throw, only surface shape drift.
        console.warn(
            `[projectListViewModel] Missing required project card keys in ${contextLabel}: ${missing.join(", ")}`,
            normalizedCard,
        );
    }
    return normalizedCard;
};

export const safeFetchJson = async (url, options) => {
    try {
        const res = await fetch(url, options);
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
};

export const scheduleIdleTask = (task) => {
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        const idleId = window.requestIdleCallback(task, { timeout: 1200 });
        return () => window.cancelIdleCallback(idleId);
    }
    const timeoutId = window.setTimeout(task, 220);
    return () => window.clearTimeout(timeoutId);
};

export const buildTaxonomyTags = (project = {}) => {
    const sourceTags = Array.isArray(project.tags) ? project.tags : [];
    const normalizedSourceTags = sourceTags
        .map((tag) => String(tag).trim())
        .filter(Boolean);

    const candidates = [...normalizedSourceTags, project.category];
    const unique = [];
    for (const tag of candidates) {
        if (!tag || unique.includes(tag)) continue;
        unique.push(tag);
        if (unique.length === 2) break;
    }
    return unique;
};

const collectImagesFromSections = (data, sections = []) => {
    const images = [];
    for (const key of sections) {
        const section = data?.[key];
        if (!section) continue;
        if (Array.isArray(section.images)) {
            section.images.forEach((image) => images.push(image));
        }
        if (Array.isArray(section.screens)) {
            section.screens.forEach((screen) => {
                if (screen?.image) {
                    images.push({ src: screen.image, alt: screen.name });
                }
            });
        }
    }
    return images.filter((image) => image?.src);
};

export const buildInitialProjectCards = ({
    caseStudyProjects = [],
    projectsList = [],
    includeHoverPattern = true,
    includeTaxonomyTags = true,
    seedImageSections = ["solution", "overview"],
}) => {
    const caseStudyCards = caseStudyProjects.map((caseStudyProject, index) => {
        const projectMeta = projectsList.find((entry) => entry.id === caseStudyProject.id) || {};
        const displayMeta = getDisplayProjectMeta({
            ...projectMeta,
            ...caseStudyProject,
        });

        const allImages = seedImageSections
            .flatMap((sectionKey) => caseStudyProject?.[sectionKey]?.images || [])
            .map((image) => normalizeProjectImage(caseStudyProject.id, image))
            .filter(Boolean);

        const preview = buildPreviewViewModel({
            projectId: caseStudyProject.id,
            title: caseStudyProject.title || projectMeta.title,
            curatedPreviewImage: projectMeta.previewImage || projectMeta.thumbnail,
            explicitPreviewImage: caseStudyProject.previewImage,
            mediaThumbnail: caseStudyProject.media?.thumbnail,
            mediaHeroImage: caseStudyProject.media?.hero_image,
            derivedImageCandidates: allImages.map((img) => img.src),
            explicitPreviewVideo: projectMeta.previewVideo ?? projectMeta.previewVideoSrc,
            previewAlt: projectMeta.previewAlt || caseStudyProject.previewAlt,
            previewFit: projectMeta.previewFit || caseStudyProject.previewFit,
            previewFocal: projectMeta.previewFocal || caseStudyProject.previewFocal,
        });

        // Transitional compatibility fields retained intentionally.
        const card = {
            ...projectMeta,
            ...caseStudyProject,
            ...displayMeta,
            ...(includeHoverPattern
                ? { hoverPattern: HOVER_PATTERNS[index % HOVER_PATTERNS.length] }
                : {}),
            ...(includeTaxonomyTags
                ? {
                    taxonomyTags: buildTaxonomyTags({
                        ...projectMeta,
                        ...caseStudyProject,
                    }),
                }
                : {}),
            allImages,
            coverImage: preview.previewImage,
            ...preview,
        };
        return assertProjectCardContract(card, `initial-case-study:${caseStudyProject.id}`);
    });

    const standaloneEntries = projectsList.filter((entry) =>
        isStandaloneProject(entry.id),
    );

    const standaloneCards = standaloneEntries.map((entry, index) => {
        const displayMeta = getDisplayProjectMeta(entry);
        const preview = buildPreviewViewModel({
            projectId: entry.id,
            title: entry.title,
            curatedPreviewImage: entry.previewImage || entry.thumbnail,
            explicitPreviewVideo: entry.previewVideo ?? entry.previewVideoSrc,
            previewAlt: entry.previewAlt,
            previewFit: entry.previewFit,
            previewFocal: entry.previewFocal,
        });

        // Transitional compatibility fields retained intentionally.
        const card = {
            ...entry,
            ...displayMeta,
            ...(includeHoverPattern
                ? {
                    hoverPattern:
                        HOVER_PATTERNS[(caseStudyCards.length + index) % HOVER_PATTERNS.length],
                }
                : {}),
            ...(includeTaxonomyTags ? { taxonomyTags: buildTaxonomyTags(entry) } : {}),
            allImages: [],
            coverImage: preview.previewImage,
            ...preview,
        };
        return assertProjectCardContract(card, `initial-standalone:${entry.id}`);
    });

    return {
        cards: [...caseStudyCards, ...standaloneCards],
        standaloneEntries,
    };
};

export const buildEnrichedProjectUpdates = async ({
    caseStudyProjects = [],
    standaloneEntries = [],
    projectsList = [],
    signal,
    caseStudyImageSections = PROJECTS_ENRICHMENT_IMAGE_SECTIONS,
    standaloneImageSections = ["overview", "solution", "styleGuide"],
}) => {
    const enrichedCaseStudies = await Promise.all(
        caseStudyProjects.map(async (caseStudyProject) => {
            const projectMeta =
                projectsList.find((entry) => entry.id === caseStudyProject.id) || {};
            const supplementalData = await safeFetchJson(
                `/projects/${caseStudyProject.id}/data.json`,
                { signal },
            );
            if (!supplementalData) return null;

            const allImages = collectImagesFromSections(
                supplementalData,
                caseStudyImageSections,
            )
                .map((image) =>
                    normalizeProjectImage(caseStudyProject.id, image),
                )
                .filter(Boolean);

            const preview = buildPreviewViewModel({
                projectId: caseStudyProject.id,
                title: caseStudyProject.title || projectMeta.title,
                curatedPreviewImage: projectMeta.previewImage || projectMeta.thumbnail,
                explicitPreviewImage: supplementalData?.previewImage,
                mediaThumbnail:
                    supplementalData?.media?.thumbnail ||
                    caseStudyProject.media?.thumbnail,
                mediaHeroImage:
                    supplementalData?.media?.hero_image ||
                    caseStudyProject.media?.hero_image,
                derivedImageCandidates: [
                    supplementalData?.hifi?.images?.[0]?.src,
                    supplementalData?.solution?.images?.[0]?.src,
                    supplementalData?.overview?.images?.[0]?.src,
                    ...allImages.map((img) => img.src),
                ],
                explicitPreviewVideo:
                    supplementalData?.previewVideo ??
                    supplementalData?.previewVideoSrc ??
                    projectMeta.previewVideo ??
                    projectMeta.previewVideoSrc,
                previewAlt: supplementalData?.previewAlt || projectMeta.previewAlt,
                previewFit: supplementalData?.previewFit || projectMeta.previewFit,
                previewFocal: supplementalData?.previewFocal || projectMeta.previewFocal,
            });

            const update = {
                id: caseStudyProject.id,
                allImages,
                coverImage: preview.previewImage,
                ...preview,
            };
            return update;
        }),
    );

    const enrichedStandalone = await Promise.all(
        standaloneEntries.map(async (entry) => {
            const data = await safeFetchJson(
                `/projects/${entry.id}/data.json`,
                { signal },
            );
            if (!data) return null;

            const allImages = collectImagesFromSections(data, standaloneImageSections)
                .map((image) => normalizeProjectImage(entry.id, image))
                .filter(Boolean);
            const displayMeta = getDisplayProjectMeta({
                ...entry,
                ...data,
            });
            const preview = buildPreviewViewModel({
                projectId: entry.id,
                title: entry.title || data?.title,
                curatedPreviewImage: entry.previewImage || entry.thumbnail,
                explicitPreviewImage: data?.previewImage,
                mediaThumbnail: data?.media?.thumbnail,
                mediaHeroImage: data?.media?.hero_image,
                derivedImageCandidates: [
                    data?.hifi?.images?.[0]?.src,
                    data?.solution?.images?.[0]?.src,
                    data?.overview?.images?.[0]?.src,
                    ...allImages.map((img) => img.src),
                ],
                explicitPreviewVideo:
                    data?.previewVideo ??
                    data?.previewVideoSrc ??
                    data?.video?.src ??
                    entry.previewVideo ??
                    entry.previewVideoSrc,
                previewAlt: data?.previewAlt || entry.previewAlt,
                previewFit: data?.previewFit || entry.previewFit,
                previewFocal: data?.previewFocal || entry.previewFocal,
            });

            const update = {
                id: entry.id,
                ...data,
                ...displayMeta,
                allImages,
                coverImage: preview.previewImage,
                ...preview,
                taxonomyTags: buildTaxonomyTags({
                    ...entry,
                    ...data,
                }),
            };
            return update;
        }),
    );

    return [...enrichedCaseStudies, ...enrichedStandalone].filter(Boolean);
};

export const mergeProjectUpdatesById = (currentCards = [], updates = []) => {
    const updateMap = new Map(
        updates
            .filter(Boolean)
            .map((card) => [card.id, card]),
    );
    if (updateMap.size === 0) return currentCards;

    return currentCards.map((card) => {
        const update = updateMap.get(card.id);
        return update ? { ...card, ...update } : card;
    });
};
