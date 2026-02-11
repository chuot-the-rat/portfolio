import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useMode } from "../context/ModeContext";
import {
    getAllProjects,
    getProjectPath,
    isStandaloneProject,
} from "../utils/projectDataMapper";
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

/* ══════════════════════════════════════════════════════════════════
   HERO SECTION — System Activated + Magnetic Field
   Type-in intro · Magnetic cursor · CTA text mutation
   ══════════════════════════════════════════════════════════════════ */

const HERO_NAME = "Leana Le";
const CTA_DEFAULT = "Let's Build Something  \u2192";
const CTA_MUTATED = "> initiating_collaboration()";
const INLINE_LINKS = [
    { label: "Email", href: "mailto:leanale003@gmail.com" },
    {
        label: "LinkedIn",
        href: "https://linkedin.com/in/leanale",
        external: true,
    },
    {
        label: "GitHub",
        href: "https://github.com/chuot-the-rat",
        external: true,
    },
    { label: "Resume", href: "/Le_Leana_Resume_NoNumber.pdf", download: true },
];

function HeroSection() {
    const heroRef = useRef(null);
    const nameRef = useRef(null);
    const ctaRef = useRef(null);
    const rafId = useRef(null);
    const mousePos = useRef({ x: 0.5, y: 0.5 });
    const smoothPos = useRef({ x: 0.5, y: 0.5 });
    const isInsideHero = useRef(false);

    const [introPhase, setIntroPhase] = useState(0);
    const [ctaText, setCtaText] = useState(CTA_DEFAULT);
    const ctaHoverTimer = useRef(null);
    const [magnetActive, setMagnetActive] = useState(false);

    const prefersReducedMotion = useRef(
        typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
    const isMobile = useRef(
        typeof window !== "undefined" && window.innerWidth < 768,
    );

    /* ── 1) TYPE-IN INTRO ── */
    const nameLetters = HERO_NAME.split("");
    const nameDuration = nameLetters.length * 45;

    useEffect(() => {
        if (prefersReducedMotion.current) {
            setIntroPhase(5);
            return;
        }
        const t = setTimeout(() => setIntroPhase(1), 100);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (introPhase !== 1) return;
        const t = setTimeout(() => setIntroPhase(2), nameDuration + 80);
        return () => clearTimeout(t);
    }, [introPhase, nameDuration]);

    useEffect(() => {
        if (introPhase !== 2) return;
        const t = setTimeout(() => setIntroPhase(3), 450);
        return () => clearTimeout(t);
    }, [introPhase]);

    useEffect(() => {
        if (introPhase !== 3) return;
        const t = setTimeout(() => setIntroPhase(4), 350);
        return () => clearTimeout(t);
    }, [introPhase]);

    useEffect(() => {
        if (introPhase !== 4) return;
        const t = setTimeout(
            () => setIntroPhase(5),
            INLINE_LINKS.length * 100 + 200,
        );
        return () => clearTimeout(t);
    }, [introPhase]);

    /* ── 2) MAGNETIC CURSOR ── */
    const lerp = (a, b, t) => a + (b - a) * t;

    const startMagneticLoop = useCallback(() => {
        if (rafId.current) return;
        const tick = () => {
            smoothPos.current = {
                x: lerp(smoothPos.current.x, mousePos.current.x, 0.08),
                y: lerp(smoothPos.current.y, mousePos.current.y, 0.08),
            };
            const dx = (smoothPos.current.x - 0.5) * 2;
            const dy = (smoothPos.current.y - 0.5) * 2;

            if (nameRef.current) {
                nameRef.current.style.transform = `translate(${dx * 6}px, ${dy * 3}px)`;
            }
            if (ctaRef.current) {
                ctaRef.current.style.transform = `translate(${dx * -10}px, ${dy * -5}px)`;
            }

            if (
                isInsideHero.current ||
                Math.abs(smoothPos.current.x - 0.5) > 0.005
            ) {
                rafId.current = requestAnimationFrame(tick);
            } else {
                if (nameRef.current) nameRef.current.style.transform = "";
                if (ctaRef.current) ctaRef.current.style.transform = "";
                rafId.current = null;
            }
        };
        rafId.current = requestAnimationFrame(tick);
    }, []);

    const handleMouseMove = useCallback(
        (e) => {
            if (isMobile.current || prefersReducedMotion.current) return;
            const rect = heroRef.current?.getBoundingClientRect();
            if (!rect) return;
            mousePos.current = {
                x: (e.clientX - rect.left) / rect.width,
                y: (e.clientY - rect.top) / rect.height,
            };
            if (!isInsideHero.current) {
                isInsideHero.current = true;
                setMagnetActive(true);
                startMagneticLoop();
            }
        },
        [startMagneticLoop],
    );

    const handleMouseLeave = useCallback(() => {
        isInsideHero.current = false;
        setMagnetActive(false);
        mousePos.current = { x: 0.5, y: 0.5 };
    }, []);

    useEffect(() => {
        return () => {
            if (rafId.current) cancelAnimationFrame(rafId.current);
            if (ctaHoverTimer.current) clearTimeout(ctaHoverTimer.current);
        };
    }, []);

    /* ── 3) CTA HOVER TEXT MUTATION ── */
    const handleCtaEnter = useCallback(() => {
        if (prefersReducedMotion.current) return;
        if (ctaHoverTimer.current) clearTimeout(ctaHoverTimer.current);
        setCtaText(CTA_MUTATED);
        ctaHoverTimer.current = setTimeout(() => setCtaText(CTA_DEFAULT), 400);
    }, []);

    const handleCtaLeave = useCallback(() => {
        if (ctaHoverTimer.current) clearTimeout(ctaHoverTimer.current);
        setCtaText(CTA_DEFAULT);
    }, []);

    const showName = introPhase >= 1 || prefersReducedMotion.current;
    const showSubtitle = introPhase >= 1;
    const showLabel = introPhase >= 2;
    const showCta = introPhase >= 3;
    const showLinks = introPhase >= 4;

    return (
        <section
            ref={heroRef}
            className={`home-hero${magnetActive ? " magnetic-active" : ""}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Default Hero Content (Clean/Chaos modes) */}
            <div className="hero-content hero-content-default">
                <div className="hero-left">
                    <h1
                        className="home-hero-title"
                        ref={nameRef}
                    >
                        {nameLetters.map((ch, i) => (
                            <motion.span
                                key={i}
                                className="hero-letter"
                                initial={
                                    prefersReducedMotion.current
                                        ? {}
                                        : { opacity: 0, y: 8 }
                                }
                                animate={showName ? { opacity: 1, y: 0 } : {}}
                                transition={{
                                    duration: 0.3,
                                    delay: i * 0.045,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                            >
                                {ch === " " ? "\u00A0" : ch}
                            </motion.span>
                        ))}
                    </h1>

                    <motion.p
                        className="home-hero-subtitle"
                        initial={
                            prefersReducedMotion.current
                                ? {}
                                : { opacity: 0, y: 10 }
                        }
                        animate={showSubtitle ? { opacity: 1, y: 0 } : {}}
                        transition={{
                            duration: 0.5,
                            delay: nameDuration / 1000 + 0.05,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                    >
                        UI/UX Designer &amp; Developer creating thoughtful user
                        experiences through research-driven design and clean
                        code.
                    </motion.p>
                </div>

                <div className="hero-right">
                    <motion.span
                        className="hero-system-label"
                        initial={
                            prefersReducedMotion.current ? {} : { opacity: 0 }
                        }
                        animate={showLabel ? { opacity: 0.6 } : {}}
                        transition={{ duration: 0.3 }}
                    >
                        [ SYSTEM: PROFILE_INITIALIZED ]
                    </motion.span>

                    <motion.a
                        ref={ctaRef}
                        href="mailto:leanale003@gmail.com"
                        className="hero-primary-cta"
                        initial={
                            prefersReducedMotion.current
                                ? {}
                                : { opacity: 0, scale: 0.98 }
                        }
                        animate={showCta ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                        onMouseEnter={handleCtaEnter}
                        onMouseLeave={handleCtaLeave}
                    >
                        <span className="cta-text">{ctaText}</span>
                    </motion.a>

                    <nav
                        className="hero-inline-links"
                        aria-label="Connect"
                    >
                        {INLINE_LINKS.map((link, i) => (
                            <motion.a
                                key={link.label}
                                href={link.href}
                                className="hero-inline-link"
                                target={link.external ? "_blank" : undefined}
                                rel={
                                    link.external
                                        ? "noopener noreferrer"
                                        : undefined
                                }
                                download={
                                    link.download
                                        ? "Leana_Le_Resume.pdf"
                                        : undefined
                                }
                                initial={
                                    prefersReducedMotion.current
                                        ? {}
                                        : { opacity: 0, y: 6 }
                                }
                                animate={showLinks ? { opacity: 1, y: 0 } : {}}
                                transition={{
                                    duration: 0.3,
                                    delay: i * 0.1,
                                    ease: [0.4, 0, 0.2, 1],
                                }}
                            >
                                {link.label}
                            </motion.a>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Terminal Hero (Work mode only) */}
            <div className="hero-content hero-content-terminal">
                <motion.div
                    className="terminal-line"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                >
                    <span className="terminal-prompt">&gt;</span>
                    <span className="terminal-text"> leana_le — portfolio</span>
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
                    <span className="terminal-label">location:</span>
                    <span className="terminal-value"> vancouver_ca</span>
                </motion.div>
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
        </section>
    );
}

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
                    {/* Hero Section — System Activated + Magnetic Field */}
                    <HeroSection />

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
                                                    onMouseEnter={() =>
                                                        setHoveredProject(
                                                            project,
                                                        )
                                                    }
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

                                    {/* Right pane — preview stage */}
                                    <div className="projects-preview">
                                        <div className="projects-preview-inner">
                                            <AnimatePresence mode="wait">
                                                {hoveredProject ? (
                                                    <PreviewPanel
                                                        key={hoveredProject.id}
                                                        project={
                                                            hoveredProject
                                                        }
                                                        hoverPattern={
                                                            hoveredProject.hoverPattern
                                                        }
                                                    />
                                                ) : (
                                                    <motion.div
                                                        className="preview-placeholder"
                                                        initial={{
                                                            opacity: 0,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                        }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{
                                                            duration: 0.2,
                                                        }}
                                                    >
                                                        <span className="preview-placeholder-icon">
                                                            ◇
                                                        </span>
                                                        <span className="preview-placeholder-text">
                                                            Hover a project to
                                                            preview
                                                        </span>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
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
