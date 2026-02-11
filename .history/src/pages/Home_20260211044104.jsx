import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMode } from "../context/ModeContext";
import {
    getAllProjects,
    isStandaloneProject,
} from "../utils/projectDataMapper";
import ProjectCard from "../components/ProjectCard";
import PreviewPanel from "../components/PreviewPanel";
import ModeSwitcher from "../components/ModeSwitcher";
import SkillsSection from "../components/SkillsSection";
import EducationSection from "../components/EducationSection";
import "./Home.css";
import "./Home-work-mode.css";
import "../components/SectionLayout.css";
import "../components/ProjectCard-work-mode.css";
import "../components/PreviewPanel-work-mode.css";
import "../components/SkillsSection-work-mode.css";
import "../components/EducationSection-work-mode.css";

const Home = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredProject, setHoveredProject] = useState(null);
    const { mode } = useMode();

    // Assign hover patterns to projects
    const hoverPatterns = ["pattern-a", "pattern-b", "pattern-c", "pattern-d"];

    // System metadata for Work Mode
    const projectMetadata = {
        inklink: { status: "shipped", role: "ui/ux", symbol: "<InkLink />" },
        prolog: {
            status: "research",
            role: "design/development",
            symbol: "[ProLog_v2]",
        },
        sidequest: {
            status: "in-progress",
            role: "ux/ui",
            symbol: "{SideQuest}",
        },
        "fizzu-soda": {
            status: "prototype",
            role: "ui/ux",
            symbol: "<FIZZU />",
        },
    };

    useEffect(() => {
        try {
            // Load case-study projects from centralized JSON
            const caseStudyProjects = getAllProjects();

            // Load projects.json for folder paths, thumbnails, and standalone entries
            fetch("/projects.json")
                .then((res) => res.json())
                .then(async (projectsList) => {
                    // Build case-study cards by merging with projects.json metadata
                    const caseStudyCards = caseStudyProjects.map(
                        (caseStudyProject, index) => {
                            const projectMeta =
                                projectsList.find(
                                    (p) => p.id === caseStudyProject.id,
                                ) || {};

                            return {
                                ...projectMeta,
                                ...caseStudyProject,
                                hoverPattern:
                                    hoverPatterns[index % hoverPatterns.length],
                                systemMetadata: projectMetadata[
                                    caseStudyProject.id
                                ] || {
                                    status: "active",
                                    role: "ui/ux",
                                    symbol: `<${caseStudyProject.title} />`,
                                },
                                hoverImages: [
                                    ...(caseStudyProject.solution?.images?.slice(
                                        1,
                                        3,
                                    ) || []),
                                    ...(caseStudyProject.overview?.images?.slice(
                                        1,
                                        2,
                                    ) || []),
                                ].filter(Boolean),
                            };
                        },
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
                                    systemMetadata: projectMetadata[
                                        data.id || entry.id
                                    ] || {
                                        status: "active",
                                        role: "design",
                                        symbol: `<${data.title || entry.title} />`,
                                    },
                                    hoverImages: [
                                        ...(data.overview?.images || []),
                                        ...(data.solution?.images || []),
                                    ]
                                        .slice(0, 3)
                                        .filter(Boolean),
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
                            systemMetadata: projectMetadata[
                                caseStudyProject.id
                            ] || {
                                status: "active",
                                role: "ui/ux",
                                symbol: `<${caseStudyProject.title} />`,
                            },
                            hoverImages: [
                                ...(caseStudyProject.solution?.images?.slice(
                                    1,
                                    3,
                                ) || []),
                                ...(caseStudyProject.overview?.images?.slice(
                                    1,
                                    2,
                                ) || []),
                            ].filter(Boolean),
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
            <ModeSwitcher />
            <main className="home-main">
                <div className="container">
                    {/* Hero Section with Integrated CTAs */}
                    <motion.section
                        className="home-hero"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    >
                        {/* Default Hero Content (Clean/Chaos modes) — two-column */}
                        <div className="hero-content hero-content-default">
                            {/* Left column: Name + descriptor */}
                            <div className="hero-left">
                                <motion.h1
                                    className="home-hero-title"
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                                >
                                    Leana Le
                                </motion.h1>
                                <motion.p
                                    className="home-hero-subtitle"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.55, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
                                >
                                    UI/UX Designer & Developer creating thoughtful
                                    user experiences through research-driven design
                                    and clean code.
                                </motion.p>
                            </div>

                            {/* Right column: Availability + CTA + inline links */}
                            <div className="hero-right">
                                <motion.span
                                    className="hero-availability"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.4, delay: 0.15 }}
                                >
                                    Available for Work
                                </motion.span>

                                <motion.a
                                    href="mailto:leanale003@gmail.com"
                                    className="hero-primary-cta"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.45, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                                >
                                    Let's Build Something&nbsp;&nbsp;→
                                </motion.a>

                                <nav className="hero-inline-links" aria-label="Connect">
                                    {[
                                        { label: "Email", href: "mailto:leanale003@gmail.com" },
                                        { label: "LinkedIn", href: "https://linkedin.com/in/leanale", external: true },
                                        { label: "GitHub", href: "https://github.com/chuot-the-rat", external: true },
                                        { label: "Resume", href: "/Le_Leana_Resume_NoNumber.pdf", download: true },
                                    ].map((link, i) => (
                                        <motion.a
                                            key={link.label}
                                            href={link.href}
                                            className="hero-inline-link"
                                            target={link.external ? "_blank" : undefined}
                                            rel={link.external ? "noopener noreferrer" : undefined}
                                            download={link.download ? "Leana_Le_Resume.pdf" : undefined}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.35, delay: 0.3 + i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                                        >
                                            {link.label}
                                        </motion.a>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Terminal Hero Content (Work mode only) */}
                        <div className="hero-content hero-content-terminal">
                            <motion.div
                                className="terminal-line"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.15, delay: 0 }}
                            >
                                <span className="terminal-prompt">&gt;</span>
                                <span className="terminal-text">
                                    {" "}
                                    leana_le — portfolio
                                </span>
                            </motion.div>

                            <motion.div
                                className="terminal-line"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.15, delay: 0.08 }}
                            >
                                <span className="terminal-label">status:</span>
                                <span className="terminal-value"> active</span>
                            </motion.div>

                            <motion.div
                                className="terminal-line"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.15, delay: 0.16 }}
                            >
                                <span className="terminal-label">mode:</span>
                                <span className="terminal-value"> work</span>
                            </motion.div>

                            <motion.div
                                className="terminal-line"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.15, delay: 0.24 }}
                            >
                                <span className="terminal-label">stack:</span>
                                <span className="terminal-value">
                                    {" "}
                                    ui / ux / motion / front-end
                                </span>
                            </motion.div>

                            <motion.div
                                className="terminal-line"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.15, delay: 0.32 }}
                            >
                                <span className="terminal-label">
                                    location:
                                </span>
                                <span className="terminal-value">
                                    {" "}
                                    vancouver_ca
                                </span>
                            </motion.div>

                            {/* Blinking cursor */}
                            <motion.span
                                className="terminal-cursor"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{
                                    duration: 1.2,
                                    repeat: Infinity,
                                    delay: 0.4,
                                    ease: "linear",
                                }}
                            >
                                _
                            </motion.span>
                        </div>

                        {/* Default CTAs */}
                        <motion.div
                            className="hero-ctas hero-ctas-default"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.2,
                                ease: [0.4, 0, 0.2, 1],
                            }}
                        >
                            <a
                                href="mailto:leanale003@gmail.com"
                                className="hero-cta-link primary"
                            >
                                <span>Contact</span>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                >
                                    <path
                                        d="M6 12l4-4-4-4"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </a>
                            <a
                                href="/Le_Leana_Resume_NoNumber.pdf"
                                download="Leana_Le_Resume.pdf"
                                className="hero-cta-link secondary"
                            >
                                <span>Download Resume</span>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                >
                                    <path
                                        d="M8 2v10M12 8l-4 4-4-4"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </a>
                        </motion.div>

                        {/* Terminal CTAs (Work mode only) */}
                        <motion.div
                            className="hero-ctas hero-ctas-terminal"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.15, delay: 0.4 }}
                        >
                            <a
                                href="mailto:leanale003@gmail.com"
                                className="terminal-cta-link"
                            >
                                [contact]
                            </a>
                            <a
                                href="/Le_Leana_Resume_NoNumber.pdf"
                                download="Leana_Le_Resume.pdf"
                                className="terminal-cta-link"
                            >
                                [resume]
                            </a>
                            <span className="terminal-separator">::</span>
                            <a
                                href="#projects"
                                className="terminal-cta-link"
                            >
                                [projects_index]
                            </a>
                        </motion.div>
                    </motion.section>

                    {/* Projects Grid */}
                    <section
                        className="home-projects"
                        id="projects"
                    >
                        {/* Default Projects Header (Clean/Chaos modes) */}
                        <motion.div
                            className="home-projects-header home-projects-header-default"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h2 className="home-section-title">
                                Selected Work
                            </h2>
                            <p className="home-section-subtitle">
                                {projects.length}{" "}
                                {projects.length === 1 ? "project" : "projects"}
                            </p>
                        </motion.div>

                        {/* Terminal Projects Header (Work mode only) */}
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
                                {/* Default Project Cards (Clean/Chaos modes) */}
                                <div className="projects-list projects-list-default">
                                    {projects.map((project, index) => (
                                        <motion.div
                                            key={project.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.6,
                                                delay: 0.1 * index,
                                                ease: [0.4, 0, 0.2, 1],
                                            }}
                                        >
                                            <ProjectCard
                                                project={project}
                                                onHover={() =>
                                                    setHoveredProject(project)
                                                }
                                                onLeave={() =>
                                                    setHoveredProject(null)
                                                }
                                                isHovered={
                                                    hoveredProject?.id ===
                                                    project.id
                                                }
                                                isOtherHovered={
                                                    hoveredProject !== null &&
                                                    hoveredProject?.id !==
                                                        project.id
                                                }
                                                hoverPattern={
                                                    project.hoverPattern
                                                }
                                            />
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Terminal Project List (Work mode only) */}
                                <div className="projects-list projects-list-terminal">
                                    {projects.map((project, index) => (
                                        <motion.div
                                            key={project.id}
                                            className="terminal-project-entry"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{
                                                duration: 0.15,
                                                delay: 0.08 * index,
                                            }}
                                            onMouseEnter={() =>
                                                setHoveredProject(project)
                                            }
                                            onMouseLeave={() =>
                                                setHoveredProject(null)
                                            }
                                        >
                                            <Link
                                                to={`/projects/${project.id}`}
                                                className="terminal-project-link"
                                            >
                                                {/* Project number */}
                                                <motion.span
                                                    className="terminal-project-number"
                                                    animate={{
                                                        opacity:
                                                            hoveredProject?.id ===
                                                            project.id
                                                                ? 0.65
                                                                : 0.5,
                                                    }}
                                                    transition={{
                                                        duration: 0.16,
                                                    }}
                                                >
                                                    [
                                                    {String(index + 1).padStart(
                                                        2,
                                                        "0",
                                                    )}
                                                    ]
                                                </motion.span>

                                                {/* Project title with symbol */}
                                                <motion.span
                                                    className="terminal-project-title"
                                                    animate={{
                                                        x:
                                                            hoveredProject?.id ===
                                                            project.id
                                                                ? 4
                                                                : 0,
                                                        opacity:
                                                            hoveredProject?.id ===
                                                            project.id
                                                                ? 1
                                                                : 0.85,
                                                    }}
                                                    transition={{
                                                        duration: 0.16,
                                                        ease: [
                                                            0.2, 0.8, 0.2, 1,
                                                        ],
                                                    }}
                                                >
                                                    {project.systemMetadata
                                                        ?.symbol ||
                                                        project.title}
                                                </motion.span>

                                                {/* System status label */}
                                                <motion.span
                                                    className="terminal-project-status"
                                                    initial={{ opacity: 0 }}
                                                    animate={{
                                                        opacity:
                                                            hoveredProject?.id ===
                                                            project.id
                                                                ? 0.6
                                                                : 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.16,
                                                    }}
                                                >
                                                    [status:{" "}
                                                    {project.systemMetadata
                                                        ?.status || "active"}
                                                    ]
                                                </motion.span>

                                                {/* Hover state indicator */}
                                                <motion.span
                                                    className="terminal-project-indicator"
                                                    animate={{
                                                        opacity:
                                                            hoveredProject?.id ===
                                                            project.id
                                                                ? 0.5
                                                                : 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.16,
                                                    }}
                                                >
                                                    {project.hoverPattern ===
                                                        "pattern-a" &&
                                                        "[preview_loaded]"}
                                                    {project.hoverPattern ===
                                                        "pattern-b" &&
                                                        "[media_active]"}
                                                    {project.hoverPattern ===
                                                        "pattern-c" &&
                                                        "[hover_ready]"}
                                                    {project.hoverPattern ===
                                                        "pattern-d" &&
                                                        "[video_ready]"}
                                                </motion.span>

                                                {/* Cursor indicator */}
                                                {hoveredProject?.id ===
                                                    project.id && (
                                                    <motion.span
                                                        className="terminal-project-cursor"
                                                        initial={{ opacity: 0 }}
                                                        animate={{
                                                            opacity: [0, 1, 0],
                                                        }}
                                                        transition={{
                                                            duration: 1,
                                                            repeat: Infinity,
                                                            ease: "linear",
                                                        }}
                                                    >
                                                        _
                                                    </motion.span>
                                                )}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Absolute Positioned Preview Area - Side-Reveal System */}
                                <div className="preview-area-absolute">
                                    <AnimatePresence mode="wait">
                                        {hoveredProject && (
                                            <PreviewPanel
                                                key={hoveredProject.id}
                                                project={hoveredProject}
                                                hoverPattern={
                                                    hoveredProject.hoverPattern
                                                }
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Skills Section */}
                    <SkillsSection variant="grid" />

                    {/* Education Section */}
                    <EducationSection variant="timeline" />

                    {/* Contact Section */}
                    <ContactSection
                        variant="full"
                        showForm={false}
                    />
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
