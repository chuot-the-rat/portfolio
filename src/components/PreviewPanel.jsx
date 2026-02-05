import { motion } from "framer-motion";
import "./PreviewPanel.css";

/**
 * PreviewPanel - Jackie Hu Free-Floating Media
 *
 * Media exists directly in whitespace - no containers, cards, or backgrounds.
 * Snappy, confident motion. Intentional positioning.
 *
 * Design Philosophy:
 * - Media floats freely in space, not boxed
 * - Quick, confident animations
 * - Absolute positioning for intentional layout
 * - Support images and videos
 * - Prevent accidental overlap
 */

const PreviewPanel = ({ project }) => {
    // Determine layout type
    const layoutType =
        project.previewLayout ||
        (project.category?.toLowerCase().includes("mobile")
            ? "mobile"
            : project.category?.toLowerCase().includes("web")
              ? "desktop"
              : "mixed");

    // Gather preview media (images and videos)
    const previewMedia = [
        ...(project.hoverImages || []),
        ...(project.solution?.images?.slice(0, 3) || []),
        ...(project.overview?.images?.slice(0, 1) || []),
    ]
        .filter(Boolean)
        .slice(0, 3); // Max 3 items to prevent overlap

    // Snappy pop-out animation - fast and confident
    const getMediaVariants = (index) => ({
        hidden: {
            opacity: 0,
            x: 60 + index * 10,
            y: -20 + index * 15,
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                duration: 0.25, // Snappy
                delay: index * 0.08,
                ease: [0.2, 0, 0.2, 1],
            },
        },
        exit: {
            opacity: 0,
            x: 30,
            transition: {
                duration: 0.2, // Fast exit
                ease: [0.2, 0, 0.2, 1],
            },
        },
    });

    // Intentional positioning per layout type
    const getMediaPosition = (index, total) => {
        if (layoutType === "mobile") {
            return {
                top: `${40 + index * 180}px`,
                right: `${60 + (index % 2) * 40}px`,
            };
        } else if (layoutType === "desktop") {
            return {
                top: `${80 + index * 220}px`,
                right: "40px",
            };
        } else {
            // Mixed: intentional composition
            const positions = [
                { top: "60px", right: "80px" },
                { top: "280px", right: "40px" },
                { top: "140px", right: "340px" },
            ];
            return positions[index] || positions[0];
        }
    };

    return (
        <>
            {/* Free-Floating Media - No Container */}
            {previewMedia.length > 0 ? (
                previewMedia.map((media, index) => {
                    const isVideo =
                        media.type === "video" || media.src?.endsWith(".mp4");
                    const position = getMediaPosition(
                        index,
                        previewMedia.length,
                    );

                    // Size based on layout
                    const size =
                        layoutType === "mobile"
                            ? { width: "200px", height: "auto" }
                            : layoutType === "desktop"
                              ? { width: "380px", height: "auto" }
                              : index === 0
                                ? { width: "320px", height: "auto" }
                                : { width: "240px", height: "auto" };

                    return (
                        <motion.div
                            key={index}
                            className="preview-media-float"
                            variants={getMediaVariants(index)}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            style={{
                                position: "absolute",
                                ...position,
                                ...size,
                                zIndex: 10 + index,
                            }}
                        >
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
                                    alt={
                                        media.alt ||
                                        `${project.title} preview ${index + 1}`
                                    }
                                    loading="lazy"
                                    className="preview-image"
                                />
                            )}
                        </motion.div>
                    );
                })
            ) : (
                // Fallback: Single thumbnail
                <motion.div
                    className="preview-media-float"
                    variants={getMediaVariants(0)}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{
                        position: "absolute",
                        top: "80px",
                        right: "60px",
                        width: "340px",
                        zIndex: 10,
                    }}
                >
                    <img
                        src={project.thumbnail}
                        alt={project.title}
                        loading="lazy"
                        className="preview-image"
                    />
                </motion.div>
            )}
        </>
    );
};

export default PreviewPanel;
