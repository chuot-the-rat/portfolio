import { motion } from "framer-motion";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import { useProjectCards } from "../hooks/useProjectCards";
import HeroContainer from "../components/header/HeroContainer";
import HomeWorkList from "../components/home/HomeWorkList";
import { resume } from "../data/resume";
import "./Projects.css";

export default function Projects() {
    usePageTitle(null, {
        path: "/projects",
        description:
            "Selected product design case studies and visual design projects with clear role ownership, practical outcomes, and shipped work.",
    });

    const { loading, projects } = useProjectCards();

    const heroConfig = useMemo(() => ({
        layout: "full-left",
        minHeight: "35vh",
        text: {
            descriptor: "Selected Work",
            headline: loading ? "Projects" : `${projects.length} ${projects.length === 1 ? "project" : "projects"}`,
            headlineAs: "h1",
            subline: "Case studies and design projects with clear role ownership and practical outcomes.",
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
                <div className="container">
                    <HeroContainer config={heroConfig} className="projects-hero-grid" />
                    <section className="projects-conversion-row" aria-label="Primary contact actions">
                        <p className="projects-conversion-text">
                            Hiring for product design? I can walk you through role scope and shipped outcomes.
                        </p>
                        <div className="projects-conversion-actions">
                            <a href="mailto:leanale003@gmail.com" className="projects-conversion-link projects-conversion-link--primary">
                                Email
                            </a>
                            <Link to={resume.sectionPath} className="projects-conversion-link">
                                Resume
                            </Link>
                        </div>
                    </section>

                    <section className="projects-work-shell" aria-label="Project listing">
                        {loading ? (
                            <div className="projects-loading">
                                <motion.div
                                    className="projects-spinner"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                            </div>
                        ) : (
                            <HomeWorkList projects={projects} />
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
