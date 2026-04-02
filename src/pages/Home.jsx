import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    getAllProjects,
    getProjectPath,
    isStandaloneProject,
} from "../utils/projectDataMapper";
import PreviewPanel from "../components/PreviewPanel";
import SkillsSection from "../components/SkillsSection";
import EducationSection from "../components/EducationSection";
import HeroContainer from "../components/header/HeroContainer";
import { homeHeroConfig } from "../data/header/headerConfig";
import "./Home.css";
import "../components/SectionLayout.css";

const Home = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredProject, setHoveredProject] = useState(null);

    // Assign hover patterns to projects
    const hoverPatterns = ["pattern-a", "pattern-b", "pattern-c", "pattern-d"];

    useEffect(() => {
        try {
            // Load case-study projects from centralized JSON
            const caseStudyProjects = getAllProjects();

            // Load projects.json for folder paths, thumbnails, and standalone entries
            fetch("/projects.json")
                .then((res) => res.json())
                .then(async (projectsList) => {
                    // Helper: collect all images from a project's data.json
                    const collectAllImages = (data) => {
                        const imgs = [];
                        const sections = [
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
                        for (const key of sections) {
                            const sec = data[key];
                            if (!sec) continue;
                            if (Array.isArray(sec.images)) {
                                sec.images.forEach((img) => imgs.push(img));
                            }
                            // hifi screens with individual images
                            if (Array.isArray(sec.screens)) {
                                sec.screens.forEach((s) => {
                                    if (s.image)
                                        imgs.push({
                                            src: s.image,
                                            alt: s.name,
                                        });
                                });
                            }
                        }
                        return imgs.filter((img) => img && img.src);
                    };

                    // Shuffle helper
                    const shuffle = (arr) => {
                        const a = [...arr];
                        for (let i = a.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [a[i], a[j]] = [a[j], a[i]];
                        }
                        return a;
                    };

                    // Build case-study cards by merging with projects.json metadata
                    // Also fetch supplemental data.json for real images
                    const caseStudyCards = await Promise.all(
                        caseStudyProjects.map(
                            async (caseStudyProject, index) => {
                                const projectMeta =
                                    projectsList.find(
                                        (p) => p.id === caseStudyProject.id,
                                    ) || {};

                                // Fetch supplemental data.json for real image paths
                                let realImages = [];
                                try {
                                    const supRes = await fetch(
                                        `/projects/${caseStudyProject.id}/data.json`,
                                    );
                                    if (supRes.ok) {
                                        const supData = await supRes.json();
                                        realImages = collectAllImages(supData);
                                    }
                                } catch {
                                    // No supplemental data — use mapper data
                                }

                                // Fall back to mapper images if no supplemental data
                                if (realImages.length === 0) {
                                    realImages = [
                                        ...(caseStudyProject.solution?.images ||
                                            []),
                                        ...(caseStudyProject.overview?.images ||
                                            []),
                                    ].filter((img) => img && img.src);
                                }

                                return {
                                    ...projectMeta,
                                    ...caseStudyProject,
                                    hoverPattern:
                                        hoverPatterns[
                                            index % hoverPatterns.length
                                        ],
                                    allImages: realImages,
                                };
                            },
                        ),
                    );

                    // Build standalone project cards from their own data.json files
                    const standaloneEntries = projectsList.filter((p) =>
                        isStandaloneProject(p.id),
                    );

                    const standaloneCards = await Promise.all(
                        standaloneEntries.map(async (entry, i) => {
                            try {
                                const res = await fetch(
                                    `/projects/${entry.id}/data.json`,
                                );
                                if (!res.ok) return null;
                                const data = await res.json();
                                const idx = caseStudyCards.length + i;
                                return {
                                    ...entry,
                                    ...data,
                                    hoverPattern:
                                        hoverPatterns[
                                            idx % hoverPatterns.length
                                        ],
                                    allImages: [
                                        ...(data.overview?.images || []),
                                        ...(data.solution?.images || []),
                                        ...(data.styleGuide?.images || []),
                                    ].filter((img) => img && img.src),
                                };
                            } catch {
                                return null;
                            }
                        }),
                    );

                    setProjects([
                        ...caseStudyCards,
                        ...standaloneCards.filter(Boolean),
                    ]);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error loading projects.json:", error);
                    // Fall back to just case study data
                    const projectsWithData = caseStudyProjects.map(
                        (caseStudyProject, index) => ({
                            ...caseStudyProject,
                            hoverPattern:
                                hoverPatterns[index % hoverPatterns.length],
                            allImages: [
                                ...(caseStudyProject.solution?.images || []),
                                ...(caseStudyProject.overview?.images || []),
                            ].filter((img) => img && img.src),
                        }),
                    );
                    setProjects(projectsWithData);
                    setLoading(false);
                });
        } catch (error) {
            console.error("Error loading case studies:", error);
            setLoading(false);
        }
    }, []);

    return (
        <div className="home">
            <main className="home-main">
                <div className="container">
                    {/* Hero Section — new modular system
                        To revert: replace <HeroContainer> with <HeroSection /> */}
                    <HeroContainer config={homeHeroConfig} />

                    {/* Projects Grid */}
                    <section
                        className="home-projects"
                        id="projects"
                    >
                        {/* Projects Header */}
                        <motion.div
                            className="home-projects-header home-projects-header-terminal"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.15, delay: 0 }}
                        >
                            <span className="terminal-prompt">&gt;</span>
                            <span className="terminal-text">
                                {" "}
                                projects_index
                            </span>
                            <span className="terminal-count">
                                {" "}
                                [{projects.length} entries]
                            </span>
                        </motion.div>

                        {loading ? (
                            <div className="home-loading">
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
                            <div className="projects-container">
                                {/* Folder Explorer (Clean/Chaos modes) */}
                                <div className="projects-explorer projects-explorer-default">
                                    {/* Left pane — folder list */}
                                    <div className="projects-folders">
                                        {projects.map((project, index) => (
                                            <motion.div
                                                key={project.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: 0.08 * index,
                                                    ease: [0.4, 0, 0.2, 1],
                                                }}
                                            >
                                                <Link
                                                    to={getProjectPath(
                                                        project.id,
                                                    )}
                                                    className="folder-item-link"
                                                    onMouseEnter={() => {
                                                        // Re-shuffle images on each hover
                                                        const imgs =
                                                            project.allImages ||
                                                            [];
                                                        const shuffled = [
                                                            ...imgs,
                                                        ].sort(
                                                            () =>
                                                                Math.random() -
                                                                0.5,
                                                        );
                                                        const count = Math.min(
                                                            3 +
                                                                Math.floor(
                                                                    Math.random() *
                                                                        3,
                                                                ),
                                                            shuffled.length,
                                                        ); // 3-5
                                                        setHoveredProject({
                                                            ...project,
                                                            hoverImages:
                                                                shuffled.slice(
                                                                    0,
                                                                    count,
                                                                ),
                                                        });
                                                    }}
                                                    onMouseLeave={() =>
                                                        setHoveredProject(null)
                                                    }
                                                >
                                                    <motion.div
                                                        className={`folder-item${hoveredProject?.id === project.id ? " folder-active" : ""}${hoveredProject !== null && hoveredProject?.id !== project.id ? " folder-dimmed" : ""}`}
                                                        animate={{
                                                            y:
                                                                hoveredProject?.id ===
                                                                project.id
                                                                    ? -2
                                                                    : 0,
                                                        }}
                                                        transition={{
                                                            duration: 0.22,
                                                            ease: [
                                                                0.4, 0, 0.2, 1,
                                                            ],
                                                        }}
                                                    >
                                                        <div className="folder-tab">
                                                            <span className="folder-tab-label">
                                                                {project.title}
                                                            </span>
                                                        </div>
                                                        <div className="folder-body">
                                                            <div className="folder-meta">
                                                                <span className="folder-category">
                                                                    {
                                                                        project.category
                                                                    }
                                                                </span>
                                                                <span className="folder-dot">
                                                                    ·
                                                                </span>
                                                                <span className="folder-year">
                                                                    {
                                                                        project.year
                                                                    }
                                                                </span>
                                                                <span className="folder-index">
                                                                    {String(
                                                                        index +
                                                                            1,
                                                                    ).padStart(
                                                                        2,
                                                                        "0",
                                                                    )}{" "}
                                                                    /{" "}
                                                                    {String(
                                                                        projects.length,
                                                                    ).padStart(
                                                                        2,
                                                                        "0",
                                                                    )}
                                                                </span>
                                                            </div>
                                                            {(project.subtitle ||
                                                                project.tagline) && (
                                                                <p className="folder-description">
                                                                    {project.subtitle ||
                                                                        project.tagline}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Right pane — preview window */}
                                    <div className="projects-preview">
                                        <div className="preview-window">
                                            <div className="preview-window-bar">
                                                <span className="preview-window-dot" />
                                                <span className="preview-window-dot" />
                                                <span className="preview-window-dot" />
                                                <span className="preview-window-title">
                                                    {hoveredProject
                                                        ? hoveredProject.title
                                                        : "Preview"}
                                                </span>
                                            </div>
                                            <div className="preview-window-body">
                                                <AnimatePresence mode="wait">
                                                    {hoveredProject ? (
                                                        <motion.div
                                                            key={
                                                                hoveredProject.id
                                                            }
                                                            className="preview-window-content"
                                                            initial={{
                                                                opacity: 0,
                                                                y: 8,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                y: 0,
                                                            }}
                                                            exit={{
                                                                opacity: 0,
                                                                y: -6,
                                                            }}
                                                            transition={{
                                                                duration: 0.22,
                                                                ease: [
                                                                    0.4, 0, 0.2,
                                                                    1,
                                                                ],
                                                            }}
                                                        >
                                                            <PreviewPanel
                                                                project={
                                                                    hoveredProject
                                                                }
                                                                hoverPattern={
                                                                    hoveredProject.hoverPattern
                                                                }
                                                            />
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div
                                                            className="preview-empty"
                                                            initial={{
                                                                opacity: 0,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                            }}
                                                            exit={{
                                                                opacity: 0,
                                                            }}
                                                            transition={{
                                                                duration: 0.2,
                                                            }}
                                                        >
                                                            <div className="preview-empty-grid" />
                                                            <span className="preview-empty-text">
                                                                Hover a folder
                                                                to preview
                                                            </span>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Skills Section */}
                    <SkillsSection variant="grid" />

                    {/* Education Section */}
                    <EducationSection variant="timeline" />
                </div>
            </main>

            {/* Footer */}
            <footer className="home-footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-links">
                            <a
                                href="mailto:leanale003@gmail.com"
                                className="footer-link"
                            >
                                Email
                            </a>
                            <a
                                href="https://linkedin.com/in/leanale"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-link"
                            >
                                LinkedIn
                            </a>
                            <a
                                href="https://github.com/chuot-the-rat"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-link"
                            >
                                GitHub
                            </a>
                        </div>
                        <p className="footer-copyright">
                            © {new Date().getFullYear()} Leana Le
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
