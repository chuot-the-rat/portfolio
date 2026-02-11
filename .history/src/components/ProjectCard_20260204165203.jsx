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
        <Link to={`/project/${project.id}`} className="project-card-link">
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
                {/* Main Thumbnail */}
                <div className="project-card-image-container">
                    <motion.div
                        className="project-card-image-wrapper"
                        animate={{
                            scale: isHovered ? 1.05 : 1,
                        }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <img
                            src={project.thumbnail}
                            alt={project.title}
                            className="project-card-image"
                        />
                    </motion.div>

                    {/* Hover-to-reveal additional images */}
                    {project.hoverImages && project.hoverImages.length > 0 && (
                        <div className="project-card-hover-images">
                            {project.hoverImages.map((img, index) => (
                                <motion.div
                                    key={index}
                                    className="project-card-hover-image"
                                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                    animate={{
                                        opacity: isHovered ? 1 : 0,
                                        y: isHovered ? 0 : 20,
                                        scale: isHovered ? 1 : 0.9,
                                    }}
                                    transition={{
                                        duration: 0.4,
                                        delay: index * 0.1,
                                        ease: [0.4, 0, 0.2, 1],
                                    }}
                                    style={{
                                        zIndex: 10 + index,
                                    }}
                                >
                                    <img
                                        src={img.src}
                                        alt={
                                            img.alt ||
                                            `${project.title} detail ${index + 1}`
                                        }
                                    />
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Gradient overlay on hover */}
                    <motion.div
                        className="project-card-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 0.1 : 0 }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                {/* Text Content - Fades/slides in on hover */}
                <div className="project-card-content">
                    <motion.div
                        initial={{ opacity: 0.7, y: 0 }}
                        animate={{
                            opacity: isHovered ? 1 : 0.7,
                            y: isHovered ? -2 : 0,
                        }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <h3 className="project-card-title">{project.title}</h3>
                    </motion.div>

                    <motion.div
                        className="project-card-meta"
                        initial={{ opacity: 0.5 }}
                        animate={{
                            opacity: isHovered ? 0.8 : 0.5,
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

                    {/* Hover indicator */}
                    <motion.div
                        className="project-card-arrow"
                        initial={{ x: -4, opacity: 0 }}
                        animate={{
                            x: isHovered ? 0 : -4,
                            opacity: isHovered ? 1 : 0,
                        }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
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
