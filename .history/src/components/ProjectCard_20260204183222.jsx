import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";
import "./ProjectCard.css";

/**
 * ProjectCard Component - Minimal, Text-Focused with Cursor-Aware Parallax
 *
 * Clean editorial card that triggers external preview panel.
 * No images inside - just typography and subtle hover lift.
 * Designed to work with PreviewPanel for side-by-side layout.
 * Enhanced with cursor-aware parallax for Jackie Hu-style micro-interactions.
 */

const ProjectCard = ({ project, onHover, onLeave, isHovered }) => {
    const cardRef = useRef(null);

    // Cursor-aware parallax
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring animations for subtle 3D tilt
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [1.5, -1.5]), {
        stiffness: 200,
        damping: 20,
    });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-1.5, 1.5]), {
        stiffness: 200,
        damping: 20,
    });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Normalize to -0.5 to 0.5 for subtle effect
        mouseX.set((e.clientX - centerX) / rect.width);
        mouseY.set((e.clientY - centerY) / rect.height);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
        onLeave();
    };

    return (
        <Link
            to={`/projects/${project.id}`}
            className="project-card-link"
        >
            <motion.article
                ref={cardRef}
                className="project-card"
                onMouseEnter={onHover}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                style={{
                    rotateX,
                    rotateY,
                    transformPerspective: 1200,
                }}
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
