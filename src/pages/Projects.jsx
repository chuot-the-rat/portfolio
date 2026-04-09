import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import {
    getAllProjects,
    isStandaloneProject,
} from "../utils/projectDataMapper";
import HeroContainer from "../components/header/HeroContainer";
import HomeWorkList from "../components/home/HomeWorkList";
import "./Projects.css";

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const caseStudyProjects = getAllProjects();

            fetch("/projects.json")
                .then((res) => res.json())
                .then(async (projectsList) => {
                    const hoverPatterns = ["pattern-a", "pattern-b", "pattern-c", "pattern-d"];

                    // Collect images from a project data.json
                    const collectImages = (data) => {
                        const imgs = [];
                        for (const key of ["overview", "problem", "solution", "research", "hifi", "styleGuide", "iterations"]) {
                            const sec = data[key];
                            if (!sec) continue;
                            if (Array.isArray(sec.images)) imgs.push(...sec.images);
                            if (Array.isArray(sec.screens))
                                sec.screens.forEach((s) => s.image && imgs.push({ src: s.image, alt: s.name }));
                        }
                        return imgs.filter((img) => img?.src);
                    };

                    const caseStudyCards = await Promise.all(
                        caseStudyProjects.map(async (project, i) => {
                            const meta = projectsList.find((p) => p.id === project.id) || {};
                            let allImages = [];
                            let coverImage = null;
                            try {
                                const res = await fetch(`/projects/${project.id}/data.json`);
                                if (res.ok) {
                                    const data = await res.json();
                                    allImages = collectImages(data);
                                    coverImage =
                                        data?.hifi?.images?.[0]?.src ??
                                        data?.solution?.images?.[0]?.src ??
                                        data?.overview?.images?.[0]?.src ??
                                        null;
                                }
                            } catch { /* no supplemental data */ }
                            return {
                                ...meta,
                                ...project,
                                allImages,
                                coverImage,
                                hoverPattern: hoverPatterns[i % hoverPatterns.length],
                            };
                        }),
                    );

                    const standaloneCards = await Promise.all(
                        projectsList.filter((p) => isStandaloneProject(p.id)).map(async (entry, i) => {
                            try {
                                const res = await fetch(`/projects/${entry.id}/data.json`);
                                if (!res.ok) return null;
                                const data = await res.json();
                                const idx = caseStudyCards.length + i;
                                const allImages = [
                                    ...(data.overview?.images || []),
                                    ...(data.solution?.images || []),
                                    ...(data.styleGuide?.images || []),
                                ].filter((img) => img?.src);
                                return {
                                    ...entry,
                                    ...data,
                                    allImages,
                                    coverImage:
                                        data?.hifi?.images?.[0]?.src ??
                                        data?.solution?.images?.[0]?.src ??
                                        data?.overview?.images?.[0]?.src ??
                                        null,
                                    hoverPattern: hoverPatterns[idx % hoverPatterns.length],
                                };
                            } catch { return null; }
                        }),
                    );

                    setProjects([...caseStudyCards, ...standaloneCards.filter(Boolean)]);
                    setLoading(false);
                })
                .catch(() => {
                    setProjects(caseStudyProjects.map((p) => ({ ...p, allImages: [], coverImage: null })));
                    setLoading(false);
                });
        } catch {
            setLoading(false);
        }
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
