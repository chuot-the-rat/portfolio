import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./ProjectDetail.css";

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load project data
        fetch("/projects.json")
            .then((res) => res.json())
            .then(async (projectsList) => {
                const projectMeta = projectsList.find((p) => p.id === id);
                if (!projectMeta) {
                    navigate("/");
                    return;
                }

                const response = await fetch(
                    `/${projectMeta.folder}/data.json`,
                );
                const data = await response.json();
                setProject({ ...projectMeta, ...data });
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error loading project:", error);
                navigate("/");
            });
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="project-detail-loading">
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
        );
    }

    if (!project) return null;

    return (
        <div className="project-detail">
            {/* Back Button */}
            <motion.div
                className="project-detail-back"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Link
                    to="/"
                    className="back-button"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                    >
                        <path
                            d="M12 4l-8 6 8 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span>Back</span>
                </Link>
            </motion.div>

            {/* Hero */}
            <motion.section
                className="project-hero"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                <div className="container">
                    <div className="project-hero-meta">
                        <span className="project-tag">{project.category}</span>
                        <span className="project-year">{project.year}</span>
                    </div>

                    <h1 className="project-hero-title">{project.title}</h1>

                    <p className="project-hero-tagline">{project.tagline}</p>

                    {/* Header CTA - Live Site Link */}
                    {project.links?.live && (
                        <motion.a
                            href={project.links.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-cta-link"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            whileHover={{ 
                                y: -2,
                                transition: { duration: 0.2 }
                            }}
                        >
                            <span>Visit Live Site</span>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M6 3h7v7M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </motion.a>
                    )}

                    <div className="project-meta-grid">
                        <div className="project-meta-item">
                            <span className="meta-label">Role</span>
                            <span className="meta-value">{project.role}</span>
                        </div>
                        <div className="project-meta-item">
                            <span className="meta-label">Timeline</span>
                            <span className="meta-value">
                                {project.timeline}
                            </span>
                        </div>
                        <div className="project-meta-item">
                            <span className="meta-label">Team</span>
                            <span className="meta-value">{project.team}</span>
                        </div>
                    </div>

                    {project.tools && project.tools.length > 0 && (
                        <div className="project-tools">
                            {project.tools.map((tool, index) => (
                                <span
                                    key={index}
                                    className="tool-tag"
                                >
                                    {tool}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </motion.section>

            {/* Content Sections */}
            <div className="project-content">
                <div className="container">
                    {/* Overview */}
                    {project.overview && (
                        <Section
                            label="01 — Overview"
                            title={project.overview.title}
                            description={project.overview.description}
                            images={project.overview.images}
                        />
                    )}

                    {/* Research (replaces Problem) */}
                    {project.research && (
                        <Section
                            label="02 — Research"
                            title={project.research.title}
                            description={project.research.description}
                            images={project.research.images}
                        />
                    )}

                    {/* Problem (legacy support) */}
                    {!project.research && project.problem && (
                        <Section
                            label="02 — Problem"
                            title={project.problem.title}
                            description={project.problem.description}
                            images={project.problem.images}
                        />
                    )}

                    {/* Lo-Fi Exploration */}
                    {project.lofi && (
                        <Section
                            label="03 — Lo-Fi Exploration"
                            title={project.lofi.title}
                            description={project.lofi.description}
                            images={project.lofi.images}
                        />
                    )}

                    {/* Iterations & Refinements */}
                    {project.iterations && (
                        <motion.section
                            className="project-section"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="section-label">
                                04 — Iterations
                            </span>
                            <h2 className="section-title">{project.iterations.title}</h2>
                            <p className="section-description">{project.iterations.description}</p>
                            {project.iterations.improvements && (
                                <ul className="objectives-list">
                                    {project.iterations.improvements.map((improvement, index) => (
                                        <motion.li
                                            key={index}
                                            className="objective-item"
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{
                                                duration: 0.4,
                                                delay: index * 0.1,
                                            }}
                                        >
                                            <span className="objective-icon">
                                                ✓
                                            </span>
                                            <span className="objective-text">
                                                {improvement}
                                            </span>
                                        </motion.li>
                                    ))}
                                </ul>
                            )}
                        </motion.section>
                    )}

                    {/* Objectives (legacy support) */}
                    {!project.iterations && project.objectives && project.objectives.length > 0 && (
                        <motion.section
                            className="project-section"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="section-label">
                                03 — Objectives
                            </span>
                            <h2 className="section-title">Goals</h2>
                            <ul className="objectives-list">
                                {project.objectives.map((objective, index) => (
                                    <motion.li
                                        key={index}
                                        className="objective-item"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.4,
                                            delay: index * 0.1,
                                        }}
                                    >
                                        <span className="objective-icon">
                                            ✓
                                        </span>
                                        <span className="objective-text">
                                            {objective}
                                        </span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.section>
                    )}

                    {/* Solution */}
                    {project.solution && (
                        <Section
                            label="05 — Final Solution"
                            title={project.solution.title}
                            description={project.solution.description}
                            images={project.solution.images}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

// Reusable Section Component with Enhanced Micro-Interactions
const Section = ({ label, title, description, images }) => (
    <motion.section
        className="project-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
    >
        <span className="section-label">{label}</span>
        <h2 className="section-title">{title}</h2>
        <p className="section-description">{description}</p>

        {images && images.length > 0 && (
            <div className="section-images">
                {images.map((img, index) => (
                    <motion.div
                        key={index}
                        className="section-image"
                        initial={{
                            opacity: 0,
                            y: 40,
                            rotate: index % 2 === 0 ? -1 : 1,
                        }}
                        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{
                            duration: 0.7,
                            delay: index * 0.12,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        whileHover={{
                            scale: 1.01,
                            rotate: index % 2 === 0 ? 0.5 : -0.5,
                            transition: {
                                duration: 0.4,
                                ease: [0.16, 1, 0.3, 1],
                            },
                        }}
                    >
                        <motion.div
                            className="section-image-overlay"
                            initial={{ opacity: 0 }}
                            whileHover={{
                                opacity: 1,
                                transition: { duration: 0.3 },
                            }}
                        />
                        <img
                            src={img.src}
                            alt={img.alt}
                        />
                    </motion.div>
                ))}
            </div>
        )}
    </motion.section>
);

export default ProjectDetail;
