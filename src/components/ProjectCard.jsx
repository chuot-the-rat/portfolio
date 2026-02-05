import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./ProjectCard.css";

/**
 * ProjectCard Component - Minimal, Text-Focused
 *
 * Clean editorial card that triggers external preview panel.
 * No images inside - just typography and subtle hover lift.
 * Designed to work with PreviewPanel for side-by-side layout.
 */

const ProjectCard = ({ project, onHover, onLeave, isHovered }) => {
    return (
        <Link
            to={`/project/${project.id}`}
            className="project-card-link"
        >
            <motion.article
                className="project-card"
                onMouseEnter={onHover}
                onMouseLeave={onLeave}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{
                    y: -4,
                    transition: {
                        duration: 0.3,
                        ease: [0.4, 0, 0.2, 1],
                    },
                }}
            >
                {/* Text Content Only - Minimal & Editorial */}
                <div className="project-card-content">
                    <motion.h3
                        className="project-card-title"
                        animate={{
                            opacity: isHovered ? 1 : 0.8,
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        {project.title}
                    </motion.h3>

                    <motion.div
                        className="project-card-meta"
                        animate={{
                            opacity: isHovered ? 0.9 : 0.6,
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <span className="project-card-category">
                            {project.category}
                        </span>
                        <span className="project-card-separator">•</span>
                        <span className="project-card-year">
                            {project.year}
                        </span>
                    </motion.div>

                    {/* Hover Arrow Indicator */}
                    <motion.div
                        className="project-card-arrow"
                        initial={{ x: -4, opacity: 0 }}
                        animate={{
                            x: isHovered ? 0 : -4,
                            opacity: isHovered ? 1 : 0,
                        }}
                        transition={{
                            duration: 0.3,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                        >
                            <path
                                d="M3 8h10M9 4l4 4-4 4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </motion.div>
                </div>
            </motion.article>
        </Link>
    );
};

export default ProjectCard;
