import { motion } from "framer-motion";
import { useState } from "react";
import "./PreviewPanel.css";

/**
 * PreviewPanel - Technical/Cyber Editorial Side-Reveal System
 *
 * Module activation approach:
 * - Slides out horizontally into adjacent whitespace
 * - Sharp clipped masks and motion
 * - Different patterns per project (A, B, C, D)
 * - No soft fades, no card effects, no decorative motion
 * - Opacity starts at ~0.9
 * - Duration: 180-240ms
 * - Easing: cubic-bezier(0.2, 0.8, 0.2, 1)
 *
 * Pattern A: Single large reveal
 * Pattern B: Staggered stack (second delayed ~60ms)
 * Pattern C: Vertical strip (mobile mockup)
 * Pattern D: Video scrub preview
 */

const PreviewPanel = ({ project, hoverPattern = "pattern-a" }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // Gather preview media
    const previewMedia = [
        ...(project.hoverImages || []),
        ...(project.solution?.images?.slice(0, 3) || []),
        ...(project.overview?.images?.slice(0, 1) || []),
    ]
        .filter(Boolean)
        .slice(0, 3);

    // Technical side-reveal - horizontal slide-out with clipping
    const getMediaVariants = (index, pattern) => {
        const baseDelay = pattern === "pattern-b" ? index * 0.06 : 0;

        return {
            hidden: {
                opacity: 0,
                x: 120,
                clipPath: "inset(0 100% 0 0)",
            },
            visible: {
                opacity: 0.9,
                x: 0,
                clipPath: "inset(0 0% 0 0)",
                transition: {
                    duration: pattern === "pattern-c" ? 0.24 : 0.2,
                    delay: baseDelay,
                    ease: [0.2, 0.8, 0.2, 1],
                },
            },
            exit: {
                opacity: 0,
                x: 60,
                clipPath: "inset(0 100% 0 0)",
                transition: {
                    duration: 0.18,
                    ease: [0.2, 0.8, 0.2, 1],
                },
            },
        };
    };

    // Technical positioning - system monitor layout
    const getMediaPosition = (index, pattern) => {
        if (pattern === "pattern-a") {
            // Single large reveal
            return {
                top: "120px",
                right: "60px",
            };
        } else if (pattern === "pattern-b") {
            // Staggered stack
            return {
                top: `${100 + index * 180}px`,
                right: `${40 + index * 30}px`,
            };
        } else if (pattern === "pattern-c") {
            // Vertical strip (mobile)
            return {
                top: "80px",
                right: "80px",
            };
        } else {
            // Pattern D - Video
            return {
                top: "140px",
                right: "50px",
            };
        }
    };

    // Technical sizing based on pattern
    const getMediaSize = (pattern) => {
        if (pattern === "pattern-a") {
            return { width: "520px", height: "auto" };
        } else if (pattern === "pattern-b") {
            return { width: "360px", height: "auto" };
        } else if (pattern === "pattern-c") {
            return { width: "280px", height: "auto" };
        } else {
            return { width: "480px", height: "auto" };
        }
    };

    return (
        <>
            {/* Side-Reveal Media System */}
            {previewMedia.length > 0 ? (
                previewMedia.map((media, index) => {
                    // Only show first image for pattern A, multiple for pattern B
                    if (hoverPattern === "pattern-a" && index > 0) return null;
                    if (hoverPattern === "pattern-c" && index > 0) return null;
                    if (hoverPattern === "pattern-d" && index > 0) return null;

                    const isVideo =
                        hoverPattern === "pattern-d" ||
                        media.type === "video" ||
                        media.src?.endsWith(".mp4");

                    const position = getMediaPosition(index, hoverPattern);
                    const size = getMediaSize(hoverPattern);

                    return (
                        <motion.div
                            key={index}
                            className={`preview-media-reveal ${hoverPattern}`}
                            variants={getMediaVariants(index, hoverPattern)}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            style={{
                                position: "absolute",
                                ...position,
                                ...size,
                                zIndex: 10 + index,
                            }}
                        >
                            {/* Hard edge mask container */}
                            <div className="preview-mask-container">
                                {isVideo ? (
                                    <video
                                        src={media.src || media}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="preview-video"
                                    />
                                ) : (
                                    <img
                                        src={media.src || media}
                                        alt={`${project.title} preview ${index + 1}`}
                                        loading="lazy"
                                        className="preview-image"
                                    />
                                )}
                            </div>

                            {/* System state indicator */}
                            <motion.div
                                className="preview-state-label"
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: hoveredIndex === index ? 0.6 : 0,
                                }}
                                transition={{
                                    duration: 0.18,
                                    ease: [0.2, 0.8, 0.2, 1],
                                }}
                            >
                                {isVideo ? "[video_active]" : "[image_loaded]"}
                            </motion.div>
                        </motion.div>
                    );
                })
            ) : (
                // Fallback: Single thumbnail with pattern A
                <motion.div
                    className={`preview-media-reveal ${hoverPattern}`}
                    variants={getMediaVariants(0, hoverPattern)}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onMouseEnter={() => setHoveredIndex(0)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{
                        position: "absolute",
                        top: "120px",
                        right: "60px",
                        width: "400px",
                        zIndex: 10,
                    }}
                >
                    <div className="preview-mask-container">
                        <img
                            src={project.thumbnail}
                            alt={project.title}
                            loading="lazy"
                            className="preview-image"
                        />
                    </div>

                    <motion.div
                        className="preview-state-label"
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: hoveredIndex === 0 ? 0.6 : 0,
                        }}
                        transition={{
                            duration: 0.18,
                            ease: [0.2, 0.8, 0.2, 1],
                        }}
                    >
                        [fallback_image]
                    </motion.div>
                </motion.div>
            )}
        </>
    );
};

export default PreviewPanel;
