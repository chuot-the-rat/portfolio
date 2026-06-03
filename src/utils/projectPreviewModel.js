const toCleanString = (value) => String(value || "").trim();

export const resolveProjectMediaPath = (projectId, src) => {
    const rawSrc = toCleanString(src);
    if (!rawSrc) return null;
    if (rawSrc.startsWith("/") || rawSrc.startsWith("http")) return rawSrc;
    if (rawSrc.startsWith("projects/")) return `/${rawSrc}`;
    return `/projects/${projectId}/${rawSrc.replace(/^\.?\//, "")}`;
};

export const normalizeProjectImage = (projectId, image) => {
    if (!image) return null;
    if (typeof image === "string") {
        const src = resolveProjectMediaPath(projectId, image);
        return src ? { src, alt: "" } : null;
    }
    const src = resolveProjectMediaPath(projectId, image.src || image.image);
    if (!src) return null;
    return { ...image, src };
};

export const buildPreviewCandidates = (projectId, candidates = []) => {
    const unique = [];
    const seen = new Set();
    for (const candidate of candidates) {
        const src = resolveProjectMediaPath(projectId, candidate);
        if (!src || seen.has(src)) continue;
        seen.add(src);
        unique.push(src);
    }
    return unique;
};

const toPreviewFit = (value) => {
    const normalized = String(value || "").toLowerCase();
    return normalized === "contain" ? "contain" : "cover";
};

export const buildPreviewViewModel = ({
    projectId,
    title = "",
    curatedPreviewImage = null,
    explicitPreviewImage = null,
    mediaThumbnail = null,
    mediaHeroImage = null,
    derivedImageCandidates = [],
    explicitPreviewVideo = null,
    previewAlt = "",
    previewFit = "cover",
    previewFocal = null,
} = {}) => {
    const previewCandidates = buildPreviewCandidates(projectId, [
        explicitPreviewImage,
        mediaThumbnail,
        mediaHeroImage,
        curatedPreviewImage,
        ...derivedImageCandidates,
    ]);

    const normalizedPreviewAlt = toCleanString(previewAlt) || `${toCleanString(title) || "Project"} preview`;
    const normalizedPreviewFocal = toCleanString(previewFocal) || null;

    return {
        previewImage: previewCandidates[0] ?? null,
        previewCandidates,
        previewVideo: resolveProjectMediaPath(projectId, explicitPreviewVideo),
        previewAlt: normalizedPreviewAlt,
        previewFit: toPreviewFit(previewFit),
        previewFocal: normalizedPreviewFocal,
    };
};

export const resolvePreviewState = (project = {}, fallbackAlt = "Project preview") => {
    const previewCandidates = buildPreviewCandidates(project.id, [
        project.previewImage,
        ...(Array.isArray(project.previewCandidates) ? project.previewCandidates : []),
        project.coverImage,
        ...(Array.isArray(project.allImages)
            ? project.allImages.map((image) => image?.src || image)
            : []),
    ]);

    return {
        previewCandidates,
        previewVideo: resolveProjectMediaPath(project.id, project.previewVideo),
        previewAlt: toCleanString(project.previewAlt) || fallbackAlt,
        previewFit: toPreviewFit(project.previewFit),
        previewFocal: toCleanString(project.previewFocal) || "center",
    };
};
