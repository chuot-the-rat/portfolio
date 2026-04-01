import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getProjectPath } from "../utils/projectDataMapper";
import "./ProjectList.css";

export default function ProjectList({ projects = [] }) {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
            },
        },
    };

    return (
        <motion.div
            className="project-list"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
        >
            {projects.map((project) => (
                <motion.div key={project.id} variants={itemVariants}>
                    <Link
                        to={getProjectPath(project.id)}
                        className="project-card-link"
                    >
                        <div className="project-card">
                            {/* Header: Category + Year */}
                            <div className="project-card-meta">
                                <span className="project-category">
                                    {project.category}
                                </span>
                                <span className="project-dot">·</span>
                                <span className="project-year">
                                    {project.year}
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className="project-title">{project.title}</h3>

                            {/* Subtitle/Description */}
                            {(project.subtitle || project.tagline) && (
                                <p className="project-description">
                                    {project.subtitle || project.tagline}
                                </p>
                            )}

                            {/* Arrow indicator */}
                            <div className="project-arrow">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M4 10H16M16 10L12 6M16 10L12 14"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </motion.div>
    );
}
