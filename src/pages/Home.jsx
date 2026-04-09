import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { usePageTitle } from "../hooks/usePageTitle";
import { Link } from "react-router-dom";
import {
    getAllProjects,
    isStandaloneProject,
} from "../utils/projectDataMapper";
import HeroContainer from "../components/header/HeroContainer";
import HomeWorkList from "../components/home/HomeWorkList";
import MarqueeTicker from "../components/MarqueeTicker";
import PassbookPrintCard from "../components/passbook/PassbookPrintCard";
import { homeHeroConfig } from "../data/header/headerConfig";
import "./Home.css";
import "../components/SectionLayout.css";

const hoverPatterns = ["pattern-a", "pattern-b", "pattern-c", "pattern-d"];
const HOME_SCHEMA = [
    {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Leana Le",
        url: "https://leanale.com/",
        image: "https://leanale.com/starfruit.png",
        jobTitle: "Product Designer",
        sameAs: [
            "https://linkedin.com/in/leanale",
            "https://github.com/chuot-the-rat",
        ],
        address: {
            "@type": "PostalAddress",
            addressLocality: "Vancouver",
            addressRegion: "BC",
            addressCountry: "CA",
        },
    },
    {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Selected Portfolio Projects",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                url: "https://leanale.com/case-studies/inklink",
                name: "InkLink",
            },
            {
                "@type": "ListItem",
                position: 2,
                url: "https://leanale.com/case-studies/prolog",
                name: "ProLog",
            },
            {
                "@type": "ListItem",
                position: 3,
                url: "https://leanale.com/case-studies/sidequest",
                name: "SideQuest",
            },
        ],
    },
];
const proofItems = [
    { label: "Target Role", value: "Product Designer (UX/UI)" },
    { label: "Location", value: "Vancouver, BC (PST)" },
    { label: "Availability", value: "Open to full-time + contract" },
    { label: "Graduation", value: "BCIT D3 • 2026" },
    { label: "Strengths", value: "Research, IA, Prototyping, Frontend" },
];

const Home = () => {
    usePageTitle(null, {
        description:
            "Product designer and frontend builder in Vancouver. UX case studies with clear role ownership, impact snapshots, and shipped interactions.",
        path: "/",
        structuredData: HOME_SCHEMA,
    });
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEnhancements, setShowEnhancements] = useState(false);

    const resolveProjectMediaPath = (projectId, src) => {
        if (!src) return null;
        if (src.startsWith("/") || src.startsWith("http")) return src;
        return `/projects/${projectId}/${src.replace(/^\.?\//, "")}`;
    };

    const buildTaxonomyTags = (project, fallbackKind) => {
        const sourceTags = Array.isArray(project.tags) ? project.tags : [];
        const normalizedSourceTags = sourceTags
            .map((tag) => String(tag).trim())
            .filter(Boolean);

        const candidates = [
            ...normalizedSourceTags,
            fallbackKind,
            project.category,
            project.year,
        ];

        const unique = [];
        for (const tag of candidates) {
            if (!tag) continue;
            if (unique.includes(tag)) continue;
            unique.push(tag);
            if (unique.length === 3) break;
        }
        return unique;
    };

    useEffect(() => {
        let timeoutId = null;
        const raf = requestAnimationFrame(() => {
            timeoutId = setTimeout(() => setShowEnhancements(true), 220);
        });
        return () => {
            cancelAnimationFrame(raf);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);

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
                                let coverImage = null;
                                try {
                                    const supRes = await fetch(
                                        `/projects/${caseStudyProject.id}/data.json`,
                                    );
                                    if (supRes.ok) {
                                        const supData = await supRes.json();
                                        realImages = collectAllImages(supData);
                                        // Prefer a finished-looking cover: hifi > solution > overview
                                        coverImage =
                                            supData?.hifi?.images?.[0]?.src ??
                                            supData?.solution?.images?.[0]?.src ??
                                            supData?.overview?.images?.[0]?.src ??
                                            null;
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
                                    coverImage,
                                    taxonomyTags: buildTaxonomyTags(
                                        { ...projectMeta, ...caseStudyProject },
                                        "Case Study",
                                    ),
                                    previewVideoSrc: resolveProjectMediaPath(
                                        caseStudyProject.id,
                                        projectMeta.previewVideo ??
                                            projectMeta.previewVideoSrc ??
                                            null,
                                    ),
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
                                    coverImage:
                                        data?.hifi?.images?.[0]?.src ??
                                        data?.solution?.images?.[0]?.src ??
                                        data?.overview?.images?.[0]?.src ??
                                        null,
                                    taxonomyTags: buildTaxonomyTags(
                                        { ...entry, ...data },
                                        "Design Project",
                                    ),
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
                            taxonomyTags: buildTaxonomyTags(
                                caseStudyProject,
                                "Case Study",
                            ),
                            previewVideoSrc: null,
                        }),
                    );
                    setProjects(projectsWithData);
                    setLoading(false);
                });
        } catch (error) {
            console.error("Error loading case studies:", error);
            queueMicrotask(() => setLoading(false));
        }
    }, []);

    return (
        <div className="home">
            <main className="home-main">
                <div className="container">
                    {/* Hero Section — new modular system
                        To revert: replace <HeroContainer> with <HeroSection /> */}
                    <HeroContainer
                        config={homeHeroConfig}
                        className="home-hero-grid"
                    />

                    <section className="home-proof-strip" aria-label="Recruiter quick facts">
                        <ul className="home-proof-list">
                            {proofItems.map((item) => (
                                <li key={item.label} className="home-proof-item">
                                    <span className="home-proof-label">{item.label}</span>
                                    <span className="home-proof-value">{item.value}</span>
                                </li>
                            ))}
                        </ul>
                        <a
                            href="mailto:leanale003@gmail.com?subject=Product%20Design%20Role%20at%20%5BCompany%5D"
                            className="home-proof-cta"
                        >
                            Email role details ↗
                        </a>
                    </section>

                    {showEnhancements ? (
                        <>
                            {/* Passbook print card — issued once, persists on home */}
                            <PassbookPrintCard />

                            {/* Marquee ticker — editorial skill belt */}
                            <MarqueeTicker />
                        </>
                    ) : null}

                    {/* Work list — category tabs + Sharleen-style rows */}
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
                        <HomeWorkList projects={projects} />
                    )}

                </div>
            </main>

            {/* Footer */}
            <footer className="home-footer">
                <div className="container">
                    <div className="footer-body">
                        {/* Editorial large heading */}
                        <div className="footer-hero">
                            <p className="footer-kicker">Available for work</p>
                            <h2 className="footer-display">
                                Let's build<br />something.
                            </h2>
                        </div>

                        {/* Links column */}
                        <nav className="footer-nav" aria-label="Footer links">
                            <a href="mailto:leanale003@gmail.com" className="footer-nav-link">
                                <span className="footer-nav-label">Email</span>
                                <span className="footer-nav-arrow">↗</span>
                            </a>
                            <a
                                href="https://linkedin.com/in/leanale"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-nav-link"
                            >
                                <span className="footer-nav-label">LinkedIn</span>
                                <span className="footer-nav-arrow">↗</span>
                            </a>
                            <a
                                href="https://github.com/chuot-the-rat"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-nav-link"
                            >
                                <span className="footer-nav-label">GitHub</span>
                                <span className="footer-nav-arrow">↗</span>
                            </a>
                            <Link to="/about#resume" className="footer-nav-link">
                                <span className="footer-nav-label">Resume</span>
                                <span className="footer-nav-arrow">→</span>
                            </Link>
                        </nav>
                    </div>

                    <div className="footer-bottom">
                        <p className="footer-copyright">
                            © {new Date().getFullYear()} Leana Le
                        </p>
                        <p className="footer-tagline">
                            Designed & developed with care · Vancouver, BC
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
