/**
 * Projects.jsx
 * Main projects/work page showing all case studies and design projects.
 *
 * What it does:
 * - Loads project data (both case studies and standalone projects)
 * - Renders a grid of project cards with title, subtitle, category, year
 * - Tracks which project is hovered (for optional de-emphasis effect)
 * - Shows loading spinner while data fetches
 * - Uses Framer Motion for card entrance animations
 *
 * How the data loads:
 * 1. getAllProjects() gets case studies from centralized JSON
 * 2. Fetches projects.json to get metadata for all projects
 * 3. For standalone projects, also fetches /projects/:id/data.json
 * 4. Merges all data together into single list
 * 5. Displays combined grid
 *
 * Links work correctly:
 * - Case studies go to /projects/:id
 * - Standalone projects go to /design/:id
 * (getProjectPath() handles routing automatically)
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import {
    getAllProjects,
    getProjectPath,
    isStandaloneProject,
} from "../utils/projectDataMapper";
import HeroContainer from "../components/header/HeroContainer";
import "./Projects.css";

export default function Projects() {
    // State for projects list
    const [projects, setProjects] = useState([]);
    // Track if data is still loading
    const [loading, setLoading] = useState(true);
    // Track which project is being hovered (for hover dominance effect)
    const [hoveredProject, setHoveredProject] = useState(null);

    useEffect(() => {
        try {
            // Get case studies from centralized mapper utility
            const caseStudyProjects = getAllProjects();

            // Fetch master projects list metadata
            fetch("/projects.json")
                .then((res) => res.json())
                .then(async (projectsList) => {
                    // Merge case study data with project metadata
                    const caseStudyCards = await Promise.all(
                        caseStudyProjects.map(async (project, index) => {
                            const projectMeta =
                                projectsList.find((p) => p.id === project.id) ||
                                {};

                            return {
                                ...projectMeta,
                                ...project,
                            };
                        }),
                    );

                    // Find projects that aren't case studies
                    const standaloneEntries = projectsList.filter((p) =>
                        isStandaloneProject(p.id),
                    );

                    // Fetch data.json for each standalone project
                    const standaloneCards = await Promise.all(
                        standaloneEntries.map(async (entry) => {
                            try {
                                const res = await fetch(
                                    `/projects/${entry.id}/data.json`,
                                );
                                if (!res.ok) return null;
                                const data = await res.json();
                                return {
                                    ...entry,
                                    ...data,
                                };
                            } catch {
                                return null;
                            }
                        }),
                    );

                    // Merge case studies + standalone projects
                    setProjects([
                        ...caseStudyCards,
                        ...standaloneCards.filter(Boolean),
                    ]);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error loading projects.json:", error);
                    const projectsWithData = caseStudyProjects.map(
                        (project) => ({
                            ...project,
                        }),
                    );
                    setProjects(projectsWithData);
                    setLoading(false);
                });
        } catch (error) {
            console.error("Error loading projects:", error);
            setLoading(false);
        }
    }, []);

    const heroConfig = useMemo(() => ({
        layout: "full-left",
        minHeight: "35vh",
        text: {
            descriptor: "Selected Work",
            headline: loading
                ? "Projects"
                : `${projects.length} ${projects.length === 1 ? "project" : "projects"}`,
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
                <HeroContainer config={heroConfig} />
                <section className="section">
                    <div className="container--wide stack stack--tight">
                        {/* Loading state */}
                        {loading ? (
                            <div className="projects-loading">
                                <motion.div
                                    className="loading-spinner"
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                />
                            </div>
                        ) : (
                            // Work list with energy layer hover dominance
                            <div className="workList">
                                {projects.map((project, index) => (
                                    <motion.article
                                        key={project.id}
                                        className="workItem"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.08 * index,
                                            ease: [0.4, 0, 0.2, 1],
                                        }}
                                        onMouseEnter={() =>
                                            setHoveredProject(project)
                                        }
                                        onMouseLeave={() =>
                                            setHoveredProject(null)
                                        }
                                        tabIndex={0}
                                        onFocus={() =>
                                            setHoveredProject(project)
                                        }
                                        onBlur={() =>
                                            setHoveredProject(null)
                                        }
                                    >
                                        <Link
                                            to={getProjectPath(project.id)}
                                            className="workRow"
                                        >
                                            {/* Project title */}
                                            <div className="workTitle">
                                                {project.title}
                                            </div>

                                            {/* Project metadata */}
                                            <div className="workMeta">
                                                {project.category && (
                                                    <>
                                                        <span>
                                                            {project.category}
                                                        </span>
                                                        {project.year && (
                                                            <>
                                                                <span>
                                                                    {" "}
                                                                    ·{" "}
                                                                </span>
                                                                <span>
                                                                    {project.year}
                                                                </span>
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </Link>

                                        {/* Preview image fades in on hover */}
                                        {project.previewImage && (
                                            <div className="workPreview">
                                                <img
                                                    src={
                                                        project.previewImage
                                                    }
                                                    alt={`${project.title} preview`}
                                                />
                                            </div>
                                        )}
                                    </motion.article>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
