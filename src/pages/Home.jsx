import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { usePageTitle } from "../hooks/usePageTitle";
import { Link } from "react-router-dom";
import { getAllProjects } from "../utils/projectDataMapper";
import {
    buildEnrichedProjectUpdates,
    buildInitialProjectCards,
    HOME_ENRICHMENT_IMAGE_SECTIONS,
    mergeProjectUpdatesById,
    safeFetchJson,
    scheduleIdleTask,
} from "../utils/projectListViewModel";
import HeroContainer from "../components/header/HeroContainer";
import HomeWorkList from "../components/home/HomeWorkList";
import PassbookPrintCard from "../components/passbook/PassbookPrintCard";
import PassbookDock from "../components/passbook/PassbookDock";
import { usePassbook } from "../components/passbook/PassbookProvider";
import { homeHeroConfig } from "../data/header/headerConfig";
import "./Home.css";
import "../components/SectionLayout.css";

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

const Home = () => {
    const { isParked } = usePassbook();
    usePageTitle(null, {
        description:
            "UI/UX and product designer in Vancouver. Case studies with clear role ownership, research-backed decisions, and measurable outcomes.",
        path: "/",
        structuredData: HOME_SCHEMA,
    });
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showParkReplay, setShowParkReplay] = useState(false);

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
                        caseStudyImageSections: HOME_ENRICHMENT_IMAGE_SECTIONS,
                        standaloneImageSections: ["overview", "solution", "styleGuide"],
                    });

                    if (!alive) return;
                    if (updates.length === 0) return;

                    setProjects((currentProjects) =>
                        mergeProjectUpdatesById(currentProjects, updates),
                    );
                });
            } catch (error) {
                if (error?.name === "AbortError") return;
                console.error("Error loading homepage projects:", error);

                if (!alive) return;
                const { cards: fallbackProjects } = buildInitialProjectCards({
                    caseStudyProjects: getAllProjects(),
                    projectsList: [],
                    includeHoverPattern: true,
                    includeTaxonomyTags: true,
                    seedImageSections: ["solution", "overview"],
                });
                setProjects(fallbackProjects);
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
                                <span className="footer-nav-label-wrap">
                                    <span className="footer-nav-icon" aria-hidden="true">
                                        <svg viewBox="0 0 24 24" focusable="false">
                                            <rect x="3" y="6" width="18" height="12" rx="2" />
                                            <path d="M4 7.5 12 13l8-5.5" />
                                        </svg>
                                    </span>
                                    <span className="footer-nav-label">Email</span>
                                </span>
                                <span className="footer-nav-arrow">↗</span>
                            </a>
                            <a
                                href="https://linkedin.com/in/leanale"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-nav-link"
                            >
                                <span className="footer-nav-label-wrap">
                                    <span className="footer-nav-icon" aria-hidden="true">
                                        <svg viewBox="0 0 24 24" focusable="false">
                                            <rect x="4" y="4" width="16" height="16" rx="2" />
                                            <path d="M8 11v5M8 8h.01M12 16v-3.5a2 2 0 0 1 4 0V16" />
                                        </svg>
                                    </span>
                                    <span className="footer-nav-label">LinkedIn</span>
                                </span>
                                <span className="footer-nav-arrow">↗</span>
                            </a>
                            <a
                                href="https://github.com/chuot-the-rat"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-nav-link"
                            >
                                <span className="footer-nav-label-wrap">
                                    <span className="footer-nav-icon" aria-hidden="true">
                                        <svg viewBox="0 0 24 24" focusable="false">
                                            <path d="M9 18c-3 1-3-1.5-4-2m8 4v-3a3.2 3.2 0 0 0-.9-2.5c3-.35 6.2-1.45 6.2-6.6a5.1 5.1 0 0 0-1.3-3.5 4.8 4.8 0 0 0-.08-3.45s-1.05-.35-3.45 1.3a11.9 11.9 0 0 0-6.3 0C4.75.95 3.7 1.3 3.7 1.3a4.8 4.8 0 0 0-.08 3.45A5.1 5.1 0 0 0 2.3 8.2c0 5.1 3.1 6.25 6.2 6.6A3.2 3.2 0 0 0 7.6 17.3V20" />
                                        </svg>
                                    </span>
                                    <span className="footer-nav-label">GitHub</span>
                                </span>
                                <span className="footer-nav-arrow">↗</span>
                            </a>
                            <Link to="/about#resume" className="footer-nav-link">
                                <span className="footer-nav-label-wrap">
                                    <span className="footer-nav-icon" aria-hidden="true">
                                        <svg viewBox="0 0 24 24" focusable="false">
                                            <path d="M8 8h8M8 12h8M8 16h5" />
                                            <rect x="5" y="4" width="14" height="16" rx="2" />
                                        </svg>
                                    </span>
                                    <span className="footer-nav-label">Resume</span>
                                </span>
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
