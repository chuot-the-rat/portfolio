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
import "./Projects.css";

export default function Projects() {
    // State for projects list
    const [projects, setProjects] = useState([]);
    // Track if data is still loading
    const [loading, setLoading] = useState(true);
    // Track which project is being hovered (optional: for de-emphasis effect)
    const [hoveredProject, setHoveredProject] = useState(null);

    useEffect(() => {
        try {
            // Get case studies from centralized mapper utility
            const caseStudyProjects = getAllProjects();

            // Fetch master projects list metadata
            fetch("/projects.json")
                .then((res) => res.json())
                .then(async (projectsList) => {
                    // ─── LOAD CASE STUDIES ───
                    // Merge case study data with project metadata
                    const caseStudyCards = await Promise.all(
                        caseStudyProjects.map(async (project, index) => {
                            // Look up this project in the master list
                            const projectMeta =
                                projectsList.find((p) => p.id === project.id) ||
                                {};

                            // Combine case study data with extra metadata
                            return {
                                ...projectMeta,
                                ...project,
                            };
                        }),
                    );

                    // ─── LOAD STANDALONE PROJECTS ───
                    // Find projects that aren't case studies (have their own data.json)
                    const standaloneEntries = projectsList.filter((p) =>
                        isStandaloneProject(p.id),
                    );

                    // Fetch data.json for each standalone project
                    const standaloneCards = await Promise.all(
                        standaloneEntries.map(async (entry) => {
                            try {
                                // Try to fetch this project's data file
                                const res = await fetch(
                                    `/projects/${entry.id}/data.json`,
                                );
                                // If file doesn't exist, skip it
                                if (!res.ok) return null;
                                const data = await res.json();
                                // Merge with project list metadata
                                return {
                                    ...entry,
                                    ...data,
                                };
                            } catch {
                                // If fetch fails, skip this project
                                return null;
                            }
                        }),
                    );

                    // ─── COMBINE & DISPLAY ───
                    // Merge case studies + standalone projects (filter out nulls)
                    setProjects([
                        ...caseStudyCards,
                        ...standaloneCards.filter(Boolean),
                    ]);
                    setLoading(false);
                })
                .catch((error) => {
                    // If projects.json fetch fails, fall back to just case studies
                    console.error("Error loading projects.json:", error);
                    const projectsWithData = caseStudyProjects.map(
                        (project, index) => ({
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
    }, []); // Empty dependency = run once on mount

    return (
        <div className="projects-page">
            <main className="projects-main">
                {/* ─── HERO SECTION ─── title + count */}
                <motion.section
                    className="projects-hero"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="projects-title">Selected Work</h1>
                    {/* Show count of projects (single vs plural) */}
                    <p className="projects-subtitle">
                        {projects.length}{" "}
                        {projects.length === 1 ? "project" : "projects"}
                    </p>
                </motion.section>

                {/* ─── LOADING STATE ─── show spinner while data loads */}
                {loading ? (
                    <div className="projects-loading">
                        <motion.div
                            className="loading-spinner"
                            // Rotate infinitely
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        />
                    </div>
                ) : (
                    // ─── PROJECTS GRID ─── render all projects
                    <section className="projects-grid">
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                className="project-card"
                                // Fade in cards one by one as they render
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.08 * index, // Stagger by index
                                    ease: [0.4, 0, 0.2, 1], // Smooth easing
                                }}
                                // Track which project is hovered (optional de-emphasis)
                                onMouseEnter={() => setHoveredProject(project)}
                                onMouseLeave={() => setHoveredProject(null)}
                            >
                                <Link
                                    to={getProjectPath(project.id)}
                                    className="project-card-link"
                                >
                                    {/* ─── CARD HEADER ─── title + subtitle */}
                                    <div className="project-card-header">
                                        <h3 className="project-card-title">
                                            {project.title}
                                        </h3>
                                        {/* Subtitle or tagline, whichever exists */}
                                        {(project.subtitle ||
                                            project.tagline) && (
                                            <p className="project-card-subtitle">
                                                {project.subtitle ||
                                                    project.tagline}
                                            </p>
                                        )}
                                    </div>

                                    {/* ─── CARD METADATA ─── category + year */}
                                    <div className="project-card-meta">
                                        {project.category && (
                                            <>
                                                <span className="project-meta-item">
                                                    {project.category}
                                                </span>
                                                {/* Separator dot */}
                                                <span className="project-meta-dot">
                                                    ·
                                                </span>
                                            </>
                                        )}
                                        {project.year && (
                                            <span className="project-meta-item">
                                                {project.year}
                                            </span>
                                        )}
                                    </div>

                                    {/* ─── HIGHLIGHT LAYER ─── optional visual effect on hover */}
                                    {hoveredProject?.id === project.id && (
                                        <motion.div
                                            className="project-card-highlight"
                                            layoutId="project-highlight"
                                            // Fade in/out smoothly
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 30,
                                            }}
                                        />
                                    )}
                                </Link>
                            </motion.div>
                        ))}
                    </section>
                )}
            </main>
        </div>
    );
}
