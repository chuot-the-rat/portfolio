import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    getAllProjects,
    isStandaloneProject,
} from "../utils/projectDataMapper";
import HeroContainer from "../components/header/HeroContainer";
import HomeWorkList from "../components/home/HomeWorkList";
import "./Projects.css";

const resolveProjectMediaPath = (projectId, src) => {
    if (!src) return null;
    if (src.startsWith("/") || src.startsWith("http")) return src;
    return `/projects/${projectId}/${src.replace(/^\.?\//, "")}`;
};

const normalizeProjectImage = (projectId, image) => {
    if (!image) return null;
    if (typeof image === "string") {
        const src = resolveProjectMediaPath(projectId, image);
        return src ? { src, alt: "" } : null;
    }
    const src = resolveProjectMediaPath(projectId, image.src || image.image);
    if (!src) return null;
    return { ...image, src };
};

const buildPreviewCandidates = (projectId, candidates = []) => {
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

const safeFetchJson = async (url, options) => {
    try {
        const res = await fetch(url, options);
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
};

const toFirstRole = (project = {}) => {
    const roleArray = Array.isArray(project.roleArray) ? project.roleArray : [];
    if (roleArray.length > 0) return String(roleArray[0]).trim();
    if (typeof project.role === "string" && project.role.trim()) {
        return project.role.split(",")[0].trim();
    }
    return "";
};

const toConciseOutcome = (project = {}) => {
    const preferred = [
        project.subtitle,
        project.summary,
        project.tagline,
        project?.overview?.description,
    ].find((value) => typeof value === "string" && value.trim());

    if (!preferred) return "";
    const compact = preferred.replace(/\s+/g, " ").trim();
    if (compact.length <= 106) return compact;
    return `${compact.slice(0, 103).trimEnd()}…`;
};

const toRoleOutcomeSnippet = (project = {}) => {
    const role = toFirstRole(project);
    const outcome = toConciseOutcome(project);
    if (role && outcome) return `${role} — ${outcome}`;
    return outcome || role || "";
};

const buildTaxonomyTags = (project = {}) => {
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

const scheduleIdleTask = (task) => {
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        const idleId = window.requestIdleCallback(task, { timeout: 1200 });
        return () => window.cancelIdleCallback(idleId);
    }
    const timeoutId = window.setTimeout(task, 220);
    return () => window.clearTimeout(timeoutId);
};

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        let alive = true;
        let cancelIdleTask = null;

        const collectImages = (data) => {
            const imgs = [];
            for (const key of ["overview", "problem", "solution", "research", "hifi", "styleGuide", "iterations"]) {
                const sec = data[key];
                if (!sec) continue;
                if (Array.isArray(sec.images)) imgs.push(...sec.images);
                if (Array.isArray(sec.screens)) {
                    sec.screens.forEach((s) => s.image && imgs.push({ src: s.image, alt: s.name }));
                }
            }
            return imgs.filter((img) => img?.src);
        };

        const loadProjects = async () => {
            try {
                const caseStudyProjects = getAllProjects();
                const projectsList =
                    (await safeFetchJson("/projects.json", {
                        signal: controller.signal,
                    })) || [];
                const hoverPatterns = ["pattern-a", "pattern-b", "pattern-c", "pattern-d"];

                const caseStudyCards = caseStudyProjects.map((project, i) => {
                    const meta = projectsList.find((p) => p.id === project.id) || {};
                    const fallbackImages = [
                        ...(project.solution?.images || []),
                        ...(project.overview?.images || []),
                    ]
                        .map((img) => normalizeProjectImage(project.id, img))
                        .filter(Boolean);
                    const previewCandidates = buildPreviewCandidates(project.id, [
                        meta.thumbnail,
                        meta.previewImage,
                        project.media?.thumbnail,
                        project.media?.hero_image,
                        ...fallbackImages.map((img) => img.src),
                    ]);

                    return {
                        ...meta,
                        ...project,
                        allImages: fallbackImages,
                        coverImage: previewCandidates[0] ?? null,
                        previewCandidates,
                        recruiterSummary: toRoleOutcomeSnippet({
                            ...meta,
                            ...project,
                        }),
                        taxonomyTags: buildTaxonomyTags({
                            ...meta,
                            ...project,
                        }),
                        previewVideoSrc: resolveProjectMediaPath(
                            project.id,
                            meta.previewVideo ?? meta.previewVideoSrc ?? null,
                        ),
                        hoverPattern: hoverPatterns[i % hoverPatterns.length],
                    };
                });

                const standaloneEntries = projectsList.filter((p) =>
                    isStandaloneProject(p.id),
                );

                const standaloneCards = standaloneEntries.map((entry, i) => {
                    const idx = caseStudyCards.length + i;
                    const previewCandidates = buildPreviewCandidates(
                        entry.id,
                        [entry.thumbnail],
                    );
                    return {
                        ...entry,
                        allImages: [],
                        coverImage: previewCandidates[0] ?? null,
                        previewCandidates,
                        recruiterSummary: toRoleOutcomeSnippet(entry),
                        taxonomyTags: buildTaxonomyTags(entry),
                        previewVideoSrc: resolveProjectMediaPath(
                            entry.id,
                            entry.previewVideo ?? entry.previewVideoSrc ?? null,
                        ),
                        hoverPattern: hoverPatterns[idx % hoverPatterns.length],
                    };
                });

                if (!alive) return;
                setProjects([...caseStudyCards, ...standaloneCards]);
                setLoading(false);

                cancelIdleTask = scheduleIdleTask(async () => {
                    const enrichedCaseStudies = await Promise.all(
                        caseStudyProjects.map(async (project) => {
                            const meta = projectsList.find((p) => p.id === project.id) || {};
                            const data = await safeFetchJson(
                                `/projects/${project.id}/data.json`,
                                { signal: controller.signal },
                            );
                            if (!data) return null;

                            const normalizedImages = collectImages(data)
                                .map((img) => normalizeProjectImage(project.id, img))
                                .filter(Boolean);
                            const previewCandidates = buildPreviewCandidates(project.id, [
                                data?.hifi?.images?.[0]?.src,
                                data?.solution?.images?.[0]?.src,
                                data?.overview?.images?.[0]?.src,
                                meta.thumbnail,
                                ...normalizedImages.map((img) => img.src),
                            ]);

                            return {
                                id: project.id,
                                allImages: normalizedImages,
                                coverImage: previewCandidates[0] ?? null,
                                previewCandidates,
                            };
                        }),
                    );

                    const enrichedStandalone = await Promise.all(
                        standaloneEntries.map(async (entry) => {
                            const data = await safeFetchJson(
                                `/projects/${entry.id}/data.json`,
                                { signal: controller.signal },
                            );
                            if (!data) return null;

                            const allImages = [
                                ...(data.overview?.images || []),
                                ...(data.solution?.images || []),
                                ...(data.styleGuide?.images || []),
                            ]
                                .map((img) => normalizeProjectImage(entry.id, img))
                                .filter(Boolean);
                            const previewCandidates = buildPreviewCandidates(
                                entry.id,
                                [
                                    data?.hifi?.images?.[0]?.src,
                                    data?.solution?.images?.[0]?.src,
                                    data?.overview?.images?.[0]?.src,
                                    entry.thumbnail,
                                    ...allImages.map((img) => img.src),
                                ],
                            );

                            return {
                                id: entry.id,
                                ...data,
                                allImages,
                                coverImage: previewCandidates[0] ?? null,
                                previewCandidates,
                                recruiterSummary: toRoleOutcomeSnippet({
                                    ...entry,
                                    ...data,
                                }),
                                taxonomyTags: buildTaxonomyTags({
                                    ...entry,
                                    ...data,
                                }),
                                previewVideoSrc: resolveProjectMediaPath(
                                    entry.id,
                                    data?.previewVideo ??
                                        data?.previewVideoSrc ??
                                        data?.video?.src ??
                                        entry.previewVideo ??
                                        entry.previewVideoSrc ??
                                        null,
                                ),
                            };
                        }),
                    );

                    if (!alive) return;
                    const updateMap = new Map(
                        [...enrichedCaseStudies, ...enrichedStandalone]
                            .filter(Boolean)
                            .map((project) => [project.id, project]),
                    );
                    if (updateMap.size === 0) return;

                    setProjects((currentProjects) =>
                        currentProjects.map((project) => {
                            const update = updateMap.get(project.id);
                            return update ? { ...project, ...update } : project;
                        }),
                    );
                });
            } catch {
                if (!alive) return;
                const caseStudyProjects = getAllProjects();
                setProjects(
                    caseStudyProjects.map((project) => ({
                        ...project,
                        allImages: [],
                        coverImage: null,
                    })),
                );
                setLoading(false);
            }
        };

        loadProjects();

        return () => {
            alive = false;
            controller.abort();
            if (cancelIdleTask) cancelIdleTask();
        };
    }, []);

    const heroConfig = useMemo(() => ({
        layout: "full-left",
        minHeight: "35vh",
        text: {
            descriptor: "Selected Work",
            headline: loading ? "Projects" : `${projects.length} ${projects.length === 1 ? "project" : "projects"}`,
            headlineAs: "h1",
            subline: "Case studies and design projects with clear role ownership and practical outcomes.",
        },
        media: null,
        tags: [],
        ctas: [],
        ctaLayout: "row",
        idleMotion: false,
    }), [projects.length, loading]);

    return (
        <div className="projects-page">
            <main className="projects-main">
                <div className="container">
                    <HeroContainer config={heroConfig} className="projects-hero-grid" />
                    <section className="projects-conversion-row" aria-label="Primary contact actions">
                        <p className="projects-conversion-text">
                            Hiring for product design? I can walk you through role scope and shipped outcomes.
                        </p>
                        <div className="projects-conversion-actions">
                            <a href="mailto:leanale003@gmail.com" className="projects-conversion-link projects-conversion-link--primary">
                                Email
                            </a>
                            <Link to="/about#resume" className="projects-conversion-link">
                                Resume
                            </Link>
                        </div>
                    </section>

                    <section className="projects-work-shell" aria-label="Project listing">
                        {loading ? (
                            <div className="projects-loading">
                                <motion.div
                                    className="projects-spinner"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                            </div>
                        ) : (
                            <HomeWorkList projects={projects} />
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
