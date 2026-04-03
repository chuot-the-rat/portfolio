import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    getAllProjects,
    getProjectPath,
    isStandaloneProject,
} from "../utils/projectDataMapper";
import SkillsSection from "../components/SkillsSection";
import EducationSection from "../components/EducationSection";
import HeroContainer from "../components/header/HeroContainer";
import HomeWorkList from "../components/home/HomeWorkList";
import { homeHeroConfig } from "../data/header/headerConfig";
import "./Home.css";
import "../components/SectionLayout.css";

const Home = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

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
