import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import ProjectCard from "../components/ProjectCard";
import Header from "../components/Header";
import PreviewPanel from "../components/PreviewPanel";
import "./Home.css";

const Home = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredProject, setHoveredProject] = useState(null);

    useEffect(() => {
        // Load projects from JSON
        fetch("/projects.json")
            .then((res) => res.json())
            .then(async (projectsList) => {
                // Load detailed data for each project
                const projectsWithData = await Promise.all(
                    projectsList.map(async (project) => {
                        try {
                            const response = await fetch(
                                `/${project.folder}/data.json`,
                            );
                            const data = await response.json();
                            return {
                                ...project,
                                ...data,
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
                            return project;
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
            <Header />

            <main className="home-main">
                <div className="container">
                    {/* Hero Section */}
                    <motion.section
                        className="home-hero"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <h1 className="home-hero-title">Leana Le</h1>
                        <p className="home-hero-subtitle">
                            UI/UX Designer & Developer creating thoughtful user
                            experiences through research-driven design and clean
                            code.
                        </p>
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
                            <div className="projects-layout">
                                {/* Left: Clean Project Cards */}
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

                                {/* Right: Preview Panel in Whitespace */}
                                <div className="preview-area">
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
