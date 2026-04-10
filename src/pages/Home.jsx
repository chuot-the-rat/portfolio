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
import PassbookPrintCard from "../components/passbook/PassbookPrintCard";
import PassbookDock from "../components/passbook/PassbookDock";
import { usePassbook } from "../components/passbook/PassbookProvider";
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

const HOME_IMAGE_SECTIONS = [
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

const collectAllImages = (data) => {
    const imgs = [];
    for (const key of HOME_IMAGE_SECTIONS) {
        const sec = data?.[key];
        if (!sec) continue;
        if (Array.isArray(sec.images)) {
            sec.images.forEach((img) => imgs.push(img));
        }
        if (Array.isArray(sec.screens)) {
            sec.screens.forEach((screen) => {
                if (screen?.image) {
                    imgs.push({ src: screen.image, alt: screen.name });
                }
            });
        }
    }
    return imgs.filter((img) => img && img.src);
};

const toRecruiterSummary = (project) => {
    const raw = project?.subtitle || project?.tagline || "";
    const compact = String(raw).replace(/\s+/g, " ").trim();
    if (!compact) return "";
    if (compact.length <= 108) return compact;
    return `${compact.slice(0, 105).trimEnd()}…`;
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

const Home = () => {
    const { isParked } = usePassbook();
    usePageTitle(null, {
        description:
            "Product designer and frontend builder in Vancouver. UX case studies with clear role ownership, impact snapshots, and shipped interactions.",
        path: "/",
        structuredData: HOME_SCHEMA,
    });
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showParkReplay, setShowParkReplay] = useState(false);

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

    const buildTaxonomyTags = (project) => {
        const sourceTags = Array.isArray(project.tags) ? project.tags : [];
        const normalizedSourceTags = sourceTags
            .map((tag) => String(tag).trim())
            .filter(Boolean);

        const candidates = [...normalizedSourceTags, project.category];

        const unique = [];
        for (const tag of candidates) {
            if (!tag) continue;
            if (unique.includes(tag)) continue;
            unique.push(tag);
            if (unique.length === 2) break;
        }
        return unique;
    };

    useEffect(() => {
        const controller = new AbortController();
        let alive = true;

        const loadProjects = async () => {
            try {
                const caseStudyProjects = getAllProjects();
                const projectsList =
                    (await safeFetchJson("/projects.json", {
                        signal: controller.signal,
                    })) || [];

                const caseStudyCards = await Promise.all(
                    caseStudyProjects.map(async (caseStudyProject, index) => {
                        const projectMeta =
                            projectsList.find((p) => p.id === caseStudyProject.id) || {};

                        const supData = await safeFetchJson(
                            `/projects/${caseStudyProject.id}/data.json`,
                            { signal: controller.signal },
                        );

                        let realImages = supData
                            ? collectAllImages(supData)
                                  .map((img) =>
                                      normalizeProjectImage(caseStudyProject.id, img),
                                  )
                                  .filter(Boolean)
                            : [];
                        const rawCoverImage =
                            supData?.hifi?.images?.[0]?.src ??
                            supData?.solution?.images?.[0]?.src ??
                            supData?.overview?.images?.[0]?.src ??
                            null;

                        if (realImages.length === 0) {
                            realImages = [
                                ...(caseStudyProject.solution?.images || []),
                                ...(caseStudyProject.overview?.images || []),
                            ]
                                .map((img) =>
                                    normalizeProjectImage(caseStudyProject.id, img),
                                )
                                .filter(Boolean);
                        }

                        const previewCandidates = buildPreviewCandidates(
                            caseStudyProject.id,
                            [
                                rawCoverImage,
                                projectMeta.thumbnail,
                                caseStudyProject.media?.thumbnail,
                                caseStudyProject.media?.hero_image,
                                ...realImages.map((img) => img.src),
                            ],
                        );

                        return {
                            ...projectMeta,
                            ...caseStudyProject,
                            hoverPattern: hoverPatterns[index % hoverPatterns.length],
                            allImages: realImages,
                            coverImage: previewCandidates[0] ?? null,
                            previewCandidates,
                            taxonomyTags: buildTaxonomyTags({
                                ...projectMeta,
                                ...caseStudyProject,
                            }),
                            previewVideoSrc: resolveProjectMediaPath(
                                caseStudyProject.id,
                                projectMeta.previewVideo ?? projectMeta.previewVideoSrc ?? null,
                            ),
                            recruiterSummary: toRecruiterSummary({
                                ...projectMeta,
                                ...caseStudyProject,
                            }),
                        };
                    }),
                );

                const standaloneEntries = projectsList.filter((p) =>
                    isStandaloneProject(p.id),
                );

                const standaloneCards = (
                    await Promise.all(
                        standaloneEntries.map(async (entry, i) => {
                            const data = await safeFetchJson(
                                `/projects/${entry.id}/data.json`,
                                { signal: controller.signal },
                            );
                            if (!data) return null;

                            const idx = caseStudyCards.length + i;
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
                                ...entry,
                                ...data,
                                hoverPattern: hoverPatterns[idx % hoverPatterns.length],
                                allImages,
                                coverImage: previewCandidates[0] ?? null,
                                previewCandidates,
                                taxonomyTags: buildTaxonomyTags({
                                    ...entry,
                                    ...data,
                                }),
                                previewVideoSrc: resolveProjectMediaPath(
                                    entry.id,
                                    data?.previewVideo ??
                                        data?.previewVideoSrc ??
                                        data?.video?.src ??
                                        entry.previewVideo ??
                                        entry.previewVideoSrc ??
                                        null,
                                ),
                                recruiterSummary: toRecruiterSummary({
                                    ...entry,
                                    ...data,
                                }),
                            };
                        }),
                    )
                ).filter(Boolean);

                if (!alive) return;
                setProjects([...caseStudyCards, ...standaloneCards]);
                setLoading(false);
            } catch (error) {
                if (error?.name === "AbortError") return;
                console.error("Error loading homepage projects:", error);

                if (!alive) return;
                const fallbackProjects = getAllProjects().map(
                    (caseStudyProject, index) => ({
                        ...caseStudyProject,
                        hoverPattern: hoverPatterns[index % hoverPatterns.length],
                        allImages: [
                            ...(caseStudyProject.solution?.images || []),
                            ...(caseStudyProject.overview?.images || []),
                        ]
                            .map((img) =>
                                normalizeProjectImage(caseStudyProject.id, img),
                            )
                            .filter(Boolean),
                        previewCandidates: buildPreviewCandidates(
                            caseStudyProject.id,
                            [
                                caseStudyProject.media?.thumbnail,
                                caseStudyProject.media?.hero_image,
                                ...(caseStudyProject.solution?.images || []).map(
                                    (img) => img?.src,
                                ),
                                ...(caseStudyProject.overview?.images || []).map(
                                    (img) => img?.src,
                                ),
                            ],
                        ),
                        taxonomyTags: buildTaxonomyTags(caseStudyProject),
                        previewVideoSrc: null,
                        recruiterSummary: toRecruiterSummary(caseStudyProject),
                    }),
                );
                setProjects(fallbackProjects);
                setLoading(false);
            }
        };

        loadProjects();

        return () => {
            alive = false;
            controller.abort();
        };
    }, []);

    useEffect(() => {
        if (!isParked) {
            setShowParkReplay(false);
            return;
        }
        setShowParkReplay(true);
        const t = setTimeout(() => setShowParkReplay(false), 680);
        return () => clearTimeout(t);
    }, [isParked]);

    return (
        <div className="home">
            <main className="home-main page-main">
                <div className="container">
                    <section className="home-hero-passbook" aria-label="Hero and passbook issuance">
                        {/* Hero Section — new modular system
                            To revert: replace <HeroContainer> with <HeroSection /> */}
                        <HeroContainer
                            config={homeHeroConfig}
                            className="home-hero-grid"
                        />

                        {/* Passbook issuance rail — desktop right, mobile below hero */}
                        <aside className="home-passbook-rail" aria-label="Passbook issuance rail">
                            {!isParked || showParkReplay ? (
                                <PassbookPrintCard />
                            ) : (
                                <PassbookDock embedded />
                            )}
                        </aside>
                    </section>

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
                        <section id="home-work-list" aria-label="Selected work list">
                            <HomeWorkList projects={projects} />
                        </section>
                    )}

                </div>
            </main>

            {/* Footer */}
            <footer className="home-footer">
                <div className="container">
                    <div className="footer-body">
                        <div className="footer-intro">
                            <p className="footer-intro-line">
                                Available for thoughtful digital products
                            </p>
                        </div>

                        {/* Links column */}
                        <nav className="footer-nav" aria-label="Footer links">
                            <a href="mailto:leanale003@gmail.com" className="footer-nav-link footer-nav-link--primary">
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
