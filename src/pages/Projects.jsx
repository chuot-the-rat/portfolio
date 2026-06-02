import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import { getAllProjects } from "../utils/projectDataMapper";
import {
    buildEnrichedProjectUpdates,
    buildInitialProjectCards,
    mergeProjectUpdatesById,
    PROJECTS_ENRICHMENT_IMAGE_SECTIONS,
    safeFetchJson,
    scheduleIdleTask,
} from "../utils/projectListViewModel";
import HeroContainer from "../components/header/HeroContainer";
import HomeWorkList from "../components/home/HomeWorkList";
import { resume } from "../data/resume";
import "./Projects.css";

export default function Projects() {
    usePageTitle(null, {
        path: "/projects",
        description:
            "Selected product design case studies and visual design projects with clear role ownership, practical outcomes, and shipped work.",
    });

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        let alive = true;
        let cancelIdleTask = null;

        const loadProjects = async () => {
            try {
                const caseStudyProjects = getAllProjects();
                const projectsList =
                    (await safeFetchJson("/projects.json", {
                        signal: controller.signal,
                    })) || [];
                const { cards, standaloneEntries } = buildInitialProjectCards({
                    caseStudyProjects,
                    projectsList,
                    includeHoverPattern: true,
                    includeTaxonomyTags: true,
                    seedImageSections: ["solution", "overview"],
                });

                if (!alive) return;
                setProjects(cards);
                setLoading(false);

                cancelIdleTask = scheduleIdleTask(async () => {
                    const updates = await buildEnrichedProjectUpdates({
                        caseStudyProjects,
                        standaloneEntries,
                        projectsList,
                        signal: controller.signal,
                        caseStudyImageSections: PROJECTS_ENRICHMENT_IMAGE_SECTIONS,
                        standaloneImageSections: ["overview", "solution", "styleGuide"],
                    });

                    if (!alive) return;
                    if (updates.length === 0) return;

                    setProjects((currentProjects) =>
                        mergeProjectUpdatesById(currentProjects, updates),
                    );
                });
            } catch {
                if (!alive) return;
                const fallbackCaseStudies = getAllProjects();
                const { cards: fallbackCards } = buildInitialProjectCards({
                    caseStudyProjects: fallbackCaseStudies,
                    projectsList: [],
                    includeHoverPattern: false,
                    includeTaxonomyTags: false,
                    seedImageSections: [],
                });
                setProjects(
                    fallbackCards.map((project) => ({
                        ...project,
                        allImages: [],
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
                            <Link to={resume.sectionPath} className="projects-conversion-link">
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
