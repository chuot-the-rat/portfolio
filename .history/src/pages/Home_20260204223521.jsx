import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useMode } from "../context/ModeContext";
import ProjectCard from "../components/ProjectCard";
import PreviewPanel from "../components/PreviewPanel";
import ModeSwitcher from "../components/ModeSwitcher";
import SkillsSection from "../components/SkillsSection";
import EducationSection from "../components/EducationSection";
import ContactSection from "../components/ContactSection";
import "./Home.css";
import "./Home-work-mode.css";
import "../components/SectionLayout.css";
import "../components/ProjectCard-work-mode.css";
import "../components/PreviewPanel-work-mode.css";
import "../components/SkillsSection-work-mode.css";
import "../components/EducationSection-work-mode.css";
import "../components/ContactSection-work-mode.css";

const Home = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredProject, setHoveredProject] = useState(null);
    const { mode } = useMode();

    // Assign hover patterns to projects
    const hoverPatterns = ["pattern-a", "pattern-b", "pattern-c", "pattern-d"];

    useEffect(() => {
        // Load projects from JSON
        fetch("/projects.json")
            .then((res) => res.json())
            .then(async (projectsList) => {
                // Load detailed data for each project
                const projectsWithData = await Promise.all(
                    projectsList.map(async (project, index) => {
                        try {
                            const response = await fetch(
                                `/${project.folder}/data.json`,
                            );
                            const data = await response.json();
                            return {
                                ...project,
                                ...data,
                                // Assign hover pattern based on index
                                hoverPattern: hoverPatterns[index % hoverPatterns.length],
                                // Extract hover images from solution or overview sections
                                hoverImages: [
                                    ...(data.solution?.images?.slice(1, 3) ||
                                        []),
                                    ...(data.overview?.images?.slice(1, 2) ||
                                        []),
                                ].filter(Boolean),
                            };
                        } catch (error) {
                            console.error(
                                `Error loading project ${project.id}:`,
                                error,
                            );
                            return {
                                ...project,
                                hoverPattern: hoverPatterns[index % hoverPatterns.length],
                            };
                        }
                    }),
                );
                setProjects(projectsWithData);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error loading projects:", error);
                setLoading(false);
            });
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
                        <div className="hero-content">
                            <h1 className="home-hero-title">Leana Le</h1>
                            <p className="home-hero-subtitle">
                                UI/UX Designer & Developer creating thoughtful
                                user experiences through research-driven design
                                and clean code.
                            </p>
                        </div>

                        <motion.div
                            className="hero-ctas"
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
                                href="/resume.pdf"
                                download
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
                    </motion.section>

                    {/* Projects Grid */}
                    <section className="home-projects">
                        <motion.div
                            className="home-projects-header"
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
                                {/* Clean Project Cards */}
                                <div className="projects-list">
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
                                            />
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Absolute Positioned Preview Area - Free-Floating Media */}
                                <div className="preview-area-absolute">
                                    <AnimatePresence mode="wait">
                                        {hoveredProject && (
                                            <PreviewPanel
                                                key={hoveredProject.id}
                                                project={hoveredProject}
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
