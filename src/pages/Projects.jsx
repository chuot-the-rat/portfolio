import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
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
            subline: "Curated case studies and design work",
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
