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
import { useState, useEffect } from "react";
import {
    getAllProjects,
    getProjectPath,
    isStandaloneProject,
} from "../utils/projectDataMapper";
import CursorFollowPreview from "../components/CursorFollowPreview";
import "./Projects.css";

/**
 * Extract preview images from project data
 * Tries to get images from multiple sources: hoverImages, images array, or media.images
 */
function getPreviewImages(project) {
    // If hoverImages already set, use it
    if (project.hoverImages && Array.isArray(project.hoverImages)) {
        return project.hoverImages.slice(0, 5);
    }

    // Try to extract from media.images (case studies)
    if (project.media?.images) {
        return project.media.images.slice(0, 5);
    }

    // Try to extract from overview.images (standalone projects)
    if (project.overview?.images) {
        return project.overview.images.slice(0, 5);
    }

    // Try to extract from sections that have images array
    if (project.sections) {
        const allImages = [];
        Object.values(project.sections).forEach((section) => {
            if (section.images && Array.isArray(section.images)) {
                allImages.push(...section.images);
            }
        });
        return allImages.slice(0, 5);
    }

    return [];
}

export default function Projects() {
    // State for projects list
    const [projects, setProjects] = useState([]);
    // Track if data is still loading
    const [loading, setLoading] = useState(true);
    // Track which project is being hovered (for hover dominance effect)
    const [hoveredProject, setHoveredProject] = useState(null);
    // Track cursor position for preview follow (desktop only)
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    // Desktop detection
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

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
                    const allProjects = [
                        ...caseStudyCards,
                        ...standaloneCards.filter(Boolean),
                    ];

                    // Extract preview images for each project
                    const projectsWithPreviews = allProjects.map((project) => ({
                        ...project,
                        hoverImages: getPreviewImages(project),
                    }));

                    setProjects(projectsWithPreviews);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error loading projects.json:", error);
                    const projectsWithData = caseStudyProjects.map(
                        (project) => ({
                            ...project,
                            hoverImages: getPreviewImages(project),
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

    // Handle desktop resize detection
    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Handle mouse move for cursor-follow preview
    const handleMouseMove = (e) => {
        if (!isDesktop) return;
        setCursorPos({ x: e.clientX, y: e.clientY });
    };

    return (
        <div className="projects-page">
            <main
                className="projects-main"
                onMouseMove={hoveredProject ? handleMouseMove : null}
            >
                <section className="section">
                    <div className="container--wide stack stack--tight">
                        {/* Header with kicker label */}
                        <motion.div
                            className="stack"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="kicker">Selected Work</div>
                            <h1 className="projects-title">
                                {projects.length}{" "}
                                {projects.length === 1 ? "project" : "projects"}
                            </h1>
                            <p className="projects-subtitle">
                                Curated case studies and design work
                            </p>
                        </motion.div>

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
                                        onBlur={() => setHoveredProject(null)}
                                    >
                                        <Link
                                            to={getProjectPath(project.id)}
                                            className="workRow"
                                        >
                                            {/* Index number */}
                                            <div className="workIndex">
                                                {String(index + 1).padStart(
                                                    2,
                                                    "0",
                                                )}
                                            </div>

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
                                                                <span> · </span>
                                                                <span>
                                                                    {
                                                                        project.year
                                                                    }
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
                                                    src={project.previewImage}
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

                {/* Cursor-follow preview for hovered project */}
                <CursorFollowPreview
                    project={hoveredProject}
                    cursorX={cursorPos.x}
                    cursorY={cursorPos.y}
                    isDesktop={isDesktop}
                />
            </main>
        </div>
    );
}
